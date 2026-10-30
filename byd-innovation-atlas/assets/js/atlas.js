/* atlas.js — 比亚迪创新管理案例分析 · 三维结构示意
 * 由原交互演示（Three.js 0.180.0）移植为多实例组件：
 * 同一个场景可以在汇报页内嵌入，也可以在放大模式中复用。
 */
import * as T from '../../vendor/three.module.js';

const COLORS = {
  silver: '#b7c7c8', teal: '#138d95', navy: '#294c58',
  mint: '#7ab6a6', orange: '#d68c4e', red: '#cd6255'
};

const part = (key, name, color, body, insight, question) => ({ key, name, color, body, insight, question });

export const SCENE_ORDER = ['battery', 'hybrid', 'process', 'organization', 'quality', 'value'];

export const SCENES = {
  battery: {
    id: 'battery', tab: '电池拆解', index: '01', type: '三维结构示意',
    title: '刀片电池 · 从电芯到整车',
    subtitle: '拆开结构，观察长条电芯、成组空间与制造协作之间的联系。',
    source: '案例：2020年刀片电池；资料：比亚迪2021年社会责任报告。',
    units: '6 层',
    view: { yaw: .72, pitch: .58, dist: 16.5, target: [0, 1.1, 0] },
    parts: [
      part('cells', '长条电芯', COLORS.silver, '长条形电芯把储能单元与电池包空间组织联系起来。拖动拆解滑杆，观察电芯在包内的排列。', '电芯形态变化会影响包体结构、制造工艺和整车布置，需要多专业共同验证。', '一个部件变长以后，哪些团队需要一起调整？'),
      part('cover', '上盖与密封', COLORS.navy, '上盖覆盖电芯区域，与周边密封结构共同形成包体的外部边界。', '结构设计要与装配、检测和维护要求一起考虑，接口变化应留下验证记录。', '怎样确认新的连接与密封方式适合量产？'),
      part('connect', '电气连接', COLORS.orange, '连接件把电芯组织成供整车使用的电气系统。高压连接与绝缘需要共同设计。', '部件性能需要通过可靠的接口转化为系统性能，设计与工艺应使用一致的技术标准。', '连接可靠性应在哪些环节接受检查？'),
      part('thermal', '热管理层', COLORS.teal, '电芯、热管理层和包体通过接触面配合，把工作中的热量导向管理系统。', '热管理涉及材料、结构和使用条件，需要结合不同工况进行系统验证。', '单独验证一个部件，足以说明整个系统表现吗？'),
      part('tray', '承载托盘', COLORS.silver, '底部托盘承载内部组件，并与整车布置相配合。拆解后可以看到各层之间的空间关系。', '结构、制造和整车团队共同检查装配稳定性、尺寸配合与质量一致性。', '设计方案怎样转变为可稳定复制的制造过程？'),
      part('frame', '整车接口', COLORS.mint, '外侧安装点连接电池包与整车。系统价值最终体现在车辆使用中。', '评价创新需要连接技术特征、生产实施与用户价值，追踪实际应用结果。', '部件创新最终给用户带来了什么价值？')
    ],
    modes: [['all', '整体结构'], ['inside', '内部结构'], ['cell', '电芯聚焦']],
    slider: { title: '拆解程度', min: '整体装配', max: '分层展开' },
    explode: .55
  },
  hybrid: {
    id: 'hybrid', tab: '动力协同', index: '02', type: '典型混动原理示意',
    title: '混动系统 · 看见能量如何协同',
    subtitle: '切换典型工作模式，跟随能量流理解发动机、电驱与电池之间的配合。',
    source: '案例：2024年第五代DM。来源：BYD官方发布；能量路径按教学原理简化。',
    units: '6 个系统',
    view: { yaw: .75, pitch: .8, dist: 14.5, target: [0, 0, 0] },
    parts: [
      part('engine', '发动机', COLORS.silver, '发动机把燃料中的能量转化为机械能。不同模式下，机械能可用于发电或参与车辆驱动。', '第五代DM案例体现整车系统匹配。46.06%为企业发布的发动机热效率指标。', '为什么一个部件的最高效率，需要结合整车工况理解？'),
      part('motor', '电驱系统', COLORS.teal, '电机驱动车轮；在减速回收模式中，能量从车轮返回电池。', '电机、控制与整车团队需要共同验证动力响应、效率和不同模式之间的切换。', '如何让多个系统切换时仍保持一致的驾驶体验？'),
      part('battery', '动力电池', COLORS.mint, '电池储存并提供电能，也接收能量回收。切换“纯电”或“回收”模式观察流动方向。', '电池能力需要与动力需求、热管理和控制策略共同匹配。', '不同使用场景下，电池承担的任务有何变化？'),
      part('control', '控制策略', COLORS.orange, '控制系统依据车辆状态与驾驶需求，协调发动机、电机和电池的工作。', '系统优化需要共同目标、共享数据与联合验证，局部最优要接受整车约束。', '控制参数变更后，哪些关联场景要重新测试？'),
      part('cooling', '热管理', COLORS.navy, '热管理维持各系统适宜的工作条件，支持稳定运行。', '效率、可靠性、成本和布置之间需要权衡，跨专业协作应围绕整车目标展开。', '如何把不同专业的目标统一到整车表现？'),
      part('chassis', '底盘与车轮', COLORS.silver, '底盘把动力系统集成为整车。车轮展示能量的最终驱动或回收方向。', '管理评价从部件验证走向整车应用，再通过真实反馈持续修正方案。', '技术效果怎样在真实使用中得到检验？')
    ],
    modes: [['ev', '纯电驱动'], ['series', '串联发电'], ['parallel', '共同驱动'], ['regen', '减速回收']],
    slider: { title: '拆解程度', min: '整体装配', max: '分层展开' },
    explode: .4
  },
  process: {
    id: 'process', tab: '创新闭环', index: '03', type: '创新过程分析框架',
    title: '创新过程 · 从需求走向下一轮研发',
    subtitle: '沿着五个环节逐步推进，观察反馈怎样回到开发起点。',
    source: '依据年报与产品案例整理；节点表达管理分析。',
    units: '5 个环节',
    view: { yaw: .03, pitch: .6, dist: 11.5, target: [0, 0, 0] },
    parts: [
      part('need', '识别需求', COLORS.navy, '从用户使用场景出发，找到性能、成本、安全或便利性方面需要解决的问题。', '把问题表述为可检验的需求，让技术团队知道什么变化能够创造价值。', '要解决的具体问题是什么？'),
      part('develop', '方案开发', COLORS.teal, '围绕需求形成技术方案，通过试验缩小关键不确定性。', '研发、制造和整车团队共同讨论方案及接口，尽早发现跨环节冲突。', '哪些假设需要先验证再投入更多资源？'),
      part('verify', '联合验证', COLORS.mint, '在不同条件下检查性能、可靠性和配合关系。', '评审结论依据试验与问题关闭证据，支持继续推进、补试或调整方案。', '已有证据是否足够支持进入下一阶段？'),
      part('produce', '稳定量产', COLORS.orange, '把经过验证的方案转化为可稳定重复的制造过程。', '工装、参数、版本与追溯记录共同保障一致性，把制造知识反馈给设计。', '怎样从“做出一个”走向“稳定地做出很多个”？'),
      part('feedback', '使用反馈', COLORS.red, '跟踪实际使用、售后问题和经营结果，把新知识带回下一轮研发。', '持续复盘开发周期、质量成本与生命周期收益，让经验进入下一次决策。', '哪些反馈会改变下一代方案？')
    ],
    modes: [['forward', '开发链条'], ['loop', '反馈闭环']],
    slider: { title: '分步讲解', min: '需求', max: '反馈' }
  },
  organization: {
    id: 'organization', tab: '组织协同', index: '04', type: '职能协同分析模型',
    title: '创新组织 · 围绕整车目标协作',
    subtitle: '点选一个团队，观察知识、标准与问题怎样在专业之间传递。',
    source: '根据年报与案例整理职能协同关系。',
    units: '5 个角色',
    view: { yaw: .62, pitch: .68, dist: 13.5, target: [0, 0, 0] },
    parts: [
      part('vehicle', '整车目标', COLORS.teal, '性能、成本、质量与使用体验共同构成项目目标。', '用共同的目标协调局部方案，以整车表现衡量跨团队协作。', '各团队做得更好，是否一定意味着整车更好？'),
      part('research', '部件研发', COLORS.silver, '电池、电机与电控等专业提供技术方案和专业知识。', '把接口要求与关键假设写清楚，让关联团队能够共同检查。', '哪些专业知识需要跨部门共享？'),
      part('engineering', '整车工程', COLORS.navy, '把不同系统整合进车辆，处理布置、性能与成本之间的取舍。', '围绕实际场景共同验证，避免只优化单一指标。', '局部方案冲突时，如何决定优先级？'),
      part('manufacturing', '制造质量', COLORS.orange, '把方案转化为稳定生产，积累工装、过程与检验知识。', '让制造问题及时返回设计，使用统一的版本和追溯记录。', '怎样让生产现场的问题进入设计决策？'),
      part('market', '市场售后', COLORS.mint, '观察真实使用与反馈，识别新的问题和价值机会。', '将售后问题与项目复盘连接，把经验转化为验证和开发要求。', '用户反馈怎样成为可执行的技术任务？')
    ],
    modes: [['network', '完整协同'], ['focus', '关联聚焦']],
    slider: { title: '分步讲解', min: '目标', max: '反馈' }
  },
  quality: {
    id: 'quality', tab: '质量追溯', index: '05', type: '召回案例因果链示意',
    title: '质量风险 · 从制造细节追踪失效链条',
    subtitle: '分步查看工装、部件与使用风险之间的联系，再回到过程控制。',
    source: '市场监管总局2024-09-29公告：87,762 + 8,952 = 96,714辆。',
    units: '4 个节点',
    view: { yaw: .03, pitch: .58, dist: 10.5, target: [0, 0, 0] },
    parts: [
      part('fixture', '制造工装', COLORS.silver, '公告涉及电动助力转向控制器。制造中的工装干涉可能造成元件损伤。', '验证不仅检查设计图纸，也要覆盖工装条件、装配过程和制造接触。', '哪些生产条件可能改变元件的实际状态？'),
      part('capacitor', '电容微裂纹', COLORS.orange, '受影响电容可能产生微裂纹，缺陷在制造与使用环节之间传递。', '沿具体部件、批次和过程记录追踪原因，把问题定位到可验证的条件。', '如何建立设计、工装与质量记录之间的追溯？'),
      part('risk', '短路与过热风险', COLORS.red, '缺陷在后续使用中可能发展为短路、过热等风险。', '把现场失效转化为新的验证条件与控制要求，检查措施是否真正有效。', '怎样证明整改措施覆盖了原来的失效路径？'),
      part('review', '反馈与改进', COLORS.teal, '案例合计召回96,714辆。风险复盘将整改经验带回制造与开发。', '把经验固化为工艺标准、版本记录和后续检验，观察同类问题是否减少。', '整改完成后，还应持续跟踪什么？')
    ],
    modes: [['cause', '风险传递'], ['return', '改进反馈']],
    slider: { title: '分步讲解', min: '工装', max: '改进' }
  },
  value: {
    id: 'value', tab: '投入与回报', index: '06', type: '集团年度数据 · 单位：亿元',
    title: '经营评价 · 让投入与结果一起被看见',
    subtitle: '切换指标、点选年份，对比研发投入与同期经营结果。',
    source: '比亚迪2025、2024年年度报告；2023—2025完整年度、集团口径。',
    units: '3 个年度',
    view: { yaw: .03, pitch: .3, dist: 19, target: [0, 2.2, 0] },
    parts: [
      part('y2023', '2023年', COLORS.silver, '研发投入399.18亿元，归母净利润300.41亿元，经营活动现金流量净额1,697.25亿元。', '以完整年度建立比较基线，结合项目周期观察投入和回报。', '哪些能力需要长期积累？'),
      part('y2024', '2024年', COLORS.mint, '研发投入541.61亿元，归母净利润402.54亿元，经营活动现金流量净额1,334.54亿元。', '同步观察规模、盈利与现金流，理解创新活动的经营条件。', '如何安排探索项目与量产项目的资源？'),
      part('y2025', '2025年', COLORS.teal, '研发投入634.41亿元，同比增长17.13%；归母净利润326.19亿元，同比下降18.97%。', '项目与平台评价要连接投入、应用、质量和生命周期收益，识别回报实现的过程。', '投入增加后，如何检查它是否创造了长期价值？')
    ],
    modes: [['rd', '研发投入'], ['profit', '归母净利润'], ['cash', '经营现金流']],
    slider: { title: '分步讲解', min: '2023', max: '2025' }
  }
};

const METRICS = {
  rd: [399.18, 541.61, 634.41],
  profit: [300.41, 402.54, 326.19],
  cash: [1697.25, 1334.54, 591.36]
};

const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export class AtlasView {
  constructor(host, id, opts = {}) {
    this.host = host;
    this.def = SCENES[id];
    this.opts = opts;
    this.canvasHost = host.querySelector('.atlas-canvas');
    this.labelLayer = host.querySelector('.atlas-labels');
    this.root = new T.Group();
    this.parts = new Map();
    this.labels = [];
    this.paths = [];
    this.selected = 0;
    this.mode = this.def.modes[0][0];
    this.amount = this.def.explode ?? 0;
    this.shown = this.amount;
    this.playing = false;
    this.playTime = 0;
    this.flowTime = 0;
    this.autoRotate = false;
    this.hovered = null;
    this.visible = false;
    this.raf = 0;
    this.last = 0;
    this.yaw = 0; this.pitch = 0; this.dist = 16;
    this.target = new T.Vector3();
    this.down = null;
    this.pointers = new Map();
    this.pinch = 0;
    this.ray = new T.Raycaster();
    this.pointer = new T.Vector2();
    this.onSelect = opts.onSelect || (() => {});
    this.onMode = opts.onMode || (() => {});
    this.initThree();
  }

  /* ---- primitives ------------------------------------------------------- */
  static material(color, metal = .25, rough = .45) {
    return new T.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
  }
  mesh(g, geo, mat, x = 0, y = 0, z = 0) {
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    g.add(m);
    return m;
  }
  box(g, w, h, d, color, x = 0, y = 0, z = 0, metal = .3) {
    const m = this.mesh(g, new T.BoxGeometry(w, h, d), AtlasView.material(color, metal), x, y, z);
    const edge = new T.LineSegments(new T.EdgesGeometry(m.geometry),
      new T.LineBasicMaterial({ color: '#445d61', transparent: true, opacity: .16 }));
    m.add(edge);
    return m;
  }
  cylinder(g, r, h, color, x = 0, y = 0, z = 0) {
    return this.mesh(g, new T.CylinderGeometry(r, r, h, 40), AtlasView.material(color, .45), x, y, z);
  }
  sphere(g, r, color, x = 0, y = 0, z = 0) {
    return this.mesh(g, new T.SphereGeometry(r, 16, 12), AtlasView.material(color, .3), x, y, z);
  }
  tube(g, pts, color, r = .035) {
    const curve = new T.CatmullRomCurve3(pts.map(p => new T.Vector3(...p)));
    const m = this.mesh(g, new T.TubeGeometry(curve, 48, r, 8, false), AtlasView.material(color, .35));
    return { curve, m };
  }
  group(key, pos = [0, 0, 0], offset = [0, 0, 0]) {
    const g = new T.Group();
    g.position.set(...pos);
    g.userData = { key, base: new T.Vector3(...pos), offset: new T.Vector3(...offset) };
    this.root.add(g);
    this.parts.set(key, g);
    return g;
  }
  label(key, text, pos) {
    const el = document.createElement('div');
    el.className = 'atlas-label';
    el.textContent = text;
    this.labelLayer.append(el);
    this.labels.push({ key, el, pos: new T.Vector3(...pos) });
  }
  bolt(g, x, y, z) { this.cylinder(g, .06, .065, '#667d85', x, y, z); }

  /* ---- geometry (carried over from the approved interactive build) ------ */
  makeBattery() {
    let g = this.group('tray', [0, 0, 0], [0, -.6, 0]);
    this.box(g, 7.45, .18, 4.7, '#a9bcc2');
    for (const z of [-2.3, 2.3]) this.box(g, 7.5, .42, .14, '#becdd0', 0, .2, z);
    for (const x of [-3.68, 3.68]) this.box(g, .14, .42, 4.7, '#becdd0', x, .2, 0);
    for (const x of [-3.5, 0, 3.5]) for (const z of [-2.3, 2.3]) this.bolt(g, x, .45, z);

    g = this.group('thermal', [0, .19, 0], [0, .1, 0]);
    this.box(g, 7.1, .08, 4.35, '#298994');
    for (let i = 0; i < 12; i++) this.box(g, 6.9, .015, .025, '#85c8c4', 0, .05, -1.95 + i * .35);
    this.tube(g, [[-3.5, 0, -2.05], [-3.95, 0, -2.05], [-3.95, 0, -1.6]], '#6aaab6', .08);

    g = this.group('cells', [0, .5, 0], [0, 1, 0]);
    for (let i = 0; i < 28; i++) {
      const z = -1.97 + i * .146;
      this.box(g, 6.65, .57, .106, i % 4 === 0 ? '#c5d6d8' : '#aabfc3', 0, .18, z, .72);
      this.box(g, .09, .59, .109, '#28424e', -3.28, .18, z);
      this.box(g, .09, .59, .109, '#28424e', 3.28, .18, z);
      this.box(g, .16, .05, .09, '#d5a469', -3.2, .49, z);
      this.box(g, .16, .05, .09, '#d5a469', 3.2, .49, z);
    }

    g = this.group('connect', [0, 1.05, 0], [0, 1.7, 0]);
    for (const x of [-3.22, 3.22]) {
      this.box(g, .15, .045, 4.05, '#cb9961', x, 0, 0, .65);
      for (let i = 0; i < 14; i++) this.box(g, .2, .06, .08, '#eed8a5', x, .03, -1.9 + i * .29);
    }
    this.box(g, .56, .18, .55, '#264753', 3.3, .05, 2.05);
    this.tube(g, [[3.3, .1, 2.1], [3.8, .1, 2.1], [4, .1, 1.7]], '#cf7e3e', .06);

    g = this.group('cover', [0, 1.2, 0], [0, 3.2, 0]);
    const lid = this.box(g, 7.4, .12, 4.65, '#8cabb2', 0, 0, 0, .65);
    for (const z of [-1.65, -.8, 0, .8, 1.65]) this.box(g, 6.8, .045, .045, '#6d919a', 0, .08, z);
    for (const x of [-3.45, 0, 3.45]) for (const z of [-2.18, 2.18]) this.bolt(g, x, .1, z);
    lid.material.transparent = true;
    lid.material.opacity = .82;

    g = this.group('frame', [0, -.15, 0], [0, -1, 0]);
    for (const x of [-4.05, 4.05]) {
      this.box(g, .45, .19, 5.25, '#537d78', x, 0, 0);
      for (const z of [-2, -.6, .6, 2]) {
        this.box(g, .6, .1, .3, '#6a9690', x + Math.sign(x) * .27, .07, z);
        this.bolt(g, x + Math.sign(x) * .4, .16, z);
      }
    }
  }

  makeHybrid() {
    // 半透明车身轮廓：帮助识别整车形态，不参与点选
    const shape = new T.Shape();
    shape.moveTo(-4.25, .06);
    shape.lineTo(-4.25, .62);
    shape.lineTo(-3.55, .96);
    shape.lineTo(-2.4, 1.06);
    shape.lineTo(-1.85, 1.72);
    shape.lineTo(-.55, 1.82);
    shape.lineTo(1.15, 1.78);
    shape.lineTo(1.95, 1.12);
    shape.lineTo(3.35, 1.0);
    shape.lineTo(4.2, .72);
    shape.lineTo(4.2, .06);
    shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, {
      depth: 4.6, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 2, steps: 1
    });
    geo.translate(0, 0, -2.3);
    const glass = new T.MeshStandardMaterial({
      color: '#9dc3cb', transparent: true, opacity: .17,
      roughness: .3, metalness: .1, side: T.DoubleSide, depthWrite: false
    });
    const body = new T.Mesh(geo, glass);
    body.rotation.y = Math.PI / 2;
    body.position.y = .5;
    this.root.add(body);
    const outline = new T.LineSegments(
      new T.EdgesGeometry(geo, 24),
      new T.LineBasicMaterial({ color: '#6fa4ad', transparent: true, opacity: .3 })
    );
    outline.rotation.copy(body.rotation);
    outline.position.copy(body.position);
    this.root.add(outline);

    let g = this.group('chassis');
    for (const x of [-1.85, 1.85]) this.box(g, .16, .25, 8.6, '#a1b5b9', x, 0, 0);
    for (const z of [-3.1, 3.1]) {
      this.box(g, 4.8, .16, .16, '#718995', 0, .1, z);
      for (const x of [-2.35, 2.35]) {
        const wheel = this.mesh(g, new T.CylinderGeometry(.8, .8, .42, 48), AtlasView.material('#27363c', .03, .8), x, .18, z);
        wheel.rotation.z = Math.PI / 2;
        const hub = this.mesh(g, new T.CylinderGeometry(.45, .45, .44, 12), AtlasView.material('#b6c4c9', .8), x, .18, z);
        hub.rotation.z = Math.PI / 2;
        for (let a = 0; a < 6; a++) {
          const rr = a * Math.PI / 3;
          const spoke = this.box(g, .46, .05, .05, '#798f98', x, .18 + Math.sin(rr) * .3, z + Math.cos(rr) * .3);
          spoke.rotation.x = -rr;
        }
      }
    }
    g = this.group('battery', [0, .19, 1.1], [0, 1.7, .3]);
    this.box(g, 3.35, .36, 3.5, '#7ba99e');
    for (let i = 0; i < 18; i++) this.box(g, 3.1, .08, .1, '#b8ccc2', 0, .23, -1.55 + i * .18);
    for (const x of [-1.55, 1.55]) this.box(g, .08, .1, 3.3, '#216e74', x, .25, 0);

    g = this.group('engine', [-.7, .7, -2.4], [-.8, 1.8, -.4]);
    this.box(g, 1.3, 1.03, 1.35, '#9bafb3', 0, .2, 0, .75);
    this.box(g, 1.45, .18, 1.4, '#29404a', 0, .8, 0);
    for (let i = 0; i < 4; i++) {
      this.cylinder(g, .16, .14, '#cad3d0', -.48 + i * .32, .96, 0);
      this.tube(g, [[-.5 + i * .3, .2, .7], [-.5 + i * .3, .4, 1], [-.5 + i * .3, .7, 1.1]], '#c7c7b4', .07);
    }
    for (let i = 0; i < 6; i++) this.box(g, 1.35, .04, .08, '#758b91', 0, -.25 + i * .13, -.72);

    g = this.group('motor', [.72, .6, -1.8], [.8, 1.5, -.2]);
    const motor = this.cylinder(g, .51, 1.05, '#288f96');
    motor.rotation.z = Math.PI / 2;
    for (let i = 0; i < 9; i++) {
      const ring = this.mesh(g, new T.TorusGeometry(.5, .025, 8, 32), AtlasView.material('#9ac5ca'), -.4 + i * .1, 0, 0);
      ring.rotation.y = Math.PI / 2;
    }
    this.box(g, .82, .24, .63, '#465e66', 0, .55, 0);

    g = this.group('control', [.9, 1.25, -2.95], [1.3, 2.5, 0]);
    this.box(g, 1.2, .24, .9, '#aeafa2');
    for (let i = 0; i < 10; i++) this.box(g, .03, .12, .8, '#c6cec4', -.5 + i * .11, .17, 0);
    this.tube(g, [[.45, 0, .4], [.7, -.1, .65], [.65, -.5, 1]], '#d48847', .055);

    g = this.group('cooling', [0, .6, -3.85], [0, .8, -1.25]);
    this.box(g, 2.8, .9, .16, '#476772');
    for (let i = 0; i < 28; i++) this.box(g, .025, .82, .18, '#86a5ad', -1.3 + i * .095, 0, 0);
    for (const x of [-.7, .7]) this.mesh(g, new T.TorusGeometry(.34, .07, 8, 32), AtlasView.material('#243e49'), x, 0, .18);

    this.energyPaths();
  }

  addFlow(points, color, modeNames = []) {
    const g = new T.Group();
    this.root.add(g);
    const { curve, m } = this.tube(g, points, color, .025);
    m.material.transparent = true;
    m.material.opacity = .45;
    const dots = [];
    for (let i = 0; i < 5; i++) dots.push(this.sphere(g, .07, color));
    this.paths.push({ g, curve, dots, modes: modeNames });
  }
  energyPaths() {
    this.addFlow([[0, .65, .8], [.2, .9, 0], [.72, .9, -1.8]], '#0ba4a6', ['ev', 'parallel']);
    this.addFlow([[-.7, 1, -2.4], [0, 1.2, -2], [.72, .9, -1.8]], '#d68c4e', ['series', 'parallel']);
    this.addFlow([[.72, .9, -1.8], [1.7, .7, -2.5], [2.35, .65, -3.1]], '#14a4a5', ['ev', 'series', 'parallel']);
    this.addFlow([[2.35, .65, -3.1], [1.7, 1, -2.5], [.72, .9, -1.8], [.1, 1, 0], [0, .65, .8]], '#54ac79', ['regen']);
    this.addFlow([[-.7, 1, -2.4], [-.4, 1.1, -1], [0, .65, .8]], '#d68c4e', ['series']);
  }

  node(key, pos, color, n) {
    const g = this.group(key, pos);
    this.cylinder(g, .62, .3, color);
    this.cylinder(g, .65, .06, '#d7e4db', 0, -.19, 0);
    for (let i = 0; i < n; i++) this.box(g, .14, .08, .45, '#d8e7df', -.3 + i * .18, .21, 0);
    const p = this.def.parts.find(x => x.key === key);
    if (p) this.label(key, p.name, [0, .7, 0]);
    return g;
  }
  makeProcess() {
    const poses = [[-4.4, .1, 0], [-2.2, .1, 0], [0, .1, 0], [2.2, .1, 0], [4.4, .1, 0]];
    this.def.parts.forEach((p, i) => this.node(p.key, poses[i], p.color, i + 1));
    for (let i = 0; i < 4; i++) this.addFlow([[poses[i][0] + .65, .13, 0], [poses[i + 1][0] - .65, .13, 0]], '#379d96', ['forward', 'loop']);
    this.addFlow([[4.4, .1, .7], [4.4, .1, 2], [-4.4, .1, 2], [-4.4, .1, .7]], '#c37d64', ['loop']);
  }
  makeOrganization() {
    this.node('vehicle', [0, .2, 0], COLORS.teal, 3).scale.set(1.35, 1.35, 1.35);
    const poses = [[-3.8, 0, 0], [0, 0, -3], [3.8, 0, 0], [0, 0, 3]];
    this.def.parts.slice(1).forEach((p, i) => {
      this.node(p.key, poses[i], p.color, i + 1);
      const [x, y, z] = poses[i];
      this.addFlow([[x * .78, .17, z * .78], [x * .25, .4, z * .25]], '#77aaa3');
    });
  }
  makeQuality() {
    const p = [[-4.3, 0, 0], [-1.4, 0, 0], [1.4, 0, 0], [4.3, 0, 0]];
    this.def.parts.forEach((v, i) => {
      const g = this.node(v.key, p[i], v.color, i + 1);
      if (i === 0) {
        this.box(g, .7, .5, .7, '#b1c1c1', 0, .5, 0);
        this.box(g, .13, .6, .12, '#425d65', -.3, .9, 0);
        this.box(g, .13, .6, .12, '#425d65', .3, .9, 0);
        this.box(g, .72, .13, .12, '#536c74', 0, 1.2, 0);
      }
      if (i === 1) {
        this.box(g, .72, .04, .6, '#3d907d', 0, .4, 0);
        this.cylinder(g, .12, .33, '#d2b179', 0, .59, 0);
        this.tube(g, [[0, .77, .1], [.06, .64, .12], [-.04, .52, .12]], '#964938', .015);
      }
      if (i === 2) {
        for (let j = 0; j < 3; j++) this.sphere(g, .14 + j * .04, '#c96d53', 0, .45 + j * .3, 0);
      }
    });
    for (let i = 0; i < 3; i++) this.addFlow([[p[i][0] + .65, .12, 0], [p[i + 1][0] - .65, .12, 0]], i < 2 ? '#ca8b66' : '#50a396', ['cause', 'return']);
    this.addFlow([[4.3, .1, .6], [4.3, .1, 1.8], [-4.3, .1, 1.8], [-4.3, .1, .6]], '#4b9e93', ['return']);
  }
  makeValue() {
    const vals = METRICS[this.mode] ?? METRICS.rd;
    const max = { rd: 700, profit: 450, cash: 1800 }[this.mode] ?? 700;
    this.def.parts.forEach((p, i) => {
      const g = this.group(p.key, [-3 + i * 3, 0, 0]);
      const h = vals[i] / max * 4.8;
      this.box(g, 1.5, h, 1.5, p.color, 0, h / 2, 0, .2);
      this.box(g, 1.8, .07, 1.8, '#d6e1d9', 0, -.04, 0);
      const unit = this.mode === 'rd' ? '研发投入' : this.mode === 'profit' ? '归母净利润' : '经营现金流';
      this.label(p.key, `${p.name} ${fmt(vals[i])}`, [0, -.55, 1.15]);
    });
    for (let v = 0; v <= max; v += max / 3) {
      const h = v / max * 4.8;
      this.tube(this.root, [[-4.4, h, -1.1], [4.4, h, -1.1]], '#d2dfd6', .012);
    }
  }

  /* ---- lifecycle -------------------------------------------------------- */
  initThree() {
    const wrap = this.canvasHost;
    this.scene = new T.Scene();
    this.scene.background = new T.Color('#eef4f2');
    this.scene.fog = new T.Fog('#eef4f2', 26, 70);
    this.camera = new T.PerspectiveCamera(35, 1, .1, 100);
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = .96;
    wrap.append(this.renderer.domElement);
    const c = this.renderer.domElement;
    c.setAttribute('aria-label', '可旋转、缩放并点选部件的三维结构示意');
    c.tabIndex = 0;

    this.scene.add(new T.HemisphereLight('#ffffff', '#7d9a92', 1.2));
    const key = new T.DirectionalLight('#fff9e8', 3.4);
    key.position.set(4, 10, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, far: 35 });
    key.shadow.bias = -.0007;
    this.scene.add(key);
    const back = new T.DirectionalLight('#bcdfee', 1.15);
    back.position.set(-6, 5, -6);
    this.scene.add(back);
    const floor = new T.Mesh(new T.PlaneGeometry(200, 200), new T.ShadowMaterial({ color: '#68847a', opacity: .16 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.7;
    floor.receiveShadow = true;
    this.scene.add(floor);
    const grid = new T.GridHelper(30, 30, '#d5e0d6', '#e0e8e1');
    grid.position.y = -1.71;
    grid.material.transparent = true;
    grid.material.opacity = .3;
    this.scene.add(grid);
    this.scene.add(this.root);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(wrap);
    this.resize();
    this.bindPointer();
    this.build();
    this.resetView();
    this.selectPart(0, true);
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { width, height } = this.canvasHost.getBoundingClientRect();
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  build() {
    this.disposeRoot();
    const make = {
      battery: () => this.makeBattery(),
      hybrid: () => this.makeHybrid(),
      process: () => this.makeProcess(),
      organization: () => this.makeOrganization(),
      quality: () => this.makeQuality(),
      value: () => this.makeValue()
    }[this.def.id];
    make();
    this.root.traverse(o => {
      if (o.isMesh) {
        let k = o;
        while (k && !k.userData.key) k = k.parent;
        if (k) o.userData.key = k.userData.key;
      }
    });
  }

  disposeRoot() {
    this.root.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => m.dispose());
      }
    });
    this.scene.remove(this.root);
    this.root = new T.Group();
    this.scene.add(this.root);
    this.parts.clear();
    this.labels.forEach(l => l.el.remove());
    this.labels = [];
    this.paths = [];
  }

  resetView() {
    const v = this.def.view;
    this.yaw = v.yaw; this.pitch = v.pitch; this.dist = v.dist;
    this.target.set(...v.target);
    this.autoRotate = false;
    this.host.dispatchEvent(new CustomEvent('atlas-rotate', { detail: false }));
    this.look();
  }

  look() {
    this.camera.position.set(
      this.target.x + Math.sin(this.yaw) * Math.cos(this.pitch) * this.dist,
      this.target.y + Math.sin(this.pitch) * this.dist,
      this.target.z + Math.cos(this.yaw) * Math.cos(this.pitch) * this.dist
    );
    this.camera.lookAt(this.target);
  }

  setView(kind) {
    this.autoRotate = false;
    this.host.dispatchEvent(new CustomEvent('atlas-rotate', { detail: false }));
    if (kind === 'iso') return this.resetView();
    if (kind === 'top') { this.pitch = 1.46; this.yaw = 0; }
    if (kind === 'front') { this.pitch = .1; this.yaw = 0; }
    this.look();
  }

  setMode(value) {
    this.mode = value;
    if (this.def.id === 'battery') {
      this.parts.forEach(g => g.visible = true);
      if (value === 'inside') this.parts.get('cover').visible = false;
      if (value === 'cell') {
        this.parts.forEach((g, k) => g.visible = k === 'cells' || k === 'connect');
        this.selectPart(0, true);
      }
      this.syncVisibility();
    }
    if (this.def.id === 'hybrid') {
      this.amount = 0; this.syncAmount();
      this.playing = true;
      this.host.dispatchEvent(new CustomEvent('atlas-play', { detail: true }));
    }
    if (this.def.id === 'organization') {
      const keep = this.def.parts[this.selected].key;
      this.parts.forEach((g, k) => g.visible = value === 'network' || k === 'vehicle' || k === keep);
      this.syncVisibility();
    }
    if (this.def.id === 'value') { this.build(); this.selectPart(this.selected, true); }
    this.onMode(value);
  }

  selectPart(i, silent = false) {
    const n = this.def.parts.length;
    this.selected = ((i % n) + n) % n;
    const p = this.def.parts[this.selected];
    if (this.def.id !== 'battery' && this.def.id !== 'hybrid') {
      this.amount = n > 1 ? this.selected / (n - 1) : 0;
      this.syncAmount();
    }
    if (this.def.id === 'organization' && this.mode === 'focus') {
      this.parts.forEach((g, k) => g.visible = k === 'vehicle' || k === p.key);
      this.syncVisibility();
    }
    this.paint();
    if (!silent) this.onSelect(p, this.selected, n);
    this.labels.forEach(l => l.el.classList.toggle('is-active', l.key === p.key));
    return p;
  }

  paint() {
    const key = this.def.parts[this.selected].key;
    this.root.traverse(o => {
      if (o.isMesh && o.userData.key && o.material.emissive) {
        o.material.emissive.set(o.userData.key === key ? '#187c75' : '#000000');
        o.material.emissiveIntensity = o.userData.key === key ? .18 : 0;
        if (o.userData.key === this.hovered) o.material.emissiveIntensity = .34;
      }
    });
  }

  syncAmount() {
    this.host.dispatchEvent(new CustomEvent('atlas-amount', {
      detail: { value: this.amount, text: this.amountLabel() }
    }));
  }
  amountLabel() {
    if (this.def.id === 'battery' || this.def.id === 'hybrid') return Math.round(this.amount * 100) + '%';
    return `${this.selected + 1} / ${this.def.parts.length}`;
  }

  syncVisibility() {
    this.labels.forEach(l => l.el.hidden = !this.parts.get(l.key)?.visible);
    this.host.dispatchEvent(new CustomEvent('atlas-parts', {
      detail: [...this.parts.keys()].filter(k => this.parts.get(k).visible)
    }));
  }

  setAmount(v) {
    this.playing = false;
    this.host.dispatchEvent(new CustomEvent('atlas-play', { detail: false }));
    this.amount = Math.max(0, Math.min(1, v));
    this.syncAmount();
    if (this.def.id !== 'battery' && this.def.id !== 'hybrid') {
      this.selectPart(Math.round(this.amount * (this.def.parts.length - 1)));
    }
  }

  togglePlay() {
    this.playing = !this.playing;
    if (this.playing && (this.def.id === 'battery' || this.def.id === 'hybrid')) {
      this.playTime = Math.acos(1 - 2 * this.amount) / .55;
    }
    this.host.dispatchEvent(new CustomEvent('atlas-play', { detail: this.playing }));
  }

  toggleRotate() {
    this.autoRotate = !this.autoRotate;
    this.host.dispatchEvent(new CustomEvent('atlas-rotate', { detail: this.autoRotate }));
  }

  /* ---- input ------------------------------------------------------------ */
  bindPointer() {
    const c = this.renderer.domElement;
    c.addEventListener('pointerdown', e => {
      c.focus({ preventScroll: true });
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: 0 };
      if (this.pointers.size === 2) {
        const v = [...this.pointers.values()];
        this.pinch = Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y);
      }
      this.host.dispatchEvent(new CustomEvent('atlas-focus'));
    });
    c.addEventListener('pointermove', e => {
      if (this.pointers.has(e.pointerId)) {
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.pointers.size === 2) {
          const v = [...this.pointers.values()];
          const p = Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y);
          this.dist = Math.max(6, Math.min(34, this.dist * this.pinch / p));
          this.pinch = p;
          this.down.moved = 99;
        } else if (this.down) {
          this.yaw -= (e.clientX - this.down.lx) * .007;
          this.pitch = Math.max(.08, Math.min(1.46, this.pitch + (e.clientY - this.down.ly) * .006));
          this.down.moved += Math.abs(e.clientX - this.down.lx) + Math.abs(e.clientY - this.down.ly);
          this.down.lx = e.clientX; this.down.ly = e.clientY;
          this.look();
        }
        this.host.dispatchEvent(new CustomEvent('atlas-hover', { detail: null }));
      } else {
        const hit = this.pick(e);
        this.hovered = hit?.object.userData.key ?? null;
        this.paint();
        c.style.cursor = hit ? 'pointer' : 'grab';
        this.host.dispatchEvent(new CustomEvent('atlas-hover', {
          detail: hit ? { name: this.def.parts.find(p => p.key === this.hovered)?.name, x: e.clientX, y: e.clientY } : null
        }));
      }
    });
    const release = e => {
      if (this.down?.moved < 6) {
        const h = this.pick(e);
        if (h) this.selectPart(this.def.parts.findIndex(p => p.key === h.object.userData.key));
      }
      this.pointers.delete(e.pointerId);
      this.down = null;
    };
    c.addEventListener('pointerup', release);
    c.addEventListener('pointercancel', e => { this.pointers.delete(e.pointerId); this.down = null; });
    c.addEventListener('pointerleave', () => {
      this.hovered = null; this.paint();
      this.host.dispatchEvent(new CustomEvent('atlas-hover', { detail: null }));
    });
    c.addEventListener('wheel', e => {
      e.preventDefault();
      this.dist = Math.max(6, Math.min(34, this.dist * Math.exp(e.deltaY * .001)));
      this.look();
    }, { passive: false });
    c.addEventListener('keydown', e => {
      const map = {
        ArrowRight: () => this.selectPart(this.selected + 1),
        ArrowLeft: () => this.selectPart(this.selected - 1),
        ArrowUp: () => this.setAmount(this.amount + .08),
        ArrowDown: () => this.setAmount(this.amount - .08),
        ' ': () => this.togglePlay(),
        r: () => this.resetView()
      };
      const fn = map[e.key];
      if (fn) { e.preventDefault(); e.stopPropagation(); fn(); }
    });
  }

  pick(ev) {
    const r = this.canvasHost.getBoundingClientRect();
    this.pointer.set((ev.clientX - r.left) / r.width * 2 - 1, -(ev.clientY - r.top) / r.height * 2 + 1);
    this.ray.setFromCamera(this.pointer, this.camera);
    return this.ray.intersectObjects([...this.parts.values()].filter(g => g.visible), true)
      .find(x => x.object.userData.key);
  }

  setActive(on) {
    this.visible = on;
    if (on && !this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(t => this.animate(t));
      this.resize();
    }
    if (!on && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  dispose() {
    this.setActive(false);
    this.ro?.disconnect();
    this.disposeRoot();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  animate(time) {
    this.raf = requestAnimationFrame(t => this.animate(t));
    const dt = Math.min(.05, (time - this.last) / 1000 || 0);
    this.last = time;
    if (this.playing) {
      this.playTime += dt;
      this.flowTime += dt;
      if (this.def.id === 'battery' || this.def.id === 'hybrid') {
        this.amount = (1 - Math.cos(this.playTime * .55)) / 2;
        this.syncAmount();
      } else {
        const n = this.def.parts.length;
        const next = Math.floor(this.playTime / 3.2) % n;
        if (next !== this.selected) this.selectPart(next);
      }
    }
    if (this.autoRotate) { this.yaw += dt * .18; this.look(); }
    this.shown += (this.amount - this.shown) * Math.min(1, dt * 6);
    this.parts.forEach(g => {
      g.position.copy(g.userData.base).addScaledVector(g.userData.offset, this.shown);
    });
    this.paths.forEach((p, i) => {
      p.g.visible = !p.modes.length || p.modes.includes(this.mode);
      p.dots.forEach((d, j) => {
        d.position.copy(p.curve.getPointAt((this.flowTime * .18 + j / 5 + i * .13) % 1));
      });
    });
    this.labels.forEach(l => {
      const g = this.parts.get(l.key);
      if (!g || !g.visible) { l.el.hidden = true; return; }
      const v = l.pos.clone();
      g.localToWorld(v);
      v.project(this.camera);
      l.el.hidden = v.z > 1 || v.x < -1.25 || v.x > 1.25 || v.y < -1.25 || v.y > 1.25;
      l.el.style.left = (v.x * .5 + .5) * this.canvasHost.clientWidth + 'px';
      l.el.style.top = (-v.y * .5 + .5) * this.canvasHost.clientHeight + 'px';
    });
    this.look();
    this.renderer.render(this.scene, this.camera);
  }
}
