"""Reproducible SECOM quality forecasting exercise; no test-set model selection."""
from pathlib import Path
import sys
SCRIPT_DIR = Path(__file__).resolve().parent
BASE = SCRIPT_DIR.parent
import csv, json, hashlib, warnings, platform, shutil
from datetime import datetime
import numpy as np
import scipy, pandas as pd, statsmodels
from scipy.special import expit
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf
from statsmodels.stats.diagnostic import acorr_ljungbox

OUT = BASE / '03_导出文件' / '重新运行结果'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = BASE / '01_原始数据' / 'secom_labels.data'
N, SPLIT = 20, 62

def plain(v):
    if isinstance(v, dict): return {str(k): plain(x) for k,x in v.items()}
    if isinstance(v, (tuple,list)): return [plain(x) for x in v]
    if isinstance(v, np.ndarray): return plain(v.tolist())
    if isinstance(v, (np.integer,)): return int(v)
    if isinstance(v, (np.floating,)): return float(v) if np.isfinite(v) else None
    return v

records=[]
for row,line in enumerate(SOURCE.read_text().splitlines(),1):
    tag,stamp=line.split(' ',1)
    date=datetime.strptime(stamp.strip('"'), '%d/%m/%Y %H:%M:%S')
    records.append({'id':row, 'originalRow':row, 'time':date.isoformat(sep=' '), 'fail':int(tag=='1')})
records.sort(key=lambda r:r['time']) # Python sort is stable for equal timestamps.
for rank,r in enumerate(records,1): r['sequence']=rank
groups=[]
for i in range(len(records)//N):
    rs=records[i*N:(i+1)*N]; x=sum(r['fail'] for r in rs)
    groups.append({'id':i+1,'n':N,'fail':x,'pass':N-x,'rate':x/N,
                   'start':rs[0]['time'],'end':rs[-1]['time'],
                   'recordIds':[r['id'] for r in rs], 'sequenceStart':i*N+1,
                   'sequenceEnd':(i+1)*N,'partition':'train' if i<SPLIT else 'test'})
y=np.array([g['rate'] for g in groups])
x=np.array([g['fail'] for g in groups])
z=np.log((x+.5)/(N-x+.5))

def fit_one(values,order):
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        fit=ARIMA(values,order=tuple(order),trend='c' if order[1]==0 else 'n',
                  enforce_stationarity=True,enforce_invertibility=True).fit(
                      method_kwargs={'maxiter':500})
    return fit,[str(w.message) for w in caught]

def choose(values):
    rows=[]; fits={}
    for d in (0,1):
        for p in range(3):
            for q in range(3):
                order=(p,d,q)
                try:
                    fit,notes=fit_one(values,order)
                    k=len(fit.params); neff=len(values)-d
                    aicc=fit.aic+2*k*(k+1)/(neff-k-1)
                    converged=bool(fit.mle_retvals.get('converged',True))
                    valid=converged and np.isfinite(aicc)
                    rows.append({'p':p,'d':d,'q':q,'order':str(order), 'aic':float(fit.aic),
                                 'aicc':float(aicc),'parameters':k,'nEffective':neff,
                                 'converged':converged,'eligible':bool(valid),'warnings':'; '.join(notes)})
                    if valid:fits[order]=fit
                except Exception as e:
                    rows.append({'p':p,'d':d,'q':q,'order':str(order),'aic':None,'aicc':None,
                                 'converged':False,'eligible':False,'warnings':str(e)})
    valid=sorted((r for r in rows if r['eligible']),key=lambda r:(r['aicc'],r['parameters'],r['p'],r['q']))
    if not valid: raise RuntimeError('No converged candidate')
    best=valid[0]; order=(best['p'],best['d'],best['q'])
    return order,fits[order],rows

def inverse(value):
    # Exact inverse of the .5 continuity-corrected transformation on rate scale.
    return np.clip(((N+1)*expit(value)-.5)/N,0,1)

def evaluate(start,order):
    rows=[]
    for i in range(start,len(y)):
        fit,notes=fit_one(z[:i],order)
        if not fit.mle_retvals.get('converged',True):
            raise RuntimeError(f'Rolling fit did not converge at group {i+1}')
        f=fit.get_forecast(steps=1)
        mu=float(f.predicted_mean[0]);ci=np.asarray(f.conf_int(alpha=.05))[0]
        rows.append({'group':i+1,'observed':float(y[i]),'fail':int(x[i]),'n':N,
                     'arima':float(inverse(mu)), 'arimaLower':float(inverse(ci[0])),
                     'arimaUpper':float(inverse(ci[1])),
                     'historicalMean':float(y[:i].mean()),'recent5Mean':float(y[i-5:i].mean()),
                     'historyGroups':i,'transformedPrediction':mu,'warnings':'; '.join(notes)})
    metrics={}
    for key in ('historicalMean','recent5Mean','arima'):
        err=np.array([r[key]-r['observed'] for r in rows])*100
        metrics[key]={'maePP':float(np.mean(np.abs(err))), 'rmsePP':float(np.sqrt(np.mean(err**2))),
                      'biasPP':float(np.mean(err)), 'n':len(rows)}
    return rows,metrics

order,fit,candidates=choose(z[:SPLIT])
predictions,metrics=evaluate(SPLIT,order)
# Secondary check: only initial-training data, independently choose order on first 42.
# It is reported as context and never used to modify primary 62/16 model selection.
full_y,full_z,full_x=y,z,x
y,z,x=y[:SPLIT],z[:SPLIT],x[:SPLIT]
inner_order,inner_fit,inner_candidates=choose(z[:42])
inner_predictions,inner_metrics=evaluate(42,inner_order)
y,z,x=full_y,full_z,full_x
adf=adfuller(z[:SPLIT],maxlag=5,autolag='AIC',regression='c')
resid=np.asarray(fit.resid)[order[1]:]
lb=acorr_ljungbox(resid,lags=[5,10],model_df=order[0]+order[2],return_df=True)
rho=acf(z[:SPLIT],nlags=10,fft=False)
datecounts=pd.Series([r['time'][:10] for r in records]).value_counts()
best=min(metrics,key=lambda key:metrics[key]['maePP'])
summary={
 'source':{'name':'UCI SECOM','url':'https://archive.ics.uci.edu/dataset/179/secom',
           'download':'https://archive.ics.uci.edu/static/public/179/secom.zip',
           'license':'CC BY 4.0','file':'secom_labels.data','sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest()},
 'nRecords':len(records),'nFailures':sum(r['fail'] for r in records),
 'overallRate':sum(r['fail'] for r in records)/len(records),
 'start':records[0]['time'],'end':records[-1]['time'],
 'daysWithRecords':len(datecounts),'dailyMin':int(datecounts.min()),'dailyMax':int(datecounts.max()),
 'groupSize':N,'nGroups':len(groups),'usedRecords':len(groups)*N,
 'usedFailures':sum(g['fail'] for g in groups), 'tailRecords':len(records)%N,
 'tailFailures':sum(r['fail'] for r in records[len(groups)*N:]),
 'zeroFailureGroups':int(np.sum(x==0)), 'trainGroups':SPLIT,'testGroups':len(groups)-SPLIT,
 'trainFailures':int(x[:SPLIT].sum()),'testFailures':int(x[SPLIT:].sum()),
 'trainRate':float(y[:SPLIT].mean()),'testRate':float(y[SPLIT:].mean()),
 'order':list(order), 'modelLabel':f'ARIMA({order[0]},{order[1]},{order[2]})',
 'trainingAICc':next(r['aicc'] for r in candidates if (r['p'],r['d'],r['q'])==order),
 'modelParams':dict(zip(fit.param_names,map(float,fit.params))),
 'metrics':metrics,'bestByMAE':best,
 'bestByRMSE':min(metrics,key=lambda key:metrics[key]['rmsePP']),
 'arimaIntervalCoverage':sum(r['arimaLower']<=r['observed']<=r['arimaUpper'] for r in predictions)/len(predictions),
 'arimaVsHistoricalMAEChangePct':(metrics['arima']['maePP']/metrics['historicalMean']['maePP']-1)*100,
 'diagnostics':{'adfStatistic':float(adf[0]),'adfP':float(adf[1]),'adfLag':int(adf[2]),
                'acf':rho.tolist(),'ljungBox':lb.reset_index(names='lag').to_dict(orient='records')},
 'innerTrainingCheck':{'fitGroups':42,'evaluationGroups':20,'order':list(inner_order),
                       'metrics':inner_metrics,'note':'Only first 62 groups; not used to choose the primary model.'},
 'software':{'python':platform.python_version(),'numpy':np.__version__,'pandas':pd.__version__,
             'scipy':scipy.__version__,'statsmodels':statsmodels.__version__},
 'method':{'sort':'timestamp ascending, stable original row order within ties',
           'grouping':'non-overlapping groups of 20 observed records; observation index, not equal calendar intervals',
           'transform':'z = log((failures+0.5)/(20-failures+0.5))',
           'inverse':'clip(((21*expit(z))-0.5)/20, 0, 1)',
           'pointForecast':'Inverse-transformed Gaussian forecast mean; median on transformed-back rate scale, not predictive mean.',
           'interval':'95% model prediction interval transformed back to rate scale; approximate, not binomial exact interval.',
           'selection':'18 candidates p,q=0..2 and d=0/1; lowest initial-training AICc among converged fits. d=0 includes constant, d=1 no drift.',
           'aicc':'AIC+2*k*(k+1)/(n-d-k-1), k includes variance',
           'validation':'Fixed order selected once on first62; refit parameters before each of last16 one-step predictions.',
           'baseline':'Expanding raw-rate mean and previous5 raw-rate mean with identical information cutoff.'}}
payload={'summary':summary,'records':records,'groups':groups,'predictions':predictions,
         'candidates':candidates,'innerPredictions':inner_predictions,
         'forecasts':[{'group':r['group'],'actual':r['observed'],'arima':r['arima'],
                       'historical':r['historicalMean'],'recent':r['recent5Mean'],
                       'lower':r['arimaLower'],'upper':r['arimaUpper']} for r in predictions]}
(OUT/'analysis.json').write_text(json.dumps(plain(payload),ensure_ascii=False,indent=2),encoding='utf-8')
pd.DataFrame(records).to_csv(OUT/'检测记录.csv',index=False,encoding='utf-8-sig')
pd.DataFrame([{k:v for k,v in g.items() if k!='recordIds'} for g in groups]).to_csv(OUT/'78组统计.csv',index=False,encoding='utf-8-sig')
pd.DataFrame(predictions).to_csv(OUT/'16组滚动预测.csv',index=False,encoding='utf-8-sig')
pd.DataFrame(candidates).sort_values('aicc').to_csv(OUT/'训练集模型比较.csv',index=False,encoding='utf-8-sig')
pd.DataFrame(inner_predictions).to_csv(OUT/'训练期内部检验.csv',index=False,encoding='utf-8-sig')
print(json.dumps(plain(summary),ensure_ascii=False,indent=2))

names={'historicalMean':'历史累计平均','recent5Mean':'前5组平均','arima':summary['modelLabel']}
metriclines='\n'.join(f"| {names[k]} | {v['maePP']:.3f} | {v['rmsePP']:.3f} | {v['biasPP']:.3f} |" for k,v in metrics.items())
top=sorted((r for r in candidates if r['eligible']),key=lambda r:r['aicc'])[:5]
toplines='\n'.join(f"| ARIMA{r['order']} | {r['aicc']:.3f} | {r['parameters']} |" for r in top)
report=f'''# SECOM质量预测分析结果与复现说明

## 研究问题与结论

研究问题：前面各组的检测不合格率，能否帮助预测下一组20条记录的不合格率？

初始62组中，按AICc选出的模型是 **{summary['modelLabel']}**。后16组逐组检验中，MAE最低的是 **{names[best]}**。ARIMA的MAE为 **{metrics['arima']['maePP']:.3f}个百分点**，历史累计平均为 **{metrics['historicalMean']['maePP']:.3f}个百分点**。ARIMA相对历史平均的MAE变化为 **{summary['arimaVsHistoricalMAEChangePct']:+.2f}%**（负值为误差降低）。这是16次预测的描述性比较，不作统计显著性或未来稳定收益判断。

**另一个指标给出了重要补充：ARIMA的RMSE为{metrics['arima']['rmsePP']:.3f}个百分点，高于历史平均的{metrics['historicalMean']['rmsePP']:.3f}。** 典型例子是第67组：实际不合格率25%，ARIMA预测约3.61%。因此，课堂结论应为“ARIMA在本次检验中的平均绝对误差略低，但对较大波动的预测仍然有限”，不能笼统宣称全面优于简单方法。

## 数据核查

- 来源：[UCI SECOM](https://archive.ics.uci.edu/dataset/179/secom)，原始标签文件 secom_labels.data，CC BY 4.0。
- 共{len(records)}条记录，{summary['nFailures']}条失败，样本总体不合格率{summary['overallRate']*100:.4f}%。
- 时间范围：{summary['start']} 至 {summary['end']}。
- 有记录的日期{summary['daysWithRecords']}天，每日记录数{summary['dailyMin']}—{summary['dailyMax']}。
- 按时间稳定排序，时间相同按原文件行序排列。连续20条一个组，共78组、1560条，失败{summary['usedFailures']}条。
- 最后7条未组成完整组，其中失败{summary['tailFailures']}条。仍计入总体描述，未进入分组建模。
- 78组中有{summary['zeroFailureGroups']}组无失败。
- 训练：前62组，1240条，失败{summary['trainFailures']}条，不合格率{summary['trainRate']*100:.4f}%。
- 检验：后16组，320条，失败{summary['testFailures']}条，不合格率{summary['testRate']*100:.4f}%。

分析组是人为划分的等记录数组，不是已知的工厂生产批次。序列间隔以20条观察记录计，并非固定日历时间。数据未公开完整抽样设计，结果描述这份数据，不能直接外推为整条生产线的总体质量水平。

全样本6.64%仅用于描述性图表的参考线。预测比较中的历史平均每一步只使用当时已观察到的记录，并未使用这条全样本参考线。

## 模型与检验方法

1. 对每组失败数x，使用连续性修正的logit变换：z=log((x+0.5)/(20-x+0.5))。这样零失败组也能建模。
2. 比较18个候选：p、q各取0、1、2，d取0、1。d=0带常数，d=1不带漂移。启用平稳性及可逆性约束。
3. 仅使用前62组选择模型。AICc=AIC+2k(k+1)/(n-d-k-1)，k含方差参数。仅收敛且AICc有限的模型有资格入选。固定选中阶数，后续每一步仅重新估计参数。
4. 对后16组进行向前一步滚动预测：第63组只用前62组；看到第63组实际结果后，才将它加入历史以预测第64组。一直到第78组。
5. 预测逆变换为 clip((21×expit(z)-0.5)/20,0,1)。这是对模型变换尺度均值的单调逆变换，可解释为还原尺度的模型中位数点预测，不是经积分校正的预测均值。
6. 所附上下限为95%模型预测区间的单调逆变换，属于近似区间，不是二项分布精确区间。
7. 两个对照分别使用当时可用的全部历史原始不合格率均值，以及前5组原始不合格率均值。没有对照方法获得未来数据。
8. MAE与RMSE均在原始不合格率尺度计算，用百分点呈现。MAE即16次预测绝对偏差的平均值。

## 检验结果

| 方法 | MAE（百分点） | RMSE（百分点） | 平均偏差（百分点） |
|---|---:|---:|---:|
{metriclines}

## 初始训练集候选模型前五名

| 模型 | AICc | 参数个数 |
|---|---:|---:|
{toplines}

训练序列变换后ADF统计量{adf[0]:.4f}，p={adf[1]:.6f}，自动选择滞后{adf[2]}。训练序列一阶自相关{rho[1]:.4f}。ADF检验及自相关仅用于了解训练序列，最终阶数按预设候选范围和训练AICc选择。

残差Ljung–Box诊断（自由度扣除p+q）如下：

{lb.to_string()}

## 训练期内部检查

另在最初62组内部，使用前42组独立选择模型，再滚动检验第43—62组。所选阶数为ARIMA{inner_order}。该检查用于观察方法在训练期的表现，没有根据它改变主分析的62/16划分或挑选最终测试结果。

历史平均 MAE {inner_metrics['historicalMean']['maePP']:.3f}，前5组平均 MAE {inner_metrics['recent5Mean']['maePP']:.3f}，ARIMA MAE {inner_metrics['arima']['maePP']:.3f}，单位均为百分点。

## 管理解释

分析把历史检测结果转为可检验的下一组预测，并通过简单方法对照评价复杂模型是否值得使用。根据本次结果选择与证据一致的课堂结论。若需要制定检验强度、停线或放行标准，还需结合完整抽样规则、过程信息和错误决策成本。本分析未估计工艺参数影响，也未识别不合格的原因。

## 文件与复现

- 检测记录.csv：全部1567条记录，包含原文件行号、稳定排序后的序号、时间和失败标签。
- 78组统计.csv：完整分析组。
- 16组滚动预测.csv：真实值、三种预测值和模型区间。
- 训练集模型比较.csv：全部18个候选及收敛状态。
- 训练期内部检验.csv：前62组内部的检查。
- analysis.json：网站可使用的同源数据，所有比例以0—1储存。
- 复现脚本：02_导入文件/run_analysis.py。使用06_安装文件中的环境安装脚本配置依赖。
- 软件：{json.dumps(summary['software'],ensure_ascii=False)}。
- 原始文件SHA-256：{summary['source']['sha256']}。

检测标签对应真实公开记录。网站中的芯片外形及位置是教学示意，数据没有给出晶圆空间位置。
'''
(OUT/'结果说明.md').write_text(report,encoding='utf-8')

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams.update({'font.family':'Microsoft YaHei','axes.unicode_minus':False,
                         'font.size':11,'axes.spines.top':False,'axes.spines.right':False,
                         'svg.fonttype':'none','figure.facecolor':'#f4f7f9','axes.facecolor':'#f4f7f9'})
    chartdir=OUT/'图表';chartdir.mkdir(exist_ok=True)
    fig,ax=plt.subplots(figsize=(12,4.4));ax.plot(np.arange(1,79),y*100,color='#187f91',lw=1.8,marker='o',ms=3)
    ax.axvspan(62.5,78.5,color='#dce8ef',alpha=.8);ax.axvline(62.5,color='#577386',ls='--');ax.axhline(summary['overallRate']*100,color='#e49a42',ls='--',label=f"全样本比例 {summary['overallRate']*100:.2f}%")
    ax.set(xlabel='分析组序号（每组20条）',ylabel='不合格率（%）',xlim=(1,79),ylim=(0,max(y)*100+3));ax.text(17,ax.get_ylim()[1]-2,'初始训练：第1—62组',color='#29475a');ax.text(64,ax.get_ylim()[1]-2,'检验：63—78组',color='#29475a',fontsize=10);ax.grid(axis='y',alpha=.15);ax.legend(frameon=False,loc='upper left');fig.tight_layout()
    for ext in ('png','svg'):fig.savefig(chartdir/f'01_78组质量波动.{ext}',dpi=180)
    plt.close(fig)
    fig,ax=plt.subplots(figsize=(12,4.4));xx=np.array([r['group'] for r in predictions]);ax.plot(xx,[r['observed']*100 for r in predictions],color='#17384f',marker='o',lw=2,label='实际值');ax.plot(xx,[r['arima']*100 for r in predictions],color='#ef8459',marker='o',lw=2,label=summary['modelLabel']);ax.plot(xx,[r['historicalMean']*100 for r in predictions],color='#187f91',lw=1.8,ls='--',label='历史累计平均');ax.plot(xx,[r['recent5Mean']*100 for r in predictions],color='#9b87c9',lw=1.4,ls=':',label='前5组平均');ax.set(xlabel='检验组序号',ylabel='不合格率（%）',xticks=xx,xlim=(62.5,78.5),ylim=(0,max(r['observed'] for r in predictions)*100+3));ax.legend(frameon=False,ncol=4,loc='upper center');ax.grid(axis='y',alpha=.15);fig.tight_layout()
    for ext in ('png','svg'):fig.savefig(chartdir/f'02_检验预测对比.{ext}',dpi=180)
    plt.close(fig)
    fig,ax=plt.subplots(figsize=(9,3.6));keys=['historicalMean','recent5Mean','arima'];values=[metrics[k]['maePP'] for k in keys];bars=ax.barh([names[k] for k in keys],values,color=['#187f91','#9b87c9','#ef8459'],height=.5);ax.invert_yaxis();ax.set(xlabel='平均绝对误差 MAE（百分点，越低越好）',xlim=(0,max(values)*1.22));ax.bar_label(bars,labels=[f'{v:.2f}' for v in values],padding=8);ax.grid(axis='x',alpha=.15);fig.tight_layout()
    for ext in ('png','svg'):fig.savefig(chartdir/f'03_预测误差比较.{ext}',dpi=180)
    plt.close(fig)
except ImportError as e:
    print('Charts skipped:',e)

# Independent arithmetic and integrity checks.
assert len(records)==1567 and sum(r['fail'] for r in records)==104
assert len(groups)==78 and len(predictions)==16
assert len({rid for g in groups for rid in g['recordIds']})==1560
assert all(r['historyGroups']==r['group']-1 for r in predictions)
assert all(0<=r[k]<=1 for r in predictions for k in ('observed','arima','historicalMean','recent5Mean'))
assert abs(metrics['historicalMean']['maePP']-sum(abs(r['historicalMean']-r['observed'])*100 for r in predictions)/16)<1e-12
print('INTEGRITY CHECKS PASSED')
(OUT/'原始数据').mkdir(exist_ok=True)
rawcopy=OUT/'原始数据/secom_labels.data'
if SOURCE.resolve()!=rawcopy.resolve():shutil.copyfile(SOURCE,rawcopy)
codecopy=OUT/'复现分析.py'
if Path(__file__).resolve()!=codecopy.resolve():shutil.copyfile(__file__,codecopy)
(OUT/'requirements.txt').write_text('\n'.join(f'{k}=={v}' for k,v in summary['software'].items() if k!='python')+'\nmatplotlib==3.11.2\n',encoding='utf-8')
