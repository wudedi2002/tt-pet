/**
 * Facemini Prototype — App Logic
 */
(function () {
  'use strict';

  const STORAGE = {
    credits: 'fm_credits',
    drafts: 'fm_drafts',
    history: 'fm_history',
    avatar: 'fm_avatar',
    recent: 'fm_recent',
    recentAvatars: 'fm_recent_avatars',
  };

  const DEFAULT_RECENT_AVATARS = [
    { name: '直播主播', category: 'anchor', emoji: '🎙' },
    { name: '职场精英', category: 'workplace', emoji: '👔' },
    { name: 'Q 版萌妹', category: 'cartoon', emoji: '🎀' },
    { name: '写实女性', category: 'realistic', emoji: '👩' },
  ];

  let pickerPendingAvatar = null;
  const AVATAR_SELECT_MORE = '__picker__';

  const AVATAR_HISTORY_DEMOS = [
    { emoji: '👔', title: '职场汇报', prompt: '各位同事好，今天为大家带来产品功能亮点讲解…', ratio: '16:9 · 1080p', avatarName: '职场精英', time: '示例 · 10:30', cost: 20 },
    { emoji: '🎙', title: '直播带货', prompt: '家人们看过来！今天这款好物真的绝了，限时优惠…', ratio: '9:16 · 1080p', avatarName: '直播主播', time: '示例 · 昨天', cost: 20 },
    { emoji: '📚', title: '知识科普', prompt: '你知道吗？今天我们来聊一个有趣的知识点，保证让你听完就懂…', ratio: '16:9 · 1080p', avatarName: '卡通男孩', time: '示例 · 2天前', cost: 20 },
  ];

  const IMAGE_HISTORY_DEMOS = [
    { emoji: '🛍', title: '电商主图示例', prompt: '夏季清爽护肤品主图，白色背景，产品居中…', time: '示例 · 10:20', cost: 10 },
    { emoji: '🌃', title: '赛博海报示例', prompt: '赛博朋克风城市夜景，霓虹灯光，未来感…', time: '示例 · 昨天', cost: 10 },
  ];

  const VIDEO_HISTORY_DEMOS = [
    { emoji: '🎤', title: '口播短视频', prompt: '博主面对镜头介绍产品，自然表情…', duration: '5s', time: '示例 · 10:30', cost: 25, model: 'Seedance 2.0' },
    { emoji: '🌿', title: '产品种草', prompt: '慢镜头展示护肤品质地与包装，氛围感…', duration: '5s', time: '示例 · 昨天', cost: 25, model: 'PixVerse V5' },
    { emoji: '🎭', title: '漫剧片段', prompt: '动漫风格角色对话，电影感镜头…', duration: '8s', time: '示例 · 2天前', cost: 40, model: '海螺 2.3' },
  ];

  const CONTENT_HISTORY_DEMOS = [
    { emoji: '🎬', title: '短视频口播脚本', prompt: '3秒短视频口播脚本，开头抓眼球，结尾引导关注…', time: '示例 · 10:30', cost: 5 },
    { emoji: '🌿', title: '小红书种草', prompt: '小红书种草文案，真实体验感，emoji 点缀，分段清晰…', time: '示例 · 昨天', cost: 5 },
    { emoji: '💬', title: '朋友圈文案', prompt: '朋友圈文案，简短有温度，适合日常分享…', time: '示例 · 2天前', cost: 5 },
  ];

  const IMAGE_SCENE_TEMPLATES = [
    { id: 'scene-1', title: '电商主图', desc: '纯白背景产品图，突出质感与卖点', prompt: '电商产品主图，纯白背景，无线耳机居中，高级质感棚拍，适合主图上架', image: 'assets/inspire/scene-1-product.png', category: 'ecommerce', hot: true, weekly: true, model: '智能图片 V2', ratio: '1:1', count: 1 },
    { id: 'scene-2', title: '赛博海报', desc: '霓虹未来风，适合活动与潮牌视觉', prompt: '赛博朋克雨夜街景，霓虹灯光，未来城市，电影感海报，视觉冲击力强', image: 'assets/inspire/scene-2-cyber.png', category: 'design', hot: true, weekly: true, model: 'Seedream 5.0', ratio: '16:9', count: 1 },
    { id: 'scene-3', title: '插画头像', desc: '柔和插画感，个人品牌与社交场景', prompt: '日系插画侧脸头像，柔和粉紫色调，清新 aesthetic，适合社交头像', image: 'assets/inspire/scene-3-anime.png', category: 'illustration', hot: false, weekly: false, model: 'Qwen-Image', ratio: '1:1', count: 1 },
    { id: 'scene-4', title: '3D 产品', desc: '潮玩质感棚拍，科技产品展示', prompt: '3D潮玩盲盒风格，毛绒熊公仔，工作室暖光，精致产品展示', image: 'assets/inspire/scene-4-3d.png', category: '3d', hot: false, weekly: false, model: '智能图片 V2', ratio: '1:1', count: 1 },
    { id: 'scene-5', title: '国潮美食', desc: '红金国潮，餐饮与节日促销', prompt: '中秋国潮海报，红金配色，月饼主题，传统节日促销视觉', image: 'assets/inspire/scene-5-festival.png', category: 'ecommerce', hot: true, weekly: true, model: '智能图片 V2', ratio: '4:3', count: 1 },
    { id: 'scene-6', title: '人像写真', desc: '柔光浅景深，高级感人像摄影', prompt: '高级感人像写真，柔光，浅景深，自然表情，杂志封面质感', image: 'assets/inspire/scene-3-anime.png', category: 'photo', hot: false, weekly: false, model: '智能图片 V2', ratio: '9:16', count: 1 },
    { id: 'scene-7', title: '动漫角色', desc: '赛璐璐风角色立绘，游戏宣传', prompt: '日系动漫角色立绘，赛璐璐上色，游戏宣传图，动态姿势', image: 'assets/inspire/scene-2-cyber.png', category: 'anime', hot: true, weekly: true, model: 'Qwen-Image', ratio: '9:16', count: 1 },
    { id: 'scene-8', title: '促销海报', desc: '大标题留白，节日活动吸睛', prompt: '节日促销海报，大标题留白，红金配色，视觉冲击力强', image: 'assets/inspire/scene-5-festival.png', category: 'design', hot: false, weekly: false, model: 'Seedream 5.0', ratio: '16:9', count: 2 },
  ];

  const STATE = {
    credits: 1280,
    currentPage: 'home',
    generating: false,
    imageWorksFilter: 'all',
    imageSubTab: 'create',
    videoSubTab: 'create',
    avatarSubTab: 'create',
    videoWorksFilter: 'all',
    avatarWorksFilter: 'all',
    contentSubTab: 'create',
    contentWorksFilter: 'all',
    imageInspireFilter: 'all',
    hubTemplateFilter: 'all',
    hubInspirePrimary: 'image',
    hubInspireSub: 'all',
    meSubTab: 'profile',
    avatar: { name: '', category: '', emoji: '' },
    avatarGalleryFilter: 'all',
  };

  const AVATAR_GALLERY_ITEMS = [
    { name: '直播主播', category: 'anchor', emoji: '🎙', desc: '带货直播 · 口播视频', accent: '#a78bfa' },
    { name: '职场精英', category: 'workplace', emoji: '👔', desc: '商务汇报 · 培训讲解', accent: '#60a5fa' },
    { name: 'Q 版萌妹', category: 'cartoon', emoji: '🎀', desc: '动漫风格 · 趣味内容', accent: '#f472b6' },
    { name: '写实女性', category: 'realistic', emoji: '👩', desc: '高保真 · 品牌代言', accent: '#34d399' },
    { name: '时尚达人', category: 'anchor', emoji: '✨', desc: '穿搭分享 · 美妆种草', accent: '#fbbf24' },
    { name: '商务顾问', category: 'workplace', emoji: '💼', desc: '企业宣传 · 产品介绍', accent: '#38bdf8' },
    { name: '卡通男孩', category: 'cartoon', emoji: '🦸', desc: '教育科普 · 儿童内容', accent: '#fb7185' },
    { name: '写实男性', category: 'realistic', emoji: '👨', desc: '高保真 · 新闻播报', accent: '#818cf8' },
  ];

  const GEN_MESSAGES = {
    image: ['解析提示词中…', '渲染画面中…', '优化细节中…', '即将完成…'],
    video: ['分析素材中…', '合成视频帧…', '渲染特效中…', '同步音轨中…'],
    avatar: ['加载数字人模型…', '合成语音中…', '渲染画面中…', '同步口型中…'],
    content: ['分析场景模板…', '生成文案中…', '优化表达中…', '即将完成…'],
  };

  /* ── Init ── */
  function init() {
    loadState();
    bindNavigation();
    bindDrafts();
    bindGeneration();
    bindModals();
    bindTopbar();
    bindInspire();
    bindOneClickTemplates();
    bindAvatarGallery();
    bindPageSpecific();
    updateCreditsUI();
    navigate(getPageFromHash() || 'home');
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE.credits);
    if (saved) STATE.credits = parseInt(saved, 10);
    const avatar = localStorage.getItem(STORAGE.avatar);
    if (avatar) {
      const parsed = JSON.parse(avatar);
      if (parsed?.name) STATE.avatar = parsed;
    }
  }

  function saveCredits() {
    localStorage.setItem(STORAGE.credits, STATE.credits);
    updateCreditsUI();
  }

  function updateCreditsUI() {
    document.querySelectorAll('[data-credits]').forEach(el => {
      el.textContent = STATE.credits.toLocaleString();
    });
  }

  /* ── Navigation ── */
  function bindNavigation() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (el.dataset.meTab) STATE.meSubTab = el.dataset.meTab;
        navigate(el.dataset.nav);
      });
    });
    document.querySelectorAll('[data-sidebar]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (el.dataset.sidebar === 'me') STATE.meSubTab = 'profile';
        navigate(el.dataset.sidebar);
      });
    });
    window.addEventListener('hashchange', () => navigate(getPageFromHash() || 'home'));
  }

  const SIDEBAR_PAGES = ['hub', 'me', 'image', 'video', 'avatar', 'avatar-select', 'content'];

  const TOPBAR_META = {
    hub: { crumb: '创作中心', search: '搜索模板、功能、创作工具…' },
    me: { crumb: '我的', search: '搜索我的作品、账单、设置…' },
    image: { crumb: '图片创作', search: '搜索图片模板、风格、历史作品…' },
    video: { crumb: '视频创作', search: '搜索视频模板、口播、种草脚本…' },
    avatar: { crumb: '数字人创作', search: '搜索数字人形象、音色、文案…' },
    'avatar-select': { crumb: '选择形象', search: '搜索数字人形象分类…' },
    content: { crumb: '爆款图文', search: '搜索文案模板、种草、脚本…' },
  };

  const INSPIRE_TEMPLATES = [
    { type: 'image', title: '电商主图', badge: '智能图片 V2', emoji: '🛍', image: 'assets/inspire/scene-1-product.png', prompt: '电商产品主图，纯白背景，无线耳机居中，高级质感棚拍，适合主图上架' },
    { type: 'image', title: '赛博海报', badge: 'Seedream', emoji: '🌃', image: 'assets/inspire/scene-2-cyber.png', prompt: '赛博朋克雨夜街景，霓虹灯光，未来城市，电影感海报，视觉冲击力强' },
    { type: 'image', title: '插画头像', badge: 'Qwen-Image', emoji: '🎨', image: 'assets/inspire/scene-3-anime.png', prompt: '日系插画侧脸头像，柔和粉紫色调，清新 aesthetic，适合社交头像' },
    { type: 'image', title: '3D 产品', badge: '智能图片 V2', emoji: '✨', image: 'assets/inspire/scene-4-3d.png', prompt: '3D潮玩盲盒风格，毛绒熊公仔，工作室暖光，精致产品展示' },
    { type: 'image', title: '国潮美食', badge: 'FLUX', emoji: '🍜', image: 'assets/inspire/scene-5-festival.png', prompt: '中秋国潮海报，红金配色，月饼主题，传统节日促销视觉' },
    { type: 'image', title: '品牌 IP', badge: 'MJ', emoji: '🐱', prompt: '极简扁平插画，品牌 IP 形象，可爱风格' },
    { type: 'image', title: '人像写真', badge: 'V2-Hash', emoji: '👤', prompt: '高级感人像写真，柔光，浅景深' },
    { type: 'image', title: '节日海报', badge: 'Seedream 5.0', emoji: '🎉', prompt: '节日促销海报，喜庆氛围，大标题留白' },
    { type: 'video', title: '短视频口播', badge: 'PixVerse V5', emoji: '🎤', prompt: '口播短视频，博主面对镜头介绍产品，自然表情' },
    { type: 'video', title: '产品种草', badge: 'Seedance 2.0', emoji: '🌿', prompt: '产品种草，慢镜头展示护肤品质地与包装' },
    { type: 'video', title: '漫剧片段', badge: '海螺 2.3', emoji: '🎭', prompt: '漫剧片段，动漫风格角色对话，电影感镜头' },
    { type: 'video', title: '蝶舞', badge: 'PixVerse V5', emoji: '🦋', prompt: '蝴蝶飞舞，梦幻光斑，慢动作' },
    { type: 'video', title: '趣味短剧', badge: 'KLING', emoji: '🐱', prompt: '猫咪打工，趣味短视频，竖屏' },
    { type: 'video', title: '城市延时', badge: 'VD', emoji: '🌆', prompt: '城市延时，夜景车流，电影调色' },
    { type: 'video', title: '产品旋转', badge: 'Seedance 2.0', emoji: '📦', prompt: '产品 360 度旋转展示，纯色背景' },
    { type: 'video', title: '口播带货', badge: '海螺 2.3', emoji: '🛒', prompt: '带货口播，竖屏，快节奏剪辑感' },
    { type: 'content', title: '口播脚本', badge: '短视频', emoji: '🎬', prompt: '3秒短视频口播脚本，开头抓眼球，结尾引导关注' },
    { type: 'content', title: '小红书种草', badge: '种草', emoji: '🌿', prompt: '小红书种草文案，真实体验感，emoji 点缀，分段清晰' },
    { type: 'content', title: '朋友圈文案', badge: '社交', emoji: '💬', prompt: '朋友圈文案，简短有温度，适合日常分享' },
    { type: 'content', title: '产品标题', badge: '标题', emoji: '🏷', prompt: '电商产品标题，突出卖点，15字以内' },
    { type: 'content', title: '海报标语', badge: '标语', emoji: '📋', prompt: '促销海报标语，朗朗上口，突出优惠力度' },
  ];

  const AVATAR_SPEECH_TEMPLATES = [
    { type: 'avatar-speech', title: '短视频口播', badge: '开场引流', emoji: '🎤', prompt: '嗨，欢迎来到我的频道！今天想和大家分享一个超实用的小技巧，记得点赞关注哦～' },
    { type: 'avatar-speech', title: '产品种草', badge: '带货直播', emoji: '🛍', prompt: '家人们看过来！今天这款好物真的绝了，性价比超高，限时优惠不要错过，链接在评论区～' },
    { type: 'avatar-speech', title: '新闻播报', badge: '资讯速递', emoji: '📺', prompt: '各位观众大家好，欢迎收看今日新闻。以下是本时段要闻摘要，请留意后续报道。' },
    { type: 'avatar-speech', title: '知识科普', badge: '趣味讲解', emoji: '📚', prompt: '你知道吗？今天我们来聊一个有趣的知识点，保证让你听完就懂，一起来涨知识吧！' },
    { type: 'avatar-speech', title: '职场汇报', badge: '商务正式', emoji: '👔', prompt: '各位同事好，今天向大家汇报本季度工作进展与核心成果，接下来将从三个维度展开说明。' },
    { type: 'avatar-speech', title: '课程讲解', badge: '教育培训', emoji: '🎓', prompt: '同学们好，欢迎来到今天的课程。本节课我们将重点讲解核心概念，并配合案例帮助大家理解。' },
    { type: 'avatar-speech', title: '品牌宣传', badge: '企业介绍', emoji: '🏢', prompt: '大家好，我是品牌代言人。今天想为大家介绍我们的核心理念与产品优势，期待与您携手共创价值。' },
    { type: 'avatar-speech', title: '节日祝福', badge: '温情问候', emoji: '🎉', prompt: '亲爱的朋友们，值此佳节来临之际，送上我最真挚的祝福，愿大家阖家幸福、万事顺意！' },
    { type: 'avatar-speech', title: '活动邀约', badge: '营销转化', emoji: '📣', prompt: '重磅消息！年度盛典即将开启，限时福利不容错过，现在预约即可锁定专属名额，我们现场见！' },
    { type: 'avatar-speech', title: '客服应答', badge: '服务场景', emoji: '💬', prompt: '您好，很高兴为您服务。关于您咨询的问题，我已为您整理了解决方案，请按以下步骤操作即可。' },
  ];

  function getAvatarInspireItems() {
    return AVATAR_GALLERY_ITEMS.map(a => ({
      type: 'avatar',
      title: a.name,
      badge: a.desc,
      emoji: a.emoji,
      avatarPick: true,
      category: a.category,
    }));
  }

  function getInspireTemplates() {
    return [
      ...INSPIRE_TEMPLATES.filter(t => t.type !== 'avatar'),
      ...getAvatarInspireItems(),
      ...AVATAR_SPEECH_TEMPLATES,
    ];
  }

  let inspireFilter = 'all';
  let inspireContext = 'image';

  const HUB_DEFAULT_RECENT = [
    { page: 'image', name: 'AI 图片' },
    { page: 'video', name: 'AI 视频' },
    { page: 'avatar', name: '数字人' },
    { page: 'content', name: '爆款图文' },
  ];

  const HUB_TEMPLATES = [
    { id: 'ht-1', title: '电商主图', emoji: '🖼', nav: 'image', category: 'ecommerce', prompt: '电商产品主图，纯白背景，产品居中，高级质感棚拍' },
    { id: 'ht-2', title: '口播短视频', emoji: '🎬', nav: 'video', category: 'media', prompt: '口播短视频，博主面对镜头介绍产品，自然表情' },
    { id: 'ht-3', title: '职场数字人', emoji: '🤖', nav: 'avatar', category: 'avatar', prompt: '各位同事好，今天为大家带来产品功能亮点讲解…' },
    { id: 'ht-4', title: '小红书种草', emoji: '📝', nav: 'content', category: 'media', prompt: '小红书种草文案，真实体验感，emoji 点缀，分段清晰' },
    { id: 'ht-5', title: '插画头像', emoji: '🎨', nav: 'image', category: 'creative', prompt: '日系插画侧脸头像，柔和粉紫色调，清新 aesthetic' },
  ];

  const ONECLICK_TEMPLATES = [
    { id: 'oc-1', title: '口播', desc: '博主出镜介绍，自然口播带货', emoji: '🎤', nav: 'video', accent: '#a78bfa', prompt: '口播短视频，博主面对镜头介绍产品，自然表情', videoScene: '口播短视频，博主面对镜头介绍产品，自然表情' },
    { id: 'oc-2', title: '种草', desc: '慢镜头质感，氛围感产品种草', emoji: '🌿', nav: 'video', accent: '#34d399', prompt: '产品种草，慢镜头展示产品质地与包装，氛围感', videoScene: '产品种草，慢镜头展示产品质地与包装，氛围感' },
    { id: 'oc-3', title: '漫剧', desc: '动漫角色对白，电影感镜头', emoji: '🎭', nav: 'video', accent: '#f472b6', prompt: '漫剧片段，动漫风格角色对话，电影感镜头', videoScene: '漫剧片段，动漫风格角色对话，电影感镜头' },
    { id: 'oc-4', title: '电商主图', desc: '白底棚拍，突出产品质感卖点', emoji: '🛍', nav: 'image', accent: '#38bdf8', prompt: '电商产品主图，纯白背景，无线耳机居中，高级质感棚拍，适合主图上架' },
    { id: 'oc-5', title: '职场汇报', desc: '数字人讲解，专业职场风格', emoji: '👔', nav: 'avatar', accent: '#60a5fa', prompt: '各位同事好，今天为大家带来本季度业务进展汇报，接下来请看核心数据与亮点总结…' },
    { id: 'oc-6', title: '节日祝福', desc: '节庆问候文案，温暖有仪式感', emoji: '🎉', nav: 'content', accent: '#fbbf24', prompt: '新春佳节来临之际，祝大家万事如意、阖家幸福，愿新的一年事业蒸蒸日上、心想事成！' },
  ];

  const HUB_INSPIRE_SQUARE = {
    image: {
      subs: [
        { id: 'all', label: '全部' },
        { id: 'hot', label: '🔥爆款模版' },
        { id: 'ecommerce', label: '电商主图' },
        { id: 'avatar-ip', label: '头像IP' },
        { id: 'photo', label: '摄影写真' },
        { id: 'anime', label: '动漫游戏' },
        { id: 'illustration', label: '风格插画' },
        { id: 'design', label: '平面设计' },
      ],
    },
    video: {
      subs: [
        { id: 'all', label: '全部' },
        { id: 'hot', label: '🔥热门爆款' },
        { id: 'koubo', label: '口播种草' },
        { id: 'manju', label: '漫剧片段' },
        { id: 'drama', label: '剧情短片' },
        { id: 'fx', label: '创意特效' },
        { id: 'short-drama', label: '横剧/短剧' },
      ],
    },
    avatar: {
      subs: [
        { id: 'all', label: '全部' },
        { id: 'hot', label: '🔥热门形象' },
        { id: 'workplace', label: '职场汇报' },
        { id: 'live', label: '直播带货' },
        { id: 'news', label: '新闻播报' },
        { id: 'science', label: '趣味科普' },
        { id: 'edu', label: '教育培训' },
      ],
    },
    content: {
      subs: [
        { id: 'all', label: '全部' },
        { id: 'hot', label: '🔥爆款文案' },
        { id: 'seed', label: '种草带货' },
        { id: 'moments', label: '朋友圈文案' },
        { id: 'script', label: '短视频脚本' },
        { id: 'festival', label: '节日文案' },
        { id: 'workplace', label: '职场文案' },
      ],
    },
    workflow: {
      subs: [
        { id: 'all', label: '全部' },
        { id: 'hot', label: '🔥热门流程' },
        { id: 'image2video', label: '图生视频' },
        { id: 'content2avatar', label: '图文转数字人' },
        { id: 'batch', label: '批量创作' },
      ],
    },
  };

  const HUB_INSPIRE_ITEMS = [
    { id: 'hi-1', primary: 'image', subTag: 'ecommerce', hot: true, title: '电商主图精选', author: '设计师小L', likes: 2340, type: 'image', emoji: '🛍', image: 'assets/inspire/scene-1-product.png', prompt: '电商产品主图，纯白背景，无线耳机居中，高级质感棚拍，适合主图上架' },
    { id: 'hi-2', primary: 'image', subTag: 'design', hot: true, title: '赛博雨夜街景', author: '视觉阿K', likes: 1892, type: 'image', emoji: '🌃', image: 'assets/inspire/scene-2-cyber.png', prompt: '赛博朋克雨夜街景，霓虹灯光，未来城市，电影感海报，视觉冲击力强' },
    { id: 'hi-3', primary: 'image', subTag: 'avatar-ip', title: '插画社交头像', author: '插画师Mio', likes: 1560, type: 'image', emoji: '🎨', image: 'assets/inspire/scene-3-anime.png', prompt: '日系插画侧脸头像，柔和粉紫色调，清新 aesthetic，适合社交头像' },
    { id: 'hi-4', primary: 'image', subTag: 'illustration', title: '3D 潮玩展示', author: '3D 工作室', likes: 980, type: 'image', emoji: '✨', image: 'assets/inspire/scene-4-3d.png', prompt: '3D潮玩盲盒风格，毛绒熊公仔，工作室暖光，精致产品展示' },
    { id: 'hi-5', primary: 'image', subTag: 'ecommerce', title: '国潮促销海报', author: '品牌设计', likes: 1210, type: 'image', emoji: '🍜', image: 'assets/inspire/scene-5-festival.png', prompt: '中秋国潮海报，红金配色，月饼主题，传统节日促销视觉' },
    { id: 'hi-6', primary: 'image', subTag: 'anime', hot: true, title: '动漫角色立绘', author: '游戏美术', likes: 1430, type: 'image', emoji: '🎭', image: 'assets/inspire/scene-2-cyber.png', prompt: '日系动漫角色立绘，赛璐璐上色，游戏宣传图，动态姿势' },
    { id: 'hi-7', primary: 'image', subTag: 'photo', title: '人像写真', author: '摄影师阿南', likes: 760, type: 'image', emoji: '👤', prompt: '高级感人像写真，柔光，浅景深，自然表情，杂志封面质感' },
    { id: 'hi-8', primary: 'image', subTag: 'design', title: '节日促销海报', author: '平面设计师', likes: 640, type: 'image', emoji: '🎉', prompt: '节日促销海报，大标题留白，红金配色，视觉冲击力强' },
    { id: 'hi-v1', primary: 'video', subTag: 'koubo', hot: true, title: '口播带货视频', author: '带货教练', likes: 1820, type: 'video', emoji: '🎤', prompt: '口播短视频，博主面对镜头介绍产品，自然表情，快节奏剪辑感' },
    { id: 'hi-v2', primary: 'video', subTag: 'koubo', title: '产品种草慢镜', author: '种草达人', likes: 1320, type: 'video', emoji: '🌿', prompt: '产品种草，慢镜头展示护肤品质地与包装，氛围感灯光' },
    { id: 'hi-v3', primary: 'video', subTag: 'manju', hot: true, title: '漫剧对白片段', author: '漫剧工作室', likes: 1560, type: 'video', emoji: '🎭', prompt: '漫剧片段，动漫风格角色对话，电影感镜头，情绪张力强' },
    { id: 'hi-v4', primary: 'video', subTag: 'drama', title: '都市剧情短片', author: '短剧导演', likes: 980, type: 'video', emoji: '🎬', prompt: '都市情感剧情短片，生活化场景，自然对白，电影调色' },
    { id: 'hi-v5', primary: 'video', subTag: 'fx', title: '蝶舞创意特效', author: '特效师', likes: 720, type: 'video', emoji: '🦋', prompt: '蝴蝶飞舞，梦幻光斑，慢动作，创意视觉特效' },
    { id: 'hi-v6', primary: 'video', subTag: 'short-drama', title: '横屏短剧预告', author: '短剧制片', likes: 860, type: 'video', emoji: '📺', prompt: '横屏短剧预告片，悬念剪辑，多角色快切，电影感字幕' },
    { id: 'hi-a1', primary: 'avatar', subTag: 'live', hot: true, title: '直播主播形象', author: '数字人官方', likes: 2100, type: 'avatar', emoji: '🎙', prompt: '家人们看过来！今天给大家带来一款超值好物，关注我不迷路…', avatarName: '直播主播' },
    { id: 'hi-a2', primary: 'avatar', subTag: 'workplace', hot: true, title: '职场汇报数字人', author: '企业培训', likes: 1680, type: 'avatar', emoji: '👔', prompt: '各位同事好，今天汇报本季度工作进展与核心成果，接下来从三个维度展开说明。', avatarName: '职场精英' },
    { id: 'hi-a3', primary: 'avatar', subTag: 'news', title: '新闻播报', author: '资讯频道', likes: 940, type: 'avatar', emoji: '📺', prompt: '各位观众大家好，欢迎收看今日新闻，以下是本时段要闻摘要。', avatarName: '写实男性' },
    { id: 'hi-a4', primary: 'avatar', subTag: 'science', title: '趣味科普讲解', author: '科普博主', likes: 1120, type: 'avatar', emoji: '📚', prompt: '你知道吗？今天我们来聊一个有趣的知识点，保证让你听完就懂！', avatarName: '卡通男孩' },
    { id: 'hi-a5', primary: 'avatar', subTag: 'edu', title: '课程讲解', author: '在线教育', likes: 780, type: 'avatar', emoji: '🎓', prompt: '同学们好，本节课我们将重点讲解核心概念，并配合案例帮助大家理解。', avatarName: '商务顾问' },
    { id: 'hi-a6', primary: 'avatar', subTag: 'live', title: '时尚达人带货', author: '美妆直播', likes: 650, type: 'avatar', emoji: '✨', prompt: '姐妹们今天这款必入！质地超好，限时福利不要错过，链接在评论区～', avatarName: '时尚达人' },
    { id: 'hi-c1', primary: 'content', subTag: 'seed', hot: true, title: '小红书种草', author: '自媒体达人', likes: 1860, type: 'content', emoji: '🌿', prompt: '小红书种草文案，真实体验感，emoji 点缀，分段清晰', contentTemplate: '小红书种草' },
    { id: 'hi-c2', primary: 'content', subTag: 'moments', title: '朋友圈文案', author: '生活博主', likes: 920, type: 'content', emoji: '💬', prompt: '朋友圈文案，简短有温度，适合日常分享', contentTemplate: '朋友圈文案' },
    { id: 'hi-c3', primary: 'content', subTag: 'script', hot: true, title: '短视频口播脚本', author: '短视频编导', likes: 1340, type: 'content', emoji: '🎬', prompt: '3秒短视频口播脚本，开头抓眼球，结尾引导关注', contentTemplate: '短视频脚本' },
    { id: 'hi-c4', primary: 'content', subTag: 'seed', title: '种草带货话术', author: '带货文案', likes: 760, type: 'content', emoji: '🛒', prompt: '电商种草带货文案，突出卖点与优惠，引导下单转化', contentTemplate: '小红书种草' },
    { id: 'hi-c5', primary: 'content', subTag: 'festival', title: '节日祝福文案', author: '运营策划', likes: 580, type: 'content', emoji: '🎉', prompt: '节日祝福文案，温暖有仪式感，适合品牌节庆传播', contentTemplate: '海报标语' },
    { id: 'hi-c6', primary: 'content', subTag: 'workplace', title: '职场周报摘要', author: '效率达人', likes: 490, type: 'content', emoji: '👔', prompt: '职场周报摘要，条理清晰，成果与计划分明，适合团队同步', contentTemplate: '产品标题' },
    { id: 'hi-w1', primary: 'workflow', subTag: 'content2avatar', hot: true, title: '图文转数字人', author: 'Facemini', likes: 3200, type: 'workflow', emoji: '🚀', workflow: 'content2avatar', prompt: '将爆款图文一键推送至数字人，快速生成口播视频' },
    { id: 'hi-w2', primary: 'workflow', subTag: 'image2video', hot: true, title: '主图生成视频', author: 'Facemini', likes: 2800, type: 'workflow', emoji: '🎞', workflow: 'image2video', prompt: '电商主图一键扩展为产品展示短视频，适合上架引流' },
    { id: 'hi-w3', primary: 'workflow', subTag: 'batch', title: '批量图文创作', author: 'Facemini', likes: 1560, type: 'workflow', emoji: '📦', workflow: 'batch-content', prompt: '多场景文案批量生成，覆盖种草、脚本、朋友圈等模板' },
    { id: 'hi-w4', primary: 'workflow', subTag: 'image2video', title: '灵感图转短片', author: '创作者社区', likes: 980, type: 'workflow', emoji: '✨', workflow: 'image2video', prompt: '将图片灵感延展为 5 秒动态短片，自动匹配口播脚本' },
  ];

  const HUB_MY_WORKS_DEMOS = [
    { type: 'image', title: '电商主图示例', preview: '夏季清爽护肤品主图，白色背景…', prompt: '夏季清爽护肤品主图，白色背景，产品居中…', time: '示例 · 10:20', cost: 10, emoji: '🛍', module: 'AI 图片', createdAt: Date.now() - 3600000 },
    { type: 'video', title: '口播短视频示例', preview: '口播介绍新品上架活动…', prompt: '口播介绍新品上架活动，博主面对镜头…', time: '示例 · 昨天', cost: 25, emoji: '🎬', module: 'AI 视频', createdAt: Date.now() - 86400000 },
    { type: 'avatar', title: '数字人口播示例', preview: '各位同事好，今天为大家带来…', prompt: '各位同事好，今天为大家带来产品功能亮点讲解…', time: '示例 · 2 天前', cost: 30, emoji: '🤖', module: '数字人', createdAt: Date.now() - 172800000 },
  ];

  function getPageFromHash() {
    const hash = location.hash.replace('#', '');
    const valid = ['home', 'hub', 'me', 'image', 'video', 'avatar', 'avatar-select', 'content'];
    return valid.includes(hash) ? hash : null;
  }

  function navigate(page) {
    STATE.currentPage = page;
    location.hash = page;

    document.body.classList.toggle('has-sidebar', SIDEBAR_PAGES.includes(page));
    document.body.classList.toggle('on-landing', page === 'home');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    document.querySelectorAll('[data-sidebar]').forEach(item => {
      const key = item.dataset.sidebar;
      item.classList.toggle('active', key === page ||
        (page === 'avatar-select' && key === 'avatar'));
    });

    window.scrollTo(0, 0);
    updateTopbar(page);
    addRecent(page);
    if (page === 'hub') renderHubPage();
    if (page === 'me') renderMePage();
  }

  function updateTopbar(page) {
    const meta = TOPBAR_META[page];
    const crumb = document.getElementById('topbar-crumb');
    const imageNav = document.getElementById('topbar-image-nav');
    const videoNav = document.getElementById('topbar-video-nav');
    const avatarNav = document.getElementById('topbar-avatar-nav');
    const contentNav = document.getElementById('topbar-content-nav');
    const meNav = document.getElementById('topbar-me-nav');
    const search = document.getElementById('global-search');
    const isImage = page === 'image';
    const isVideo = page === 'video';
    const isAvatar = page === 'avatar';
    const isContent = page === 'content';
    const isMe = page === 'me';
    if (crumb) {
      if (meta) crumb.textContent = meta.crumb;
      crumb.hidden = isImage || isVideo || isAvatar || isContent || isMe;
    }
    if (imageNav) imageNav.hidden = !isImage;
    if (videoNav) videoNav.hidden = !isVideo;
    if (avatarNav) avatarNav.hidden = !isAvatar;
    if (contentNav) contentNav.hidden = !isContent;
    if (meNav) meNav.hidden = !isMe;
    if (search && meta) search.placeholder = meta.search;
    const topbarInspire = document.getElementById('topbar-inspire-btn');
    if (topbarInspire) {
      topbarInspire.hidden = !['image', 'video', 'avatar', 'content'].includes(page);
    }
    document.body.classList.toggle('studio-mode', ['image', 'video', 'avatar', 'avatar-select', 'content', 'me'].includes(page));
    if (['image', 'video', 'avatar', 'content'].includes(page)) inspireContext = page === 'avatar-select' ? 'avatar' : page;
    if (isImage) switchImageSubTab(STATE.imageSubTab || 'create');
    if (isVideo) switchVideoSubTab(STATE.videoSubTab || 'create');
    if (isAvatar) switchAvatarSubTab(STATE.avatarSubTab || 'create');
    if (isContent) switchContentSubTab(STATE.contentSubTab || 'create');
    if (isMe) switchMeSubTab(STATE.meSubTab || 'profile');
  }

  function switchContentSubTab(tab) {
    STATE.contentSubTab = tab;
    document.querySelectorAll('[data-tab-group="content-sub"] [data-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel="content-sub"]').forEach(p => {
      p.classList.toggle('active', p.dataset.panelValue === tab);
    });
    if (tab === 'history') renderHistory('content');
  }

  function switchAvatarSubTab(tab) {
    STATE.avatarSubTab = tab;
    document.querySelectorAll('[data-tab-group="avatar-sub"] [data-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel="avatar-sub"]').forEach(p => {
      p.classList.toggle('active', p.dataset.panelValue === tab);
    });
    if (tab === 'history') renderHistory('avatar');
  }

  function switchVideoSubTab(tab) {
    STATE.videoSubTab = tab;
    document.querySelectorAll('[data-tab-group="video-sub"] [data-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel="video-sub"]').forEach(p => {
      p.classList.toggle('active', p.dataset.panelValue === tab);
    });
    if (tab === 'history') renderHistory('video');
  }

  function switchMeSubTab(tab) {
    STATE.meSubTab = tab;
    document.querySelectorAll('[data-tab-group="me-sub"] [data-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel="me-sub"]').forEach(p => {
      p.classList.toggle('active', p.dataset.panelValue === tab);
    });
    if (tab === 'works') renderMeWorks();
  }

  function switchImageSubTab(tab) {
    STATE.imageSubTab = tab;
    document.querySelectorAll('[data-tab-group="image-sub"] [data-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel="image-sub"]').forEach(p => {
      p.classList.toggle('active', p.dataset.panelValue === tab);
    });
    if (tab === 'works') renderHistory('image');
  }

  function addRecent(page) {
    if (page === 'home' || page === 'hub' || page === 'avatar-select') return;
    const names = { image: 'AI图片', video: 'AI视频', avatar: '数字人', content: '爆款图文' };
    let recent = JSON.parse(localStorage.getItem(STORAGE.recent) || '[]');
    recent = recent.filter(r => r.page !== page);
    recent.unshift({ page, name: names[page] || page, time: Date.now() });
    recent = recent.slice(0, 6);
    localStorage.setItem(STORAGE.recent, JSON.stringify(recent));
    renderRecent();
  }

  function renderRecent() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE.recent) || '[]');
    const icons = { image: '🖼', video: '🎬', avatar: '🤖', content: '📝' };
    const recent = stored.length ? stored.slice(0, 4) : HUB_DEFAULT_RECENT;
    container.innerHTML = recent.map(r => `
      <article class="hub-recent-card hub-card" data-nav="${r.page}">
        <div class="hub-recent-thumb">${icons[r.page] || '✨'}</div>
        <div class="hub-recent-name">${r.name}</div>
        <div class="hub-recent-overlay">
          <button type="button" class="hub-quick-enter">快速进入</button>
        </div>
      </article>`).join('');
    container.querySelectorAll('.hub-recent-card[data-nav]').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.hub-quick-enter')) {
          e.stopPropagation();
        }
        navigate(card.dataset.nav);
      });
    });

    bindHubAdBanners();
  }

  function formatHubTime(ts) {
    if (!ts) return '刚刚';
    const diff = Date.now() - ts;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
    return Math.floor(diff / 86400000) + ' 天前';
  }

  function filterHubByCategory(items, category) {
    if (!category || category === 'all') return items;
    return items.filter(item => item.category === category);
  }

  function filterHubInspireItems() {
    const primary = STATE.hubInspirePrimary || 'image';
    const sub = STATE.hubInspireSub || 'all';
    return HUB_INSPIRE_ITEMS.filter(item => {
      if (item.primary !== primary) return false;
      if (sub === 'all') return true;
      if (sub === 'hot') return !!item.hot;
      return item.subTag === sub;
    });
  }

  function renderHubInspireSubtabs() {
    const wrap = document.getElementById('hub-inspire-subtabs');
    if (!wrap) return;
    const primary = STATE.hubInspirePrimary || 'image';
    const subs = HUB_INSPIRE_SQUARE[primary]?.subs || [];
    const activeSub = STATE.hubInspireSub || 'all';
    wrap.innerHTML = subs.map(sub => `
      <button type="button" class="hub-inspire-subtab${sub.id === activeSub ? ' active' : ''}"
        data-inspire-sub="${sub.id}" role="tab" aria-selected="${sub.id === activeSub ? 'true' : 'false'}">${sub.label}</button>
    `).join('');
    wrap.querySelectorAll('[data-inspire-sub]').forEach(tab => {
      tab.addEventListener('click', () => {
        STATE.hubInspireSub = tab.dataset.inspireSub;
        renderHubInspireSubtabs();
        renderHubInspire();
      });
    });
  }

  function applyHubTemplate(template) {
    if (!template) return;
    navigate(template.nav);
    if (template.nav === 'image') applyImagePrompt(template.prompt);
    else if (template.nav === 'content') {
      const el = document.getElementById('content-editor');
      if (el) { el.value = template.prompt; setDraft('content-editor', template.prompt); }
    } else if (template.nav === 'video') {
      const el = document.getElementById('video-prompt');
      if (el) { el.value = template.prompt; setDraft('video-script', template.prompt); }
    } else if (template.nav === 'avatar') {
      const el = document.getElementById('avatar-script');
      if (el) { el.value = template.prompt; setDraft('avatar-script', template.prompt); }
    }
    toast('已套用「' + template.title + '」模板', 'success');
  }

  function applyOneClickTemplate(template) {
    if (!template) return;
    if (template.nav !== STATE.currentPage) navigate(template.nav);

    if (template.nav === 'image') {
      switchImageSubTab('create');
      applyImagePrompt(template.prompt);
    } else if (template.nav === 'video') {
      switchVideoSubTab('create');
      activateVideoModeTab('text2video');
      const prompt = document.getElementById('video-prompt');
      const imgDesc = document.querySelector('[data-draft="video-img-desc"]');
      if (prompt) {
        prompt.value = template.prompt;
        setDraft('video-script', template.prompt);
      }
      if (imgDesc) {
        imgDesc.value = template.prompt;
        setDraft('video-img-desc', template.prompt);
      }
      if (template.videoScene) {
        setVideoSceneSelect(template.videoScene);
      }
    } else if (template.nav === 'avatar') {
      const el = document.getElementById('avatar-script');
      if (el) { el.value = template.prompt; setDraft('avatar-script', template.prompt); }
    } else if (template.nav === 'content') {
      const el = document.getElementById('content-editor');
      if (el) { el.value = template.prompt; setDraft('content-editor', template.prompt); }
    }

    toast('已套用「' + template.title + '」模板', 'success');
  }

  function applyVideoScenePrompt(prompt) {
    if (!prompt) return;
    const promptEl = document.getElementById('video-prompt');
    const imgDesc = document.querySelector('[data-draft="video-img-desc"]');
    if (promptEl) {
      promptEl.value = prompt;
      setDraft('video-script', prompt);
    }
    if (imgDesc) {
      imgDesc.value = prompt;
      setDraft('video-img-desc', prompt);
    }
  }

  function applyVideoPrompt(prompt, mode) {
    if (!prompt) return;
    const activeMode = mode || document.querySelector('[data-tab-group="video-mode"] .tab.active')?.dataset.tab || 'img2video';
    const promptEl = document.getElementById('video-prompt');
    const imgDesc = document.querySelector('[data-draft="video-img-desc"]');
    if (activeMode === 'text2video' && promptEl) {
      promptEl.value = prompt;
      setDraft('video-script', prompt);
    } else if (imgDesc) {
      imgDesc.value = prompt;
      setDraft('video-img-desc', prompt);
    }
  }

  function setVideoModel(modelName) {
    const sel = document.getElementById('video-model-select');
    if (!sel || !modelName) return;
    for (const opt of sel.options) {
      if (opt.text === modelName || opt.value === modelName) {
        sel.value = opt.value;
        return;
      }
    }
  }

  function setVideoSceneSelect(prompt) {
    const sel = document.getElementById('video-scene-select');
    if (!sel || !prompt) return;
    const hasOption = Array.from(sel.options).some(opt => opt.value === prompt);
    sel.value = hasOption ? prompt : '';
  }

  function getVideoHistoryPayload() {
    const mode = document.querySelector('[data-tab-group="video-mode"] .tab.active')?.dataset.tab || 'img2video';
    const prompt = getDraft('video-script') || getDraft('video-img-desc') || '';
    return {
      prompt,
      preview: prompt.slice(0, 48) || 'AI 生成视频',
      mode,
      scene: document.getElementById('video-scene-select')?.value || '',
      model: document.getElementById('video-model-select')?.value || 'Seedance 2.0',
      ratio: document.getElementById('video-ratio-select')?.value || '智能比例 · 720p',
      duration: getActiveDuration(),
    };
  }

  function applyVideoHistoryItem(item, fullEdit) {
    if (!item?.prompt) return;

    const restore = () => {
      switchVideoSubTab('create');

      if (fullEdit) {
        const mode = item.mode || 'text2video';
        activateVideoModeTab(mode);
        applyVideoPrompt(item.prompt, mode);

        if (item.model) setVideoModel(item.model);
        if (item.ratio) setSelectByValue('video-ratio-select', item.ratio);
        if (item.scene) setVideoSceneSelect(item.scene);

        if (item.duration) {
          const dur = String(item.duration).replace(/s$/i, '');
          document.querySelectorAll('#page-video .duration-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.duration === dur);
          });
          updateVideoCost(dur);
        }

        const focusEl = mode === 'text2video'
          ? document.getElementById('video-prompt')
          : document.querySelector('[data-draft="video-img-desc"]');
        focusEl?.focus();

        document.getElementById('video-composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        applyVideoScenePrompt(item.prompt);
      }
    };

    if (STATE.currentPage !== 'video') {
      navigate('video');
    }
    restore();
  }

  function getVideoItemFromCard(card) {
    if (!card) return null;
    if (card.dataset.item) {
      try {
        return JSON.parse(decodeURIComponent(card.dataset.item));
      } catch (_) { /* fall through */ }
    }
    return { prompt: decodeURIComponent(card.dataset.prompt || '') };
  }

  function activateVideoModeTab(mode) {
    const group = document.querySelector('[data-tab-group="video-mode"]');
    if (!group) return;
    group.querySelectorAll('[data-tab]').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === mode);
    });
    document.querySelectorAll('[data-panel="video-mode"]').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panelValue === mode);
    });
    document.getElementById('video-composer')?.setAttribute('data-mode', mode);
  }

  function navigateToHubTemplates() {
    navigate('hub');
    setTimeout(() => {
      document.getElementById('hub-template-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function navigateToHubInspire() {
    navigate('hub');
    setTimeout(() => {
      document.getElementById('hub-inspire-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function renderOneClickTemplates() {
    const grid = document.getElementById('oneclick-template-grid');
    if (!grid) return;
    grid.innerHTML = ONECLICK_TEMPLATES.map(t => `
      <button type="button" class="oneclick-card" data-oneclick-id="${t.id}" style="--oneclick-accent:${t.accent}">
        <div class="oneclick-card-visual">
          <span class="oneclick-card-icon" aria-hidden="true">${t.emoji}</span>
        </div>
        <div class="oneclick-card-meta">
          <h3 class="oneclick-card-title">${t.title}</h3>
          <p class="oneclick-card-desc">${t.desc}</p>
        </div>
      </button>`).join('');
    grid.querySelectorAll('[data-oneclick-id]').forEach(card => {
      card.addEventListener('click', () => {
        const template = ONECLICK_TEMPLATES.find(t => t.id === card.dataset.oneclickId);
        applyOneClickTemplate(template);
      });
    });
  }

  function bindOneClickTemplates() {
    renderOneClickTemplates();
    document.getElementById('oneclick-more-btn')?.addEventListener('click', navigateToHubTemplates);
  }

  function getAvatarByName(name) {
    return AVATAR_GALLERY_ITEMS.find(a => a.name === name) || null;
  }

  function getFrequentAvatars() {
    const frequent = [...DEFAULT_RECENT_AVATARS];
    if (STATE.avatar.name && !frequent.some(a => a.name === STATE.avatar.name)) {
      const current = getAvatarByName(STATE.avatar.name);
      if (current) frequent.unshift(current);
    }
    return frequent;
  }

  function getFilteredAvatarGalleryItems() {
    const filter = STATE.avatarGalleryFilter || 'all';
    return AVATAR_GALLERY_ITEMS.filter(a => filter === 'all' || a.category === filter);
  }

  function setSelectedAvatar(avatar, opts = {}) {
    if (!avatar?.name) {
      STATE.avatar = { name: '', category: '', emoji: '' };
      localStorage.removeItem(STORAGE.avatar);
      syncAvatarSelectValue();
      renderAvatarGallery();
      return;
    }
    STATE.avatar = {
      name: avatar.name,
      category: avatar.category,
      emoji: avatar.emoji,
    };
    localStorage.setItem(STORAGE.avatar, JSON.stringify(STATE.avatar));
    let recent = getRecentAvatars().filter(a => a.name !== STATE.avatar.name);
    recent.unshift({ name: STATE.avatar.name, category: STATE.avatar.category, emoji: STATE.avatar.emoji });
    recent = recent.slice(0, 8);
    localStorage.setItem(STORAGE.recentAvatars, JSON.stringify(recent));
    syncAvatarSelectValue();
    renderAvatarGallery();
    if (opts.toast !== false) toast('已选择形象「' + STATE.avatar.name + '」', opts.toastType || 'success');
  }

  function updateAvatarGalleryScrollBtn() {
    const track = document.getElementById('avatar-gallery-scroll');
    const btn = document.getElementById('avatar-gallery-scroll-right');
    if (!track || !btn) return;
    const canScroll = track.scrollWidth > track.clientWidth + 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    btn.hidden = !canScroll;
    btn.disabled = atEnd;
  }

  function renderAvatarGallery() {
    const grid = document.getElementById('avatar-gallery-grid');
    if (!grid) return;
    const items = getFilteredAvatarGalleryItems();
    grid.innerHTML = items.length
      ? items.map(a => `
      <div class="oneclick-card avatar-gallery-card${STATE.avatar.name === a.name ? ' active' : ''}"
        data-avatar-gallery="${a.name}" data-category="${a.category}" data-emoji="${a.emoji}"
        style="--oneclick-accent:${a.accent}">
        <div class="oneclick-card-visual">
          <span class="oneclick-card-icon" aria-hidden="true">${a.emoji}</span>
        </div>
        <div class="oneclick-card-meta">
          <h3 class="oneclick-card-title">${a.name}</h3>
          <p class="oneclick-card-desc">${a.desc}</p>
        </div>
        <div class="avatar-gallery-card-overlay">
          <button type="button" class="btn btn-secondary btn-sm" data-gallery-action="preview">预览</button>
          <button type="button" class="btn btn-primary btn-sm" data-gallery-action="use">使用</button>
        </div>
      </div>`).join('')
      : '<div class="avatar-gallery-empty">该分类暂无形象</div>';
    requestAnimationFrame(updateAvatarGalleryScrollBtn);
  }

  function bindAvatarGallery() {
    renderAvatarGallery();
    document.getElementById('avatar-gallery-more-btn')?.addEventListener('click', () => openAvatarPicker());
    document.getElementById('avatar-gallery-grid')?.addEventListener('click', e => {
      const actionBtn = e.target.closest('[data-gallery-action]');
      if (!actionBtn) return;
      e.stopPropagation();
      const card = actionBtn.closest('[data-avatar-gallery]');
      if (!card) return;
      const avatar = {
        name: card.dataset.avatarGallery,
        category: card.dataset.category,
        emoji: card.dataset.emoji,
        desc: card.querySelector('.avatar-gallery-card-desc, .oneclick-card-desc')?.textContent?.trim()
          || getAvatarByName(card.dataset.avatarGallery)?.desc || '',
      };
      if (actionBtn.dataset.galleryAction === 'preview') {
        openAvatarPicker(avatar.name);
        return;
      }
      if (actionBtn.dataset.galleryAction === 'use') {
        setSelectedAvatar(avatar);
      }
    });
    document.querySelectorAll('[data-gallery-category]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-gallery-category]').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        STATE.avatarGalleryFilter = tab.dataset.galleryCategory;
        const track = document.getElementById('avatar-gallery-scroll');
        if (track) track.scrollLeft = 0;
        renderAvatarGallery();
      });
    });
    document.getElementById('avatar-gallery-scroll-right')?.addEventListener('click', () => {
      const track = document.getElementById('avatar-gallery-scroll');
      if (!track) return;
      track.scrollBy({ left: Math.max(280, track.clientWidth * 0.72), behavior: 'smooth' });
    });
    document.getElementById('avatar-gallery-scroll')?.addEventListener('scroll', updateAvatarGalleryScrollBtn, { passive: true });
    window.addEventListener('resize', updateAvatarGalleryScrollBtn);
  }

  function applyHubInspireItem(item) {
    if (!item) return;
    if (item.type === 'workflow') {
      if (item.workflow === 'content2avatar') {
        navigate('content');
        toast('已打开爆款图文，可使用「推送至数字人」完成工作流', 'success');
        return;
      }
      if (item.workflow === 'image2video') {
        navigate('image');
        if (item.prompt) applyImagePrompt(item.prompt);
        setTimeout(() => {
          navigate('video');
          const el = document.getElementById('video-prompt');
          if (el && item.prompt) {
            el.value = item.prompt;
            setDraft('video-script', item.prompt);
          }
          toast('已带入图生视频工作流参数', 'success');
        }, 300);
        return;
      }
      if (item.workflow === 'batch-content') {
        navigate('content');
        toast('已打开批量图文创作工作流（原型演示）', 'success');
        return;
      }
      toast(item.prompt || '工作流（原型演示）', 'info');
      return;
    }
    if (item.type === 'avatar' && item.avatarName) {
      const galleryItem = AVATAR_GALLERY_ITEMS.find(a => a.name === item.avatarName);
      if (galleryItem) {
        setSelectedAvatar(
          { name: galleryItem.name, category: galleryItem.category, emoji: galleryItem.emoji },
          { toast: false }
        );
      }
    }
    if (item.type === 'content' && item.contentTemplate) {
      navigate('content');
      requestAnimationFrame(() => {
        document.querySelectorAll('.content-scene-item').forEach(el => {
          el.classList.toggle('active', el.textContent.trim() === item.contentTemplate);
        });
        const editor = document.getElementById('content-editor');
        if (editor && item.prompt) {
          editor.value = item.prompt;
          setDraft('content-editor', item.prompt);
        }
        toast('已带入「' + item.title + '」灵感', 'success');
      });
      return;
    }
    applyInspirePrompt(item.prompt, item.type);
  }

  function getHubMyWorks() {
    const history = JSON.parse(localStorage.getItem(STORAGE.history) || '{}');
    const types = ['image', 'video', 'avatar', 'content'];
    const labels = { image: 'AI 图片', video: 'AI 视频', avatar: '数字人', content: '爆款图文' };
    const works = [];
    types.forEach(type => {
      (history[type] || []).forEach((item, index) => {
        works.push({
          ...item,
          type,
          module: labels[type],
          index,
          preview: item.preview || item.prompt || item.title || '',
          cost: item.cost ?? (type === 'video' ? 25 : type === 'avatar' ? 30 : 10),
          time: item.time || formatHubTime(item.createdAt),
        });
      });
    });
    works.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return works.slice(0, 6);
  }

  function renderHubTemplates() {
    const grid = document.getElementById('hub-template-grid');
    if (!grid) return;
    const cat = STATE.hubTemplateFilter || 'all';
    const items = filterHubByCategory(HUB_TEMPLATES, cat);
    grid.innerHTML = items.length
      ? items.map(t => `
          <article class="hub-template-card hub-card" data-hub-template="${t.id}">
            <div class="hub-template-thumb">${t.emoji}</div>
            <div class="hub-template-title">${t.title}</div>
          </article>`).join('')
      : '<div class="hub-empty">该分类暂无模板</div>';
    grid.querySelectorAll('[data-hub-template]').forEach(card => {
      card.addEventListener('click', () => {
        const t = HUB_TEMPLATES.find(x => x.id === card.dataset.hubTemplate);
        applyHubTemplate(t);
      });
    });
  }

  function renderHubInspire() {
    const grid = document.getElementById('hub-inspire-grid');
    if (!grid) return;
    const items = filterHubInspireItems();
    grid.innerHTML = items.length
      ? items.map(item => {
          const thumb = item.image
            ? `<img src="${item.image}" alt="${item.title}" loading="lazy">`
            : `<div class="hub-inspire-placeholder">${item.emoji || '✨'}</div>`;
          return `
          <article class="hub-inspire-card hub-card" data-hub-inspire="${item.id}">
            <div class="hub-inspire-thumb">
              ${thumb}
              <div class="hub-inspire-use"><button type="button" class="hub-quick-enter">一键套用</button></div>
            </div>
            <div class="hub-inspire-body">
              <strong>${item.title}</strong>
              <span>${item.author} · ${item.likes.toLocaleString()} 赞</span>
            </div>
          </article>`;
        }).join('')
      : '<div class="hub-empty">该分类暂无灵感内容</div>';
    grid.querySelectorAll('[data-hub-inspire]').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.hub-quick-enter')) e.stopPropagation();
        const item = HUB_INSPIRE_ITEMS.find(x => x.id === card.dataset.hubInspire);
        applyHubInspireItem(item);
      });
    });
  }

  function renderMeWorks() {
    const grid = document.getElementById('me-works-grid');
    if (!grid) return;
    const works = getHubMyWorks();
    const list = works.length ? works : HUB_MY_WORKS_DEMOS;
    grid.innerHTML = list.map(w => {
      const prompt = encodeURIComponent(w.prompt || w.preview || w.script || '');
      return `
      <article class="hub-work-card hub-card" data-hub-work-type="${w.type}" data-work-prompt="${prompt}">
        <div class="hub-work-thumb">${w.emoji || '✨'}</div>
        <div class="hub-work-main">
          <div class="hub-work-title">${w.title || w.preview?.slice(0, 20) || '未命名作品'}</div>
          <div class="hub-work-meta">${w.time} · 消耗 ${w.cost} 积分${w.module ? ' · ' + w.module : ''}</div>
          <div class="hub-work-actions">
            <button type="button" class="hub-work-btn" data-hub-action="reuse">复用</button>
            <button type="button" class="hub-work-btn" data-hub-action="edit">编辑</button>
            <button type="button" class="hub-work-btn" data-hub-action="download">下载</button>
          </div>
        </div>
      </article>`;
    }).join('');
    grid.querySelectorAll('.hub-work-card').forEach(card => {
      card.querySelectorAll('[data-hub-action]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const type = card.dataset.hubWorkType;
          const prompt = decodeURIComponent(card.dataset.workPrompt || '');
          const action = btn.dataset.hubAction;
          if (action === 'reuse') {
            if (type === 'image') applyImagePrompt(prompt);
            else if (prompt) applyInspirePrompt(prompt, type);
            else navigate(type);
          } else if (action === 'edit') {
            navigate(type);
            toast('已进入编辑', 'info');
          } else {
            toast('下载已开始（原型演示）', 'success');
          }
        });
      });
    });
  }

  function updateMeStats() {
    const history = JSON.parse(localStorage.getItem(STORAGE.history) || '{}');
    const total = ['image', 'video', 'avatar', 'content']
      .reduce((sum, type) => sum + (history[type]?.length || 0), 0);
    const el = document.getElementById('me-stat-works');
    if (el) el.textContent = String(total);
  }

  function renderMePage() {
    updateMeStats();
    if (STATE.meSubTab === 'works') renderMeWorks();
  }

  function renderHubPage() {
    renderHubTemplates();
    renderHubInspireSubtabs();
    renderHubInspire();
  }

  function bindHubAdBanners() {
    const carousel = document.getElementById('hub-ad-carousel');
    const track = document.getElementById('hub-ad-carousel-track');
    const dots = document.querySelectorAll('#hub-ad-dots .hub-ad-dot');
    const prevSlide = document.getElementById('hub-ad-carousel-prev');
    const nextSlide = document.getElementById('hub-ad-carousel-next');
    const row = document.getElementById('hub-ad-row');
    const rowPrev = document.getElementById('hub-ad-row-prev');
    const rowNext = document.getElementById('hub-ad-row-next');

    if (track) {
      const slides = Array.from(track.querySelectorAll('.hub-ad-slide'));
      let index = 0;
      let timer = null;
      const AUTOPLAY_MS = 5000;

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        slides.forEach((slide, n) => slide.classList.toggle('is-active', n === index));
        dots.forEach((dot, n) => {
          dot.classList.toggle('is-active', n === index);
          dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
        });
      }

      function startAutoplay() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
      }

      function stopAutoplay() {
        if (timer) clearInterval(timer);
        timer = null;
      }

      prevSlide?.addEventListener('click', e => {
        e.stopPropagation();
        goTo(index - 1);
        startAutoplay();
      });
      nextSlide?.addEventListener('click', e => {
        e.stopPropagation();
        goTo(index + 1);
        startAutoplay();
      });
      dots.forEach(dot => {
        dot.addEventListener('click', e => {
          e.stopPropagation();
          goTo(parseInt(dot.dataset.adDot, 10));
          startAutoplay();
        });
      });
      slides.forEach(slide => {
        slide.addEventListener('click', () => {
          const title = slide.querySelector('.hub-ad-title')?.textContent?.trim() || '活动';
          toast(title + '（原型演示）', 'info');
        });
      });
      carousel?.addEventListener('mouseenter', stopAutoplay);
      carousel?.addEventListener('mouseleave', startAutoplay);
      goTo(0);
      startAutoplay();
    }

    if (row) {
      function updateRowBtns() {
        const maxScroll = row.scrollWidth - row.clientWidth;
        const canScroll = maxScroll > 4;
        const atStart = row.scrollLeft <= 4;
        const atEnd = row.scrollLeft >= maxScroll - 4;
        if (rowPrev) rowPrev.hidden = !canScroll || atStart;
        if (rowNext) rowNext.hidden = !canScroll || atEnd;
      }

      function rowStep() {
        const card = row.querySelector('.hub-ad-card');
        return card ? card.offsetWidth + 14 : 320;
      }

      rowPrev?.addEventListener('click', () => {
        row.scrollBy({ left: -rowStep(), behavior: 'smooth' });
      });
      rowNext?.addEventListener('click', () => {
        row.scrollBy({ left: rowStep(), behavior: 'smooth' });
      });
      row.addEventListener('scroll', updateRowBtns, { passive: true });
      window.addEventListener('resize', updateRowBtns);
      updateRowBtns();
    }

    document.querySelectorAll('.hub-ad-card--static').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.hub-ad-cta')) return;
        const nav = card.dataset.adNav;
        if (nav === 'image') navigate('image');
        else if (nav === 'hub') {
          document.getElementById('hub-inspire-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('.hub-ad-cta').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.adCta;
        if (action === 'image') {
          navigate('image');
          toast('已进入 AI 生成', 'success');
        } else if (action === 'workflow') {
          document.getElementById('hub-inspire-section')?.scrollIntoView({ behavior: 'smooth' });
          STATE.hubInspirePrimary = 'workflow';
          STATE.hubInspireSub = 'all';
          renderHubInspireSubtabs();
          renderHubInspire();
          toast('已打开 FaceFlow 工作流', 'success');
        }
      });
    });
  }

  const HUB_SCENE_PRESETS = {
    'content-media': {
      page: 'content',
      template: '小红书种草',
      prompt: '小红书种草文案，真实体验感，emoji 点缀，分段清晰，适合自媒体传播',
    },
    'image-ecommerce': {
      page: 'image',
      prompt: '电商产品主图，白色背景，产品居中，突出质感与卖点，高清商业摄影风',
    },
    'avatar-host': {
      page: 'avatar',
      prompt: '各位家人们好，今天给大家带来一款超值好物，关注我不迷路，限时优惠不要错过…',
      avatarName: '直播主播',
    },
    'content-sales': {
      page: 'content',
      template: '产品标题',
      prompt: '电商爆款标题，突出核心卖点与优惠信息，吸引点击，适合直播带货场景',
    },
    'workplace-office': {
      page: 'avatar',
      prompt: '各位同事好，今天汇报本周工作进展与下周计划，会议纪要已整理完毕，请查阅…',
      avatarName: '职场精英',
    },
    'knowledge-science': {
      page: 'avatar',
      prompt: '你知道吗？今天我们来聊一个有趣的知识点，用简单易懂的方式讲清楚原理…',
      avatarName: '卡通男孩',
    },
    'brand-promo': {
      page: 'image',
      prompt: '品牌宣传海报，店铺引流视觉，活力配色，突出品牌 LOGO 与优惠信息，适合线上线下传播',
    },
    'family-edu': {
      page: 'image',
      prompt: '儿童绘本插画，温馨启蒙教学场景，色彩柔和，适合亲子阅读与早教内容',
    },
    'life-record': {
      page: 'video',
      prompt: '日常生活 vlog，阳光氛围，咖啡馆、公园、书桌等生活场景切换，适合朋友圈分享',
    },
  };

  function applyHubScenePreset(presetId) {
    const preset = HUB_SCENE_PRESETS[presetId];
    if (!preset) return;

    navigate(preset.page);
    requestAnimationFrame(() => {
      if (preset.page === 'content') {
        if (preset.template) {
          document.querySelectorAll('.content-scene-item').forEach(item => {
            item.classList.toggle('active', item.textContent.trim() === preset.template);
          });
        }
        const editor = document.getElementById('content-editor');
        if (editor && preset.prompt) {
          editor.value = preset.prompt;
          setDraft('content-editor', preset.prompt);
          editor.placeholder = '在此编辑「' + (preset.template || '文案') + '」文案…';
        }
      }
      if (preset.page === 'image' && preset.prompt) {
        const el = document.getElementById('image-prompt');
        if (el) {
          el.value = preset.prompt;
          setDraft('image-prompt', preset.prompt);
        }
      }
      if (preset.page === 'video' && preset.prompt) {
        const el = document.getElementById('video-prompt');
        if (el) {
          el.value = preset.prompt;
          setDraft('video-script', preset.prompt);
        }
      }
      if (preset.page === 'avatar') {
        if (preset.prompt) {
          const el = document.getElementById('avatar-script');
          if (el) {
            el.value = preset.prompt;
            setDraft('avatar-script', preset.prompt);
          }
        }
        if (preset.avatarName) {
          const item = AVATAR_GALLERY_ITEMS.find(a => a.name === preset.avatarName);
          if (item) {
            setSelectedAvatar(
              { name: item.name, category: item.category, emoji: item.emoji },
              { toast: false }
            );
          }
        }
      }
      toast('已带入「' + (document.querySelector('[data-preset="' + presetId + '"] .hub-scene-name')?.textContent?.trim() || '场景') + '」模板', 'success');
    });
  }

  function bindHubSceneRail() {
    const scrollEl = document.getElementById('hub-scene-scroll');
    const prevBtn = document.getElementById('hub-scene-scroll-prev');
    const nextBtn = document.getElementById('hub-scene-scroll-next');
    if (!scrollEl) return;

    function scrollStep() {
      const card = scrollEl.querySelector('.hub-scene-card');
      const gap = 16;
      return card ? card.offsetWidth + gap : 216;
    }

    function updateScrollBtn() {
      const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      const canScroll = maxScroll > 4;
      const atStart = scrollEl.scrollLeft <= 4;
      const atEnd = scrollEl.scrollLeft >= maxScroll - 4;

      if (prevBtn) {
        prevBtn.hidden = atStart;
        prevBtn.disabled = atStart;
      }
      if (nextBtn) {
        nextBtn.hidden = !canScroll || atEnd;
        nextBtn.disabled = !canScroll || atEnd;
      }
    }

    prevBtn?.addEventListener('click', () => {
      scrollEl.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      scrollEl.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });

    scrollEl.addEventListener('scroll', updateScrollBtn, { passive: true });
    window.addEventListener('resize', updateScrollBtn);
    updateScrollBtn();
  }

  function bindHubPage() {
    document.querySelectorAll('.hub-scene-card[data-preset]').forEach(card => {
      card.addEventListener('click', () => {
        applyHubScenePreset(card.dataset.preset);
      });
    });

    bindHubSceneRail();

    document.querySelectorAll('.hub-inspire-tab[data-inspire-primary]').forEach(tab => {
      tab.addEventListener('click', () => {
        const primary = tab.dataset.inspirePrimary;
        STATE.hubInspirePrimary = primary;
        STATE.hubInspireSub = 'all';
        document.querySelectorAll('.hub-inspire-tab[data-inspire-primary]').forEach(t => {
          const active = t.dataset.inspirePrimary === primary;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderHubInspireSubtabs();
        renderHubInspire();
      });
    });

    document.querySelectorAll('.hub-filter-tab[data-hub-target="template"]').forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.hubFilter;
        document.querySelectorAll('.hub-filter-tab[data-hub-target="template"]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.hubTemplateFilter = filter;
        renderHubTemplates();
      });
    });

    bindHubPromoCarousel();
  }

  function bindMePage() {
    document.querySelectorAll('[data-me-tab]:not([data-nav])').forEach(btn => {
      btn.addEventListener('click', () => {
        switchMeSubTab(btn.dataset.meTab);
        navigate('me');
      });
    });
  }

  /* ── Draft Auto-save ── */
  function bindDrafts() {
    document.querySelectorAll('[data-draft]').forEach(el => {
      const key = el.dataset.draft;
      const saved = getDraft(key);
      if (saved && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) {
        if (el.type !== 'checkbox') el.value = saved;
      }
      el.addEventListener('input', debounce(() => {
        setDraft(key, el.value);
        showDraftSaved(el);
      }, 600));
    });
  }

  function getDraft(key) {
    const drafts = JSON.parse(localStorage.getItem(STORAGE.drafts) || '{}');
    return drafts[key];
  }

  function setDraft(key, value) {
    const drafts = JSON.parse(localStorage.getItem(STORAGE.drafts) || '{}');
    drafts[key] = value;
    localStorage.setItem(STORAGE.drafts, JSON.stringify(drafts));
  }

  function showDraftSaved(el) {
    const hint = el.closest('.form-group')?.querySelector('.draft-hint')
      || document.getElementById('avatar-draft-status');
    if (hint) {
      hint.textContent = '✓ 草稿已自动保存';
      hint.classList.add('saved');
      setTimeout(() => {
        hint.textContent = '内容将自动保存为草稿';
        hint.classList.remove('saved');
      }, 2000);
    }
  }

  /* ── Generation ── */
  function bindGeneration() {
    document.querySelectorAll('[data-generate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.generate;
        const cost = parseInt(btn.dataset.cost || '10', 10);
        if (STATE.credits < cost) {
          showModal('quota');
          return;
        }
        startGeneration(type, cost, btn);
      });
    });
    document.querySelectorAll('[data-demo-error]').forEach(btn => {
      btn.addEventListener('click', () => showModal(btn.dataset.demoError));
    });
  }

  function startGeneration(type, cost, btn) {
    if (STATE.generating) return;
    STATE.generating = true;
    if (btn) btn.disabled = true;

    const useInline = type === 'image' || type === 'avatar';
    const overlay = document.getElementById('gen-overlay');
    const inlineWrap = type === 'image'
      ? document.getElementById('image-gen-progress')
      : type === 'avatar'
        ? document.getElementById('avatar-gen-progress')
        : null;
    const fill = type === 'image'
      ? document.getElementById('image-gen-progress-fill')
      : type === 'avatar'
        ? document.getElementById('avatar-gen-progress-fill')
        : document.getElementById('gen-progress-fill');
    const status = type === 'image'
      ? document.getElementById('image-gen-status')
      : type === 'avatar'
        ? document.getElementById('avatar-gen-status')
        : document.getElementById('gen-status');
    const eta = type === 'image'
      ? document.getElementById('image-gen-eta')
      : type === 'avatar'
        ? document.getElementById('avatar-gen-eta')
        : document.getElementById('gen-eta');
    const genText = btn?.querySelector('.avatar-gen-text');

    if (useInline && inlineWrap) {
      inlineWrap.hidden = false;
    } else {
      overlay.classList.add('show');
    }

    if (type === 'avatar' && genText) genText.textContent = '生成中…';
    if (type === 'avatar') btn?.classList.add('is-generating');

    const messages = GEN_MESSAGES[type] || GEN_MESSAGES.image;
    let progress = 0;
    let msgIndex = 0;
    status.textContent = messages[0];
    eta.textContent = '预计剩余 ' + (type === 'video' ? '45' : '20') + ' 秒';
    fill.style.width = '0%';

    const finish = () => {
      if (useInline && inlineWrap) {
        inlineWrap.hidden = true;
      } else {
        overlay.classList.remove('show');
      }
      fill.style.width = '0%';
      STATE.generating = false;
      if (btn) btn.disabled = false;
      if (type === 'avatar') {
        btn?.classList.remove('is-generating');
        if (genText) genText.textContent = '生成';
      }
      STATE.credits -= cost;
      saveCredits();
      addHistory(type);
      toast('生成成功！已消耗 ' + cost + ' 积分', 'success');
      if (useInline) {
        switchImageSubTab('works');
      } else if (type === 'video') {
        switchVideoSubTab('history');
      } else if (type === 'avatar') {
        switchAvatarSubTab('history');
      } else if (type === 'content') {
        switchContentSubTab('history');
      }
    };

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.width = '100%';
        status.textContent = '生成完成';
        setTimeout(finish, 500);
        return;
      }
      fill.style.width = progress + '%';
      const newIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
      if (newIndex !== msgIndex) {
        msgIndex = newIndex;
        status.textContent = messages[msgIndex];
      }
      eta.textContent = '预计剩余 ' + Math.max(1, Math.round((100 - progress) / 5)) + ' 秒';
    }, 400);
  }

  function updateImageCost() {
    const count = parseInt(document.getElementById('image-count-select')?.value || '1', 10);
    const cost = count * 10;
    const label = document.getElementById('image-cost-label');
    const btn = document.querySelector('[data-generate="image"]');
    if (label) label.textContent = cost;
    if (btn) btn.dataset.cost = String(cost);
  }

  function getActiveDuration() {
    const active = document.querySelector('#page-video .duration-btn.active');
    return (active?.dataset.duration || '5') + 's';
  }

  function updateVideoCost(duration) {
    const costs = { '3': 15, '5': 25, '8': 40 };
    const cost = costs[duration] || 25;
    const costEl = document.getElementById('video-cost');
    const labelEl = document.getElementById('video-cost-label');
    const genBtn = document.getElementById('video-generate-btn');
    if (costEl) costEl.textContent = cost;
    if (labelEl) labelEl.textContent = cost;
    if (genBtn) genBtn.dataset.cost = cost;
  }

  function addHistory(type) {
    const history = JSON.parse(localStorage.getItem(STORAGE.history) || '{}');
    if (!history[type]) history[type] = [];
    const count = parseInt(document.getElementById('image-count-select')?.value || '1', 10);
    const imageCost = count * 10;
    const items = {
      image: {
        title: 'AI 生成图片 #' + (history.image?.length + 1 || 1),
        time: '刚刚',
        prompt: getDraft('image-prompt') || getDraft('image-simple') || 'AI 生成作品',
        preview: (getDraft('image-prompt') || getDraft('image-simple') || 'AI 生成作品').slice(0, 48),
        cost: imageCost,
        emoji: '🖼',
        ratio: document.getElementById('image-ratio-select')?.value || '1:1',
        count,
        model: document.getElementById('image-model-select')?.value || '智能图片 V2',
        starred: false,
        createdAt: Date.now(),
      },
      video: (() => {
        const snap = getVideoHistoryPayload();
        return {
          title: 'AI 生成视频 #' + (history.video?.length + 1 || 1),
          time: '刚刚',
          duration: snap.duration,
          cost: parseInt(document.getElementById('video-cost-label')?.textContent || '25', 10),
          prompt: snap.prompt || 'AI 生成视频',
          preview: snap.preview,
          model: snap.model,
          ratio: snap.ratio,
          mode: snap.mode,
          scene: snap.scene,
          emoji: '🎬',
          starred: false,
          createdAt: Date.now(),
        };
      })(),
      avatar: {
        title: '数字人视频 #' + (history.avatar?.length + 1 || 1),
        time: '刚刚',
        preview: getDraft('avatar-script')?.slice(0, 48) || '口播内容…',
        script: getDraft('avatar-script') || '',
        prompt: getDraft('avatar-script') || '',
        ratio: document.getElementById('avatar-ratio-select')?.value || '16:9 · 1080p',
        cost: parseInt(document.getElementById('avatar-generate-btn')?.dataset.cost || '20', 10),
        emoji: STATE.avatar.emoji || '👔',
        avatarName: STATE.avatar.name || '',
        starred: false,
        createdAt: Date.now(),
      },
      content: {
        title: '爆款文案 #' + (history.content?.length + 1 || 1),
        time: '刚刚',
        preview: getDraft('content-editor')?.slice(0, 60) || '新生成的文案内容…',
        prompt: getDraft('content-editor') || '',
        cost: 5,
        emoji: '📝',
        starred: false,
        createdAt: Date.now(),
      },
    };
    if (items[type]) {
      history[type].unshift(items[type]);
      history[type] = history[type].slice(0, 10);
      localStorage.setItem(STORAGE.history, JSON.stringify(history));
      renderHistory(type);
      renderMeWorks();
      updateMeStats();
    }
  }

  function applyImagePrompt(prompt) {
    switchImageSubTab('create');
    const input = document.getElementById('image-prompt');
    if (input) {
      input.value = prompt;
      setDraft('image-prompt', prompt);
    }
  }

  function setSelectByValue(selectId, value) {
    const sel = document.getElementById(selectId);
    if (!sel || value == null) return;
    const str = String(value);
    for (const opt of sel.options) {
      if (opt.value === str) {
        sel.value = str;
        return;
      }
    }
  }

  function setImageModel(modelName) {
    const sel = document.getElementById('image-model-select');
    if (!sel || !modelName) return;
    for (const opt of sel.options) {
      if (opt.text === modelName || opt.value === modelName) {
        sel.value = opt.value;
        return;
      }
    }
  }

  function applyImageSceneTemplate(template, mode) {
    if (!template) return;
    applyImagePrompt(template.prompt);
    setImageModel(template.model);
    if (mode === 'template') {
      setSelectByValue('image-ratio-select', template.ratio);
      setSelectByValue('image-count-select', template.count);
      updateImageCost();
    }
    document.getElementById('image-prompt')?.focus({ preventScroll: true });
    toast(mode === 'model' ? '已切换模型并套用示例提示词' : '已套用模板参数与提示词', 'success');
  }

  function getImageSceneTemplate(id) {
    return IMAGE_SCENE_TEMPLATES.find(t => t.id === id);
  }

  function filterImageSceneTemplates() {
    const filter = STATE.imageInspireFilter || 'all';
    if (filter === 'all') return IMAGE_SCENE_TEMPLATES;
    if (filter === 'weekly') return IMAGE_SCENE_TEMPLATES.filter(t => t.weekly);
    if (filter === 'hot') return IMAGE_SCENE_TEMPLATES.filter(t => t.hot);
    return IMAGE_SCENE_TEMPLATES.filter(t => t.category === filter);
  }

  function renderImageInspireCard(t) {
    return `
      <div class="image-inspire-card" data-template-id="${t.id}" tabindex="0" role="group" aria-label="${t.title}">
        <div class="image-inspire-thumb-wrap">
          <div class="image-inspire-thumb">
            <img src="${t.image}" alt="${t.title}" loading="lazy">
          </div>
        </div>
        <div class="image-inspire-card-action">
          <button type="button" class="btn btn-sm btn-primary image-inspire-overlay-btn" data-inspire-action="template">使用该模板</button>
        </div>
        <div class="image-inspire-body">
          <strong>${t.title}</strong>
          <span>${t.desc}</span>
        </div>
      </div>`;
  }

  function renderImageInspireStrip() {
    const strip = document.getElementById('image-inspire-strip');
    if (!strip) return;
    const items = filterImageSceneTemplates();
    strip.innerHTML = items.length
      ? items.map(renderImageInspireCard).join('')
      : '<div class="image-inspire-empty">该分类暂无模板，试试切换其他标签</div>';
    bindImageInspireCards(strip);
  }

  function bindImageInspireCards(container) {
    const isTouch = window.matchMedia('(hover: none)').matches;
    container.querySelectorAll('.image-inspire-card[data-template-id]').forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = '1';
      const template = () => getImageSceneTemplate(card.dataset.templateId);

      card.querySelector('[data-inspire-action="template"]')?.addEventListener('click', e => {
        e.stopPropagation();
        applyImageSceneTemplate(template(), 'template');
        card.classList.remove('is-active');
      });

      card.addEventListener('click', e => {
        if (e.target.closest('[data-inspire-action]')) return;
        if (isTouch && !card.classList.contains('is-active')) {
          container.querySelectorAll('.image-inspire-card.is-active').forEach(c => c.classList.remove('is-active'));
          card.classList.add('is-active');
          return;
        }
        applyImageSceneTemplate(template(), 'template');
        card.classList.remove('is-active');
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyImageSceneTemplate(template(), 'template');
        }
      });
    });

    if (isTouch && !document.body.dataset.inspireTouchBound) {
      document.body.dataset.inspireTouchBound = '1';
      document.addEventListener('click', e => {
        if (!e.target.closest('.image-inspire-card')) {
          document.querySelectorAll('.image-inspire-card.is-active').forEach(c => c.classList.remove('is-active'));
        }
      });
    }
  }

  function bindImageInspireCategories() {
    document.querySelectorAll('#image-inspire-category-tabs [data-inspire-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#image-inspire-category-tabs [data-inspire-filter]').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        STATE.imageInspireFilter = tab.dataset.inspireFilter;
        renderImageInspireStrip();
      });
    });

    document.getElementById('image-inspire-sort')?.addEventListener('click', () => {
      toast('推荐排序（原型演示）');
    });
  }

  function filterImageHistory(history) {
    const filter = STATE.imageWorksFilter || 'all';
    if (filter === 'starred') return history.filter(h => h.starred);
    if (filter === 'recent') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return history.filter(h => (h.createdAt || Date.now()) >= weekAgo);
    }
    return history;
  }

  function filterVideoHistory(history) {
    const filter = STATE.videoWorksFilter || 'all';
    if (filter === 'recent') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return history.filter(h => (h.createdAt || Date.now()) >= weekAgo);
    }
    return history;
  }

  function filterAvatarHistory(history) {
    const filter = STATE.avatarWorksFilter || 'all';
    if (filter === 'recent') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return history.filter(h => (h.createdAt || Date.now()) >= weekAgo);
    }
    return history;
  }

  function applyAvatarHistoryItem(item, fullEdit) {
    const script = item?.script || item?.prompt || '';
    if (!script) return;
    switchAvatarSubTab('create');
    const editor = document.getElementById('avatar-script');
    if (editor) {
      editor.value = script;
      setDraft('avatar-script', script);
      showDraftSaved(editor);
    }
    if (!fullEdit) return;
    if (item.ratio) setSelectByValue('avatar-ratio-select', item.ratio);
    if (item.avatarName) {
      const avatar = getAvatarByName(item.avatarName);
      if (avatar) setSelectedAvatar(avatar, { toast: false });
    }
    editor?.focus();
  }

  function getAvatarItemFromCard(card) {
    if (!card) return null;
    if (card.dataset.item) {
      try {
        return JSON.parse(decodeURIComponent(card.dataset.item));
      } catch (_) { /* fall through */ }
    }
    return { prompt: decodeURIComponent(card.dataset.prompt || '') };
  }

  function filterContentHistory(history) {
    const filter = STATE.contentWorksFilter || 'all';
    if (filter === 'recent') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return history.filter(h => (h.createdAt || Date.now()) >= weekAgo);
    }
    return history;
  }

  function applyContentHistoryItem(item, fullEdit) {
    const text = item?.prompt || item?.preview || '';
    if (!text) return;
    switchContentSubTab('create');
    const editor = document.getElementById('content-editor');
    if (editor) {
      editor.value = text;
      setDraft('content-editor', text);
      if (fullEdit) editor.focus();
    }
  }

  function getContentItemFromCard(card) {
    if (!card) return null;
    if (card.dataset.item) {
      try {
        return JSON.parse(decodeURIComponent(card.dataset.item));
      } catch (_) { /* fall through */ }
    }
    return { prompt: decodeURIComponent(card.dataset.prompt || '') };
  }

  function workIcon(type) {
    if (type === 'edit') {
      return `<svg class="studio-work-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-3.5z"/></svg>`;
    }
    return `<svg class="studio-work-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;
  }

  function renderStudioWorkIconbar(demo, starred) {
    const disabled = demo ? ' disabled' : '';
    const starClass = starred ? ' active' : '';
    return `
      <div class="studio-work-iconbar">
        <button type="button" class="studio-work-icon-btn studio-work-icon-btn--edit" data-action="edit" title="二次编辑" aria-label="二次编辑"${disabled}>${workIcon('edit')}</button>
        <button type="button" class="studio-work-icon-btn studio-work-icon-btn--delete" data-action="delete" title="删除" aria-label="删除"${disabled}>${workIcon('delete')}</button>
        <button type="button" class="studio-work-icon-btn studio-work-icon-btn--star${starClass}" data-action="star" title="${starred ? '取消收藏' : '收藏'}" aria-label="${starred ? '取消收藏' : '收藏'}"${disabled}>★</button>
      </div>`;
  }

  function showDeleteConfirm({ title, desc, onConfirm }) {
    const overlay = document.getElementById('confirm-overlay');
    const titleEl = document.getElementById('confirm-title');
    const descEl = document.getElementById('confirm-desc');
    const okBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');
    if (!overlay || !okBtn || !cancelBtn) {
      if (onConfirm) onConfirm();
      return;
    }
    if (titleEl) titleEl.textContent = title || '确认删除';
    if (descEl) descEl.textContent = desc || '删除后将无法恢复，是否继续？';
    const close = () => overlay.classList.remove('show');
    cancelBtn.onclick = close;
    okBtn.onclick = () => {
      close();
      if (onConfirm) onConfirm();
    };
    overlay.onclick = e => {
      if (e.target === overlay) close();
    };
    overlay.classList.add('show');
  }

  function toggleWorkStar(type, index) {
    const all = JSON.parse(localStorage.getItem(STORAGE.history) || '{}');
    if (!all[type]?.[index]) return;
    all[type][index].starred = !all[type][index].starred;
    localStorage.setItem(STORAGE.history, JSON.stringify(all));
    renderHistory(type);
    if (type === 'image') renderMeWorks();
    toast(all[type][index].starred ? '已加入收藏' : '已取消收藏', 'success');
  }

  function deleteWorkHistoryItem(type, index) {
    const all = JSON.parse(localStorage.getItem(STORAGE.history) || '{}');
    if (!all[type]?.[index]) return;
    all[type].splice(index, 1);
    localStorage.setItem(STORAGE.history, JSON.stringify(all));
    renderHistory(type);
    if (type === 'image') renderMeWorks();
    toast(
      type === 'video' ? '已删除视频记录'
        : type === 'avatar' ? '已删除形象作品'
          : type === 'content' ? '已删除图文作品'
            : '已删除作品',
      'info',
    );
  }

  function applyImageHistoryItem(item, fullEdit) {
    if (!item?.prompt) return;
    switchImageSubTab('create');
    applyImagePrompt(item.prompt);
    if (!fullEdit) return;
    setImageModel(item.model);
    setSelectByValue('image-ratio-select', item.ratio);
    if (item.count != null) setSelectByValue('image-count-select', item.count);
  }

  function getImageItemFromCard(card) {
    if (!card) return null;
    if (card.dataset.item) {
      try {
        return JSON.parse(decodeURIComponent(card.dataset.item));
      } catch (_) { /* fall through */ }
    }
    return { prompt: decodeURIComponent(card.dataset.prompt || '') };
  }

  function renderVideoWorkCard(h, index, demo) {
    const preview = h.preview || h.prompt?.slice(0, 42) || 'AI 生成视频';
    const metaExtra = [h.duration, h.model, h.ratio].filter(Boolean).join(' · ');
    const demoClass = demo ? ' is-demo' : '';
    const disabled = demo ? ' disabled' : '';
    const itemPayload = encodeURIComponent(JSON.stringify({
      prompt: h.prompt || h.preview || '',
      mode: h.mode || 'text2video',
      scene: h.scene || '',
      model: h.model || 'Seedance 2.0',
      ratio: h.ratio || '智能比例 · 720p',
      duration: h.duration || '5s',
      cost: h.cost || 25,
    }));
    return `
      <article class="studio-work-card video-work-card${demoClass}" data-index="${index}" data-prompt="${encodeURIComponent(h.prompt || h.preview || '')}" data-item="${itemPayload}">
        <div class="studio-work-thumb">
          <span class="studio-work-emoji">${h.emoji || '🎬'}</span>
          <span class="studio-work-play" aria-hidden="true">▶</span>
          <span class="studio-work-duration-badge">${h.duration || '5s'}</span>
          <div class="studio-work-cover-shine" aria-hidden="true"></div>
        </div>
        ${renderStudioWorkIconbar(demo, h.starred)}
        <div class="studio-work-body">
          <h4 class="studio-work-title">${h.title || 'AI 生成视频'}</h4>
          <p class="studio-work-prompt">${preview}</p>
          <div class="studio-work-meta">
            <span>${h.time || '刚刚'}</span>
            ${metaExtra ? `<span> · ${metaExtra}</span>` : ''}
            <span class="studio-work-cost"> · ⚡ ${h.cost || 25}</span>
          </div>
          <div class="studio-work-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="reuse"${disabled}>复用</button>
            <button type="button" class="btn btn-sm btn-secondary" data-action="download"${disabled}>下载</button>
          </div>
        </div>
      </article>`;
  }

  function renderVideoHistoryEmpty() {
    return `
      <div class="video-history-empty-layout">
        <div class="video-history-empty-main">
          <div class="video-history-empty-icon">🎬</div>
          <h4 class="video-history-empty-title">还没有历史视频</h4>
          <p class="video-history-empty-tip">在「视频创作」页输入描述、上传参考素材并点击生成，作品将自动保存在这里。</p>
          <button type="button" class="btn btn-primary btn-sm video-history-empty-cta" data-switch-video-tab="create">去创作</button>
        </div>
        <div class="video-history-empty-demo">
          <div class="video-history-demo-label">示例预览</div>
          <div class="video-works-grid video-works-grid--demo">
            ${VIDEO_HISTORY_DEMOS.map(d => renderVideoWorkCard(d, -1, true)).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderVideoFilterEmpty() {
    const labels = { recent: '最近7天' };
    return `
      <div class="video-history-empty video-history-filter-empty">
        <div class="video-history-empty-icon">🔍</div>
        <h4 class="video-history-empty-title">暂无${labels[STATE.videoWorksFilter] || ''}视频</h4>
        <p class="video-history-empty-tip">切换筛选条件，或去创作页生成新视频。</p>
        <button type="button" class="btn btn-secondary btn-sm" data-switch-video-filter="all">查看全部</button>
      </div>`;
  }

  function bindVideoHistoryActions(container) {
    container.querySelectorAll('[data-switch-video-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchVideoSubTab(btn.dataset.switchVideoTab));
    });
    container.querySelectorAll('[data-switch-video-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.videoWorksFilter = btn.dataset.switchVideoFilter;
        document.querySelectorAll('[data-tab-group="video-works-filter"] [data-tab]').forEach(t => {
          t.classList.toggle('active', t.dataset.tab === STATE.videoWorksFilter);
        });
        renderHistory('video');
      });
    });
    container.querySelectorAll('.studio-work-card.video-work-card:not(.is-demo) [data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.studio-work-card');
        const action = btn.dataset.action;
        const index = parseInt(card?.dataset.index || '-1', 10);
        const item = getVideoItemFromCard(card);

        if (action === 'star' && index >= 0) {
          toggleWorkStar('video', index);
        } else if (action === 'edit' && item) {
          applyVideoHistoryItem(item, true);
          toast('已载入创作参数，可进行二次编辑', 'success');
        } else if (action === 'reuse' && item) {
          applyVideoHistoryItem(item, false);
          toast('已复用历史提示词', 'success');
        } else if (action === 'download') {
          toast('开始下载视频…', 'info');
        } else if (action === 'delete' && index >= 0) {
          showDeleteConfirm({
            title: '确认删除视频',
            desc: '删除后将无法恢复该历史记录，是否继续？',
            onConfirm: () => deleteWorkHistoryItem('video', index),
          });
        }
      });
    });
    container.querySelectorAll('.studio-work-card.video-work-card:not(.is-demo)').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        toast('正在打开预览…', 'info');
      });
    });
  }

  function renderImageWorkCard(h, index, demo) {
    const preview = h.preview || h.prompt?.slice(0, 42) || 'AI 生成作品';
    const metaExtra = [h.ratio, h.count ? h.count + ' 张' : '', h.model].filter(Boolean).join(' · ');
    const demoClass = demo ? ' is-demo' : '';
    const disabled = demo ? ' disabled' : '';
    const itemPayload = encodeURIComponent(JSON.stringify({
      prompt: h.prompt || h.preview || '',
      model: h.model || '',
      ratio: h.ratio || '',
      count: h.count || 1,
    }));
    return `
      <article class="studio-work-card image-work-card${demoClass}" data-index="${index}" data-prompt="${encodeURIComponent(h.prompt || h.preview || '')}" data-item="${itemPayload}">
        <div class="studio-work-thumb studio-work-thumb--image">
          <span class="studio-work-emoji">${h.emoji || '🖼'}</span>
          <div class="studio-work-cover-shine" aria-hidden="true"></div>
        </div>
        ${renderStudioWorkIconbar(demo, h.starred)}
        <div class="studio-work-body">
          <h4 class="studio-work-title">${h.title || 'AI 生成图片'}</h4>
          <p class="studio-work-prompt">${preview}</p>
          <div class="studio-work-meta">
            <span>${h.time || '刚刚'}</span>
            ${metaExtra ? `<span> · ${metaExtra}</span>` : ''}
            <span class="studio-work-cost"> · ⚡ ${h.cost || 10}</span>
          </div>
          <div class="studio-work-actions studio-work-actions--3">
            <button type="button" class="btn btn-sm btn-primary" data-action="reuse"${disabled}>复用</button>
            <button type="button" class="btn btn-sm btn-secondary" data-action="download"${disabled}>下载</button>
            <button type="button" class="btn btn-sm btn-ghost" data-action="img2img"${disabled}>图生图</button>
          </div>
        </div>
      </article>`;
  }

  function renderImageHistoryEmpty() {
    return `
      <div class="image-history-empty-layout">
        <div class="image-history-empty-main">
          <div class="image-history-empty-icon">🖼</div>
          <h4 class="image-history-empty-title">还没有作品</h4>
          <p class="image-history-empty-tip">在「图片创作」页填写描述或选择灵感模板，点击生成后作品将出现在这里。</p>
          <button type="button" class="btn btn-primary btn-sm image-history-empty-cta" data-switch-image-tab="create">去创作</button>
        </div>
        <div class="image-history-empty-demo">
          <div class="image-history-demo-label">示例预览</div>
          <div class="image-works-grid image-works-grid--demo studio-works-grid">
            ${IMAGE_HISTORY_DEMOS.map(d => renderImageWorkCard({ ...d, starred: false }, -1, true)).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderImageFilterEmpty() {
    const labels = { starred: '收藏', recent: '最近7天' };
    return `
      <div class="image-history-empty image-history-filter-empty">
        <div class="image-history-empty-icon">🔍</div>
        <h4 class="image-history-empty-title">暂无${labels[STATE.imageWorksFilter] || ''}作品</h4>
        <p class="image-history-empty-tip">切换筛选条件，或去创作页生成新作品并收藏。</p>
        <button type="button" class="btn btn-secondary btn-sm" data-switch-image-filter="all">查看全部</button>
      </div>`;
  }

  function bindImageHistoryActions(container) {
    container.querySelectorAll('[data-switch-image-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchImageSubTab(btn.dataset.switchImageTab);
      });
    });
    container.querySelectorAll('[data-switch-image-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.imageWorksFilter = btn.dataset.switchImageFilter;
        document.querySelectorAll('[data-tab-group="image-works-filter"] [data-tab]').forEach(t => {
          t.classList.toggle('active', t.dataset.tab === STATE.imageWorksFilter);
        });
        renderHistory('image');
      });
    });
    container.querySelectorAll('.studio-work-card.image-work-card:not(.is-demo) [data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.studio-work-card');
        const action = btn.dataset.action;
        const index = parseInt(card?.dataset.index || '-1', 10);
        const item = getImageItemFromCard(card);
        const prompt = item?.prompt || decodeURIComponent(card?.dataset.prompt || '');

        if (action === 'star' && index >= 0) {
          toggleWorkStar('image', index);
        } else if (action === 'edit' && item) {
          applyImageHistoryItem(item, true);
          toast('已载入创作参数，可进行二次编辑', 'success');
        } else if (action === 'reuse' && prompt) {
          applyImageHistoryItem(item || { prompt }, false);
          toast('已复用历史提示词', 'success');
        } else if (action === 'download') {
          toast('开始下载…', 'info');
        } else if (action === 'img2img' && prompt) {
          applyImageHistoryItem(item || { prompt }, false);
          toast('已进入图生图创作', 'info');
        } else if (action === 'delete' && index >= 0) {
          showDeleteConfirm({
            title: '确认删除作品',
            desc: '删除后将无法恢复该作品记录，是否继续？',
            onConfirm: () => deleteWorkHistoryItem('image', index),
          });
        }
      });
    });
    container.querySelectorAll('.studio-work-card.image-work-card:not(.is-demo)').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        toast('正在打开预览…', 'info');
      });
    });
  }

  function renderAvatarWorkCard(h, index, demo) {
    const preview = h.preview || h.script?.slice(0, 42) || h.prompt?.slice(0, 42) || '口播内容…';
    const ratioLabel = (h.ratio || '16:9 · 1080p').split('·')[0].trim();
    const metaExtra = [h.avatarName, h.ratio].filter(Boolean).join(' · ');
    const demoClass = demo ? ' is-demo' : '';
    const disabled = demo ? ' disabled' : '';
    const itemPayload = encodeURIComponent(JSON.stringify({
      prompt: h.prompt || h.script || h.preview || '',
      script: h.script || h.prompt || h.preview || '',
      ratio: h.ratio || '16:9 · 1080p',
      avatarName: h.avatarName || '',
      cost: h.cost || 20,
    }));
    return `
      <article class="studio-work-card avatar-work-card${demoClass}" data-index="${index}" data-prompt="${encodeURIComponent(h.prompt || h.script || h.preview || '')}" data-item="${itemPayload}">
        <div class="studio-work-thumb studio-work-thumb--avatar">
          <span class="studio-work-emoji">${h.emoji || '🤖'}</span>
          <span class="studio-work-play" aria-hidden="true">▶</span>
          <span class="studio-work-duration-badge">${ratioLabel}</span>
          <div class="studio-work-cover-shine" aria-hidden="true"></div>
        </div>
        ${renderStudioWorkIconbar(demo, h.starred)}
        <div class="studio-work-body">
          <h4 class="studio-work-title">${h.title || '数字人视频'}</h4>
          <p class="studio-work-prompt">${preview}</p>
          <div class="studio-work-meta">
            <span>${h.time || '刚刚'}</span>
            ${metaExtra ? `<span> · ${metaExtra}</span>` : ''}
            <span class="studio-work-cost"> · ⚡ ${h.cost || 20}</span>
          </div>
          <div class="studio-work-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="reuse"${disabled}>复用</button>
            <button type="button" class="btn btn-sm btn-secondary" data-action="download"${disabled}>下载</button>
          </div>
        </div>
      </article>`;
  }

  function renderAvatarHistoryEmpty() {
    return `
      <div class="video-history-empty-layout avatar-history-empty-layout">
        <div class="video-history-empty-main">
          <div class="video-history-empty-icon">🤖</div>
          <h4 class="video-history-empty-title">还没有形象作品</h4>
          <p class="video-history-empty-tip">在「数字人创作」页选择形象与口播模板，点击生成后作品将自动保存在这里。</p>
          <button type="button" class="btn btn-primary btn-sm video-history-empty-cta" data-switch-avatar-tab="create">去创作</button>
        </div>
        <div class="video-history-empty-demo">
          <div class="video-history-demo-label">示例预览</div>
          <div class="video-works-grid video-works-grid--demo">
            ${AVATAR_HISTORY_DEMOS.map(d => renderAvatarWorkCard(d, -1, true)).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderAvatarFilterEmpty() {
    const labels = { recent: '最近7天' };
    return `
      <div class="video-history-empty avatar-history-filter-empty">
        <div class="video-history-empty-icon">🔍</div>
        <h4 class="video-history-empty-title">暂无${labels[STATE.avatarWorksFilter] || ''}形象作品</h4>
        <p class="video-history-empty-tip">切换筛选条件，或去创作页生成新作品。</p>
        <button type="button" class="btn btn-secondary btn-sm" data-switch-avatar-filter="all">查看全部</button>
      </div>`;
  }

  function renderContentWorkCard(h, index, demo) {
    const preview = h.preview || h.prompt?.slice(0, 42) || '文案内容…';
    const demoClass = demo ? ' is-demo' : '';
    const disabled = demo ? ' disabled' : '';
    const itemPayload = encodeURIComponent(JSON.stringify({
      prompt: h.prompt || h.preview || '',
      cost: h.cost || 5,
    }));
    return `
      <article class="studio-work-card content-work-card${demoClass}" data-index="${index}" data-prompt="${encodeURIComponent(h.prompt || h.preview || '')}" data-item="${itemPayload}">
        <div class="studio-work-thumb studio-work-thumb--content">
          <span class="studio-work-emoji">${h.emoji || '📝'}</span>
          <div class="studio-work-cover-shine" aria-hidden="true"></div>
        </div>
        ${renderStudioWorkIconbar(demo, h.starred)}
        <div class="studio-work-body">
          <h4 class="studio-work-title">${h.title || '爆款文案'}</h4>
          <p class="studio-work-prompt">${preview}</p>
          <div class="studio-work-meta">
            <span>${h.time || '刚刚'}</span>
            <span class="studio-work-cost"> · ⚡ ${h.cost || 5}</span>
          </div>
          <div class="studio-work-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="reuse"${disabled}>复用</button>
            <button type="button" class="btn btn-sm btn-secondary" data-action="copy"${disabled}>复制</button>
          </div>
        </div>
      </article>`;
  }

  function renderContentHistoryEmpty() {
    return `
      <div class="video-history-empty-layout content-history-empty-layout">
        <div class="video-history-empty-main">
          <div class="video-history-empty-icon">📝</div>
          <h4 class="video-history-empty-title">还没有历史图文</h4>
          <p class="video-history-empty-tip">在「爆款图文」页选择场景模板、编辑文案并点击生成，作品将自动保存在这里。</p>
          <button type="button" class="btn btn-primary btn-sm video-history-empty-cta" data-switch-content-tab="create">去创作</button>
        </div>
        <div class="video-history-empty-demo">
          <div class="video-history-demo-label">示例预览</div>
          <div class="video-works-grid video-works-grid--demo">
            ${CONTENT_HISTORY_DEMOS.map(d => renderContentWorkCard(d, -1, true)).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderContentFilterEmpty() {
    const labels = { recent: '最近7天' };
    return `
      <div class="video-history-empty content-history-filter-empty">
        <div class="video-history-empty-icon">🔍</div>
        <h4 class="video-history-empty-title">暂无${labels[STATE.contentWorksFilter] || ''}图文作品</h4>
        <p class="video-history-empty-tip">切换筛选条件，或去创作页生成新文案。</p>
        <button type="button" class="btn btn-secondary btn-sm" data-switch-content-filter="all">查看全部</button>
      </div>`;
  }

  function bindContentHistoryActions(container) {
    container.querySelectorAll('[data-switch-content-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchContentSubTab(btn.dataset.switchContentTab));
    });
    container.querySelectorAll('[data-switch-content-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.contentWorksFilter = btn.dataset.switchContentFilter;
        document.querySelectorAll('[data-tab-group="content-works-filter"] [data-tab]').forEach(t => {
          t.classList.toggle('active', t.dataset.tab === STATE.contentWorksFilter);
        });
        renderHistory('content');
      });
    });
    container.querySelectorAll('.studio-work-card.content-work-card:not(.is-demo) [data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.studio-work-card');
        const action = btn.dataset.action;
        const index = parseInt(card?.dataset.index || '-1', 10);
        const item = getContentItemFromCard(card);

        if (action === 'star' && index >= 0) {
          toggleWorkStar('content', index);
        } else if (action === 'edit' && item) {
          applyContentHistoryItem(item, true);
          toast('已载入创作参数，可进行二次编辑', 'success');
        } else if (action === 'reuse' && item) {
          applyContentHistoryItem(item, false);
          toast('已复用历史文案', 'success');
        } else if (action === 'copy' && item) {
          const text = item.prompt || item.preview || '';
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => toast('已复制文案', 'success'));
          } else {
            toast('已复制文案', 'success');
          }
        } else if (action === 'delete' && index >= 0) {
          showDeleteConfirm({
            title: '确认删除作品',
            desc: '删除后将无法恢复该图文作品，是否继续？',
            onConfirm: () => deleteWorkHistoryItem('content', index),
          });
        }
      });
    });
    container.querySelectorAll('.studio-work-card.content-work-card:not(.is-demo)').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        const item = getContentItemFromCard(card);
        if (item?.prompt) {
          applyContentHistoryItem(item, false);
          toast('已载入文案预览', 'info');
        }
      });
    });
  }

  function bindAvatarHistoryActions(container) {
    container.querySelectorAll('[data-switch-avatar-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchAvatarSubTab(btn.dataset.switchAvatarTab));
    });
    container.querySelectorAll('[data-switch-avatar-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.avatarWorksFilter = btn.dataset.switchAvatarFilter;
        document.querySelectorAll('[data-tab-group="avatar-works-filter"] [data-tab]').forEach(t => {
          t.classList.toggle('active', t.dataset.tab === STATE.avatarWorksFilter);
        });
        renderHistory('avatar');
      });
    });
    container.querySelectorAll('.studio-work-card.avatar-work-card:not(.is-demo) [data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.studio-work-card');
        const action = btn.dataset.action;
        const index = parseInt(card?.dataset.index || '-1', 10);
        const item = getAvatarItemFromCard(card);

        if (action === 'star' && index >= 0) {
          toggleWorkStar('avatar', index);
        } else if (action === 'edit' && item) {
          applyAvatarHistoryItem(item, true);
          toast('已载入创作参数，可进行二次编辑', 'success');
        } else if (action === 'reuse' && item) {
          applyAvatarHistoryItem(item, false);
          toast('已复用历史口播文案', 'success');
        } else if (action === 'download') {
          toast('开始下载数字人视频…', 'info');
        } else if (action === 'delete' && index >= 0) {
          showDeleteConfirm({
            title: '确认删除作品',
            desc: '删除后将无法恢复该形象作品，是否继续？',
            onConfirm: () => deleteWorkHistoryItem('avatar', index),
          });
        }
      });
    });
    container.querySelectorAll('.studio-work-card.avatar-work-card:not(.is-demo)').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        toast('正在打开预览…', 'info');
      });
    });
  }

  function getRecentAvatars() {
    const saved = JSON.parse(localStorage.getItem(STORAGE.recentAvatars) || 'null');
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_RECENT_AVATARS;
  }

  function applyQuickAvatar(avatar) {
    setSelectedAvatar(avatar, { toast: false });
  }

  function syncAvatarSelectValue() {
    const select = document.getElementById('avatar-avatar-select');
    if (!select) return;
    if (!STATE.avatar.name) {
      select.value = '';
      return;
    }
    const hasOption = Array.from(select.options).some(o => o.value === STATE.avatar.name);
    select.value = hasOption ? STATE.avatar.name : '';
  }

  function renderAvatarSelect() {
    const select = document.getElementById('avatar-avatar-select');
    if (!select) return;
    const frequent = getFrequentAvatars();
    const options = frequent.map(a => `
      <option value="${a.name}" data-category="${a.category}" data-emoji="${a.emoji}">
        ${a.emoji} ${a.name}
      </option>`).join('');
    select.innerHTML = `<option value="">选择数字人形象</option>${options}<option value="${AVATAR_SELECT_MORE}">查看全部形象 →</option>`;
    syncAvatarSelectValue();
  }

  function renderHistory(type) {
    const container = document.getElementById(type + '-history');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem(STORAGE.history) || '{}')[type] || [];

    if (type === 'image') {
      const all = history;
      const filtered = filterImageHistory(all);
      if (!all.length) {
        container.innerHTML = renderImageHistoryEmpty();
      } else if (!filtered.length) {
        container.innerHTML = renderImageFilterEmpty();
      } else {
        container.innerHTML = filtered.map((h, i) => {
          const realIndex = all.indexOf(h);
          return renderImageWorkCard(h, realIndex >= 0 ? realIndex : i, false);
        }).join('');
      }
      bindImageHistoryActions(container);
    } else if (type === 'video') {
      const all = history;
      const filtered = filterVideoHistory(all);
      if (!all.length) {
        container.innerHTML = renderVideoHistoryEmpty();
      } else if (!filtered.length) {
        container.innerHTML = renderVideoFilterEmpty();
      } else {
        container.innerHTML = filtered.map((h, i) => {
          const realIndex = all.indexOf(h);
          return renderVideoWorkCard(h, realIndex >= 0 ? realIndex : i, false);
        }).join('');
      }
      bindVideoHistoryActions(container);
    } else if (type === 'avatar') {
      const all = history;
      const filtered = filterAvatarHistory(all);
      if (!all.length) {
        container.innerHTML = renderAvatarHistoryEmpty();
      } else if (!filtered.length) {
        container.innerHTML = renderAvatarFilterEmpty();
      } else {
        container.innerHTML = filtered.map((h, i) => {
          const realIndex = all.indexOf(h);
          return renderAvatarWorkCard(h, realIndex >= 0 ? realIndex : i, false);
        }).join('');
      }
      bindAvatarHistoryActions(container);
    } else if (type === 'content') {
      const all = history;
      const filtered = filterContentHistory(all);
      if (!all.length) {
        container.innerHTML = renderContentHistoryEmpty();
      } else if (!filtered.length) {
        container.innerHTML = renderContentFilterEmpty();
      } else {
        container.innerHTML = filtered.map((h, i) => {
          const realIndex = all.indexOf(h);
          return renderContentWorkCard(h, realIndex >= 0 ? realIndex : i, false);
        }).join('');
      }
      bindContentHistoryActions(container);
    }
  }

  /* ── Modals ── */
  const MODAL_CONTENT = {
    network: { icon: '⚠', type: 'error', title: '网络异常', desc: '网络连接不稳定，请检查网络后重试。' },
    timeout: { icon: '⏱', type: 'warning', title: 'API 超时', desc: '服务响应超时，请稍后重试或联系客服。' },
    quota: { icon: '💳', type: 'error', title: '剩余额度不足', desc: '当前积分不足以完成本次生成，请充值后再试。' },
    violation: { icon: '🚫', type: 'error', title: '内容违规', desc: '输入内容包含违规信息，请修改后重新提交。' },
  };

  function bindModals() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => hideModal());
    });
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') hideModal();
    });
  }

  function showModal(type) {
    const data = MODAL_CONTENT[type];
    if (!data) return;
    document.getElementById('modal-icon').textContent = data.icon;
    document.getElementById('modal-icon').className = 'modal-icon ' + data.type;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-overlay').classList.add('show');
  }

  function hideModal() {
    document.getElementById('modal-overlay').classList.remove('show');
  }

  function bindTopbar() {
    const profile = document.getElementById('topbar-profile');
    const menu = document.getElementById('profile-menu');
    profile?.addEventListener('click', e => {
      e.stopPropagation();
      menu?.classList.toggle('show');
    });
    document.addEventListener('click', () => menu?.classList.remove('show'));

    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-open');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    });

  }

  function bindInspire() {
    document.querySelectorAll('[data-inspire-open]').forEach(btn => {
      btn.addEventListener('click', () => openInspire(btn.dataset.inspireOpen || inspireContext));
    });
    document.getElementById('inspire-close')?.addEventListener('click', closeInspire);
    document.getElementById('inspire-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'inspire-overlay') closeInspire();
    });
    document.querySelectorAll('[data-inspire-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-inspire-filter]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        inspireFilter = tab.dataset.inspireFilter;
        renderInspireGrid();
      });
    });
    document.getElementById('inspire-search')?.addEventListener('input', debounce(renderInspireGrid, 200));
    renderInspireGrid();
  }

  function openInspire(type) {
    inspireContext = type || inspireContext;
    if (['image', 'video', 'content', 'avatar', 'avatar-speech'].includes(type)) inspireFilter = type;
    document.querySelectorAll('[data-inspire-filter]').forEach(t => {
      t.classList.toggle('active', t.dataset.inspireFilter === inspireFilter);
    });
    renderInspireGrid();
    document.getElementById('inspire-overlay')?.classList.add('show');
  }

  function closeInspire() {
    document.getElementById('inspire-overlay')?.classList.remove('show');
  }

  function renderInspireGrid() {
    const grid = document.getElementById('inspire-panel-grid');
    if (!grid) return;
    const q = (document.getElementById('inspire-search')?.value || '').trim().toLowerCase();
    const items = getInspireTemplates().filter(t => {
      if (inspireFilter !== 'all' && t.type !== inspireFilter) return false;
      const haystack = [t.title, t.badge, t.prompt].filter(Boolean).join(' ').toLowerCase();
      if (q && !haystack.includes(q)) return false;
      return true;
    });
    grid.innerHTML = items.map(t => {
      if (t.avatarPick) {
        return `
      <div class="inspire-card inspire-card-avatar" data-inspire-avatar="${t.title}" data-inspire-type="avatar">
        <span class="inspire-badge">${t.badge}</span>
        <div class="inspire-thumb">${t.emoji}</div>
        <p>${t.title}</p>
      </div>`;
      }
      return `
      <div class="inspire-card" data-inspire-prompt="${encodeURIComponent(t.prompt)}" data-inspire-type="${t.type}">
        <span class="inspire-badge">${t.badge}</span>
        <div class="inspire-thumb">${t.emoji}</div>
        <p>${t.title}</p>
      </div>`;
    }).join('') || '<div class="empty-state" style="grid-column:1/-1">暂无匹配模板</div>';
    bindInspireCards(grid);
  }

  function bindInspireCards(root) {
    root.querySelectorAll('.inspire-card').forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = '1';
      card.addEventListener('click', () => {
        const avatarName = card.dataset.inspireAvatar;
        if (avatarName) {
          const item = AVATAR_GALLERY_ITEMS.find(a => a.name === avatarName);
          if (!item) return;
          setSelectedAvatar({ name: item.name, category: item.category, emoji: item.emoji });
          if (STATE.currentPage !== 'avatar') navigate('avatar');
          closeInspire();
          return;
        }
        if (!card.dataset.inspirePrompt) return;
        const type = card.dataset.inspireType || (card.closest('#page-video') ? 'video' : 'image');
        applyInspirePrompt(decodeURIComponent(card.dataset.inspirePrompt), type);
      });
    });
  }

  function applyInspirePrompt(prompt, type) {
    const resolvedType = type === 'avatar-speech' ? 'avatar' : type;
    const targets = {
      video: { el: document.getElementById('video-prompt'), draft: 'video-script' },
      content: { el: document.getElementById('content-editor'), draft: 'content-editor' },
      avatar: { el: document.getElementById('avatar-script'), draft: 'avatar-script' },
      image: { el: document.getElementById('image-prompt'), draft: 'image-prompt' },
    };
    const entry = targets[resolvedType] || targets.image;
    if (type === 'image') {
      applyImagePrompt(prompt);
      if (resolvedType !== STATE.currentPage) navigate(resolvedType);
      closeInspire();
      toast('已套用场景示例文案', 'success');
      return;
    }
    if (entry.el) {
      entry.el.value = prompt;
      setDraft(entry.draft, prompt);
      if (resolvedType === 'video') {
        const imgDesc = document.querySelector('[data-draft="video-img-desc"]');
        if (imgDesc) {
          imgDesc.value = prompt;
          setDraft('video-img-desc', prompt);
        }
      }
      if (resolvedType === 'avatar') {
        const editor = document.getElementById('avatar-script');
        if (editor) showDraftSaved(editor);
      }
      if (resolvedType !== STATE.currentPage && ['image', 'video', 'avatar', 'content'].includes(resolvedType)) navigate(resolvedType);
      closeInspire();
      toast(type === 'avatar-speech' ? '已应用口播模版' : '已应用模板提示词', 'success');
    }
  }

  /* ── Page-specific bindings ── */
  function bindPageSpecific() {
    /* Tabs */
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const name = group.dataset.tabGroup;
      group.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
          if (name === 'image-sub') {
            switchImageSubTab(tab.dataset.tab);
            return;
          }
          if (name === 'video-sub') {
            switchVideoSubTab(tab.dataset.tab);
            return;
          }
          if (name === 'avatar-sub') {
            switchAvatarSubTab(tab.dataset.tab);
            return;
          }
          if (name === 'content-sub') {
            switchContentSubTab(tab.dataset.tab);
            return;
          }
          if (name === 'video-works-filter') {
            STATE.videoWorksFilter = tab.dataset.tab;
            group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderHistory('video');
            return;
          }
          if (name === 'avatar-works-filter') {
            STATE.avatarWorksFilter = tab.dataset.tab;
            group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderHistory('avatar');
            return;
          }
          if (name === 'content-works-filter') {
            STATE.contentWorksFilter = tab.dataset.tab;
            group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderHistory('content');
            return;
          }
          if (name === 'me-sub') {
            switchMeSubTab(tab.dataset.tab);
            return;
          }
          group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          document.querySelectorAll('[data-panel="' + name + '"]').forEach(p => {
            p.classList.toggle('active', p.dataset.panelValue === tab.dataset.tab);
          });
          if (name === 'video-mode') {
            document.getElementById('video-composer')?.setAttribute('data-mode', tab.dataset.tab);
          }
          if (name === 'image-works-filter') {
            STATE.imageWorksFilter = tab.dataset.tab;
            renderHistory('image');
          }
        });
      });
    });

    document.getElementById('image-count-select')?.addEventListener('change', updateImageCost);
    updateImageCost();

    /* Image scene templates */
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        card.closest('.template-grid')?.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const prompt = card.dataset.scenePrompt;
        if (prompt) applyImagePrompt(prompt);
      });
    });

    /* Video scene template select */
    document.getElementById('video-scene-select')?.addEventListener('change', e => {
      applyVideoScenePrompt(e.target.value);
    });

    const ASSET_LABELS = { video: '视频', image: '图片', audio: '音频' };
    document.querySelectorAll('.video-asset-btn[data-asset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = ASSET_LABELS[btn.dataset.asset] || '文件';
        toast('请选择' + label + '上传', 'info');
      });
    });

    /* Style tags (image page) */
    document.querySelectorAll('.image-style-tags .tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const input = document.getElementById('image-prompt');
        if (input) {
          input.value = (input.value ? input.value + '，' : '') + tag.textContent;
          setDraft('image-prompt', input.value);
        }
      });
    });

    /* Duration buttons */
    document.querySelectorAll('.duration-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.duration-options')?.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateVideoCost(btn.dataset.duration);
      });
    });

    /* Voice selection */
    document.querySelectorAll('.voice-item').forEach(item => {
      item.addEventListener('click', () => {
        item.closest('.voice-grid')?.querySelectorAll('.voice-item').forEach(v => v.classList.remove('active'));
        item.classList.add('active');
      });
    });

    /* Switches */
    document.querySelectorAll('.switch').forEach(sw => {
      sw.addEventListener('click', () => sw.classList.toggle('on'));
    });

    document.querySelectorAll('[data-mod-disabled]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        toast('动作模仿功能即将上线', 'info');
      });
    });

    document.getElementById('avatar-picker-close')?.addEventListener('click', () => closeAvatarPicker(true));
    document.getElementById('avatar-picker-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'avatar-picker-overlay') closeAvatarPicker(true);
    });

    document.getElementById('avatar-avatar-select')?.addEventListener('change', e => {
      const select = e.target;
      const value = select.value;
      if (value === AVATAR_SELECT_MORE) {
        syncAvatarSelectValue();
        openAvatarPicker();
        return;
      }
      if (!value) {
        setSelectedAvatar(null, { toast: false });
        return;
      }
      const option = select.selectedOptions[0];
      if (!option) return;
      setSelectedAvatar({
        name: value,
        category: option.dataset.category,
        emoji: option.dataset.emoji,
      });
    });

    document.getElementById('avatar-template-select')?.addEventListener('change', e => {
      const select = e.target;
      const value = select.value;
      if (!value) return;
      if (value === '__inspire__') {
        select.value = '';
        openInspire('avatar-speech');
        return;
      }
      const editor = document.getElementById('avatar-script');
      if (editor) {
        editor.value = value;
        setDraft('avatar-script', value);
        editor.focus();
        showDraftSaved(editor);
        toast('已应用「' + select.selectedOptions[0]?.textContent.trim() + '」模板', 'success');
      }
      select.value = '';
    });

    document.querySelectorAll('[data-picker-category]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-picker-category]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterAvatars(tab.dataset.pickerCategory, document.getElementById('avatar-picker-grid'));
      });
    });

    document.querySelectorAll('#avatar-picker-grid .avatar-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.avatar-card-actions')) return;
        previewAvatarInPicker(card);
      });
    });

    document.getElementById('btn-avatar-picker-select')?.addEventListener('click', confirmAvatarPicker);
    document.getElementById('btn-avatar-picker-voice')?.addEventListener('click', () => {
      previewAvatarVoice(document.getElementById('btn-avatar-picker-voice'));
    });

    document.getElementById('btn-preview-voice')?.addEventListener('click', () => previewAvatarVoice());
    document.getElementById('avatar-voice-select')?.addEventListener('change', () => {
      const voiceEl = document.getElementById('avatar-picker-voice-name');
      if (voiceEl) voiceEl.textContent = document.getElementById('avatar-voice-select')?.value || '温柔女声';
    });

    /* Avatar select */
    document.querySelectorAll('#page-avatar-select [data-avatar-category]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#page-avatar-select [data-avatar-category]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterAvatars(tab.dataset.avatarCategory, document.querySelector('#page-avatar-select .avatar-grid'));
      });
    });

    document.querySelectorAll('#page-avatar-select .avatar-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.avatar-card-actions')) return;
        selectAvatar(card);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.getElementById('avatar-picker-overlay')?.classList.contains('show')) {
        closeAvatarPicker(true);
      }
    });

    document.querySelectorAll('[data-pin-avatar]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        btn.classList.toggle('pinned');
        toast(btn.classList.contains('pinned') ? '已置顶' : '已取消置顶', 'info');
      });
    });

    document.querySelectorAll('[data-fav-avatar]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toast('已收藏形象', 'success');
      });
    });

    /* Content template nav */
    document.querySelectorAll('.template-nav-item, .content-scene-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.template-nav-item, .content-scene-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const editor = document.getElementById('content-editor');
        if (editor) {
          editor.placeholder = '在此编辑「' + item.textContent.trim() + '」文案…';
        }
      });
    });

    /* Content toolbar */
    document.getElementById('btn-rewrite')?.addEventListener('click', () => toast('风格改写完成', 'success'));
    document.getElementById('btn-wordcount')?.addEventListener('click', () => toast('已调整至目标字数', 'info'));
    document.getElementById('btn-keywords')?.addEventListener('click', () => toast('关键词已植入', 'info'));

    /* Push to digital human */
    document.getElementById('btn-push-digital')?.addEventListener('click', () => {
      const content = document.getElementById('content-editor')?.value;
      if (!content?.trim()) {
        toast('请先编辑文案内容', 'info');
        return;
      }
      setDraft('avatar-script', content);
      const avatarEditor = document.getElementById('avatar-script');
      if (avatarEditor) avatarEditor.value = content;
      toast('文案已同步至数字人模块', 'success');
      navigate('avatar');
    });

    /* Receive from content */
    document.getElementById('btn-receive-content')?.addEventListener('click', () => {
      const content = getDraft('content-editor');
      if (content) {
        const editor = document.getElementById('avatar-script');
        if (editor) {
          editor.value = content;
          setDraft('avatar-script', content);
          toast('已接收爆款图文文案', 'success');
        }
      } else {
        toast('暂无待接收的图文文案', 'info');
      }
    });

    /* Hub workspace */
    bindHubPage();
    bindMePage();
    renderHubPage();
    renderMePage();

    /* Avatar change button */
    renderHistory('image');
    renderHistory('video');
    renderHistory('avatar');
    renderHistory('content');
    updateAvatarPreview();
    renderAvatarSelect();
    bindImageInspireCategories();
    renderImageInspireStrip();
    bindInspireCards(document);
  }

  function filterAvatars(category, root) {
    const scope = root || document;
    scope.querySelectorAll('.avatar-card').forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.style.display = show ? '' : 'none';
    });
  }

  function avatarFromCard(card) {
    return {
      name: card.dataset.name,
      category: card.dataset.category,
      emoji: card.dataset.emoji,
      desc: card.querySelector('.avatar-card-info .text-muted')?.textContent?.trim() || '',
    };
  }

  function syncPickerPreview(avatar) {
    const panel = document.getElementById('avatar-picker-preview-panel');
    const emojiEl = document.getElementById('avatar-picker-preview-emoji');
    const nameEl = document.getElementById('avatar-picker-preview-name');
    const descEl = document.getElementById('avatar-picker-preview-desc');
    const voiceEl = document.getElementById('avatar-picker-voice-name');
    if (!avatar?.name) {
      panel?.setAttribute('hidden', '');
      return;
    }
    panel?.removeAttribute('hidden');
    if (emojiEl) emojiEl.textContent = avatar.emoji;
    if (nameEl) nameEl.textContent = avatar.name;
    if (descEl) descEl.textContent = avatar.desc || '点击左侧形象可预览';
    if (voiceEl) voiceEl.textContent = document.getElementById('avatar-voice-select')?.value || '温柔女声';
    document.getElementById('avatar-picker-preview-stage')?.classList.remove('is-previewing');
  }

  function highlightPickerCard(name) {
    document.querySelectorAll('#avatar-picker-grid .avatar-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.name === name);
    });
  }

  function openAvatarPicker(preselectName) {
    const name = preselectName || STATE.avatar.name;
    const galleryItem = getAvatarByName(name);
    pickerPendingAvatar = name
      ? {
          name,
          category: galleryItem?.category || STATE.avatar.category,
          emoji: galleryItem?.emoji || STATE.avatar.emoji,
          desc: galleryItem?.desc || '',
        }
      : null;
    document.querySelectorAll('[data-picker-category]').forEach(t => {
      t.classList.toggle('active', t.dataset.pickerCategory === 'all');
    });
    filterAvatars('all', document.getElementById('avatar-picker-grid'));
    if (pickerPendingAvatar?.name) {
      highlightPickerCard(pickerPendingAvatar.name);
      syncPickerPreview(pickerPendingAvatar);
    } else {
      highlightPickerCard('');
      syncPickerPreview(null);
    }
    const overlay = document.getElementById('avatar-picker-overlay');
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAvatarPicker(applyPending = true) {
    if (applyPending && pickerPendingAvatar?.name) {
      setSelectedAvatar(pickerPendingAvatar, { toast: false });
    }
    const overlay = document.getElementById('avatar-picker-overlay');
    overlay?.classList.remove('show');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('avatar-picker-preview-stage')?.classList.remove('is-previewing');
    document.getElementById('avatar-picker-preview-panel')?.setAttribute('hidden', '');
  }

  function previewAvatarInPicker(card) {
    pickerPendingAvatar = avatarFromCard(card);
    highlightPickerCard(pickerPendingAvatar.name);
    syncPickerPreview(pickerPendingAvatar);
    const stage = document.getElementById('avatar-picker-preview-stage');
    stage?.classList.add('is-previewing');
    setTimeout(() => stage?.classList.remove('is-previewing'), 800);
  }

  function confirmAvatarPicker() {
    if (!pickerPendingAvatar?.name) {
      toast('请先选择一个形象', 'info');
      return;
    }
    setSelectedAvatar(pickerPendingAvatar);
    closeAvatarPicker(false);
  }

  function selectAvatar(card, fromModal = false) {
    const avatar = avatarFromCard(card);
    if (fromModal) {
      pickerPendingAvatar = avatar;
      confirmAvatarPicker();
      return;
    }
    document.querySelectorAll('#page-avatar-select .avatar-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    setSelectedAvatar(avatar);
    setTimeout(() => navigate('avatar'), 400);
  }

  function previewAvatarVoice(btnEl) {
    const btn = btnEl || document.getElementById('btn-preview-voice');
    const voice = document.getElementById('avatar-voice-select')?.value?.trim() || '当前音色';
    const avatarName = pickerPendingAvatar?.name || STATE.avatar.name || '数字人';
    const text = document.getElementById('avatar-script')?.value?.trim()
      || ('你好，我是' + avatarName + '，这是当前音色的试听效果，欢迎体验 Facemini 数字人创作。');
    const sample = text.slice(0, 100);
    btn?.classList.add('is-playing');
    toast('正在试听「' + voice + '」…', 'info');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(sample);
      utter.lang = 'zh-CN';
      const speed = Number(document.getElementById('avatar-speed-select')?.value || 50);
      utter.rate = 0.6 + (speed / 100) * 0.9;
      utter.onend = () => btn?.classList.remove('is-playing');
      utter.onerror = () => btn?.classList.remove('is-playing');
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => btn?.classList.remove('is-playing'), 1500);
    }
  }

  function updateAvatarPreview() {
    renderAvatarSelect();
    renderAvatarGallery();
  }

  /* ── Toast ── */
  function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  /* ── Utils ── */
  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  /* ── Public API ── */
  window.fmApp = { navigate, showModal, toast, startGeneration };

  document.addEventListener('DOMContentLoaded', init);
})();
