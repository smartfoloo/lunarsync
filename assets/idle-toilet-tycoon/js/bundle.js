!function () {
    "use strict";
    class t {
        constructor() { }
        static init() {
            Laya.ClassUtils.regClass;
        }
    }
    t.width = 750, t.height = 1334, t.scaleMode = "showall", t.screenMode = "none",
        t.alignV = "middle", t.alignH = "center", t.startScene = "", t.sceneRoot = "", t.debug = !1,
        t.stat = !1, t.physicsDebug = !1, t.exportSceneToJson = !0, t.init();
    class e {
        static addScrCon(t) { }
        static addCommonCon() { }
    }
    class i { }
    i.logStyle = "\n        color: #fff;\n        background-color: #8d93ab;\n        border-radius: 3px;\n        line-height: 15px;\n        ",
        i.logLightStyle = "\n        color: #52575d;\n        background-color: #EBEBEB;\n        border-radius: 3px;\n        line-height: 15px;\n        ",
        i.comStyle = "\n        color: #fff;\n        background-color: #ade498;\n        border-radius: 3px;\n        line-height: 15px;\n        ",
        i.warnStyle = "\n        color: #5c6e06;\n        background-color: #ffa931;\n        border-radius: 3px;\n        line-height: 15px;\n        ",
        i.errorStyle = "\n        color: #fff;\n        background-color: #ec0101;\n        border-radius: 3px;\n        line-height: 15px;\n        ",
        i.platformStyle = "\n        color: #52575d;\n        background-color: #e3fdfd;\n        border-radius: 3px;\n        line-height: 15px;\n        ";
    class s {
        static log(...t) {
            console.log(`%c ${t}`, i.logStyle);
        }
        static warn(...t) {
            console.log(`%c ${t}`, i.warnStyle);
        }
        static error(...t) {
            console.log(`%c ${t}`, i.errorStyle);
        }
        static packLog(...t) {
            return [`%c ${t} `, i.logStyle];
        }
        static packLogLight(...t) {
            return [`%c ${t} `, i.logLightStyle];
        }
        static comLog(...t) {
            return [`%c ${t} `, i.comStyle];
        }
        static packWarn(...t) {
            return [`%c 警告: ${t} `, i.warnStyle];
        }
        static packError(...t) {
            return [`%c 错误: ${t} `, i.errorStyle];
        }
        static packPlatform(...t) {
            return [`%c 平台: ${t} `, i.platformStyle];
        }
    }
    class a {
        static Load(t, e, i = null) {
            if (i && i.once && (i.once = !1), !t || 0 == t.length) return e.run(), void i.run();
            Laya.loader.create(t, e, i);
        }
        static Load2d(t, e, i = null) {
            if (i && i.once && (i.once = !1), !t || 0 == t.length) return e.run(), void i.run();
            Laya.loader.load(t, e, i);
        }
        static LoadAsync(t, e = null) {
            return new Promise(i => {
                a.Load(t, Laya.Handler.create(null, () => {
                    i();
                }), e);
            });
        }
        static Load2dAsync(t, e = null) {
            return new Promise(function (i) {
                a.Load2d(t, Laya.Handler.create(null, () => {
                    i();
                }), e);
            });
        }
        static Get(t, e = !1) {
            let i = Laya.loader.getRes(t);
            return null == i ? (console.log(...s.packError("资源尚未加载", t)), null) : e ? i : i.clone();
        }
        static LoadAndGet(t, e = !1) {
            return new Promise(i => {
                a.LoadAsync(t).then(s => {
                    i(a.Get(t, e));
                });
            });
        }
        static Unload(t) {
            Laya.loader.clearRes(t);
        }
    }
    class n {
        static parseVector3(t, e) {
            var i = t.split(",");
            e.setValue(Number(i[0]), Number(i[1]), Number(i[2]));
        }
        static setV3Length(t, e) {
            let i = Laya.Vector3.scalarLength(t);
            if (0 != i) {
                let s = e / i;
                t.x = t.x * s, t.y = t.y * s, t.z = t.z * s;
            }
        }
        static PotLerpMove(t, e, i, s, a) {
            if (!s) return void console.error("必须有一个输出的向量！");
            let n = Laya.Vector3.distance(t, e);
            return Laya.Vector3.lerp(t, e, i, s), 1 - n / a;
        }
        static PotConstantSpeedMove(t, e, i, s) {
            if (!s) return void console.error("必须有一个输出的向量！");
            let a, n = new Laya.Vector3();
            return Laya.Vector3.subtract(e, t, n), Laya.Vector3.scalarLength(n) > i ? (this.setV3Length(n, i),
                a = !1) : a = !0, Laya.Vector3.add(t, n, s), a;
        }
    }
    class o {
        static initNode(t, e) {
            t.name = e.name, e.position ? n.parseVector3(e.position, t.transform.localPosition) : t.transform.localPosition.setValue(0, 0, 0),
                t.transform.localPosition = t.transform.localPosition, e.euler ? n.parseVector3(e.euler, t.transform.localRotationEuler) : t.transform.localRotationEuler.setValue(0, 0, 0),
                t.transform.localRotationEuler = t.transform.localRotationEuler, e.scale ? n.parseVector3(e.scale, t.transform.localScale) : t.transform.localScale.setValue(1, 1, 1),
                t.transform.localScale = t.transform.localScale, "undefined" != (e = e).prefabName && e.differ && this.setDiffer(t, e.differ);
        }
        static setDiffer(t, e) {
            if (e.child) for (let i of e.child) this.setDiffer(t.getChildAt(i.index), i);
            e.position && (n.parseVector3(e.position, this._centreV3), Laya.Vector3.add(t.transform.localPosition, this._centreV3, this._centreV3),
                this._centreV3.cloneTo(t.transform.localPosition), t.transform.localPosition = t.transform.localPosition),
                e.euler && (n.parseVector3(e.euler, this._centreV3), Laya.Vector3.add(t.transform.localRotationEuler, this._centreV3, this._centreV3),
                    this._centreV3.cloneTo(t.transform.localRotationEuler), t.transform.localRotationEuler = t.transform.localRotationEuler),
                e.scale && (n.parseVector3(e.scale, this._centreV3), Laya.Vector3.add(t.transform.localScale, this._centreV3, this._centreV3),
                    this._centreV3.cloneTo(t.transform.localScale), t.transform.localScale = t.transform.localScale);
        }
    }
    o._centreV3 = new Laya.Vector3();
    class r {
        static get Datas() {
            return this.m_datas;
        }
        static set Datas(t) {
            this.m_datas = t;
        }
        static get Handlers() {
            return this.m_handlers;
        }
        static set Handlers(t) {
            this.m_handlers = t;
        }
    }
    r.m_ifSetProxy = !1;
    class l extends r { }
    class h {
        constructor() {
            this.Prefabs0 = "@library@@canteen@@waterRoom@@maleSink@@toilet@@peeArea@@famaleSink@@waitAera@",
                this.Prefabs1 = "@Building@@Plane@@YY@", this.Prefabs2 = "@Toilet@@Potted@", this.Prefabs3 = "@man_actionhero@@man_butler@@man_cyclist@@man_doctor@@man_metalhead@@man_naval_officer@@man_paramedic@@man_pilot@@man_reporter@@man_scientist@@man_skate@@man_tennis@",
                this.Prefabs4 = "@woman_basketball_player@@woman_carpenter@@woman_casual@@woman_dentist@@woman_doctor@@woman_metalhead@@woman_tennis@@woman_wh@@female_worker@@male_worker@",
                this.Prefabs5 = "@caidai@@cleaning@@emoji_money@@emoji_angry@@emoji_cry@@emoji_cute@@emoji_dead@@emoji_happy@@emoji_poop@@emoji_sick@@pee@@money@@hushen@@shui@@urine@@pg@@yan@@sink_Damage@@sink_Dirty@@toilet_damage@@toilet_dirty@@pee_dirty@@pee_Damage@@cleanRoom@@Entrance@@Exit@@door@@male_wall@@female_wall@@VendingMachine@@limit@@ZS@",
                this.Export = "";
        }
    }
    var c, d;
    !function (t) {
        t.Export = "export";
    }(c || (c = {}));
    class m extends h { }
    class u {
        static get defaultLevelSceneName() {
            return c.Export;
        }
    }
    !function (t) {
        t.RootRes = "res", t.Config = "Config", t.Font = "Font", t.FGUI = "FGUI", t.LvConfig = "LvConfig",
            t.Other = "Other", t.icon = "icon", t.img = "img", t.music = "music", t.sound = "sound",
            t.skin = "skin";
    }(d || (d = {}));
    class _ { }
    _.CDNURLs = [];
    class g { }
    g.subpackages = [{
        name: "res",
        root: "res/"
    }, {
        name: "Prefabs0",
        root: "Prefabs0/"
    }, {
        name: "Prefabs1",
        root: "Prefabs1/"
    }, {
        name: "Prefabs2",
        root: "Prefabs2/"
    }, {
        name: "Prefabs3",
        root: "Prefabs3/"
    }, {
        name: "Prefabs4",
        root: "Prefabs4/"
    }, {
        name: "Prefabs5",
        root: "Prefabs5/"
    }];
    class f {
        constructor() {
            this.m_KeyResList = {}, this.m_KeyResList_ = {}, this.m_KeyResList = {
                [d.RootRes]: d.RootRes + "/",
                [d.Config]: d.RootRes + "/" + d.Config + "/",
                [d.FGUI]: d.RootRes + "/" + d.FGUI + "/",
                [d.LvConfig]: d.RootRes + "/" + d.LvConfig + "/",
                [d.Font]: d.RootRes + "/" + d.Font + "/",
                [d.Other]: d.RootRes + "/" + d.Other + "/",
                [d.icon]: d.RootRes + "/" + d.Other + "/" + d.icon + "/",
                [d.img]: d.RootRes + "/" + d.Other + "/" + d.img + "/",
                [d.music]: d.RootRes + "/" + d.Other + "/" + d.music + "/",
                [d.sound]: d.RootRes + "/" + d.Other + "/" + d.sound + "/",
                [d.skin]: d.RootRes + "/" + d.Other + "/" + d.skin + "/"
            };
            let t = new m();
            for (let e in t) d[e] = e, this.m_KeyResList[d[e]] = d.RootRes + "/" + d[e] + "/",
                console.log(...s.packLogLight("注入预制体资源路径", this.m_KeyResList[d[e]]));
            for (let t in this.m_KeyResList) this.m_KeyResList_[t] = this.m_KeyResList[t];
            this.setRes();
        }
        static get instance() {
            return null == this._instance && (this._instance = new f()), this._instance;
        }
        setRes() {
            for (let t of g.subpackages) this.editKeyResList(t.name, t.root);
            for (let t of _.CDNURLs) this.editKeyResList(t.name, t.root);
        }
        ifKeyRes(t) {
            let e = !1;
            for (let i in d) if (t == d[i]) {
                e = !0;
                break;
            }
            return e;
        }
        getResURL(t) {
            return this.m_KeyResList[t];
        }
        editKeyResList(t, e) {
            let i = this.m_KeyResList_[t];
            if (i) {
                console.log(...s.packLog("修改关键点资源路径", i, "替换成", e));
                for (let t in this.m_KeyResList) this.m_KeyResList[t] = this.m_KeyResList[t].replace(i, e);
                this.m_KeyResList_[t] = e;
            } else console.log(...s.packWarn("修改资源路径失败，没有" + t + "这个关键路径！"));
        }
    }
    class p {
        static EssentialOtherResUrl() {
            return [];
        }
        static levelConfigURL(t) {
            return f.instance.getResURL(d.LvConfig) + t + ".json";
        }
        static ConfigURL(t) {
            return f.instance.getResURL(d.Config) + t;
        }
        static FGUIPack(t) {
            return f.instance.getResURL(d.FGUI) + t;
        }
        static prefab_url(t) {
            for (let e in this._AllPrefabsNames) if (-1 != this._AllPrefabsNames[e].indexOf("@" + t + "@")) return f.instance.getResURL(d[e]) + "Conventional/" + t + ".lh";
            console.log(...s.packError("没有在场景找到预制体", t, "可能是没有导出场景预制体列表导致的。"));
        }
    }
    p._AllPrefabsNames = new m();
    class y {
        static Unique(t) {
            return Array.from(new Set(t));
        }
        static ReverseReserveUnique(t) {
            return Array.from(new Set(t.reverse())).reverse();
        }
        static ObjUnique(t, e) {
            for (let i = 0, s = t.length; i < s; i++) for (let s = i + 1, a = t.length; s < a; s++) e(t[i]) === e(t[s]) && (t.splice(s, 1),
                s--, a--);
            return t;
        }
        static Replace(t, e, i) {
            let s = t.indexOf(e);
            return !(s < 0) && (t.splice(s, 1, i), !0);
        }
        static RemoveItem(t, e) {
            let i = t.indexOf(e);
            return !(i < 0) && (t.splice(i, 1), !0);
        }
        static RemoveAt(t, e) {
            return !(t.length <= e) && (t.splice(e, 1), !0);
        }
        static Contains(t, e) {
            return t.indexOf(e) >= 0;
        }
        static Copy(t) {
            let e = [];
            for (let i = 0; i < t.length; ++i) e.push(t[i]);
            return e;
        }
        static upsetArray(t) {
            t.sort(() => Math.random() - .5);
        }
        static RandomGet(t, e = 1, i = t.map(t => 1)) {
            if (t.length <= 0) return;
            let s, a = [], n = [], o = [], r = i[0];
            i.forEach(t => {
                r = Math.min(r, t);
            }), i = i.map(t => Math.floor(t * (1 / r))), t.forEach((t, e) => {
                a.push(t);
                for (let t = 0; t < i[e]; t++) o.push(e);
            });
            for (let t = 0; t < e && !(a.length <= 0); t++) s = Math.floor(Math.random() * o.length),
                o = o.filter(t => t != s), n.push(a.splice(o[s], 1)[0]);
            return n;
        }
    }
    class S {
        constructor(t, e, i) {
            this._prefabRes = [], this.m_affiliateResURLs = [], this.prefabs = {}, this.sprite3Ds = [],
                this.sceneNode = t, this.sceneNode_ = e, this._lvConfig = i;
        }
        get ifDestroy() {
            return !Boolean(this._scene);
        }
        get scene() {
            return this._scene;
        }
        set affiliateResURLs(t) {
            this.m_affiliateResURLs = t;
        }
        get affiliateResURLs() {
            return this.m_affiliateResURLs;
        }
        get allResURLs() {
            let t = this.scenePrefabUrl();
            return t.push(...this.m_affiliateResURLs), t;
        }
        addAffiliateResURLs(t) {
            t.length <= 0 || (this.m_affiliateResURLs.push(...t), this.m_affiliateResURLs = y.Unique(this.m_affiliateResURLs));
        }
        loadRes(t = null) {
            return a.LoadAsync(this.allResURLs, t);
        }
        buildScene(t = null) {
            return new Promise(e => {
                if (this._scene) return console.log(...s.packWarn("重复构建关卡，请注意")), void e(this._scene);
                console.log(...s.packLog("开始构建关卡->" + this._lvConfig.key)), this.loadRes(t).then(() => {
                    this._scene = new Laya.Sprite3D(), l.s3d.addChild(this._scene);
                    for (let t in this.sceneNode) {
                        let e = new Laya.Sprite3D();
                        e.name = t, this._scene.addChild(e), this._buildScene(this.sceneNode[t], e);
                    }
                    console.log(...s.packLog("关卡->" + this._lvConfig.key + "构建完成")), console.log("关卡->" + this._lvConfig.key, "\n场景->", this._scene, "\n预制体->", this.prefabs, "\n物体->", this.sprite3Ds),
                        e(this._scene);
                });
            });
        }
        clearScene() {
            this._scene && (console.log(...s.packLog("清除关卡->" + this._lvConfig.key)), this._scene.destroy(),
                this._prefabRes = [], this.prefabs = {}, this._scene = null, this.sprite3Ds = []);
        }
        scenePrefabUrl() {
            let t = [], e = this.scenePrefabResName();
            return e && e.forEach(e => {
                t.push(p.prefab_url(e));
            }), t;
        }
        sceneDirectPrefabUrl() {
            let t = [], e = this.sceneDirectPrefabResName();
            return e && e.forEach(e => {
                t.push(p.prefab_url(e));
            }), t;
        }
        scenePreloadPrefabUrl() {
            let t = [], e = this.scenePreloadPrefabResName();
            return e && e.forEach(e => {
                t.push(p.prefab_url(e));
            }), t;
        }
        scenePrefabResName() {
            let t = 0;
            for (let e in this.sceneNode) t++;
            if (0 != t) {
                if (!this._prefabRes || this._prefabRes.length <= 0) {
                    for (let t in this.sceneNode) this._getPrefabName(this._prefabRes, this.sceneNode[t]);
                    this.sceneNode_ && this.sceneNode_.length > 0 && this.sceneNode_.forEach(t => {
                        this._getPrefabName(this._prefabRes, t);
                    });
                }
                return this._prefabRes;
            }
            console.log(...s.packError("关卡->" + this._lvConfig.key + "<-不存在,或者是没有内容"));
        }
        sceneDirectPrefabResName() {
            let t = [];
            for (let e in this.sceneNode) this._getPrefabName(t, this.sceneNode[e]);
            return t;
        }
        scenePreloadPrefabResName() {
            let t = [];
            return this.sceneNode_.forEach(e => {
                this._getPrefabName(t, e);
            }), t;
        }
        _getPrefabName(t, e) {
            if (e) {
                let i = e.prefabName;
                i ? (e = e, t.indexOf(i) < 0 && t.push(i)) : (e = e).child && e.child.forEach(e => {
                    this._getPrefabName(t, e);
                });
            }
        }
        _buildScene(t, e) {
            let i = t.prefabName;
            if (i) {
                t = t;
                let s = a.Get(p.prefab_url(i));
                s && (o.initNode(s, t), e.addChild(s), this.prefabs[i] = this.prefabs[i] || [],
                    this.prefabs[i].push(s), this.sprite3Ds.push(s));
            } else if ((t = t).child) {
                let i = new Laya.Sprite3D();
                o.initNode(i, t), e.addChild(i), t.child.forEach(t => {
                    this._buildScene(t, i);
                });
            }
        }
    }
    class I {
        static set sevelConfig(t) {
            this.m_sevelConfig = t;
        }
        static initCamera(t, e = u.defaultLevelSceneName) {
            let i = this.m_sevelConfig[e].camera;
            i && o.initNode(t, i);
        }
        static initLight(t, e = u.defaultLevelSceneName) {
            let i = this.m_sevelConfig[e].light;
            i && o.initNode(t, i);
        }
    }
    var C, w, b, L, x, v, A, P;
    I.m_sevelConfig = {}, function (t) {
        t.config = class { }, t.path = "res/config/LevelConfig.json";
    }(C || (C = {}));
    class D {
        constructor() {
            this.initData();
        }
        initData() { }
    }
    class k extends D {
        get dataList() {
            return this.m_dataList;
        }
    }
    class U extends D {
        get data() {
            return this.m_data;
        }
    }
    class T extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new T()), this._instance;
        }
        initData() {
            this.m_dataList = C.dataList;
        }
        getLevelNumber() {
            let t = 0;
            return this.m_dataList.forEach(e => {
                e.id > 0 && t++;
            }), t;
        }
        byIdGetData(t) {
            return this.m_dataList.find(e => e.id == t);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/OtherLevelConfig.json";
    }(w || (w = {}));
    class R extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new R()), this._instance;
        }
        initData() {
            this.m_dataList = w.dataList;
        }
        byIdGetData(t) {
            return this.m_dataList.find(e => e.id == t);
        }
        byNameGetData(t) {
            return this.m_dataList.find(e => e.name == t);
        }
    }
    class O {
        static byLevelIdGetLevelData(t) {
            let e = T.instance.byIdGetData(t);
            return this.getLevelData("ID", e.sceneName, e.sceneOtherRes, e.rootScene);
        }
        static byLevelNameGetOtherLevelData(t) {
            let e = R.instance.byNameGetData(t);
            return this.getLevelData("Name", e.sceneName, e.sceneOtherRes, e.rootScene);
        }
        static getLevelData(t, e, i, s) {
            return e.replace(/\s+/g, "").replace(/^,+/, "").replace(/,+$/, "").replace(/,+/g, ","),
                i.replace(/\s+/g, "").replace(/^,+/, "").replace(/,+$/, "").replace(/,+/g, ","),
            {
                key: "$" + s + ":" + t + "-" + e,
                rootScene: s,
                sceneName: e.split(","),
                sceneOtherRes: i.split(",")
            };
        }
    }
    class E { }
    E.PrestrainLeveId = ["prestrain"];
    class M {
        constructor() {
            this._levelConfig = {}, this._scenes = {}, I.sevelConfig = this._levelConfig;
        }
        static get instance() {
            return null == this._instance && (this._instance = new M()), this._instance;
        }
        init() { }
        initConfig() {
            let t, e;
            for (let i in c) if (t = c[i]) {
                if (t = p.levelConfigURL(t), (e = a.Get(t, !0)).root) {
                    this._levelConfig[c[i]] = {};
                    for (let t = 0; t < e.root.length; t++) {
                        let s = e.root[t];
                        this._levelConfig[c[i]][s.name] = s;
                    }
                }
                a.Unload(t);
            }
        }
        Preload(t) {
            let e = [];
            E.PrestrainLeveId.forEach(t => {
                e.push(...this.getOtherSceneByName(t).scenePrefabUrl());
            }), t.push(...e);
        }
        preloadSceneRes(t) {
            console.log(...s.packLog("预加载关卡->", t)), this.getSceneByLv(t).loadRes();
        }
        preloadOtherSceneRes(t) {
            console.log(...s.packLog("预加载其它关卡->", t)), this.getOtherSceneByName(t).loadRes();
        }
        getSceneByLv(t) {
            let e = O.byLevelIdGetLevelData(t);
            return e || console.log(...s.packError("不存在此关卡->", t)), this._scenes[e.key] || (this._scenes[e.key] = this.getSceneByData(e.key, e)),
                this._scenes[e.key];
        }
        getOtherSceneByName(t) {
            let e = O.byLevelNameGetOtherLevelData(t);
            return e || console.log(...s.packError("不存在此关卡->", t)), this._scenes[e.key] || (this._scenes[e.key] = this.getSceneByData(e.key, e)),
                this._scenes[e.key];
        }
        getSceneByData(t, e) {
            let i = e.sceneName, a = e.sceneOtherRes, n = {}, o = [];
            this._levelConfig[e.rootScene] || console.log(...s.packError("没有找到场景-", e.rootScene, " 请先注册。"));
            for (let t in this._levelConfig[e.rootScene]) -1 != i.findIndex(e => e == t) && (n[t] = this._levelConfig[e.rootScene][t]),
                -1 != a.findIndex(e => e == t) && o.push(this._levelConfig[e.rootScene][t]);
            return new S(n, o, e);
        }
        getLvResName(t) {
            return this.getSceneByLv(t).scenePrefabResName();
        }
        getLvResUrl(t) {
            return this.getSceneByLv(t).scenePrefabUrl();
        }
    }
    class B { }
    B.gravity = -10, B.ifPreloadCustoms = !1;
    class G {
        constructor() {
            this.m_proList = {}, this.init(), this.register();
        }
        getPro(t) {
            return this.m_proList[t];
        }
        init() { }
        register() { }
        AllotPre(t) {
            this.allotPrefab(t), this.allotMediator();
        }
        allotPrefab(t) { }
        allotMediator() { }
        AllotOtherScenePre(t, e) {
            this.allotOtherScenePrefab(t, e), this.allotOtherSceneMediator(t);
        }
        allotOtherScenePrefab(t, e) { }
        allotOtherSceneMediator(t) { }
    }
    !function (t) {
        t.CameraPro = "EProcessor_CameraPro", t.HeightFogCubePro = "EProcessor_HeightFogCubePro";
    }(b || (b = {}));
    class N {
        constructor(t) {
            this.m_proTypeof = t;
        }
        get proTypeof() {
            return this.m_proTypeof;
        }
        addScript(t, e, i) {
            let s = t.addComponent(e);
            return s.setPro(this), s.setData(i), s;
        }
    }
    class F extends Laya.Script3D {
        constructor() {
            super(...arguments), this.m_proStamp = [];
        }
        addProStamp(t) {
            -1 == this.m_proStamp.findIndex(e => e == t) && this.m_proStamp.push(t);
        }
        get proStamp() {
            return this.m_proStamp;
        }
        ifAtPro(t) {
            return -1 != this.m_proStamp.findIndex(e => e == t);
        }
    }
    class V extends N {
        constructor(t) {
            super(t), this.ifAddProStampScript = !1, this.ifAddParentNode = !1, this.onlyInit();
        }
        get sprList() {
            return this.m_sprList;
        }
        get parentNode() {
            return this.m_parentNode;
        }
        set _vo(t) {
            this.m_vo = t, this.m_vo._initPro(this);
        }
        set _mediator(t) {
            this.m_mediator = t, this.m_mediator._initPro(this);
        }
        onlyInit() { }
        _init() {
            this.ifAddParentNode && (this.m_parentNode = new Laya.Sprite3D());
        }
        startPor(t) {
            this._init(), this.initExtend(), this.init(), this.m_sprList = this.proSpr(t), this.sprInitExtend(),
                this.sprInit();
        }
        addSprAndPor(t) {
            let e = this.proSpr(t);
            this.m_sprList.push(...e), this.addSprAndProCom(e);
        }
        addSprAndProCom(t) { }
        init() { }
        initExtend() { }
        setSpr(t) { }
        setSprExtend(t) { }
        sprInit() { }
        sprInitExtend() { }
        getSprClass({ id: t }) {
            for (let e in this.m_sprIdClassList) if (-1 != this.m_sprIdClassList[e].findIndex(e => e == t)) return e;
        }
        getAddCommonScrSpr(t) {
            return t;
        }
        static getProStamp(t) {
            let e = t.getComponent(F);
            return e ? e.proStamp : [];
        }
        proSpr(t) {
            let e = [];
            for (let i in t) t[i] && (e.push(...t[i]), this.addSprIdClassList(i, t[i]));
            return e.forEach(t => {
                this.ifAddParentNode && this.m_parentNode.addChild(t), this.addProStampCommonScr(this.getAddCommonScrSpr(t)),
                    this.setSprExtend(t), this.setSpr(t);
            }), e;
        }
        addSprIdClassList(t, e) {
            if (!e) return;
            this.m_sprIdClassList || (this.m_sprIdClassList = {}), this.m_sprIdClassList[t] || (this.m_sprIdClassList[t] = []);
            let i = e.map(t => t.id);
            this.m_sprIdClassList[t].push(...i);
            let s = new Set(this.m_sprIdClassList[t]);
            this.m_sprIdClassList[t] = Array.from(s);
        }
        addProStampCommonScr(t) {
            if (!this.ifAddProStampScript) return;
            let e, i;
            (e = (i = t.getComponent(F)) || t.addComponent(F)).addProStamp(this.proTypeof);
        }
    }
    class W extends Laya.Script3D { }
    class j extends W {
        get pro() {
            if (this.m_Pro) return this.m_Pro;
            console.log(...s.packWarn("->没有找到Pro!<-"));
        }
        get data() {
            return this.m_data;
        }
        setPro(t) {
            this.m_Pro = t;
        }
        setData(t) {
            this.m_data = t;
        }
    }
    class H extends j {
        set cameraNode(t) {
            this.m_cameraNode = t, this.m_cameraNodeTransform = t.transform;
        }
        init() { }
        onAwake() {
            this.m_transform = this.owner.transform;
        }
        onUpdate() { }
    }
    class z {
        static get zeroV3() {
            return z.m_zeroV3.clone();
        }
        static get zeroV2() {
            return z.m_zeroV2.clone();
        }
    }
    z.m_zeroV3 = new Laya.Vector3(0, 0, 0), z.m_zeroV2 = new Laya.Vector2(0, 0);
    class q {
        static RgbToHex(t, e, i) {
            for (var s = (t << 16 | e << 8 | i).toString(16); s.length < 6;) s = "0" + s;
            return "#" + s;
        }
        static ColorToHex(t) {
            return this.RgbToHex(255 * t.r, 255 * t.g, 255 * t.b);
        }
        static HexToColor(t, e = null) {
            t.startsWith("#") && (t = t.substring(1));
            let i = t.substring(0, 2), s = t.substring(2, 4), a = t.substring(4, 6), n = t.substring(6, 8), o = parseInt(i, 16), r = parseInt(s, 16), l = parseInt(a, 16), h = e || parseInt(n, 16);
            return new Laya.Color(o / 255, r / 255, l / 255, h);
        }
        static ToV3(t) {
            return new Laya.Vector3(t.r, t.g, t.b);
        }
        static ToV4(t) {
            return new Laya.Vector4(t.r, t.g, t.b, t.a);
        }
        static HexToV3(t) {
            t.startsWith("#") && (t = t.substring(1));
            let e = t.substring(0, 2), i = t.substring(2, 4), s = t.substring(4, 6), a = parseInt(e, 16), n = parseInt(i, 16), o = parseInt(s, 16);
            return new Laya.Vector3(a / 255, n / 255, o / 255);
        }
        static HexToV4(t, e = null) {
            t.startsWith("#") && (t = t.substring(1));
            let i = t.substring(0, 2), s = t.substring(2, 4), a = t.substring(4, 6), n = t.substring(6, 8), o = parseInt(i, 16), r = parseInt(s, 16), l = parseInt(a, 16), h = e || parseInt(n, 16);
            return new Laya.Vector4(o / 255, r / 255, l / 255, h);
        }
    }
    class Q {
        constructor() {
            this.items = {};
        }
        set(t, e) {
            return this.items[t] = e, !0;
        }
        has(t) {
            return this.items.hasOwnProperty(t);
        }
        remove(t) {
            return !!this.has(t) && (delete this.items[t], !0);
        }
        get(t) {
            return this.has(t) ? this.items[t] : void 0;
        }
        keys() {
            return Object.keys(this.items);
        }
        get length() {
            return this.keys().length;
        }
        clear() {
            this.items = {};
        }
    }
    class K { }
    K.timestep = 1 / 60, K.iterations = 24, K.broadphase = 2, K.worldscale = 1, K.random = !0,
        K.info = !1, K.gravity = [0, -9.8, 0];
    class Y {
        constructor() {
            this._oimoRigDic = new Q(), this._transformDic = new Q(), this._oimoOffset = new Q(),
                this._oimoRigDicR = new Q(), this._transformDicR = new Q(), this._oimoOffsetR = new Q(),
                this._tempOimoV3 = new OIMO.Vec3(), this._tempOimoQuat = new OIMO.Quat(), this._tempQuaternion = new Laya.Quaternion(),
                this._init();
        }
        get oimoWorld() {
            return this._oimoWorld;
        }
        static get instance() {
            return Y._instance || (Y._instance = new Y()), Y._instance;
        }
        _init() {
            this._oimoWorld = this.CreateWolrd(), window.oimoWorld = this._oimoWorld;
        }
        CreateWolrd() {
            return new OIMO.World({
                timestep: K.timestep,
                iterations: K.iterations,
                broadphase: K.broadphase,
                worldscale: K.worldscale,
                random: K.random,
                info: K.info,
                gravity: K.gravity
            });
        }
        _createRigBox(t, e, i, s, a, n = "box") {
            return t.add({
                type: n,
                size: [s.x, s.y, s.z],
                pos: [e.x, e.y, e.z],
                rot: [i.x, i.y, i.z],
                move: a,
                density: 10,
                belongsTo: 1,
                collidesWith: 4294967295
            });
        }
        CreateCompoundRig(t, e, i = !0, s = !0, a = !1, n = !1, o = 10, r = 1, l = 4294967295) {
            for (var h = [], c = [], d = [], m = [], u = 0; u < e.length; u++) {
                let t = e[u];
                h.push(t.type), c.push(t.pos.x, t.pos.y, t.pos.z), d.push(t.eular.x, t.eular.y, t.eular.z),
                    m.push(t.size.x, t.size.y, t.size.z);
            }
            let _ = this.oimoWorld.add({
                type: h,
                pos: [t.position.x, t.position.y, t.position.z],
                rot: [t.rotationEuler.x, t.rotationEuler.y, t.rotationEuler.z],
                posShape: c,
                rotShape: d,
                size: m,
                move: i,
                density: o,
                friction: .999,
                restitution: .1,
                isKinematic: n,
                belongsTo: r,
                collidesWith: l
            });
            return _.id = Y.m_rigId, Y.m_rigId++, s && (this._oimoRigDic.set(_.id, _), this._transformDic.set(_.id, t),
                this._oimoOffset.set(_.id, new Laya.Vector3())), a && (this._oimoRigDicR.set(_.id, _),
                    this._transformDicR.set(_.id, t), this._oimoOffsetR.set(_.id, new Laya.Vector3())),
                _;
        }
        static SetCollideData(t, e, i, s, a) {
            for (var n = t.shapes; null !== n; n = n.next) null != e && (n.belongsTo = e), null != i && (n.collidesWith = i),
                null != s && (n.restitution = s), null != a && (n.friction = a);
        }
        setCanMove(t, e) {
            e ? t.setupMass(OIMO.BODY_DYNAMIC, !1) : t.setupMass(OIMO.BODY_STATIC, !1);
        }
        clearRig() {
            this._oimoWorld.clear(), this._oimoRigDic.clear(), this._transformDic.clear(), this._oimoOffset.clear(),
                this._oimoRigDicR.clear(), this._transformDicR.clear(), this._oimoOffsetR.clear();
        }
        addRig(t, e = this._oimoWorld) {
            t && e.addRigidBody(t);
        }
        RemoveRig(t, e = this._oimoWorld, i = !1) {
            t && (i && (this._oimoRigDic.remove(t.id), this._transformDic.remove(t.id), this._oimoOffset.remove(t.id),
                this._oimoRigDicR.remove(t.id), this._transformDicR.remove(t.id), this._oimoOffsetR.remove(t.id)),
                e.removeRigidBody(t));
        }
        AddJoint(t, e, i, s, a, n) {
            return this.oimoWorld.add({
                type: t,
                body1: e,
                body2: i,
                pos1: null != s ? [s.x, s.y, s.z] : s,
                pos2: null != a ? [a.x, a.y, a.z] : a,
                spring: n
            });
        }
        RemoveJoint(t) {
            this.oimoWorld.removeJoint(t);
        }
        updateAllTrans() {
            this._oimoRigDic.keys().forEach(t => {
                this.UpdateTrans(this._transformDic.get(t), this._oimoRigDic.get(t), this._oimoOffset.get(t));
            });
        }
        updateAllTransReverse() {
            this._oimoRigDicR.keys().forEach(t => {
                this.UpdateTransReverse(this._transformDicR.get(t), this._oimoRigDicR.get(t));
            });
        }
        UpdateTransReverse(t, e) {
            if (!t || !e || !e.parent) return;
            let i = t.position;
            this._tempOimoV3.set(i.x, i.y, i.z), e.awake(), e.setPosition(this._tempOimoV3);
            let s = t.rotation;
            this._tempOimoQuat.set(s.x, s.y, s.z, s.w), e.setQuaternion(this._tempOimoQuat);
        }
        UpdateTrans(t, e, i) {
            if (!t || !e || !e.parent) return;
            let s = e.getPosition();
            if (t.position.x = s.x, t.position.y = s.y, t.position.z = s.z, i && !this.isZero(i)) {
                let e = i.clone();
                Laya.Quaternion.createFromYawPitchRoll(this.deg2rad(t.rotationEuler.y), this.deg2rad(t.rotationEuler.x), this.deg2rad(t.rotationEuler.z), this._tempQuaternion),
                    Laya.Vector3.transformQuat(e, this._tempQuaternion, e), Laya.Vector3.subtract(t.position, e, t.position);
            }
            t.position = t.position;
            let a = e.getQuaternion();
            t.rotation.x = a.x, t.rotation.y = a.y, t.rotation.z = a.z, t.rotation.w = a.w,
                t.rotation = t.rotation;
        }
        isZero(t) {
            return Laya.MathUtils3D.isZero(t.x) && Laya.MathUtils3D.isZero(t.y) && Laya.MathUtils3D.isZero(t.z);
        }
        deg2rad(t) {
            return t * Math.PI / 180;
        }
        GetRig(t) {
            return this._oimoRigDic.get(t);
        }
    }
    Y.m_rigId = 0;
    class Z extends Laya.Script3D {
        onUpdate() {
            console.error("ZZZZZZ");
            Y.instance.oimoWorld.timeStep = Laya.timer.delta / 1e3, Y.instance.oimoWorld.step(),
                Y.instance.updateAllTrans(), Y.instance.updateAllTransReverse();
        }
    }
    class J { }
    J.support2D = !1, J.support3D = !0, J.ifAddOimoSystem = !1, J.ifTest = !1;
    class X {
        static InitAll() {
            J.support3D ? (this.s3d = Laya.stage.addChildAt(new Laya.Scene3D(), 0), this.camera = new Laya.Camera(),
                window["camera"] = this.camera,
                this.s3d.addChild(this.camera), I.initCamera(this.camera), this.light = new Laya.DirectionLight(),
                this.s3d.addChild(this.light), I.initLight(this.light), J.ifAddOimoSystem && this.addOimoSystem(),
                l.s3d = this.s3d, l.camera = this.camera, l.light = this.light) : console.log(...s.packLog("请设置支持3D!"));
        }
        static addOimoSystem() {
            let t = new Laya.Sprite3D();
            this.s3d.addChild(t), t.addComponent(Z);
        }
    }
    !function (t) {
        t.LookAd = "_EEventScene_LookAd", t.UnLookAd = "_EEventScene_UnLookAd", t.GameLevelsBuild = "_EEventScene_GameLevelsBuild",
            t.GameOtherLevelsBuild = "_EEventScene_GameOtherLevelsBuild", t.GameLevelsBuildBefore = "_EEventScene_GameLevelsBuildBefore",
            t.GameLevelsOnBuild = "_EEventScene_GameLevelsOnBuild", t.GameLevelsDelete = "_EEventScene_GameLevelsDelete",
            t.GameOtherLevelsDelete = "_EEventScene_GameOtherLevelsDelete", t.GameLevelsDeleteBefore = "_EEventScene_GameLevelsDeleteBefore",
            t.GameLevelsOnDelete = "_EEventScene_GameLevelsOnDelete", t.GameStart = "_EEventScene_Start",
            t.GameSuspend = "_EEventScene_GameSuspend", t.GameGoOn = "_EEventScene_GameGoOn",
            t.GameRestart = "_EEventScene_GameRestart", t.GameEnd = "_EEventScene_GameEnd",
            t.GameCom = "_EEventScene_GameCom", t.GameWin = "_EEventScene_gameWin", t.GameFail = "_EEventScene_gameFail",
            t.RoleDie = "_EEventScene_RoleDie", t.RoleRevive = "_EEventScene_Revive", t.OnClickBuilding = "_Scene_OnClickBuilding",
            t.UpdateBuildingData = "_Scene_UpdateBuildingData", t.UpdateBuildingOutlookEvent = "_Scene_UpdateBuildingOutlook",
            t.UpdateSlotOutLook = "UpdateSlotOutLook", t.OnUpdateSlotComplete = "OnUpdateSlotComplete",
            t.DoNext = "_EventSceneDONEXT", t.RepairFacility = "_EventScene_RepairFacility",
            t.FacilityRepairComplete = "_EventScene_FacilityRepairComplete", t.UpdateMaxFlow = "_EventScene_UpdateMaxFlow",
            t.SetDoorActive = "_EventScene_SetDoorActive", t.OpenBuildBlock = "_EventScene_OpenBuildBlock",
            t.AddStaff = "_EventScene_AddStaff", t.SceneLoadComplete = "_EventScene_SceneLoadComplete",
            t.NetRedLeaveWC = "NetRedLeaveWC";
    }(L || (L = {}));
    class $ extends Laya.EventDispatcher {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new $()), this._instance;
        }
        init() { }
        eventGlobal(t, e) {
            $.instance.event(t, e);
        }
        eventAudio(t, e) {
            $.instance.event(t, e);
        }
        eventUI(t, e) {
            $.instance.event(t, e);
        }
        event3D(t, e) {
            $.instance.event(t, e);
        }
        onGlobal(t, e, i, s) {
            $.instance.on(t, e, i, s);
        }
        onAudio(t, e, i, s) {
            $.instance.on(t, e, i, s);
        }
        onUI(t, e, i, s) {
            $.instance.on(t, e, i, s);
        }
        on3D(t, e, i, s) {
            $.instance.on(t, e, i, s);
        }
        onGuide(t, e, i, s) {
            $.instance.on(t, e, i, s);
        }
        offGlobal(t, e, i) {
            $.instance.off(t, e, i);
        }
        offGuide(t, e, i) {
            $.instance.off(t, e, i);
        }
        offAudio(t, e, i) {
            $.instance.off(t, e, i);
        }
        offUI(t, e, i) {
            $.instance.off(t, e, i);
        }
        off3D(t, e, i) {
            $.instance.off(t, e, i);
        }
    }
    !function (t) {
        t[t.MinLeveNumber = 3] = "MinLeveNumber", t[t.DefaultLeveId = 1] = "DefaultLeveId",
            t[t.DebugLeveId = 0] = "DebugLeveId", t[t.NewHandLeveId = 1] = "NewHandLeveId";
    }(x || (x = {}));
    class tt { }
    tt.GameWhatTeam = "ShengDouShi", tt.GameName = "Idle-Toilet-Tycoon", tt.GameName_ = "",
        tt.GameExplain = "LayaBox小游戏", tt.versions = "0.0.4", tt.OnLine = !1;
    class et {
        static SplitToIntArray(t, e) {
            for (var i = t.split(e), s = [], a = 0; a < i.length; ++a) {
                var n = parseInt(i[a]);
                isNaN(n) && (n = 0), s.push(n);
            }
            return s;
        }
        static IntArrToStr(t) {
            for (var e = "", i = 0; i < t.length; ++i) e += t[i].toFixed(0), i < t.length - 1 && (e += ",");
            return e;
        }
        static IsNullOrEmpty(t) {
            return null == t || "" == t;
        }
    }
    class it {
        constructor() {
            this._state = new Int32Array(4), this._buffer = new ArrayBuffer(68), this._buffer8 = new Uint8Array(this._buffer, 0, 68),
                this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
        }
        static hashStr(t, e = !1) {
            return this.onePassHasher.start().appendStr(t).end(e);
        }
        static hashAsciiStr(t, e = !1) {
            return this.onePassHasher.start().appendAsciiStr(t).end(e);
        }
        static _hex(t) {
            const e = it.hexChars, i = it.hexOut;
            let s, a, n, o;
            for (o = 0; o < 4; o += 1) for (a = 8 * o, s = t[o], n = 0; n < 8; n += 2) i[a + 1 + n] = e.charAt(15 & s),
                s >>>= 4, i[a + 0 + n] = e.charAt(15 & s), s >>>= 4;
            return i.join("");
        }
        static _md5cycle(t, e) {
            let i = t[0], s = t[1], a = t[2], n = t[3];
            s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & a | ~s & n) + e[0] - 680876936 | 0) << 7 | i >>> 25) + s | 0) & s | ~i & a) + e[1] - 389564586 | 0) << 12 | n >>> 20) + i | 0) & i | ~n & s) + e[2] + 606105819 | 0) << 17 | a >>> 15) + n | 0) & n | ~a & i) + e[3] - 1044525330 | 0) << 22 | s >>> 10) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & a | ~s & n) + e[4] - 176418897 | 0) << 7 | i >>> 25) + s | 0) & s | ~i & a) + e[5] + 1200080426 | 0) << 12 | n >>> 20) + i | 0) & i | ~n & s) + e[6] - 1473231341 | 0) << 17 | a >>> 15) + n | 0) & n | ~a & i) + e[7] - 45705983 | 0) << 22 | s >>> 10) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & a | ~s & n) + e[8] + 1770035416 | 0) << 7 | i >>> 25) + s | 0) & s | ~i & a) + e[9] - 1958414417 | 0) << 12 | n >>> 20) + i | 0) & i | ~n & s) + e[10] - 42063 | 0) << 17 | a >>> 15) + n | 0) & n | ~a & i) + e[11] - 1990404162 | 0) << 22 | s >>> 10) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & a | ~s & n) + e[12] + 1804603682 | 0) << 7 | i >>> 25) + s | 0) & s | ~i & a) + e[13] - 40341101 | 0) << 12 | n >>> 20) + i | 0) & i | ~n & s) + e[14] - 1502002290 | 0) << 17 | a >>> 15) + n | 0) & n | ~a & i) + e[15] + 1236535329 | 0) << 22 | s >>> 10) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & n | a & ~n) + e[1] - 165796510 | 0) << 5 | i >>> 27) + s | 0) & a | s & ~a) + e[6] - 1069501632 | 0) << 9 | n >>> 23) + i | 0) & s | i & ~s) + e[11] + 643717713 | 0) << 14 | a >>> 18) + n | 0) & i | n & ~i) + e[0] - 373897302 | 0) << 20 | s >>> 12) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & n | a & ~n) + e[5] - 701558691 | 0) << 5 | i >>> 27) + s | 0) & a | s & ~a) + e[10] + 38016083 | 0) << 9 | n >>> 23) + i | 0) & s | i & ~s) + e[15] - 660478335 | 0) << 14 | a >>> 18) + n | 0) & i | n & ~i) + e[4] - 405537848 | 0) << 20 | s >>> 12) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & n | a & ~n) + e[9] + 568446438 | 0) << 5 | i >>> 27) + s | 0) & a | s & ~a) + e[14] - 1019803690 | 0) << 9 | n >>> 23) + i | 0) & s | i & ~s) + e[3] - 187363961 | 0) << 14 | a >>> 18) + n | 0) & i | n & ~i) + e[8] + 1163531501 | 0) << 20 | s >>> 12) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s & n | a & ~n) + e[13] - 1444681467 | 0) << 5 | i >>> 27) + s | 0) & a | s & ~a) + e[2] - 51403784 | 0) << 9 | n >>> 23) + i | 0) & s | i & ~s) + e[7] + 1735328473 | 0) << 14 | a >>> 18) + n | 0) & i | n & ~i) + e[12] - 1926607734 | 0) << 20 | s >>> 12) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s ^ a ^ n) + e[5] - 378558 | 0) << 4 | i >>> 28) + s | 0) ^ s ^ a) + e[8] - 2022574463 | 0) << 11 | n >>> 21) + i | 0) ^ i ^ s) + e[11] + 1839030562 | 0) << 16 | a >>> 16) + n | 0) ^ n ^ i) + e[14] - 35309556 | 0) << 23 | s >>> 9) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s ^ a ^ n) + e[1] - 1530992060 | 0) << 4 | i >>> 28) + s | 0) ^ s ^ a) + e[4] + 1272893353 | 0) << 11 | n >>> 21) + i | 0) ^ i ^ s) + e[7] - 155497632 | 0) << 16 | a >>> 16) + n | 0) ^ n ^ i) + e[10] - 1094730640 | 0) << 23 | s >>> 9) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s ^ a ^ n) + e[13] + 681279174 | 0) << 4 | i >>> 28) + s | 0) ^ s ^ a) + e[0] - 358537222 | 0) << 11 | n >>> 21) + i | 0) ^ i ^ s) + e[3] - 722521979 | 0) << 16 | a >>> 16) + n | 0) ^ n ^ i) + e[6] + 76029189 | 0) << 23 | s >>> 9) + a | 0,
                s = ((s += ((a = ((a += ((n = ((n += ((i = ((i += (s ^ a ^ n) + e[9] - 640364487 | 0) << 4 | i >>> 28) + s | 0) ^ s ^ a) + e[12] - 421815835 | 0) << 11 | n >>> 21) + i | 0) ^ i ^ s) + e[15] + 530742520 | 0) << 16 | a >>> 16) + n | 0) ^ n ^ i) + e[2] - 995338651 | 0) << 23 | s >>> 9) + a | 0,
                s = ((s += ((n = ((n += (s ^ ((i = ((i += (a ^ (s | ~n)) + e[0] - 198630844 | 0) << 6 | i >>> 26) + s | 0) | ~a)) + e[7] + 1126891415 | 0) << 10 | n >>> 22) + i | 0) ^ ((a = ((a += (i ^ (n | ~s)) + e[14] - 1416354905 | 0) << 15 | a >>> 17) + n | 0) | ~i)) + e[5] - 57434055 | 0) << 21 | s >>> 11) + a | 0,
                s = ((s += ((n = ((n += (s ^ ((i = ((i += (a ^ (s | ~n)) + e[12] + 1700485571 | 0) << 6 | i >>> 26) + s | 0) | ~a)) + e[3] - 1894986606 | 0) << 10 | n >>> 22) + i | 0) ^ ((a = ((a += (i ^ (n | ~s)) + e[10] - 1051523 | 0) << 15 | a >>> 17) + n | 0) | ~i)) + e[1] - 2054922799 | 0) << 21 | s >>> 11) + a | 0,
                s = ((s += ((n = ((n += (s ^ ((i = ((i += (a ^ (s | ~n)) + e[8] + 1873313359 | 0) << 6 | i >>> 26) + s | 0) | ~a)) + e[15] - 30611744 | 0) << 10 | n >>> 22) + i | 0) ^ ((a = ((a += (i ^ (n | ~s)) + e[6] - 1560198380 | 0) << 15 | a >>> 17) + n | 0) | ~i)) + e[13] + 1309151649 | 0) << 21 | s >>> 11) + a | 0,
                s = ((s += ((n = ((n += (s ^ ((i = ((i += (a ^ (s | ~n)) + e[4] - 145523070 | 0) << 6 | i >>> 26) + s | 0) | ~a)) + e[11] - 1120210379 | 0) << 10 | n >>> 22) + i | 0) ^ ((a = ((a += (i ^ (n | ~s)) + e[2] + 718787259 | 0) << 15 | a >>> 17) + n | 0) | ~i)) + e[9] - 343485551 | 0) << 21 | s >>> 11) + a | 0,
                t[0] = i + t[0] | 0, t[1] = s + t[1] | 0, t[2] = a + t[2] | 0, t[3] = n + t[3] | 0;
        }
        start() {
            return this._dataLength = 0, this._bufferLength = 0, this._state.set(it.stateIdentity),
                this;
        }
        appendStr(t) {
            const e = this._buffer8, i = this._buffer32;
            let s, a, n = this._bufferLength;
            for (a = 0; a < t.length; a += 1) {
                if ((s = t.charCodeAt(a)) < 128) e[n++] = s; else if (s < 2048) e[n++] = 192 + (s >>> 6),
                    e[n++] = 63 & s | 128; else if (s < 55296 || s > 56319) e[n++] = 224 + (s >>> 12),
                        e[n++] = s >>> 6 & 63 | 128, e[n++] = 63 & s | 128; else {
                    if ((s = 1024 * (s - 55296) + (t.charCodeAt(++a) - 56320) + 65536) > 1114111) throw new Error("Unicode standard supports code points up to U+10FFFF");
                    e[n++] = 240 + (s >>> 18), e[n++] = s >>> 12 & 63 | 128, e[n++] = s >>> 6 & 63 | 128,
                        e[n++] = 63 & s | 128;
                }
                n >= 64 && (this._dataLength += 64, it._md5cycle(this._state, i), n -= 64, i[0] = i[16]);
            }
            return this._bufferLength = n, this;
        }
        appendAsciiStr(t) {
            const e = this._buffer8, i = this._buffer32;
            let s, a = this._bufferLength, n = 0;
            for (; ;) {
                for (s = Math.min(t.length - n, 64 - a); s--;) e[a++] = t.charCodeAt(n++);
                if (a < 64) break;
                this._dataLength += 64, it._md5cycle(this._state, i), a = 0;
            }
            return this._bufferLength = a, this;
        }
        appendByteArray(t) {
            const e = this._buffer8, i = this._buffer32;
            let s, a = this._bufferLength, n = 0;
            for (; ;) {
                for (s = Math.min(t.length - n, 64 - a); s--;) e[a++] = t[n++];
                if (a < 64) break;
                this._dataLength += 64, it._md5cycle(this._state, i), a = 0;
            }
            return this._bufferLength = a, this;
        }
        getState() {
            const t = this._state;
            return {
                buffer: String.fromCharCode.apply(null, this._buffer8),
                buflen: this._bufferLength,
                length: this._dataLength,
                state: [t[0], t[1], t[2], t[3]]
            };
        }
        setState(t) {
            const e = t.buffer, i = t.state, s = this._state;
            let a;
            for (this._dataLength = t.length, this._bufferLength = t.buflen, s[0] = i[0], s[1] = i[1],
                s[2] = i[2], s[3] = i[3], a = 0; a < e.length; a += 1) this._buffer8[a] = e.charCodeAt(a);
        }
        end(t = !1) {
            const e = this._bufferLength, i = this._buffer8, s = this._buffer32, a = 1 + (e >> 2);
            let n;
            if (this._dataLength += e, i[e] = 128, i[e + 1] = i[e + 2] = i[e + 3] = 0, s.set(it.buffer32Identity.subarray(a), a),
                e > 55 && (it._md5cycle(this._state, s), s.set(it.buffer32Identity)), (n = 8 * this._dataLength) <= 4294967295) s[14] = n; else {
                const t = n.toString(16).match(/(.*?)(.{0,8})$/);
                if (null === t) return;
                const e = parseInt(t[2], 16), i = parseInt(t[1], 16) || 0;
                s[14] = e, s[15] = i;
            }
            return it._md5cycle(this._state, s), t ? this._state : it._hex(this._state);
        }
    }
    it.ifUse = !0, it.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]),
        it.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        it.hexChars = "0123456789abcdef", it.hexOut = [], it.onePassHasher = new it(), "5d41402abc4b2a76b9719d911017c592" !== it.hashStr("hello") && (it.ifUse = !1,
            console.warn("Md5 self test failed."));
    class st { }
    class at {
        static encode(t) {
            let e, i, s, a, n, o, r, l = "", h = 0;
            for (t = this._utf8_encode(t); h < t.length;) a = (e = t.charCodeAt(h++)) >> 2,
                n = (3 & e) << 4 | (i = t.charCodeAt(h++)) >> 4, o = (15 & i) << 2 | (s = t.charCodeAt(h++)) >> 6,
                r = 63 & s, isNaN(i) ? o = r = 64 : isNaN(s) && (r = 64), l = l + this._keyStr.charAt(a) + this._keyStr.charAt(n) + this._keyStr.charAt(o) + this._keyStr.charAt(r);
            return l;
        }
        static decode(t) {
            let e, i, s, a, n, o, r, l = "", h = 0;
            for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length;) e = (a = this._keyStr.indexOf(t.charAt(h++))) << 2 | (n = this._keyStr.indexOf(t.charAt(h++))) >> 4,
                i = (15 & n) << 4 | (o = this._keyStr.indexOf(t.charAt(h++))) >> 2, s = (3 & o) << 6 | (r = this._keyStr.indexOf(t.charAt(h++))),
                l += String.fromCharCode(e), 64 !== o && (l += String.fromCharCode(i)), 64 !== r && (l += String.fromCharCode(s));
            return l = this._utf8_decode(l);
        }
        static _utf8_encode(t) {
            t = t.replace(/\r\n/g, "\n");
            let e = "";
            for (let i = 0; i < t.length; i++) {
                const s = t.charCodeAt(i);
                s < 128 ? e += String.fromCharCode(s) : s > 127 && s < 2048 ? (e += String.fromCharCode(s >> 6 | 192),
                    e += String.fromCharCode(63 & s | 128)) : (e += String.fromCharCode(s >> 12 | 224),
                        e += String.fromCharCode(s >> 6 & 63 | 128), e += String.fromCharCode(63 & s | 128));
            }
            return e;
        }
        static _utf8_decode(t) {
            let e = "", i = 0, s = 0, a = 0, n = 0;
            for (; i < t.length;) (s = t.charCodeAt(i)) < 128 ? (e += String.fromCharCode(s),
                i++) : s > 191 && s < 224 ? (a = t.charCodeAt(i + 1), e += String.fromCharCode((31 & s) << 6 | 63 & a),
                    i += 2) : (a = t.charCodeAt(i + 1), n = t.charCodeAt(i + 2), e += String.fromCharCode((15 & s) << 12 | (63 & a) << 6 | 63 & n),
                        i += 3);
            return e;
        }
    }
    at._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    class nt extends st {
        get saveName() {
            return tt.GameName + this._saveName;
        }
        get differName() {
            return this.encrypt(this.saveName + "-(-__DifferData__LayaMiniGame__-)-");
        }
        _SaveToDisk(t) {
            let e = JSON.stringify(t);
            if (Laya.LocalStorage.setJSON(this.saveName, e), tt.OnLine) {
                let t = this.getDifferData(e);
                Laya.LocalStorage.setJSON(this.differName, t);
            }
        }
        _ReadFromFile() {
            let t = Laya.LocalStorage.getJSON(this.saveName);
            if (tt.OnLine) {
                let e = Laya.LocalStorage.getJSON(this.differName);
                if (this.getDifferData(t) != e) return this._saveNewData();
            }
            let e = this.getNewData();
            e.versions = void 0;
            try {
                if (et.IsNullOrEmpty(t)) return this._saveNewData();
                {
                    let i = JSON.parse(t);
                    for (let t in i) e[t] = i[t];
                }
            } catch (t) {
                return this._saveNewData();
            }
            return e.versions == tt.versions ? e : this._saveNewData();
        }
        _saveNewData() {
            let t = this.getNewData();
            return t.versions = tt.versions, t.GameName = tt.GameName, t.GameExplain = tt.GameExplain,
                this._SaveToDisk(t), t;
        }
        getDifferData(t) {
            return et.IsNullOrEmpty(t) ? "" : this.encrypt(t);
        }
        encrypt(t) {
            let e = "LayaMiniGame-(-" + t + "-)-ModifiedWithout-" + tt.GameName + "-" + tt.versions;
            return it.ifUse ? it.hashStr(e).toString() : at.encode(e);
        }
    }
    class ot { }
    class rt extends ot {
        clone() { }
    }
    class lt extends rt {
        constructor() {
            super(...arguments), this.maxCustoms = 0, this.ifOpenBgm = !0, this.ifOpenSound = !0,
                this.ifOpenVibrate = !0, this.coinCount = 0, this.onCustoms = x.DefaultLeveId, this.maxCustomsRecord = 1;
        }
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class ht extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ht()), this._instance;
        }
        get _saveName() {
            return "->GameDataSave<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        static get gameData() {
            return this._instance._saveData.clone();
        }
        static initCustoms(t) {
            t = Math.floor(t), this._instance._saveData.maxCustoms != t && (this._instance._saveData.maxCustoms = t,
                this._instance._saveData.onCustoms > t && (this._instance._saveData.onCustoms = t),
                this._instance._saveData.maxCustomsRecord > t && (this._instance._saveData.maxCustomsRecord = t),
                this.SaveToDisk());
        }
        static ifNewHandCustoms() {
            return this._instance._saveData.onCustoms == x.NewHandLeveId && this._instance._saveData.maxCustomsRecord <= x.NewHandLeveId;
        }
        static setIfOpenBGM(t) {
            this._instance._saveData.ifOpenBgm = t, this.SaveToDisk();
        }
        static setIfOpenSound(t) {
            this._instance._saveData.ifOpenSound = t, this.SaveToDisk();
        }
        static setIfOpenVibrate(t) {
            this._instance._saveData.ifOpenVibrate = t, this.SaveToDisk();
        }
        static setCustoms(t) {
            (t = Math.floor(t)) > this._instance._saveData.maxCustoms || (this._instance._saveData.onCustoms = t);
        }
        static addCustoms(t = 1) {
            t = Math.floor(t);
            let e = this._instance._saveData.onCustoms + t, i = !1;
            return e <= this._instance._saveData.maxCustoms ? (this._instance._saveData.onCustoms = e,
                e > this._instance._saveData.maxCustomsRecord && (this._instance._saveData.maxCustomsRecord = e),
                i = !0) : (this._instance._saveData.onCustoms = x.DefaultLeveId, i = !0), this.SaveToDisk(),
                i;
        }
        static getDefaultCustoms() {
            return this._instance._saveData.onCustoms > this._instance._saveData.maxCustoms && (this._instance._saveData.onCustoms = x.DefaultLeveId,
                this.SaveToDisk()), this._instance._saveData.onCustoms;
        }
        static getPreloadCustoms() {
            return this.getNextCustoms();
        }
        static getNextCustoms() {
            let t = this._instance._saveData.onCustoms + 1;
            return t > this._instance._saveData.maxCustoms && (t = x.DefaultLeveId), t;
        }
        getNewData() {
            return new lt();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/EnvironmentConfig.json";
    }(v || (v = {}));
    class ct extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ct()), this._instance;
        }
        initData() {
            this.m_dataList = v.dataList;
        }
        byLevelIdGetData(t) {
            return this.m_dataList.find(e => e.id == t);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/OtherEnvironmentConfig.json";
    }(A || (A = {}));
    class dt extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new dt()), this._instance;
        }
        initData() {
            this.m_dataList = A.dataList;
        }
        byLevelIdGetData(t) {
            return this.m_dataList.find(e => e.id == t);
        }
        byLevelNameGetData(t) {
            return this.m_dataList.find(e => e.name == t);
        }
    }
    class mt {
        constructor(t) {
            this.name = "SystemException", this.message = "异常!", t && (this.message = t);
        }
        ToString() {
            return this.name + ":" + this.message;
        }
    }
    class ut extends mt {
        constructor(t, ...e) {
            super(t), this.name = "ArgumentException", this.message = "参数异常", t && (this.message = t),
                this.data = e;
        }
    }
    class _t extends mt {
        constructor(t) {
            super(t), this.name = "DivideByZeroException", this.message = "不能除以0！", t && (this.message = t);
        }
    }
    class gt extends mt {
        constructor(t) {
            super(t), this.name = "NotImplementedException", this.message = "未实现该方法或操作", t && (this.message = t);
        }
    }
    class ft {
        static CachFile(t) {
            if (Laya.Browser.onWeiXin) {
                var e = Laya.URL.formatURL(t);
                null == Laya.MiniAdpter.getFileInfo(e) && Laya.MiniAdpter.downLoadFile(e);
            }
        }
        static DownLoadFiles(t, e, i) {
            Laya.loader.create(t, e, i, null, null, null, 1, !0);
        }
        static makeTimeLeftString(t, e = ":", i = !1) {
            var s, a = "";
            if (t <= 0) return a += "00:00";
            if (t > ft.ONE_YEAR) return a = "大于一年";
            if (i) {
                var n;
                if (t > ft.ONE_DAY) a = (n = Math.floor(t / ft.ONE_DAY)) + "天"; else if (t >= 3600) a = (s = Math.floor(t / 3600)) + "时"; else {
                    var o, r;
                    (o = Math.floor(t / 60)) < 10 && (a += "0"), a += o.toString() + e, (r = t % 60) < 10 && (a += "0"),
                        a += r.toString();
                }
                return a;
            }
            if (t > ft.ONE_DAY && (a = (n = Math.floor(t / ft.ONE_DAY)) + "天", t -= n * ft.ONE_DAY,
                i)) return (s = Math.floor(t / 3600)) > 0 && (a += s + "时"), a;
            return t <= 0 ? a += "00:00" : (a = "", (s = Math.floor(t / 3600)) > 0 && (a += s < 10 ? "0" + s.toString() + e : s.toString() + e),
                (o = Math.floor((t - 3600 * s) / 60)) > 0 || s > 0 ? (o < 10 && (a += "0"), a += o.toString() + e) : a += "00" + e,
                (r = t % 60) < 10 && (a += "0"), a += r.toString());
        }
        static GetCurrentDayCount(t) {
            return Math.floor(t / 1e3 / 60 / 60 / 24);
        }
        static randomRangeInt(t, e) {
            return Math.floor(Math.random() * (e - t) + t);
        }
        static get deltaTime() {
            return this._recordFrame != Laya.timer.currFrame && (this._deltaTime = Math.min(Laya.timer.delta, 100),
                this._deltaTimeSec = .001 * this._deltaTime, this._recordFrame = Laya.timer.currFrame),
                this._deltaTime * this.timeScale;
        }
        static get deltaTimeSec() {
            return this._recordFrame != Laya.timer.currFrame && (this._deltaTime = Math.min(Laya.timer.delta, 100),
                this._deltaTimeSec = .001 * this._deltaTime, this._recordFrame = Laya.timer.currFrame),
                this._deltaTimeSec * this.timeScale;
        }
        static cloneObject(t) {
            return JSON.parse(JSON.stringify(t));
        }
    }
    ft.ONE_YEAR = 31536e3, ft.ONE_DAY = 86400, ft.timeScale = 1, ft._recordFrame = 0,
        ft._deltaTime = 30, ft._deltaTimeSec = .016;
    class pt {
        static get deltaTime() {
            return ft.deltaTimeSec;
        }
        static get scale() {
            return Laya.timer.scale;
        }
        static set scale(t) {
            Laya.timer.scale = t;
        }
        static ToTimeString(t) {
            t /= 1e3;
            let e = Math.floor(t / 60 / 60), i = Math.floor((t - 60 * e * 60) / 60);
            i = i < 0 ? 0 : i;
            let s = Math.floor(t - 60 * e * 60 - 60 * i);
            return (e + ":" + i + ":" + (s = s < 0 ? 0 : s)).replace(/[0-9]+/g, t => Number(t) < 10 ? "0" + t : t);
        }
    }
    class yt {
        static Clamp01(t) {
            return yt.Clamp(0, 1, t);
        }
        static Clamp(t, e, i) {
            return i < t ? t : i > e ? e : i;
        }
        static Lerp(t, e, i) {
            return (i = yt.Clamp01(i)) * (e - t) + t;
        }
        static LerpUnclamped(t, e, i) {
            return i * (e - t) + t;
        }
        static SmoothDamp(t, e, i, s = 1 / 0, a = Laya.timer.delta) {
            let n = i / a, o = .998228611243 - .994433814875 * Math.exp(-4.68826970093 * Math.pow(n, -1.00200917568)), r = (e - t) * (o = yt.Clamp01(o)) / a * 1e3;
            r > s && (r = s);
            let l = r / 1e3 * a;
            return l = t + l;
        }
        static DeltaAngle(t, e) {
            let i = 0;
            return i = (t %= 360) + 180 < (e %= 360) && e <= t + 360 ? t + 360 - e : e - t;
        }
        static StepMove(t, e, i) {
            let s = e - t;
            return 0 == s ? e : (s < 0 && (i = -i), t += i * pt.deltaTime);
        }
    }
    class St {
        constructor(t, e, i) {
            this.x = t || 0, this.y = e || 0, this.z = i || 0;
        }
        get SqrMagnitude() {
            return Laya.Vector3.scalarLengthSquared(this);
        }
        get magnitude() {
            return Laya.Vector3.scalarLength(this);
        }
        get normalized() {
            let t = new St();
            return Laya.Vector3.normalize(this, t), t;
        }
        Multiply(t) {
            return this.x *= t, this.y *= t, this.z *= t, this;
        }
        Divide(t) {
            return this.x /= t, this.y /= t, this.z /= t, this;
        }
        Add(t) {
            return this.x += t.x, this.y += t.y, this.z += t.z, this;
        }
        Subtract(t) {
            return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
        }
        ToString() {
            return "Vector3:(".concat(this.x.toString(), ",", this.y.toString(), ",", this.z.toString(), ")");
        }
        Equal(t) {
            return null != t && St.SqrDistance(this, t) < .1;
        }
        setValue(t, e, i) {
            return this.x = t, this.y = e, this.z = i, this;
        }
        fromArray(t, e) {
            if (3 != t.length) throw new ut("数组长度不为3!");
            this.x = t[0], this.y = t[1], this.z = t[2], e && (this.x += e, this.y += e, this.z += e);
        }
        Copy(t) {
            this.x = t.x, this.y = t.y, this.z = t.z;
        }
        cloneTo(t) {
            t.x = this.x, t.y = this.y, t.z = this.z;
        }
        clone() {
            return new St(this.x, this.y, this.z);
        }
        toDefault() {
            this.x = 0, this.z = 0, this.y = 0;
        }
        forNativeElement(t) {
            throw new gt("forNativeElement方法未实现!");
        }
        static get one() {
            return new St(1, 1, 1);
        }
        static get zero() {
            return new St(0, 0, 0);
        }
        static get up() {
            return new St(0, 1, 0);
        }
        static get down() {
            return new St(0, -1, 0);
        }
        static get left() {
            return new St(-1, 0, 0);
        }
        static get right() {
            return new St(1, 0, 0);
        }
        static get forward() {
            return new St(0, 0, -1);
        }
        static get back() {
            return new St(0, 0, 1);
        }
        static Add(t, e) {
            let i = new St(0, 0, 0);
            return i.x = t.x + e.x, i.y = t.y + e.y, i.z = t.z + e.z, i;
        }
        static Subtract(t, e) {
            return new St(t.x - e.x, t.y - e.y, t.z - e.z);
        }
        static Multiply(t, e) {
            return new St(t.x * e, t.y * e, t.z * e);
        }
        static Divide(t, e) {
            return new St(t.x / e, t.y / e, t.z / e);
        }
        static Copy(t) {
            let e = St.zero;
            return e.x = t.x, e.y = t.y, e.z = t.z, e;
        }
        static Dot(t, e) {
            return t.x * e.x + t.y * e.y + t.z * e.z;
        }
        static Cross(t, e) {
            let i = t.y * e.z - e.y * t.z, s = t.z * e.x - t.x * e.z, a = t.x * e.y - e.x * t.y;
            return new St(i, s, a);
        }
        static Project(t, e) {
            let i = e.magnitude;
            return i = St.Dot(t, e) / i / i, St.Multiply(e, i);
        }
        static ProjectOnPlane(t, e) {
            let i = St.Cross(e, t), s = St.Cross(i, e);
            return St.Project(t, s);
        }
        static Angle(t, e) {
            let i = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z), s = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z);
            if (0 == i || 0 == s) throw new _t("无法求零向量的夹角!");
            let a = t.x * e.x + t.z * e.z + t.y * e.y;
            return a = Math.acos(a / i / s) / Math.PI * 180;
        }
        static SignedAngle(t, e, i) {
            let s = St.ProjectOnPlane(t, i), a = St.ProjectOnPlane(e, i), n = St.Cross(s, a), o = St.Angle(s, a);
            return St.Dot(n, i) > 0 && (o = -o), o;
        }
        static ClampMagnitude(t, e) {
            if (t.magnitude <= e) return St.Copy(t);
            {
                let i = e / t.magnitude;
                return St.Multiply(t, i);
            }
        }
        static Distance(t, e) {
            return Laya.Vector3.distance(t, e);
        }
        static SqrDistance(t, e) {
            return Laya.Vector3.distanceSquared(t, e);
        }
        static Lerp(t, e, i) {
            return i <= 0 ? St.Copy(t) : i >= 1 ? St.Copy(e) : St.LerpUnclamped(t, e, i);
        }
        static LerpUnclamped(t, e, i) {
            let s = (e.x - t.x) * i + t.x, a = (e.y - t.y) * i + t.y, n = (e.z - t.z) * i + t.z;
            return new St(s, a, n);
        }
        static Max(t, e) {
            let i = t.x > e.x ? t.x : e.x, s = t.y > e.y ? t.y : e.y, a = t.z > e.z ? t.z : e.z;
            return new St(i, s, a);
        }
        static Min(t, e) {
            let i = t.x < e.x ? t.x : e.x, s = t.y < e.y ? t.y : e.y, a = t.z < e.z ? t.z : e.z;
            return new St(i, s, a);
        }
        static Normalize(t) {
            let e = t.x * t.x + t.y * t.y + t.z * t.z, i = Math.sqrt(e);
            0 != i && (t.x /= i, t.y /= i, t.z /= i);
        }
        MoveTowards(t, e, i) {
            let s = St.Subtract(e, t);
            return s.magnitude > i ? (St.Normalize(s), s.Multiply(i), s.Add(t), s) : St.Copy(e);
        }
        static Reflect(t, e) {
            let i = 2 * St.Dot(t, e), s = St.Multiply(e, i);
            return s = St.Subtract(t, s);
        }
        static RotateTowards(t, e, i, s) {
            throw new gt();
        }
        static Scale(t, e) {
            return new St(t.x * e.x, t.y * e.y, t.z * e.z);
        }
        static SmoothDamp(t, e, i, s = 1 / 0, a = Laya.timer.delta) {
            let n = St.Distance(t, e), o = yt.SmoothDamp(0, n, i, s, a);
            (o = o / a * 1e3) > s && (o = s);
            let r = St.Subtract(e, t).normalized.Multiply(o / 1e3 * a);
            return r.Add(t), r;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/CameraConst.json";
    }(P || (P = {}));
    class It extends U {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new It()), this._instance;
        }
        initData() {
            this.m_data = P.data;
        }
    }
    class Ct {
        constructor() { }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ct()), this.m_instance;
        }
        init() {
            this.m_s3d = X.s3d, this.m_camera = X.camera, this.m_light = X.light;
        }
        setEnvironment(t) {
            this.m_scene = t;
            let e = ht.gameData.onCustoms;
            this.m_enviromentConfig = ct.instance.byLevelIdGetData(e), console.log("关卡环境配置参数->" + e + "->", this.m_enviromentConfig),
                this.setS3D(this.m_s3d), this.setCamera(this.m_camera, this.m_enviromentConfig.clear_color),
                this.setLight(this.light, this.m_enviromentConfig.light_color, this.m_enviromentConfig.light_intensity),
                this.addAmbient(this.s3d, this.m_enviromentConfig.ambient_color), $.instance.on3D(L.GameLevelsDelete, this, this.gameLevelsDelete);
        }
        setOtherEnvironment(t, e, i = this.m_s3d, s = this.m_camera, a = this.m_light) {
            let n = dt.instance.byLevelNameGetData(t);
            console.log("关卡环境配置参数->" + t + "->", n), this.setCamera(s, n.clear_color), this.setLight(a, n.light_color, n.light_intensity),
                this.addAmbient(i, n.ambient_color);
        }
        get s3d() {
            return this.m_s3d;
        }
        get camera() {
            return this.m_camera;
        }
        get scene() {
            return this.m_scene;
        }
        get light() {
            return this.m_light;
        }
        setS3D(t) {
            this.m_ifSetS3D || (this.m_ifSetS3D = !0);
        }
        setCamera(t, e) {
            t.clearColor = q.HexToV4(e);
            let i = new St(It.instance.data.EulerX, It.instance.data.EulerY, It.instance.data.EulerZ);
            this.camera.transform.rotationEuler = i;
            let s = new St(It.instance.data.x, It.instance.data.y, It.instance.data.z);
            this.camera.transform.position = s,
                this.camera.farPlane = It.instance.data.far,
                this.camera.orthographic = It.instance.data.orthographic, this.camera.orthographicVerticalSize = It.instance.data.orthographic_size;
        }
        setLight(t, e, i) {
            t.color = q.HexToV3(e), t.intensity = i;
        }
        addAmbient(t, e) {
            t.ambientMode = Laya.AmbientMode.SolidColor, t.ambientColor = q.HexToV3(e);
        }
        addFog(t, e, i, s) {
            t.enableFog = !0, t.fogColor = q.HexToV3(e), t.fogRange = i, t.fogStart = s;
        }
        gameLevelsDelete() { }
    }
    class wt extends V {
        constructor() {
            super(...arguments), this.ifAddProStampScript = !1;
        }
        sprInit() {
            this.m_camera || (this.m_sprList[0] || console.log(...s.packError("没有找到摄像机!")),
                this.m_camera = this.m_sprList[0], this.m_cameraNode = new Laya.Sprite3D(),
                this.m_rootPos = this.m_camera.transform.position.clone(),
                this.m_rootAng = this.m_camera.transform.rotationEuler.clone(), this.m_rootAng.x = -this.m_rootAng.x,
                this.m_rootAng.y = this.m_rootAng.y - 180, this.m_cameraNode.addChild(this.m_camera),
                this.m_camera.transform.localPosition = z.zeroV3, this.m_camera.transform.localRotationEuler = new Laya.Vector3(0, -180, 0),
                this.m_Scr = this.addScript(this.m_camera, H), this.m_Scr.cameraNode = this.m_cameraNode,
                Ct.instance.s3d.addChild(this.m_cameraNode)), this.m_cameraNode.transform.position = this.m_rootPos,
                this.m_cameraNode.transform.rotationEuler = new Laya.Vector3(this.m_rootAng.x, this.m_rootAng.y, 0),
                this.m_Scr.init();
        }
    }
    class bt extends V {
        constructor() {
            super(...arguments), this.ifAddProStampScript = !1;
        }
    }
    class Lt extends r {
        constructor() {
            super();
        }
        static get instance() {
            return this._instance ? this._instance : (this._instance = new Lt(), this._instance);
        }
        getPro(t) {
            return this.ProList[t];
        }
        get cameraPro() {
            return this.getPro(b.CameraPro);
        }
        get heightFogCubePro() {
            return this.getPro(b.HeightFogCubePro);
        }
    }
    class xt { }
    xt.Library = "library", xt.Canteen = "canteen", xt.WaterRoom = "waterRoom", xt.MaleSink = "maleSink",
        xt.Toilet = "toilet", xt.PeeArea = "peeArea", xt.FamaleSink = "famaleSink", xt.WaitAera = "waitAera";
    class vt { }
    vt.Building = "Building", vt.Plane = "Plane", vt.YY = "YY";
    class At { }
    At.Toilet = "Toilet", At.Potted = "Potted";
    class Pt { }
    Pt.Man_actionhero = "man_actionhero", Pt.Man_butler = "man_butler", Pt.Man_cyclist = "man_cyclist",
        Pt.Man_doctor = "man_doctor", Pt.Man_metalhead = "man_metalhead", Pt.Man_naval_officer = "man_naval_officer",
        Pt.Man_paramedic = "man_paramedic", Pt.Man_pilot = "man_pilot", Pt.Man_reporter = "man_reporter",
        Pt.Man_scientist = "man_scientist", Pt.Man_skate = "man_skate", Pt.Man_tennis = "man_tennis";
    class Dt { }
    Dt.Woman_basketball_player = "woman_basketball_player", Dt.Woman_carpenter = "woman_carpenter",
        Dt.Woman_casual = "woman_casual", Dt.Woman_dentist = "woman_dentist", Dt.Woman_doctor = "woman_doctor",
        Dt.Woman_metalhead = "woman_metalhead", Dt.Woman_tennis = "woman_tennis", Dt.Woman_wh = "woman_wh",
        Dt.Female_worker = "female_worker", Dt.Male_worker = "male_worker";
    class kt { }
    kt.VendingMachine = "VendingMachine", kt.WaterRoom = "waterRoom", kt.WaitAera = "waitAera",
        kt.MaleSink = "maleSink", kt.FamaleSink = "famaleSink", kt.Toilet = "toilet", kt.PeeArea = "peeArea",
        kt.CleanRoom = "cleanRoom", kt.Entrance = "Entrance", kt.Exit = "Exit", kt.EP_femaleToilet = "EP_femaleToilet",
        kt.EP_malePee = "EP_malePee", kt.EP_maleToilet = "EP_maleToilet", kt.Man_actionhero = "man_actionhero",
        kt.Man_butler = "man_butler", kt.Man_cyclist = "man_cyclist", kt.Man_doctor = "man_doctor",
        kt.Man_metalhead = "man_metalhead", kt.Man_naval_officer = "man_naval_officer",
        kt.Man_paramedic = "man_paramedic", kt.Man_pilot = "man_pilot", kt.Man_police = "man_police",
        kt.Man_reporter = "man_reporter", kt.Man_scientist = "man_scientist", kt.Man_skate = "man_skate",
        kt.Man_tennis = "man_tennis", kt.Woman_basketball_player = "woman_basketball_player",
        kt.Woman_carpenter = "woman_carpenter", kt.Woman_casual = "woman_casual", kt.Woman_dentist = "woman_dentist",
        kt.Woman_doctor = "woman_doctor", kt.Woman_metalhead = "woman_metalhead", kt.Woman_scientist = "woman_scientist",
        kt.Woman_tennis = "woman_tennis", kt.Female_worker = "female_worker";
    class Ut { }
    Ut.Caidai = "caidai", Ut.Cleaning = "cleaning", Ut.Emoji_money = "emoji_money",
        Ut.Emoji_angry = "emoji_angry", Ut.Emoji_cry = "emoji_cry", Ut.Emoji_cute = "emoji_cute",
        Ut.Emoji_dead = "emoji_dead", Ut.Emoji_happy = "emoji_happy", Ut.Emoji_poop = "emoji_poop",
        Ut.Emoji_sick = "emoji_sick", Ut.Pee = "pee", Ut.Money = "money", Ut.Hushen = "hushen",
        Ut.Shui = "shui", Ut.Urine = "urine", Ut.Pg = "pg", Ut.Yan = "yan", Ut.Sink_Damage = "sink_Damage",
        Ut.Sink_Dirty = "sink_Dirty", Ut.Toilet_damage = "toilet_damage", Ut.Toilet_dirty = "toilet_dirty",
        Ut.Pee_dirty = "pee_dirty", Ut.Pee_Damage = "pee_Damage", Ut.CleanRoom = "cleanRoom",
        Ut.Entrance = "Entrance", Ut.Exit = "Exit", Ut.Door = "door", Ut.Male_wall = "male_wall",
        Ut.Female_wall = "female_wall", Ut.VendingMachine = "VendingMachine", Ut.Limit = "limit",
        Ut.ZS = "ZS";
    class Tt extends kt { }
    Tt.Camera = "camera", Tt.Environment = "environment", Tt.HeightFog = "heightFog";
    const Rt = {
        prefab0: xt,
        prefab1: vt,
        prefab2: At,
        prefab3: Pt,
        prefab4: Dt,
        prefab5: Ut
    }, Ot = Ut;
    class Et extends G {
        constructor() {
            super();
        }
        static get instance() {
            return this._instance ? this._instance : (this._instance = new Et(), this._instance);
        }
        init() {
            Lt.instance.ProList = this.m_proList;
        }
        register() {
            this.m_proList[b.CameraPro] = new wt(b.CameraPro), this.m_proList[b.HeightFogCubePro] = new bt(b.HeightFogCubePro);
        }
        allotPrefab(t) {
            this.m_proList[b.CameraPro].startPor({
                [Tt.Camera]: [Ct.instance.camera]
            }), this.m_proList[b.HeightFogCubePro].startPor({
                [Tt.HeightFog]: t[Tt.HeightFog]
            });
        }
        allotMediator() { }
        allotOtherScenePrefab(t, e) { }
        allotOtherSceneMediator(t) { }
    }
    var Mt, Bt, Gt, Nt, Ft, Vt, Wt, jt, Ht, zt, qt, Qt, Kt, Yt, Zt, Jt, Xt, $t, te, ee, ie, se, ae, ne, oe, re, le, he, ce, de, me, ue;
    !function (t) {
        t.LookAd = "_EEventUI_LookAd", t.UnLookAd = "_EEventUI_UnLookAd", t.CustomsChange = "_EEventUI_CustomsChange",
            t.GameStart = "_EEventUI_Start", t.GameEnd = "_EEventUI_GameEnd", t.GamePasue = "_EEventUI_GamePause",
            t.GameResume = "_EEventUI_GameResume", t.GameCom = "_EEventUI_GameCom", t.GameWin = "_EEventUI_GameWin",
            t.GameFail = "_EEventUI_GameFail", t.RoleDie = "_EEventUI_RoleDie", t.RoleRevive = "_EEventUI_RoleRevive",
            t.GameCoinChange = "_EEventUI_GameCoinChange", t.SoundStateChange = "_EEventUI_SoundStateChange",
            t.VibrateStateChange = "_EEventUI_VibrateStateChange", t.SceneGameCustomsInit = "_EEventUI_SceneGameCustomsInit",
            t.SceneGameCustomsLoading = "_EEventUI_SceneGameCustomsLoading", t.SceneGameCustomDelete = "_EEventUI_SceneGameCustomDelete",
            t.BuildConstruction = "_EEventUI_BuildConstruction", t.BuildComplete = "_EEventUI_BuildComplete",
            t.ShowStaffPanel = "_EEventUI_ShowStaffPanel", t.UpdateSlotData = "_EEventUI_UpdateSlot",
            t.UpdateSlotComplete = "_EEventUI_UpdateSlotUI", t.OnClickRepairBtn = "_EEventUI_OnClickRepairBtn",
            t.RepairProgressComplete = "_EEventUI_RepairProgressComplete", t.AddStaff = "_EEventUI_AddStaff",
            t.RenderMarketStaffList = "_EEventUI_RenderMarketStaffList", t.OnClickTip = "_EEventUI_OnClickTip",
            t.UpdateDiamondNum = "_EEventUI_UpdateDiamondNum", t.UpdateMoneyNum = "_EEventUI_UpdateMoneyNum",
            t.UpdateWaterState = "_EEventUI_UpdateWaterState", t.GuideToNext = "_EEventUI_GuideToNext",
            t.Guide = "_EEventUI__Guide", t.ShowCleanRoomStaff = "_EEventUI_ShowCleanRoomStaff",
            t.GuideToEnd = "_EEventUI_GuideToEnd", t.UpdateAdBuffTime = "_EEventUI_UpdateAdBuffTime",
            t.CostMoney = "减去花费", t.OtherGuide = "_EEventUI_OtherGuide", t.DamageSlot = "_EEventUI_DamageSlot",
            t.TaskEvent = "_EEventUI_TaskEvent", t.UpdateTaskProgress = "_EEventUI_UpdateTaskProgress",
            t.AddAdUtilityNetRed = "_EEventUI_AddAdUtilityNetRed", t.LibraryTimeOver = "LibraryTimeOver",
            t.CanteenTimeOver = "CanteenTimeOver", t.OnStopRecord = "OnStopRecord", t.OnStartRecord = "OnStartRecord";
    }(Mt || (Mt = {}));
    class _e {
        constructor() {
            this.m_data = [];
            let t = p.ConfigURL("guestPool.json"), e = a.Get(t, !0);
            e && (this.m_data = e), a.Unload(t);
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new _e()), this.m_instance;
        }
        init() { }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/SlotUiConfig.json";
    }(Bt || (Bt = {}));
    class ge extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ge()), this._instance;
        }
        initData() {
            this.m_dataList = Bt.dataList;
        }
    }
    class fe {
        static NameUpper(t) {
            return t = (t = t.replace(/^([a-z])/, t => t.toUpperCase())).replace(/_[a-zA-Z]/g, t => t.replace("_", "").toUpperCase());
        }
    }
    fe.list = ["slot_Baby_mirror_config", "slot_mt_config", "slot_Accessible_mt_config", "slot_clean_trash_can_config", "slot_detergent_config", "slot_airConditioner_config", "slot_Accessible_airConditioner_config", "slot_air_cleaner_config", "slot_sweep_config", "slot_cart_config", "slot_book_config", "slot_Chair_config", "slot_coffee_config", "slot_sweetmeats_config", "slot_desk_config", "slot_Accessible_cushion_config", "slot_plss_config", "slot_Accessible_wt_config", "slot_Baby_lr_config", "slot_Baby_c_config", "slot_urinal_config", "slot_Accessible_xbc_config", "slot_Baby_bed_config", "slot_Baby_bench_config", "slot_Baby_platform_config", "slot_Baby_toy_config", "slot_mint_config", "slot_Accessible_mint_config", "slot_potted_config", "slot_Accessible_pot_config", "slot_trashCan_config", "slot_Accessible_trash_config", "slot_paper_config", "slot_Accessible_paper_config", "slot_phone_config", "slot_Accessible_phone_config", "slot_clock_config", "slot_wash_basin_man_config", "slot_wash_basin_woman_config", "slot_Accessible_Hand_washstand_config", "slot_Baby_wash_config", "slot_sewage_config", "slot_flow_config", "slot_peeQueue_config", "slot_maleQueue_config", "slot_femaleQueue_config", "slot_book_cabinet_config", "slot_cashier_config", "slot_fruits_config", "slot_vertical_air_config", "slot_flower_config", "slot_shelf_config", "slot_freezer_config", "slot_bookrack_config", "slot_drinks_config", "slot_groceries_config", "slot_clean_config", "slot_basket_config", "slot_twowindow_config", "slot_onewindow_config", "slot_table_config", "slot_secretaire_config"];
    class pe {
        constructor() {
            this._map = {}, this._dict = {};
        }
        static get instance() {
            return null == this._instance && (this._instance = new pe()), this._instance;
        }
        initData() {
            let t = ge.instance.dataList.length;
            for (let e = 0; e < t; e++) {
                let t = ge.instance.dataList[e], i = p.ConfigURL(fe.NameUpper(t.name) + ".json"), s = a.Get(i, !0);
                s ? (this._map[e] ? console.error("Slot配置表添加失败，id重复：", e, i, this._map) : (this._map[e] = s,
                    this._dict[t.name] = s), a.Unload(i)) : console.error("Slot配置表读取失败：", i, t.name);
            }
        }
        GetSlotConfigByUID(t) {
            let e = this._map[t];
            return e || (console.error("获取UID对应的config失败：", t), null);
        }
        GetSlotConfigByName(t) {
            let e = this._dict[t];
            return e || (console.error("获取SlotName对应的config失败：", t), null);
        }
    }
    class ye {
        static Range(t, e) {
            return t + (e - t) * Math.random();
        }
        static RangeInt(t, e) {
            let i = ye.Range(t, e);
            return Math.floor(i);
        }
        static get random() {
            return Math.random();
        }
    }
    !function (t) {
        t.maleSinkAera = "maleSinkAera", t.femaleSinkAera = "femaleSinkAera", t.WaitAera = "waitAera",
            t.PeeArea = "PeeArea", t.maleToilet = "maleToilet", t.femaleToilet = "femaleToilet",
            t.pee = "pee", t.disableRoom = "disableRoom", t.waterRoom = "waterRoom", t.lineUp = "lineUp",
            t.famaleSink = "famaleSink", t.maleSink = "maleSink", t.babyRoom = "babyRoom", t.cleanRoom = "cleanRoom",
            t.coffeeRoom = "coffeeRoom", t.MapRoot = "MapRoot.json", t.GusetPool = "guestPool.json",
            t.EmployeeData = "EmployeeData.json", t.equipment = "equipment", t.placeholder = "placeholder",
            t.toiletWall = "street_men_toilet_1", t.cs_nv = "cs_nv", t.cs_nan = "cs_nan", t.line_up_men = "line_up_men",
            t.line_up_women = "line_up_women", t.line_up_pee = "line_up_pee", t.Chair = "Chair",
            t.Door = "door", t.slot_flow_config_0 = "slot_flow_config_0", t.slot_femaleQueue_config_1 = "slot_femaleQueue_config_1",
            t.slot_peeQueue_config_2 = "slot_peeQueue_config_2", t.slot_maleQueue_config_3 = "slot_maleQueue_config_3",
            t.entrance = "entrance", t.EP_Female = "EP_Female", t.EP_Male = "EP_Male", t.EP_Pee = "EP_Pee",
            t.exit = "exit", t.canteen = "canteen", t.Library = "library";
    }(Gt || (Gt = {}));
    class Se {
        constructor() {
            this._totalWeight = 0;
            let t = p.ConfigURL(Gt.EmployeeData), e = a.Get(t, !0);
            if (e) {
                this.m_data = e;
                for (let t of this.m_data) this._totalWeight += t.Weight, t.Weight = this._totalWeight;
            }
            a.Unload(t);
        }
        static get instance() {
            return null == this._instance && (this._instance = new Se()), this._instance;
        }
        GetRandomData() {
            let t = ye.Range(0, this._totalWeight), e = null;
            for (let i of this.m_data) if (i.Weight > t) {
                e = i;
                break;
            }
            return e;
        }
        static GetIconSprite(t) {
            switch (t) {
                case 0:
                    return "res/sprite/skillicon/skill_1001.png";

                case 1:
                    return "res/sprite/skillicon/skill_1002.png";

                case 2:
                    return "res/sprite/skillicon/skill_1003.png";

                case 3:
                    return "res/sprite/skillicon/skill_1004.png";

                case 4:
                    return "res/sprite/skillicon/skill_1005.png";
            }
        }
        static GetEmployeeSpriteByName(t) {
            return "";
        }
        static GetEmployeeSprite(t) {
            return 0 == t.Gender ? "res/sprite/employee/female_1.png" : "res/sprite/employee/male_1.png";
        }
    }
    !function (t) {
        t[t.MaleToilet = 2] = "MaleToilet", t[t.MalePee = 3] = "MalePee", t[t.MaleSink = 4] = "MaleSink",
            t[t.FemaleToilte = 6] = "FemaleToilte", t[t.FemaleSink = 7] = "FemaleSink", t[t.DisableToilet = 10] = "DisableToilet",
            t[t.CleanRoom = 11] = "CleanRoom", t[t.BabyRoom = 12] = "BabyRoom", t[t.WaitAera = 13] = "WaitAera",
            t[t.CoffeeRoom = 14] = "CoffeeRoom", t[t.Canteen = 15] = "Canteen", t[t.Library = 16] = "Library",
            t[t.WaterRoom = 17] = "WaterRoom";
    }(Nt || (Nt = {}));
    class Ie extends ut {
        constructor(t, ...e) {
            super(t), this.name = "ArgumentNullException", this.message = "参数为空（不允许）", t && (this.message = t),
                this.data = e;
        }
    }
    class Ce extends Laya.Script3D {
        get sprite3D() {
            return null == this._sprite3D && (this._sprite3D = this.owner), this._sprite3D;
        }
        get transform() {
            return null == this._transform && (this._transform = this.owner.transform), this._transform;
        }
        Invoke(t, e, i, s) {
            Laya.timer.once(t, this, e, i, s);
        }
        InvokeRepeating(t, e, i, s, a, n) {
            e > 0 && Laya.timer.once(t, this, () => Laya.timer.loop(e, this, i, s, a, n));
        }
        CancelAllInvoke() {
            Laya.timer.clearAll(this);
        }
        CancelInvoke(t) {
            Laya.timer.clear(this, t);
        }
        GetChildByName(t) {
            if (null == t || "" == t) throw new Ie();
            return this.sprite3D.getChildByName(t);
        }
        GetSpriteChildByName(t) {
            return this.GetChildByName(t);
        }
        Instantiate(t, e) {
            return Laya.Sprite3D.instantiate(t, e);
        }
        ToggleAllChild(t, e) {
            if (t.numChildren > 0) for (let i = 0; i < t.numChildren; i++) {
                t.getChildAt(i).active = e;
            }
        }
        DeepFind(t, e) {
            let i = e.numChildren, s = null;
            if (i > 0) {
                if (s = e.getChildByName(t)) return s;
                for (let a = 0; a < i; a++) {
                    let i = e.getChildAt(a);
                    if (s = this.DeepFind(t, i)) break;
                }
            }
            return s;
        }
    }
    class we extends mt {
        constructor(t, ...e) {
            super(t), this.name = "NullReferenceException", this.message = "依从一个空对象", t && (this.message = t),
                this.data = e;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/SlotUIDConst.json";
    }(Ft || (Ft = {}));
    class be extends U {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new be()), this._instance;
        }
        initData() {
            this.m_data = Ft.data;
        }
        static get Data() {
            return this.instance.data;
        }
    }
    class Le extends Ce {
        constructor() {
            super(...arguments), this._nameList = [Ot.Caidai, Ot.Cleaning, Ot.Emoji_angry, Ot.Emoji_cry, Ot.Emoji_cute, Ot.Emoji_dead, Ot.Emoji_happy, Ot.Emoji_poop, Ot.Emoji_sick, Ot.Emoji_money, Ot.Hushen, Ot.Money, Ot.Shui, Ot.Urine, Ot.Yan, Ot.Pee, Ot.Pee_dirty, Ot.Pee_Damage, Ot.Toilet_dirty, Ot.Toilet_damage, Ot.Sink_Dirty, Ot.Sink_Damage, Ot.Cleaning, Ot.ZS],
                this._map = new Map(), this._prefab = {}, this._callerDict = new Map();
        }
        static get instance() {
            return this._runtimeInstance;
        }
        get prefabs() {
            return Rt.prefab5;
        }
        onAwake() {
            Le._runtimeInstance = this;
        }
        InitAllPrefabs() {
            for (let t of this._nameList) {
                let e = p.prefab_url(t);
                if (!e) throw new Error("获取预置体url失败：" + t);
                {
                    let i = a.Get(e, !0);
                    if (!i) throw new Error("获取预置体失败：" + e);
                    this._prefab[t] = i;
                }
            }
        }
        GetEffectByName(t) {
            let e = this._map.get(t), i = null;
            if (e && e.length > 0) for (let t of e) if (!t.active) {
                i = t;
                break;
            }
            if (null == i) {
                let s = this._prefab[t];
                if (!s) throw new Error("获取特效预置体失败：" + t);
                i = this.Instantiate(s, X.s3d), null == e ? ((e = []).push(i), this._map.set(t, e)) : e.push(i);
            }
            return i;
        }
        RecycleEffect(t) {
            t.parent != this.owner && X.s3d.addChild(t), t.active = !1;
        }
        static PlayEffect(t, e, i, s, a) {
            let n = this.instance._callerDict.get(e);
            null == n && (n = new Map(), this.instance._callerDict.set(e, n));
            let o = n.get(t);
            return null == o && (o = this.instance.GetEffectByName(t)), o && (n.set(t, o), s && (o.transform.position = s),
                a && (o.transform.rotationEuler = a), i && Laya.timer.once(i, this, () => this.Clear(e, t)),
                o.active = !0), o;
        }
        static Clear(t, e) {
            let i = this.instance._callerDict.get(t);
            if (i) {
                let s = i.get(e);
                s && Le.instance.RecycleEffect(s), i.delete(e), i.size <= 0 && (i.clear(), this.instance._callerDict.delete(t));
            }
        }
        static ClearAll(t) {
            let e = this.instance._callerDict.get(t);
            e && (e.forEach(t => {
                Le.instance.RecycleEffect(t);
            }), e.clear()), this.instance._callerDict.delete(t);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/BuildConfig.json";
    }(Vt || (Vt = {}));
    class xe extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new xe()), this._instance;
        }
        initData() {
            this.m_dataList = Vt.dataList;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/DefaultBuilding.json";
    }(Wt || (Wt = {}));
    class ve extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ve()), this._instance;
        }
        initData() {
            this.m_dataList = Wt.dataList;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/UIManagerBuildConfig.json";
    }(jt || (jt = {}));
    class Ae extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Ae()), this._instance;
        }
        initData() {
            this.m_dataList = jt.dataList;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/FocusPositionConfig.json";
    }(Ht || (Ht = {}));
    class Pe extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Pe()), this._instance;
        }
        initData() {
            this.m_dataList = Ht.dataList;
        }
    }
    !function (t) {
        t.bottom_group = "m_bottom_group", t.anim_enter = "m_anim_enter", t.anim_exit = "m_anim_exit";
    }(zt || (zt = {})), function (t) {
        t.Bg = "EUILayer_Bg", t.EventLayer = "EventLayer", t.EventBar = "EventBar", t.Main = "EUILayer_Main",
            t.OneUI = "EUILayer_OneUI", t.TalkPanel = "TalkPanel", t.Panel = "EUILayer_Panel",
            t.ToiletPanel = "ToiletPanel", t.StaffInfoPanel = "StaffInfoPanel", t.MarketPanel = "MarketPanel",
            t.Popup = "EUILayer_Popup", t.Prop = "EUILayer_Prop", t.Tip = "EUILayer_Tip", t.Pause = "EUILayer_Pause",
            t.Set = "EUILayer_Set", t.Top = "EUILayer_Top", t.Loading = "EUILayer_Loading",
            t.Guide = "Guide";
    }(qt || (qt = {}));
    class De {
        static get top() {
            return 0;
        }
        static get bottom() {
            return 0;
        }
    }
    class ke {
        static getLayer(t) {
            return this.LayerList[t];
        }
        static Init() {
            fgui.UIConfig.packageFileExtension = "bin", Laya.stage.addChild(fgui.GRoot.inst.displayObject),
                this.LayerList = {};
            for (let t in qt) this.LayerList[qt[t]] = fgui.GRoot.inst.addChild(new fgui.GComponent());
            this.UpdateAllUI(), Laya.stage.on(Laya.Event.RESIZE, this, this.UpdateAllUI);
        }
        static AddUI(t, e) {
            let i = t.createInstance();
            if (e == qt.OneUI) {
                let t = ke.oneUIs;
                t.length > 0 && t.forEach(t => {
                    t && t.Hide();
                }), ke.oneUIs = [];
            }
            return this.getLayer(e).addChild(i), window[i.constructor.name] = i, i.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height - De.top - De.bottom),
                i;
        }
        static setUIToTopShow(t, e) {
            let i = this.getLayer(e);
            -1 != i.getChildIndex(t) ? (t.removeFromParent(), i.addChild(t)) : console.log(...s.packWarn("设置ui到最顶层失败，因为该层级里面没有该UI！"));
        }
        static UpdateAllUI() {
            let t = Laya.stage.width, e = Laya.stage.height;
            fgui.GRoot.inst.setSize(t, e);
            let i = fgui.GRoot.inst.numChildren, s = 0, a = 0;
            for (let t = 0; t < i; ++t) {
                let e = fgui.GRoot.inst.getChildAt(t);
                s = fgui.GRoot.inst.width, a = fgui.GRoot.inst.height - De.top - De.bottom, e.setSize(s, a),
                    e.y = De.top;
            }
        }
        static CheckIn(t, e, i) {
            return e > t.x && e < t.x + t.width && i > t.y && i < t.y + t.height;
        }
    }
    ke.oneUIs = [];
    class Ue {
        constructor() {
            this.top = 0, this.bottom = 0, this._ifUpdateUISize = !0, this._layer = qt.Panel,
                this._ifBelongUIMediator = !1, this._belongDownUIMediator = [], this._belongUpUIMediator = [],
                this._isShow = !1, this.m_serialNumber = Te.GlobalSerialNumber, Laya.stage.on(Laya.Event.RESIZE, this, this.UpdateUI);
        }
        get ui() {
            return this._ui;
        }
        get serialNumber() {
            return this.m_serialNumber;
        }
        get layer() {
            return this._layer;
        }
        get ifBelongUIMediator() {
            return this._ifBelongUIMediator;
        }
        get belongDownUIMediator() {
            return this._belongDownUIMediator;
        }
        get belongUpUIMediator() {
            return this._belongUpUIMediator;
        }
        get isShow() {
            return this._isShow;
        }
        get isDispose() {
            return this.ui.isDisposed;
        }
        set keyId(t) {
            this.m_keyId = t;
        }
        get keyId() {
            return this.m_keyId;
        }
        _InitBottom() {
            let t = this._ui[zt.bottom_group];
            this._defaultBottomHeight = null == t ? 0 : t.y;
        }
        _SetBottomDown(t = 0) {
            let e = this._ui[zt.bottom_group];
            null != e && (e.y = this._defaultBottomHeight + t);
        }
        setUIToTopShow() {
            this._ui && ke.setUIToTopShow(this._ui, this._layer);
        }
        Show() {
            if (this._isShow) this.setUIToTopShow(); else if (this.OnshowBefore(), this._isShow = !0,
                !this._ui || this._ui && this._ui.isDisposed ? (this._ui = ke.AddUI(this._classDefine, this._layer),
                    this._layer == qt.OneUI && ke.oneUIs.push(this)) : this.ui.visible = !0, this.setUIToTopShow(),
                this._OnShow(), this.UpdateUI(), this._ui[zt.anim_enter]) {
                this._ui[zt.anim_enter].play(Laya.Handler.create(this, this._CallEnterAnimEnd));
            } else this.OnEnterAnimEnd();
        }
        _CallEnterAnimEnd() {
            this.OnEnterAnimEnd();
        }
        UpdateUI() {
            if (!this._ifUpdateUISize) return;
            if (!this._isShow) return;
            if (!this._ui) return;
            if (this._ui.isDisposed) return;
            let t = fgui.GRoot.inst.width, e = fgui.GRoot.inst.height - this.top - this.bottom - De.top - De.bottom;
            this._ui.setSize(t, e), this._ui.y = this.top;
        }
        OnEnterAnimEnd() { }
        OnshowBefore() { }
        _OnShow() { }
        Hide(t = !0) {
            if (null != this._ui && !this._ui.isDisposed && this._isShow) if (this._isShow = !1,
                this.OnHideBefore(), this._ui[zt.anim_exit]) {
                this._ui[zt.anim_exit].play(Laya.Handler.create(this, this._DoHide, [t]));
            } else this._DoHide(t);
        }
        _DoHide(t) {
            t ? this._ui.dispose() : this._ui.visible = !1, this._OnHide();
        }
        OnHideBefore() { }
        _OnHide() { }
    }
    class Te {
        static get GlobalSerialNumber() {
            return this.m_GlobalSerialNumber++, this.m_GlobalSerialNumber;
        }
    }
    Te.m_GlobalSerialNumber = 0;
    class Re extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "EventCommPanel");
        }
        onConstruct() {
            this.m_btn_help_1 = this.getChildAt(0), this.m_btn_help_2 = this.getChildAt(1),
                this.m_btn_help_3 = this.getChildAt(2), this.m_btn_help_4 = this.getChildAt(3),
                this.m_btn_help_5 = this.getChildAt(4);
        }
    }
    Re.URL = "ui://gp34j27lkuiluf", function (t) {
        t[t.Normal = 0] = "Normal", t[t.Toilet = 1] = "Toilet", t[t.Repair = 2] = "Repair",
            t[t.StartRepair = 3] = "StartRepair", t[t.Building = 4] = "Building", t[t.Sweep = 5] = "Sweep",
            t[t.Money = 6] = "Money", t[t.Diamond = 7] = "Diamond";
    }(Qt || (Qt = {}));
    class Oe extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "EventTip");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0), this.m_runtime = this.getControllerAt(1),
                this.m_fill_green = this.getChildAt(11), this.m_t0 = this.getTransitionAt(0), this.m_t1 = this.getTransitionAt(1);
        }
    }
    Oe.URL = "ui://gp34j27lqrltut";
    class Ee extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "Mosaic");
        }
        onConstruct() {
            this.m_msk = this.getChildAt(0);
        }
    }
    Ee.URL = "ui://gp34j27ljjshv5";
    class Me extends rt {
        constructor() {
            super(...arguments), this.isCompleteGuide1 = !1, this.isCompleteGuide2 = !1, this.isCompleteGuide3 = !1,
                this.isCompleteGuide4 = !1, this.isCompleteGuide5 = !1, this.guideID = 0;
        }
    }
    class Be extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Be()), this.m_instance;
        }
        get Data() {
            return this._data;
        }
        get _saveName() {
            return "GuideData";
        }
        getNewData() {
            return new Me();
        }
        SaveData() {
            this._SaveToDisk(this._data);
        }
        InitData() {
            this._data = this._ReadFromFile();
        }
        static get IsCompleteAllGuide() {
            window["IsCompleteAllGuide"] = this.instance._data.isCompleteGuide1 && this.instance._data.isCompleteGuide2 && this.instance._data.isCompleteGuide3 && this.instance._data.isCompleteGuide4 && this.instance._data.isCompleteGuide5;
            return this.instance._data.isCompleteGuide1 && this.instance._data.isCompleteGuide2 && this.instance._data.isCompleteGuide3 && this.instance._data.isCompleteGuide4 && this.instance._data.isCompleteGuide5;
        }
    }
    class Ge {
        static get inst() {
            return this.GetInstance();
        }
        static InitUma() {
            if (Laya.Browser.onWeiXin) try {
                Ge.GetInstance();
            } catch (t) {
                console.error(t);
            } else console.error("不是微信平台，uma不进行初始化");
        }
        static GetInstance() {
            return null == this._inst && (Laya.Browser.onWeiXin ? this._inst = window.wx.uma : this._inst = window.uma),
                null == this._inst && console.error("Uma初始化失败！"), this._inst;
        }
        static setOpenid(t) {
            null != this._inst && this._inst.setOpenid(t);
        }
        static trackEvent(t, e) {
            this._onWeb && console.log(t, e), null != this._inst && this._inst.trackEvent(t, e);
        }
        static trackShare(t) {
            return null == this._inst ? t : this._inst.trackShare(t);
        }
        static shareAppMessage(t) {
            null != this._inst && this._inst.shareAppMessage(t);
        }
    }
    Ge._onWeb = !0, function (t) {
        t.OnGameEnter = "OnGameEnter", t.GuideStart = "GuideStart", t.GuideEnd = "GuideEnd",
            t.WorldEvent = "WorldEvent", t.WorldEvtAD = "WorldEvtAD", t.DoubleUI = "DoubleUI",
            t.DoubleAD = "DoubleAD", t.LuckWheel = "LuckWheel", t.LuckWheelAD = "LuckWheelAD",
            t.Build = "Build", t.Help = "Help", t.Repair = "Repair", t.Update = "Update", t.StaffUI = "StaffUI",
            t.Employee = "Employee", t.AddStaffPosition = "AddStaffPosition", t.MarkertAD = "MarkertAD",
            t.UpdateWaterRoom = "UpdateWaterRoom", t.OpenCoffeeUI = "OpenCoffeeUI", t.CoffeeAD = "CoffeeAD",
            t.CSSJ = "cssj", t.Task = "Task", t.BuildingStatistic = "BuildingStatistic", t.LoadProgress = "LoadProgress",
            t.GuideProgress = "GuideProgress";
    }(Kt || (Kt = {}));
    class Ne extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameTalk");
        }
        onConstruct() {
            this.m_type = this.getControllerAt(0), this.m_Bg = this.getChildAt(0), this.m_talk = this.getChildAt(2),
                this.m_Repair = this.getChildAt(3), this.m_Sweep = this.getChildAt(4), this.m_Help = this.getChildAt(5),
                this.m_ani = this.getTransitionAt(0);
        }
    }
    Ne.URL = "ui://8nmf3q47hpmn1d1";
    class Fe extends r {
        constructor() {
            super(...arguments), this.m_UIMediator = {}, this.m_onShowUI = [], this.m_ifSetMediatroList = !1;
        }
        setProxyMediatroList(t) {
            this.m_UIMediator = t, this.m_onShowUI = [], this.m_ifSetMediatroList = !0, this.Init();
        }
        Init() { }
        get ifSetMediatroList() {
            return this.m_ifSetMediatroList;
        }
        get onShowUIs() {
            return this.m_onShowUI;
        }
        getUIMeiatro(t) {
            return this.m_UIMediator[t];
        }
        closeUI(t) {
            this.setUIState([{
                typeIndex: t.keyId,
                state: !1
            }], !1);
        }
        setUIState(t, e = !0, i = {
            state: !1,
            dispose: !0
        }, a, n) {
            if (!this.m_ifSetMediatroList) return void console.log(...s.packError("还没有为UI代理类设置代理UI调度者列表！"));
            for (let e of t) void 0 === e.state && (e.state = !0), void 0 === e.dispose && (e.dispose = !0);
            void 0 === i.dispose && (i.dispose = !0);
            let o, r = [], l = [];
            t = y.ObjUnique(t, t => t.typeIndex), t = this.statesFilter(t);
            for (let e of t) e.state ? (-1 != (o = this.m_onShowUI.findIndex(t => t.typeIndex == e.typeIndex)) && this.m_onShowUI.splice(o, 1),
                r.push(e)) : -1 != (o = this.m_onShowUI.findIndex(t => t.typeIndex == e.typeIndex)) && (this.m_onShowUI.splice(o, 1),
                    l.push(e));
            if (e) {
                let t = [];
                for (let e in this.m_UIMediator) -1 == r.findIndex(t => t.typeIndex == e) && -1 == l.findIndex(t => t.typeIndex == e) && t.push({
                    typeIndex: e,
                    state: i.state,
                    dispose: i.dispose
                });
                i.state ? r.unshift(...t) : l.push(...t);
            } else r.unshift(...this.m_onShowUI);
            void 0 !== a && (a = y.Unique(a), r = r.filter(t => -1 != a.findIndex(e => e == this.m_UIMediator[t.typeIndex].layer))),
                void 0 !== n && (n = y.Unique(n), l = l.filter(t => -1 != n.findIndex(e => e == this.m_UIMediator[t.typeIndex].layer)));
            for (let t of l)
                this.m_UIMediator[t.typeIndex].ifBelongUIMediator ?
                    console.log(...s.packWarn("注意：有一个附属UI的UI调度者试图被隐藏，KEY为", this.m_UIMediator[t.typeIndex].keyId))
                    : this.hideUIMediator(this.m_UIMediator[t.typeIndex], t.dispose);
            for (let t of r)
                this.m_UIMediator[t.typeIndex].ifBelongUIMediator ?
                    console.log(...s.packWarn("注意：有一个附属UI的UI调度者试图被显示，KEY为", this.m_UIMediator[t.typeIndex].keyId))
                    : this.showUIMediator(this.m_UIMediator[t.typeIndex]);
            this.m_onShowUI = r;
        }
        statesFilter(t) {
            return t.filter(t => void 0 !== this.m_UIMediator[t.typeIndex]);
        }
        hideUIMediator(t, e, i = !1) {
            t.belongUpUIMediator.length > 0 && t.belongUpUIMediator.forEach(t => {
                this.hideUIMediator(t, e, !0);
            }), !i || t.ifBelongUIMediator ? t.Hide(e) : console.log(...s.packWarn("注意：有一个不是附属UI的UI调度者试图被隐藏，KEY为", t.keyId)),
                t.belongDownUIMediator.length > 0 && t.belongDownUIMediator.forEach(t => {
                    this.hideUIMediator(t, e, !0);
                });
        }
        showUIMediator(t, e = !1) {
            console.error("showUIMediator:" + t.keyId);
            t.belongDownUIMediator.length > 0 && t.belongDownUIMediator.forEach(t => {
                this.showUIMediator(t, !0);
            }), !e || t.ifBelongUIMediator ? t.Show() : console.log(...s.packWarn("注意：有一个不是附属UI的UI调度者试图被显示，KEY为", t.keyId)),
                t.belongUpUIMediator.length > 0 && t.belongUpUIMediator.forEach(t => {
                    this.showUIMediator(t, !0);
                });
        }
    }
    !function (t) {
        t.GameInit = "_EEventGlobal_GameInit", t.GameOnInit = "_EEventGlobal_GameOnInit",
            t.GameLoading = "_EEventGlobal_GameLoading", t.GameResLoading = "_EEventGlobal_GameResLoading";
    }(Yt || (Yt = {})), function (t) {
        t.GameLoading = "EUI_GameLoading", t.CustomsLoading = "EUI_CustomsLoading", t.TestMain = "EUI_TestMain",
            t.TestPlatform = "EUI_TestPlatform", t.Set = "EUI_Set", t.Pause = "EUI_Pause", t.Play = "EUI_Play",
            t.Start = "EUI_Start", t.Com = "EUI_Com", t.End = "EUI_End", t.Main = "Main", t.Manager = "Manager",
            t.EventLayer = "EventLayer", t.AD = "AD", t.LuckyWheel = "LuckyWheel", t.Offline = "Offline",
            t.RemoveAD = "RemoveAD", t.SuperDouble = "SuperDouble", t.Setting = "Setting", t.Task = "Task",
            t.Staff = "Staff", t.TopPanel = "TopPanel", t.EventPanel = "EventPanel", t.OffLineIncomePanel = "OffLineIncomePanel",
            t.StaffMarket = "StaffMarket", t.StaffInfoPanel = "StaffInfoPanel", t.Guide = "Guide",
            t.UIMoneyEffect = "UIMoneyEffect", t.UIMediatorCheers = "UIMediatorCheers", t.UIMediatorInfluencer = "UIMediatorInfluencer",
            t.UIMeditorRepairGame = "UIMeditorRepairGame", t.UIMediatorSpeedUp = "UIMediatorSpeedUp",
            t.UIMediatorFlyPanel = "UIMediatorFlyPanel", t.DailySign = "DailySign", t.OpenCoffee = "OpenCoffee",
            t.CountDownTime = "CountDownTime", t.RecordVideo = "RecordVideo", t.TalkPanel = "TalkPanel";
    }(Zt || (Zt = {}));
    class Ve extends Fe {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ve()), this.m_instance;
        }
        get gameMainMediator() {
            return this.getUIMeiatro(Zt.Main);
        }
        Init() {
            $.instance.onGlobal(Yt.GameLoading, this, this.gameLoading), $.instance.onGlobal(Yt.GameResLoading, this, this.gameResLoading),
                $.instance.onUI(Mt.SceneGameCustomsLoading, this, this.gameCustomsLoading);
        }
        Start() {
            this.setUIState([{
                typeIndex: Zt.Main
            }, {
                typeIndex: Zt.EventLayer
            }, {
                typeIndex: Zt.TopPanel
            }, {
                typeIndex: Zt.UIMediatorFlyPanel
            }]);
        }
        gameLoading() { }
        gameResLoading() { }
        gameCustomsLoading(t) {
            -1 == t && this.setUIState([{
                typeIndex: Zt.CustomsLoading
            }], !1);
        }
    }
    class We extends Ue {
        constructor() {
            super(),
                this._talkTextList = [
                    "Thank you, I feel much better!",
                    "Your toilet is very comfortable, I feel so much better!",
                    "This is a really nice toilet!！",
                    "A netizen said it was great, and it really lives up to its name!",
                    "I had a sudden stomach ache at the party, happy to come here!",
                    "I came here because of the service and the environment!"
                ],
                this._repairText = "Click              on the screen,let the employees take care of it and get back to work faster!",
                this._worldEvtText = "Click on the buttons on the right                   can get reward or benefit",
                this._helpText = "The customer with           on his head needs your help, tap the button several times to help him.",
                this._lastShowTime = 0,
                this._layer = qt.TalkPanel, this._timer = 6e4, this._typeIndex = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new We(), this.m_instance._classDefine = Ne),
                this.m_instance;
        }
        _OnShow() {
            window["TalkPanel"] = this.ui;
            this.ui.m_type.selectedIndex = this._typeIndex, this.ui.m_ani.play(Laya.Handler.create(this, this.ShowTalk)),
                this.ui.m_talk.visible = !1, this.ui.m_Repair.visible = !1, this.ui.m_Sweep.visible = !1,
                this.ui.m_Help.visible = !1;

            TalkPanel._children[6].y = 872;
            TalkPanel._children[7].y = 874;
            TalkPanel._children[8].y = 876;
            TalkPanel._children[9].y = 872;

            TalkPanel._children[6].x = 450;
            TalkPanel._children[7].x = 490;
            TalkPanel._children[8].x = 530;
            TalkPanel._children[9].x = 570;
        }
        _OnHide() {
            this._lastShowTime = new Date().getTime();
        }
        ShowTalkPanel(t) {
            if (this.isShow || !Be.IsCompleteAllGuide) return !1;
            let e = new Date().getTime() - this._lastShowTime;
            return e > this._timer ? (this._typeIndex = t, Ve.instance.setUIState([{
                typeIndex: Zt.TalkPanel,
                state: !0
            }], !1)) : console.log("时间差小于" + this._timer / 1e3 + "秒，不显示对话事件:" + e), !0;
        }
        ShowTalk() {
            console.error(" this._typeIndex:" + this._typeIndex);
            Laya.LocalStorage.setItem("_typeIndex", this._typeIndex);
            if (this.isShow) {
                if (this.ui.m_talk.visible = !0, 0 == this._typeIndex || 1 == this._typeIndex) {
                    let t = ye.RangeInt(0, this._talkTextList.length);
                    this.ui.m_talk.title = this._talkTextList[t];
                } else 2 == this._typeIndex ? (
                    this.ui.m_Repair.visible = !0, this.ui.m_Sweep.visible = !0,
                    this.ui.m_Sweep.x = 420, this.ui.m_Repair.x = 370,
                    this.ui.m_Sweep.y = 820, this.ui.m_Repair.y = 820,
                    this.ui.m_talk.text = this._repairText

                ) : 3 == this._typeIndex
                    ? this.ui.m_talk.text = this._worldEvtText
                    : 4 == this._typeIndex && (
                        this.ui.m_Help.visible = !0,
                        this.ui.m_Help.scaleX = 0.8,
                        this.ui.m_Help.scaleY = 0.8,
                        this.ui.m_talk._children[1].fontSize = 26,
                        this.ui.m_Help.x = 520,
                        this.ui.m_Help.y = 830,
                        this.ui.m_talk.text = this._helpText
                    );
                this.ui.m_Bg.onClick(this, this.OnClickClose);
            }
        }
        OnClickClose() {
            this.isShow && Ve.instance.setUIState([{
                typeIndex: Zt.TalkPanel,
                state: !1
            }], !1);
        }
    }
    class je extends Ue {
        constructor() {
            super(), this.offset = new Laya.Vector3(-2, 2, 0), this._layer = qt.EventBar, this.helpBtnList = [],
                this.commomBtnList = [], this.tipBtnList = [], this.mosaicList = [], this._dict = {},
                this._dictHelp = {}, this._dictRepair = {}, this._dictMosaic = {}, this._fillSpeed = .05,
                this._lastTipTime = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new je(), this.m_instance._classDefine = Re),
                this.m_instance;
        }
        _OnShow() {
            super.Show(), this.InitBtnList();
        }
        InitBtnList() {
            this.helpBtnList.push({
                btn: this.ui.m_btn_help_1,
                screenPos: new Laya.Vector4()
            }), this.helpBtnList.push({
                btn: this.ui.m_btn_help_2,
                screenPos: new Laya.Vector4()
            }), this.helpBtnList.push({
                btn: this.ui.m_btn_help_3,
                screenPos: new Laya.Vector4()
            }), this.helpBtnList.push({
                btn: this.ui.m_btn_help_4,
                screenPos: new Laya.Vector4()
            }), this.helpBtnList.push({
                btn: this.ui.m_btn_help_5,
                screenPos: new Laya.Vector4()
            });
            for (let t of this.helpBtnList) t.btn.visible = !1;
        }
        InstanceCommBtn() {
            let t = fairygui.UIPackage.createObject("EventPanel", "CommonButton");
            this.ui.addChild(t);
            let e = {
                btn: t,
                screenPos: new Laya.Vector4()
            };
            this.commomBtnList.push(e), e.btn.visible = !1;
        }
        InstanceTipBtn() {
            let t = Oe.createInstance();
            this.ui.addChild(t);
            let e = {
                btn: t,
                screenPos: new Laya.Vector4()
            };
            this.tipBtnList.push(e), t.m_fill_green.fillAmount = 0, e.btn.visible = !1;
        }
        InstanceMosaic() {
            let t = Ee.createInstance();
            this.ui.addChild(t);
            let e = {
                img: t,
                screenPos: new Laya.Vector4()
            };
            e.img.visible = !1, this.mosaicList.push(e);
        }
        EventDistribute(t, e, i, s) {
            switch (i) {
                case Qt.Toilet:
                    this.UpdateSpecialEven(t, e, s);
                    break;

                case Qt.Building:
                case Qt.Normal:
                    this.UpdateCommEven(t, e, i, s);
                    break;

                case Qt.Repair:
                case Qt.Sweep:
                case Qt.Money:
                case Qt.Diamond:
                    this.UpdateRepair(t, e, s, i);
                    break;

                case Qt.StartRepair:
                    this.StartRepair(e);
            }
        }
        UpdateSpecialEven(t, e, i) {
            let s, a;
            if ((s = this._dictMosaic[e]) && this.MosaicChangePos(t, s), a = this._dict[e]) {
                let s = a.btn;
                return this.ChangePos(t, a.screenPos, s), s.m_fill_green.fillAmount += pt.deltaTime / i,
                    void (s.m_fill_green.fillAmount >= 1 && (s.visible = !1, this._dict[e] = null, this._dictMosaic[e].img.visible = !1,
                        this._dictMosaic[e] = null, $.instance.event3D(L.DoNext, e)));
            }
            if (a = this._dictHelp[e]) {
                let i = a.btn;
                if (this.ChangePos(t, a.screenPos, i), i.m_fill_red.fillAmount += this._fillSpeed * pt.deltaTime,
                    i.m_fill_yellow.fillAmount > i.m_fill_red.fillAmount ? i.m_fill_yellow.fillAmount -= this._fillSpeed * pt.deltaTime * 2 : i.m_fill_yellow.fillAmount = i.m_fill_red.fillAmount - .02,
                    i.m_fill_red.fillAmount >= 1 || i.m_fill_yellow.fillAmount >= 1) {
                    if (i.m_fill_red.fillAmount >= 1) {
                        let t = new Date().getTime();
                        if (t - this._lastTipTime > 6e4) {
                            We.instance.ShowTalkPanel(4) && (this._lastTipTime = t);
                        }
                    }
                    i.off(Laya.Event.CLICK, this, this.OnClick), this._dictMosaic[e].img.visible = !1,
                        this._dictMosaic[e] = null;
                    let t = i.m_fill_yellow.fillAmount >= 1;
                    if ($.instance.event3D(L.DoNext, [e, t]), i.m_fill_yellow.fillAmount >= 1) return i.m_switch.selectedIndex = 1,
                        void Laya.timer.once(1e3, this, () => {
                            i.visible = !1, this._dictHelp[e] = null;
                        });
                    i.visible = !1, this._dictHelp[e] = null;
                }
            } else null == this._dictMosaic[e] && (this._dictMosaic[e] = this.GetMosaicImg()),
                ye.Range(0, 8) < 1.5 && Be.IsCompleteAllGuide ? null != (a = this.GetHelpObject(t)) && (this._dictHelp[e] = a) : null != (a = this.GetObject(t, Qt.Normal)) && (this._dict[e] = a);
        }
        UpdateCommEven(t, e, i, s) {
            let a;
            if (a = this._dict[e]) {
                let i = a.btn;
                return this.ChangePos(t, a.screenPos, i), i.m_fill_green.fillAmount += pt.deltaTime / s,
                    void (i.m_fill_green.fillAmount >= 1 && (i.visible = !1, this._dict[e] = null, $.instance.event3D(L.DoNext, e)));
            }
            null != (a = this.GetObject(t, i)) && (this._dict[e] = a);
        }
        UpdateRepair(t, e, i, s) {
            let a;
            if (a = this._dictRepair[e]) {
                let s = a.btn;
                return this.NoSkewChangePos(t, a.screenPos, s), void (2 == a.btn.m_runtime.selectedIndex && (s.m_fill_green.fillAmount += pt.deltaTime / i,
                    s.m_fill_green.fillAmount >= 1 && (console.log("======维修结束===="), s.visible = !1,
                        this._dictRepair[e] = null, $.instance.eventUI(Mt.RepairProgressComplete, e))));
            }
            null != (a = this.GetTipObject(t, e, s)) && (this._dictRepair[e] = a);
        }
        NoSkewChangePos(t, e, i) {
            this.isShow && (Ct.instance.camera.worldToViewportPoint(t, e), i.x = e.x, i.y = e.y - 70 * je.scale,
                i.scaleX = je.scale, i.scaleY = je.scale);
        }
        ChangePos(t, e, i) {
            this.isShow && (Ct.instance.camera.worldToViewportPoint(t, e), i.x = e.x, i.y = e.y - 80 * je.scale,
                i.scaleX = je.scale, i.scaleY = je.scale);
        }
        MosaicChangePos(t, e) {
            this.isShow && (Ct.instance.camera.worldToViewportPoint(t, e.screenPos), e.img.x = e.screenPos.x,
                e.img.y = e.screenPos.y - 20 * je.scale + 15, e.img.scaleX = je.scale, e.img.scaleY = je.scale);
        }
        InitButton(t) {
            t.m_fill_red.fillAmount = .05, t.m_switch.selectedIndex = 0, t.scaleX = .7, t.scaleY = .7,
                t.m_fill_yellow.fillAmount = t.m_fill_red.fillAmount, t.on(Laya.Event.CLICK, this, this.OnClick, [t]);
        }
        InitTipButton(t, e) {
            t.m_runtime.setSelectedIndex(0), t.onClick(this, () => {
                switch (t.m_state.selectedIndex) {
                    case 0:
                    case 1:
                        0 == t.m_runtime.selectedIndex && ($.instance.eventUI(Mt.OnClickRepairBtn), t.m_runtime.selectedIndex = 1,
                            Ge.trackEvent(Kt.Repair));
                        break;

                    case 2:
                    case 3:
                        $.instance.eventUI(Mt.OnClickTip, e), t.visible = !1;
                }
            });
        }
        OnClick(t) {
            t.m_fill_yellow.fillAmount += .1, Ge.trackEvent(Kt.Help);
        }
        GetObject(t, e) {
            let i;
            for (let s of this.commomBtnList) if (!s.btn.visible) {
                i = s, e == Qt.Building ? (i.btn.m_state.setSelectedIndex(1), i.btn.scaleX = 2,
                    i.btn.scaleY = 2) : (i.btn.m_state.setSelectedIndex(0), i.btn.scaleX = 1, i.btn.scaleY = 1),
                    i.btn.m_fill_green.fillAmount = .05, this.ChangePos(t, i.screenPos, i.btn), i.btn.visible = !0;
                break;
            }
            return null == i && Laya.timer.once(0, this, this.InstanceCommBtn), i;
        }
        GetHelpObject(t) {
            let e = null;
            for (let i of this.helpBtnList) if (!i.btn.visible) {
                e = i, this.InitButton(e.btn), this.ChangePos(t, e.screenPos, e.btn), e.btn.visible = !0;
                break;
            }
            return e;
        }
        GetTipObject(t, e, i) {
            let s;
            for (let a of this.tipBtnList) if (!a.btn.visible) {
                switch (s = a, this.InitTipButton(s.btn, e), i) {
                    case Qt.Repair:
                        s.btn.m_state.selectedIndex = 0;
                        break;

                    case Qt.Sweep:
                        s.btn.m_state.selectedIndex = 1;
                        break;

                    case Qt.Money:
                        s.btn.m_state.selectedIndex = 2;
                        break;

                    case Qt.Diamond:
                        s.btn.m_state.selectedIndex = 3;
                }
                s.btn.m_runtime.setSelectedIndex(0), s.btn.m_fill_green.fillAmount = 0, this.ChangePos(t, s.screenPos, s.btn),
                    s.btn.visible = !0;
                break;
            }
            return null == s && (console.log("tipBtnList没有可用的"), Laya.timer.once(0, this, this.InstanceTipBtn)),
                s;
        }
        GetMosaicImg() {
            let t;
            for (let e of this.mosaicList) if (!e.img.visible) {
                (t = e).img.visible = !0;
                break;
            }
            if (null == t) {
                Laya.timer.once(0, this, this.InstanceMosaic);
                for (let e of this.mosaicList) if (!e.img.visible) {
                    (t = e).img.visible = !0;
                    break;
                }
            }
            return null == t && console.warn("警告！警告！返回了一个空的mosaic"), t;
        }
        StartRepair(t) {
            this._dictRepair[t] ? (console.log("======开始维修====="), this._dictRepair[t].btn.m_runtime.selectedIndex = 2) : console.warn("_dictRepair[{0}]不存在", t);
        }
        RecycleBtn(t, e) {
            let i = this._dictRepair[t];
            if (i) return i.btn.visible = !1, this._dictRepair[t] = null, void $.instance.eventUI(Mt.RepairProgressComplete, t);
            console.error("回收失败" + t + e);
        }
        _OnHide() {
            super.Hide();
        }
    }
    je.scale = 1;
    class He extends Ce {
        constructor() {
            super(...arguments), this._maxForce = 5, this._minForce = 1, this._damp = 0, this._appleForce = new Laya.Vector3(),
                this._maxSize = 0, this._minSize = 1, this._scaleSpeed = 1, this.localPosition = new Laya.Vector3(0, -10, 0),
                this.oneTouch = !1, this.twoTouch = !1, this.hasTwoTouch = !1, this.posOne = new Laya.Vector2(),
                this.posTwo = new Laya.Vector2(), this._onDrag = !0, this._onScale = !0, this.offSet = new Laya.Vector3(0, 26.66, 50),
                this._targetPos = new Laya.Vector3(), this._lookPos = new Laya.Vector3();

        }
        static get instance() {
            return this._instance;
        }
        get Input() {
            return this._scene.input;
        }
        get _unTouch() {
            return !this.oneTouch && !this.twoTouch;
        }
        get isOneTouch() {
            return this.oneTouch && !this.twoTouch;
        }
        get isTwoTouch() {
            return this.oneTouch && this.twoTouch && this.hasTwoTouch;
        }
        get _scene() {
            return X.s3d;
        }
        onAwake() {
            He._instance = this;
        }

        onEnable() {
            super.onEnable();
            if (Laya.Browser.onPC) {
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
                Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMove);
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onUp);
            }
        }


        onDisable() {
            super.onDisable()
            if (Laya.Browser.onPC) {
                Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onDown);
                Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMove);
                Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onUp);
            }

        }

        onDown() {
            this.isMouseDown = true;
            let p = this.Input._mouseTouch;
            let t = { x: p.mousePositionX, y: p.mousePositionY }
            this.SetPos(this.posOne, t)
        }

        onMove() {
            if (!this.isMouseDown) return;
            let p = this.Input._mouseTouch;
            let t = { x: p.mousePositionX, y: p.mousePositionY }
            let e = t.x - this.posOne.x,
                i = t.y - this.posOne.y;
            this.SetPos(this.posOne, t);
            this.MoveByForce(-e, -i);
        }

        onUp() {
            this.isMouseDown = false;
        }

        Init(t) {
            let e = t.getChildByName("Cube");
            this.parent = e.transform, this._damp = It.instance.data.damp, this._maxForce = It.instance.data.maxForce,
                this._minForce = It.instance.data.minForce, this._rigidBody = e.getComponent(Laya.Rigidbody3D),
                this._rigidBody.linearDamping = It.instance.data.damp, this._rigidBody.linearFactor = new Laya.Vector3(1, 0, 1),
                this._rigidBody.angularFactor = new Laya.Vector3(0, 0, 0), e.addChild(this.owner),
                this.transform.localPosition = this.localPosition, X.camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0),
                this._maxSize = It.instance.data.orthographic_MaxSize, this._minSize = It.instance.data.orthographic_MinSize,
                this._scaleSpeed = It.instance.data.scaleSpeed;
        }

        MoveByForce(t, e) {
            (t ^ t + e * e) < .3 ? this._rigidBody.linearDamping <= 0 && (this._rigidBody.linearDamping = this._damp) : this._rigidBody.linearDamping > 0 && (this._rigidBody.linearDamping = 0);
            let i = (X.camera.orthographicVerticalSize - this._minSize) / (this._maxSize - this._minSize), s = yt.Lerp(this._minForce, this._maxForce, i);
            this._appleForce.x = t * s, this._appleForce.z = e * s, this._rigidBody.wakeUp(),
                this._rigidBody.linearVelocity = this._appleForce;
        }
        Scale(t) {
            t *= this._scaleSpeed;
            let e = X.camera.orthographicVerticalSize + t;
            e = yt.Clamp(this._minSize, this._maxSize, e), X.camera.orthographicVerticalSize = e,
                je.scale = this._maxSize / e * .8 + .2;
        }
        onUpdate() {
            this.TouchCountCheck(), this.Run();
        }
        onLateUpdate() { }
        TouchCountCheck() {
            let t = this._scene.input.touchCount();
            if (0 == t) {
                this.oneTouch = !1, this.twoTouch = !1, this.hasTwoTouch = !1, this._onDrag = !0,
                    this._onScale = !0
            } else if (1 == t) {
                this.oneTouch = !0, this.hasTwoTouch = !1, this._onScale = !0
            } else if (2 == t) {
                this.oneTouch = !0,
                    this.twoTouch = !0, this.hasTwoTouch = !0
            }

            if (Laya.Browser.onPC) {
                this.oneTouch = !1, this.twoTouch = !1, this.hasTwoTouch = !1, this._onDrag = !0,
                    this._onScale = !0
            }
        }
        Run() {

            // if (Laya.Browser.onPC) {
            //     // let p = this.Input._mouseTouch;
            //     // let t = {x:p.mousePositionX,y:p.mousePositionY}
            //     // let e = t.x - this.posOne.x, i = t.y - this.posOne.y;
            //     //     this.SetPos(this.posOne, t), this.MoveByForce(-e, -i);
            //     // if(this.isMouseDown){

            //     // }


            // } else {

            // }
            if (this.isTwoTouch) {
                if (this._onScale) {
                    let t = this.Input.getTouch(0).position;
                    this.SetPos(this.posOne, t);
                    let e = this.Input.getTouch(1).position;
                    this.SetPos(this.posTwo, e), this._onScale = !1;
                } else {
                    let t = this.Input.getTouch(0).position, e = this.Input.getTouch(1).position, i = this.GetDistance(t, e), s = this.GetDistance(this.posOne, this.posTwo);
                    this.SetPos(this.posOne, t), this.SetPos(this.posTwo, e), this.Scale(s - i);
                }
            }
            else if (this.isOneTouch) {
                if (this._onDrag) {
                    let t = this.Input.getTouch(0).position;
                    this.SetPos(this.posOne, t), this._onDrag = !1;
                } else {
                    let t = this.Input.getTouch(0).position, e = t.x - this.posOne.x, i = t.y - this.posOne.y;
                    this.SetPos(this.posOne, t), this.MoveByForce(-e, -i);
                }
            }



            (this._unTouch || this.oneTouch && this.twoTouch) && this._rigidBody.linearDamping <= 0 && (this._rigidBody.linearDamping = this._damp);
        }
        SetPos(t, e) {
            t.x = e.x, t.y = e.y;
        }
        GetDistance(t, e) {
            let i = t.x - e.x, s = t.y - e.y;
            return Math.sqrt(i * i + s * s);
        }
        FocusPositionByIndex(t, e = !0) {
            let i = Pe.instance.dataList[t];
            return this.FocusPosition(i, e), i;
        }
        FocusBuild(t) {
            let e = Pe.instance.dataList[t];
            this.FocusPosition({
                x: e.x,
                y: e.y,
                z: e.z + 4.5
            }, !1);
        }
        FocusPosition(t, e = !0, i = null) {
            let s = new Laya.Vector3(-t.x, t.y, t.z), a = this.parent.position;
            Laya.Vector3.add(s, this.offSet, s), e && (X.camera.orthographicVerticalSize = 25,
                je.scale = this._maxSize / X.camera.orthographicVerticalSize * .8 + .2), Laya.Tween.to(a, {
                    x: s.x,
                    z: s.z,
                    update: new Laya.Handler(this, t => {
                        this.parent.position = t;
                    }, [a])
                }, 200, Laya.Ease.sineOut, i);
        }
        ComOffSet() {
            let t = new Laya.Vector2(), e = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
            X.camera.viewportPointToRay(t, e);
            let i = new Laya.HitResult();
            X.s3d.physicsSimulation.rayCast(e, i, 1e3, 2), Laya.Vector3.subtract(this.transform.position, i.point, this.offSet);
        }
        LookAt(t) {
            this._lookPos.setValue(t.x, 0, t.z), Laya.Vector3.add(this._lookPos, this.offSet, this._lookPos),
                this.parent.position.x = this._lookPos.x, this.parent.position.z = this._lookPos.z,
                this.parent.position = this.parent.position;
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/TaskConfig.json";
    }(Jt || (Jt = {}));
    class ze extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ze()), this._instance;
        }
        initData() {
            this.m_dataList = Jt.dataList;
        }
    }
    class qe {
        constructor() { }
        static DoConverter(t) {
            if (t = Math.floor(t), this.moneyStr = t.toString().trim(), this.moneyStr.length > 3 && this.moneyStr.length < 7) return this.moneyStr.slice(0, this.moneyStr.length - 3) + "," + this.moneyStr.slice(this.moneyStr.length - 3);
            if (this.moneyStr.length > 6) {
                let t = Math.floor((this.moneyStr.length - 6) / 3);
                if (t > 3) return "NAN";
                let e = this.moneyStr.substring(0, this.moneyStr.length - 3 * (t + 1)), i = this.moneyStr[this.moneyStr.length - 3 * (t + 1)];
                return parseInt(i) >= 5 && (e = (parseInt(e) + 1).toString()).length > 5 ? this.DoConverter(1e3 * (parseInt(e) + 1) * (t + 1)) : e.length > 3 ? e.slice(0, e.length - 3) + "," + e.slice(e.length - 3).concat(this.unit[t]) : e.concat(this.unit[t]);
            }
            return this.moneyStr;
        }
        static TaskDoConverter(t) {
            if (t = Math.floor(t), this.moneyStr = t.toString().trim(), this.moneyStr.length > 3) {
                let t = Math.floor((this.moneyStr.length - 4) / 3);
                if (t > 3) return "NAN";
                let e = this.moneyStr.substring(0, this.moneyStr.length - 3 * (t + 1)), i = this.moneyStr[this.moneyStr.length - 3 * (t + 1)];
                return parseInt(i) >= 5 && (e = (parseInt(e) + 1).toString()).length > 3 ? this.TaskDoConverter(1e3 * (parseInt(e) + 1) * (t + 1)) : e.concat(this.unit[t]);
            }
            return this.moneyStr;
        }
    }
    qe.moneyStr = "", qe.unit = ["k", "M", "B", "T"];
    class Qe {
        constructor(t) {
            this.index = t, this.name = ze.instance.dataList[t].name, this.describe = ze.instance.dataList[t].describe,
                this.reward = ze.instance.dataList[t].reward, this.rewardType = ze.instance.dataList[t].reward_type,
                this.record = 0, this.progress = 0, this.condition = ze.instance.dataList[t].condition;
        }
        CheckProgress(t) {
            return this.progress;
        }
        Init() {
            console.log("method(Init) not implement");
        }
        get NextTask() {
            return this.index + 1;
        }
        toProgressString() {
            return this.progress >= 100 ? "Done" : Math.floor(this.record) + "/" + this.condition;
        }
        toSimpleProgressString() {
            return this.progress >= 100 ? "Done" : qe.TaskDoConverter(this.record) + "/" + qe.TaskDoConverter(this.condition);
        }
        Go() {
            console.log("method(Go) not implement");
        }
    }
    class Ke { }
    !function (t) {
        t[t.UpdateFlow = 0] = "UpdateFlow", t[t.UpdateFemaleSink = 1] = "UpdateFemaleSink",
            t[t.UpdateMt = 2] = "UpdateMt", t[t.UpdateSewage = 3] = "UpdateSewage", t[t.UpdateMaleSink = 4] = "UpdateMaleSink",
            t[t.UpdateUrinal = 5] = "UpdateUrinal", t[t.UpdatePaper = 6] = "UpdatePaper", t[t.BuildMaleToilet = 7] = "BuildMaleToilet",
            t[t.BuildFemaleToilet = 8] = "BuildFemaleToilet", t[t.UpdateTrash = 9] = "UpdateTrash",
            t[t.Guest = 10] = "Guest", t[t.Money = 11] = "Money";
    }(Xt || (Xt = {}));
    class Ye {
        constructor(t, e, i, s, a) {
            this.count = t, this.name = e, this.UID = i, this.costWater = a, this.costMoney = s;
        }
    }
    class Ze extends rt {
        ReSort() {
            this.list.sort((t, e) => t.costMoney < e.costMoney ? 1 : t.costMoney == e.costMoney ? 0 : -1);
        }
    }
    class Je extends nt {
        constructor() {
            super(), this.InitData(), $.instance.onUI(Mt.BuildConstruction, this, this.OnBuildConstruction);
        }
        static get instance() {
            return null == this._instance && (this._instance = new Je()), this._instance;
        }
        Save() {
            console.log("保存数据"), this._SaveToDisk(this._data);
        }
        static get data() {
            return this.instance._data;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "BuildData";
        }
        getNewData() {
            return new Ze();
        }
        GetBuildDataByName(t) {
            return this.dict.get(t);
        }
        InitData() {
            if (this._data = this._ReadFromFile(), this.dict = new Map(), null == this._data.list || this._data.list.length <= 0) {
                this._data.list = [];
                for (let t of ve.instance.dataList) this._data.list.push(new Ye(t.defaultCount, t.name, t.UID, t.money, t.water));
            }
            for (let t of this._data.list) this.dict.set(t.name, t);
        }
        OnBuildConstruction(t, e) {
            console.log('jianzaonvce-----')
            let i = this.dict.get(e);
            if (!i) throw new we("按照名字获取Data失败，导致升级失败", t, e);
            {
                let t = Ae.instance.dataList[i.UID].maxCount, s = null, a = null;
                if (i.count <= t) {
                    i.count += 1;
                    let n = i.name == Gt.maleToilet, o = i.count + 1;
                    if (i.count + 1 <= t) switch (e) {
                        case Gt.maleToilet:
                            s = xe.instance.dataList[o].maleMoney, a = xe.instance.dataList[o].maleWater;
                            break;

                        case Gt.femaleToilet:
                            s = xe.instance.dataList[o].femaleMoney, a = xe.instance.dataList[o].femaleWater;
                            break;

                        case Gt.disableRoom:
                            s = xe.instance.dataList[o].disableMoney, a = xe.instance.dataList[o].disableWater;
                            break;

                        case Gt.babyRoom:
                            s = xe.instance.dataList[o].babyMoney, a = xe.instance.dataList[o].babyWater;
                            break;

                        default:
                            console.log("没有设置case：", e);
                    }
                    if (console.log(e, "下一级花费", s, a), console.log(window.isVideo, "-----------------"), window.isVideo ? (showReward(() => {
                        $.instance.eventUI(Mt.CostMoney, 0)
                    })) : $.instance.eventUI(Mt.CostMoney, i.costMoney),
                        i.costMoney = s || 0, i.costWater = a || 0, this._tempDataCount = i.count, this._tempBuidlingName = e,
                        this._tempIsMale = n, Ge.trackEvent(Kt.Build, {
                            Building_name: i.name + "_Building_count_" + i.count.toString()
                        }), $.instance.eventUI(Mt.BuildComplete, e), e == Gt.maleToilet || e == Gt.femaleToilet) {
                        let t = new Ke();
                        t.evt = e == Gt.maleToilet ? Xt.BuildMaleToilet : Xt.BuildFemaleToilet, $.instance.eventUI(Mt.TaskEvent, t);
                        let s = this.GetFocusPos(i.count, n), a = this.GetFocusIndex(i.count, n);
                        new Laya.Vector3(s.x, 0, s.z);
                        He.instance.FocusPositionByIndex(a);
                    } else e == Gt.Library ? He.instance.FocusPositionByIndex(22) : e == Gt.canteen && He.instance.FocusPositionByIndex(23);
                    Laya.timer.once(500, this, this.EventBuildingComplete), this._SaveToDisk(this._data);
                } else console.log("当前建筑已经达到最大级:", e, i.count, i);
            }
        }
        EventBuildingComplete() {
            $.instance.event3D(L.OpenBuildBlock, [this._tempDataCount, this._tempIsMale]),
                $.instance.event3D(L.UpdateBuildingData, {
                    Name: this._tempBuidlingName,
                    Count: this._tempDataCount
                }), Laya.timer.clearAll(this);
        }
        GetFocusPos(t, e) {
            let i = this.GetFocusIndex(t, e);
            return Pe.instance.dataList[i];
        }
        GetFocusIndex(t, e) {
            return e ? 24 + t : 30 + t;
        }
    }
    class Xe extends Ce {
        constructor() {
            super(...arguments), this._array = {}, this._dict = new Map(), this._facTable = new Map(),
                this._facList = [], this._guestToFac = new Map(), this._maleList = new Array(20),
                this._femaleList = new Array(20), this._peeList = new Array(20), this._femaleSinkList = new Array(1),
                this._maleSinkList = new Array(1), this._MaxSizePee = 4, this._MaxSizeMale = 4,
                this._MaxSizeFemale = 4, this._endPointTable = {}, this._queuePosTable = {}, this._flow = 0,
                this._doorList = [], this._StatisticsArray = [];
        }
        static get instance() {
            return this._instance;
        }
        get buildingMap() {
            return this._dict;
        }
        onAwake() {
            Xe._instance = this, $.instance.on3D(L.UpdateBuildingOutlookEvent, this, this.UpdateBuildingOutlookEvent),
                $.instance.on3D(L.UpdateSlotOutLook, this, this.UpdateSlotOutLookEvent), Laya.timer.once(1500, this, this.UpdateCheck),
                $.instance.onUI(Mt.DamageSlot, this, this.DamageSlot);
        }
        UpdateCheck() {
            Laya.timer.loop(500, this, this.CheckQueue);
        }
        SetPrefabs(t) {
            this._prefabs = t, this.InitDoorManager(t);
        }
        AddBuild(t, e) {
            let i = e, s = this._array[i];
            if (s) {
                s.indexOf(t) < 0 ? s.push(t) : console.error("重复添加建筑:", t);
            } else this._array[i] = [], this._array[i].push(t);
            null == this._dict.get(t.buildingName) ? this._dict.set(t.buildingName, t) : console.error("字典中已经包含相同键"),
                this.UpdateBlockState(e, t), this.AddFacsByList(e, t.slotPosList), this.AddEndPoint(e, t),
                this.AddPosPlane(e, t), this.UpdateWaitAreaSize(t);
        }
        ExistBuilding(t) {
            let e = this._array[t];
            return e && e.length > 0;
        }
        GetBuildingByName(t) {
            return this._dict.get(t);
        }
        GetBuildingListByFunctionID(t) {
            return this._array[t];
        }
        UpdateBuildingOutlookEvent(t) {
            if (!t) throw new Ie("建筑脚本获取失败，参数不应为null");
            {
                let e = this._dict.get(t.buildingName);
                if (!e) throw new we("建筑脚本获取失败!" + t.buildingName, t);
                if (e.InitBuilding(t.buildingData, !0), this.AddFacsByList(e.functionID, e.slotPosList),
                    this.UpdateWaitAreaSize(e), e.functionID == Nt.MaleToilet) {
                    this.GetBuildingByName(Gt.PeeArea).UpdateFacOutLook();
                }
            }
            let e = this.GetBuildingListByFunctionID(t.buildingData.functionID);
            for (let i of e) this.UpdateBlockState(t.buildingData.functionID, i);
        }
        UpdateBlockState(t, e) {
            switch (t) {
                case Nt.MaleToilet:
                    let i = Je.instance.GetBuildDataByName(Gt.maleToilet);
                    e.sprite3D.active = e.index <= i.count + 1;
                    break;

                case Nt.FemaleToilte:
                    let s = Je.instance.GetBuildDataByName(Gt.femaleToilet);
                    e.sprite3D.active = e.index <= 2 * s.count + 2;
            }
        }
        UpdateSlotOutLookEvent(t) {
            let e = this._dict.get(t.building.buildingName);
            if (e) {
                let i = e.slots[t.slotIndex];
                e.UpdateFacilityLevel(i.name + "_" + t.slotIndex.toString(), i.level, !0, i), this.AddFacsByList(e.functionID, e.slotPosList),
                    this.UpdateWaitAreaSize(e), $.instance.event3D(L.OnUpdateSlotComplete);
                let s = e.developProgress;
                Ge.trackEvent(Kt.BuildingStatistic, {
                    progress: e.buildingName + "_" + Math.floor(100 * s)
                });
            } else console.error("建筑管理者获取建筑失败，无法升级slot！");
        }
        get flow() {
            return this._flow;
        }
        get MaxSizeMale() {
            return this._MaxSizeMale;
        }
        get MaxSizePee() {
            return this._MaxSizePee;
        }
        get MaxSizeFemale() {
            return this._MaxSizeFemale;
        }
        get femaleQueueCount() {
            return this.GetCount(this._femaleList, this._MaxSizeFemale);
        }
        get maleQueueCount() {
            return this.GetCount(this._maleList, this._MaxSizeMale);
        }
        get peeQueueCount() {
            return this.GetCount(this._peeList, this._MaxSizePee);
        }
        AddFacsByList(t, e) {
            if (e && e.length > 0) for (let i of e) this.AddFac(t, i);
        }
        AddFac(t, e) {
            let i = this._facTable.get(t);
            null == i && (i = [], this._facTable.set(t, i)), this.Contain(i, e) ? console.error("重复添加设备", e) : (i.push(e),
                this._facList.push(e));
        }
        AddEndPoint(t, e) {
            switch (t) {
                case Nt.WaitAera:
                    this.AddEndPointForWaitArea(e);
                    break;

                case Nt.MalePee:
                case Nt.FemaleToilte:
                case Nt.MaleToilet:
                    break;

                default:
                    this.AddEndPointForNormalBuilding(t, e);
            }
        }
        AddEndPointForNormalBuilding(t, e) {
            if (null == this._endPointTable[t]) {
                let i = e.owner.getChildByName(Gt.entrance);
                if (i) {
                    let s = i.numChildren - 1, a = i.getChildAt(s);
                    a ? this._endPointTable[t] = a : console.log("此功能的建筑没有设置队列入口", e);
                }
            } else console.error("此功能的队列入口已经存在：", t);
        }
        AddEndPointForWaitArea(t) {
            let e = t.owner.getChildByName(Gt.EP_Female), i = t.owner.getChildByName(Gt.EP_Male), s = t.owner.getChildByName(Gt.EP_Pee);
            this._endPointTable[Nt.FemaleToilte] = e, this._endPointTable[Nt.MaleToilet] = i,
                this._endPointTable[Nt.MalePee] = s;
        }
        AddPosPlane(t, e) {
            switch (t) {
                case Nt.MaleToilet:
                case Nt.FemaleToilte:
                case Nt.MalePee:
                    break;

                case Nt.WaitAera:
                    this.AddPlaneFromWaitArea(e);
                    break;

                default:
                    this.AddPlaneFromNormalBuilding(t, e);
            }
        }
        AddPlaneFromWaitArea(t) {
            let e = t.owner.getChildByName(Gt.equipment), i = e.getChildByName(Gt.slot_femaleQueue_config_1);
            this.AddPlaneForFunction(Nt.FemaleToilte, [], i);
            let s = e.getChildByName(Gt.slot_maleQueue_config_3);
            this.AddPlaneForFunction(Nt.MaleToilet, [], s);
            let a = e.getChildByName(Gt.slot_peeQueue_config_2);
            this.AddPlaneForFunction(Nt.MalePee, [], a);
        }
        AddPlaneFromNormalBuilding(t, e) {
            let i = e.owner.getChildByName(Gt.entrance);
            this.AddPlaneForFunction(t, [], i);
        }
        AddPlaneForFunction(t, e, i) {
            let s = i.numChildren;
            if (s > 0) for (let t = 0; t < s; t++) {
                let s = i.getChildByName(t.toString());
                e.push(s);
            }
            this._queuePosTable[t] = e;
        }
        Contain(t, e) {
            return t.forEach(t => {
                if (t.sprite.id == e.sprite.id) return !0;
            }), !1;
        }
        UpdateWaitAreaSize(t) {
            let e = t.slots;
            for (let t of e) switch (t.uid) {
                case be.Data.slot_peeQueue_config:
                    let e = pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
                    if (!e) throw "无法获取小便区当前等级排队人数";
                    this._MaxSizePee = e;
                    break;

                case be.Data.slot_maleQueue_config:
                    let i = pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
                    if (!i) throw "无法获取男厕所当前等级排队人数";
                    this._MaxSizeMale = i;
                    break;

                case be.Data.slot_femaleQueue_config:
                    let s = pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
                    if (!s) throw "无法获取女厕所当前等级排队人数";
                    this._MaxSizeFemale = s;
                    break;

                case be.Data.slot_flow_config:
                    let a = pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
                    if (!a) throw "无法获取当前等级人流量";
                    this._flow = a, $.instance.event3D(L.UpdateMaxFlow, a);
            }
        }
        CheckQueue() {
            this.DispatchGuest(Nt.MaleToilet, this._maleList), this.DispatchGuest(Nt.MalePee, this._peeList),
                this.DispatchGuest(Nt.FemaleToilte, this._femaleList), this.DispatchGuest(Nt.FemaleSink, this._femaleSinkList),
                this.DispatchGuest(Nt.MaleSink, this._maleSinkList);
        }
        DispatchGuest(t, e) {
            let i = this.GetEmptyFuncPos(t);
            if (i) {
                let s = this.PopGuest(t, e);
                if (s) {
                    let t = i.belonger.entrance.transform.position, e = i.belonger.entrance.transform.position;
                    i.peopleSprite = s.sprite3D, this._guestToFac.set(s.sprite3D.id, i), s.MoveToEntrancePos({
                        entrance: t,
                        exit: e,
                        funcPos: i.sprite.transform.position,
                        slot: i.slotData,
                        fac: i
                    });
                }
            }
        }
        PopGuest(t, e) {
            let i = this.GetMaxSizeByFunction(t);
            for (let t = 0; t < i; t++) if (e[t]) {
                let i = e[t];
                return e[t] = null, i;
            }
            return null;
        }
        GetEmptyFuncPos(t) {
            let e = this._facTable.get(t);
            for (let t of e) if (null == t.peopleSprite && t.belonger.active && t.slotData.level > 0 && t.slotData.usable && !t.isBreaking) return t;
            return null;
        }
        GetQueue(t) {
            switch (t) {
                case Nt.MaleToilet:
                    return this._maleList;

                case Nt.FemaleToilte:
                    return this._femaleList;

                case Nt.MalePee:
                    return this._peeList;

                case Nt.FemaleSink:
                    return this._femaleSinkList;

                case Nt.MaleSink:
                    return this._maleSinkList;

                default:
                    return console.error("获取等待列表失败:", t), null;
            }
        }
        GetMaxSizeByFunction(t) {
            switch (t) {
                case Nt.MalePee:
                    return this._MaxSizePee;

                case Nt.FemaleToilte:
                    return this._MaxSizeFemale;

                case Nt.MaleToilet:
                    return this._MaxSizeMale;

                default:
                    return 1;
            }
        }
        GetPlaneList(t) {
            return this._queuePosTable[t];
        }
        GetCount(t, e) {
            let i = 0;
            for (let s = 0; s < e; s++) t[s] && i++;
            return i;
        }
        GetEndPoint(t) {
            return this._endPointTable[t];
        }
        TrtEnqueue(t, e, i) {
            try {
                let s = this.GetQueue(t);
                if (s) {
                    let e = this.GetMaxSizeByFunction(t), a = this.GetPlaneList(t)[e].transform.position;
                    i.setValue(a.x, a.y, a.z);
                    let n = this.GetCount(s, e);
                    return s && n < e;
                }
            } catch (s) {
                throw console.error(t, e, i), s;
            }
        }
        ExistInQueue(t, e) {
            return this.GetQueue(t).indexOf(e) > -1;
        }
        GetNextPointInQueue(t, e) {
            let i = this.GetQueue(t), s = this.GetMaxSizeByFunction(t), a = this.GetPlaneList(t);
            if (i) {
                let t = i.indexOf(e);
                if (t > -1) {
                    let s = t - 1;
                    if (s >= 0 && null == i[s]) return i[t] = null, i[s] = e, a[s].transform.position;
                } else {
                    let t = s - 1;
                    if (null == i[t]) return i[t] = e, a[t].transform.position;
                }
            }
            return null;
        }
        RequestOpenTheDoor(t) {
            return this.TryOpenDoor(t.transform.position);
        }
        ResetFac(t) {
            let e = this._guestToFac.get(t.sprite3D.id);
            e && (e.peopleSprite = null, this._guestToFac.delete(t.sprite3D.id), this.RandomBreakFacility(e));
        }
        RandomBreakFacility(t) {
            if (!Be.IsCompleteAllGuide) return;
            if (ye.Range(0, 100) < 7) {
                let e = ye.random > .5, i = !1;
                switch (t.slotData.uid) {
                    case be.Data.slot_mt_config:
                        let s = Le.PlayEffect(e ? Ot.Toilet_dirty : Ot.Toilet_damage, t.sprite.id);
                        t.sprite.addChild(s), s.transform.localPosition = St.zero, s.transform.rotationEuler = t.sprite.transform.rotationEuler,
                            i = !0;
                        break;

                    case be.Data.slot_urinal_config:
                        let a = Le.PlayEffect(e ? Ot.Pee_dirty : Ot.Pee_Damage, t.sprite.id);
                        t.sprite.addChild(a), a.transform.localPosition = St.zero, a.transform.rotationEuler = t.sprite.transform.rotationEuler,
                            i = !0;
                        break;

                    case be.Data.slot_wash_basin_man_config:
                    case be.Data.slot_wash_basin_woman_config:
                        let n = Le.PlayEffect(e ? Ot.Sink_Dirty : Ot.Sink_Damage, t.sprite.id);
                        t.sprite.addChild(n), n.transform.localPosition = St.zero, n.transform.rotationEuler = t.sprite.transform.rotationEuler,
                            i = !0;
                        break;

                    default:
                        i = !1;
                }
                i && (t.SetBreakState(!0, e ? Qt.Sweep : Qt.Repair), $.instance.event3D(L.RepairFacility, t));
            }
        }
        DamageSlot() {
            let t = this.GetBuildingListByFunctionID(Nt.MaleSink)[0].slotPosList[0];
            if (t) {
                let e = Le.PlayEffect(Ot.Toilet_damage, t.sprite.id);
                t.sprite.addChild(e), e.transform.localPosition = St.zero, e.transform.rotationEuler = t.sprite.transform.rotationEuler,
                    t.SetBreakState(!0, Qt.Repair), $.instance.event3D(L.RepairFacility, t);
            } else console.error("派发损坏失败!");
            $.instance.offUI(Mt.DamageSlot, this, this.DamageSlot);
        }
        InitDoorManager(t) {
            let e = t[Rt.prefab5.Door];
            if (!(e && e.length > 0)) throw new Error("建筑管理者初始化门失败！");
            this._doorList = e, $.instance.on3D(L.SetDoorActive, this, this.SetDoorActive);
        }
        GetDoorByPos(t) {
            let e = 1 / 0, i = null;
            for (let s of this._doorList) {
                let a = Laya.Vector3.distanceSquared(s.transform.position, t);
                a < e && (e = a, i = s);
            }
            return i;
        }
        TryOpenDoor(t, e = !0) {
            let i = this.GetDoorByPos(t), s = Laya.Vector3.distanceSquared(t, i.transform.position);
            if (i) {
                if (s > 100) return console.error("距离门太远了", s, t), !1;
                {
                    let t = i.getComponent(Laya.Animator);
                    return t.play("open"), e && Laya.timer.once(3500, this, () => t.play("close")),
                        !0;
                }
            }
            return !1;
        }
        TryCloseDoor(t) {
            let e = this.GetDoorByPos(t), i = Laya.Vector3.distanceSquared(t, e.transform.position);
            if (e) {
                if (i > 100) return console.error("距离门太远了", i, t), !1;
                return e.getComponent(Laya.Animator).play("close"), !0;
            }
            return !1;
        }
        SetDoorActive(t, e) {
            let i = this.GetDoorByPos(t);
            i && (i.active = e);
        }
        GetBuildingEntrance(t) {
            return this._array[t][0].entrance;
        }
        GetStatisticsInfo() {
            let t = Xe.instance.buildingMap;
            return this._StatisticsArray = [], t.forEach(t => {
                if (t.active) {
                    let e = t;
                    if (e.income > 0) {
                        let t = {
                            functionID: e.functionID,
                            title: e.title,
                            buildingName: e.buildingName,
                            income: e.income,
                            progress: e.developProgress
                        };
                        this._StatisticsArray.push(t);
                    }
                }
            }), this._StatisticsArray;
        }
        GetTotalMoney() {
            this.GetStatisticsInfo();
            let t = 0;
            return this._StatisticsArray.length > 0 && this._StatisticsArray.forEach(e => {
                t += e.income;
            }), t;
        }
    }
    class $e {
        constructor(t, e) {
            this.loops = 1, this.time = 0, this.runTimes = 0, this.time = t.getTime(), this.localTimeString = t.toLocaleTimeString(),
                this.event = e, this.Immediately(!1);
        }
        get isDone() {
            return this.loops >= 0 && this.runTimes >= this.loops;
        }
        UpdateClockTime(t, e = !0) {
            let i = new Date(t), s = new Date(this.time), a = e ? s.getDate() + 1 : s.getDate() - 1, n = new Date(i.getFullYear(), i.getMonth(), a, s.getHours(), s.getMinutes(), s.getSeconds());
            this.time = n.getTime();
        }
        Check(t) {
            t > this.time && (this.runTimes++, this.isDone || this.UpdateClockTime(t), this.DispatchEvent());
        }
        SetLoop(t) {
            this.loops = t;
        }
        DispatchEvent() {
            console.log(this.localTimeString, "广播", this.event), $.instance.event(this.event);
        }
        ResetEvent(t) {
            this.event = t, this.runTimes = 0;
        }
        Immediately(t = !1) {
            if (t) {
                let t = new Date().getTime();
                this.time > t && this.UpdateClockTime(t, !1);
            } else {
                let t = new Date().getTime();
                this.time < t && this.UpdateClockTime(t);
            }
            return this;
        }
    }
    class ti extends rt {
        constructor() {
            super(...arguments), this.List = [], this.TickEvent = [];
        }
    }
    class ei extends nt {
        constructor() {
            super(), this._hasRun = !1, this._clockEvtDict = new Map(), this._tempAdd = [],
                this._tempSub = [], this._offClock = [], this._onClock = [], this._isDirty = !1,
                this._isTicking = !1, this.InitData();
        }
        static get instance() {
            return null == this._instance && (this._instance = new ei()), this._instance;
        }
        get _saveName() {
            return "ClockManagerData";
        }
        getNewData() {
            return new ti();
        }
        InitData() {
            this._data = this._ReadFromFile();
            let t = [];
            for (let e of this._data.List) {
                let i = this._clockEvtDict.get(e.event);
                null == i && (i = {}, this._clockEvtDict.set(e.event, i)), e = i[e.localTimeString] = new $e(new Date(e.time), e.event),
                    t.push(e);
            }
            this._data.List = t;
        }
        get isTicking() {
            return this._isTicking;
        }
        set isTicking(t) {
            this._isTicking = t;
        }
        get _clockList() {
            return this._data.List;
        }
        get _tickEventList() {
            return this._data.TickEvent;
        }
        Start() {
            this._hasRun = !0, console.log("计时器启动..."), Laya.timer.loop(1e3, this, this.Tick);
        }
        AddClock(t, e) {
            let i = null, s = t.toLocaleTimeString(), a = this._clockEvtDict.get(e);
            if (null == a ? (a = {}, this._clockEvtDict.set(e, a), i = a[s] = new $e(t, e)) : null == (i = a[s]) && (i = a[s] = new $e(t, e)),
                this.isTicking) this._onClock.push(i), this.SetDirty(); else {
                this.indexOf(this._clockList, i) < 0 && (this._clockList.push(i), this.Save());
            }
            return i;
        }
        Tick() {
            this._isTicking = !0, this.OnTick(), this.AfterTick(), this._isTicking = !1;
        }
        OnTick() {
            let t = new Date();
            for (let e of this._clockList) e.Check(t.getTime()), e.isDone && this._offClock.push(e);
            for (let t of this._tickEventList) $.instance.event(t);
        }
        AfterTick() {
            this.SpliceElement(this._tempSub, this._tickEventList), this.SpliceElement(this._offClock, this._clockList),
                this.PushElement(this._tempAdd, this._tickEventList), this.PushElement(this._onClock, this._clockList);
            for (let t of this._offClock) this.DisposeClock(t);
            this._tempAdd.length > 0 && (this._tempAdd = []), this._tempSub.length > 0 && (this._tempSub = []),
                this._offClock.length > 0 && (this._offClock = []), this._onClock.length > 0 && (this._onClock = []),
                this._isDirty && (this.Save(), this._isDirty = !1);
        }
        indexOf(t, e) {
            if (null == t || t.length <= 0 || null == e) return -1;
            for (let i = 0; i < t.length; i++) {
                let s = t[i];
                if (s.event == e.event && s.localTimeString == e.localTimeString) return i;
            }
            return -1;
        }
        PushElement(t, e) {
            if (t.length > 0) for (let i of t) {
                let t = -1;
                (t = i instanceof $e ? this.indexOf(e, i) : e.indexOf(i)) < 0 && e.push(i);
            }
        }
        SpliceElement(t, e) {
            if (t.length > 0 && e.length > 0) for (let i of t) {
                if (0 == e.length) break;
                let t = -1;
                (t = i instanceof $e ? this.indexOf(e, i) : e.indexOf(i)) > -1 && e.splice(t, 1);
            }
        }
        SetDirty() {
            this._isDirty = !0;
        }
        Save() {
            this._SaveToDisk(this._data);
        }
        ClearUnusedClock() {
            for (let t of this._clockList) $.instance.hasListener(t.event) || this._offClock.push(t);
        }
        DisposeClock(t) {
            if (t) {
                let e = this._clockEvtDict.get(t.event);
                delete e[t.localTimeString], Object.keys(e).length <= 0 && this._clockEvtDict.delete(t.event);
                let i = this.indexOf(this._clockList, t);
                i > -1 && this._clockList.splice(i, 1);
            }
        }
        static OnTick(t) {
            if (this.instance._isTicking) this.instance._tempAdd.push(t), this.instance.SetDirty(); else {
                this._instance._tickEventList.indexOf(t) < 0 && this._instance._tickEventList.push(t),
                    this.instance.Save();
            }
        }
        static OffTick(t) {
            if (this.instance._isTicking) this.instance._tempSub.push(t), this.instance.SetDirty(); else {
                let e = this._instance._tickEventList.indexOf(t);
                e > -1 && this._instance._tickEventList.splice(e, 1), ei.instance.Save();
            }
        }
        static AddClock(t, e, i, s) {
            let a = new Date(), n = new Date(a.getFullYear(), a.getMonth(), a.getDate(), t, e, i);
            return ei.instance.AddClock(n, s);
        }
        static RemoveClock(t, e, i, s) {
            let a = ei.GetClock(t, e, i, s);
            this.instance.isTicking ? (this._instance._offClock.push(a), this.instance.SetDirty()) : (this.instance.DisposeClock(a),
                ei.instance.Save());
        }
        static GetClock(t, e, i, s) {
            let a = new Date(), n = new Date(a.getFullYear(), a.getMonth(), a.getDate(), t, e, i).toLocaleTimeString(), o = this.instance._clockEvtDict.get(s);
            if (o) return o[n];
        }
        static AddListener(t, e, i, s) {
            $.instance.on(t, e, i);
        }
        static RemoveListener(t, e, i, s) {
            $.instance.off(t, e, i, s);
        }
        static OnNewDay(t) {
            return ei.AddClock(0, 0, 0, t);
        }
    }
    !function (t) {
        t.Default = "Default", t.NewDay = "NewDay", t.UpdateOnLineTime = "UpdateOnLineTime";
    }($t || ($t = {}));
    class ii extends rt {
        constructor() {
            super(...arguments), this.money = 5e3, this.diamond = 700, this.water = 80, this.MaxWater = 80,
                this.staffSize = 3, this.workMarketTime = 432e5, this.onLineTime = 0, this.isFirstGame = !0,
                this.maxOffLineTime = 2, this.OfflineAdTotalNum = 0, this.OfflineDiamondLoop = 5,
                this.OfflineAdDayNum = 0, this.OfflineMaxDayNum = 8, this.LuckWheelAdDayNum = 0,
                this.LuckWheelAdMaxDayNum = 8, this.LuckWheelStartCount = 2, this.DoubleBuffTime = 0,
                this.MaxDoubleBuffTime = 0, this.signDay = 0, this.hasSign = !1, this.allTaskComplete = !1,
                this.CanteenLastTime = 864e5, this.LibraryLastTime = 1728e5, this.hasCanteenTime = !1,
                this.hasLibraryTime = !1;
        }
    }
    class si extends nt {
        constructor() {
            super(), this._runtimeTotalIncomeMin = 0, $.instance.onUI(Mt.AddStaff, this, this.AddStaff),
                $.instance.on3D(L.SceneLoadComplete, this, si.RefreshWater), $.instance.onUI(Mt.CostMoney, this, this.CostMoney),
                $.instance.on3D(L.OnUpdateSlotComplete, this, this.UpdateIncomeMin), ei.OnTick($t.UpdateOnLineTime),
                ei.OnNewDay($t.NewDay).SetLoop(-1), ei.AddListener($t.UpdateOnLineTime, this, this.OnTick),
                ei.AddListener($t.NewDay, this, this.OnNewDay);
        }
        static get data() {
            return this.instance._data;
        }
        static get AdIncomeBuff() {
            return this.instance._data.DoubleBuffTime > 0 ? 2 : 1;
        }
        static get toiletSpeed() {
            return this.speedUpTime > 0 ? .5 : 1;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new si()), this.m_instance;
        }
        get Data() {
            return this._data;
        }
        get _saveName() {
            return "MiscData";
        }
        getNewData() {
            return new ii();
        }
        InitData() {
            if (this._data = this._ReadFromFile(), null == this._data.staffList || this._data.staffList.length <= 0) {
                let t = {
                    Gender: 0,
                    Level: 2,
                    Name: "Anna",
                    Price: 5e3,
                    Weight: .5,
                    MoveSpeed: 1.5
                };
                this._data.staffList = [], this._data.staffList.push(t);
            }
            this._data.isFirstGame && (this._data.onLineTime = new Date().getTime(), this._data.isFirstGame = !1);
        }
        UpdateWaterState() {
            si.RefreshWater();
            let t = Xe.instance.GetBuildingByName(Gt.cleanRoom);
            si.MaxWater = t.waterAdd;
        }
        GetEmployeeIndexByName(t) {
            for (let e = 0; e < this._data.staffList.length; e++) {
                if (this._data.staffList[e].Name == t) return e;
            }
            return -1;
        }
        AddStaffPosNum() {
            this._data.staffSize += 1;
        }
        AddStaff(t, e) {
            let i = this._data.marketList[t];
            if (!i) throw Error("获取招聘市场雇员信息失败:" + t);
            {
                let t = this.GetEmployeeIndexByName(e);
                null != e && t > -1 ? (this._data.staffList[t] = i, console.log("替换雇员")) : (this._data.staffList.push(i),
                    console.log("增加雇员")), si.Money -= i.Price, $.instance.event3D(L.AddStaff, [i, e]),
                    $.instance.eventUI(Mt.RenderMarketStaffList), Ge.trackEvent(Kt.Employee, {
                        Number: this._data.staffList.length.toString()
                    });
            }
        }
        UpdateMarketList() {
            this._data.marketList = this.GetEmployeeDataFromPool();
        }
        GetEmployeeDataFromPool() {
            let t = [], e = si.instance.Data.staffList;
            for (; t.length < 3;) {
                let i = Se.instance.GetRandomData();
                t.indexOf(i) < 0 && !si.ContainEmployee(i, e) && t.push(i);
            }
            return t;
        }
        static ContainEmployee(t, e) {
            for (let i of e) if (i.Name == t.Name) return !0;
            return !1;
        }
        GetMarketEmployeeList() {
            return (!this._data.marketList || this._data.marketList.length < 0) && (this._data.marketList = this.GetEmployeeDataFromPool()),
                this._data.marketList;
        }
        GetEmployeeList() {
            return this._data.staffList;
        }
        static get Money() {
            return this.instance._data.money;
        }
        static set Money(t) {
            isNaN(t) ? console.error("NaN!!!") : (t > this.instance._data.money && this.instance.DispatchMoneyTaskEvent(t - this.instance._data.money),
                this.instance._data.money = t, $.instance.eventUI(Mt.UpdateMoneyNum, t));
        }
        static get Diamond() {
            return this.instance._data.diamond;
        }
        static set Diamond(t) {
            this.instance._data.diamond = t, $.instance.eventUI(Mt.UpdateDiamondNum, t);
        }
        static get Water() {
            return this.instance._data.water;
        }
        static UpdateWaterState() { }
        static set Water(t) {
            this.instance._data.water = t, $.instance.eventUI(Mt.UpdateWaterState);
        }
        static get MaxWater() {
            let t = Xe.instance.GetBuildingByName(Gt.waterRoom);
            return this.instance._data.MaxWater = t.waterAdd, this.instance._data.MaxWater;
        }
        static set MaxWater(t) {
            this.instance._data.MaxWater = t, $.instance.eventUI(Mt.UpdateWaterState);
        }
        static RefreshWater() {
            let t = Xe.instance.buildingMap, e = 0;
            if (null == t) throw "map is null!";
            return t.forEach(t => {
                if (t.active) {
                    e += t.wasteWater;
                }
            }), si.Water = e, e;
        }
        UpdateIncomeMin() {
            this._runtimeTotalIncomeMin = Xe.instance.GetTotalMoney() / 60, isNaN(this._runtimeTotalIncomeMin) && (this._runtimeTotalIncomeMin = 0),
                console.log("刷新每秒收入：", this._runtimeTotalIncomeMin);
        }
        OnTick() {
            this._runtimeTotalIncomeMin > 0 && (si.Money += this._runtimeTotalIncomeMin), si.data.DoubleBuffTime > 0 && (si.data.DoubleBuffTime -= 1e3,
                si.data.DoubleBuffTime < 0 && (si.data.DoubleBuffTime = 0, si.data.MaxDoubleBuffTime = 0),
                $.instance.eventUI(Mt.UpdateAdBuffTime)), si.speedUpTime > 0 && (si.speedUpTime -= 1e3,
                    si.speedUpTime < 0 && (si.speedUpTime = 0)), si.data.LibraryLastTime > 0 && si.data.hasLibraryTime && (si.data.LibraryLastTime -= 1e3,
                        si.data.LibraryLastTime < 0 && (si.data.LibraryLastTime = 0), $.instance.eventUI(Mt.LibraryTimeOver)),
                si.data.CanteenLastTime > 0 && si.data.hasCanteenTime && (si.data.CanteenLastTime -= 1e3,
                    si.data.CanteenLastTime < 0 && (si.data.CanteenLastTime = 0), $.instance.eventUI(Mt.CanteenTimeOver)),
                si.data.workMarketTime > 0 && (si.data.workMarketTime -= 1e3, si.data.workMarketTime < 0 && (si.data.workMarketTime = 432e5,
                    this.UpdateMarketList())), this._data.onLineTime = new Date().getTime(), this._SaveToDisk(this._data);
        }
        OnNewDay() {
            this._data.OfflineAdDayNum = 0, this._data.LuckWheelAdDayNum = 0, this._data.LuckWheelStartCount = 2,
                this._data.hasSign = !1;
        }
        static AddDoubleBuffTime(t) {
            si.data.MaxDoubleBuffTime += t, si.data.DoubleBuffTime += t;
        }
        CostMoney(t) {
            si.Money -= t;
            console.log('t--------------', t);
            console.log('si.Money-----------', si.Money)
        }
        DispatchMoneyTaskEvent(t) {
            if (this._data.allTaskComplete) return;
            let e = new Ke();
            e.evt = Xt.Money, e.data = t, $.instance.eventUI(Mt.TaskEvent, e);
        }
        AddSignDay() {
            this._data.signDay++, this._data.signDay = this._data.signDay % 7;
        }
    }
    si.speedUpTime = 0;
    class ai {
        constructor() {
            this.isBreaking = !1, this.usable = !1;
        }
        static UpdateSlotData(t, e) {
            if (e && e.length > 0) {
                let i = e[t.slotIndex];
                i.uid != t.uid && console.warn("Slot升级警告：信息UID和依靠索引索引获取的数据中的UID不一致！");
                let s = i.level + 1;
                if (s <= ge.instance.dataList[i.uid].maxLevel) {
                    i.level = s;
                    let e = pe.instance.GetSlotConfigByUID(i.uid)[s];
                    null != e.updateCostCoin && (si.Money -= e.updateCostCoin, Ge.trackEvent(Kt.Update, {
                        Type: "Money",
                        Update: t.building.buildingName + "_" + i.name + "_" + i.id + "_Level_" + i.level
                    })), null != e.updataCostDiamond && (si.Diamond -= e.updataCostDiamond, Ge.trackEvent(Kt.Update, {
                        Type: "Diamond",
                        Update: t.building.buildingName + "_" + i.name + "_" + i.id + "_Level_" + i.level
                    })), null != e.updateCostWater && si.UpdateWaterState(), $.instance.event3D(L.UpdateSlotOutLook, t),
                        $.instance.eventUI(Mt.UpdateSlotComplete), this.EventFacUpdate(i);
                } else console.warn("Slot升级警告：", t.building.buildingName, i.name, "已到达最大等级，无法升级！");
            } else console.error("获取数据失败！", t);
        }
        static EventFacUpdate(t) {
            if (!si.data.allTaskComplete) {
                let e = new Ke();
                switch (t.uid) {
                    case be.instance.data.slot_flow_config:
                        e.evt = Xt.UpdateFlow;
                        break;

                    case be.instance.data.slot_wash_basin_woman_config:
                        e.evt = Xt.UpdateFemaleSink;
                        break;

                    case be.instance.data.slot_mt_config:
                        e.evt = Xt.UpdateMt;
                        break;

                    case be.instance.data.slot_sewage_config:
                        e.evt = Xt.UpdateSewage;
                        break;

                    case be.instance.data.slot_wash_basin_man_config:
                        e.evt = Xt.UpdateMaleSink;
                        break;

                    case be.instance.data.slot_urinal_config:
                        e.evt = Xt.UpdateUrinal;
                        break;

                    case be.instance.data.slot_paper_config:
                        e.evt = Xt.UpdatePaper;
                        break;

                    case be.instance.data.slot_trashCan_config:
                        e.evt = Xt.UpdateTrash;
                }
                $.instance.event(Mt.TaskEvent, e);
            }
        }
    }
    class ni {
        constructor() {
            this.active = !1, this.slots = [];
        }
        Copy(t) {
            for (let e of t) {
                let t = new ai();
                t.id = e.id, t.uid = e.uid, t.level = e.level, t.name = e.name, this.slots.push(t);
            }
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/BuildingDefaultSlotConfig.json";
    }(te || (te = {}));
    class oi extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new oi()), this._instance;
        }
        initData() {
            this.m_dataList = te.dataList;
        }
    }
    class ri extends rt { }
    class li extends nt {
        constructor() {
            super(), $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new li()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "CleanRoomData";
        }
        getNewData() {
            return new ri();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !0, this._data.list.functionID = Nt.CleanRoom, this._data.list.index = 0,
                this._data.list.title = "清洁室", this._data.list.name = Rt.prefab5.CleanRoom, this.InitSlot(this._data.list),
                this._SaveToDisk(this._data));
        }
        InitSlot(t) {
            let e = 0, i = oi.instance.dataList;
            for (let t = 0; t < i.length; t++) i[t].cleanroom_Slot > -1 && e++;
            if (e > 0) {
                t.slots = new Array(e);
                for (let s = 0; s < e; s++) {
                    let e = new ai();
                    e.level = i[s].cleanroom_Slot_Level, e.uid = i[s].cleanroom_Slot, e.name = ge.instance.dataList[e.uid].name,
                        e.id = s, t.slots[s] = e;
                }
            } else console.warn("清洁室没有可用的Slot");
        }
        UpdateSlotData(t) {
            if (t.building.functionID == Nt.CleanRoom) {
                let e = this.data.list;
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class hi extends ni {
        constructor(t, e) {
            super(), this.isMale = t, this.active = !0, this.functionID = this.isMale ? Nt.MaleSink : Nt.FemaleSink,
                this.index = e, this.name = t ? "maleSinkAera" : "femaleSinkAera", this.title = t ? "Wash basin(Male)" : "Wash basin(Female)";
        }
    }
    class ci extends rt { }
    class di extends nt {
        constructor() {
            super(), this.dict = {}, $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new di()), this._instance;
        }
        static get data() {
            return this.instance._data;
        }
        get maleSinkData() {
            return this.dict[Gt.maleSinkAera];
        }
        get femaleSinkData() {
            return this.dict[Gt.femaleSinkAera];
        }
        get _saveName() {
            return "SinkData";
        }
        getNewData() {
            return new ci();
        }
        InitData() {
            this._data = this._ReadFromFile(), null != this._data && null != this._data.list || (console.log("第一次进行游戏,初始洗手池数据..."),
                this._data.list = [], this.InitSinkData(), this._SaveToDisk(this._data));
            for (let t of this._data.list) this.dict[t.name] = t;
        }
        InitSinkData() {
            let t = new hi(!0, 0), e = new hi(!1, 1);
            this._data.list.push(t), this._data.list.push(e), this.dict[Gt.maleSinkAera] = t,
                this.dict[Gt.femaleSinkAera] = e, this.InitSlot(!0, t), this.InitSlot(!1, e);
        }
        InitSlot(t, e) {
            let i = 0, s = oi.instance.dataList;
            for (let e = 0; e < s.length; e++) t ? s[e].wash_man_Slot > -1 && i++ : s[e].wash_woman_Slot > -1 && i++;
            if (i > 0) {
                e.slots = new Array(i);
                for (let a = 0; a < i; a++) {
                    let i = new ai();
                    i.id = a, t ? (i.level = s[a].wash_man_Slot_Level, i.uid = s[a].wash_man_Slot, i.name = ge.instance.dataList[i.uid].name,
                        e.slots[a] = i) : (i.level = s[a].wash_woman_Slot_Level, i.uid = s[a].wash_woman_Slot,
                            i.name = ge.instance.dataList[i.uid].name, e.slots[a] = i), i.usable = i.uid == Ft.data.slot_wash_basin_woman_config || i.uid == Ft.data.slot_wash_basin_man_config;
                }
            } else console.warn("洗手池没有可用的SLot，isMale：", t);
        }
        UpdateSlotData(t) {
            let e = t.building.functionID;
            if (e == Nt.FemaleSink || e == Nt.MaleSink) {
                let e = this.dict[t.building.buildingName];
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class mi extends ni {
        constructor(t, e) {
            super(), this.isMale = t, this.index = e, t ? (this.title = "Men's Toilet No." + e, this.name = "maleToilet_" + e,
                this.functionID = Nt.MaleToilet) : (this.title = "Women's Toilet No." + e, this.name = "femaleToilet_" + e,
                    this.functionID = Nt.FemaleToilte), this.slots = [];
            let i = 0, s = oi.instance.dataList;
            if (s && s.length > 0) {
                for (let e = 0; e < s.length; e++) t ? s[e].maleToiletSolt > -1 && i++ : s[e].femaleToiletSolt > -1 && i++;
                if (i > 0) {
                    this.slots = new Array(i);
                    for (let e = 0; e < i; e++) {
                        let i = new ai(), a = s[e];
                        i.id = e, t ? (i.uid = a.maleToiletSolt, i.name = ge.instance.dataList[i.uid].name,
                            i.level = a.male_Slot_Level, i.usable = Ft.data.slot_mt_config == i.uid) : (i.uid = a.femaleToiletSolt,
                                i.name = ge.instance.dataList[i.uid].name, i.level = a.female_Slot_Level, i.usable = Ft.data.slot_mt_config == i.uid),
                            this.slots[e] = i;
                    }
                } else console.warn(this.name, "没有可用的SLot");
            }
        }
    }
    class ui extends rt { }
    class _i extends nt {
        constructor() {
            super(), this._dict = new Map(), $.instance.on3D(L.UpdateBuildingData, this, this.UpdateBuildData),
                $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new _i()), this._instance;
        }
        static get data() {
            return this.instance._data;
        }
        get _saveName() {
            return "TolietData";
        }
        getNewData() {
            return new ui();
        }
        InitData() {
            this._data = this._ReadFromFile(), null != this._data && null != this._data.list || (console.log("第一次进行游戏,初始化厕所数据..."),
                this._data.list = [], this.InitTolietData(), this._SaveToDisk(this._data));
            for (let t of this._data.list) this._dict.set(t.name, t);
        }
        InitTolietData() {
            let t = Ae.instance.dataList[1].minCount, e = Ae.instance.dataList[1].maxCount, i = Ae.instance.dataList[0].minCount, s = Ae.instance.dataList[0].maxCount, a = 2 * t;
            for (let t = 1; t <= a; t++) {
                let e = new mi(!1, t);
                e.active = !0, this._data.list.push(e);
            }
            for (let t = 1; t <= i; t++) {
                let e = new mi(!0, t);
                e.active = !0, this._data.list.push(e);
            }
            let n = 2 * (e - t);
            for (let t = 1; t <= n; t++) {
                let e = new mi(!1, t + a);
                e.active = !1, this._data.list.push(e);
            }
            n = s - i;
            for (let t = 1; t <= n; t++) {
                let e = new mi(!0, t + i);
                e.active = !1, this._data.list.push(e);
            }
        }
        UpdateBuildData(t) {
            if (t.Name == Gt.femaleToilet) {
                let e = 2 * t.Count, i = e - 1, s = t.Name + "_" + i.toString(), a = t.Name + "_" + e.toString(), n = this._dict.get(s), o = this._dict.get(a);
                if (!n) throw new we("获取厕所信息失败:" + s);
                {
                    n.active = !0;
                    let t = {
                        buildingName: n.name,
                        buildingData: n
                    };
                    $.instance.event3D(L.UpdateBuildingOutlookEvent, t);
                }
                if (!o) throw new we("获取厕所信息失败:" + a);
                {
                    o.active = !0;
                    let t = {
                        buildingName: o.name,
                        buildingData: o
                    };
                    $.instance.event3D(L.UpdateBuildingOutlookEvent, t);
                }
            } else if (t.Name == Gt.maleToilet) {
                let e = t.Name + "_" + t.Count.toString(), i = this._dict.get(e);
                if (!i) throw new we("获取厕所信息失败:" + e);
                {
                    i.active = !0;
                    let t = {
                        buildingName: i.name,
                        buildingData: i
                    };
                    $.instance.event3D(L.UpdateBuildingOutlookEvent, t);
                }
            }
            this._SaveToDisk(this._data);
        }
        UpdateSlotData(t) {
            let e = t.building.functionID;
            if (e == Nt.MaleToilet || e == Nt.FemaleToilte) {
                let e = this._dict.get(t.building.buildingName);
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class gi extends rt { }
    class fi extends nt {
        constructor() {
            super(), $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new fi()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "WaitAeraData";
        }
        getNewData() {
            return new gi();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !0, this._data.list.functionID = Nt.WaitAera, this._data.list.index = 0,
                this._data.list.name = Gt.WaitAera, this._data.list.title = "等候区", this.InitSlots(this._data.list),
                this._SaveToDisk(this._data));
        }
        InitSlots(t) {
            let e = 0, i = oi.instance.dataList;
            for (let t = 0; t < i.length; t++) i[t].waitArea_slot > -1 && e++;
            if (e > 0) {
                t.slots = new Array(e);
                for (let s = 0; s < e; s++) {
                    let e = new ai();
                    e.level = i[s].waitArea_slot_level, e.uid = i[s].waitArea_slot, e.name = ge.instance.dataList[e.uid].name,
                        e.id = s, t.slots[s] = e;
                }
            } else console.warn("等候区没有可用的SLot");
        }
        UpdateSlotData(t) {
            if (t.building.functionID == Nt.WaitAera) {
                let e = this._data.list.slots;
                e && e.length > 0 ? (ai.UpdateSlotData(t, e), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class pi {
        constructor() {
            this.isBreaking = !1;
        }
        SetBreakState(t, e) {
            this.slotData.isBreaking = this.isBreaking = t, this.eventID = t ? e : null;
        }
        get runtimeFirstChild() {
            return null == this._tempChild && (this._tempChild = this.sprite.getChildAt(0)),
                this._tempChild;
        }
    }
    class yi extends Ce {
        constructor() {
            super(...arguments), this._facMap = new Map(), this.slotPosList = [], this.developProgress = 0,
                this.income = 0, this.duration = 0, this.wasteWater = 0, this.waterAdd = 0, this.cleanTime = 32,
                this.sweepTime = 32, this._standardCleanTime = 25, this._standardSweepTime = 27,
                this._standardTime = 20;
        }
        get index() {
            return this._index;
        }
        get isMale() {
            return this._isMale;
        }
        get buildingName() {
            return this._name;
        }
        get title() {
            return this._title;
        }
        get _equipmentNode() {
            return null == this._runtimeEquipmentNode && (this._runtimeEquipmentNode = this.sprite3D.getChildByName(Gt.equipment),
                null == this._runtimeEquipmentNode && console.error(this.sprite3D.name + "设备节点获取失败")),
                this._runtimeEquipmentNode;
        }
        InitBuilding(t, e) {
            if (this._isMale = t.isMale, this.active = t.active, this.functionID = t.functionID,
                this._index = t.index, this._name = t.name, this.slots = t.slots, this._title = t.title,
                t.active) if (this.ShowOutlook(t.isMale, t.index, e), t.slots && t.slots.length > 0) for (let i = 0; i < t.slots.length; i++) {
                    let s = t.slots[i];
                    s.isBreaking = !1, this.UpdateFacilityLevel(s.name + "_" + i.toString(), s.level, e, s);
                } else console.warn("设备初始化失败,已关闭所有设备显示,没有插槽数据:", this.sprite3D.name), this._equipmentNode && (this._equipmentNode.active = !1); else this.ShowPlaceholder();
        }
        UpdateFacilityLevel(t, e, i, s) {
            let a = this._equipmentNode.getChildByName(t);
            if (a) {
                a.active = !0;
                let n = a.getChildByName(e.toString());
                if (n) {
                    if (this.ToggleAllChild(a, !1), s.uid == be.instance.data.slot_urinal_config) {
                        let t = Je.instance.GetBuildDataByName(Gt.maleToilet).count + 1, e = a.getChildByName("menban");
                        if (s.id < 2 * t) {
                            if (n.active = !0, e && (e.active = !0), i) {
                                let t = n.id;
                                Le.PlayEffect(Ot.Yan, t, 2e3, n.transform.position);
                            }
                        } else console.log("关闭pee显示");
                    } else if (n.active = !0, i) {
                        let t = n.id;
                        Le.PlayEffect(Ot.Yan, t, 2e3, n.transform.position);
                    }
                    s && this.AddSlotPositon(a, t, s), this.UpdateStatistic();
                } else 0 != e ? console.warn("建筑", this.sprite3D.name, "的", t, "的等级", e, "寻找失败，无法改变设备外观模型,设备显示已经关闭.") : this.ToggleAllChild(a, !1);
            } else console.warn("试图在建筑", this.sprite3D.name, "中获取一个不存在的设备", t, ",请检查建筑设备节点equipmen下是否已正确放置此设备...");
        }
        AddSlotPositon(t, e, i) {
            let s = this._facMap.get(e);
            null == s ? ((s = new pi()).slotData = i, s.sprite = t, s.belonger = this, this._facMap.set(e, s),
                this.slotPosList.push(s)) : console.log(e);
        }
        ShowOutlook(t, e, i = !1) {
            console.error("ShowOutlook方法没有在子类中实现:", this.sprite3D.name);
        }
        PlayBuildEffect() {
            Le.PlayEffect(Ot.Caidai, this.id, 2e3, this.sprite3D.transform.position);
        }
        ShowPlaceholder() {
            let t = this.sprite3D.getChildByName(Gt.placeholder);
            this.ToggleAllChild(this.sprite3D, !1), t ? t.active = !0 : console.warn("节点下没有占位节点：", this.sprite3D.name);
        }
        ClosePlaceholder() {
            let t = this.sprite3D.getChildByName(Gt.placeholder);
            t ? t.active = !1 : console.warn("节点下没有占位节点：", this.sprite3D.name);
        }
        get entrance() {
            return null == this._runtimeEntrance && (this._runtimeEntrance = this.sprite3D.getChildByName(Gt.entrance)),
                this._runtimeEntrance;
        }
        get exit() {
            return null == this._runtimeExit && (this._runtimeExit = this.sprite3D.getChildByName(Gt.exit)),
                this._runtimeExit;
        }
        UpdateStatistic() {
            let t = 0, e = 0, i = 0, s = 0, a = 0, n = 0, o = 0, r = 0;
            for (let l of this.slots) {
                let h = pe.instance.GetSlotConfigByUID(l.uid)[l.level];
                if (e += l.level, t += ge.instance.dataList[l.uid].maxLevel, l.level < 1) continue;
                let c = h.income;
                c && (i += c);
                let d = h.Buff;
                d && (s += d);
                let m = h.updateCostWater;
                m && (a += m);
                let u = h.water_add;
                u && (n += u, this.functionID == Nt.WaterRoom && (si.MaxWater = n));
                let _ = h.repair_time;
                _ && (o += _);
                let g = h.sweep_time;
                g && (r += g);
            }
            this.developProgress = e / t, this.income = 3 * i, this.duration = this._standardTime + s,
                this.wasteWater = a, this.waterAdd = n, si.RefreshWater(), this.cleanTime = this._standardCleanTime + o,
                this.sweepTime = this._standardSweepTime + r;
        }
        CreateIncome(t) {
            let e = pe.instance.GetSlotConfigByUID(t.uid)[t.level].income;
            e ? si.Money += e * si.AdIncomeBuff : console.log(this.buildingName, "获取收入失败！");
        }
        OnClick() { }
        OffClick() { }
    }
    !function (t) {
        class e {
            constructor() {
                this._wps = [], this._openTable = [], this._closeTable = [];
            }
            static get instance() {
                return null == this._instance && (this._instance = new e()), this._instance;
            }
            InitData(t) {
                console.log("导航模块初始化...");
                let e = p.ConfigURL(t), s = a.Get(e, !0);
                if (s) {
                    this._dataList = s, this._nodeDict = new Map();
                    for (const t of this._dataList) this._nodeDict.set(t.key, new i(t));
                    a.Unload(e);
                } else console.warn("导航数据初始化失败", t);
            }
            GetNeighbors(t) {
                let e = new Array(), i = t.data;
                if (i.neighbors && i.neighbors.length > 0) for (const s of i.neighbors) {
                    let i = this._nodeDict.get(s);
                    if (i) {
                        e.indexOf(i) < 0 ? e.push(i) : console.warn(t, "重复获取相邻节点：", s);
                    } else console.warn(t, "获取相邻节点失败：", s);
                }
                return e;
            }
            GetNodeByKey(t) {
                return this._nodeDict.get(t);
            }
            PushInOpen(t) {
                if (null == t) throw new Ie("Grid不能为空");
                this._openTable.indexOf(t) < 0 && (t.isInOpen = !0, this._openTable.push(t));
            }
            PushInClose(t) {
                if (null == t) throw new Ie("node不能为空");
                let e = this._openTable.indexOf(t);
                e > -1 && this._openTable.splice(e, 1), (e = this._closeTable.indexOf(t)) < 0 && (t.isInClose = !0,
                    this._closeTable.push(t));
            }
            SearchPath(t) {
                if (this._openTable.length <= 0) return void console.warn("寻路失败，from:", this._start, ",to:", t);
                this._openTable.sort((t, e) => t.F < e.F ? -1 : t.F == e.F ? 0 : 1);
                let i = this._openTable.shift();
                if (i == t) return void this.BuildPath(t);
                this.PushInClose(i);
                let s = e.instance.GetNeighbors(i);
                if (s && s.length > 0) {
                    this.CheckAndSetCost(i, t, s);
                    for (let t = 0; t < s.length; t++) {
                        let e = s[t];
                        e.isInClose || e.isObstacle || (e.isInOpen || (this.PushInOpen(e), e.SetParent(i)));
                    }
                }
                this.SearchPath(t);
            }
            BuildPath(t) {
                let e = [], i = t;
                for (; i.parent;) e.push(i), i = i.parent;
                if (e.push(i), e.reverse(), this._wps = [], e.length > 0 && e) for (let t = 0; t < e.length; t++) {
                    let i = e[t];
                    i.position;
                    this._wps.push({
                        position: i.position,
                        name: i.data.belonger
                    });
                }
                return this._wps;
            }
            CheckAndSetCost(t, e, i) {
                i && i.length > 0 && i.forEach(i => {
                    i.G = this.Manhattan(i, t), i.H = this.SqrtDistance(i, e);
                });
            }
            Manhattan(t, e) {
                let i = t.position.x - e.position.x, s = t.position.z - e.position.z, a = t.position.y - e.position.y;
                return i * i + s * s + e.G + a * a;
            }
            Greedy(t, e) {
                let i = t.position.x - e.position.x, s = t.position.z - e.position.z, a = t.position.y - e.position.y;
                return (i = Math.abs(i)) + (s = Math.abs(s)) + (a = Math.abs(a));
            }
            SqrtDistance(t, e) {
                let i = t.position.x - e.position.x, s = t.position.z - e.position.z, a = t.position.y - e.position.y;
                return i * i + s * s + a * a;
            }
            Distance(t, e) {
                let i = t.position.x - e.position.x, s = t.position.z - e.position.z, a = t.position.y - e.position.y, n = i * i + s * s + a * a;
                return Math.sqrt(n);
            }
            GetNodeByName(t) {
                if (t) for (let e = 0; e < this._dataList.length; e++) {
                    let i = this._dataList[e];
                    if (i.belonger == t) return this._nodeDict.get(i.key);
                }
                return null;
            }
            GetNearestNode(t) {
                let e = 1 / 0, i = null;
                for (const s of this._nodeDict) {
                    let a = St.SqrDistance(s[1].position, t);
                    a < e && (e = a, i = s[1]);
                }
                return i;
            }
            ResetNode() {
                for (const t of this._nodeDict) t[1].ToDefault();
            }
            get RandomNode() {
                let t = ye.RangeInt(0, this._dataList.length), e = this._dataList[t].key;
                return this._nodeDict.get(e);
            }
            Check(t, e) {
                null == t && console.warn("获取导航起点失败"), null == e && console.warn("获取导航起点失败");
            }
            TrySearchPath(t, e) {
                let i = this.GetNodeByName(e), s = this.GetNodeByKey(t);
                if (i) return this._start = i, this.ResetNode(), this._openTable = [], this._closeTable = [],
                    this.PushInOpen(s), this.SearchPath(i), this._wps;
                this.Check(s, i);
            }
            TrySearchByName(t, e) {
                let i = this.GetNodeByName(t), s = this.GetNodeByName(e);
                if (i && s) return this._start = s, this.ResetNode(), this._openTable = [], this._closeTable = [],
                    this.PushInOpen(i), this.SearchPath(s), this._wps;
                this.Check(i, s);
            }
            TrySearchByPos(t, e) {
                let i = this.GetNearestNode(t), s = this.GetNodeByName(e);
                if (i && s) return this._start = s, this.ResetNode(), this._openTable = [], this._closeTable = [],
                    this.PushInOpen(i), this.SearchPath(s), this._wps;
                this.Check(i, s);
            }
            TrySearchByNearestPos(t, e) {
                let i = this.GetNearestNode(t), s = this.GetNearestNode(e);
                if (i && s) return this._start = s, this.ResetNode(), this._openTable = [], this._closeTable = [],
                    this.PushInOpen(i), this.SearchPath(s), this._wps;
                this.Check(i, s);
            }
        }
        t.NetMap = e;
        t.NodeData = class { };
        class i {
            constructor(t) {
                this.isObstacle = !1, this.G = 0, this.H = 0, this.data = t;
            }
            get position() {
                return this.data.position;
            }
            get F() {
                return this.G + this.H + this.data.extraCost;
            }
            SetParent(t) {
                if (!t) throw new Ie("Node不能为空");
                this.parent = t;
            }
            ToDefault() {
                this.isInOpen = !1, this.isInClose = !1, this.G = 0, this.H = 0, this.parent = null;
            }
        }
        t.Node = i;
    }(ee || (ee = {}));
    class Si {
        static updateRotation(t) {
            return this.angleByPoint({
                x: 0,
                y: 0
            }, {
                x: t.x,
                y: t.z
            });
        }
        static angleByPoint(t, e) {
            return -parseFloat((180 * Math.atan2(t.x - e.x, -(t.y - e.y)) / Math.PI).toFixed(2));
        }
        static deg2rad(t) {
            return t * Math.PI / 180;
        }
        static isZero(t) {
            return 0 == t.x && 0 == t.y && 0 == t.z;
        }
        static SwitchParent(t, e) {
            if (t && e) {
                let i = t.transform.scale.clone(), s = t.transform.position.clone(), a = t.transform.rotationEuler.clone();
                e.addChild(t), t.transform.scale = i, t.transform.position = s, t.transform.rotationEuler = a;
            }
        }
        static SwitchParentLocal(t, e) {
            if (t && e) {
                let i = t.transform.localScale.clone(), s = t.transform.localPosition.clone(), a = t.transform.localRotationEuler.clone();
                e.addChild(t), t.transform.localScale = i, t.transform.localPosition = s, t.transform.localRotationEuler = a;
            }
        }
        static direOneDis(t, e) {
            let i = t.distance(e.x, e.y), s = Si.minus(t, e);
            return Laya.Vector2.scale(s, 1 / i, s), s;
        }
        static UpdateRotation(t) {
            return Si.angleByPoint({
                x: 0,
                y: 0
            }, {
                x: t.x,
                y: t.z
            });
        }
        static updateRotationDelayY(t, e, i) {
            let s = this.angleByPoint(St.zero, {
                x: t.x,
                y: t.z
            });
            return Si.updateRotationByAngle(s, e, i);
        }
        static updateRotationDelayX(t, e, i) {
            let s = this.angleByPoint(St.zero, {
                x: t.z,
                y: t.y
            });
            return Si.updateRotationByAngle(s, e, i);
        }
        static updateRotationDelayZ(t, e, i) {
            let s = this.angleByPoint(St.zero, {
                x: t.y,
                y: t.x
            });
            return Si.updateRotationByAngle(s, e, i);
        }
        static updateRotationByAngle(t, e, i, s = 1) {
            let a = this.getIncludeAngle(t, e), n = 0 == s ? 18 / i : i;
            if (Math.abs(a) <= n) return a;
            let o = i;
            return 0 == s && (this._tempAngle != t && (this._offset = a), o = this._offset * i / 10),
                o *= Laya.timer.scale, a > 0 ? o : a < 0 ? -o : void 0;
        }
        static direOneDisV3(t, e) {
            let i = Laya.Vector3.distance(t, e), s = new Laya.Vector3();
            return Laya.Vector3.subtract(t, e, s), Laya.Vector3.scale(s, 1 / i, s), s;
        }
        static minus(t, e) {
            return new Laya.Vector2(t.x - e.x, t.y - e.y);
        }
        static getIncludeAngle(t, e) {
            -180 == t && (t = 180);
            let i = t - (e %= 360);
            return i > 180 && (i -= 360), i < -180 && (i = 360 + i), i > 180 && console.log("错误"),
                i;
        }
        static Shuffle(t) {
            for (let e = t.length; e; e--) {
                let i = Math.floor(Math.random() * e);
                [t[e - 1], t[i]] = [t[i], t[e - 1]];
            }
            return t;
        }
        static GetDate() {
            var t = new Date();
            return t.getFullYear() + "Y" + (t.getMonth() + 1) + "M" + t.getDate() + "D";
        }
        static TimeToString(t, e = 0) {
            var i = Math.floor(t / 1e3), s = i % 60, a = Math.floor(i / 60) % 60, n = Math.floor(i / 3600) % 24;
            return 0 == e ? Si.formatNumber(n) + ":" + Si.formatNumber(a) + ":" + Si.formatNumber(s) : Si.formatNumber(n) + "h" + Si.formatNumber(a) + "m" + Si.formatNumber(s) + "s";
        }
        static formatNumber(t) {
            var e = t.toString();
            return e[1] ? e : "0" + e;
        }
        static rand(t) {
            return t[Math.floor(Math.random() * t.length)];
        }
        static randByWeight(...t) {
            for (var e = 0, i = 0; i < t.length; i++) e += Number(t[i]);
            var s = Math.random() * e, a = 0;
            for (i = 0; i < t.length; i++) {
                var n = a;
                if (a += Number(t[i]), s >= n && s <= a) return i;
            }
            return 0;
        }
        static hexToRgba01(t) {
            return new Laya.Vector4(parseInt("0x" + t.slice(1, 3)) / 255, parseInt("0x" + t.slice(3, 5)) / 255, parseInt("0x" + t.slice(5, 7)) / 255, 1);
        }
        static rgb01ToHex(t, e, i) {
            return "#" + ((t = Math.min(255, Math.round(255 * t))) << 16 | (e = Math.min(255, Math.round(255 * e))) << 8 | (i = Math.min(255, Math.round(255 * i)))).toString(16);
        }
        static rgb255ToHex(t, e, i) {
            return "#" + (t << 16 | e << 8 | i).toString(16);
        }
        static hexToRgb01(t) {
            return new Laya.Vector3(parseInt("0x" + t.slice(1, 3)) / 255, parseInt("0x" + t.slice(3, 5)) / 255, parseInt("0x" + t.slice(5, 7)) / 255);
        }
        static rgb255Torgb01(t) {
            return t.x /= 255, t.y /= 255, t.z /= 255, t;
        }
        static Angle2(t, e) {
            var i = (t.x * e.x + t.y * e.y + t.z * e.z) / (Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z) * Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z));
            return i < -1 && (i = -1), i > 1 && (i = 1), 180 * Math.acos(i) / Math.PI;
        }
        static Save(t, e) {
            var i = Laya.Browser.document.createElement("a");
            i.download = e, i.style.display = "none";
            var s = new Blob([JSON.stringify(t)]);
            i.href = URL.createObjectURL(s), document.body.appendChild(i), i.click(), document.body.removeChild(i);
        }
        static SaveArray(t, e) {
            var i = Laya.Browser.document.createElement("a");
            i.download = e, i.style.display = "none";
            new ArrayBuffer(4 * t.length);
            var s = new Blob([t]);
            i.href = URL.createObjectURL(s), document.body.appendChild(i), i.click(), document.body.removeChild(i);
        }
        static vibrateShort() {
            window.wx && Laya.timer.callLater(wx, wx.vibrateShort, [null]);
        }
        static vibrateLong() {
            window.wx && Laya.timer.callLater(wx, wx.vibrateLong, [null]);
        }
        static get TodayMS() {
            var t = new Date();
            return t.setHours(0, 0, 0, 0), t.getTime();
        }
        static get CurrentTime() {
            return new Date().getTime();
        }
        static WaitFrame(t) {
            return new Promise(e => {
                Laya.timer.frameOnce(t, null, e);
            });
        }
        static WaitTime(t) {
            return new Promise(e => {
                t <= 0 ? e() : setTimeout(e, t);
            });
        }
        static WaitWithBlock(t) {
            return new Promise(e => {
                var i = () => {
                    Laya.timer.delta, t() && (Laya.timer.clear(null, i), e());
                };
                Laya.timer.frameLoop(1, null, i);
            });
        }
        static WaitTimeWithBlock(t, e) {
            return new Promise(i => {
                var s = 0, a = () => {
                    var n = Math.min(100, Laya.timer.delta);
                    ((s += n) >= t || e()) && (Laya.timer.clear(null, a), i());
                };
                Laya.timer.frameLoop(1, null, a);
            });
        }
        static WaitTimeWithDuartionCall(t, e, i) {
            return new Promise(s => {
                var a = 0, n = 0;
                i();
                var o = () => {
                    var r = Math.min(100, Laya.timer.delta);
                    (a += r, (n += r) >= e) && (n -= e, 0 == i() && (Laya.timer.clear(null, o), s()));
                    t > 0 && a >= t && (Laya.timer.clear(null, o), s());
                };
                Laya.timer.frameLoop(1, null, o);
            });
        }
        static PromiseQueue(t, ...e) {
            var i = Promise.resolve(t);
            return e && e.forEach(t => {
                i = i.then(t);
            }), i;
        }
        static SaveImgToTempPath(t, e = null) {
            return new Promise(i => {
                var s = window.wx;
                if (null != s) {
                    var a = (e = null == e ? t.toBase64("image/png", 1) : e).indexOf("base64,") + 7, n = s.getFileSystemManager(), o = Si.CurrentTime, r = s.env.USER_DATA_PATH + "/pic" + o + ".png";
                    n.writeFile({
                        filePath: r,
                        data: e.slice(a),
                        encoding: "base64",
                        success: t => {
                            i(r);
                        },
                        fail: t => {
                            console.log(t), i(null);
                        }
                    });
                } else i(null);
            });
        }
        static OppoSaveImgToTempPath(t) {
            return new Promise(e => {
                var i = window.wx;
                if (null != i) {
                    var s = i.getFileSystemManager(), a = Si.CurrentTime, n = i.env.USER_DATA_PATH + "/pic" + a + ".png";
                    s.writeFile({
                        filePath: n,
                        data: t,
                        encoding: "binary",
                        success: t => {
                            e(n);
                        },
                        fail: t => {
                            console.log(t), e(null);
                        }
                    });
                } else e(null);
            });
        }
        static DistancePointWithLine(t, e, i) {
            return Math.abs(this.SignDistancePointWithLine(t, e, i));
        }
        static PointToSegmentDist(t, e, i) {
            var s = (i.x - e.x) * (t.x - e.x) + (i.y - e.y) * (t.y - e.y);
            if (s <= 0) return Math.sqrt((t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y));
            var a = (i.x - e.x) * (i.x - e.x) + (i.y - e.y) * (i.y - e.y);
            if (s >= a) return Math.sqrt((t.x - i.x) * (t.x - i.x) + (t.y - i.y) * (t.y - i.y));
            var n = s / a, o = e.x + (i.x - e.x) * n, r = e.y + (i.y - e.y) * n;
            return Math.sqrt((t.x - o) * (t.x - o) + (r - t.y) * (r - t.y));
        }
        static PointToSegmentDist2(t, e, i, s, a, n) {
            var o = (a - i) * (t - i) + (n - s) * (e - s);
            if (o <= 0) return Math.sqrt((t - i) * (t - i) + (e - s) * (e - s));
            var r = (a - i) * (a - i) + (n - s) * (n - s);
            if (o >= r) return Math.sqrt((t - a) * (t - a) + (e - n) * (e - n));
            var l = o / r, h = i + (a - i) * l, c = s + (n - s) * l;
            return Math.sqrt((t - h) * (t - h) + (c - e) * (c - e));
        }
        static SignDistancePointWithLine(t, e, i) {
            var s = new Laya.Vector3();
            Laya.Vector3.subtract(t, e, s);
            var a = new Laya.Vector3(-i.z, 0, i.x);
            return Laya.Vector3.cross(new Laya.Vector3(0, 0, 1), i, a), Laya.Vector3.normalize(a, a),
                Laya.Vector3.dot(s, a);
        }
        static CheckSegmentLineIntersect(t, e, i, s) {
            var a = this.SignDistancePointWithLine(t, i, s), n = this.SignDistancePointWithLine(e, i, s);
            return !(!Laya.MathUtils3D.isZero(a) && !Laya.MathUtils3D.isZero(n)) || Math.sign(a) != Math.sign(n);
        }
        static SegmentLineIntersectPos(t, e, i, s) {
            var a = this.DistancePointWithLine(t, i, s), n = new Laya.Vector3();
            Laya.Vector3.add(t, e, n);
            var o = a / (a + this.DistancePointWithLine(n, i, s)), r = new Laya.Vector3();
            return Laya.Vector3.scale(e, o, r), Laya.Vector3.add(t, r, r), r;
        }
        static LineIntersectPos(t, e, i, s) {
            var a = new Laya.Vector3();
            Laya.Vector3.subtract(i, t, a);
            var n = e.x * s.y - e.y * s.x, o = (a.x * s.y - a.y * s.x) / n;
            return Laya.Vector3.scale(e, o, e), Laya.Vector3.add(t, e, a), a;
        }
        static AngleLerpWithSpeed(t, e, i, s) {
            var a = e - t;
            a < -180 ? a += 360 : a > 180 && (a -= 360);
            var n = i;
            return a < 0 && (n = -i), (t += n * s) > 360 && (t -= 360), t < 0 && (t += 360),
                t;
        }
        static AngleLerp(t, e, i) {
            var s = e - t;
            return s < -180 ? s += 360 : s > 180 && (s -= 360), (t += s * i) > 360 && (t -= 360),
                t < 0 && (t += 360), t;
        }
        static GetAllSKinMeshRender(t, e) {
            if (t instanceof Laya.SkinnedMeshSprite3D) {
                var i = t.skinnedMeshRenderer;
                e.push(i);
            }
            for (let i = 0; i < t.numChildren; i++) {
                var s = t.getChildAt(i);
                this.GetAllSKinMeshRender(s, e);
            }
        }
        static GetAllMeshRenderer(t, e) {
            if (t instanceof Laya.MeshSprite3D) {
                var i = t.meshRenderer;
                e.push(i);
            }
            for (let i = 0; i < t.numChildren; i++) {
                var s = t.getChildAt(i);
                this.GetAllMeshRenderer(s, e);
            }
        }
        static SetAllMeshRendererMat(t, e) {
            t instanceof Laya.MeshSprite3D && (t.meshRenderer.sharedMaterial = e);
            for (let s = 0; s < t.numChildren; s++) {
                var i = t.getChildAt(s);
                this.SetAllMeshRendererMat(i, e);
            }
        }
        static GetChildNode(t, e) {
            if (t.name == e) return t;
            if (!(t.numChildren > 0)) return null;
            for (let s = 0; s < t.numChildren; s++) {
                var i = this.GetChildNode(t.getChildAt(s), e);
                if (null != i) return i;
            }
        }
        static SetPhysicGroup(t, e) {
            var i = t.getComponent(Laya.PhysicsCollider);
            null != i && (i.collisionGroup = e);
            var s = t.getComponent(Laya.Rigidbody3D);
            null != s && (s.collisionGroup = e);
            for (var a = 0; a < t.numChildren; a++) this.SetPhysicGroup(t.getChildAt(a), e);
        }
        static ParseVector3(t) {
            var e = t.split(",");
            return new Laya.Vector3(Number(e[0]), Number(e[1]), Number(e[2]));
        }
    }
    class Ii extends Ce {
        constructor() {
            super(...arguments), this.isPoly = !1, this._toTarget = St.zero, this._wpIndex = 0,
                this.moveSpeed = 1.5, this.isOut = !1, this._isRepairing = !1, this.eventID = Qt.Repair,
                this.repairTime = 40, this.moneySkill = !1, this.moneySeed = 0, this._runtimeMoney = 0,
                this.diamondSkill = !1, this.diamondSeed = 0, this._runtimeDiamonds = 0, this._runtimeAnimatorStateName = null,
                this._step = new St(), this.isDisposed = !1;
        }
        get toolCar() {
            return null == this._toolCar && (this._toolCar = this.sprite3D.getChildByName("Car")),
                this._toolCar;
        }
        get toolMop() {
            return null == this._toolMop && (this._toolMop = this.DeepFind("Mop", this.owner)),
                this._toolMop;
        }
        get _animator() {
            return null == this._runtimeAnimator && (this._runtimeAnimator = this.owner.getComponent(Laya.Animator)),
                this._runtimeAnimator;
        }
        get _agent() {
            return ee.NetMap.instance;
        }
        get hasFacTarget() {
            return null != this.facPos;
        }
        onAwake() {
            $.instance.onUI(Mt.OnClickTip, this, this.OnClickTip), $.instance.onUI(Mt.RepairProgressComplete, this, this.OnRepairComplete),
                this.PlayAnimationByState(ie.Sit);
        }
        SetRepairTime(t) {
            this.repairTime = t;
        }
        PlayAnimationByState(t) {
            try {
                if (this._runtimeAnimatorStateName != t) {
                    let e = t;
                    switch (t) {
                        case ie.CaZhuoZi:
                        case ie.DaSao:
                            e = "clean";
                    }
                    this._animator.play(e), this._runtimeAnimatorStateName = t, this.ShowToolByState(t);
                }
            } catch (e) {
                throw console.error("播放动画失败：", t), e;
            }
        }
        ShowToolByState(t) {
            switch (t) {
                case ie.DaSao:
                    this.toolMop.active = !0, this.toolCar.active = !1;
                    break;

                case ie.Car:
                    this.toolMop.active = !1, this.toolCar.active = !0;
                    break;

                case ie.CaZhuoZi:
                default:
                    this.toolMop.active = !1, this.toolCar.active = !1;
            }
        }
        SetFacTarget(t, e) {
            this.facPos = t, this.isOut ? this.MoveToTarget() : this.MoveToExit(e), this.isOut = !0;
        }
        MoveToExit(t) {
            console.log("移动到出口位置拿工具");
            let e = this._agent.TrySearchByNearestPos(this.transform.position, t);
            this.SetWayPoints(e).OnComplete(this.GetTool, "GetTool"), this.PlayAnimationByState(ie.Walk);
        }
        GetTool() {
            this.PlayAnimationByState(ie.Idle), console.log("维修工变出工具！"), Xe.instance.TryOpenDoor(this.transform.position),
                Laya.timer.once(500, this, this.MoveToTarget);
        }
        MoveToTarget() {
            if (null != this.facPos && null != this.facPos.belonger || console.error(this.facPos),
                this.PlayAnimationByState(ie.Car), this.facPos.belonger.functionID == Nt.FemaleToilte || this.facPos.belonger.functionID == Nt.MaleToilet) {
                let t = this.facPos.belonger.entrance, e = this._agent.TrySearchByNearestPos(this.transform.position, t.transform.position);
                this.SetWayPoints(e).OnComplete(this.WaitOpenDoor, "WaitOpenDoor");
            } else {
                let t = this._agent.TrySearchByNearestPos(this.transform.position, this.facPos.sprite.transform.position);
                this.SetWayPoints(t).OnComplete(this.DoRepair, "DoRepair"), this.PlayAnimationByState(ie.Car);
            }
        }
        WaitOpenDoor() {
            Xe.instance.TryOpenDoor(this.transform.position), Laya.timer.once(600, this, () => {
                if (null == this.facPos) return;
                let t = this._agent.TrySearchByNearestPos(this.transform.position, this.facPos.sprite.transform.position);
                this.SetWayPoints(t).OnComplete(this.DoRepair, "DoRepair"), this.PlayAnimationByState(ie.Car);
            });
        }
        SetWayPoints(t) {
            return t && t.length > 0 ? (this._wayPoints = t, this._target = this._wayPoints[0].position,
                this._wpIndex = 0) : console.log("路径点数据为空或者数量为0"), this;
        }
        onUpdate() {
            this._runtimeMoney > 0 && je.instance.EventDistribute(this.transform.position, this.id, Qt.Money, 0),
                this._runtimeDiamonds > 0 && je.instance.EventDistribute(this.transform.position, this.id, Qt.Diamond, 0),
                this.hasFacTarget && je.instance.EventDistribute(this.facPos.runtimeFirstChild.transform.position, this.facPos.sprite.id, this.facPos.eventID, this.facPos.eventID == Qt.Repair ? this.repairTime : this.sweepTime),
                this._target && (Laya.Vector3.subtract(this._target, this.transform.position, this._toTarget),
                    this._toTarget.SqrMagnitude < .01 ? (this._wpIndex++, this._wpIndex >= this._wayPoints.length ? (this._target = null,
                        this._transitionFunc ? (console.log("执行转换：", this._transition), this.OnReach = this._transitionFunc,
                            this.OnReach(), this.OnReach == this._transitionFunc && (this._transition = null)) : console.error("抵达没有回调,或者切换方法为空:", this._transition)) : this._target = this._wayPoints[this._wpIndex].position) : (Laya.Vector3.normalize(this._toTarget, this._step),
                                Laya.Vector3.scale(this._step, this.moveSpeed * pt.deltaTime, this._step), this.transform.localRotationEulerY = Si.updateRotation(this._step) - 45,
                                Laya.Vector3.add(this.transform.position, this._step, this.transform.position),
                                this.transform.position = this.transform.position));
        }
        OnComplete(t, e) {
            this._transitionFunc = t, this._transition = e;
        }
        DoRepair() {
            if (this.facPos.slotData.uid == Ft.data.slot_mt_config ? this.PlayAnimationByState(ie.DaSao) : this.PlayAnimationByState(ie.CaZhuoZi),
                Le.ClearAll(this.facPos.sprite.id), this.facPos.belonger.functionID == Nt.MaleToilet || this.facPos.belonger.functionID == Nt.FemaleToilte) {
                let t = new Laya.Vector3();
                this.facPos.sprite.transform.getForward(t), Laya.Vector3.scale(t, .5, t), t.y = 0,
                    Laya.Vector3.subtract(this.facPos.sprite.transform.position, t, t), this.transform.position = t;
            }
            je.instance.EventDistribute(this.facPos.sprite.transform.position, this.facPos.sprite.id, Qt.StartRepair, 0),
                this._isRepairing = !0;
        }
        OnRepairComplete(t) {
            if (this.hasFacTarget && this.facPos.sprite.id == t) {
                Laya.timer.clearAll(this), this.moneySkill && (this._runtimeMoney += ye.RangeInt(1, this.moneySeed)),
                    this.diamondSkill && (this._runtimeDiamonds += ye.RangeInt(1, this.diamondSeed)),
                    Xe.instance.TryOpenDoor(this.transform.position), this._isRepairing = !1;
                let t = this.facPos, e = this.facPos.sprite.id, i = Le.PlayEffect(Ot.Cleaning, e, 2e3);
                this.facPos.runtimeFirstChild.addChild(i), i.transform.localPosition = St.zero,
                    t.SetBreakState(!1), this.facPos = null, $.instance.event3D(L.FacilityRepairComplete, [t, this]),
                    this.isDisposed && this.sprite3D.destroy(!0);
            }
        }
        ReturnChairPos(t) {
            if (null == t) throw Error("获取椅子失败，维修工无法返回休息椅子！");
            let e = null;
            this._runtimeChair = t, this.PlayAnimationByState(ie.Car);
            let i = Xe.instance.GetBuildingEntrance(Nt.CleanRoom);
            e = this._agent.TrySearchByNearestPos(this.transform.position, i.transform.position),
                this.SetWayPoints(e).OnComplete(() => {
                    Xe.instance.TryOpenDoor(this.transform.position), Laya.timer.once(600, this, () => {
                        e = this._agent.TrySearchByNearestPos(this.transform.position, t.transform.position),
                            this.SetWayPoints(e).OnComplete(() => {
                                this.isOut = !1, this.PlayAnimationByState(ie.Sit), this.transform.position = this._runtimeChair.transform.position,
                                    this.transform.rotationEuler = this._runtimeChair.transform.rotationEuler;
                            });
                    });
                });
        }
        Init(t) {
            if (this.Name = t.Name, this.moveSpeed = t.MoveSpeed, this.repairTime = 40, this.sweepTime = 25,
                t.Skill && t.Skill.length > 0) for (let e of t.Skill) switch (e.Type) {
                    case 0:
                        this.repairTime = this.repairTime * (1 - e.parameter[0]);
                        break;

                    case 1:
                        this.sweepTime = this.sweepTime * (1 - e.parameter[0]);
                        break;

                    case 2:
                        this.moveSpeed = this.moveSpeed * (1 + e.parameter[0]);
                        break;

                    case 3:
                        this.moneySkill = !0, this.moneySeed = e.parameter[0];
                        break;

                    case 4:
                        this.diamondSkill = !0, this.diamondSeed = e.parameter[0];
                        break;

                    default:
                        console.log("没有技能");
                }
        }
        Disposed() {
            this.hasFacTarget ? this.isDisposed = !0 : this.sprite3D.destroy(!0);
        }
        OnClickTip(t) {
            t == this.id && (this.moneySkill && (console.log("收取小费" + this._runtimeMoney), si.Money += this._runtimeMoney,
                this._runtimeMoney = 0), this.diamondSkill && (console.log("收取钻石" + this._runtimeDiamonds),
                    si.Diamond += this._runtimeDiamonds, this._runtimeDiamonds = 0));
        }
        RepairCompleteNow() {
            Le.ClearAll(this.facPos.sprite.id), je.instance.RecycleBtn(this.facPos.sprite.id, this.facPos.eventID);
        }
    }
    !function (t) {
        t.Walk = "zou", t.CaZhuoZi = "clean", t.DaSao = "clean", t.Sit = "daiji", t.Car = "tuiche",
            t.Idle = "daiji";
    }(ie || (ie = {}));
    class Ci extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Main");
        }
        onConstruct() {
            this.m_btn_statistics = this.getChildAt(0), this.m_setBtn = this.getChildAt(2),
                this.m_staffBtn = this.getChildAt(3), this.m_turntableBtn = this.getChildAt(4),
                this.m_taskBtn = this.getChildAt(5), this.m_LowLeft = this.getChildAt(6), this.m_txt_doubleTime = this.getChildAt(9),
                this.m_btn_video = this.getChildAt(10), this.m_LowRight = this.getChildAt(11), this.m_btn_netRed = this.getChildAt(12),
                this.m_btn_cheers = this.getChildAt(13), this.m_btn_repair = this.getChildAt(14),
                this.m_btn_speedUp = this.getChildAt(15), this.m_btn_record = this.getChildAt(16),
                this.m_ani_netRed = this.getTransitionAt(0), this.m_ani_cheers = this.getTransitionAt(1),
                this.m_ani_repair = this.getTransitionAt(2), this.m_ani_speedUp = this.getTransitionAt(3);
        }
    }
    Ci.URL = "ui://8nmf3q47aucl1";
    class wi {
        static NextFrame() {
            return this.Frames(2);
        }
        static Frames(t) {
            return new Promise(function (e) {
                Laya.timer.frameOnce(t, null, () => {
                    e();
                });
            });
        }
        static Seconds(t) {
            return new Promise(function (e) {
                Laya.timer.once(1e3 * t, null, () => {
                    e();
                });
            });
        }
    }
    class bi {
        static ToHex(t) {
            return t.toString(16);
        }
        static RandomFromArrayExcept(t, e) {
            let i = [];
            for (let s = 0; s < t.length; ++s) e != t[s] && i.push(t[s]);
            return this.RandomFromArray(i);
        }
        static RandomFromArray(t) {
            return t[bi.RandomInt(0, t.length)];
        }
        static RandomArrayFromArray(t, e) {
            let i = [], s = [];
            for (let e = 0; e < t.length; ++e) s.push(e);
            for (let a = 0; a < e; ++a) {
                let e = bi.RandomInt(0, s.length), a = s[e];
                y.RemoveAt(s, e), i.push(t[a]);
            }
            return i;
        }
        static RandomFromWithWeight(t, e) {
            if (null == t || 0 == t.length) return null;
            var i = 0;
            for (var s of e) i += s;
            for (var a = bi.Random(0, i), n = 0, o = 0; o < t.length; ++o) if (a < (n += e[o])) return t[o];
            return t[t.length - 1];
        }
        static RandomInt(t, e) {
            return Math.floor(this.Random(t, e));
        }
        static Random(t, e) {
            return (e - t) * Math.random() + t;
        }
        static RandomRatio(t) {
            return t > .01 * bi.RandomInt(0, 1e4);
        }
        static Clamp(t, e, i) {
            return t < e ? e : t > i ? i : t;
        }
        static Clamp01(t) {
            return this.Clamp(t, 0, 1);
        }
        static Sign(t) {
            return 0 == t ? 1 : t > 0 ? 1 : -1;
        }
        static GetNumCount(t) {
            for (var e = 0, i = t; i / 10 > 0;) i = Math.floor(i / 10), e++;
            return e;
        }
        static Lerp(t, e, i) {
            return t + (e - t) * bi.Clamp01(i);
        }
        static MoveTowardsAngle(t, e, i) {
            var s = bi.DeltaAngle(t, e);
            return 0 - i < s && s < i ? e : (e = t + s, bi.MoveTowards(t, e, i));
        }
        static MoveTowards(t, e, i) {
            return Math.abs(e - t) <= i ? e : t + Math.sign(e - t) * i;
        }
        static DeltaAngle(t, e) {
            var i = bi.Repeat(e - t, 360);
            return i > 180 && (i -= 360), i;
        }
        static Repeat(t, e) {
            return bi.Clamp(t - Math.floor(t / e) * e, 0, e);
        }
        static IsSimilar(t, e) {
            return t == e;
        }
    }
    bi.Deg2Rad = .0175, bi.Rad2Deg = 57.2958;
    class Li extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return fairygui.UIPackage.createObject("EffectLayer", "FlyPanel");
        }
        onConstruct() {
            this.m_test = this.getChildAt(0), this.m_pos = this.getChildAt(1);
        }
    }
    Li.URL = "ui://c2q7aw0bhluzc";
    class xi extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return fairygui.UIPackage.createObject("EffectLayer", "view_fly_diamond");
        }
        onConstruct() {
            this.m_icon = this.getChildAt(0);
        }
    }
    xi.URL = "ui://c2q7aw0bhluze";
    class vi extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return fairygui.UIPackage.createObject("EffectLayer", "view_fly_Money");
        }
        onConstruct() {
            this.m_icon = this.getChildAt(0);
        }
    }
    vi.URL = "ui://c2q7aw0bhluzf";
    class Ai extends Ue {
        constructor() {
            super(), this._layer = qt.Tip;
        }
        static get instance() {
            return null == this._instance && (this._instance = new Ai(), this._instance._classDefine = Li),
                this._instance;
        }
        FlyCoins(t, e, i = 100, s = 1, a = 10) {
            let n = t.localToGlobal(), o = e.localToGlobal(), r = .6 * s * 1e3, l = .4 * s * 1e3;
            for (let t = 0; t < i; ++t) {
                let t = vi.createInstance();
                this.ui.addChild(t), t.setXY(n.x, n.y);
                let e = new Laya.Vector2(n.x + bi.Random(-a, a), n.y + bi.Random(-a, a));
                r = ye.Range(.85 * r, r), Laya.Tween.to(t, {
                    x: e.x,
                    y: e.y
                }, r, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(t, {
                        x: o.x,
                        y: o.y
                    }, l, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
                        t.dispose();
                    }));
                }));
            }
            wi.Seconds(s);
        }
        FlyDiamonds(t, e, i = 100, s = 1, a = 10) {
            let n = t.localToGlobal(), o = e.localToGlobal(), r = .6 * s * 1e3, l = .4 * s * 1e3;
            for (let t = 0; t < i; ++t) {
                let t = xi.createInstance();
                this.ui.addChild(t), t.setXY(n.x, n.y);
                let e = new Laya.Vector2(n.x + bi.Random(-a, a), n.y + bi.Random(-a, a));
                r = ye.Range(.85 * r, r), Laya.Tween.to(t, {
                    x: e.x,
                    y: e.y
                }, r, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(t, {
                        x: o.x,
                        y: o.y
                    }, l, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
                        t.dispose();
                    }));
                }));
            }
            wi.Seconds(s);
        }
    }
    class Pi {
        static FlyCoinsTo(t, e, i = 20, s = 1.5, a = 120) {
            Ai.instance.FlyCoins(t, e, i, s, a);
        }
        static FlyDiamondTo(t, e, i = 20, s = 1.5, a = 100) {
            Ai.instance.FlyDiamonds(t, e, i, s, a);
        }
    }
    class Di extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("TopInfoUI", "PGameTopUI");
        }
        onConstruct() {
            this.m_text_money = this.getChildAt(1), this.m_text_water = this.getChildAt(3),
                this.m_text_diamond = this.getChildAt(5), this.m_bg_star = this.getChildAt(7), this.m_img_star = this.getChildAt(8),
                this.m_starProgress = this.getChildAt(9);
        }
    }
    Di.URL = "ui://z16gwam3hd3v0";
    class ki extends Ue {
        constructor() {
            super(), this._layer = qt.Main;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ki(), this.m_instance._classDefine = Di),
                this.m_instance;
        }
        UpdateMoneyNum(t) {
            this.isShow && (this.ui.m_text_money.text = qe.DoConverter(Math.floor(t)) + " ");
        }
        UpdateDiamondNum(t) {
            this.isShow && (this.ui.m_text_diamond.text = qe.DoConverter(Math.floor(t)) + " ");
        }
        UpdateWaterState() {
            this.isShow && (this.ui.m_text_water.text = this._data.water + "/" + this._data.MaxWater + " ");
        }
        _OnShow() {
            super.Show();
            window["TopPanel"] = this.ui;
            $.instance.onUI(Mt.UpdateDiamondNum, this, this.UpdateDiamondNum),
                $.instance.onUI(Mt.UpdateMoneyNum, this, this.UpdateMoneyNum), $.instance.onUI(Mt.UpdateWaterState, this, this.UpdateWaterState),
                $.instance.on3D(L.SceneLoadComplete, this, this.UpdateMoneyDiamondShow), this._data = si.instance.Data;
        }
        UpdateMoneyDiamondShow() {
            this.ui.m_text_money.text = qe.DoConverter(this._data.money), this.ui.m_text_diamond.text = qe.DoConverter(this._data.diamond);
        }
        Expend(t, e) {
            if (e < 0) return !1;
            switch (t) {
                case se.Money:
                    if (!(si.Money >= e)) return !1;
                    si.Money = si.Money - e;
                    break;

                case se.Diamond:
                    if (!(si.Diamond >= e)) return !1;
                    si.Diamond -= e;
                    break;

                case se.Water:
                    if (!(si.Water >= e)) return !1;
                    break;

                default:
                    return !1;
            }
            return !0;
        }
    }
    !function (t) {
        t.Money = "Money", t.Diamond = "Diamond", t.Water = "Water";
    }(se || (se = {}));
    class Ui {
        constructor() {
            $.instance.on3D(L.OnClickBuilding, this, this.OnClickBuilding);
        }
        static get instance() {
            return null == this._instance && (this._instance = new Ui()), this._instance;
        }
        Init() {
            console.log("UI中介初始化...");
        }
        get building() {
            return this._runtimecurrbuilding;
        }
        set _currentSelecedBuilding(t) {
            this._runtimecurrbuilding = t;
        }
        get _currentSelectedBuilding() {
            return this._runtimecurrbuilding;
        }
        OnClickBuilding(t) {
            let e = Xe.instance.GetBuildingByName(t);
            this._runtimecurrbuilding = e,
                this._currentSelecedBuilding ? console.log("已经选择了建筑，避免重复显示UI")
                    : this._currentSelecedBuilding != e ? e ? e.active ? (console.log("显示建筑对应的升级UI", e.buildingName),
                        Ve.instance.setUIState([{
                            typeIndex: Zt.Staff,
                            state: !0
                        }], !1)

                    ) : Ve.instance.setUIState([{
                        typeIndex: Zt.Manager,
                        state: !0
                    }], !1) : console.error("获取建筑脚本失败", t) : console.log("选择了同一个建筑，避免重复显示UI");
        }
        ResetCurrSelectedBuilding() {
            this._currentSelecedBuilding = null;
        }
        ShowCleanRoom() {
            let t = Xe.instance.GetBuildingListByFunctionID(Nt.CleanRoom)[0];
            this.OnClickBuilding(t.buildingName);
            $.instance.eventUI(Mt.ShowCleanRoomStaff);
        }
        ShowRoom(t) {
            let e = Xe.instance.GetBuildingListByFunctionID(t)[0];
            this.OnClickBuilding(e.buildingName);
        }
        static PlayMoneyEffect(t) {
            let e = ki.instance.ui.m_text_money;
            Pi.FlyCoinsTo(t, e);
        }
        static PlayDiamondEffect(t) {
            let e = ki.instance.ui.m_text_diamond;
            Pi.FlyDiamondTo(t, e);
        }
        static ShowPanel(t) {
            Ve.instance.setUIState([{
                typeIndex: t,
                state: !0
            }], !1);
        }
        static ClosePanel(t) {
            Ve.instance.setUIState([{
                typeIndex: t,
                state: !1
            }], !1);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/GusetPrefabConfig.json";
    }(ae || (ae = {}));
    class Ti extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Ti()), this._instance;
        }
        initData() {
            this.m_dataList = ae.dataList;
        }
    }
    class Ri {
        static get instance() {
            return null == this._instance && (this._instance = new Ri()), this._instance;
        }
        static get prefabs() {
            return this.instance._prefabs;
        }
        SetPrefabs(t) {
            this._prefabs = t;
        }
    }
    class Oi extends Qe {
        CheckProgress(t) {
            if (t.evt == Xt.UpdateFlow) return this.Init(), this.progress;
        }
        Init() {
            let t = fi.instance.data;
            this.record = t.list.slots[0].level, this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(24, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Ei extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateFemaleSink && this.Init(), this.progress;
        }
        Init() {
            let t = di.instance.femaleSinkData.slots;
            this.record = 0;
            for (let e of t) e.uid == be.instance.data.slot_wash_basin_woman_config && e.level > 0 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(19, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Mi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateMt && this.Init(), this.progress;
        }
        Init() {
            let t = _i.data.list;
            this.record = 0;
            for (let e of t) for (let t of e.slots) t.uid == be.instance.data.slot_mt_config && t.level >= 3 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(0, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Bi extends rt { }
    class Gi extends nt {
        constructor() {
            super(), $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new Gi()), this._instance;
        }
        get data() {
            return this._data;
        }
        static get data() {
            return this.instance._data;
        }
        get _saveName() {
            return "WaterRoomData";
        }
        getNewData() {
            return new Bi();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !0, this._data.list.functionID = Nt.WaterRoom, this._data.list.index = 0,
                this._data.list.title = "水循环处理室", this._data.list.name = Gt.waterRoom, this.InitSlot(this._data.list),
                this._SaveToDisk(this._data));
        }
        InitSlot(t) {
            let e = 0, i = oi.instance.dataList;
            for (let t = 0; t < i.length; t++) i[t].sewage_Slot_Level > -1 && e++;
            if (e > 0) {
                t.slots = new Array(e);
                for (let s = 0; s < e; s++) {
                    let e = new ai();
                    e.level = i[s].sewage_Slot_Level, e.uid = i[s].sewage_Slot, e.name = ge.instance.dataList[e.uid].name,
                        e.id = s, t.slots[s] = e;
                }
            } else console.warn("水循环处理室没有可用的Slot");
        }
        UpdateSlotData(t) {
            if (t.building.functionID == Nt.WaterRoom) {
                let e = this._data.list;
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class Ni extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateSewage && this.Init(), this.progress;
        }
        Init() {
            let t = Gi.instance.data.list.slots[0];
            this.record = t.level, this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(20, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Fi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateMaleSink && this.Init(), this.progress;
        }
        Init() {
            let t = di.instance.maleSinkData.slots;
            this.record = 0;
            for (let e of t) e.uid == be.instance.data.slot_wash_basin_man_config && e.level > 0 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(18, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Vi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.BuildMaleToilet && this.Init(), this.progress;
        }
        Init() {
            let t = Je.instance.GetBuildDataByName(Gt.maleToilet);
            this.record = t.count, this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(28, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Wi extends rt { }
    class ji extends nt {
        constructor() {
            super(), $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new ji()), this._instance;
        }
        get data() {
            return this._data;
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !0, this._data.list.functionID = Nt.MalePee, this._data.list.index = 0,
                this._data.list.title = "小便区（男）", this._data.list.name = Gt.PeeArea, this.InitSlots(this._data.list),
                this._SaveToDisk(this._data));
        }
        get _saveName() {
            return "PeeAreaData";
        }
        getNewData() {
            return new Wi();
        }
        InitSlots(t) {
            let e = oi.instance.dataList, i = 0;
            for (let t = 0; t < e.length; t++) e[t].pee_slot > -1 && i++;
            if (i > 0) {
                t.slots = new Array(i);
                for (let s = 0; s < i; s++) {
                    let i = new ai(), a = e[s];
                    i.id = s, i.uid = a.pee_slot, i.name = ge.instance.dataList[i.uid].name, i.level = a.pee_Slot_Level,
                        i.usable = !0, t.slots[s] = i;
                }
            } else console.warn("没有可用的SLot");
        }
        UpdateSlotData(t) {
            if (t.building.functionID == Nt.MalePee) {
                let e = this.data.list;
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class Hi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateUrinal && this.Init(), this.progress;
        }
        Init() {
            let t = ji.instance.data.list.slots;
            this.record = 0;
            for (let e of t) e.uid == be.instance.data.slot_urinal_config && e.level > 0 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(38, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class zi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.BuildFemaleToilet && this.Init(), this.progress;
        }
        Init() {
            let t = Je.instance.GetBuildDataByName(Gt.femaleToilet);
            this.record = 2 * t.count, this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(34, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class qi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdatePaper && this.Init(), this.progress;
        }
        Init() {
            let t = _i.data.list;
            this.record = 0;
            for (let e of t) for (let t of e.slots) t.uid == be.instance.data.slot_paper_config && t.level >= 3 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(0, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Qi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateTrash && this.Init(), this.progress;
        }
        Init() {
            let t = _i.data.list;
            this.record++;
            for (let e of t) for (let t of e.slots) t.uid == be.instance.data.slot_mt_config && t.level >= 4 && this.record++;
            this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(0, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Ki extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.Guest && (this.record++, this.progress = this.record / this.condition * 100),
                this.progress;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(24, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Yi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.UpdateSewage && this.Init(), this.progress;
        }
        Init() {
            let t = Gi.instance.data.list.slots[0];
            this.record = t.level, this.progress = this.record / this.condition * 100;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(20, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Zi extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.Money && (this.record += t.data, this.progress = this.record / this.condition * 100),
                this.progress;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(24, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Ji extends Qe {
        CheckProgress(t) {
            return t.evt == Xt.Money && (this.record += t.data, this.progress = this.record / this.condition * 100),
                this.progress;
        }
        Go() {
            let t = He.instance.FocusPositionByIndex(24, !1), e = new Laya.Vector3(-t.x, t.y, t.z);
            Le.PlayEffect(Ot.ZS, 1111, 1e4, e);
        }
    }
    class Xi {
        constructor() {
            $.instance.on(Mt.TaskEvent, this, this.Check);
        }
        get hasTask() {
            return null != this.currentTask;
        }
        static get instance() {
            return null == Xi._instance && (Xi._instance = new Xi()), Xi._instance;
        }
        InitTask() {
            let t = si.instance.Data.task;
            if (null == t) {
                if (si.data.allTaskComplete) return this.currentTask = null, void console.log("当前没有任务！");
                (t = si.data.task = this.GetNewTask(0)).Init();
            }
            let e = this.GetNewTask(t.index);
            e && (this.currentTask = e, e.condition = t.condition, isNaN(t.progress) && (t.progress = 0),
                null == t.progress && (t.progress = 0), e.progress = t.progress, isNaN(t.record) && (t.record = 0),
                null == t.record && (t.record = 0), e.record = t.record, si.instance.Data.task = e,
                $.instance.eventUI(Mt.UpdateTaskProgress));
        }
        Check(t) {
            null != this.currentTask && (this.currentTask.CheckProgress(t), $.instance.eventUI(Mt.UpdateTaskProgress));
        }
        DoNext() {
            Ge.trackEvent(Kt.Task, {
                Index: this.currentTask.index.toString()
            }), this.currentTask = this.GetNewTask(this.currentTask.NextTask), si.instance.Data.task = this.currentTask,
                this.currentTask && this.currentTask.Init(), null == this.currentTask && (si.data.allTaskComplete = !0),
                $.instance.eventUI(Mt.UpdateTaskProgress);
        }
        GetNewTask(t) {
            switch (t) {
                case 0:
                    return new Oi(0);

                case 1:
                    return new Ei(1);

                case 2:
                    return new Mi(2);

                case 3:
                    return new Ni(3);

                case 4:
                    return new Fi(4);

                case 5:
                    return new Vi(5);

                case 6:
                    return new Hi(6);

                case 7:
                    return new zi(7);

                case 8:
                    return new qi(8);

                case 9:
                    return new Qi(9);

                case 10:
                    return new Ki(10);

                case 11:
                    return new Yi(11);

                case 12:
                    return new Zi(12);

                case 13:
                    return new Ji(13);
            }
        }
    }
    class $i extends Ce {
        constructor() {
            super(...arguments), this.isPoly = !1, this.moveSpeed = 4, this._wpIndex = 0, this._currFuncIndex = 0,
                this.isIntoToilet = !1, this._toTarget = new St(), this._step = new St(), this._t = 0,
                this._walkTime = 0, this._origin = new Laya.Vector3(), this._runtimeNextPos = new Laya.Vector3(),
                this.isInqueue = !1;
        }
        get isMale() {
            return 1 == this.gender;
        }
        get _currFun() {
            if (this._currFuncIndex >= this._data.Functions.length) throw console.error("功能模块索引越界", this._currFuncIndex, this._data.Functions.length),
                "功能模块索引越界";
            return this._data.Functions[this._currFuncIndex];
        }
        get _agent() {
            return ee.NetMap.instance;
        }
        get animator() {
            return null == this._runtimeAnimator && (this._runtimeAnimator = this.sprite3D.getComponent(Laya.Animator)),
                this._runtimeAnimator;
        }
        OnComplete(t, e) {
            this._transitionFunc = t, this._transition = e;
        }
        ReInit(t, e) {
            Laya.timer.clearAll(this), this.sprite3D.active = !0, this.animator.enabled = !0,
                this._wpIndex = 0, this._data = t, this.gender = t.Gender[0], this.moveSpeed = ye.Range(1.68, 4),
                this._currFuncIndex = 0, this._rumtimeAttachment = e || null, Laya.timer.once(1e3, this, () => {
                    this.GetEndPoint();
                });
        }
        onStart() {
            $.instance.on3D(L.DoNext, this, this.OnDoHandleFuncComplete);
        }
        PlayMoveAnimation() {
            this.PlayAnimationByState(ne.Walk);
        }
        PlayAnimationByState(t) {
            if (t) {
                if (t != this._currAniState) {
                    let e = t;
                    switch (t) {
                        case ne.Idle:
                            e = "daiji";
                            break;

                        case ne.Walk:
                            e = "zou";
                            break;

                        case ne.WashHand:
                            break;

                        default:
                            return void (e = "daiji");
                    }
                    this.animator.play(e), this._currAniState = t;
                }
            } else console.error("参数为空，动画转换失败");
        }
        StepMove() {
            Laya.Vector3.subtract(this._target, this.transform.position, this._toTarget), this._toTarget.SqrMagnitude < .01 ? (this._wpIndex++,
                this._wpIndex >= this._wayPoints.length ? this.OnCompleteWPMove() : (this._target = this._wayPoints[this._wpIndex].position,
                    this._target.y = .1)) : (Laya.Vector3.normalize(this._toTarget, this._step), Laya.Vector3.scale(this._step, this.moveSpeed * pt.deltaTime, this._step),
                        Laya.Vector3.add(this.transform.position, this._step, this.transform.position),
                        this.transform.position = this.transform.position, this.transform.localRotationEulerY = Si.updateRotation(this._step));
        }
        LerpMove() {
            if (this._t > this._walkTime) this._wpIndex++, this._wpIndex >= this._wayPoints.length ? this.OnCompleteWPMove() : (this._target = this._wayPoints[this._wpIndex].position,
                this._target.y = .1, this.UpdateRotation()); else {
                this._t += pt.deltaTime;
                let t = this._t / this._walkTime;
                Laya.Vector3.lerp(this._origin, this._target, t, this.transform.position), this.transform.position = this.transform.position;
            }
        }
        UpdateRotation() {
            Laya.Vector3.subtract(this._target, this.transform.position, this._toTarget);
            let t = Laya.Vector3.scalarLength(this._toTarget);
            this._walkTime = t / this.moveSpeed, this._t = 0, this._origin = this.transform.position.clone(),
                t > .5 && (this.transform.localRotationEulerY = Si.updateRotation(this._toTarget));
        }
        OnCompleteWPMove() {
            this._target = null, this._transitionFunc ? (this.OnReach = this._transitionFunc,
                this.OnReach(), this.OnReach == this._transitionFunc && (this._transition = null)) : console.error("抵达没有回调,或者切换方法为空:", this._transition);
        }
        onUpdate() {
            this._target && this.LerpMove();
        }
        onLateUpdate() {
            this.DispatchEvent();
        }
        DispatchEvent(t) {
            this.isIntoToilet && (t = null == t ? this._runtimeFuncPosInfo.fac.belonger.duration * si.toiletSpeed : t,
                t *= .7, je.instance.EventDistribute(this.transform.position, this.sprite3D.id, this.eventID, t));
        }
        SetWayPoints(t) {
            return t && t.length > 0 ? (this._wayPoints = t, this._target = this._wayPoints[0].position,
                this._wpIndex = 0, this.UpdateRotation(), this.PlayMoveAnimation()) : console.error("路径点数量为0"),
                this;
        }
        GetEndPoint() {
            let t = this._currFun, e = Xe.instance.GetEndPoint(t.FunctionId);
            if (e) {
                let t = this._agent.TrySearchByNearestPos(this.transform.position, e.transform.position);
                this.SetWayPoints(t).OnComplete(this.TrtEnqueue, "尝试入队");
            } else this.ExitScene();
        }
        TrtEnqueue() {
            this._runtimeNextPos.toDefault();
            let t = Xe.instance.TrtEnqueue(this._currFun.FunctionId, this, this._runtimeNextPos), e = this._agent.TrySearchByNearestPos(this.transform.position, this._runtimeNextPos);
            t ? (this.isInqueue = !0, this.SetWayPoints(e).OnComplete(this.MoveInQueue, "进入队伍")) : (this.PlayAngryEmoji(),
                Laya.timer.once(1e3, this, () => {
                    this.SetWayPoints(e).OnComplete(this.ExitScene, "ExitScene");
                }));
        }
        MoveInQueue() {
            if (!this.isInqueue) return;
            let t = Xe.instance.GetNextPointInQueue(this._currFun.FunctionId, this);
            if (t) this.SetWayPoints([{
                position: t
            }]).OnComplete(this.MoveInQueue, "前进一格"); else {
                Xe.instance.ExistInQueue(this._currFun.FunctionId, this) ? (this.PlayAnimationByState(ne.Idle),
                    this.PlayWaitEmoji(), Laya.timer.once(1e3, this, this.MoveInQueue)) : (this.PlayAnimationByState(ne.Idle),
                        this.PlayAngryEmoji(), Laya.timer.once(1e3, this, this.ExitScene));
            }
        }
        MoveToEntrancePos(t) {
            Laya.timer.clearAll(this), this.isInqueue = !1, this._runtimeFuncPosInfo = t;
            let e = this._agent.TrySearchByNearestPos(this.transform.position, t.entrance);
            this.SetWayPoints(e).OnComplete(this.KnockTheDoor, "敲门");
        }
        KnockTheDoor() {
            switch (this._runtimeFuncPosInfo.fac.slotData.uid) {
                case be.Data.slot_wash_basin_woman_config:
                case be.Data.slot_wash_basin_man_config:
                case be.Data.slot_urinal_config:
                    this.MoveToFuncPos();
                    break;

                default:
                    Xe.instance.RequestOpenTheDoor(this) ? this.WaitOpenDoor(!0, 600) : this.WaitOpenDoor(!1);
            }
        }
        WaitOpenDoor(t, e = 1e3) {
            t ? (this.PlayAnimationByState(ne.Idle), Laya.timer.once(e, this, this.MoveToFuncPos)) : this.MoveToFuncPos();
        }
        MoveToFuncPos() {
            let t = this._agent.TrySearchByNearestPos(this.transform.position, this._runtimeFuncPosInfo.funcPos);
            t.push({
                position: this._runtimeFuncPosInfo.funcPos
            }), this.SetWayPoints(t).OnComplete(this.HandleFunction, "执行功能");
        }
        HandleFunction() {
            this.PlayAnimationByState(ne.Idle), this.isIntoToilet = !0;
            let t = this._currFun.FunctionId, e = this._runtimeFuncPosInfo.slot;
            switch (this.transform.rotation = this._runtimeFuncPosInfo.fac.sprite.transform.rotation,
            this.transform.position = this._runtimeFuncPosInfo.fac.sprite.transform.position,
            t) {
                case Nt.MaleToilet:
                case Nt.FemaleToilte:
                    if (this.eventID = Qt.Toilet, e.level <= 5) this.PlayAnimationByState(ne.Verb); else {
                        this.PlayAnimationByState(ne.Sit);
                        let t = new Laya.Vector3();
                        this._runtimeFuncPosInfo.fac.sprite.transform.getForward(t), Laya.Vector3.scale(t, .35, t),
                            t.y = -.3, Laya.Vector3.subtract(this.transform.position, t, this.transform.position),
                            this.transform.position = this.transform.position;
                    }
                    break;

                case Nt.MalePee:
                    let i = Le.PlayEffect(Ot.Pee, this.sprite3D.id);
                    this.owner.addChild(i), i.transform.rotationEuler = this.transform.rotationEuler,
                        i.transform.localPosition = new Laya.Vector3(0, -.5, 0), this.eventID = Qt.Normal,
                        this.PlayAnimationByState(ne.Pee);
                    break;

                case Nt.MaleSink:
                case Nt.FemaleSink:
                    this.eventID = Qt.Normal, this.PlayAnimationByState(ne.WashHand);
                    break;

                case Nt.Canteen:
                case Nt.Library:
                default:
                    this.eventID = Qt.Normal, console.error("此功能还没有匹配动作", t);
            }
        }
        OnDoHandleFuncComplete(t, e = !1) {
            if (this.sprite3D.id == t) {
                e && We.instance.ShowTalkPanel(this.isMale ? 1 : 0), Le.ClearAll(this.sprite3D.id),
                    this._runtimeFuncPosInfo.fac.belonger.CreateIncome(this._runtimeFuncPosInfo.slot);
                let t = Le.PlayEffect(Ot.Money, this.id, 3e3);
                this._runtimeFuncPosInfo.fac.sprite.addChild(t), t.transform.localPosition = St.zero,
                    t.transform.rotationEuler = this._runtimeFuncPosInfo.fac.sprite.transform.rotationEuler,
                    Laya.timer.once(1500, this, this.PlayHappyEmoji), this.isIntoToilet = !1, this.ExitBuilding(),
                    this.DispatchTaskEvent();
            }
        }
        ExitBuilding() {
            switch (this._runtimeFuncPosInfo.fac.slotData.uid) {
                case be.Data.slot_wash_basin_woman_config:
                case be.Data.slot_wash_basin_man_config:
                case be.Data.slot_urinal_config:
                    this.OnExitBuilind();
                    break;

                default:
                    Xe.instance.RequestOpenTheDoor(this) ? Laya.timer.once(600, this, this.OnExitBuilind) : this.OnExitBuilind();
            }
        }
        OnExitBuilind() {
            Xe.instance.ResetFac(this);
            let t = this._agent.TrySearchByNearestPos(this.transform.position, this._runtimeFuncPosInfo.exit);
            this.SetWayPoints(t).OnComplete(this.DoNext, "开启下一轮");
        }
        DoNext() {
            this._runtimeFuncPosInfo = null, this._currFuncIndex++, this._currFuncIndex < this._data.Functions.length ? this.GetEndPoint() : this.ExitScene();
        }
        ExitScene() {
            let t = Ri.prefabs[Rt.prefab5.Exit], e = t[ye.RangeInt(0, t.length)].transform.position, i = this._agent.TrySearchByNearestPos(this.transform.position, e);
            i && i.length > 0 ? this.SetWayPoints(i).OnComplete(this.SetActiveFalse, "退出场景") : console.error("退出场景失败！");
        }
        SetActiveFalse() {
            this.sprite3D.active = !1, this.animator.enabled = !1, this._currAniState = null;
        }
        PlayWaitEmoji() {
            if (ye.random > .1) return;
            let t = null, e = ye.random;
            t = e < .25 ? Le.PlayEffect(Ot.Emoji_sick, this.id, 3e3, this.sprite3D.transform.position) : e < .5 ? Le.PlayEffect(Ot.Emoji_poop, this.id, 3e3, this.sprite3D.transform.position) : e < .75 ? Le.PlayEffect(Ot.Emoji_dead, this.id, 3e3, this.sprite3D.transform.position) : Le.PlayEffect(Ot.Emoji_cry, this.id, 3e3, this.sprite3D.transform.position),
                this.sprite3D.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 2, 0);
        }
        PlayHappyEmoji() {
            if (ye.random > .1) return;
            let t = null;
            t = ye.random > .5 ? Le.PlayEffect(Ot.Emoji_happy, this.id, 1e3, this.sprite3D.transform.position) : Le.PlayEffect(Ot.Emoji_cute, this.id, 1e3, this.sprite3D.transform.position),
                this.sprite3D.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 2, 0);
        }
        PlayAngryEmoji() {
            if (ye.random > .1) return;
            Le.ClearAll(this.id);
            let t = Le.PlayEffect(Ot.Emoji_angry, this.id, 1e3, this.sprite3D.transform.position);
            this.sprite3D.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 2, 0);
        }
        DispatchTaskEvent() {
            if (Xi.instance.hasTask) {
                let t = new Ke();
                t.evt = Xt.Guest, $.instance.eventUI(Mt.TaskEvent, t);
            }
        }
    }
    !function (t) {
        t.Idle = "Idle", t.Clean = "Clean", t.Sweep = "Sweep", t.Running = "Running", t.Walk = "Walk",
            t.Verb = "Verb", t.Sit = "Sit", t.WashHand = "xishou", t.Pee = "Pee";
    }(ne || (ne = {}));
    class ts extends $i {
        constructor() {
            super(...arguments), this._inGuide = !1, this._hasCompleteToilet = !1;
        }
        static get instance() {
            return this._instance;
        }
        onAwake() {
            ts._instance = this, super.onAwake();
        }
        onUpdate() {
            super.onUpdate(), this._inGuide && He.instance.LookAt(this.transform.position);
        }
        onLateUpdate() {
            super.onLateUpdate();
        }
        DispatchEvent(t) {
            super.DispatchEvent(6);
        }
        PlayMoveAnimation() {
            super.PlayMoveAnimation(), this.moveSpeed = 3.5;
        }
        ReInit(t, e) {
            Laya.timer.clearAll(this), this.sprite3D.active = !0, this.animator.enabled = !0,
                this._wpIndex = 0, this._data = t, this.gender = t.Gender[0], this.moveSpeed = t.MoveSpeed,
                this._currFuncIndex = 0, Laya.timer.once(1e3, this, () => {
                    this.GetEndPoint();
                });
        }
        HandleFunction() {
            super.HandleFunction(), this._runtimeFuncPosInfo.fac.belonger.functionID == Nt.MaleSink && (this._inGuide = !1,
                $.instance.eventUI(Mt.GuideToNext));
        }
        ExitBuilding() {
            if (this._runtimeFuncPosInfo.fac.belonger.functionID == Nt.MaleToilet) return this.SetWayPoints([{
                position: this._runtimeFuncPosInfo.fac.belonger.exit.transform.position
            }]).OnComplete(() => {
                super.PlayAnimationByState(ne.Idle);
            }, "等待"), Xe.instance.ResetFac(this), Xe.instance.TryOpenDoor(this.transform.position, !1),
                this._hasCompleteToilet = !0, void (this._inGuide && $.instance.eventUI(Mt.GuideToNext, 5));
            super.ExitBuilding(), this._inGuide = !1;
        }
        Start() {
            this._inGuide = !0, this._hasCompleteToilet && $.instance.eventUI(Mt.GuideToNext, 5);
        }
        Continue() {
            this.SetWayPoints([{
                position: this._runtimeFuncPosInfo.fac.belonger.entrance.transform.position
            }]).OnComplete(() => {
                super.DoNext();
            }, "执行下一步"), Laya.timer.once(600, this, () => Xe.instance.TryCloseDoor(this.transform.position));
        }
    }
    class es extends $i {
        constructor() {
            super(...arguments), this._endPoint = new Laya.Vector3(-6, 0, 11), this._isWait = !1;
        }
        SetActive(t) {
            this.sprite3D.active = t, this.GoWc();
        }
        onAwake() {
            $.instance.on3D(L.NetRedLeaveWC, this, this.LeaveWC);
        }
        GoWc() {
            let t = this._agent.TrySearchByNearestPos(this.transform.position, this._endPoint);
            this.SetWayPoints(t).OnComplete(this.OnReachWC), this.moveSpeed = 3;
        }
        OnReachWC() {
            $.instance.eventUI(Mt.AddAdUtilityNetRed), this.PlayAnimationByState(ne.Idle), this.transform.localRotationEulerY = Si.updateRotation(new Laya.Vector3(-1, 0, 1));
            let t = Le.PlayEffect(Ot.Hushen, this.id);
            this.sprite3D.addChild(t), t.transform.localPosition = St.zero, t.transform.localScale = new Laya.Vector3(.2, .2, .2),
                t.transform.rotationEuler = St.zero, this._isWait = !0;
        }
        LeaveWC() {
            this._isWait = !1, Le.ClearAll(this.id), super.ExitScene();
        }
        onMouseClick() {
            Be.IsCompleteAllGuide && this._isWait && Ui.ShowPanel(Zt.UIMediatorInfluencer);
        }
    }
    class is extends Ce {
        constructor() {
            super(...arguments), this._totalWeight = 0, this._pool = [], this._attachmentPool = [],
                this._malePrefabs = [], this._femalePrefabs = [], this._attachmentPrefabs = [],
                this._interval = 5, this._timer = 0, this._popToggle = !1, this._flow = 80;
        }
        static get instance() {
            return this._instance;
        }
        get flow() {
            return this._flow;
        }
        get count() {
            let t = 0;
            for (let e of this._pool) e.sprite3D.active && t++;
            return t;
        }
        onAwake() {
            is._instance = this;
        }
        onLateUpdate() {
            this._popToggle && (this._timer += pt.deltaTime, this._timer > this._interval && (this._timer = 0,
                this.count < this._flow && this.Pop()));
        }
        SetToggle(t) {
            this._popToggle = t;
        }
        InitPool(t, e) {
            if ($.instance.on3D(L.UpdateMaxFlow, this, this.SetInterval), this._entrances = t,
                this._exits = e, console.log("旅客对象池初始化..."), this._data = _e.instance.m_data, null == this._data || this._data.length <= 0) console.warn("对象池初始化失败，Json文件为空"); else {
                for (const t of this._data) this._totalWeight += t.Weight, t.point = this._totalWeight;
                this.LoadPrefabs(), this.InitNetRed(), this.InitRandomNumPeople();
            }
        }
        SetParentNode(t) {
            this._parentNode = t;
        }
        LoadPrefabs() {
            let t = Ti.instance.dataList;
            if (null == t || t.length <= 0) console.warn("加载指定旅客预制体失败，旅客预制体配置表为空"); else for (const e of t) {
                let t = p.prefab_url(e.name);
                if (t && t.length > 0) {
                    let i = a.Get(t);
                    i ? e.isAttachment ? this._attachmentPrefabs.push(i) : e.isMale ? this._malePrefabs.push(i) : this._femalePrefabs.push(i) : console.warn("获取预制体失败:", e.name, t);
                } else console.warn("获取url失败:", e.name, t);
            }
        }
        RandomInstantiate(t) {
            let e, i;
            if (t ? (i = ye.RangeInt(0, this._malePrefabs.length), e = this._malePrefabs[i]) : (i = ye.RangeInt(0, this._femalePrefabs.length),
                e = this._femalePrefabs[i]), e) {
                let t = this.Instantiate(e, this._parentNode).addComponent($i);
                return this._pool.push(t), t;
            }
            return console.warn("随机获取旅客预制体失败，导致实例化失败:", i, "isMale,", t, "预制体数组", t ? this._malePrefabs : this._femalePrefabs),
                null;
        }
        RandomGuestData() {
            let t = ye.Range(0, this._totalWeight);
            for (const e of this._data) if (t < e.point) return e;
            return null;
        }
        SearchPool(t) {
            let e = null;
            for (let i = 0; i < this._pool.length; i++) {
                let s = this._pool[i];
                if (!s.sprite3D.active && s.isMale == t) {
                    e = s;
                    break;
                }
            }
            return null == e && (e = this.RandomInstantiate(t)), e;
        }
        InstantiateAttachment(t) {
            let e = null;
            for (const i of this._attachmentPrefabs) if (i.name == t) {
                e = i;
                break;
            }
            return e ? this.Instantiate(e, this._parentNode) : (console.warn("获取附件的预制体失败,实例化失败:", t),
                null);
        }
        SearchAttachment(t) {
            let e = null;
            if (this._attachmentPool && this._attachmentPool.length > 0) for (let i = 0; i < this._attachmentPool.length; i++) if (this._attachmentPool[i].name == t) {
                e = this._attachmentPool[i];
                break;
            }
            return null == e && (e = this.InstantiateAttachment(t)), e;
        }
        SpawnAttachment(t) {
            return this.SearchAttachment(t);
        }
        SpawnGuest() {
            let t = this.RandomGuestData(), e = null;
            if (0 == t.Gender[0] ? e = this.SearchPool(!1) : 1 == t.Gender[0] ? e = this.SearchPool(!0) : console.warn("目标是个人吗？", t),
                e) {
                let i = null;
                if (t.RandomAttachments && t.RandomAttachments.length > 0) {
                    let e = t.RandomAttachments.length, s = ye.RangeInt(0, e), a = t.RandomAttachments[s].toString();
                    i = this.SpawnAttachment(a);
                }
                e.ReInit(t, i);
            } else console.error("对象池生成旅客失败，跳过本次");
            return e;
        }
        Pop() {
            let t = this.SpawnGuest();
            if (t) {
                let e = ye.random > .5 ? 0 : 1, i = this.GetEntranceByName("Entrance_" + e);
                t.transform.position = i.transform.position.clone();
            }
            return t;
        }
        GetEntranceByName(t) {
            for (let e of this._entrances) if (e.name == t) return e;
        }
        RecycleAttachment(t) {
            if (null == t) throw new we("被回收的附件为空.");
            t.active = !1, this._parentNode.addChild(t), this._attachmentPool.indexOf(t) < 0 ? this._attachmentPool.push(t) : console.warn("人物附件回收失败", t);
        }
        SetInterval(t) {
            this._interval = 60 / t, console.warn("当前生成频率", t, "/min");
        }
        AddPeopleOnWatchAD(t) {
            let e = this.GetEntranceByName("Entrance_2");
            for (let i = 0; i < t; i++) Laya.timer.once(600 * i, this, () => {
                this.Pop().transform.position = e.transform.position;
            });
        }
        InitRandomNumPeople() {
            if (this._popToggle) {
                let t = ye.RangeInt(10, 20);
                for (let e = 0; e < t; e++) {
                    let t = ye.Range(-3, 3), e = ye.Range(-3, 3), i = new Laya.Vector3(-12 + t, 0, 12 + e);
                    this.Pop().transform.position = i;
                }
            }
        }
        StartPop() {
            this.SetToggle(!0), this._pool.length < 20 && this.InitRandomNumPeople();
        }
        InitNetRed() {
            let t = p.prefab_url("woman_wh");
            this._netRedSprite = a.Get(t), this._netRed = this._netRedSprite.addComponent(es),
                this._parentNode.addChild(this._netRedSprite), this._netRedSprite.active = !1;
        }
        PopNetRed() {
            if (!this._netRed.sprite3D.active) {
                let t = ye.random > .5 ? 0 : 1, e = this.GetEntranceByName("Entrance_" + t);
                this._netRed.transform.position = e.transform.position.clone(), this._netRed.SetActive(!0);
            }
        }
        PopGuideUncle() {
            let t = ye.RangeInt(0, this._malePrefabs.length), e = this._malePrefabs[t], i = this.Instantiate(e, this._parentNode).addComponent(ts), s = this._data[this._data.length - 1];
            i.ReInit(s, null), i.transform.position = new Laya.Vector3(3.6, 0, 24.9);
        }
    }
    class ss extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainRecordShare");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0), this.m_bg = this.getChildAt(1), this.m_text_money = this.getChildAt(6),
                this.m_btn_record = this.getChildAt(7);
        }
    }
    ss.URL = "ui://8nmf3q47nt6l1ct", function (t) {
        t.None = "EPlatformType_None", t.Web = "EPlatformType_Web", t.WX = "EPlatformType_WX",
            t.TT = "EPlatformType_TT", t.QQ = "EPlatformType_QQ", t.VIVO = "EPlatformType_VIVO",
            t.OPPO = "EPlatformType_OPPO", t.BD = "EPlatformType_BD", t.KG = "EPlatformType_KG",
            t.Alipay = "EPlatformType_Alipay", t.HW = "EPlatformType_HW", t.QTT = "EPlatformType_QTT";
    }(oe || (oe = {}));
    class as extends r {
        static get instance() {
            return null == this._instance && (this._instance = new as()), this._instance;
        }
        get PlatformInstance() {
            return this.m_platformInstance || console.log(...s.packError("还没有设置过平台实例代理！")),
                this.m_platformInstance;
        }
        set PlatformInstance(t) {
            this.m_platformInstance = t;
        }
        static get platformStr() {
            return as.GetPlatformStr(this._instance.m_platformInstance.platform);
        }
        static GetPlatformStr(t) {
            switch (t) {
                case oe.None:
                    return "未识别";

                case oe.Web:
                    return "网页";

                case oe.BD:
                    return "百度";

                case oe.OPPO:
                    return "Oppo";

                case oe.QQ:
                    return "QQ";

                case oe.TT:
                    return "头条";

                case oe.VIVO:
                    return "Vivo";

                case oe.WX:
                    return "微信";

                case oe.QTT:
                    return "趣头条";

                default:
                    return "未定义" + t;
            }
        }
    }
    class ns extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ns(), this.m_instance._classDefine = ss),
                this.m_instance;
        }
        _OnShow() {
            super._OnShow(), this.ui.m_bg.m_btn_close.onClick(this, () => {
                Ui.ClosePanel(Zt.RecordVideo);
            });
        }
        ShowPanel() {
            Ui.ShowPanel(Zt.RecordVideo);
        }
        Close() {
            Ui.ClosePanel(Zt.RecordVideo);
        }
        ShowRecord() {
            this.ShowPanel(), this.ui.m_state.selectedIndex = 0, this.ui.m_btn_record.onClick(this, this.StartRecord);
        }
        ShowShare() {
            this.ShowPanel(), this.ui.m_state.selectedIndex = 1, this.ui.m_btn_record.onClick(this, this.ShareVideo);
        }
        StartRecord() {
            console.log("StartRecord"), $.instance.eventUI(Mt.OnStartRecord), this.Close(),
                as.instance.PlatformInstance.recordManager.StartRecord(Laya.Handler.create(this, () => {
                    as.instance.PlatformInstance.ShowToast("录制开始");
                }), Laya.Handler.create(this, () => {
                    as.instance.PlatformInstance.ShowToast("录制结束"), $.instance.eventUI(Mt.OnStopRecord),
                        this.ShowShare();
                }));
        }
        ShareVideo() {
            console.log("ShareVideo"), as.instance.PlatformInstance.recordManager.ShareVideo(Laya.Handler.create(this, () => {
                si.Diamond += 300, Ui.PlayDiamondEffect(this.ui.m_btn_record), Ui.ClosePanel(Zt.RecordVideo);
            }), Laya.Handler.create(this, () => {
                as.instance.PlatformInstance.ShowToast("分享取消");
            }), Laya.Handler.create(this, () => {
                as.instance.PlatformInstance.ShowToast("分享失败");
            }));
        }
    }
    class os extends Ue {
        constructor() {
            super(), this._layer = qt.Main, this._adUtilityList = [], this._lastTipTime = 0,
                Be.IsCompleteAllGuide ? this.isGuide = !1 : this.isGuide = !0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new os(), this.m_instance._classDefine = Ci),
                this.m_instance;
        }
        _OnShow() {
            window["Main"] = this.ui;


            Laya.timer.loop(1e4, this, this.RandomAdBtn), this.ShowPanel(Zt.EventPanel, !0, !1),
                this.ui.m_btn_statistics.onClick(this, this.ShowManager), this.ui.m_btn_video.onClick(this, this.ADClick),
                this.ui.m_turntableBtn.onClick(this, () => {
                    this.ShowPanel(Zt.LuckyWheel, !0, !1)
                }),
                this.ui.m_setBtn.onClick(this, () => this.ShowPanel(Zt.Setting, !0, !1)), this.ui.m_taskBtn.onClick(this, this.TaskOnClick),
                this.ui.m_staffBtn.onClick(this, () => {
                    YYGGames.showInterstitial(() => {
                        Ui.instance.ShowCleanRoom();
                    })
                }),
                this.ui.m_btn_speedUp.onClick(this, () => {
                    this.ShowUtilityPanel(Zt.UIMediatorSpeedUp);
                }), this.ui.m_btn_netRed.onClick(this, () => {
                    this.ShowUtilityPanel(Zt.UIMediatorInfluencer);
                }), this.ui.m_btn_cheers.onClick(this, () => {
                    this.ShowUtilityPanel(Zt.UIMediatorCheers);
                }), this.ui.m_btn_repair.onClick(this, () => {
                    this.ShowUtilityPanel(Zt.UIMeditorRepairGame);
                }), this.RenderRightUtility(), this.HideTaskBtn(), $.instance.onUI(Mt.UpdateTaskProgress, this, this.UpdateTaskProgress),
                $.instance.onUI(Mt.AddAdUtilityNetRed, this, this.OnAddNetRed), $.instance.on($t.UpdateOnLineTime, this, this.UpdateDoubleTimeLast),
                this.ShowRecordBtn(!0), this.ui.m_btn_record.onClick(this, this.ShowRecordVideoPanel),
                $.instance.onUI(Mt.OnStartRecord, this, this.ShowRecordStop), $.instance.onUI(Mt.OnStopRecord, this, this.ShowRecordIdle);

            h5splash.hideLoading();
            YYGGames.gameBox.visible = true;
            let Main = this.ui;
            Main._children[5]._children[0]._children[3].fontSize = 16;
            Main._children[5]._children[0]._children[4].fontSize = 16;
            Main._children[5]._children[0]._children[4].y = 18;
            Main._children[5]._children[0]._children[3].y = 18;
            Main._children[10]._children[2].visible = false;
        }
        TaskOnClick() {
            this.ShowPanel(Zt.Task, !0, !1);
        }
        _OnHide() {
            YYGGames.gameBox.visible = false;
            $.instance.off(Mt.UpdateTaskProgress, this, this.UpdateTaskProgress), $.instance.off(Mt.AddAdUtilityNetRed, this, this.OnAddNetRed),
                Laya.timer.clearAll(this);
        }
        ShowPanel(t, e, i) {
            Ve.instance.setUIState([{
                typeIndex: t,
                state: e
            }], i);
        }
        ADClick() {
            this.ShowPanel(Zt.AD, !0, !1), this.isGuide && (Be.IsCompleteAllGuide || ($.instance.eventUI(Mt.GuideToNext),
                this.isGuide = !1));
        }
        UpdateStaffNumText(t, e) {
            this.isShow && (this.ui.m_staffBtn.m_txt_num.text = t + "/" + e);
        }
        ShowManager() {
            YYGGames.showInterstitial(() => {
                Ve.instance.setUIState([{
                    typeIndex: Zt.Manager,
                    state: !0
                }], !1);
            })
        }
        RenderRightUtility() {
            this.ui.m_btn_cheers.visible = !1, this.ui.m_btn_cheers.touchable = !1, this.ui.m_btn_netRed.visible = !1,
                this.ui.m_btn_netRed.touchable = !1, this.ui.m_btn_repair.visible = !1, this.ui.m_btn_repair.touchable = !1,
                this.ui.m_btn_speedUp.visible = !1, this.ui.m_btn_speedUp.touchable = !1;
            for (let t of this._adUtilityList) switch (t) {
                case re.Cheers:
                    this.ui.m_btn_cheers.visible = !0, this.ui.m_btn_cheers.touchable = !0;
                    break;

                case re.NetRed:
                    this.ui.m_btn_netRed.visible = !0, this.ui.m_btn_netRed.touchable = !0;
                    break;

                case re.RepairGame:
                    this.ui.m_btn_repair.visible = !0, this.ui.m_btn_repair.touchable = !0;
                    break;

                case re.SpeedUp:
                    this.ui.m_btn_speedUp.visible = !0, this.ui.m_btn_speedUp.touchable = !0;
            }
        }
        GetRightBtnSpriteUrl(t) {
            switch (t) {
                case re.NetRed:
                    return "/res/sprite/utility/NetRed.png";

                case re.Cheers:
                    return "/res/sprite/utility/Party.png";

                case re.RepairGame:
                    return "/res/sprite/utility/Repair.png";

                case re.SpeedUp:
                default:
                    return "/res/sprite/utility/SpeedUp.png";
            }
        }
        OnClickRightUtilityBtn(t) {
            switch (t) {
                case re.NetRed:
                    this.ShowUtilityPanel(Zt.UIMediatorInfluencer);
                    break;

                case re.Cheers:
                    this.ShowUtilityPanel(Zt.UIMediatorCheers);
                    break;

                case re.RepairGame:
                    this.ShowUtilityPanel(Zt.UIMeditorRepairGame);
                    break;

                case re.SpeedUp:
                    this.ShowUtilityPanel(Zt.UIMediatorSpeedUp);
                    break;

                default:
                    console.error("打开面板失败！" + t);
            }
        }
        ShowUtilityPanel(t) {
            Ve.instance.setUIState([{
                typeIndex: t,
                state: !0
            }], !1);
        }
        AddAdUtility(t) {
            if (this._adUtilityList.indexOf(t) < 0) {
                this._adUtilityList.push(t), this.RenderRightUtility();
                let e = new Date().getTime();
                if (e - this._lastTipTime > 6e5) {
                    We.instance.ShowTalkPanel(3) && (this._lastTipTime = e);
                }
            }
        }
        RemoveADUtility(t) {
            let e = this._adUtilityList.indexOf(t);
            e > -1 && (this._adUtilityList.splice(e, 1), this.RenderRightUtility());
        }
        RandomAdBtn() {
            let t = ye.RangeInt(0, 4);
            t == re.NetRed ? is.instance && is.instance.PopNetRed() : this.AddAdUtility(t);
        }
        HideTaskBtn() {
            this.ui.m_taskBtn.visible = !1, this.ui.m_taskBtn.touchable = !1;
        }
        UpdateTaskProgress() {
            if (si.instance.Data.allTaskComplete) this.HideTaskBtn(); else {
                this.ui.m_taskBtn.visible = !0, this.ui.m_taskBtn.touchable = !0;
                let t = Xi.instance.currentTask;
                this.ui.m_taskBtn.m_progress.value = t.progress, this.ui.m_taskBtn.m_progress.m_text_progress.text = t.toSimpleProgressString(),
                    this.ui.m_taskBtn.m_progress.m_text_task.text = t.name;
            }
        }
        OnAddNetRed() {
            this.AddAdUtility(re.NetRed);
        }
        UpdateDoubleTimeLast() {
            let t = si.data.DoubleBuffTime;
            this.ui.m_txt_doubleTime.text = t > 0 ? "2x " + pt.ToTimeString(t) : "2x";
        }
        ShowRecordVideoPanel() {
            0 == this.ui.m_btn_record.m_state.selectedIndex ? ns.instance.ShowRecord() : (this.ShowRecordIdle(),
                as.instance.PlatformInstance.recordManager.StopRecord(Laya.Handler.create(this, () => {
                    as.instance.PlatformInstance.ShowToast("录制结束"), ns.instance.ShowShare();
                })));
        }
        ShowRecordBtn(t) {
            let e = as.instance.PlatformInstance.platform == oe.TT;
            this.ui.m_btn_record.visible = t && e;
        }
        ShowRecordState(t) {
            this.ui.m_btn_record.m_state.selectedIndex = t;
        }
        ShowRecordIdle() {
            this.ShowRecordState(0);
        }
        ShowRecordStop() {
            this.ShowRecordState(2), this.ui.m_btn_record.offClick(this, this.ShowRecordVideoPanel),
                this.ui.m_btn_record.grayed = !0;
            for (let t = 3; t >= 0; t--) {
                let e = t;
                Laya.timer.once(3e3 - 1e3 * e, this, () => {
                    this.ui.m_btn_record.m_number.text = t.toString(), e <= 0 && (this.ui.m_btn_record.m_number.text = "",
                        this.ui.m_btn_record.onClick(this, this.ShowRecordVideoPanel), this.ui.m_btn_record.grayed = !1);
                });
            }
        }
    }
    !function (t) {
        t[t.NetRed = 0] = "NetRed", t[t.Cheers = 1] = "Cheers", t[t.RepairGame = 2] = "RepairGame",
            t[t.SpeedUp = 3] = "SpeedUp";
    }(re || (re = {}));
    class rs extends yi {
        constructor() {
            super(...arguments), this._waitRepairFac = [], this._workList = [], this._workDict = new Map(),
                this._chairList = [], this._lastTipTime = 0;
        }
        get exitPos() {
            if (null == this._runtimeExitPos) {
                let t = this.sprite3D.getChildByName("exit");
                this._runtimeExitPos = t.transform.position;
            }
            return this._runtimeExitPos;
        }
        get staffNum() {
            return this._workList.length;
        }
        static get instance() {
            return this._instance;
        }
        onAwake() {
            super.onAwake(), rs._instance = this, $.instance.on3D(L.RepairFacility, this, this.OnRequestRepair),
                $.instance.on3D(L.FacilityRepairComplete, this, this.OnFacilityRepairComplete),
                $.instance.on3D(L.AddStaff, this, this.AddWorker), $.instance.onUI(Mt.OnClickRepairBtn, this, this.OnClickRepairBtn);
        }
        onStart() {
            this.InitWorkers(), this.entrance.active = !1;
        }
        ShowOutlook() { }
        ShowPlaceholder() { }
        ClosePlaceholder() { }
        UpdateFacilityLevel(t, e, i, s) {
            super.UpdateFacilityLevel(t, e, i, s), this.OnUpdateSlot();
        }
        InitWorkers() {
            this.InitChair();
            let t = a.Get(p.prefab_url(Rt.prefab4.Female_worker));
            if (!t) throw new we("维修工获取失败");
            {
                let e = si.instance.GetEmployeeList();
                for (let i = 0; i < e.length; i++) {
                    let s = this.Instantiate(t, this.owner), a = s.addComponent(Ii);
                    a.Init(e[i]), this._workDict.set(a.Name, a), this._workList.push(a), this._chairList[i].worker = a,
                        a.transform.position = this._chairList[i].chair.transform.position, a.transform.rotationEuler = this._chairList[i].chair.transform.rotationEuler,
                        s.active = !0;
                }
            }
            this.UpdateStaffNumUI();
        }
        AddWorker(t, e) {
            let i = -1;
            e && (i = this.GetWorkerIndexByName(e));
            let s = a.Get(p.prefab_url(Rt.prefab4.Female_worker)), n = this.Instantiate(s, this.owner), o = n.addComponent(Ii);
            if (o.Init(t), i > -1) {
                let t = this._workDict.get(e);
                this._workList[i] = o, this._workDict.delete(e), this._workDict.set(o.Name, o),
                    this.TryRemoveWorkerFromChair(t), t.Disposed();
            } else this._workDict.set(o.Name, o), this._workList.push(o);
            let r = this.TryGetEmptyChair(o);
            o.transform.position = r.transform.position, o.transform.rotationEuler = r.transform.rotationEuler,
                n.active = !0, this.UpdateStaffNumUI();
        }
        GetWorkerIndexByName(t) {
            for (let e = 0; e < this._workList.length; e++) if (this._workList[e].Name == t) return e;
            return -1;
        }
        OnClickRepairBtn() {
            let t = this._waitRepairFac[0];
            t && this.OnRequestRepair(t), console.log("雇员正在来的路上");
        }
        OnRequestRepair(t) {
            if (!this.TryDispatchWorker(t, this.exitPos)) {
                this._waitRepairFac.indexOf(t) < 0 ? (this._waitRepairFac.push(t), console.log("加入待维修的列表")) : console.log("不能重复加入待维修的列表");
            }
        }
        TryDispatchWorker(t, e) {
            for (let i of this._workList) if (!i.hasFacTarget) return i.SetFacTarget(t, e),
                this.TryRemoveWorkerFromChair(i), this.RemoveFacFromList(t), this.UpdateStaffNumUI(),
                !0;
            let i = new Date().getTime();
            if (i - this._lastTipTime > 6e4) {
                We.instance.ShowTalkPanel(2) && (this._lastTipTime = i);
            }
            return !1;
        }
        RemoveFacFromList(t) {
            let e = this._waitRepairFac.indexOf(t);
            e > -1 && this._waitRepairFac.splice(e, 1);
        }
        OnFacilityRepairComplete(t, e) {
            if (!e.isDisposed) if (this._waitRepairFac.length > 0) {
                let t = this._waitRepairFac[0];
                this.TryDispatchWorker(t, this.exitPos);
            } else {
                let t = this.TryGetEmptyChair(e);
                e.ReturnChairPos(t), this.UpdateStaffNumUI();
            }
        }
        InitChair() {
            let t = this.sprite3D.getChildByName(Gt.Chair), e = t.numChildren;
            this._chairList = new Array(e);
            for (let i = 0; i < e; i++) {
                let e = t.getChildAt(i);
                if (!e) throw new Error("初始化椅子失败！" + i.toString());
                this._chairList[i] = {
                    chair: e,
                    worker: null
                };
            }
        }
        TryGetEmptyChair(t) {
            let e = null;
            for (let i of this._chairList) if (null == i.worker) {
                e = i.chair, i.worker = t;
                break;
            }
            if (null == e) throw "获取闲置的椅子失败！";
            return e;
        }
        TryRemoveWorkerFromChair(t) {
            for (let e of this._chairList) e.worker == t && (e.worker = null);
        }
        onUpdate() {
            this._waitRepairFac.forEach(t => {
                je.instance.EventDistribute(t.runtimeFirstChild.transform.position, t.sprite.id, t.eventID, 0);
            });
        }
        OnUpdateSlot() {
            this._workList.forEach(t => {
                t.SetRepairTime(this.cleanTime);
            });
        }
        UpdateStaffNumUI() {
            let t = 0;
            for (let e of this._workList) e.hasFacTarget || t++;
            let e = this._workList.length;
            os.instance.UpdateStaffNumText(t, e);
        }
        RepairCompleteNow() {
            for (let t of this._waitRepairFac) t.SetBreakState(!1), je.instance.RecycleBtn(t.sprite.id, t.eventID),
                Le.ClearAll(t.sprite.id);
            this._waitRepairFac = [];
            for (let t of this._workList) t.hasFacTarget && t.RepairCompleteNow();
        }
        OnClick() {
            super.OnClick(), He.instance.FocusBuild(21);
        }
    }
    class ls extends yi {
        constructor() {
            super(...arguments), this._standardTime = 12;
        }
        ShowOutlook() { }
        ShowPlaceholder() { }
        ClosePlaceholder() { }
        OnClick() {
            this.functionID == Nt.FemaleSink ? He.instance.FocusBuild(19) : He.instance.FocusBuild(18);
        }
        onStart() {
            super.onStart(), this.entrance.active = !1;
        }
    }
    class hs extends yi {
        constructor() {
            super(...arguments), this._standardTime = 15;
        }
        print() {
            console.log(this.buildingName, this.slotPosList);
        }
        ShowOutlook(t, e, i = !1) {
            if (this.ClosePlaceholder(), t) this.sprite3D.getChildByName(Gt.cs_nan).active = !0,
                this.sprite3D.getChildByName(Gt.cs_nv).active = !1, this.sprite3D.getChildByName(Gt.toiletWall).active = !1; else {
                this.sprite3D.getChildByName(Gt.cs_nan).active = !1, this.sprite3D.getChildByName(Gt.cs_nv).active = !0;
                let t = e % 2 == 0;
                this.sprite3D.getChildByName(Gt.toiletWall).active = !t;
            }
            this._equipmentNode.active = !0, i && this.PlayBuildEffect(), $.instance.event3D(L.SetDoorActive, [this.transform.position, !0]);
        }
        ShowPlaceholder() {
            super.ShowPlaceholder(), $.instance.event3D(L.SetDoorActive, [this.transform.position, !1]);
        }
        OnClick() {
            super.OnClick(), this.functionID == Nt.MaleToilet ? He.instance.FocusBuild(this._index - 1) : He.instance.FocusBuild(this._index + 5);
        }
    }
    class cs extends yi {
        constructor() {
            super(...arguments), this._peeLine = {}, this._maleLine = {}, this._femaleLine = {};
        }
        get flow() {
            let t = this.slots[0];
            return pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
        }
        get femaleQueueLength() {
            let t = this.slots[1];
            return pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
        }
        get maleQueueLength() {
            let t = this.slots[2];
            return pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
        }
        get peeQueueLength() {
            let t = this.slots[3];
            return pe.instance.GetSlotConfigByUID(t.uid)[t.level].length;
        }
        InitBuilding(t, e) {
            this.active = t.active, this.functionID = t.functionID, this._index = t.index, this._name = t.name,
                this._title = t.title, this.slots = t.slots, this.InitAllLine();
            for (let e = 0; e < t.slots.length; e++) {
                let i = t.slots[e];
                this.UpdateFacilityLevel(i.name + "_" + e.toString(), i.level, !1, i);
            }
        }
        UpdateFacilityLevel(t, e, i, s) {
            if (this.UpdateStatistic(), t == Gt.slot_flow_config_0) return;
            let a = this._equipmentNode.getChildByName(t);
            if (a) {
                let t = this.GetLengthByLevel(s.uid, s.level);
                a.active = !0, this.ToggleAllChild(a, !1);
                for (let e = 0; e < t; e++) {
                    let t = a.getChildByName(e.toString());
                    t ? t.active = !0 : console.log("获取面片失败！" + a.name, e);
                }
            } else console.warn("试图在建筑", this.sprite3D.name, "中获取一个不存在的设备", t, ",请检查场景中是否已正确放置此设备...");
        }
        GetLengthByLevel(t, e) {
            let i = pe.instance.GetSlotConfigByUID(t);
            if (i) {
                if (i[e]) return i[e].length;
                throw new Error(t + "-" + e + "的配置表等级信息获取失败！");
            }
            throw new Error(t + "-" + e + "的配置表获取失败！");
        }
        InitAllLine() {
            this.InitLineUp(Gt.slot_femaleQueue_config_1, this._femaleLine), this.InitLineUp(Gt.slot_peeQueue_config_2, this._peeLine),
                this.InitLineUp(Gt.slot_maleQueue_config_3, this._maleLine);
        }
        InitLineUp(t, e) {
            let i = this._equipmentNode.getChildByName(t), s = i.numChildren;
            for (let t = 0; t < s; t++) {
                let s = i.getChildAt(t);
                e[s.name] = s;
            }
        }
        ShowOutlook() { }
        onStart() {
            super.onStart(), this.ToggleQueueShow(!1);
        }
        OnClick() {
            super.OnClick(), this.ToggleQueueShow(!0), He.instance.FocusBuild(24);
        }
        OffClick() {
            super.OffClick(), this.ToggleQueueShow(!1);
        }
        ToggleQueueShow(t) {
            this._equipmentNode.getChildByName("slot_femaleQueue_config_1").active = t, this._equipmentNode.getChildByName("slot_peeQueue_config_2").active = t,
                this._equipmentNode.getChildByName("slot_maleQueue_config_3").active = t;
        }
    }
    class ds extends yi {
        constructor() {
            super(...arguments), this._standardTime = 15;
        }
        ShowOutlook(t, e, i = !1) { }
        UpdateFacOutLook() {
            let t = this.slots;
            for (let e of t) this.UpdateFacilityLevel(e.name + "_" + e.id.toString(), e.level, !1, e);
        }
        OnClick() {
            super.OnClick(), He.instance.FocusBuild(38);
        }
    }
    class ms extends Ce {
        constructor() {
            super(...arguments), this._speed = 100, this._star = 0, this._isAllowOnclick = !1;
        }
        onStart() {
            this._time = 0, this._money = 0;
        }
        onUpdate() {
            if (this._time += pt.deltaTime, this._money += pt.deltaTime * this._speed * ((this._star + 1) * (this._star + 1)),
                this._time > 10) {
                this._time = 0;
                let t = Le.PlayEffect(Ot.Emoji_money, this.id);
                this.sprite3D.addChild(t), t.transform.localPosition = St.zero, this._isAllowOnclick = !0,
                    t.active = !1, t.active = !0;
            }
        }
        OnclickCollectMoney() {
            Le.Clear(this.id, Ot.Emoji_money);
            let t = Math.floor(this._money);
            si.Money += t, this._money = 0, this._time = 0, this._isAllowOnclick = !1;
            let e = Le.PlayEffect(Ot.Money, this.id, 2e3);
            this.owner.addChild(e), e.transform.localPosition = St.zero, e.transform.rotationEuler = this.transform.rotationEuler;
        }
        onMouseDown() {
            this._isAllowOnclick && this.OnclickCollectMoney();
        }
    }
    class us extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "CountDownTime");
        }
        onConstruct() {
            this.m_libraryLastTime = this.getChildAt(0), this.m_canteenLastTime = this.getChildAt(1);
        }
    }
    us.URL = "ui://8nmf3q47llxc1cn";
    class _s extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameOpenCafe");
        }
        onConstruct() {
            this.m_type = this.getControllerAt(0), this.m_btn_close = this.getChildAt(3), this.m_title = this.getChildAt(4),
                this.m_cafeBulidProgress = this.getChildAt(6), this.m_spirte = this.getChildAt(9),
                this.m_text_countDown = this.getChildAt(13), this.m_btn_Ad = this.getChildAt(14),
                this.m_btn_thanks = this.getChildAt(15);
        }
    }
    _s.URL = "ui://8nmf3q47b3xq1at";
    class gs {
        static music_url(t) {
            return f.instance.getResURL(d.music) + t + ".mp3";
        }
        static sound_url(t) {
            return f.instance.getResURL(d.sound) + t + ".mp3";
        }
        static icon_url(t) {
            return f.instance.getResURL(d.icon) + t + ".png";
        }
        static img_url(t, e = "png") {
            return f.instance.getResURL(d.img) + t + "." + e;
        }
        static skin_url(t, e = "png") {
            return f.instance.getResURL(d.skin) + t + "." + e;
        }
    }
    class fs {
        constructor() {
            this._bgPast = [], this._urlBGM = "", this._urlSOUND = "", this._sounds = [];
        }
        static get instance() {
            return null == this._instance && (this._instance = new fs()), this._instance;
        }
        init() { }
        playBGM(t, e, i, a) {
            null != t && this._bgPast.slice(-1)[0] != t ? (this._bgPast.push(t), this._urlBGM = gs.music_url(t),
                this._playMusic(e, i, a), console.log(...s.packLog("播放背景音乐", t))) : "" != this._urlBGM && (this._playMusic(e, i, a),
                    console.log(...s.packLog("播放背景音乐", t)));
        }
        shiftBGM(t, e, i, s) {
            if (this._bgPast.slice(-1)[0] == t) {
                this._bgPast.pop(), this._bgPast.slice(-1)[0] && (this._urlBGM = gs.music_url(t),
                    this._playMusic(e, i, s));
            }
        }
        pauseBGM() {
            Laya.SoundManager.stopMusic(), console.log(...s.packLog("停止播放音乐", this._urlBGM));
        }
        pauseSound() {
            Laya.SoundManager.stopAllSound();
        }
        playSound(t, e, i, s, a) {
            this._urlSOUND = gs.sound_url(t);
            for (let t = 0; t < this._sounds.length; t++) if (this._sounds[t] && this._sounds[t].url.indexOf(this._urlSOUND) >= 0) {
                this._sounds[t].stop(), this._sounds.splice(t, 1);
                break;
            }
            let n = Laya.SoundManager.playSound(this._urlSOUND, e, i, s, a);
            this._sounds.push(n);
        }
        stopSound(t) {
            this._urlSOUND = gs.sound_url(t), Laya.SoundManager.stopSound(this._urlSOUND);
        }
        _playMusic(t = 0, e, i) {
            Laya.SoundManager.stopMusic(), Laya.SoundManager.playMusic(this._urlBGM, t, e, i);
        }
    }
    class ps {
        constructor() {
            this.m_stop = !1, this.m_onLoopSoundList = new Set();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ps()), this.m_instance;
        }
        stopBGM() {
            fs.instance.pauseBGM();
        }
        BGMGoOn() {
            this.playBGM(this.m_onBGM);
        }
        soundSuspend() {
            this.m_stop = !0;
            for (let t of this.m_onLoopSoundList) fs.instance.stopSound(t);
        }
        soundGoOn() {
            this.m_stop = !1;
            for (let t of this.m_onLoopSoundList) fs.instance.playSound(t, 0);
        }
        playBGM(t, e, i, s) {
            ht.gameData.ifOpenBgm && !this.m_stop && (fs.instance.playBGM(t, e, i, s), this.m_onBGM = t);
        }
        playSound(t, e, i, s, a) {
            ht.gameData.ifOpenSound && !this.m_stop && (0 == e && this.m_onLoopSoundList.add(t),
                fs.instance.playSound(t, e, i, s, a));
        }
        stopSound(t) {
            fs.instance.stopSound(t), this.m_onLoopSoundList.has(t) && this.m_onLoopSoundList.delete(t);
        }
    }
    !function (t) {
        t.null = "", t.bgm1 = "bgm1", t.bgm2 = "bgm2";
    }(le || (le = {}));
    class ys extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameSet");
        }
        onConstruct() {
            this.m_music = this.getControllerAt(0), this.m_effect = this.getControllerAt(1),
                this.m_close = this.getChildAt(1), this.m_btn_close = this.getChildAt(6), this.m_musicBtn = this.getChildAt(10),
                this.m_ecffectBtn = this.getChildAt(11), this.m_t1 = this.getTransitionAt(0);
        }
    }
    ys.URL = "ui://8nmf3q47d8o30";
    class Ss extends Ue {
        constructor() {
            super(), this._musicToggle = !0, this._effectToggle = !0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ss(), this.m_instance._classDefine = ys),
                this.m_instance;
        }
        _OnShow() {
            window["Setting"] = this.ui;
            let Setting = this.ui;
            Setting._children[2].width = 220;
            Setting._children[2].text = "Setting";
            Setting._children[10]._children[1].text = "Music";
            Setting._children[10]._children[1].width = 100;
            Setting._children[10]._children[1].x = 38;
            YYGGames.gameBox.visible = false;
            super.Show(), this.ui.m_btn_close.onClick(this, this.Close), this.ui.m_close.onClick(this, this.Close),
                this.ui.m_musicBtn.m_state.selectedIndex = this._musicToggle ? 0 : 1, this.ui.m_musicBtn.onClick(this, this.ToggleMusic);
        }
        ToggleMusic() {
            this._musicToggle = !this._musicToggle, this.ui.m_musicBtn.m_state.selectedIndex = this._musicToggle ? 0 : 1,
                this._musicToggle ? ps.instance.BGMGoOn() : ps.instance.stopBGM();
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.Setting,
                state: !1
            }], !1);
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            super.Hide();
        }
    }
    class Is {
        static PlayAudio() {
            null == this.currBgm ? (this.currBgm = this.bgm1, Ss.instance._musicToggle && ps.instance.playBGM(le.bgm1, 10)) : this.currBgm == this.bgm1 ? (this.currBgm = this.bgm2,
                Ss.instance._musicToggle && ps.instance.playBGM(le.bgm2, 10)) : this.currBgm == this.bgm2 && (this.currBgm = this.bgm1,
                    Ss.instance._musicToggle && ps.instance.playBGM(le.bgm1, 10));
        }
    }
    Is.bgm1 = "res/bgm/bgm1.mp3", Is.bgm2 = "res/bgm/bgm2.mp3", Is.currBgm = null;
    class Cs extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Cs(), this.m_instance._classDefine = _s),
                this.m_instance;
        }
        _OnShow() {
            YYGGames.gameBox.visible = false;
            this.ui.m_btn_close.onClick(this, this.Close), this.ui.m_btn_thanks.onClick(this, this.Close),
                $.instance.on($t.UpdateOnLineTime, this, this.OnTick), this.ui.m_btn_Ad.onClick(this, this.OnClickAd),
                Ge.trackEvent(Kt.OpenCoffeeUI);
            window["OpenCoffee"] = this.ui;
            OpenCoffee._children[4].text = "Open store";
            OpenCoffee._children[5].text = "The store is built, wait for the countdown to end";
            OpenCoffee._children[5].font = "Arial";
            OpenCoffee._children[10].text = "Convenience store";
            OpenCoffee._children[10].font = "Arial";
            OpenCoffee._children[11].text = "There's nothing better than a convenience store next to a bathroom";
            OpenCoffee._children[11].fontSize = 20;
            OpenCoffee._children[15]._children[2].text = "No,thanks";
            OpenCoffee._children[15]._children[2].x = 33;
            OpenCoffee._children[15]._children[2].y = 22;
            OpenCoffee._children[14]._children[2].y = 18;
            OpenCoffee._children[14]._children[2].x = 76;
            OpenCoffee._children[14]._children[1].x = 25;
            OpenCoffee._children[13].y = 636;
            console.log("OpenCoffee_OnShow");
            Laya.timer.frameOnce(1, this, () => {
                OpenCoffee._children[4].text = "Open store";
                OpenCoffee._children[5].text = "The store is built, wait for the countdown to end";
                OpenCoffee._children[10].text = "Convenience store";
                OpenCoffee._children[11].text = "There's nothing better than a convenience store next to a bathroom";
            })


        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            $.instance.off($t.UpdateOnLineTime, this, this.OnTick);
        }
        ShowPanel(t) {
            Ve.instance.setUIState([{
                typeIndex: Zt.OpenCoffee,
                state: !0
            }], !1), 0 == t ? (this.ui.m_type.selectedIndex = 0, this.ui.m_spirte.url = "res/sprite/ui_build_icon/icon_library.png") : (this.ui.m_type.selectedIndex = 1,
                this.ui.m_spirte.url = "res/sprite/ui_build_icon/icon_canteen.png"), this.OnTick();
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.OpenCoffee,
                state: !1
            }], !1);
        }
        OnTick() {
            if (0 == this.ui.m_type.selectedIndex) {
                let t = si.data.LibraryLastTime;
                this.ui.m_text_countDown.text = t > 0 ? pt.ToTimeString(t) : "00:00:00";
            } else {
                let t = si.data.CanteenLastTime;
                t > 0 ? (this.ui.m_text_countDown.text = pt.ToTimeString(t), this.ui.m_cafeBulidProgress.value = t / 24 / 60 / 60 / 10) : (this.ui.m_cafeBulidProgress.value = 0,
                    this.ui.m_text_countDown.text = "00:00:00");
            }
        }
        OnClickAd() {
            let t = this.ui.m_type.selectedIndex;
            YYGGames.showReward(() => {
                Is.PlayAudio(), 0 == t ? si.data.LibraryLastTime = si.data.LibraryLastTime - 108e5 : si.data.CanteenLastTime = si.data.CanteenLastTime - 108e5,
                    Ge.trackEvent(Kt.CoffeeAD), this.isShow && this.OnTick();
            })
        }
    }
    class ws extends Ue {
        constructor() {
            super(), this._layer = qt.EventLayer, this._lV4Pos = new Laya.Vector4();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ws(), this.m_instance._classDefine = us),
                this.m_instance;
        }
        _OnShow() {
            window["CountDownTime"] = this.ui;
            this.ui.m_canteenLastTime.m_txt_lastTime.fontSize = 20;
            $.instance.on($t.UpdateOnLineTime, this, this.UpdateLastTime), $.instance.onUI(Mt.CanteenTimeOver, this, this.OnCarteenTimeOver),
                $.instance.onUI(Mt.LibraryTimeOver, this, this.OnLibraryTimeOver), this.ui.m_libraryLastTime.onClick(this, this.OnClickLibrary),
                this.ui.m_canteenLastTime.onClick(this, this.OnClickCateen);
        }
        _OnHide() {
            $.instance.off($t.UpdateOnLineTime, this, this.UpdateLastTime), $.instance.offUI(Mt.CanteenTimeOver, this, this.OnCarteenTimeOver),
                $.instance.offUI(Mt.LibraryTimeOver, this, this.OnLibraryTimeOver);
        }
        UpdateLastTime() {
            if (!this.isShow) return;
            let t = si.data.CanteenLastTime;
            this.ui.m_canteenLastTime.m_txt_lastTime.text = t > 0 ? pt.ToTimeString(t) : "Under development!";
            let e = si.data.LibraryLastTime;
            this.ui.m_libraryLastTime.m_txt_lastTime.text = e > 0 ? pt.ToTimeString(e) : "Under development!";
        }
        ChangPos(t, e, i) {
            X.camera.worldToViewportPoint(e, i), t.x = i.x, t.y = i.y;
        }
        OnCarteenTimeOver() {
            this.isShow && (this.ui.m_canteenLastTime.m_txt_lastTime.text = "Under development!");
        }
        OnLibraryTimeOver() {
            this.isShow && (this.ui.m_libraryLastTime.m_txt_lastTime.text = "Under development!");
        }
        UpdateLibraryTimePos(t) {
            this.isShow && this.ChangPos(this.ui.m_libraryLastTime, t, this._lV4Pos);
        }
        UpdateCanteenTimePos(t) {
            this.isShow && this.ChangPos(this.ui.m_canteenLastTime, t, this._lV4Pos);
        }
        OnClickLibrary() {
            Cs.instance.ShowPanel(0), si.data.hasLibraryTime || (si.data.hasLibraryTime = !0,
                si.data.LibraryLastTime = 864e5);
        }
        OnClickCateen() {
            si.data.hasCanteenTime || (si.data.hasCanteenTime = !0, si.data.CanteenLastTime = 864e5),
                si.data.CanteenLastTime > 0 ? Cs.instance.ShowPanel(1) : this.ui.m_canteenLastTime.m_txt_lastTime.text = "Under development!";
        }
    }
    class bs extends yi {
        ShowPlaceholder() {
            super.ShowPlaceholder(), $.instance.event3D(L.SetDoorActive, [this.transform.position, !1]);
        }
        ShowOutlook(t, e, i = !1) {
            this.sprite3D.getChildByName("outlook").active = !0, super.ClosePlaceholder(), this._equipmentNode.active = !0,
                i && this.PlayBuildEffect(), $.instance.event3D(L.SetDoorActive, [this.transform.position, !0]);
        }
        onLateUpdate() {
            ws.instance.UpdateLibraryTimePos(this.transform.position);
        }
        OnClick() {
            super.OnClick(), He.instance.FocusBuild(22);
        }
    }
    class Ls extends rt { }
    class xs extends nt {
        constructor() {
            super(), $.instance.on3D(L.UpdateBuildingData, this, this.UpdateBuildData), $.instance.onUI(Mt.UpdateSlotData, this, this.UpdateSlotData);
        }
        static get instance() {
            return null == this._instance && (this._instance = new xs()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "LibraryData";
        }
        getNewData() {
            return new Ls();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !1, this._data.list.functionID = Nt.Library, this._data.list.name = Gt.Library,
                this._data.list.index = 0, this._data.list.title = "图书馆", this.InitSlot(this._data.list),
                this._SaveToDisk(this._data));
        }
        InitSlot(t) {
            let e = oi.instance.dataList, i = 0;
            for (let t of e) t.library_slot > -1 && i++;
            t.slots = new Array(i);
            for (let s = 0; s < i; s++) {
                let i = new ai(), a = e[s];
                i.id = s, i.uid = a.library_slot, i.name = ge.instance.dataList[i.uid].name, i.level = a.library_slot_level,
                    i.usable = Ft.data.slot_Chair_config == i.uid, t.slots[s] = i;
            }
        }
        UpdateBuildData(t) {
            if (t.Name == Gt.Library) {
                console.log("图书馆建造完成开放"), this._data.list.active = !0;
                let e = {
                    buildingName: t.Name,
                    buildingData: this._data.list
                };
                $.instance.event3D(L.UpdateBuildingOutlookEvent, e), this._SaveToDisk(this._data);
            }
        }
        UpdateSlotData(t) {
            if (t.building.functionID == Nt.Library) {
                let e = this.data.list;
                e ? (ai.UpdateSlotData(t, e.slots), this._SaveToDisk(this._data)) : console.error("获取数据失败！", t);
            }
        }
    }
    class vs extends yi {
        onLateUpdate() {
            ws.instance.UpdateCanteenTimePos(this.transform.position);
        }
    }
    class As extends rt { }
    class Ps extends nt {
        static get instance() {
            return null == this._instance && (this._instance = new Ps()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "CanteenData";
        }
        getNewData() {
            return new As();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !1, this._data.list.functionID = Nt.Canteen, this._data.list.name = Gt.canteen,
                this._data.list.index = 0, this._data.list.title = "便利店", this._data.list.slots = [],
                this._SaveToDisk(this._data));
        }
        InitSomeSlot(t) {
            let e = 0, i = oi.instance.dataList;
            for (let t = 0; t < i.length; t++) i[t].cleanroom_Slot > -1 && e++;
            if (e > 0) {
                t.slots = new Array(e);
                for (let s = 0; s < e; s++) {
                    let e = new ai();
                    e.level = i[s].cleanroom_Slot_Level, e.uid = i[s].cleanroom_Slot, e.name = ge.instance.dataList[e.uid].name,
                        e.id = s, t.slots[s] = e;
                }
            } else console.warn("清洁室没有可用的Slot");
        }
    }
    class Ds extends yi {
        ShowOutlook(t, e, i = !1) { }
        ShowPlaceholder() { }
        onStart() {
            super.onStart(), this.entrance.active = !1;
        }
        OnClick() {
            super.OnClick(), He.instance.FocusBuild(20);
        }
    }
    class ks {
        constructor() {
            $.instance.on3D(L.OpenBuildBlock, this, this.PlayState);
        }
        static get instance() {
            return null == this._instance && (this._instance = new ks()), this._instance;
        }
        InitBlockAnimator(t, e) {
            this.maleAnimator = t.getComponent(Laya.Animator), this.femaleAnimator = e.getComponent(Laya.Animator);
            let i = Je.instance.dict.get(Gt.maleToilet);
            this.PlayState(i.count, !0);
            let s = Je.instance.dict.get(Gt.femaleToilet);
            this.PlayState(s.count, !1);
        }
        PlayState(t, e) {
            0 <= (t = (t += 1) >= 6 ? 6 : t) && t <= 6 ? e ? this.maleAnimator.play(t.toString()) : this.femaleAnimator.play(t.toString()) : console.error("厕所格子等级显示超限！");
        }
    }
    !function (t) {
        t[t.maleToilet_1 = 0] = "maleToilet_1", t[t.maleToilet_2 = 1] = "maleToilet_2",
            t[t.maleToilet_3 = 2] = "maleToilet_3", t[t.maleToilet_4 = 3] = "maleToilet_4",
            t[t.maleToilet_5 = 4] = "maleToilet_5", t[t.maleToilet_6 = 5] = "maleToilet_6",
            t[t.femaleToilet_1 = 6] = "femaleToilet_1", t[t.femaleToilet_2 = 7] = "femaleToilet_2",
            t[t.femaleToilet_3 = 8] = "femaleToilet_3", t[t.femaleToilet_4 = 9] = "femaleToilet_4",
            t[t.femaleToilet_5 = 10] = "femaleToilet_5", t[t.femaleToilet_6 = 11] = "femaleToilet_6",
            t[t.femaleToilet_7 = 12] = "femaleToilet_7", t[t.femaleToilet_8 = 13] = "femaleToilet_8",
            t[t.femaleToilet_9 = 14] = "femaleToilet_9", t[t.femaleToilet_10 = 15] = "femaleToilet_10",
            t[t.femaleToilet_11 = 16] = "femaleToilet_11", t[t.femaleToilet_12 = 17] = "femaleToilet_12",
            t[t.maleSink = 18] = "maleSink", t[t.femaleSink = 19] = "femaleSink", t[t.waterRoom = 20] = "waterRoom",
            t[t.cleanRoom = 21] = "cleanRoom", t[t.library = 22] = "library", t[t.canteen = 23] = "canteen",
            t[t.waitArea = 24] = "waitArea", t[t.maleBlock_1 = 25] = "maleBlock_1", t[t.maleBlock_2 = 26] = "maleBlock_2",
            t[t.maleBlock_3 = 27] = "maleBlock_3", t[t.maleBlock_4 = 28] = "maleBlock_4", t[t.maleBlock_5 = 29] = "maleBlock_5",
            t[t.maleBlock_6 = 30] = "maleBlock_6", t[t.femaleBlock_1 = 31] = "femaleBlock_1",
            t[t.femaleBlock_2 = 32] = "femaleBlock_2", t[t.femaleBlock_3 = 33] = "femaleBlock_3",
            t[t.femaleBlock_4 = 34] = "femaleBlock_4", t[t.femaleBlock_5 = 35] = "femaleBlock_5",
            t[t.femaleBlock_6 = 36] = "femaleBlock_6", t[t.VendingMachine = 37] = "VendingMachine",
            t[t.peeArea = 38] = "peeArea", t[t.GuestUncle = 39] = "GuestUncle", t[t.NetRed = 40] = "NetRed";
    }(he || (he = {})), function (t) {
        t.config = class { }, t.path = "res/config/GuideInfo.json";
        console.log(JSON.stringify(t.path))
    }(ce || (ce = {}));
    class Us extends k {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Us()), this._instance;
        }
        initData() {
            this.m_dataList = ce.dataList;

        }
    }
    class Ts extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Guide", "GuidePanel");
        }
        onConstruct() {
            this.m_guide = this.getControllerAt(0), this.m_layer = this.getControllerAt(1),
                this.m_windowsPos = this.getControllerAt(2), this.m_finger = this.getChildAt(2),
                this.m_window = this.getChildAt(4), this.m_pos2 = this.getChildAt(5), this.m_pos3 = this.getChildAt(6),
                this.m_pos = this.getChildAt(7), this.m_a = this.getChildAt(10), this.m_pos4 = this.getChildAt(11),
                this.m_click = this.getChildAt(13), this.m_finger_npcLayer = this.getChildAt(16),
                this.m_text = this.getChildAt(19);
        }
    }
    Ts.URL = "ui://09olrtmgujue0";
    class Rs extends Ue {
        constructor() {
            super(), this.allowClick = !1, this._layer = qt.Guide;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Rs(), this.m_instance._classDefine = Ts),
                this.m_instance;
        }
        _OnShow() {
            super.Show(), this.dataList = Us.instance.dataList;
        }
        MaskClick() {
            this.allowClick && (68 == Be.instance.Data.guideID && ($.instance.eventUI(Mt.GuideToEnd),
                console.log("发送关闭引导信号")), this.allowClick = !1, $.instance.eventUI(Mt.GuideToNext));
        }
        NextPanel(t) {
            let e = this.dataList[t].delay;
            this.ui.m_click.off(Laya.Event.CLICK, this, this.MaskClick), 0 != e ? (this.ui.m_layer.selectedIndex = 0,
                this.ui.m_guide.selectedIndex = 3, Laya.timer.once(e, this, this.SetPanel, [t])) : this.SetPanel(t);
        }
        SetPanel(t) {
            switch (Laya.timer.clearAll(this), this.ui.m_guide.selectedIndex = this.dataList[t].guideIndex,
            this.ui.m_layer.selectedIndex = this.dataList[t].layerIndex, 1 == this.ui.m_layer.selectedIndex ?
                this.ui.m_windowsPos.selectedIndex = this.dataList[t].posIndex : (this.ui.m_text.text = this.dataList[t].text,
                    // this.ui.m_text.font = "Arial",
                    window["m_text"] = this.ui.m_text,
                    Laya.timer.once(500, this, () => {
                        this.allowClick = !0, this.ui.m_click.on(Laya.Event.CLICK, this, this.MaskClick);
                    }), console.log(this.dataList[t].text)), t) {
                case 31:
                    this.ui.m_window.x = this.ui.m_pos.x, this.ui.m_window.y = this.ui.m_pos.y;
                    break;

                case 34:
                    this.ui.m_window.x = this.ui.m_pos2.x, this.ui.m_window.y = this.ui.m_pos2.y;
                    break;

                case 36:
                    this.ui.m_window.x = this.ui.m_pos.x, this.ui.m_window.y = this.ui.m_pos.y;
                    break;

                case 39:
                    this.ui.m_window.x = this.ui.m_pos3.x, this.ui.m_window.y = this.ui.m_pos3.y;
                    break;

                case 41:
                    this.ui.m_window.x = this.ui.m_pos.x, this.ui.m_window.y = this.ui.m_pos.y;
                    break;

                case 67:
                    this.ui.m_window.x = this.ui.m_pos4.x, this.ui.m_window.y = this.ui.m_pos4.y;
            }
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.Guide,
                state: !1
            }], !1);
        }
        _OnHide() {
            super.Hide();
        }
    }
    class Os extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "PGameToiletPanel");
        }
        onConstruct() {
            this.m_stuffSwitch = this.getControllerAt(0), this.m_cleanRoomSwitch = this.getControllerAt(1),
                this.m_close = this.getChildAt(0), this.m_btn_up = this.getChildAt(1), this.m_btn_employee = this.getChildAt(2),
                this.m_topPanel = this.getChildAt(4), this.m_top_Title = this.getChildAt(5), this.m_rightBtn = this.getChildAt(6),
                this.m_leftBtn = this.getChildAt(9), this.m_slotList = this.getChildAt(12), this.m_midPanel = this.getChildAt(13),
                this.m_staffList = this.getChildAt(15);
        }
    }
    Os.URL = "ui://vcw5trqln0pdw3";
    class Es extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "StaffInfoPanel");
        }
        onConstruct() {
            this.m_StaffInfoBg = this.getChildAt(0), this.m_StaffInfo = this.getChildAt(1);
        }
    }
    Es.URL = "ui://vcw5trqlgwsg2c2";
    class Ms extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "PGameMarket");
        }
        onConstruct() {
            this.m_txx_countdownTime = this.getChildAt(4), this.m_list_Market = this.getChildAt(5),
                this.m_btn_close = this.getChildAt(6), this.m_btn_refresh = this.getChildAt(7);
        }
    }
    Ms.URL = "ui://vcw5trqlb3xq2bc";
    //招聘
    class Bs extends Ue {
        constructor() {
            super(), this._layer = qt.MarketPanel, this._runtimeReplaceWorkName = null;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Bs(), this.m_instance._classDefine = Ms),
                this.m_instance;
        }
        _OnShow() {
            super._OnShow();
            window["StaffMarket"] = this.ui;
            StaffMarket._children[2].text = "Job market";
            StaffMarket._children[3].text = "Refresh after";

            StaffMarket._children[7]._children[2].text = "Refresh";
            StaffMarket._children[7]._children[2].y = 18;
            StaffMarket._children[7]._children[1].x = 28;
            StaffMarket._children[3].x = 160;
            StaffMarket._children[4].x = 340;
            StaffMarket._children[1].width = 380;
            StaffMarket._children[1].x = 120;


            this.ui.m_btn_close.onClick(this, this.Close), this.ui.m_btn_refresh.onClick(this, this.OnWatchAdUpdateStaffInfo),
                this.RenderMarketStaffList(), $.instance.onUI(Mt.RenderMarketStaffList, this, this.RenderMarketStaffList),
                this.isGuide = !Be.IsCompleteAllGuide, $.instance.on($t.UpdateOnLineTime, this, this.UpdateCountDownTime),
                Ge.trackEvent(Kt.StaffUI);
            // YYGGames.gameBox.visible = false;
        }
        _OnHide() {
            // YYGGames.gameBox.visible = true;
            super._OnHide(), this._runtimeReplaceWorkName = null, $.instance.offUI(Mt.RenderMarketStaffList, this, this.RenderMarketStaffList),
                $.instance.off($t.UpdateOnLineTime, this, this.UpdateCountDownTime);
        }
        RenderMarketStaffList() {
            let t = si.instance.GetMarketEmployeeList();
            this.ui.m_list_Market.itemRenderer = Laya.Handler.create(this, (e, i) => {
                let s = t[e];
                i.m_loader_character.url = Se.GetEmployeeSprite(s),
                    i.m_name.text = s.Name,
                    i.m_name.fontSize = 22,
                    i.m_starNum.fillAmount = s.Level / 4,
                    i.m_sex.selectedIndex = 0 == s.Gender ? 0 : 1, i.m_skill.selectedIndex = 0 == s.Skill.length ? 0 : 1,
                    i.m_btn_staffBuy.m_text_price.text = s.Price.toString(),
                    i.m_btn_staffBuy.m_text_guyong.text = "Hire",
                    console.error(i.m_btn_staffBuy.m_text_guyong.y);
                i.m_btn_staffBuy.m_text_guyong.y = 16;
                i.getChild("n43").fontSize = 26;
                i.getChild("n43").text = "This man has no special skills"
                console.log(i.getChild("n43").x);
                if (i.getChild("n43").x == 307) {
                    i.getChild("n43").x = 355;
                } else if (true) {

                }


                console.log(i.getChild("n43").x)
                s.Skill && s.Skill.length > 0 && (i.m_skillList.itemRenderer = Laya.Handler.create(this, (t, e) => {
                    let i = s.Skill[t];
                    e.m_Title.text = i.Title;


                    // if (i.Desc = "这个人什么特长也没有") {
                    //     i.Desc = "这个人什么特长也没有.";
                    // }
                    e.m_text_desc.text = i.Desc;
                    e.m_sprite.url = Se.GetIconSprite(i.Type);
                }, null, !1), i.m_skillList.numItems = s.Skill.length);
                let a = si.ContainEmployee(s, si.instance.Data.staffList);
                i.m_cutBtn.selectedIndex = a ? 2 : 1, a ? i.m_btn_staffBuy.offClick(this, this.AddStaff) : s.Price <= si.instance.Data.money ? (i.m_btn_staffBuy.grayed = !1,
                    i.m_btn_staffBuy.touchable = !0, i.m_btn_staffBuy.onClick(this, this.AddStaff, [e])) : (i.m_btn_staffBuy.grayed = !0,
                        i.m_btn_staffBuy.touchable = !1);
            }, null, !1), this.ui.m_list_Market.numItems = t.length;
        }
        Close() {
            this.isGuide && $.instance.eventUI(Mt.GuideToNext), Ve.instance.setUIState([{
                typeIndex: Zt.StaffMarket,
                state: !1
            }], !1);
        }
        AddStaff(t) {
            let e = this._runtimeReplaceWorkName;
            this._runtimeReplaceWorkName = si.instance.GetMarketEmployeeList()[t].Name, $.instance.eventUI(Mt.AddStaff, [t, e]);
        }
        SetReplaceWorkerName(t) {
            this._runtimeReplaceWorkName = t;
        }
        OnWatchAdUpdateStaffInfo() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), si.instance.UpdateMarketList(), Ge.trackEvent(Kt.MarkertAD), this.isShow && this.RenderMarketStaffList();
            })
        }
        UpdateCountDownTime() {
            this.ui.m_txx_countdownTime.text = pt.ToTimeString(si.data.workMarketTime);
        }
    }
    class Gs extends Ue {
        constructor() {
            super(), this._layer = qt.StaffInfoPanel;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Gs(), this.m_instance._classDefine = Es),
                this.m_instance;
        }
        get staff() {
            return this.ui.m_StaffInfo;
        }
        _OnShow() {
            window["StaffInfoPanel"] = this.staff;
            console.error("StaffInfoPanelllllllll标记");
            super._OnShow(), this.ui.m_StaffInfoBg.onClick(this, this.Close);
            this.staff.getChild("n43")._displayObject.bold = false;
            this.staff.getChild("name")._displayObject.bold = false;
            this.staff.getChild("btn_staffReplace").getChild("n52").bold = false;
            this.staff.getChild("btn_staffReplace").getChild("n52").y = 15;
            StaffInfoPanel._children[6].width = 200;
            StaffInfoPanel._children[6].fontSize = 24;
            StaffInfoPanel._children[10]._children[2].text = "Replace";
            StaffInfoPanel._children[10]._children[2].x = 55;

            Laya.timer.frameOnce(1, this, () => {
                StaffInfoPanel.getChild("n43").fontSize = 22;

            })
        }
        _OnHide() {
            super._OnHide(), this._runtimeData = null;
        }
        InitPanel(t) {
            this.staff.m_name.text = t.Name,
                this.staff.m_starNum.fillAmount = t.Level / 4,
                this.staff.m_cutBtn.selectedIndex = 0,
                this.staff.m_loader_character.url = Se.GetEmployeeSprite(t),
                this.staff.m_sex.selectedIndex = 0 == t.Gender ? 0 : 1,
                this.staff.m_skill.selectedIndex = t.Skill && t.Skill.length > 0 ? 1 : 0,
                1 == this.staff.m_skill.selectedIndex && (
                    this.staff.m_skillList.itemRenderer = Laya.Handler.create(this, (e, i) => {
                        let s = t.Skill[e];
                        // if (s.Icon == "The Url For The Icon") {
                        //     s.Icon = "";
                        // }
                        i.m_sprite.url = s.Icon,
                            console.log(s.Icon);
                        i.m_Title.text = s.Title;
                        console.log("s.Desc:" + s.Desc);
                        if (s.Desc == "这个人什么特长也没有.") {
                            s.Desc = "This man has no special skills";
                        }
                        i.m_text_desc.text = s.Desc;
                    }, null, !1), this.staff.m_skillList.numItems = t.Skill.length),


                this.staff.m_btn_staffReplace.onClick(this, this.OpenMarketPanel);

            if (this.staff.getChild("n43").text == "这个人什么特长也没有") {
                this.staff.getChild("n43").text = "This man has no special skills"
            }
        }
        ShowPanel(t) {
            Ve.instance.setUIState([{
                typeIndex: Zt.StaffInfoPanel,
                state: !0
            }], !1), this._runtimeData = t, this.InitPanel(t);
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.StaffInfoPanel,
                state: !1
            }], !1);
        }
        OpenMarketPanel() {
            let t = this._runtimeData.Name;
            Ve.instance.setUIState([{
                typeIndex: Zt.StaffInfoPanel,
                state: !1
            }, {
                typeIndex: Zt.StaffMarket,
                state: !0
            }], !1), Bs.instance.SetReplaceWorkerName(t);
        }
    }
    class Ns extends Ue {
        constructor() {
            super(), this.isGuide = !1, this._layer = qt.ToiletPanel, this._currentSelectSlotIndex = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ns(), this.m_instance._classDefine = Os),
                this.m_instance;
        }
        get _currBuilding() {
            return Ui.instance.building;
        }
        get midPanel() {
            return this.ui.m_midPanel;
        }
        Close() {

            this.isGuide && ($.instance.eventUI(Mt.GuideToNext), console.log("Close Next Guide"));
            Ve.instance.setUIState([{
                typeIndex: Zt.Staff,
                state: !1
            }], !1);
        }
        GuideClose() {
            Ve.instance.setUIState([{
                typeIndex: Zt.Staff,
                state: !1
            }], !1);
        }
        get _runtimeSelectedSlot() {
            return this._currBuilding.slots[this._currentSelectSlotIndex];
        }
        _OnShow() {
            super.Show();
            window["Staff"] = this.ui;
            let Staff = this.ui;
            Staff._children[1]._children[1].text = "Upgrade";
            Staff._children[2]._children[1].text = "Employee";
            Staff.m_midPanel._children[10].text = "Upgrade";
            Staff.m_midPanel._children[10]._children[1].x = 68;
            Staff.m_midPanel._children[10]._children[1].y = 20;
            Staff.m_midPanel._children[10]._children[2].y = 53;
            Staff.m_midPanel._children[10]._children[2].x = 110;
            Staff.m_midPanel._children[10]._children[3].y = 48;
            Staff.m_midPanel._children[10]._children[3].x = 42;
            Staff._children[4]._children[19].text = "Total water consumption";
            Staff._children[4]._children[19].y = 16;

            Staff.m_midPanel._children[11].text = "Buy";
            Staff.m_midPanel.getChild("text_mid_title").y = 20;
            Staff.m_midPanel.getChild("text_mid_title_desc").x = 158;
            Staff.m_midPanel.getChild("txt_needWater").text = "Water shortage";
            Staff.m_midPanel.m_text_mid_title_desc.fontSize = 22;
            Staff.m_midPanel.m_text_mid_title.fontSize = 25;
            Staff.m_midPanel.m_text_mid_title.width = 700;

            YYGGames.gameBox.visible = false;
            this.ui.m_close.onClick(this, this.Close), this.UpdateTitle(), this.ShowStaffOptionPanel(),
                this.UpdateTopPanel(), this.RenderSlotList(), this.midPanel.m_btn_up.onClick(this, this.OnClickUpdateBtn),
                this.midPanel.m_btn_buy.onClick(this, this.OnClickUpdateBtn), $.instance.onUI(Mt.UpdateSlotComplete, this, this.OnUpdateSlotComplete),
                $.instance.onUI(Mt.RenderMarketStaffList, this, this.RenderStaffList), $.instance.onUI(Mt.ShowCleanRoomStaff, this, this.ShowCleanRoomStaff),
                this.isGuide = !Be.IsCompleteAllGuide, this.ui.m_btn_employee.on(Laya.Event.CLICK, this, () => {
                    this.isGuide && $.instance.eventUI(Mt.GuideToNext);
                }), Be.IsCompleteAllGuide && this._currBuilding.OnClick();
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            this._currentSelectSlotIndex = 0, super.Hide(), $.instance.offUI(Mt.UpdateSlotComplete, this, this.RenderSlotList),
                $.instance.offUI(Mt.RenderMarketStaffList, this, this.RenderStaffList), Be.IsCompleteAllGuide && this._currBuilding.OffClick();
        }
        OnUpdateSlotComplete() {
            this.RenderSlotList(), this.UpdateTopPanel();
        }
        RenderSlotList() {
            if (!this._currBuilding) throw new we("当前所选建筑为空");
            {
                let t = this._currBuilding.slots;
                if (t && t.length > 0) {
                    let e = new fgui.Margin();
                    if (e.top = 20, e.left = 20, this.ui.m_slotList.margin = e, this.ui.m_slotList.itemRenderer = Laya.Handler.create(this, (e, i) => {
                        let s = t[e];
                        i.m_image.url = ge.instance.dataList[s.uid].url;
                        let a = ge.instance.dataList[s.uid].maxLevel;
                        i.m_bg.selectedIndex = s.level <= 0 ? 1 : 0, s.level <= 0 ? (i.m_level.selectedIndex = 0,
                            i.m_state.selectedIndex = 0) : s.level < a && (i.m_level.selectedIndex = 1, i.m_state.selectedIndex = 1,
                                i.m_levelLable.m_title.text = s.level.toString()), s.level >= a && (i.m_level.selectedIndex = 2,
                                    i.m_state.selectedIndex = 2), s.isBreaking && (i.m_state.selectedIndex = 3), i.offClick(this, this.SlotListButtonEvent),
                            i.onClick(this, this.SlotListButtonEvent, [e]);
                    }, null, !1), this._currBuilding.functionID == Nt.MalePee) {
                        let t = Je.instance.GetBuildDataByName(Gt.maleToilet).count;
                        this.ui.m_slotList.numItems = 2 * t;
                    } else this.ui.m_slotList.numItems = t.length;
                } else console.error("建筑slot数据为空：", this._currBuilding);
            }
            this._currentSelectSlotIndex < 0 && (this._currentSelectSlotIndex = 0), this.UpdateMidPanel(this._currentSelectSlotIndex);
        }
        SlotListButtonEvent(t) {
            this.UpdateMidPanel(t), this.isGuide && $.instance.eventUI(Mt.GuideToNext);
        }
        ShowStaffOptionPanel() {
            this.ui.m_cleanRoomSwitch.selectedIndex = this._currBuilding.functionID == Nt.CleanRoom ? 1 : 0,
                1 == this.ui.m_cleanRoomSwitch.selectedIndex && this.RenderStaffList();
        }
        RenderStaffList() {
            let t = si.instance.Data.staffList, e = si.instance.Data.staffSize;
            this.ui.m_staffList.itemRenderer = Laya.Handler.create(this, (i, s) => {
                if (i < e) {
                    let e = t[i];
                    e ? (s.m_state.selectedIndex = 0 == e.Gender ? 1 : 2,

                        s.m_Titile.text = e.Name, s.m_Titile.width = 200, s.m_Titile.fontSize = 20, s.m_Titile.color = "#FFFFFF",
                        s.m_img_starNum.fillAmount = e.Level / 4, e.Skill && e.Skill.length > 0 && (s.m_list_skillicon.itemRenderer = Laya.Handler.create(this, (t, i) => {
                            i.m_sprite.url = Se.GetIconSprite(e.Skill[t].Type);
                        }, null, !1), s.m_list_skillicon.numItems = e.Skill.length), s.m_sprite.url = Se.GetEmployeeSprite(e),
                        s.m_sprite.onClick(this, this.OpenStaffInfoPanel, [e])) : (s.m_state.selectedIndex = 3,
                            s.m_Titile.text = "", s.m_btn_AddStaff.onClick(this, this.OpenStaffMarket, ["Open"])),
                        s.m_btn_AD.offClick(this, this.OnWatchADAddStaffPosNum);
                } else s.m_state.selectedIndex = 0, s.m_Titile.text = "Expand", console.log("注册事件"),
                    s.m_btn_AD.onClick(this, this.OnWatchADAddStaffPosNum);
            }, null, !1), this.ui.m_staffList.numItems = 8;
        }
        OnWatchADAddStaffPosNum() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), si.instance.AddStaffPosNum(), Ge.trackEvent(Kt.AddStaffPosition),
                    this.isShow && this.RenderStaffList();
            })
        }
        OpenStaffMarket() {
            Ve.instance.setUIState([{
                typeIndex: Zt.StaffMarket,
                state: !0
            }], !1), this.isGuide && $.instance.eventUI(Mt.GuideToNext);
        }
        OpenStaffInfoPanel(t) {
            Gs.instance.ShowPanel(t);
        }
        UpdateMidPanel(t) {
            this.midPanel.m_txt_needWater.visible = !1, this._currentSelectSlotIndex = t;
            let e = this._currBuilding.slots, i = e[t];
            if (null == i) throw {
                one: e,
                two: t
            };
            let s = i.level;
            if (null == s) throw i;
            let a = i.uid, n = ge.instance.dataList[a].maxLevel;
            this.ui.m_midPanel.m_picture.url = ge.instance.dataList[a].url, this.midPanel.m_leftLevel.text = s.toString(),
                this.midPanel.m_levelProgress.text = s.toString() + "/" + n.toString(), this.midPanel.m_levelSlider.fillAmount = s / n;
            let o = pe.instance.GetSlotConfigByUID(a), r = 0 == s ? 1 : s + 1, l = o[r = r > n ? n : r], h = o[s];
            if (h || l ? (h = h || {}, l = l || {}, this.UpdateBuffStateShow(s, r, h, l)) : console.error("获取设备等级相关信息失败！", e),
                this.midPanel.m_btn_up.grayed = !1, this.midPanel.m_btn_up.touchable = !0, l) if (this.midPanel.m_text_mid_title.text = l.Name,
                    this.midPanel.m_text_mid_title_desc.text = l.Describe, s >= n) this.midPanel.m_upState.selectedIndex = 2; else if (l.updateCostCoin) {
                        this.midPanel.m_upState.selectedIndex = 0,

                            this.midPanel.m_btn_up.m_text_upCast.text = qe.DoConverter(l.updateCostCoin),
                            this.midPanel.m_btn_up.m_text_upCast.x = 105,
                            console.error("this.midPanel.m_btn_up.m_text_upCast.x:" + this.midPanel.m_btn_up.m_text_upCast.x);
                        Laya.timer.frameOnce(1, this, () => {
                            this.midPanel.m_btn_up.m_text_upCast.x = 105;
                        })
                        setTimeout(() => {
                            console.error("this.midPanel.m_btn_up.m_text_upCast.x:" + this.midPanel.m_btn_up.m_text_upCast.x);
                        }, 0.5e3);


                        this.midPanel.m_btn_up.grayed = si.Money < l.updateCostCoin, this.midPanel.m_btn_up.touchable = si.Money >= l.updateCostCoin,
                            si.MaxWater - (si.Water - (h.updateCostWater ? h.updateCostWater : 0) + (l.updateCostWater ? l.updateCostWater : 0)) < 0 && this.midPanel.m_btn_up.touchable && this._currBuilding.functionID != Nt.WaterRoom && (this.midPanel.m_btn_up.grayed = !0,
                                this.midPanel.m_btn_up.touchable = !1, this.midPanel.m_txt_needWater.visible = !0);
                    } else l.updataCostDiamond ? (this.midPanel.m_upState.selectedIndex = 1, this.midPanel.m_btn_buy.m_text_price.text = l.updataCostDiamond.toString(),
                        this.midPanel.m_btn_buy.m_btn_bg.grayed = si.Diamond < l.updataCostDiamond, this.midPanel.m_btn_buy.touchable = si.Diamond >= l.updataCostDiamond) : console.error("配置表单元格名字错误，检查", i.name, l);
            t == this._currentSelectSlotIndex && this.midPanel.m_btn_up.touchable && (i.isBreaking ? (this.midPanel.m_btn_up.grayed = !0,
                this.midPanel.m_btn_up.touchable = !1) : (this.midPanel.m_btn_up.grayed = !1, this.midPanel.m_btn_up.touchable = !0));


            Staff.m_midPanel.getChild("text_mid_title").y = 20;
            Staff.m_midPanel.getChild("text_mid_title_desc").x = 158;
            Staff.m_midPanel.getChild("txt_needWater").text = "Water shortage";
            Staff.m_midPanel.m_text_mid_title_desc.fontSize = 22;
            Staff.m_midPanel.m_text_mid_title.fontSize = 25;
            Staff.m_midPanel.m_text_mid_title.width = 700;
            Staff.m_midPanel._children[13].valign = "middle";

            this.midPanel.m_btn_up._c
        }
        UpdateBuffStateShow(t, e, i, s) {
            if (i.updateCostWater || s.updateCostWater) {
                this.midPanel.m_group_water.visible = !0, this.midPanel.m_text_water.text = null != i.updateCostWater ? i.updateCostWater.toString() : "0";
                let a = (null != i.updateCostWater ? i.updateCostWater : 0) - (null != s.updateCostWater ? s.updateCostWater : 0);
                this.UpdateBuffAddState(t, e, this.midPanel.m_text_water_WaterAdd, -a);
            } else this.midPanel.m_group_water.visible = !1;
            null != i.income || null != s.income ? (this.midPanel.m_bottomState.selectedIndex = de.Money,
                this.midPanel.m_text_money.text = null != i.income ? i.income.toString() : "0",
                this.UpdateBuffAddState(t, e, this.midPanel.m_text_money_MoneyAdd, s.income)) : null != i.Buff || null != s.Buff ? (this.midPanel.m_bottomState.selectedIndex = de.time,
                    this.midPanel.m_text_time.text = null != i.Buff ? i.Buff.toString() : "0", this.UpdateBuffAddState(t, e, this.midPanel.m_text_time_timeSub, s.Buff)) : null != i.sweep_time || null != s.sweep_time ? (this.midPanel.m_bottomState.selectedIndex = de.clean,
                        this.midPanel.m_text_clean_Money.text = null != i.sweep_time ? i.sweep_time.toString() : "0",
                        this.UpdateBuffAddState(t, e, this.midPanel.m_text_clean_MoneyAdd, s.sweep_time)) : null != i.length || null != s.length ? (this.midPanel.m_bottomState.selectedIndex = de.queue,
                            this.midPanel.m_text_volume.text = null != i.length ? i.length.toString() : "0",
                            this.UpdateBuffAddState(t, e, this.midPanel.m_text_volume_volumeAdd, s.length)) : null != i.water_add || null != s.water_add ? (this.midPanel.m_group_water.visible = !0,
                                this.midPanel.m_text_water_WaterAdd.visible = !1, this.midPanel.m_text_water.text = null != i.water_add ? i.water_add.toString() : "0",
                                this.midPanel.m_text_money.text = "0", this.midPanel.m_text_money_MoneyAdd.text = "") : null != i.repair_time || null != s.repair_time ? (this.midPanel.m_bottomState.selectedIndex = de.repair,
                                    this.midPanel.m_text_replace_time.text = null != i.repair_time ? i.repair_time.toString() : "0",
                                    this.UpdateBuffAddState(t, e, this.midPanel.m_text_replace_timeSub, s.repair_time)) : (console.log(s.sweep_time),
                                        console.log("尚未完成.."));
        }
        OnClickUpdateBtn() {
            let t = this._runtimeSelectedSlot.uid, e = {
                slotIndex: this._currentSelectSlotIndex,
                building: this._currBuilding,
                uid: t
            };
            $.instance.eventUI(Mt.UpdateSlotData, e), this.isGuide && (console.log("UpdateBtn Next Guide"),
                $.instance.eventUI(Mt.GuideToNext));
        }
        UpdateBuffAddState(t, e, i, s) {
            t < e ? (i.visible = !0, i.text = s >= 0 ? "+" + s.toString() : s.toString()) : i.visible = !1;
        }
        UpdateTopPanel() {
            let t = this._currBuilding, e = this._currBuilding.functionID, i = t.developProgress;
            console.error("----------i" + i);
            i >= 0.99 ? (this.ui.m_topPanel.m_progress.selectedIndex = 1, this.ui.m_topPanel.m_topProgress.value = 100) : (this.ui.m_topPanel.m_progress.selectedIndex = 0,
                this.ui.m_topPanel.m_topProgress.value = 100 * i);
            switch (e) {
                case Nt.MaleToilet:
                case Nt.FemaleToilte:
                case Nt.MalePee:
                case Nt.FemaleSink:
                case Nt.MaleSink:
                case Nt.Library:
                    this.ui.m_topPanel.m_c1.selectedIndex = 0, this.ui.m_topPanel.m_text_top_moneyAdd.text = t.income.toString() + "/min",
                        this.ui.m_topPanel.m_text_top_time.text = t.duration.toString() + "s", this.ui.m_topPanel.m_text_top_water.text = t.wasteWater.toString();
                    break;

                case Nt.CleanRoom:
                    let s = t;
                    this.ui.m_topPanel.m_c1.selectedIndex = 1, this.ui.m_topPanel.m_text_top_repairTime.text = s.cleanTime.toString(),
                        this.ui.m_topPanel.m_text_top_cleanTime.text = s.sweepTime.toString(), this.ui.m_topPanel.m_text_top_stuffNum.text = s.staffNum.toString();
                    break;

                case Nt.WaterRoom:
                    this.ui.m_topPanel.m_c1.selectedIndex = 2, this.ui.m_topPanel.m_text_top_expendWater.text = t.waterAdd.toString();
                    break;

                case Nt.WaitAera:
                    this.ui.m_topPanel.m_c1.selectedIndex = 3;
                    let a = t;
                    this.ui.m_topPanel.m_text_top_ridership.text = a.flow.toString(), this.ui.m_topPanel.m_text_top_queueMan.text = a.maleQueueLength.toString(),
                        this.ui.m_topPanel.m_text_top_queueWoman.text = a.femaleQueueLength.toString(),
                        this.ui.m_topPanel.m_text_top_queuePee.text = a.peeQueueLength.toString();
                    break;

                default:
                    console.error("尚未此建筑设置更新统计显示!", e);
            }
        }
        UpdateTitle() {
            this.ui.m_top_Title.text = this._currBuilding.title;
            if (this.ui.m_top_Title.text == "清洁室") {
                this.ui.m_top_Title.text = "Clean room";
            } else if (this.ui.m_top_Title.text == "等候区") {
                this.ui.m_top_Title.text = "Waiting area";
            } else if (this.ui.m_top_Title.text == "水循环处理室") {
                this.ui.m_top_Title.text = "Water recycling treatment room";
            } else if (this.ui.m_top_Title.text == "小便区（男）") {
                this.ui.m_top_Title.text = "Urinal area (male)";
            }
            // else if (this.ui.m_top_Title.text == "等候区") {
            //     this.ui.m_top_Title.text = "Waiting area";
            // }
        }
        ShowCleanRoomStaff() {
            this.ui.m_stuffSwitch.selectedIndex = 1, this.ui.m_cleanRoomSwitch.selectedIndex = 1;
        }
    }
    !function (t) {
        t[t.Money = 0] = "Money", t[t.time = 1] = "time", t[t.clean = 2] = "clean", t[t.repair = 3] = "repair",
            t[t.queue = 4] = "queue", t[t.women = 5] = "women", t[t.pee = 6] = "pee", t[t.man = 7] = "man";
    }(de || (de = {}));
    class Fs {
        constructor() {
            this.breakPoint = 0, this.isGuideState = !1, this.allowDelay = !1, this.data = Be.instance.Data;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Fs()), this.m_instance;
        }
        StartGuide() {
            if (He.instance.enabled = !1, $.instance.onUI(Mt.GuideToNext, this, this.ToNext),
                $.instance.onUI(Mt.GuideToEnd, this, this.EndGuide), is.instance.PopNetRed(), 0 == this.data.isCompleteGuide1) this.data.guideID = 0,
                    this.data.isCompleteGuide1 = !0, Be.instance.SaveData(); else if (0 == this.data.isCompleteGuide2) this.data.guideID = 19,
                        this.data.isCompleteGuide2 = !0, Be.instance.SaveData(); else if (0 == this.data.isCompleteGuide3) this.data.guideID = 36,
                            this.data.isCompleteGuide3 = !0, Be.instance.SaveData(); else {
                if (0 != this.data.isCompleteGuide4) return this.data.isCompleteGuide5 = !0, Be.instance.SaveData(),
                    void this.EndGuide();
                this.data.guideID = 43, this.data.isCompleteGuide4 = !0, Be.instance.SaveData();
            }
            this.OpenGuide();
        }
        EndGuide() {
            console.log("完成所有引导关闭所有监听"), $.instance.offUI(Mt.GuideToNext, this, this.ToNext),
                $.instance.offUI(Mt.GuideToEnd, this, this.EndGuide), this.Close(), this.data.isCompleteGuide5 = !0,
                Be.instance.SaveData(), is.instance.StartPop(), Ve.instance.setUIState([{
                    typeIndex: Zt.CountDownTime,
                    state: !0
                }], !1), He.instance.enabled = !0, os.instance.ShowRecordBtn(!0), $.instance.event3D(L.OnUpdateSlotComplete),
                Ge.trackEvent(Kt.GuideProgress, {
                    progress: "end"
                }), Ge.trackEvent(Kt.GuideEnd);
        }
        get guideID() {
            return this.data.guideID;
        }
        set guideID(t) {
            this.data.guideID = t;
        }
        OpenGuide() {
            if (this.ShowPanel(Zt.Guide), Rs.instance.isShow) {
                if (console.log("引导" + this.guideID), !(this.guideID > 68)) {
                    switch (this.guideID) {
                        case 27:
                            Ge.trackEvent(Kt.GuideProgress, {
                                progress: "UpdateGuestFlow"
                            });
                            break;

                        case 35:
                            Ge.trackEvent(Kt.GuideProgress, {
                                progress: "BuildMaleToilet"
                            });
                    }
                    switch (this.guideID) {
                        case 0:
                            is.instance.PopGuideUncle();
                            break;

                        case 3:
                            He.instance.enabled = !0;
                            let t = ts.instance.transform.position.clone();
                            t.x = -t.x, He.instance.FocusPosition(t, !1, Laya.Handler.create(this, () => {
                                ts.instance.Start();
                            }));
                            break;

                        case 4:
                            He.instance.enabled = !1;
                            break;

                        case 7:
                            this.PlayIndicate(78787, he.maleToilet_1);
                            break;

                        case 8:
                            YYGGames.showInterstitial(()=>{
                                Le.ClearAll(78787), Ui.instance.ShowRoom(Nt.MaleToilet);
                            })
     
                            break;

                        case 17:
                            ts.instance.Continue();
                            break;

                        case 18:
                        case 19:
                            break;
                        case 20:
                            YYGGames.showInterstitial(()=>{
                                Ui.instance.ShowRoom(Nt.MaleSink);
                            })
               
                            break;

                        case 24:

                            this.PlayIndicate(242424, he.waitArea), this.CameraNavigation(he.waitArea);
                            break;

                        case 25:
                            YYGGames.showInterstitial(()=>{
                                Le.ClearAll(242424), Ui.instance.ShowRoom(Nt.WaitAera);
                            })
       
                            break;

                        case 29:
                            this.CameraNavigation(he.NetRed);
                            break;

                        case 30:
                            this.PlayIndicate(30303, he.NetRed);
                            break;

                        case 31:
                            Le.ClearAll(30303), this.ShowPanel(Zt.UIMediatorInfluencer);
                            break;
                        case 33:
                            this.CameraNavigation(he.maleBlock_3), this.PlayIndicate(333333, he.maleBlock_3);
                            break;

                        case 34:
                            YYGGames.showInterstitial(() => {
                                Le.ClearAll(333333), this.ShowPanel(Zt.Manager);
                            })
                            break;
                        case 35:
                            break;

                        case 36:
                            this.ShowPanel(Zt.DailySign);
                            break;

                        case 40:
                            this.ShowPanel(Zt.AD);
                            break;

                        case 43:
                            this.PlayIndicate(434343, he.cleanRoom), this.CameraNavigation(he.cleanRoom);
                            break;

                        case 44:
                            YYGGames.showInterstitial(()=>{
                                Le.ClearAll(434343), Ui.instance.ShowRoom(Nt.CleanRoom);
                            })
                         
                            break;

                        case 51:
                            return void this.Close();
                        case 52:
                            Ns.instance.isShow && Ns.instance.GuideClose(), this.CameraNavigation(he.maleToilet_1);
                            break; z

                        case 53:
                            YYGGames.showInterstitial(()=>{
                                Ui.instance.ShowRoom(Nt.MaleToilet);
                            })
                  

                            break;

                        case 62:

                            Ns.instance.isShow && Ns.instance.GuideClose(), this.PlayIndicate(636363, he.waterRoom),
                                this.CameraNavigation(he.waterRoom);
                            break;

                        case 63:
                            break;

                        case 64:

                        YYGGames.showInterstitial(()=>{
                            Le.ClearAll(636363), Ui.instance.ShowRoom(Nt.WaterRoom);
                        })
      

                            break;

                        case 66:
                            Ns.instance.isShow && Ns.instance.GuideClose();
                            break;

                        case 68:
                            this.ShowPanel(Zt.Task);
                    }
                    Rs.instance.NextPanel(this.guideID);
                }
            } else console.log("打开面板失败");
        }
        CameraNavigation(t) {
            He.instance.enabled = !0, He.instance.FocusPositionByIndex(t), Laya.timer.once(500, this, () => He.instance.enabled = !1);
        }
        ToNext(t = null) {

            this.guideID = this.guideID + 1,
                console.error("guideID:" + this.guideID);
            null != t && (this.guideID = 5), 19 == this.guideID ? this.data.isCompleteGuide2 = !0
                : 36 == this.guideID ? this.data.isCompleteGuide3 = !0 : 43 == this.guideID && (this.data.isCompleteGuide4 = !0),
                Be.instance.SaveData(), this.OpenGuide();
        }
        ShowPanel(t) {
            t == Zt.Guide && Rs.instance.isShow || Ve.instance.setUIState([{
                typeIndex: t,
                state: !0
            }], !1);
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.Guide,
                state: !1
            }], !1), Rs.instance.isShow && Rs.instance.Hide(), console.log("关闭引导面板");
        }
        PlayIndicate(t, e) {
            let i = Pe.instance.dataList[e], s = new Laya.Vector3(-i.x, i.y, i.z);
            Le.PlayEffect(Ot.ZS, t, 1e4, s);
        }
    }
    !function (t) {
        t.GuideToNext = "GuideToNext";
    }(me || (me = {}));
    class Vs extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameOfflineIncome");
        }
        onConstruct() {
            this.m_btn_close = this.getChildAt(4), this.m_text_money = this.getChildAt(6), this.m_progress = this.getChildAt(8),
                this.m_text_maxTime = this.getChildAt(9), this.m_text_time = this.getChildAt(10),
                this.m_btn_2x = this.getChildAt(12), this.m_btn_1x = this.getChildAt(13);
        }
    }
    Vs.URL = "ui://8nmf3q47jfuc1b1";
    class Ws extends Ue {
        constructor() {
            super(), this._layer = qt.Main, this._money = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ws(), this.m_instance._classDefine = Vs),
                this.m_instance;
        }
        get hasMoney() {
            return this._money > 0;
        }
        TryShowPanel() {
            // new Date().getTime() - si.instance.Data.onLineTime < 3e5 || Ve.instance.setUIState([{
            //     typeIndex: Zt.OffLineIncomePanel,
            //     state: !0
            // }], !1);
        }
        _OnShow() {
            let t = new Date().getTime() - si.instance.Data.onLineTime, e = 60 * si.instance.Data.maxOffLineTime * 60 * 1e3;
            this.ui.m_text_time.text = pt.ToTimeString(t), this.ui.m_text_maxTime.text = "Max " + si.instance.Data.maxOffLineTime + " hours";
            let i = t > e ? e : t;
            this.ui.m_progress.value = i, this.ui.m_progress.max = e, this._money = Xe.instance.GetTotalMoney(),
                this._money = this._money * i / 1e3 / 60, this.ui.m_text_money.text = qe.DoConverter(this._money),
                this.ui.m_btn_1x.onClick(this, this.OnClick1x), this.ui.m_btn_2x.onClick(this, this.OnClick2x),
                this.ui.m_btn_close.onClick(this, this.OnClickClose);
        }
        OnClick1x() {
            this.AddMoney();
        }
        OnClick2x() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), this.AddMoney(!0);
            })
        }
        AddMoney(t = !1) {
            t && (this._money += this._money), si.Money += this._money, this.isShow && Ui.PlayMoneyEffect(this.ui.m_text_money),
                this._money = 0, this.OnClickClose();
        }
        OnClickClose() {
            Ve.instance.setUIState([{
                typeIndex: Zt.OffLineIncomePanel,
                state: !1
            }], !1);
        }
    }
    class js {
        Init(t, e) {
            if (null == t || null == e) throw new we();
            let i = Ct.instance.camera;
            this._prefabs = e, Ri.instance.SetPrefabs(e), this.InitVendingMachine(), i.addComponent(Le).InitAllPrefabs(),
                ks.instance.InitBlockAnimator(this._prefabs[Rt.prefab5.Male_wall][0], this._prefabs[Rt.prefab5.Female_wall][0]),
                this._buildManager = i.addComponent(Xe), this._buildManager.SetPrefabs(e);
            let s = i.addComponent(is);
            pe.instance.initData(), i.addComponent(He).Init(this._prefabs[Rt.prefab5.Limit][0]),
                Ui.instance.Init(), _e.instance.init(), ee.NetMap.instance.InitData(Gt.MapRoot),
                s.SetParentNode(t), s.InitPool(e[Rt.prefab5.Entrance], e[Rt.prefab5.Exit]), Be.IsCompleteAllGuide && s.StartPop(),
                Xi.instance.InitTask(), this.InitBuildings(hs, Rt.prefab0.Toilet, _i.data.list),
                this.InitBuildings(ls, Rt.prefab0.FamaleSink, [di.instance.femaleSinkData]), this.InitBuildings(ls, Rt.prefab0.MaleSink, [di.instance.maleSinkData]),
                this.InitBuildings(rs, Rt.prefab5.CleanRoom, [li.instance.data.list]), this.InitBuildings(cs, Rt.prefab0.WaitAera, [fi.instance.data.list]),
                this.InitBuildings(ds, Rt.prefab0.PeeArea, [ji.instance.data.list]), this.InitBuildings(bs, Rt.prefab0.Library, [xs.instance.data.list]),
                this.InitBuildings(vs, Rt.prefab0.Canteen, [Ps.instance.data.list]), this.InitBuildings(Ds, Rt.prefab0.WaterRoom, [Gi.instance.data.list]),
                $.instance.event3D(L.SceneLoadComplete), this.InitGuide(), ei.instance.Start();
            // Laya.timer.once(200, this, () => {
            //     this.ShowDailyPanel(), 
            //     // this.ShowOfflineIncomePanel(), 
            //     this.ShowCountDownTime();
            // }),

            Is.PlayAudio(), Be.IsCompleteAllGuide && si.instance.UpdateIncomeMin();
        }
        GetSpriteByName(t, e) {
            if (null == t || null == e || 0 == e.length) return null;
            for (const i of e) if (i.name == t) return i;
        }
        InitBuildings(t, e, i) {
            let s = this._prefabs[e];
            if (null == s || s.length <= 0) console.warn("场景中没有", e, ",跳过此项初始化"); else {
                if (!(i && i.length > 0)) throw new we(e + "数据为null");
                for (let a of i) {
                    let i = this.GetSpriteByName(a.name, s);
                    if (i) {
                        let e = i.addComponent(t);
                        e.InitBuilding(a, !1), this._buildManager.AddBuild(e, a.functionID);
                    } else console.warn("添加脚本失败,预制体名字", e, ",建筑名字:", a.name, "预制体数组:", s);
                }
            }
        }
        InitVendingMachine() {
            this._prefabs[Rt.prefab5.VendingMachine][0].addComponent(ms);
        }
        InitGuide() {
            Be.IsCompleteAllGuide ? console.log("引导完成", Be.IsCompleteAllGuide) : (console.log("开始引导"),
                Ge.trackEvent(Kt.GuideStart), Fs.instance.StartGuide());
        }
        ShowOfflineIncomePanel() {
            Be.IsCompleteAllGuide && Ws.instance.TryShowPanel();
        }
        ShowDailyPanel() {
            Be.IsCompleteAllGuide && (si.data.hasSign || Ve.instance.setUIState([{
                typeIndex: Zt.DailySign,
                state: !0
            }], !1));
        }
        ShowCountDownTime() {
            Be.IsCompleteAllGuide && Ve.instance.setUIState([{
                typeIndex: Zt.CountDownTime,
                state: !0
            }], !1);
        }
    }
    class Hs {
        constructor() {
            this.m_ifInit = !1, this.m_otherScene = {};
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Hs()), this.m_instance;
        }
        get ifSceneBuild() {
            return this.m_ifSceneBuild;
        }
        init() {
            this.m_ifSceneBuild = !1, ht.initCustoms(T.instance.getLevelNumber()), $.instance.on3D(L.GameLevelsBuild, this, this.gameLevelsBuild),
                $.instance.on3D(L.GameLevelsDelete, this, this.gameLevelsDelete), $.instance.on3D(L.GameOtherLevelsBuild, this, this.gameOtherLevelsBuild),
                $.instance.on3D(L.GameOtherLevelsDelete, this, this.gameOtherLevelsDelete);
        }
        initLevelBuild() {
            this.gameLevelsBuild();
        }
        gameLevelsBuild(t) {
            if (this.m_ifSceneBuild) return void console.warn("有场景正在构建！");
            let i;
            this.m_ifInit ? i = ht.gameData.onCustoms : (this.m_ifInit = !0, i = ht.getDefaultCustoms());
            let s = M.instance.getSceneByLv(i);
            this.m_scene = s, this.m_ifSceneBuild = !0, $.instance.event3D(L.GameLevelsBuildBefore),
                $.instance.eventUI(Mt.SceneGameCustomsLoading, [-1]), s.buildScene(Laya.Handler.create(this, this.customsProgress, null, !1)).then(a => {
                    if (this.m_ifSceneBuild = !1, Ct.instance.setEnvironment(this.m_scene.scene), e.addScrCon(s.scene),
                        e.addCommonCon(), B.ifPreloadCustoms) {
                        let t = ht.getPreloadCustoms();
                        M.instance.preloadSceneRes(t);
                    }
                    this.onCustomsInit(i), t && t.run(), new js().Init(s.scene, s.prefabs), $.instance.event3D(L.GameLevelsOnBuild),
                        $.instance.eventUI(Mt.SceneGameCustomsInit);
                });
        }
        onCustomsInit(t) { }
        customsProgress(t) {
            this.m_ifSceneBuild && (void 0 === t && (t = 1), $.instance.eventUI(Mt.SceneGameCustomsLoading, [100 * t]));
        }
        gameLevelsDelete() {
            $.instance.event3D(L.GameLevelsDeleteBefore), this.m_scene && this.m_scene.scene && this.m_scene.clearScene(),
                this.m_scene = null, $.instance.event3D(L.GameLevelsOnDelete), $.instance.eventUI(Mt.SceneGameCustomDelete);
        }
        gameOtherLevelsBuild(t, e) {
            if (this.m_ifSceneBuild) return void console.warn("有场景正在构建！");
            let i = M.instance.getOtherSceneByName(t);
            this.m_otherScene[t] = i, this.m_ifSceneBuild = !0, $.instance.event3D(L.GameLevelsBuildBefore),
                $.instance.eventUI(Mt.SceneGameCustomsLoading, [-1]),
                i.buildScene(Laya.Handler.create(this, this.customsProgress, null, !1)).then(s => {
                    this.m_ifSceneBuild = !1, Ct.instance.setOtherEnvironment(t, s), Et.instance.AllotOtherScenePre(t, i.prefabs),
                        e && e.run();
                });
        }
        gameOtherLevelsDelete(t) {
            let e = this.m_otherScene[t];
            e ? (e.clearScene(), this.m_otherScene[t] = void 0) : console.warn("试图清除不存在的场景！");
        }
    }
    class zs extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameLoading");
        }
        onConstruct() {
            this.m_shade = this.getChildAt(0), this.m_text = this.getChildAt(1), this.m_progress = this.getChildAt(2);
        }
    }
    zs.URL = "ui://kk7g5mmmg7a1o";
    class qs extends Ue {
        constructor() {
            super(), this._layer = qt.Loading;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new qs(), this.m_instance._classDefine = zs),
                this.m_instance;
        }
        _OnShow() {
            $.instance.onGlobal(Yt.GameLoading, this, this.gameLoading);
        }
        gameLoading(t) {
            this.ui.m_progress.value = t;
        }
        _OnHide() {
            $.instance.offGlobal(Yt.GameLoading, this, this.gameLoading);
        }
    }
    class Qs extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGamePlay");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    Qs.URL = "ui://kk7g5mmmg7a1r";
    class Ks extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ks(), this.m_instance._classDefine = Qs),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class Ys extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameStart");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    Ys.URL = "ui://kk7g5mmmg7a1v";
    class Zs extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Zs(), this.m_instance._classDefine = Ys),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class Js extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameCustomsLoading");
        }
        onConstruct() {
            this.m_shade = this.getChildAt(0), this.m_text = this.getChildAt(1), this.m_progress = this.getChildAt(2);
        }
    }
    Js.URL = "ui://kk7g5mmmnsx3ou";
    class Xs extends Ue {
        constructor() {
            super(), this._layer = qt.Loading;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Xs(), this.m_instance._classDefine = Js),
                this.m_instance;
        }
        _OnShow() {
            $.instance.onUI(Mt.SceneGameCustomsLoading, this, this.CustomsLoading);
        }
        CustomsLoading(t) {
            this.ui.m_progress.value = t, 100 == t && Ve.instance.setUIState([{
                typeIndex: Zt.CustomsLoading,
                state: !1
            }], !1);
        }
        _OnHide() {
            $.instance.offUI(Mt.SceneGameCustomsLoading, this, this.CustomsLoading);
        }
    }
    class $s extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGamePause");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    $s.URL = "ui://kk7g5mmm6vcq5g";
    class ta extends Ue {
        constructor() {
            super(), this._layer = qt.Pause;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ta(), this.m_instance._classDefine = $s),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class ea extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameSetting");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    ea.URL = "ui://kk7g5mmm6vcq4u";
    class ia extends Ue {
        constructor() {
            super(), this._layer = qt.Set;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new ia(), this.m_instance._classDefine = ea),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class sa extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameCom");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    sa.URL = "ui://kk7g5mmmq3ng9w";
    class aa extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new aa(), this.m_instance._classDefine = sa),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class na extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameEnd");
        }
        onConstruct() {
            this.m_text = this.getChildAt(0);
        }
    }
    na.URL = "ui://kk7g5mmmlaxd19";
    class oa extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new oa(), this.m_instance._classDefine = na),
                this.m_instance;
        }
        _OnShow() { }
        _OnHide() { }
    }
    class ra extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameTestMain");
        }
        onConstruct() {
            this.m_test = this.getChildAt(0), this.m_testText = this.getChildAt(1), this.m__test = this.getChildAt(2);
        }
    }
    ra.URL = "ui://kk7g5mmmo9js9x";
    class la extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new la(), this.m_instance._classDefine = ra),
                this.m_instance;
        }
        _OnShow() {
            this.ui.m_test.onClick(this, this.Test);
        }
        Test() {
            Ve.instance.setUIState([{
                typeIndex: Zt.TestPlatform
            }], !1);
        }
        _OnHide() { }
    }
    class ha {
        constructor() {
            this.appId = "", this.appKey = "", this.bannerId = "", this.rewardVideoId = "",
                this.interstitialId = "", this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [],
                this.nativeinterstitialIds = [], this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class ca extends ha {
        constructor() {
            super(...arguments), this.appId = "", this.appKey = "", this.bannerId = "", this.rewardVideoId = "",
                this.interstitialId = "", this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [],
                this.nativeinterstitialIds = [], this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class da extends ha {
        constructor() {
            super(...arguments), this.appId = "", this.appKey = "", this.bannerId = "", this.rewardVideoId = "",
                this.interstitialId = "", this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [],
                this.nativeinterstitialIds = [], this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class ma extends ha {
        constructor() {
            super(...arguments), this.appId = "", this.appKey = "", this.bannerId = "", this.rewardVideoId = "",
                this.interstitialId = "", this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [],
                this.nativeinterstitialIds = [], this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class ua extends ha {
        constructor() {
            super(...arguments), this.appId = "", this.appKey = "", this.bannerId = "", this.rewardVideoId = "",
                this.interstitialId = "", this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [],
                this.nativeinterstitialIds = [], this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class _a extends ha {
        constructor() {
            super(...arguments), this.appId = "tt6bd21d6ff4e96e09", this.appKey = "", this.bannerId = "2cm4be1lhe2j98rt00",
                this.rewardVideoId = "15i65j26gjj19l0bca", this.interstitialId = "4b2q73lp8i89nglf7p",
                this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [], this.nativeinterstitialIds = [],
                this.nativeinpageIds = [], this.shareId = "";
        }
    }
    class ga extends ha {
        constructor() {
            super(...arguments), this.appId = "wx3fe7c138d80bcddb", this.appKey = "", this.bannerId = "adunit-5536ac3ed2ab7c7c",
                this.rewardVideoId = "adunit-441ef577c2eb1442", this.interstitialId = "adunit-280c0055a1f9d458",
                this.nativeId = "", this.nativeBannerIds = [], this.nativeIconIds = [], this.nativeinterstitialIds = [],
                this.nativeinpageIds = [], this.shareId = "";
        }
    }
    !function (t) {
        t.PAUSE_AUDIO = "PAUSE_AUDIO", t.RESUM_AUDIO = "RESUM_AUDIO", t.AD_CONFIG_GETTED = "AD_CONFIG_GETTED",
            t.SELF_AD_INITED = "SELF_AD_INITED";
    }(ue || (ue = {}));
    class fa {
        Vibrate(t) {
            console.log("调用震动", t), navigator.vibrate ? t ? navigator.vibrate(400) : navigator.vibrate(15) : console.log("不支持设备震动！");
        }
    }
    class pa extends fa {
        Vibrate(t) {
            console.log("调用震动", t), window.wx && (t ? Laya.timer.callLater(wx, wx.vibrateLong, [null]) : Laya.timer.callLater(wx, wx.vibrateShort, [null]));
        }
    }
    class ya {
        constructor() {
            this.supportRecord = !1, this.isRecording = !1, this.isPausing = !1, this.isRecordSuccess = !1;
        }
        StartRecord(t, e) {
            console.log("该平台" + as.platformStr + "不支持录制视频");
        }
        StopRecord(t) {
            console.log("该平台" + as.platformStr + "不支持录制视频");
        }
        Pause(t) {
            console.log("该平台" + as.platformStr + "不支持录制视频");
        }
        Resume(t) {
            console.log("该平台" + as.platformStr + "不支持录制视频");
        }
        RecordClip(t) {
            console.log("该平台" + as.platformStr + "不支持录制视频");
        }
        ShareVideo(t, e, i) {
            i && i.run();
        }
    }
    class Sa { }
    class Ia {
        constructor() {
            this._shareInfoList = [];
        }
        static get instance() {
            return null == this._instance && (this._instance = new Ia()), this._instance;
        }
        AddShareInfo(t) {
            for (let e of this._shareInfoList) if (e.shareId == t.shareId) return;
            this._shareInfoList.push(t);
        }
        GetShareInfo(t = null) {
            if (0 == this._shareInfoList.length) {
                return new Sa();
            }
            if (null != t) for (let e of this._shareInfoList) if (e.shareId == t) return e;
            return bi.RandomFromArray(this._shareInfoList);
        }
        ShareAppMessage(t) {
            as.instance.PlatformInstance.ShareAppMessage(t, Laya.Handler.create(this, () => {
                console.log("分享成功");
            }), null);
        }
    }
    class Ca {
        constructor() {
            this.platform = oe.WX, this.safeArea = null, this.recordManager = new ya(), this.device = new pa(),
                this.loginCode = null, this.isSupportJumpOther = !0, this._isBannerLoaded = !1,
                this._isVideoLoaded = !1, this._isInterstitialLoaded = !1, this._cacheVideoAD = !1,
                this.NavigateToAppSuccess = null;
        }
        Init(t) {
            this._base = window.wx, null != this._base ? (this.platformData = t, this.recordManager.Platform = this,
                this._InitLauchOption(), this._Login(), this._InitShareInfo(), this._InitSystemInfo(),
                this._CreateBannerAd(), this._CreateVideoAd(), this._CreateInterstitalAd(), window.iplatform = this) : console.error(...s.packError("平台初始化错误", as.platformStr));
        }
        _CheckUpdate() {
            let t = this._base.getUpdateManager();
            null != t && (t.onCheckForUpdate(function (t) {
                console.log("onCheckForUpdate", t.hasUpdate), t.hasUpdate && this._base.showToast({
                    title: "即将有更新请留意"
                });
            }), t.onUpdateReady(() => {
                this._base.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否立即使用？",
                    success: function (e) {
                        e.confirm ? t.applyUpdate() : this._base.showToast({
                            icon: "none",
                            title: "小程序下一次「冷启动」时会使用新版本"
                        });
                    }
                });
            }), t.onUpdateFailed(() => {
                this._base.showToast({
                    title: "更新失败，下次启动继续..."
                });
            }));
        }
        _Login() {
            this.loginState = {
                isLogin: !1,
                code: ""
            };
            let t = {};
            t.success = (t => {
                this.loginCode = t.code, this._OnLoginSuccess(t), console.error(this.loginState);
            }), t.fail = (t => {
                console.error(as.platformStr, "登录失败", t), this.loginState.isLogin = !1, this.loginState.code = "";
            }), t.complete = (() => {
                null != this.onLoginEnd && this.onLoginEnd.run();
            }), this._base.login(t);
        }
        GetStorage(t) {
            if (this.base && this.base.getStorageSync && t) try {
                return this.base.getStorageSync(t);
            } catch (t) {
                return console.log("getStorageSync error: ", JSON.stringify(t)), null;
            }
        }
        SetStorage(t, e) {
            if (this.base && this.base.getStorageSync && t) try {
                return this.base.setStorageSync(t, e);
            } catch (t) {
                console.log("setStorageSync error: ", JSON.stringify(t));
            }
        }
        _OnLoginSuccess(t) {
            console.log(as.platformStr, "登录成功", t), this.loginState.isLogin = !0, this.loginState.code = t.code;
        }
        _InitLauchOption() {
            this._base.onShow(this._OnShow), this._base.onHide(this._OnHide);
            let t = this._base.getLaunchOptionsSync();
            this._OnShow(t);
        }
        _InitShareInfo() {
            this._base.showShareMenu({
                withShareTicket: !0,
                success: t => {
                    console.log("InitShareSuccess", t);
                },
                fail: t => {
                    console.log("InitShareFailed", t);
                },
                complete: t => {
                    console.log("InitShareComplete", t);
                }
            }), this._base.onShareAppMessage(() => {
                let t = Ia.instance.GetShareInfo();
                return Ca._WrapShareInfo(t);
            });
        }
        static _WrapShareInfo(t) {
            let e = {};
            if (t.shareTitle && (e.title = t.shareTitle), t.shareImg && (e.imageUrl = t.shareImg),
                t.sharePath) {
                e.query = {};
                let i = t.sharePath.split("?")[1].split("&");
                for (let t of i) {
                    let i = t.split("=");
                    e.query[i[0]] = i[1];
                }
            }
            return e;
        }
        _InitSystemInfo() {
            this.base = this._base;
            try {
                this.systemInfo = this._base.getSystemInfoSync(), console.log("系统信息已获取", this.systemInfo),
                    this.safeArea = this.systemInfo.safeArea, this._cacheScreenScale = this.systemInfo.screenWidth / Laya.stage.width;
            } catch (t) {
                console.error(t), console.error("获取设备信息失败,执行默认初始化"), this.safeArea = null;
            }
        }
        _CreateInterstitalAd() {
            if (et.IsNullOrEmpty(this.platformData.interstitialId)) return void console.log("无有效的插页广告ID,取消加载");
            this._interstitalFailedCount = 0;
            let t = {};
            t.adUnitId = this.platformData.interstitialId, this._intersitialAd = this._base.createInterstitialAd(t),
                this._intersitialAd && (this._intersitialAd.onLoad(() => {
                    console.log("插页广告加载成功"), this._isInterstitialLoaded = !0;
                }), this._intersitialAd.onError(t => {
                    this._interstitalFailedCount++, console.error("插页广告加载失败", t), this._interstitalFailedCount > 10 && (console.log("第", this._interstitalFailedCount, "次重新加载插页广告"),
                        this._intersitialAd.load());
                }));
        }
        _CreateVideoAd() {
            if (console.log("vedio ad id", this.platformData.rewardVideoId), !this._cacheVideoAD) return void console.log("当前策略为不缓存视频广告");
            let t = this._base.createRewardedVideoAd;
            if (null == t) return void console.error("无createRewardedVideoAd方法,跳过初始化");
            if (et.IsNullOrEmpty(this.platformData.rewardVideoId)) return void console.log("无有效的视频广告ID,取消加载");
            this._videoFailedCount = 0;
            let e = {};
            e.adUnitId = this.platformData.rewardVideoId, this._rewardVideo = t(e), this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功"), this._isVideoLoaded = !0;
            }), this._rewardVideo.onError(t => {
                this._videoFailedCount++, console.error("视频广告加载失败", t), this._videoFailedCount > 10 && (console.log("第", this._videoFailedCount, "次重新加载视频广告"),
                    this._rewardVideo.load());
            }), this._rewardVideo.onClose(t => {
                Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t);
                let e = t.isEnded;
                wi.NextFrame().then(() => {
                    e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
                });
            });
        }
        _CreateBannerAd() {
            if (et.IsNullOrEmpty(this.platformData.bannerId)) return void console.log("无有效的banner广告ID,取消加载");
            let t = this._base.getSystemInfoSync().windowWidth, e = this._base.getSystemInfoSync().windowHeight, i = {};
            i.adUnitId = this.platformData.bannerId, i.adIntervals = 30;
            let s = {
                left: 0,
                top: 0,
                width: 300
            };
            i.style = s, this._bannerAd = this._base.createBannerAd(i), this._isBannerLoaded = !1,
                this._bannerAd.onLoad(() => {
                    console.log("banner加载成功"), this._isBannerLoaded = !0, this._bannerAd.style.top = e - this._bannerAd.style.realHeight,
                        this._bannerAd.style.left = (t - this._bannerAd.style.realWidth) / 2;
                }), this._bannerAd.onError(t => {
                    console.error("banner广告加载失败", t);
                });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return this._isInterstitialLoaded;
        }
        ShowBannerAd() {
            this.IsBannerAvaliable() && this._bannerAd.show();
        }
        HideBannerAd() {
            this._bannerAd.hide();
        }
        _DoCacheShowVideo(t, e) {
            this._isVideoLoaded ? (this._rewardSuccessed = t, this._rewardSkipped = e, this._isVideoLoaded = !1,
                Laya.stage.event(ue.PAUSE_AUDIO), this._rewardVideo.show()) : console.error("视频广告尚未加载好");
        }
        _DoNoCacheShowVideo(t, e) {
            if (this._rewardSuccessed = t, this._rewardSkipped = e, et.IsNullOrEmpty(this.platformData.rewardVideoId)) return console.log("无有效的视频广告ID,取消加载"),
                void e.run();
            let i = this._base.createRewardedVideoAd;
            if (null == i) return console.error("无createRewardedVideoAd方法,跳过初始化"), void e.run();
            this._videoFailedCount = 0;
            let s = {};
            s.adUnitId = this.platformData.rewardVideoId, this._rewardVideo && this._rewardVideo.offClose(this.onVideoClose),
                this._rewardVideo = i(s), this._rewardVideo.onLoad(() => {
                    console.log("视频广告加载成功"), this._isVideoLoaded = !0;
                }), this._rewardVideo.onError(t => {
                    this._videoFailedCount++, console.error("视频广告加载失败", t, this._videoFailedCount);
                }), this._rewardVideo.onClose(t => {
                    Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t);
                    let e = t.isEnded;
                    wi.NextFrame().then(() => {
                        e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
                    });
                }), this._rewardVideo.load().then(() => (console.log("激励视频 加载成功"), this._rewardVideo.show().then(() => { }).catch(t => {
                    console.error(t);
                })));
        }
        onVideoClose(t) {
            Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t);
            let e = t.isEnded;
            wi.NextFrame().then(() => {
                e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
            });
        }
        ShowRewardVideoAd(t, e) {
            this._cacheVideoAD ?
                YYGGames.showReward(() => {
                    this._DoCacheShowVideo(t, e)
                })
                : this._DoNoCacheShowVideo(t, e);
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (t) {
                as.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    t(!0);
                }), Laya.Handler.create(this, () => {
                    t(!1);
                }));
            });
        }
        ShowInterstitalAd() {
            this._isInterstitialLoaded ? this._intersitialAd.show() : console.error("插页广告尚未加载好");
        }
        GetFromAppId() {
            return null == this.lauchOption.referrerInfo ? null : et.IsNullOrEmpty(this.lauchOption.referrerInfo.appId) ? null : this.lauchOption.referrerInfo.appId;
        }
        _OnShow(t) {
            console.log(as.platformStr, "OnShow", t), as.instance.PlatformInstance.lauchOption = t,
                as.instance.PlatformInstance._CheckUpdate(), this.NavigateToAppSuccess = null, wi.NextFrame().then(() => {
                    as.instance.PlatformInstance.onResume && as.instance.PlatformInstance.onResume.runWith(t);
                });
        }
        _OnHide(t) {
            console.log(as.platformStr, "OnHide", t), as.instance.PlatformInstance.onPause && as.instance.PlatformInstance.onPause.runWith(t),
                this.NavigateToAppSuccess && this.NavigateToAppSuccess();
        }
        ShareAppMessage(t, e, i) {
            console.log("分享消息", t);
            let s = Ca._WrapShareInfo(t);
            this._base.shareAppMessage(s), e && e.run();
        }
        LoadSubpackage(t, e, i, s) {
            if (null == this._base.loadSubpackage) return console.log("无加载子包方法,跳过加载子包", t),
                void (e && e.run());
            let a = {};
            a.name = t, a.success = (() => {
                console.log("分包加载成功", t), e && e.run();
            }), a.fail = (() => {
                console.error("分包加载失败", t), i && i.run();
            }), this._base.loadSubpackage(a).onProgressUpdate(t => {
                Laya.Browser.onMobile && console.log("分包加载进度", t), s && s.runWith(t.progress / 100);
            });
        }
        RecordEvent(t, e) {
            console.log("记录事件", t, e);
            let i = this._base.aldSendEvent;
            null != i ? null != e ? i(t, e) : i(t) : console.error("阿拉丁sdk尚未接入,请检查配置");
        }
        CreateShareVideoBtn(t, e, i, s) {
            let a = {};
            a.style = {
                left: t * this._cacheScreenScale,
                top: e * this._cacheScreenScale,
                height: s * this._cacheScreenScale,
                width: i * this._cacheScreenScale
            }, a.share = {
                query: {
                    tick: 1
                },
                bgm: "",
                timeRange: [0, 6e4]
            }, null == this._shareVideoBtn ? this._shareVideoBtn = this._base.createGameRecorderShareButton(a) : this._shareVideoBtn.show();
        }
        HideShareVideoBtn() {
            null != this._shareVideoBtn && this._shareVideoBtn.hide();
        }
        ShowToast(t) {
            this._base.showToast({
                title: t,
                duration: 2e3
            });
        }
        OpenGameBox(t) {
            console.error("当前平台", as.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(t, e, i, s, a, n) {
            return new Promise((s, a) => {
                wx.navigateToMiniProgram({
                    appId: t,
                    path: e,
                    extraData: i,
                    envVersion: "",
                    success: t => {
                        console.log("小游戏跳转成功", t), s(!0);
                    },
                    fail: () => {
                        console.log("小游戏跳转失败："), a(!1);
                    },
                    complete: () => { }
                });
            });
        }
        createShortcut() {
            console.log("暂未实现");
        }
    }
    class wa extends Ca {
        constructor() {
            super(...arguments), this.platform = oe.BD, this._showVideoLoad = !1;
        }
        Init(t) {
            this._base = window.swan, null != this._base ? (this.platformData = t, this.recordManager.Platform = this,
                this._InitLauchOption(), this._InitShareInfo(), this._InitSystemInfo(), this._isBannerLoaded = !1,
                this._isBannerShowed = !1, this._CreateVideoAd(), this._CreateInterstitalAd(), window.iplatform = this) : console.error(...s.packError("平台初始化错误"));
        }
        _CreateBannerAd() {
            if (et.IsNullOrEmpty(this.platformData.bannerId)) return void console.log("无有效的banner广告ID,取消加载");
            let t = this._base.getSystemInfoSync().windowWidth, e = this._base.getSystemInfoSync().windowHeight, i = {};
            i.adUnitId = this.platformData.bannerId, i.appSid = this.platformData.sid;
            let s = {
                left: 0,
                top: 0
            };
            s.width = t, i.style = s, this._bannerAd = this._base.createBannerAd(i), this._bannerAd.onLoad(() => {
                console.log("banner加载成功"), this._isBannerLoaded = !0, this._bannerAd.style.top = e - this._bannerAd.style.height,
                    this._bannerAd.show();
            }), this._bannerAd.onError(t => {
                console.error("banner广告加载失败", t);
            });
        }
        _CreateVideoAd() {
            if (et.IsNullOrEmpty(this.platformData.rewardVideoId)) return void console.log("无有效的视频广告ID,取消加载");
            this._videoFailedCount = 0;
            let t = {};
            t.adUnitId = this.platformData.rewardVideoId, t.appSid = this.platformData.sid,
                this._rewardVideo = this._base.createRewardedVideoAd(t), this._rewardVideo.onLoad(() => {
                    console.log("视频广告加载成功"), this._isVideoLoaded = !0;
                }), this._rewardVideo.onError(t => {
                    this._videoFailedCount++, console.error("视频广告加载失败", t), this._videoFailedCount > 10 && (console.log("第", this._videoFailedCount, "次重新加载视频广告"),
                        this._rewardVideo.load());
                }), this._rewardVideo.onClose(t => {
                    this._base.hideLoading(), Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t),
                        t.isEnded ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run(),
                        this._rewardVideo.load();
                });
        }
        _CreateInterstitalAd() { }
        LoadSubpackage(t, e, i, s) {
            let a = {};
            a.name = t, a.success = (() => {
                console.log("分包加载成功", t), e && e.run();
            }), a.fail = (() => {
                console.error("分包加载失败", t), i && i.run();
            }), this._base.loadSubpackage(a).onProgressUpdate(t => {
                if (s) {
                    let e = t.progress / 100;
                    isNaN(e) && (e = t.loaded / t.total), s.runWith(e);
                }
            });
        }
        RecordEvent(t, e) {
            this._base.reportAnalytics(t, e);
        }
        ShowBannerAd() {
            this._isBannerLoaded || this._CreateBannerAd();
        }
        HideBannerAd() {
            this._isBannerLoaded && (this._isBannerLoaded = !1, this._bannerAd && this._bannerAd.destroy());
        }
    }
    class ba extends ya {
        constructor() {
            super(...arguments), this.supportRecord = !1;
        }
        ShareVideo(t, e, i) {
            this.supportRecord ? (console.log("强制模拟成功"), t && t.run()) : (console.log("强制模拟失败"),
                i && i.run());
        }
    }
    class La {
        constructor() {
            this.platform = oe.Web, this.safeArea = null, this.recordManager = new ba(), this.device = new fa(),
                this.systemInfo = null, this.isSupportJumpOther = !0;
        }
        Init(t) {
            this.loginState = {
                isLogin: !1,
                code: null
            }, this.recordManager.Platform = this, Laya.timer.once(500, this, this._FakeLoginEnd);
        }
        _FakeLoginEnd() {
            this.onLoginEnd && this.onLoginEnd.run();
        }
        IsBannerAvaliable() {
            return !1;
        }
        IsVideoAvaliable() {
            return !0;
        }
        IsInterstitalAvaliable() {
            return !1;
        }
        ShowBannerAd() {
            console.log("调用ShowBannerAd");
        }
        HideBannerAd() {
            console.log("调用HideBannerAd");
        }
        ShowRewardVideoAd(t, e) {
            // console.log("调用ShowRewardVideoAd"), t.run();
            showReward(() => {
                t.run();
            })
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (t) {
                as.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    t(!0);
                }), Laya.Handler.create(this, () => {
                    t(!1);
                }));
            });
        }
        ShowInterstitalAd() {
            console.log("调用ShowInterstitalAd");
        }
        GetFromAppId() {
            return null;
        }
        ShareAppMessage(t, e = null, i = null) {
            console.log("分享消息", t), e && e.run();
        }
        LoadSubpackage(t, e, i) {
            e && e.run();
        }
        RecordEvent(t, e) {
            console.log("记录事件", t, e);
        }
        ShareVideoInfo() {
            console.log(as.platformStr, "暂未实现录屏功能");
        }
        _CheckUpdate() { }
        ShowToast(t) {
            console.log("显示消息：", t);
        }
        OpenGameBox() {
            console.error("当前平台", as.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(t, e, i) {
            return new Promise((e, i) => {
                console.error("当前平台", as.platformStr, `暂不支持小程序跳转appid:${t}`), e(!1);
            });
        }
        createShortcut() {
            console.log("创建桌面图标");
        }
        GetStorage(t) {
            return console.log("读本地存储"), Laya.LocalStorage.getItem(t);
        }
        SetStorage(t, e) {
            console.log("写本地存储"), Laya.LocalStorage.setItem(t, e);
        }
    }
    function __awaiter(t, e, i, s) {
        return new (i || (i = Promise))(function (a, n) {
            function fulfilled(t) {
                try {
                    step(s.next(t));
                } catch (t) {
                    n(t);
                }
            }
            function rejected(t) {
                try {
                    step(s.throw(t));
                } catch (t) {
                    n(t);
                }
            }
            function step(t) {
                t.done ? a(t.value) : new i(function (e) {
                    e(t.value);
                }).then(fulfilled, rejected);
            }
            step((s = s.apply(t, e || [])).next());
        });
    }
    class xa extends Ca {
        constructor() {
            super(...arguments), this.platform = oe.OPPO, this.safeArea = null, this.recordManager = new ya(),
                this.device = new fa(), this.isSupportJumpOther = !0, this._isBannerLoaded = !1,
                this._isVideoLoaded = !1, this._isInterstitialLoaded = !1, this._isInterstitialCanShow = !0,
                this._nativeAdLoaded = !1, this._cacheVideoAD = !1;
        }
        Init(t) {
            this._base = window.qg, null != this._base ? (this.platformData = t, this.recordManager.Platform = this,
                this._InitLauchOption(), this._Login(), this._InitSystemInfo(), this.getSystemInfo(),
                this.systemInfo.platformVersion >= 1051 || this._base.initAdService({
                    appId: t.appId,
                    isDebug: !0,
                    success: () => {
                        console.log("oppo广告", "初始化广告服务成功", t), this._CreateVideoAd();
                    },
                    fail: () => {
                        console.error("oppo广告", "初始化广告服务失败");
                    }
                }), window.iplatform = this) : console.error(...s.packError("平台初始化错误", as.platformStr));
        }
        getSystemInfo() {
            this._base.getSystemInfo({
                success: t => {
                    this.systemInfo = t, console.log(this.systemInfo);
                },
                fail: () => { },
                complete: () => { }
            });
        }
        reportMonitor() {
            console.log("oppo上报数据", this.systemInfo), this.systemInfo && this.systemInfo.platformVersion >= 1060 && this._base.reportMonitor("game_scene", 0);
        }
        _CheckUpdate() { }
        _Login() {
            this.loginState = {
                isLogin: !1,
                code: ""
            };
            let t = {};
            t.success = (t => {
                this._OnLoginSuccess(t);
            }), t.fail = (t => {
                console.error(as.platformStr, "登录失败", t), this.loginState.isLogin = !1, this.loginState.code = "";
            }), t.complete = (t => {
                null != this.onLoginEnd && this.onLoginEnd.run();
            }), this._base.login(t);
        }
        _OnLoginSuccess(t) {
            console.log(as.platformStr, "登录成功", t), this.loginState.isLogin = !0, this.loginState.code = t.token;
        }
        ShareAppMessage(t, e, i) { }
        _InitLauchOption() {
            this._base.onShow(this._OnShow), this._base.onHide(this._OnHide);
            let t = this._base.getLaunchOptionsSync();
            this._OnShow(t);
        }
        canCreateShortcut() {
            return new Promise((t, e) => {
                qg.hasShortcutInstalled({
                    success: function (e) {
                        t(e);
                    },
                    fail: function (t) {
                        e();
                    },
                    complete: function () { }
                });
            });
        }
        createShortcut() {
            return new Promise((t, e) => {
                qg.hasShortcutInstalled({
                    success: function (i) {
                        0 == i ? qg.installShortcut({
                            success: function () {
                                t();
                            },
                            fail: function (t) {
                                e();
                            },
                            complete: function () { }
                        }) : t();
                    },
                    fail: function (t) {
                        e();
                    },
                    complete: function () { }
                });
            });
        }
        _CreateInterstitalAd() { }
        _CreateVideoAd() {
            if (!this._cacheVideoAD) return void console.log("当前策略为不缓存视频广告");
            let t = this._base.createRewardedVideoAd;
            if (null == t) return void console.error("无createRewardedVideoAd方法,跳过初始化");
            if (et.IsNullOrEmpty(this.platformData.rewardVideoId)) return void console.log("无有效的视频广告ID,取消加载");
            this._videoFailedCount = 0;
            let e = {};
            e.adUnitId = this.platformData.rewardVideoId, this._rewardVideo = t(e), this._rewardVideo.onLoad(() => {
                console.log("视频广告加载成功"), this._isVideoLoaded = !0;
            }), this._rewardVideo.onError(t => {
                this._videoFailedCount++, console.error("视频广告加载失败", t), this._videoFailedCount > 10 && (console.log("第", this._videoFailedCount, "次重新加载视频广告"),
                    this._rewardVideo.load());
            }), this._rewardVideo.onClose(t => {
                Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t);
                let e = t.isEnded;
                wi.NextFrame().then(() => {
                    e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
                });
            });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return !1;
        }
        IsNativeAvaliable() {
            return this._nativeAdLoaded;
        }
        ShowBannerAd() {
            return __awaiter(this, void 0, void 0, function* () {
                if (et.IsNullOrEmpty(this.platformData.bannerId)) return void console.log("无有效的banner广告ID,取消加载");
                if (this._bannerAd) return this._bannerAd.show(), void console.log("展示已有banner");
                this.HideBannerAd(), this._bannerAd = this._base.createBannerAd({
                    adUnitId: this.platformData.bannerId
                });
                let t = !0, e = !1;
                for (this._bannerAd.show().then(i => {
                    console.log("banner加载成功", i), 0 == i.code && (e = !0), t = !1;
                }).catch(e => {
                    console.error("banner加载失败", e), t = !1;
                }); t;) yield wi.NextFrame();
                if (!e) {
                    console.log("banner展示失败,展示native广告"), this._bannerAd && (this._bannerAd.destroy(),
                        this._bannerAd = null);
                    for (let t = 0; t < this.platformData.nativeIconIds.length; ++t) {
                        if (yield this._ShowNativeBanner(t)) break;
                        this._bannerAd.destroy();
                    }
                }
            });
        }
        _ShowNativeBanner(t) {
            return __awaiter(this, void 0, void 0, function* () {
                let e = this.base.createNativeAd({
                    adUnitId: this.platformData.nativeBannerIds[t]
                });
                this._bannerAd = e;
                let i = yield e.load();
                if (0 == i.code) {
                    let t = i.adList;
                    return null == t || 0 == t.length ? (console.error("native banner加载失败", i), !1) : null != t[0] || (console.error("native banner加载失败", i),
                        !1);
                }
                return console.error("native banner加载失败", i), !1;
            });
        }
        HideBannerAd() {
            this._bannerAd && (this._bannerAd.destroy(), this._bannerAd = null);
        }
        ShowNativeAd() {
            return __awaiter(this, void 0, void 0, function* () {
                this.IsNativeAvaliable();
            });
        }
        HideNativeAd() {
            this.IsNativeAvaliable();
        }
        _DoCacheShowVideo(t, e) {
            this._isVideoLoaded ? (this._rewardSuccessed = t, this._rewardSkipped = e, this._isVideoLoaded = !1,
                Laya.stage.event(ue.PAUSE_AUDIO), this._rewardVideo.show()) : console.error("视频广告尚未加载好");
        }
        _DoNoCacheShowVideo(t, e) {
            if (this._rewardSuccessed = t, this._rewardSkipped = e, et.IsNullOrEmpty(this.platformData.rewardVideoId)) return console.log("无有效的视频广告ID,取消加载"),
                void (this._rewardSkipped && this._rewardSkipped.run());
            let i = this._base.createRewardedVideoAd;
            if (null == i) return console.error("无createRewardedVideoAd方法,跳过初始化"), void (this._rewardSkipped && this._rewardSkipped.run());
            this._rewardVideo && this._rewardVideo.destroy();
            let s = {};
            s.adUnitId = this.platformData.rewardVideoId, this._rewardVideo = i(s), console.log("广告创建完成", s),
                this._rewardVideo.onClose(t => {
                    Laya.stage.event(ue.RESUM_AUDIO), console.log("视频回调", t);
                    let e = t.isEnded;
                    wi.NextFrame().then(() => {
                        e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
                    });
                }), this._rewardVideo.onError(t => {
                    console.log("广告组件出现问题", t), this._rewardSkipped && this._rewardSkipped.run();
                }), this._rewardVideo.onLoad(t => {
                    console.log("广告加载成功", t);
                }), this._rewardVideo.load().then(() => {
                    this._rewardVideo.show();
                });
        }
        ShowRewardVideoAd(t, e) {
            this._cacheVideoAD ? this._DoCacheShowVideo(t, e) : this._DoNoCacheShowVideo(t, e);
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (t) {
                as.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    t(!0);
                }), Laya.Handler.create(this, () => {
                    t(!1);
                }));
            });
        }
        _DisableInterstitalAd() {
            return __awaiter(this, void 0, void 0, function* () {
                this._isInterstitialCanShow = !1, yield wi.Seconds(60), this._isInterstitialCanShow = !0;
            });
        }
        GetFromAppId() {
            return null == this.lauchOption.referrerInfo ? null : et.IsNullOrEmpty(this.lauchOption.referrerInfo.appId) ? null : this.lauchOption.referrerInfo.appId;
        }
        CreatShortcut() {
            return new Promise((t, e) => {
                qg.hasShortcutInstalled({
                    success: function (i) {
                        0 == i ? qg.installShortcut({
                            success: function () {
                                t();
                            },
                            fail: function (t) {
                                e();
                            },
                            complete: function () { }
                        }) : t();
                    },
                    fail: function (t) {
                        e();
                    },
                    complete: function () { }
                });
            });
        }
        LoadSubpackage(t, e, i, s) {
            let a = {};
            a.name = t, a.success = (() => {
                console.log("分包加载成功", t), e && e.run();
            }), a.fail = (() => {
                console.error("分包加载失败", t), i && i.run();
            }), this._base.loadSubpackage(a).onProgressUpdate(t => {
                console.log("分包加载进度", t), s && s.runWith(t.progress / 100);
            });
        }
        RecordEvent(t, e) {
            console.log("[记录事件]", t, e);
        }
        CreateShareVideoBtn(t, e, i, s) { }
        HideShareVideoBtn() {
            null != this._shareVideoBtn && this._shareVideoBtn.hide();
        }
        ShowToast(t) {
            this._base.showToast({
                title: t,
                duration: 2e3
            });
        }
        OpenGameBox(t) {
            console.error("当前平台", as.platformStr, "暂不支持互推游戏盒子");
        }
        NavigateToApp(t, e, i) {
            return new Promise((s, a) => {
                Laya.Browser.window.qg.navigateToMiniGame({
                    pkgName: t,
                    path: e,
                    extraData: i,
                    success: function () {
                        s(!0), console.log("oppo小游戏跳转成功");
                    },
                    fail: function (t) {
                        a(!1), console.log("oppo小游戏跳转失败：", JSON.stringify(t));
                    }
                });
            });
        }
    }
    class va extends Ca {
        constructor() {
            super(...arguments), this.platform = oe.QQ, this.isBannerShowing = !1;
        }
        Init(t) {
            this._base = window.qq, null != this._base ? (this.platformData = t, this.recordManager.Platform = this,
                this._InitLauchOption(), this._Login(), this._InitShareInfo(), this._InitSystemInfo(),
                this._CreateBannerAd(), this._CreateVideoAd(), this._CreateInterstitalAd(), window.iplatform = this,
                console.error("平台初始化完成", as.platformStr)) : console.error(...s.packError("平台初始化错误", as.platformStr));
        }
        _InitSystemInfo() {
            try {
                let t = this._base.getSystemInfoSync();
                this._cacheScreenScale = t.screenWidth / Laya.stage.width, this.safeArea = {}, this.safeArea.width = t.windowWidth,
                    this.safeArea.height = t.windowHeight, this.safeArea.top = t.statusBarHeight, this.safeArea.bottom = 0,
                    console.log("QQ覆写_InitSystemInfo", this.safeArea);
            } catch (t) {
                console.error(t), console.error("获取设备信息失败,执行默认初始化"), this.safeArea = null;
            }
        }
        _CreateBannerAd(t) {
            if (et.IsNullOrEmpty(this.platformData.bannerId)) return void console.log("无有效的banner广告ID,取消加载");
            let e = this._base.getSystemInfoSync().windowWidth, i = this._base.getSystemInfoSync().windowHeight, s = {};
            s.adUnitId = this.platformData.bannerId;
            let a = {};
            a.top = i - 80, a.width = 300, a.left = (e - a.width) / 2, s.style = a, this._bannerAd = this._base.createBannerAd(s),
                this._isBannerLoaded = !1, this._bannerAd.onLoad(() => {
                    console.log("qq banner加载成功", this._bannerAd), this._isBannerLoaded = !0, t && this._bannerAd.show();
                }), this._bannerAd.onError(t => {
                    console.error("banner广告加载失败", t);
                }), this._bannerAd.onResize(t => {
                    console.log("onResize", t), this._bannerAd.style.top = i - 80, this._bannerAd.style.left = (e - 300) / 2,
                        console.log("onResize", this._bannerAd);
                });
        }
        IsBannerAvaliable() {
            return this._isBannerLoaded;
        }
        IsVideoAvaliable() {
            return this._isVideoLoaded;
        }
        IsInterstitalAvaliable() {
            return this._isInterstitialLoaded;
        }
        ShowBannerAd() {
            this.IsBannerAvaliable() && (this._bannerAd.show(), this.isBannerShowing = !0, Laya.timer.loop(15e3, this, this.refreshBanner));
        }
        refreshBanner() {
            this.isBannerShowing && (console.log("refresh banner"), this._bannerAd.hide(), this._CreateBannerAd(!0));
        }
        HideBannerAd() {
            this.IsBannerAvaliable() && (this._bannerAd && (this._bannerAd.hide(), Laya.timer.clear(this, this.refreshBanner),
                this.isBannerShowing = !1), this._CreateBannerAd());
        }
        _DoCacheShowVideo(t, e) {
            this._isVideoLoaded ? (this._rewardSuccessed = t, this._rewardSkipped = e, this._isVideoLoaded = !1,
                Laya.stage.event(ue.PAUSE_AUDIO), this._rewardVideo.show()) : console.error("视频广告尚未加载好");
        }
        _DoNoCacheShowVideo(t, e) {
            if (this._rewardSuccessed = t, this._rewardSkipped = e, !this._isVideoLoaded || !this._rewardVideo) {
                if (et.IsNullOrEmpty(this.platformData.rewardVideoId)) return console.log("无有效的视频广告ID,取消加载"),
                    void e.run();
                let t = this._base.createRewardedVideoAd;
                if (null == t) return console.error("无createRewardedVideoAd方法,跳过初始化"), void e.run();
                this._videoFailedCount = 0;
                let i = {};
                i.adUnitId = this.platformData.rewardVideoId, this._rewardVideo = t(i), this._rewardVideo.onLoad(() => {
                    console.log("视频广告加载成功"), this._isVideoLoaded = !0;
                }), this._rewardVideo.onError(t => {
                    this._videoFailedCount++, console.error("视频广告加载失败", t, this._videoFailedCount);
                }), this._rewardVideo.onClose(t => {
                    Laya.stage.event(ue.RESUM_AUDIO), console.log(" NoCache - 视频回调", t);
                    let e = t.isEnded;
                    console.log("noCache---", e, "----", !!this._rewardSuccessed, "-----", !!this._rewardSkipped),
                        e ? this._rewardSuccessed && this._rewardSuccessed.run() : this._rewardSkipped && this._rewardSkipped.run();
                });
            }
            this._rewardVideo.show().then(() => { }).catch(t => {
                console.log("广告组件出现问题", t), this._rewardVideo.load().then(() => (console.log("手动加载成功"),
                    this._rewardVideo.show().then(() => { })));
            });
        }
        ShowRewardVideoAd(t, e) {
            this._cacheVideoAD ? this._DoCacheShowVideo(t, e) : this._DoNoCacheShowVideo(t, e);
        }
        ShowRewardVideoAdAsync() {
            return new Promise(function (t) {
                as.instance.PlatformInstance.ShowRewardVideoAd(Laya.Handler.create(this, () => {
                    t(!0);
                }, null, !0), Laya.Handler.create(this, () => {
                    t(!1);
                }, null, !0));
            });
        }
        ShowInterstitalAd() {
            this._isInterstitialLoaded ? this._intersitialAd.show() : console.error("插页广告尚未加载好");
        }
        OpenGameBox(t = []) {
            this.showAppBox();
        }
        showAppBox() {
            this.appBox && this.appBox.show();
        }
        createAppBox(t) {
            this.appBox || (this.appBox = this._base.createAppBox({
                adUnitId: ""
            })), this.appBox.load().then(() => {
                t && this.appBox.show();
            }), this.appBox.onClose(() => {
                console.log("关闭盒子");
            });
        }
        hideAppBox() {
            this.appBox && this.appBox.destroy();
        }
        showBlockAd(t = 1) {
            let e = {
                adUnitId: "",
                style: {
                    left: 55,
                    top: Laya.stage.height / 2
                },
                size: t,
                orientation: "vertical"
            };
            this.blockAd = this._base.createBlockAd(e), this.blockAd.onLoad(() => {
                console.log("积木广告加载完成"), this.blockAd.show().then(() => {
                    console.log("积木展示成功");
                }).catch(t => {
                    console.error("积木展示失败", t);
                });
            }), this.blockAd.onError(t => {
                console.error("积木广告加载错误", t);
            }), this.blockAd.onResize(t => {
                console.log("积木resize", t);
            });
        }
        hideBlockAd() {
            this.blockAd && (this.blockAd.hide(), this.blockAd.destroy());
        }
    }
    class Aa extends Ca {
        constructor() {
            super(...arguments), this.platform = oe.QTT;
        }
        Init(t) {
            this._base = window.qttGame, null != this._base ? (this.platformData = t, this.recordManager.Platform = this,
                window.iplatform = this) : console.error(...s.packError("平台初始化错误"));
        }
        IsBannerAvaliable() {
            return !0;
        }
        ShowBannerAd() {
            this._base.showBanner({
                index: 1
            });
        }
        HideBannerAd() {
            this._base.hideBanner();
        }
        IsVideoAvaliable() {
            return !0;
        }
        ShowRewardVideoAd(t, e) {
            let i = {
                index: 1,
                gametype: 1,
                rewardtype: 1,
                data: {}
            };
            i.data.title = "获得奖励", Laya.stage.event(ue.PAUSE_AUDIO), this._base.showVideo(i => {
                Laya.stage.event(ue.RESUM_AUDIO), 1 == i ? t && t.run() : e && e.run();
            }, i);
        }
        ShowInterstitalAd() {
            this.ShowHDReward();
        }
        ShowHDReward() {
            let t = {
                index: 1,
                rewardtype: 1
            };
            this._base.showHDReward(t);
        }
        RecordEvent(t, e) {
            console.log("记录事件", t, e);
        }
    }
    class Pa extends fa {
        constructor(t) {
            super(), this._base = t;
        }
        Vibrate(t) {
            console.log("调用震动", t), t ? this._base.vibrateLong({
                success(t) { },
                fail(t) {
                    console.error("调用震动失败", t);
                },
                complete(t) { }
            }) : this._base.vibrateShort({
                success(t) { },
                fail(t) {
                    console.error("调用震动失败", t);
                },
                complete(t) { }
            });
        }
    }
    class Da extends ya {
        constructor(t) {
            super(), this.supportRecord = !0, this._base = t, this.isRecording = !1, this.isRecordSuccess = !1,
                this.isPausing = !1, this._nativeManager = this._base.getGameRecorderManager(),
                this._nativeManager.onStart(t => {
                    console.log("平台开始录制", t), this.isRecording = !0, this.isRecordSuccess = !1, this._cacheStartHandle && this._cacheStartHandle.run();
                }), this._nativeManager.onStop(t => {
                    console.log("平台停止录制", t), this.videoSavePath = t.videoPath, this.isRecording = !1,
                        this.isRecordSuccess = !0, this._cacheStopHandle ? this._cacheStopHandle.run() : this._cacheOverTimeHandle && this._cacheOverTimeHandle.run();
                }), this._nativeManager.onError(t => {
                    console.log("录制发生错误", t), this.isRecordSuccess = !1, this.isRecording = !1;
                }), this._nativeManager.onPause(t => {
                    console.log("暂停录制视频", t), this.isPausing = !0, this._cachePauseHandle && this._cachePauseHandle.run();
                }), this._nativeManager.onResume(t => {
                    console.log("暂停录制视频", t), this.isPausing = !1, this._cacheResumeHandle && this._cacheResumeHandle.run();
                });
        }
        StartRecord(t, e) {
            console.log("调用开始录屏"), this._cacheStartHandle = t, this._cacheOverTimeHandle = e,
                this._cacheStopHandle = null, this._nativeManager.start({
                    duration: 300
                });
        }
        Pause(t) {
            this.isRecording ? this.isPausing ? console.log("当前录制状态已暂停") : (console.log("调用暂停录制"),
                this._cachePauseHandle = t, this._nativeManager.pause()) : console.error("当前未开始录制,无法暂停录制");
        }
        Resume(t) {
            this.isRecording ? this.isPausing ? (console.log("调用恢复录制"), this._cacheResumeHandle = t,
                this._nativeManager.resume()) : console.log("当前录制状态正在进行中") : console.error("当前未开始录制,无法恢复录制");
        }
        RecordClip(t) {
            this.isRecording ? this.isPausing ? console.log("当前录制状态已暂停,无法记录精彩时刻") : null == t ? this._nativeManager.recordClip({}) : this._nativeManager.recordClip({
                timeRange: t
            }) : console.error("当前未开始录制,无法记录精彩时刻");
        }
        StopRecord(t) {
            console.log("调用结束录屏"), this._cacheStopHandle = t, this._nativeManager.stop();
        }
        ShareVideo(t, e, i) {
            if (this.isRecordSuccess) {
                let i = {
                    channel: "video",
                    title: "",
                    desc: "",
                    imageUrl: "",
                    templateId: this.Platform.platformData.shareId,
                    query: "",
                    extra: {
                        videoPath: this.videoSavePath,
                        videoTopics: ["抖音小游戏", "开间厕所当老板"]
                    },
                    success() {
                        t && t.run();
                    },
                    fail(t) {
                        e && e.run();
                    }
                };
                this._base.shareAppMessage(i);
            } else console.log("无视频可以分享"), i && i.run();
        }
    }
    class ka extends Ca {
        constructor() {
            super(...arguments), this.platform = oe.TT, this._showVideoLoad = !1;
        }
        Init(t) {
            if (this._base = window.tt, null == this._base) return void console.error(...s.packError("平台初始化错误"));
            this.platformData = t;
            let e = this._base.getSystemInfoSync();
            "ios" == e.platform && (this.isSupportJumpOther = !1);
            let [i, a] = e.SDKVersion.split(".");
            i >= 1 && a >= 33 || (this.isSupportJumpOther = !1), this._InitLauchOption(), this._InitShareInfo(),
                this._InitSystemInfo(), this._CreateBannerAd(), this._CreateVideoAd(), this._CreateInterstitalAd(),
                this.recordManager = new Da(this._base), this.recordManager.Platform = this, this.device = new Pa(this._base),
                window.iplatform = this;
        }
        _CreateBannerAd() {
            if (et.IsNullOrEmpty(this.platformData.bannerId)) return void console.log("无有效的banner广告ID,取消加载");
            let t = this._base.getSystemInfoSync().windowWidth, e = this._base.getSystemInfoSync().windowHeight, i = {};
            i.adUnitId = this.platformData.bannerId, i.adIntervals = 30;
            let s = {
                left: 0,
                top: 0
            };
            s.width = t, i.style = s, this._bannerAd = this._base.createBannerAd(i), this._isBannerLoaded = !1,
                this._bannerAd && (this._bannerAd.onLoad(() => {
                    console.log("banner加载成功", this._bannerAd), this._isBannerLoaded = !0;
                }), this._bannerAd.onError(t => {
                    console.error("banner广告加载失败", t), this._bannerAd;
                }), this._bannerAd.onResize(i => {
                    this._bannerAd.style.top = e - i.height, this._bannerAd.style.left = (t - i.width) / 2;
                }));
        }
        RecordEvent(t, e) {
            let i = this._base.reportAnalytics;
            i ? (null == e && (e = {}), i(t, e)) : console.error("reportAnalytics 方法不存在");
        }
        ShowBannerAd() {
            this.IsBannerAvaliable() && this._bannerAd.show();
        }
        ShareAppMessage(t, e, i) {
            console.log("分享消息", t);
            let s = Ca._WrapShareInfo(t);
            s.success = (() => {
                e && e.run();
            }), s.fail = (() => {
                i && i.run();
            }), this._base.shareAppMessage(s);
        }
        OpenGameBox(t) {
            let e = [];
            for (let i = 0; i < t.length; ++i) e.push({
                appId: t[i]
            });
            this._base.showMoreGamesModal({
                appLaunchOptions: e
            });
        }
        NavigateToApp(t, e, i) {
            return new Promise((e, i) => {
                this.isSupportJumpOther ? this._base.showMoreGamesModal({
                    appLaunchOptions: [{
                        appId: this.platformData.appId,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    }],
                    success(i) {
                        e(!0), console.log("跳转小游戏成功", t);
                    },
                    fail(e) {
                        i(!1), console.log("跳转小游戏失败", t);
                    }
                }) : (i(!1), console.log("当前平台不支持小游戏跳转", this));
            });
        }
    }
    class Ua {
        static get instance() {
            return null == this._instance && (this._instance = new Ua()), this._instance;
        }
        static get PlatformInstance() {
            return this.instance.m_platformInstance || console.log(...s.packError("还没有设置过平台实例代理！")),
                this.instance.m_platformInstance;
        }
        init() {
            if (null != this.m_platformInstance) return console.error(...s.packError("已调用过平台创建为", as.GetPlatformStr(this.m_platformInstance.platform), "不能重复创建")),
                this.m_platformInstance;
            let t, e = null != window.qttGame;
            null != window.tt ? (t = new ka(), this.m_platformData = new _a()) : Laya.Browser.onMiniGame ? (t = new Ca(),
                this.m_platformData = new ga()) : Laya.Browser.onBDMiniGame ? (t = new wa(), this.m_platformData = new ca()) : e ? (t = new Aa(),
                    this.m_platformData = new ua()) : Laya.Browser.onQQMiniGame ? (t = new va(), this.m_platformData = new ma()) : Laya.Browser.onQGMiniGame ? (t = new xa(),
                        this.m_platformData = new da()) : (console.log(...s.packWarn("未识别平台,默认创建为web", Laya.Browser.userAgent)),
                            t = new La()), this.m_platformInstance = t, as.instance.PlatformInstance = t, window.$Platform = this.m_platformInstance,
                console.log(...s.packPlatform("平台实例创建完成", as.GetPlatformStr(this.m_platformInstance.platform)));
        }
        initPlatform() {
            this.m_platformInstance.Init(this.m_platformData), console.log(...s.packPlatform("平台初始化完成"));
        }
    }
    class Ta extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameTestPlatform");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(0), this.m_lookVAd = this.getChildAt(1), this.m_lookVAdText = this.getChildAt(2),
                this.m__lookVAd = this.getChildAt(3), this.m_share = this.getChildAt(4), this.m_shareText = this.getChildAt(5),
                this.m__share = this.getChildAt(6), this.m_showToast = this.getChildAt(7), this.m_showToastText = this.getChildAt(8),
                this.m__showToast = this.getChildAt(9);
        }
    }
    Ta.URL = "ui://kk7g5mmmt1pw9y";
    class Ra extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ra(), this.m_instance._classDefine = Ta),
                this.m_instance;
        }
        _OnShow() {
            this.ui.m_bg.onClick(this, this.close), this.ui.m_lookVAd.onClick(this, this.lookVAd),
                this.ui.m_showToast.onClick(this, this.showToast), this.ui.m_share.onClick(this, this.share);
        }
        lookVAd() {

            console.log("看广告测试"), Ua.PlatformInstance.ShowRewardVideoAdAsync().then(t => {
                console.log("看广告完成测试", t);
            });
        }
        showToast() {
            console.log("显示消息测试"), Ua.PlatformInstance.ShowToast("显示消息测试");
        }
        share() {
            console.log("分享测试"), Ua.PlatformInstance.ShareAppMessage({
                shareId: void 0,
                shareImg: void 0,
                sharePath: void 0,
                shareTitle: "分享消息"
            }, Laya.Handler.create(this, () => {
                console.log("分享成功");
            }), Laya.Handler.create(this, () => {
                console.log("分享失败！");
            }));
        }
        close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.TestPlatform,
                state: !1
            }], !1);
        }
        _OnHide() { }
    }
    class Oa {
        constructor() {
            this.initUIMediator(), this._initUIMediator();
        }
        initUIMediator() { }
        _initUIMediator() {
            let t, e;
            this.m_UIMediator || console.log(...s.packWarn("注意！没有注册UI代理类。")), this.m_UIProxy.setProxyMediatroList(this.m_UIMediator);
            for (let i in this.m_UIMediator) this.m_UIMediator[i].keyId = i, t = [], this.getUIBelongSerialNumber(this.m_UIMediator[i], t),
                (e = t.length) != (t = y.Unique(t)).length && console.log(...s.packError("UI调度者", i, "的附属UI有重复出现！"));
        }
        getUIBelongSerialNumber(t, e, i = !1) {
            t.belongDownUIMediator.length > 0 && t.belongDownUIMediator.forEach(t => {
                this.getUIBelongSerialNumber(t, e, !0);
            }), i ? t.ifBelongUIMediator || console.log(...s.packWarn("注意！有一个不是附属的UI调度者被添加进了附属列表中")) : t.ifBelongUIMediator && console.log(...s.packWarn("注意！有一个附属UI调度者被添加进了UI管理器列表中，它将不会被显示。")),
                e.push(t.serialNumber), t.belongUpUIMediator.length > 0 && t.belongUpUIMediator.forEach(t => {
                    this.getUIBelongSerialNumber(t, e, !0);
                });
        }
    }
    class Ea extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Manager");
        }
        onConstruct() {
            this.m_c1 = this.getControllerAt(0), this.m_bg = this.getChildAt(0), this.m_manager_Title = this.getChildAt(1),
                this.m_Buildings = this.getChildAt(4), this.m_Statistics = this.getChildAt(5), this.m_btn_close = this.getChildAt(6);
        }
    }
    Ea.URL = "ui://8nmf3q47coka0";
    class Ma extends Ue {
        constructor() {
            super(), this._StatisticsArray = [], this._flowArray = new Array(7);
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Ma(), this.m_instance._classDefine = Ea),
                this.m_instance;
        }
        get data() {
            return Je.instance.data.list;
        }
        get dict() {
            return Je.instance.dict;
        }
        get config() {
            return Ae.instance.dataList;
        }
        GetStatisticsInfo() {
            let t = Xe.instance.buildingMap;
            return this._StatisticsArray = [], t.forEach(t => {
                if (t.active) {
                    let e = t;
                    if (e.income > 0) {
                        let t = {
                            functionID: e.functionID,
                            title: e.title,
                            buildingName: e.buildingName,
                            income: e.income,
                            progress: e.developProgress
                        };
                        this._StatisticsArray.push(t);
                    }
                }
            }), this._StatisticsArray;
        }
        GetUrl(t) {
            switch (t) {
                case Nt.MaleToilet:
                    return this.config[0].url;

                case Nt.FemaleToilte:
                    return this.config[1].url;

                case Nt.FemaleSink:
                    return this.config[3].url;

                case Nt.MaleSink:
                    return this.config[4].url;

                case Nt.MalePee:
                    return this.config[2].url;
            }
        }
        GetGuestVolume() {
            this._flowArray[0] = Xe.instance.flow, this._flowArray[1] = Xe.instance.femaleQueueCount,
                this._flowArray[2] = Xe.instance.peeQueueCount, this._flowArray[3] = Xe.instance.maleQueueCount,
                this._flowArray[4] = Xe.instance.MaxSizeFemale, this._flowArray[5] = Xe.instance.MaxSizePee,
                this._flowArray[6] = Xe.instance.MaxSizeMale;
        }
        _OnShow() {
            window["Manager"] = this.ui;
            YYGGames.gameBox.visible = false;
            let Manager = this.ui;
            Manager._children[1].text = "Management";
            Manager._children[1].width = 260;
            Manager._children[2]._children[1].text = "Build";
            Manager._children[3]._children[1].text = "Statistics";
            Manager._children[4]._children[2].text = "Proper construction will help you work faster";
            Manager._children[5]._children[3].text = "Total collection:";
            Manager._children[5]._children[10].text = "Customer traffic";
            Manager._children[5]._children[13].text = "Queuing area (female)";
            Manager._children[5]._children[17].text = "Queuing area (urine)"
            Manager._children[5]._children[21].text = "Queuing area (male)";
            Manager._children[5]._children[3].width = 300;
            Manager._children[5]._children[3].x = 270;



            this.RenderBuildingList(), this.ui.m_btn_close.onClick(this, this.Close), $.instance.onUI(Mt.BuildComplete, this, this.OnBuildComplete),
                this.RenderStatisticsItem(), this.RenderTopInfo(), Laya.timer.loop(1e3, this, this.RenderTopInfo),
                this.TotalIncome(), Be.IsCompleteAllGuide ? this.isGuide = !1 : this.isGuide = !0;
        }
        Close() {
            Laya.timer.clearAll(this), Ve.instance.setUIState([{
                typeIndex: Zt.Manager,
                state: !1
            }], !1), Ui.instance.ResetCurrSelectedBuilding();
        }
        RenderBuildingList() {
            this._buildItemList = new Map(), this.ui.m_Buildings.m_list.itemRenderer = Laya.Handler.create(this, (t, e) => {
                if (null == this.data[t]) return;
                t >= 5 && (t += 2);
                let i = this.data[t].UID;
                e.m_txt_title.text = this.config[i].title,
                    console.error(e)

                e.m_txt_title.width = 300,
                    e.m_txt_infomation.text = this.config[i].describe,
                    console.log(e.m_txt_infomation.width),
                    e.m_txt_infomation.x = 186,
                    e.m_txt_title.x = 186,
                    e.m_txt_infomation.width = 230;
                e.m_txt_infomation.fontSize = 20;

                e.m_picture.url = this.config[i].url;
                let s = this.data[t];
                this.UpdateBuildItem(s, e), this._buildItemList.set(s.name, e);
            }, null, !1), this.ui.m_Buildings.m_list.numItems = this.data.length - 2;
        }
        UpdateBuildItem(t, e) {
            let i = Ae.instance.dataList[t.UID].maxCount;
            if (t.count >= i) e.m_btn_update.visible = !1, e.m_costWater.visible = !1, e.m_img_fins.visible = !0,
                e.m_txt_progress.visible = !1; else {
                e.m_txt_progress.text = t.count.toString() + "/" + i.toString(), e.m_img_fins.visible = !1;
                let s = si.Money >= t.costMoney;
                e.m_btn_update.m_txt_cost.text = qe.DoConverter(t.costMoney);
                e.m_btn_update.m_txt_cost.x = 125;
                e.m_btn_update.getChild("n7").x = 12;
                let a = si.MaxWater - si.Water - t.costWater;
                a < 0 ? (e.m_txt_waterWarn.text = "Water shortage", e.m_txt_waterWarn.width = 300, e.m_txt_waterWarn.x = 425, console.log(e.m_txt_waterWarn.x), e.m_txt_waterWarn.visible = !0, e.m_txt_costWater.visible = !1, e.m_spr_water.visible = !1) : (e.m_txt_waterWarn.visible = !1,
                    e.m_txt_costWater.visible = !0, e.m_spr_water.visible = !0, e.m_txt_costWater.text = t.costWater.toString()),
                    a < 0 || !s ? (
                        e.m_btn_update.grayed = !0,
                        e.m_btn_update.touchable = !1,
                        // showReward(() => {
                        window.isVideo = true,
                        e.m_btn_update.onClick(this, this.BuildConstruction, [t.name])
                        // })

                    ) : (e.m_btn_update.grayed = !1, window.isVideo = false,
                        e.m_btn_update.touchable = !0, e.m_btn_update.onClick(this, this.BuildConstruction, [t.name]));
            }
        }
        BuildConstruction(t) {
            // alert("BuildConstruction");
            // let data = si.instance.Data;
            // if (Number(qe.DoConverter(data.money))) {

            // }
            $.instance.eventUI(Mt.BuildConstruction, [Mt.BuildConstruction, t]), this.Close(),
                this.isGuide && $.instance.eventUI(Mt.GuideToNext);
        }
        OnBuildComplete(t) {
            if (!this._buildItemList.get(t)) throw new we("刷新建造Item失败", t);
            {
                let e = this.dict.get(t), i = this._buildItemList.get(t);
                this.UpdateBuildItem(e, i);
            }
            this.Close();
        }
        RenderStatisticsItem() {
            this.GetStatisticsInfo(), this._StatisticsArray.length < 1 || (this._statisticsItemList = new Map(),
                this.ui.m_Statistics.m_list.itemRenderer = Laya.Handler.create(this, (t, e) => {
                    let i = this._StatisticsArray[t];
                    let str = i.title;
                    if (str.indexOf("男厕所") != -1) {
                        i.title = str.replace("男厕所", "Men's toilet ")
                    } else if (str.indexOf("女厕所") != -1) {
                        i.title = str.replace("女厕所", "Women's toilets ")
                    } else if (str.indexOf("洗手区(女)") != -1) {
                        i.title = str.replace("洗手区(女)", "Wash basin(Female) ")
                    } else if (str.indexOf("洗手区（男）") != -1) {
                        i.title = str.replace("洗手区（男）", "Wash basin(Male) ")
                    } else if (str.indexOf("小便区（男）") != -1) {
                        i.title = str.replace("小便区（男）", "Urinal area(Male)")
                    }
                    e.getChild("btn_go").getChild("title").text = "Go";
                    e.getChild("btn_go").getChild("title").y = 6;
                    e.m_txt_title.text = i.title;
                    e.m_txt_title.fontSize = 20;
                    // if (condition) {

                    // }
                    e.m_txt_progress.text = Math.floor(100 * i.progress).toString() + "%";
                    if (Number(Math.floor(100 * i.progress)) == 99) {
                        e.m_txt_progress.text = "100%";
                    }
                    e.m_txt_progress.fontSize = 14;
                    e.m_txt_progress.width = 60;
                    e.m_txt_progress.x = 74;
                    e.m_pro_blue.fillAmount = i.progress, e.m_txt_incomeRate.text = qe.DoConverter(i.income) + "/min",
                        e.m_itemIcon.url = this.GetUrl(i.functionID), e.m_btn_go.onClick(this, this.OnClick, [i.buildingName]);
                }, null, !1), this.ui.m_Statistics.m_list.numItems = this._StatisticsArray.length);
        }
        RenderTopInfo() {
            this.GetGuestVolume(), this.ui.m_Statistics.m_text_flow.text = this._flowArray[0].toString(),
                this.ui.m_Statistics.m_pro_2.value = this._flowArray[1] / this._flowArray[4] * 100,
                this.ChangeColor(this.ui.m_Statistics.m_pro_2), this.ui.m_Statistics.m_pro_3.value = this._flowArray[2] / this._flowArray[5] * 100,
                this.ChangeColor(this.ui.m_Statistics.m_pro_3), this.ui.m_Statistics.m_pro_4.value = this._flowArray[3] / this._flowArray[6] * 100,
                this.ChangeColor(this.ui.m_Statistics.m_pro_4), this.ui.m_Statistics.m_text_women.text = this._flowArray[1].toString() + "/ " + this._flowArray[4].toString(),
                this.ui.m_Statistics.m_text_pee.text = this._flowArray[2].toString() + "/ " + this._flowArray[5].toString(),
                this.ui.m_Statistics.m_text_men.text = this._flowArray[3].toString() + "/ " + this._flowArray[6].toString();
        }
        ChangeColor(t) {
            t.value > 75 && t.value < 100 ? t.m_c1.selectedIndex = 1 : t.value >= 100 ? t.m_c1.selectedIndex = 2 : t.m_c1.selectedIndex = 0;
        }
        TotalIncome() {
            if (this._StatisticsArray.length > 0) {
                let t = 0;
                this._StatisticsArray.forEach(e => {
                    t += e.income;
                }), this.ui.m_Statistics.m_text_totalIncome.text = qe.DoConverter(t) + "/min";
            } else this.ui.m_Statistics.m_text_totalIncome.text = "0/min";
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            $.instance.offUI(Mt.BuildComplete, this, this.OnBuildComplete);
        }
        OnClick(t) {
            this.CameraNavigation(t), this.Close();
        }
        CameraNavigation(t) {
            let e = Pe.instance.dataList, i = -1;
            console.log(t);
            for (let s of e) if (s.name == t) {
                console.log(s.name), i = s.id;
                break;
            }
            -1 != i ? He.instance.FocusPositionByIndex(i) : console.log("获取失败");
        }
    }
    class Ba extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "EventLayer");
        }
        onConstruct() {
            this.m_layer = this.getChildAt(0);
        }
    }
    Ba.URL = "ui://8nmf3q47p8qa15";
    var Ga, Na, Fa, Va, Wa, ja, Ha, za, qa, Qa, Ka, Ya = Laya.MouseManager;
    class Za extends Ue {
        constructor() {
            super(), this._layer = qt.EventLayer, this._lastFramePos = new Laya.Vector2(), this._isDrag = !1,
                this._point = new Laya.Vector2(), this._ray = new Laya.Ray(St.zero, St.zero), this._out = new Laya.HitResult();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Za(), this.m_instance._classDefine = Ba),
                this.m_instance;
        }
        get mousePosition() {
            return this._point.x = Laya.MouseManager.instance.mouseX, this._point.y = Laya.MouseManager.instance.mouseY, this._point;
        }
        get _camera() {
            return X.camera;
        }
        get _scene() {
            return X.s3d;
        }
        _OnShow() {
            console.log("_OnShow");
            this.ui.m_layer.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
            this.ui.m_layer.on(Laya.Event.MOUSE_MOVE, this, this.onMove);
            this.ui.m_layer.on(Laya.Event.MOUSE_UP, this, this.onUp);
        }
        onDown() {
            this.cancheck = true;
            // console.log(this._lastFramePos, this.mousePosition);
            this._lastFramePos.x = this.mousePosition.x, this._lastFramePos.y = this.mousePosition.y;
        }
        onMove() {
            this.cancheck = false;
            // console.log(Math.abs(this.mousePosition.x - this._lastFramePos.x) < 5, Math.abs(this.mousePosition.y - this._lastFramePos.y) < 5);
            Math.abs(this.mousePosition.x - this._lastFramePos.x) < 5 || Math.abs(this.mousePosition.y - this._lastFramePos.y) < 5 || (this._isDrag = !0);
        }
        onUp() {
            console.log("onUp", this._isDrag);
            if (Laya.Browser.onPC) {
                if (this.cancheck) {
                    this._camera.viewportPointToRay(this.mousePosition, this._ray);
                    if (this._scene.physicsSimulation.rayCast(this._ray, this._out)) {
                        console.log("检测物", this._out.collider.owner.name);
                        YYGGames.showInterstitial(() => {
                            let t = this._out.collider.owner.name;
                            $.instance.event3D(L.OnClickBuilding, [t]);
                        })
                    } else console.log("没有检测到box");
                    this.cancheck = false;
                }

            } else {
                if (this._isDrag && 1 == this._scene.input.touchCount() || this._isDrag && Laya.Browser.onPC)
                    this._isDrag = !1;
                else if (0 == this._isDrag) {
                    this._camera.viewportPointToRay(this.mousePosition, this._ray);
                    if (this._scene.physicsSimulation.rayCast(this._ray, this._out)) {
                        console.log("检测物", this._out.collider.owner.name);
                        let t = this._out.collider.owner.name;
                        $.instance.event3D(L.OnClickBuilding, [t]);
                    }
                    else console.log("没有检测到box");
                }
            }
        }
    }
    class Ja extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameVideos");
        }
        onConstruct() {
            this.m_bg_n1 = this.getChildAt(2), this.m_progress_1 = this.getChildAt(4), this.m_text_Time = this.getChildAt(5),
                this.m_text_Mul = this.getChildAt(6), this.m_group_1 = this.getChildAt(9), this.m_progress_2 = this.getChildAt(13),
                this.m_text_Times = this.getChildAt(14), this.m_group_2 = this.getChildAt(18), this.m_btn_close = this.getChildAt(19),
                this.m_btn_Watch = this.getChildAt(21), this.m_btn_thanks = this.getChildAt(22),
                this.m_text_Surplus = this.getChildAt(23), this.m_group_3 = this.getChildAt(24);
        }
    }
    Ja.URL = "ui://8nmf3q47wlyx1e";
    class Xa extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new Xa(), this.m_instance._classDefine = Ja),
                this.m_instance;
        }
        _OnShow() {
            super.Show();

            YYGGames.gameBox.visible = false;
            this.ui.m_btn_close.onClick(this, this.Close), this.ui.m_btn_thanks.onClick(this, this.Close),
                this.ui.m_btn_Watch.onClick(this, this.OnClickWatchADBtn), this.UpdateUsableAdNum(),
                this.ui.m_text_Time.text = pt.ToTimeString(si.data.DoubleBuffTime);
            let t = si.data.OfflineAdTotalNum % si.data.OfflineDiamondLoop;
            this.ui.m_text_Times.text = t + "/" + si.data.OfflineDiamondLoop, this.SetProgressOne(si.data.DoubleBuffTime, si.data.MaxDoubleBuffTime),
                this.SetProgressTwo(t, si.data.OfflineDiamondLoop), $.instance.onUI(Mt.UpdateAdBuffTime, this, this.OnUpdateAdBuffTime),
                si.data.OfflineAdDayNum >= si.data.OfflineMaxDayNum && this.DisableAdd(), this.isGuide = !Be.IsCompleteAllGuide,
                Ge.trackEvent(Kt.DoubleUI);

            window["AD"] = this.ui;
            let AD = this.ui;
            AD._children[3].text = "Double reward";
            AD._children[3].x = 200;
            AD._children[7].text = "Watch ad to get 30 minutes of double earnings";
            AD._children[7].fontSize = 22;
            AD._children[7].x = 105;
            AD._children[17].text = 'Get extra diamonds for watching 5 cumulative ads!'
            AD._children[17].fontSize = 20;

            AD._children[20].text = "Last watch time:"
            AD._children[20].width = 260;
            AD._children[20].x = 220;
            AD._children[21].text = "Watch";
            AD._children[21]._children[2].x = 90;
            AD._children[21]._children[2].y = 18;
            AD._children[22].text = "No,thanks";
            AD._children[22]._children[2].x = 32;
            AD._children[22]._children[2].y = 22;
            AD._children[23].x = 480;

        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            $.instance.offUI(Mt.UpdateAdBuffTime, this, this.OnUpdateAdBuffTime);
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.AD,
                state: !1
            }], !1);
        }
        SetProgressOne(t, e) {
            this.ui.m_progress_1.value = t / e * 100;
        }
        SetProgressTwo(t, e) {
            this.ui.m_text_Times.text = t + "/" + e, this.ui.m_progress_2.value = t / e * 100;
        }
        //2倍
        OnClickWatchADBtn() {
            console.log('2beijiangli----', Be.IsCompleteAllGuide)
            if (Be.IsCompleteAllGuide) {
                YYGGames.showReward(() => {
                    Is.PlayAudio(), this.WatchAd(), Ge.trackEvent(Kt.DoubleAD);
                })
            } else {
                this.WatchAd()
            }
        }
        WatchAd() {
            si.AddDoubleBuffTime(18e5), this.isShow && (this.ui.m_text_Time.text = pt.ToTimeString(si.data.DoubleBuffTime),
                this.SetProgressOne(si.data.DoubleBuffTime, si.data.MaxDoubleBuffTime)), si.data.OfflineAdTotalNum++,
                si.data.OfflineAdDayNum++, si.data.OfflineAdDayNum >= si.data.OfflineMaxDayNum && this.isShow && this.DisableAdd();
            let t = si.data.OfflineAdTotalNum % si.data.OfflineDiamondLoop;
            si.data.OfflineAdTotalNum > 0 && 0 == t && (si.Diamond += 30), this.isShow && (this.SetProgressTwo(t, si.data.OfflineDiamondLoop),
                this.UpdateUsableAdNum()), this.isGuide && ($.instance.eventUI(Mt.GuideToNext),
                    this.Close());
        }
        UpdateUsableAdNum() {
            let t = 8 - si.data.OfflineAdDayNum;
            t = t < 0 ? 0 : t, this.ui.m_text_Surplus.text = t.toString(); this.ui.m_text_Surplus.x = 472;
        }
        DisableAdd() {
            this.ui.m_btn_Watch.grayed = !0, this.ui.m_btn_Watch.touchable = !1;
        }
        OnUpdateAdBuffTime() {
            this.ui.m_text_Time.text = pt.ToTimeString(si.data.DoubleBuffTime), this.SetProgressOne(si.data.DoubleBuffTime, si.data.MaxDoubleBuffTime);
        }
    }
    class $a extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainLuckyWheel");
        }
        onConstruct() {
            this.m_State = this.getControllerAt(0), this.m_close = this.getChildAt(0), this.m_wheel = this.getChildAt(2),
                this.m_btn_start = this.getChildAt(5), this.m_text_residue = this.getChildAt(7),
                this.m_btn_WatchAd = this.getChildAt(11), this.m_btn_thanks = this.getChildAt(12);
        }
    }
    $a.URL = "ui://8nmf3q47kcbydw";
    class tn extends Ue {
        constructor() {
            super(), this.itemList = [], this.totalWeight = 0, this._layer = qt.Main, this._runtimeIndex = -1;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new tn(), this.m_instance._classDefine = $a),
                this.m_instance;
        }
        InitArray() {
            this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.Money,
                count: 86664
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.Diamond,
                count: 20
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.MuchMoney,
                count: 173328
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.Diamond,
                count: 40
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.Money,
                count: 21666
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.MuchDiamond,
                count: 100
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.Diamond,
                count: 80
            }), this.itemList.push({
                weight: 10,
                progress: 0,
                type: Ga.LotsMoney,
                count: 256666
            });
            for (let t of this.itemList) this.totalWeight += t.weight, t.progress = this.totalWeight;
        }
        GetRandomItemIndex() {
            let t = ye.RangeInt(0, this.totalWeight);
            for (let e = 0; e < this.itemList.length; e++) if (this.itemList[e].progress > t) return e;
        }
        GetAngle(t) {
            return -45 * t;
        }
        _OnShow() {
            super.Show();
            window["LuckyWheel"] = this.ui;
            let LuckyWheel = this.ui;
            LuckyWheel._children[4].text = "Lucky draw";
            LuckyWheel._children[11]._children[2].text = "Spin";
            LuckyWheel._children[11]._children[2].x = 100;
            LuckyWheel._children[11]._children[2].y = 16;
            LuckyWheel._children[12]._children[2].text = "No,thanks";
            LuckyWheel._children[12]._children[2].x = 30;
            LuckyWheel._children[12]._children[2].y = 22;
            LuckyWheel._children[5]._children[2].text = "Spin";
            LuckyWheel._children[5]._children[2].y = 28;
            LuckyWheel._children[5]._children[2].x = 50;
            LuckyWheel._children[5]._children[3].text = "2/2";
            LuckyWheel._children[6].text = "Last watch time:";
            Laya.timer.frameOnce(1, this, () => {
                LuckyWheel._children[7].x = 500;
                LuckyWheel._children[7].y = 1151;
            })
            // LuckyWheel._children[7]//剩余观看次数
            YYGGames.gameBox.visible = false;
            this.InitArray(), this.ui.m_btn_thanks.onClick(this, this.Close),
                this.ui.m_btn_WatchAd.on(Laya.Event.CLICK, this, this.OnWatchAd), this.ui.m_btn_start.on(Laya.Event.CLICK, this, this.OnClickBtnStart),
                this.RenderWheel(), this.UpdatePanel(), Ge.trackEvent(Kt.LuckWheel);
        }
        UpdatePanel() {
            let t = si.instance.Data.LuckWheelAdDayNum < si.instance.Data.LuckWheelAdMaxDayNum;
            this.ui.m_State.selectedIndex = t ? si.data.LuckWheelAdDayNum >= 2 ? 0 : 1 : 2,
                this.ui.m_btn_start.m_text_num.text = si.data.LuckWheelStartCount + "/2";
            let e = si.data.LuckWheelAdMaxDayNum - si.data.LuckWheelAdDayNum;
            e = e < 0 ? 0 : e, this.ui.m_text_residue.text = e.toString();
        }
        RenderWheel() {
            this.ui.m_wheel.m_item_0.m_type.selectedIndex = this.itemList[0].type, this.ui.m_wheel.m_item_0.m_num.text = "x" + this.itemList[0].count.toString(),
                this.ui.m_wheel.m_item_1.m_type.selectedIndex = this.itemList[1].type, this.ui.m_wheel.m_item_1.m_num.text = "x" + this.itemList[1].count.toString(),
                this.ui.m_wheel.m_item_2.m_type.selectedIndex = this.itemList[2].type, this.ui.m_wheel.m_item_2.m_num.text = "x" + this.itemList[2].count.toString(),
                this.ui.m_wheel.m_item_3.m_type.selectedIndex = this.itemList[3].type, this.ui.m_wheel.m_item_3.m_num.text = "x" + this.itemList[3].count.toString(),
                this.ui.m_wheel.m_item_4.m_type.selectedIndex = this.itemList[4].type, this.ui.m_wheel.m_item_4.m_num.text = "x" + this.itemList[4].count.toString(),
                this.ui.m_wheel.m_item_5.m_type.selectedIndex = this.itemList[5].type, this.ui.m_wheel.m_item_5.m_num.text = "x" + this.itemList[5].count.toString(),
                this.ui.m_wheel.m_item_6.m_type.selectedIndex = this.itemList[6].type, this.ui.m_wheel.m_item_6.m_num.text = "x" + this.itemList[6].count.toString(),
                this.ui.m_wheel.m_item_7.m_type.selectedIndex = this.itemList[7].type, this.ui.m_wheel.m_item_7.m_num.text = "x" + this.itemList[7].count.toString();
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.LuckyWheel,
                state: !1
            }], !1);
        }
        OnWatchAd() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), Ge.trackEvent(Kt.LuckWheelAD), this.isShow && this.Turn();
            })
        }
        OnClickBtnStart() {
            this.Turn();
        }
        Turn() {
            this._runtimeIndex = this.GetRandomItemIndex();
            let t = this.GetAngle(this._runtimeIndex) + 1800 + ye.RangeInt(-20, 20);
            this.ui.m_wheel.rotation %= 360, Laya.Tween.clearAll(this.ui.m_wheel), Laya.Tween.to(this.ui.m_wheel, {
                rotation: t
            }, 3e3, Laya.Ease.sineOut, new Laya.Handler(this, this.CallBackTurn)), this.ui.m_btn_start.off(Laya.Event.CLICK, this, this.OnClickBtnStart),
                this.ui.m_close.off(Laya.Event.CLICK, this, this.Close);
        }
        CallBackTurn() {
            if (-1 == this._runtimeIndex) return;
            si.data.LuckWheelStartCount--, si.data.LuckWheelAdDayNum++;
            let t = this.itemList[this._runtimeIndex];
            t.type == Ga.Money || t.type == Ga.MuchMoney || t.type == Ga.LotsMoney ? (Ui.PlayMoneyEffect(this.ui.m_wheel),
                si.Money += t.count) : (Ui.PlayDiamondEffect(this.ui.m_wheel), si.Diamond += t.count),
                this._runtimeIndex = -1, this.UpdatePanel(), this.ui.m_btn_start.on(Laya.Event.CLICK, this, this.OnClickBtnStart),
                this.ui.m_close.on(Laya.Event.CLICK, this, this.Close), Laya.Tween.clearAll(this.ui.m_wheel);
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            Laya.Tween.clearAll(this.ui.m_wheel);
        }
    }
    !function (t) {
        t[t.Money = 0] = "Money", t[t.MuchMoney = 1] = "MuchMoney", t[t.Diamond = 2] = "Diamond",
            t[t.MuchDiamond = 3] = "MuchDiamond", t[t.LotsMoney = 4] = "LotsMoney";
    }(Ga || (Ga = {}));
    !function (t) {
        t[t.diamond = 0] = "diamond", t[t.money = 1] = "money";
    }(Na || (Na = {}));
    class en extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameTask");
        }
        onConstruct() {
            this.m_achieve = this.getControllerAt(0), this.m_close = this.getChildAt(0), this.m_btn_close = this.getChildAt(3),
                this.m_title = this.getChildAt(4), this.m_taskProgress = this.getChildAt(6), this.m_text_taskDesc = this.getChildAt(9),
                this.m_text_progress = this.getChildAt(11), this.m_txt_reward = this.getChildAt(13),
                this.m_btn_go = this.getChildAt(14), this.m_btn_getDouble = this.getChildAt(15),
                this.m_btn_get = this.getChildAt(16);
        }
    }
    en.URL = "ui://8nmf3q47jfuc1b9";
    class sn extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new sn(), this.m_instance._classDefine = en),
                this.m_instance;
        }
        _OnShow() {
            window["Task"] = this.ui;
            let Task = this.ui;
            Task._children[4].width = 600;
            Task._children[4].fontSize = 30;
            Task._children[4].x = 70;
            Task._children[5].text = "Task Reward:";
            Task._children[11].y = 550;
            Task._children[14]._children[2].text = 'Go';
            Task._children[14]._children[2].x = 115;

            Task._children[14]._children[2].y = 32;
            Task._children[15]._children[2].text = "Claim×2";
            Task._children[15]._children[2].x = 70;
            Task._children[15]._children[2].y = 18;
            Task._children[15]._children[1].x = 22;
            Task._children[16]._children[2].text = "Claim";
            Task._children[16]._children[2].x = 66;
            Task._children[16]._children[2].y = 22;

            YYGGames.gameBox.visible = false;

            super.Show(), this.ui.m_btn_close.onClick(this, this.Close), this.ui.m_close.onClick(this, this.Close),
                this.ui.m_btn_get.onClick(this, this.OnClick1x), this.ui.m_btn_getDouble.onClick(this, this.OnClick2x),
                this.ui.m_btn_go.onClick(this, () => {
                    YYGGames.showInterstitial(() => {
                        Ge.trackEvent(Kt.Task, {
                            ClickGO: "Go"
                        }), Xi.instance.currentTask.Go(), this.Close();
                    })
                }), $.instance.onUI(Mt.UpdateTaskProgress, this, this.UpdateTaskProgress), this.UpdateTaskProgress(),
                Ge.trackEvent(Kt.Task, {
                    OpenTaskUI: "UI"
                });
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.Task,
                state: !1
            }], !1);
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
            $.instance.offUI(Mt.UpdateTaskProgress, this, this.UpdateTaskProgress);
        }
        OnClick1x() {
            let t = Xi.instance.currentTask;
            this.AddReward(t.reward, t.rewardType), Ge.trackEvent(Kt.Task, {
                GetReward: "1X"
            });
        }
        OnClick2x() {
            Ge.trackEvent(Kt.Task, {
                GetReward: "2X"
            });
            YYGGames.showReward(() => {
                Is.PlayAudio();
                let t = Xi.instance.currentTask;
                this.AddReward(2 * t.reward, t.rewardType);
            })
        }
        AddReward(t, e) {
            e == Na.money ? si.Money += t : e == Na.diamond && (si.Diamond += t, this.isShow && Ui.PlayDiamondEffect(this.ui.m_txt_reward)),
                Xi.instance.DoNext();
        }
        UpdateTaskProgress() {
            let t = Xi.instance.currentTask;
            null != t ? this.isShow && (this.ui.m_taskProgress.value = t.progress, this.ui.m_text_progress.text = t.toProgressString(),
                this.ui.m_text_taskDesc.text = t.describe, this.ui.m_title.text = t.name, this.ui.m_txt_reward.text = t.reward.toString(),
                this.ui.m_achieve.selectedIndex = t.progress >= 100 ? 1 : 0) : this.Close();
        }
    }
    class an extends fairygui.GComponent {
        constructor() {
            super();
        }
        static createInstance() {
            return fairygui.UIPackage.createObject("EffectLayer", "MoneyEffect");
        }
        onConstruct() {
            this.m_momeyEffect = this.getTransitionAt(0);
        }
    }
    an.URL = "ui://c2q7aw0bgywm1";
    class nn extends Ue {
        constructor() {
            super(), this._layer = qt.Top;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new nn(), this.m_instance._classDefine = an),
                this.m_instance;
        }
        _OnShow() {
            super._OnShow(), this.ui.m_momeyEffect.play(), Laya.timer.once(2200, this, this.ClosePanel);
        }
        ClosePanel() {
            Ve.instance.setUIState([{
                typeIndex: Zt.UIMoneyEffect,
                state: !1
            }], !1);
        }
    }
    class on extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainCheers");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(1), this.m_txt_Peoples = this.getChildAt(2), this.m_btn_Start = this.getChildAt(5),
                this.m_btn_thanks = this.getChildAt(6);
        }
    }
    on.URL = "ui://8nmf3q47b3xq1aa";
    class rn extends Ue {
        constructor() {
            super(), this.peoples = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new rn(), this.m_instance._classDefine = on),
                this.m_instance;
        }
        _OnShow() {
            window["UIMediatorCheers"] = this.ui;
            let UIMediatorCheers = this.ui;
            UIMediatorCheers._children[1]._children[4].text = "Cheers!";
            UIMediatorCheers._children[1]._children[4].y = 10;
            UIMediatorCheers._children[2].text = "12 extra guests";
            UIMediatorCheers._children[4].text = "Host an orgy and bring in a large group of guests";
            UIMediatorCheers._children[5]._children[2].text = "Accept";
            UIMediatorCheers._children[6]._children[2].text = "No,thanks";
            UIMediatorCheers._children[6]._children[2].x = 33;
            UIMediatorCheers._children[6]._children[2].y = 22;
            UIMediatorCheers._children[2].y = 600;
            YYGGames.gameBox.visible = false;
            this.peoples = ye.RangeInt(10, 20), this.ui.m_bg.m_btn_close.onClick(this, this.OnClickBtnClose),
                this.ui.m_btn_Start.getChildAt(1).visible = true,
                this.ui.m_btn_Start.getChildAt(2).x = 90;
            this.ui.m_btn_Start.getChildAt(2).y = 18;
            this.ui.m_btn_thanks.onClick(this, this.OnClickBtnClose), this.ui.m_btn_Start.onClick(this, this.OnClickWatchAD),
                this.ui.m_txt_Peoples.text = "Extra " + this.peoples + " guests", Ge.trackEvent(Kt.WorldEvent, {
                    cheers: "UI"
                });
            this.ui.m_txt_Peoples.y = 600;
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
        }
        OnClickBtnClose() {
            Ve.instance.setUIState([{
                typeIndex: Zt.UIMediatorCheers,
                state: !1
            }], !1), os.instance.RemoveADUtility(re.Cheers);
        }
        OnClickWatchAD() {
            console.log("看广告！+19人"),

                YYGGames.showReward(() => {
                    Is.PlayAudio(), is.instance.AddPeopleOnWatchAD(this.peoples), Ge.trackEvent(Kt.WorldEvtAD, {
                        cheers: "AD"
                    }), this.isShow && this.OnClickBtnClose();
                })

        }
    }
    class ln extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainInfluencer");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(1), this.m_text_money = this.getChildAt(6), this.m_btn_Start = this.getChildAt(7),
                this.m_btn_thanks = this.getChildAt(8);
        }
    }
    ln.URL = "ui://8nmf3q47b3xq1a6";
    class hn extends Ue {
        constructor() {
            super(), this.money = 0;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new hn(), this.m_instance._classDefine = ln),
                this.m_instance;
        }
        _OnShow() {
            window["UIMediatorInfluencer"] = this.ui;
            this.money = 8 * Xe.instance.GetTotalMoney(), this.ui.m_bg.m_btn_close.onClick(this, this.OnClickBtnClose),
                // this.ui.m_btn_Start.getChildAt(1).visible = !1,
                // this.ui.m_btn_Start.getChildAt(2).x = 50
                this.ui.m_btn_thanks.onClick(this, this.OnClickBtnClose), this.ui.m_btn_Start.onClick(this, this.OnClickWatchAD),
                this.ui.m_text_money.text = qe.DoConverter(this.money), this.isGuide = !Be.IsCompleteAllGuide,
                Ge.trackEvent(Kt.WorldEvent, {
                    influencer: "UI"
                });
            let UIMediatorInfluencer = this.ui;
            UIMediatorInfluencer._children[1]._children[4].text = "Netflix Hosts";
            UIMediatorInfluencer._children[1]._children[4].y = 12;

            UIMediatorInfluencer._children[2].text = "Benefit";
            UIMediatorInfluencer._children[4].text = "Your toilet is beautiful, can I send it to my followers?";
            UIMediatorInfluencer._children[7]._children[2].text = "Accept";
            UIMediatorInfluencer._children[7]._children[2].x = 90;
            UIMediatorInfluencer._children[7]._children[2].y = 16;
            UIMediatorInfluencer._children[8]._children[2].text = "No,thanks";

            UIMediatorInfluencer._children[8]._children[2].x = 32;
            UIMediatorInfluencer._children[8]._children[2].y = 22;
            YYGGames.gameBox.visible = false;

        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
        }
        OnClickBtnClose() {
            Ve.instance.setUIState([{
                typeIndex: Zt.UIMediatorInfluencer,
                state: !1
            }], !1), os.instance.RemoveADUtility(re.NetRed), $.instance.event3D(L.NetRedLeaveWC);
        }
        OnClickWatchAD() {
            // si.Money += 100000000000;
            // si.Diamond += 10000000000;
            if (!Be.IsCompleteAllGuide) return Ui.PlayMoneyEffect(this.ui.m_btn_Start), os.instance.RemoveADUtility(re.NetRed),
                this.OnClickBtnClose(), $.instance.event3D(L.NetRedLeaveWC), void (this.isGuide && $.instance.eventUI(Mt.GuideToNext));
            console.log("看广告！+钱" + this.money);
            YYGGames.showReward(() => {
                Is.PlayAudio(), si.Money += this.money, this.money = 0, Ge.trackEvent(Kt.WorldEvtAD, {
                    influencer: "AD"
                }), this.isShow && (Ui.PlayMoneyEffect(this.ui.m_btn_Start), this.OnClickBtnClose()),
                    this.isGuide && $.instance.eventUI(Mt.GuideToNext);
            })
        }
    }
    class cn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainRepairMaster");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(1), this.m_btn_start = this.getChildAt(5), this.m_btn_thanks = this.getChildAt(6);
        }
    }
    cn.URL = "ui://8nmf3q47b3xq1a9";
    class dn extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new dn(), this.m_instance._classDefine = cn),
                this.m_instance;
        }
        _OnShow() {
            window["UIMeditorRepairGame"] = this.ui;
            this.ui.m_bg.m_btn_close.onClick(this, this.Close), this.ui.m_btn_thanks.onClick(this, this.Close),
                this.ui.m_btn_start.getChildAt(1).visible = true,
                this.ui.m_btn_start.getChildAt(2).x = 90;
            this.ui.m_btn_start.getChildAt(2).y = 18;

            let UIMeditorRepairGame = this.ui;
            UIMeditorRepairGame._children[1]._children[4].text = "Repair competition";
            UIMeditorRepairGame._children[1]._children[4].width = 500;
            UIMeditorRepairGame._children[1]._children[4].y = 10;
            UIMeditorRepairGame._children[2].text = "Repair (and clean) all facilities immediately";
            UIMeditorRepairGame._children[2].fontSize = 24;
            Laya.timer.frameOnce(1, this, () => {
                UIMeditorRepairGame._children[2].y = 605;
            })
            UIMeditorRepairGame._children[4].text = "The repair competition begins to see who can repair faster and more!";
            UIMeditorRepairGame._children[5]._children[2].text = "Accept";
            UIMeditorRepairGame._children[6]._children[2].text = "No,thanks";
            UIMeditorRepairGame._children[6]._children[2].x = 33;
            UIMeditorRepairGame._children[6]._children[2].y = 22;
            YYGGames.gameBox.visible = false;

            this.ui.m_btn_start.onClick(this, this.OnWatchAd), Ge.trackEvent(Kt.WorldEvent, {
                repairGame: "UI"
            });

        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.UIMeditorRepairGame,
                state: !1
            }], !1), os.instance.RemoveADUtility(re.RepairGame);
        }
        OnWatchAd() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), rs.instance.RepairCompleteNow(), Ge.trackEvent(Kt.WorldEvtAD, {
                    repairGame: "AD"
                }), this.Close();
            })
        }
    }
    class mn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainSpeedUp");
        }
        onConstruct() {
            this.m_dark_bg = this.getChildAt(0), this.m_bg = this.getChildAt(1), this.m_btn_start = this.getChildAt(5),
                this.m_btn_thanks = this.getChildAt(6);
        }
    }
    mn.URL = "ui://8nmf3q47b3xq19y";
    class un extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new un(), this.m_instance._classDefine = mn),
                this.m_instance;
        }
        _OnShow() {
            window["UIMediatorSpeedUp"] = this.ui;
            let UIMediatorSpeedUp = this.ui;
            UIMediatorSpeedUp._children[1]._children[4].text = "Unobstructed";
            UIMediatorSpeedUp._children[1]._children[4].y = 12;
            UIMediatorSpeedUp._children[2].text = "Rush to the toilet lasts 2 minutes";
            UIMediatorSpeedUp._children[2].x = 135;
            UIMediatorSpeedUp._children[2].y = 600;
            UIMediatorSpeedUp._children[4].text = "Everyone will go to the toilet much faster";
            UIMediatorSpeedUp._children[5].text = "Accept";
            UIMediatorSpeedUp._children[5]._children[2].y = 16;
            UIMediatorSpeedUp._children[6].text = "No,thanks";
            UIMediatorSpeedUp._children[6]._children[2].y = 22;
            UIMediatorSpeedUp._children[6]._children[2].x = 33;
            YYGGames.gameBox.visible = false;

            this.ui.m_bg.m_btn_close.onClick(this, this.Close), this.ui.m_btn_thanks.onClick(this, this.Close),
                this.ui.m_btn_start.getChildAt(1).visible = true,
                this.ui.m_btn_start.getChildAt(2).x = 90;
            this.ui.m_btn_start.getChildAt(2).y = 18;

            this.ui.m_btn_start.onClick(this, this.OnWatchAd), Ge.trackEvent(Kt.WorldEvent, {
                speedUp: "UI"
            });
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
        }
        Close() {
            Ve.instance.setUIState([{
                typeIndex: Zt.UIMediatorSpeedUp,
                state: !1
            }], !1), os.instance.RemoveADUtility(re.SpeedUp);
        }
        OnWatchAd() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), si.speedUpTime = 12e4, Ge.trackEvent(Kt.WorldEvtAD, {
                    speedUp: "AD"
                }), this.Close();
            })
        }
    }
    class _n extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "PGameMainDaily");
        }
        onConstruct() {
            this.m_c1 = this.getControllerAt(0), this.m_btn_close = this.getChildAt(5), this.m_day_1 = this.getChildAt(6),
                this.m_SignInBtn = this.getChildAt(7), this.m_day_2 = this.getChildAt(8), this.m_SignInBtn2 = this.getChildAt(9),
                this.m_day_3 = this.getChildAt(10), this.m_SignInBtn3 = this.getChildAt(11), this.m_day_4 = this.getChildAt(12),
                this.m_SignInBtn4 = this.getChildAt(13), this.m_day_5 = this.getChildAt(14), this.m_SignInBtn5 = this.getChildAt(15),
                this.m_day_6 = this.getChildAt(16), this.m_SignInBtn6 = this.getChildAt(17), this.m_day_7 = this.getChildAt(18),
                this.m_SignInBtn7 = this.getChildAt(19), this.m_btn_ad = this.getChildAt(21), this.m_btn_get = this.getChildAt(22);
        }
    }
    _n.URL = "ui://8nmf3q47b3xq1ab";
    class gn extends Ue {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new gn(), this.m_instance._classDefine = _n),
                this.m_instance;
        }
        _OnShow() {
            window["DailySign"] = this.ui;
            let DailySign = this.ui;
            DailySign._children[4].text = "Daily Login";
            DailySign._children[22]._children[2].text = "Claim";
            DailySign._children[22]._children[2].x = 66;
            DailySign._children[22]._children[2].y = 22;
            DailySign._children[21]._children[2].text = "Claim×2";
            DailySign._children[21]._children[2].x = 70;
            DailySign._children[21]._children[2].y = 18;
            DailySign._children[21]._children[1].x = 20;//AD样式x值
            DailySign._children[7]._children[2].x = 80;
            DailySign._children[7]._children[2].y = 9;
            DailySign._children[9]._children[2].x = 80;
            DailySign._children[9]._children[2].y = 9;
            DailySign._children[11]._children[2].x = 80;
            DailySign._children[11]._children[2].y = 9;
            DailySign._children[13]._children[2].x = 80;
            DailySign._children[13]._children[2].y = 9;
            DailySign._children[15]._children[2].x = 80;
            DailySign._children[15]._children[2].y = 9;
            DailySign._children[17]._children[2].x = 80;
            DailySign._children[17]._children[2].y = 9;
            DailySign._children[19]._children[2].x = 160;
            DailySign._children[19]._children[2].y = 9;


            this.ui.m_btn_get.onClick(this, this.OnClickGet), this.ui.m_btn_close.onClick(this, this.OnClickClose),
                this.ui.m_btn_ad.onClick(this, this.OnClickAd), this.UpdateShow(), Be.IsCompleteAllGuide ? this.isGuide = !1 : this.isGuide = !0;
            YYGGames.gameBox.visible = false;
        }
        _OnHide() {
            YYGGames.gameBox.visible = true;
        }
        UpdateShow() {
            let t = si.data.signDay;
            this.ui.m_day_1.m_bgColor.selectedIndex = t <= 0 ? 0 : 1, this.ui.m_day_2.m_bgColor.selectedIndex = t <= 1 ? 0 : 1,
                this.ui.m_day_3.m_bgColor.selectedIndex = t <= 2 ? 0 : 1, this.ui.m_day_4.m_bgColor.selectedIndex = t <= 3 ? 0 : 1,
                this.ui.m_day_5.m_bgColor.selectedIndex = t <= 4 ? 0 : 1, this.ui.m_day_6.m_bgColor.selectedIndex = t <= 5 ? 0 : 1,
                this.ui.m_day_7.m_bgColor.selectedIndex = t <= 6 ? 0 : 1;
        }
        OnClickAd() {
            YYGGames.showReward(() => {
                Is.PlayAudio(), this.GetDailyReward(2);
            })
        }
        OnClickGet() {
            this.GetDailyReward(1);
        }
        GetDailyReward(t = 1) {
            switch (this.isShow && Ui.PlayDiamondEffect(this.ui.m_btn_get), si.data.signDay) {
                case 1:
                case 2:
                    si.Diamond += 50 * t;
                    break;

                case 3:
                    si.Diamond += 60 * t;
                    break;

                case 4:
                    si.Diamond += 70 * t;
                    break;

                case 5:
                    si.Diamond += 80 * t;
                    break;

                case 6:
                    si.Diamond += 100 * t;
                    break;

                default:
                    si.Diamond += 30 * t;
            }
            si.instance.AddSignDay(), si.data.hasSign = !0, this.OnClickClose(), this.isGuide && $.instance.eventUI(Mt.GuideToNext);
        }
        OnClickClose() {
            Ve.instance.setUIState([{
                typeIndex: Zt.DailySign,
                state: !1
            }], !1);
        }
    }
    class fn extends Oa {
        constructor() {
            super();
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new fn()), this.m_instance;
        }
        initUIMediator() {
            this.m_UIMediator = {
                [Zt.GameLoading]: qs.instance,
                [Zt.CustomsLoading]: Xs.instance,
                [Zt.TestMain]: la.instance,
                [Zt.TestPlatform]: Ra.instance,
                [Zt.Set]: ia.instance,
                [Zt.Play]: Ks.instance,
                [Zt.Start]: Zs.instance,
                [Zt.Pause]: ta.instance,
                [Zt.Com]: aa.instance,
                [Zt.End]: oa.instance,
                [Zt.Main]: os.instance,
                [Zt.Manager]: Ma.instance,
                [Zt.EventLayer]: Za.instance,
                [Zt.AD]: Xa.instance,
                [Zt.LuckyWheel]: tn.instance,
                [Zt.Setting]: Ss.instance,
                [Zt.Task]: sn.instance,
                [Zt.Staff]: Ns.instance,
                [Zt.EventPanel]: je.instance,
                [Zt.TopPanel]: ki.instance,
                [Zt.StaffMarket]: Bs.instance,
                [Zt.StaffInfoPanel]: Gs.instance,
                [Zt.Guide]: Rs.instance,
                [Zt.OffLineIncomePanel]: Ws.instance,
                [Zt.UIMoneyEffect]: nn.instance,
                [Zt.UIMediatorCheers]: rn.instance,
                [Zt.UIMediatorInfluencer]: hn.instance,
                [Zt.UIMeditorRepairGame]: dn.instance,
                [Zt.UIMediatorSpeedUp]: un.instance,
                [Zt.UIMediatorFlyPanel]: Ai.instance,
                [Zt.DailySign]: gn.instance,
                [Zt.OpenCoffee]: Cs.instance,
                [Zt.CountDownTime]: ws.instance,
                [Zt.RecordVideo]: ns.instance,
                [Zt.TalkPanel]: We.instance
            }, this.m_UIProxy = Ve.instance;
        }
        init() { }
        Start() {
            this.m_UIProxy.Start();
        }
    }
    class pn {
        constructor() {
            this.m_GameIfInit = !1;
        }
        static get instance() {
            return this.m_instance || (this.m_instance = new pn()), this.m_instance;
        }
        init() { }
        get gameIfInit() {
            return this.m_GameIfInit;
        }
        GameInit() {
            this.m_GameIfInit = !1, $.instance.eventGlobal(Yt.GameInit);
        }
        GameOnInit() {
            this.m_GameIfInit = !0, $.instance.eventGlobal(Yt.GameOnInit);
        }
    }
    class yn extends st { }
    class Sn extends ot {
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class In extends ot {
        constructor() {
            super(...arguments), this.onCustomsData = new Sn();
        }
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class Cn extends yn {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Cn()), this._instance;
        }
        InitData() {
            this._shortData = new In();
        }
        static get shortData() {
            return this._instance._shortData.clone();
        }
        static get getEditableOnCustomData() {
            return this._instance._shortData.onCustomsData;
        }
        static initShortData() { }
        static syncShortData() { }
        static emptyGameOnCustomData() {
            this._instance._shortData = new In();
        }
    }
    class wn {
        constructor() { }
        static get instance() {
            return this.m_instance || (this.m_instance = new wn()), this.m_instance;
        }
        init() {
            $.instance.on3D(L.GameLevelsBuildBefore, this, this.gameLevelsBuildBefore), $.instance.on3D(L.GameLevelsOnBuild, this, this.gameLevelsOnBuild),
                $.instance.on3D(L.GameLevelsDelete, this, this.gameLevelsDelete), $.instance.on3D(L.GameStart, this, this.gameStart);
        }
        gameLevelsBuildBefore() {
            Cn.emptyGameOnCustomData();
        }
        gameLevelsOnBuild() { }
        gameLevelsDelete() { }
        gameStart() { }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/TestConst.json";
    }(Fa || (Fa = {}));
    class bn extends U {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new bn()), this._instance;
        }
        get data() { }
        initData() {
            this.m_data = Fa.data;
        }
        get ifDebug() {
            return !tt.OnLine && this.m_data.if_debug;
        }
        get ifShowOimoMesh() {
            return !tt.OnLine && this.m_data.if_show_oimo_mesh;
        }
        get oimoMeshDiaphaneity() {
            return this.m_data.oimo_mesh_diaphaneity;
        }
    }
    !function (t) {
        t.BGMSuspend = "_EEventAudio_BGMSuspend", t.BGMGoOn = "_EEventAudio_BGMGoOn", t.SoundSuspend = "_EEventAudio_SoundSuspend",
            t.SoundGoOn = "_EEventAudio_SoundGoOn", t.BGMVolumeChange = "_EEventAudio_BGMVolumeChange",
            t.SoundVolumeChange = "_EEventAudio_BGMVolumeChange";
    }(Va || (Va = {}));
    class Ln {
        constructor() { }
        static get instance() {
            return null == this._instance && (this._instance = new Ln()), this._instance;
        }
        init() {
            $.instance.onAudio(Va.BGMSuspend, this, this.BGMsuSpend), $.instance.onAudio(Va.BGMGoOn, this, this.BGMGoOn),
                $.instance.onAudio(Va.SoundSuspend, this, this.soundSuspend), $.instance.onAudio(Va.SoundGoOn, this, this.soundGoOn),
                $.instance.onAudio(Va.BGMVolumeChange, this, this.bgmVolumeChange), $.instance.onAudio(Va.SoundVolumeChange, this, this.soundVolumeChange);
        }
        BGMsuSpend() {
            ps.instance.stopBGM();
        }
        BGMGoOn() {
            ps.instance.BGMGoOn();
        }
        soundSuspend() {
            ps.instance.soundSuspend();
        }
        soundGoOn() {
            ps.instance.soundGoOn();
        }
        bgmVolumeChange(t = 1) {
            Laya.SoundManager.setMusicVolume(t);
        }
        soundVolumeChange(t = 1) {
            Laya.SoundManager.setSoundVolume(t);
        }
    }
    class xn {
        constructor() { }
        static get instance() {
            return null == this._instance && (this._instance = new xn()), this._instance;
        }
        enterGame() {
            this.initGame(), this._startGame(), this.startGame();
        }
        initGame() {
            pn.instance.init(), $.instance.init(), Ln.instance.init(), wn.instance.init(), Ct.instance.init(),
                fn.instance.init(), Hs.instance.init();
        }
        _startGame() {
            bn.instance.ifDebug ? Laya.Stat.show() : Laya.Stat.hide();
        }
        startGame() {
            fn.instance.Start(), Hs.instance.initLevelBuild();
        }
    }
    class vn {
        static get needLoadCount() {
            return this._configList.length;
        }
        static AddConfig(t) {
            vn._configList.push(t);
        }
        static AddExtraConfig(t) {
            t.length > 0 && (vn._extraConfig.push(...t), vn._extraConfig = y.Unique(vn._extraConfig));
        }
        static StartLoad(t, e = null) {
            if (0 == vn._configList.length) return void (t && t.run());
            var i = [];
            for (let t of vn._configList) i.push(p.ConfigURL(t.path.match(/[a-zA-Z0-9.]*$/)[0]));
            let s = [];
            i.forEach(t => {
                s.push(t);
            }), i.push(...this._extraConfig), Laya.loader.create(i, Laya.Handler.create(this, () => {
                for (let t of vn._configList) {
                    t.data = Laya.loader.getRes(p.ConfigURL(t.path.match(/[a-zA-Z0-9.]*$/)[0])), t.dataList = [];
                    for (let e in t.data) {
                        let i = t.data[e];
                        null != i && t.dataList.push(i);
                    }
                    t.dataList.length > 0 && (t.lastData = t.dataList[t.dataList.length - 1]);
                }
                t && t.run(), s.forEach(t => {
                    a.Unload(t);
                });
            }), e);
        }
    }
    vn._configList = [], vn._extraConfig = [], function (t) {
        t.config = class { }, t.path = "res/config/GameConst.json";
    }(Wa || (Wa = {}));
    class An {
        constructor(t, e = -1, i) {
            this.packPath = t, this.atliasCount = e, this.m_extraURL = i;
        }
        PushUrl(t) {
            if (t.push({
                url: this.packPath + ".bin",
                type: Laya.Loader.BUFFER
            }), this.m_extraURL && this.m_extraURL.length > 0 && t.push(...this.m_extraURL),
                this.atliasCount >= 0) {
                t.push({
                    url: this.packPath + "_atlas0.png",
                    type: Laya.Loader.IMAGE
                });
                for (let e = 1; e <= this.atliasCount; e++) t.push({
                    url: this.packPath + "_atlas0_" + e + ".png",
                    type: Laya.Loader.IMAGE
                });
            }
        }
        AddPackage() {
            fgui.UIPackage.addPackage(this.packPath);
        }
    }
    class Pn extends rt { }
    class Dn extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Dn()), this._instance;
        }
        static get comData() {
            return this._instance._saveData;
        }
        get _saveName() {
            return "->CommonDataSave<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        getNewData() {
            return new Pn();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    class kn {
        constructor() {
            this._needLoadOtherUIPack = [], this._loadProgressWeight = {
                config: 1,
                gameRes: 5,
                otherUI: 3
            }, this._configProgress = 0, this._otherUIProgress = 0, this._resProgress = 0;
        }
        get loadProgress() {
            let t = 0;
            for (let e in this._loadProgressWeight) t += this._loadProgressWeight[e];
            return (this._loadProgressWeight.config * this._configProgress + this._loadProgressWeight.gameRes * this._resProgress + this._loadProgressWeight.otherUI * this._otherUIProgress) / t * 100;
        }
        Enter(t, e, i) {
            this.m_handlerThis = t, this.m_beforeHandler = e, this.m_backHandler = i, this.Init();
        }
        _Init() { }
        Init() {
            let t = this._Init(), e = () => {
                this.initEmptyScreen();
            };
            t ? t.then(() => {
                e();
            }) : e();
        }
        initEmptyScreen() {
            M.instance.init(), ke.Init(), this.OnBindUI();
            let t = [];
            this._initEmptyScreen.PushUrl(t), 0 != t.length ? Laya.loader.load(t, Laya.Handler.create(this, this.InitUI)) : this.InitUI();
        }
        InitUI() {
            this._initEmptyScreen.AddPackage(), this._OnInitEmptyScreen();
            let t = () => {
                let t = [];
                this._initUiPack.PushUrl(t), 0 != t.length ? Laya.loader.load(t, Laya.Handler.create(this, this.OnInitUILoaded)) : this.OnInitUILoaded();
            };
            this.m_beforeHandler ? this.m_beforeHandler.call(this.m_handlerThis).then(() => {
                t();
            }) : t();
        }
        OnInitUILoaded() {
            this._initUiPack.AddPackage(), this._OnInitUILoaded(), this.onLoading(this.loadProgress),
                this.OnConfigLoaded();
        }
        OnConfigLoaded() {
            this.OnSetLoadConfig();
            let t = [];
            for (let e in c) c[e] && t.push(p.levelConfigURL(c[e]));
            if (vn.AddExtraConfig(t), vn.needLoadCount <= 0) return this._OnConfigProgress(1),
                void this._OnConfigLoaded();
            vn.StartLoad(Laya.Handler.create(this, this._OnConfigLoaded), Laya.Handler.create(this, this._OnConfigProgress, null, !1));
        }
        _OnConfigProgress(t) {
            this._configProgress = t, this.onLoading(this.loadProgress);
        }
        _OnConfigLoaded() {
            M.instance.initConfig();
            let t = [];
            for (let e = 0; e < this._needLoadOtherUIPack.length; ++e) this._needLoadOtherUIPack[e].PushUrl(t);
            if (0 == t.length) return this._OnOtherUIProgress(1), void this._OnOtherUILoaded();
            Laya.loader.load(t, Laya.Handler.create(this, this._OnOtherUILoaded), Laya.Handler.create(this, this._OnOtherUIProgress, null, !1));
        }
        _OnOtherUIProgress(t) {
            this._otherUIProgress = t, this.onLoading(this.loadProgress);
        }
        _OnOtherUILoaded() {
            for (let t = 0; t < this._needLoadOtherUIPack.length; ++t) this._needLoadOtherUIPack[t].AddPackage();
            let t = [];
            if (this.OnGameResPrepared(t), t.push(...p.EssentialOtherResUrl()), M.instance.Preload(t),
                0 == t.length) return this._OnResProgress(1), void this._OnResLoaded();
            Laya.loader.create(t, Laya.Handler.create(this, this._OnResLoaded), Laya.Handler.create(this, this._OnResProgress, null, !1));
        }
        _OnResProgress(t) {
            this._resProgress = t, this.onLoading(this.loadProgress);
        }
        _OnResLoaded() {
            X.InitAll(), this.loginCommonData(), this.loginData(), this.m_backHandler ? this.m_backHandler.call(this.m_handlerThis).then(() => {
                this.OnComplete();
            }) : this.OnComplete();
        }
        loginCommonData() {
            Dn.instance.InitData();
        }
        OnBindUI() { }
        OnSetLoadConfig() { }
        OnGameResPrepared(t) { }
        _OnInitEmptyScreen() { }
        _OnInitUILoaded() { }
        onLoading(t) { }
        loginData() { }
        OnComplete() { }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/SkinConfig.json";
    }(ja || (ja = {}));
    class Un extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("InitLoad", "splash");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(0), this.m_progress = this.getChildAt(2), this.m_loading_progress = this.getChildAt(3),
                this.m_text_logo = this.getChildAt(4), this.m_text_progress = this.getChildAt(5),
                this.m_text_laya = this.getChildAt(6), this.m_text_explain = this.getChildAt(7),
                this.m_text_v = this.getChildAt(8), this.m_text_laya_v = this.getChildAt(9), this.m_text_game_explain = this.getChildAt(10);
        }
    }
    Un.URL = "ui://n3oedpp6nihr0", function (t) {
        t.config = class { }, t.path = "res/config/GameStateConst.json";
    }(Ha || (Ha = {}));
    class Tn extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "EffectsPButton");
        }
        onConstruct() {
            this.m_sprite = this.getChildAt(0), this.m_t0 = this.getTransitionAt(0), this.m_t1 = this.getTransitionAt(1);
        }
    }
    Tn.URL = "ui://kk7g5mmmkcbyo6";
    class Rn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("GameMain", "PGameMain");
        }
        onConstruct() {
            this.m_t0 = this.getTransitionAt(0);
        }
    }
    Rn.URL = "ui://kk7g5mmmsyta9f";
    class On {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(ea.URL, ea), fgui.UIObjectFactory.setExtension($s.URL, $s),
                fgui.UIObjectFactory.setExtension(zs.URL, zs), fgui.UIObjectFactory.setExtension(Qs.URL, Qs),
                fgui.UIObjectFactory.setExtension(Ys.URL, Ys), fgui.UIObjectFactory.setExtension(Tn.URL, Tn),
                fgui.UIObjectFactory.setExtension(na.URL, na), fgui.UIObjectFactory.setExtension(Js.URL, Js),
                fgui.UIObjectFactory.setExtension(ra.URL, ra), fgui.UIObjectFactory.setExtension(sa.URL, sa),
                fgui.UIObjectFactory.setExtension(Rn.URL, Rn), fgui.UIObjectFactory.setExtension(Ta.URL, Ta);
        }
    }
    class En extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("InitEmptyScreen", "EmptyScreen");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(0);
        }
    }
    En.URL = "ui://7ktzib8oq3ng0";
    class Mn {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(En.URL, En);
        }
    }
    class Bn {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(Un.URL, Un);
        }
    }
    !function (t) {
        t.null = "";
    }(za || (za = {})), function (t) {
        t.config = class { }, t.path = "res/config/LightingConst.json";
    }(qa || (qa = {}));
    class Gn extends rt {
        constructor() {
            super(...arguments), this.coinCount = 0;
        }
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class Nn extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Nn()), this._instance;
        }
        get _saveName() {
            return "->GamePropDataSave<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        static get propData() {
            return this._instance._saveData.clone();
        }
        static addCoin(t) {
            t = Math.floor(t), this._instance._saveData.coinCount += t, this._instance._saveData.coinCount < 0 && (this._instance._saveData.coinCount = 0),
                this.SaveToDisk();
        }
        getNewData() {
            return new Gn();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    class Fn extends rt {
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class Vn extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Vn()), this._instance;
        }
        get _saveName() {
            return "->GameSkinData<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        static get skinData() {
            return this._instance._saveData.clone();
        }
        getNewData() {
            return new Fn();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    class Wn extends rt {
        constructor() {
            super(...arguments), this.ifSignIn = !1, this.ifOneDay = !1;
        }
        clone() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    class jn extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new jn()), this._instance;
        }
        get _saveName() {
            return "->GameSignDataSave<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        static get signData() {
            return this._instance._saveData.clone();
        }
        getNewData() {
            return new Wn();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    !function (t) {
        t.config = class { }, t.path = "res/config/LevelPropConfig.json";
    }(Qa || (Qa = {})), function (t) {
        t.config = class { }, t.path = "res/config/OtherConst.json";
    }(Ka || (Ka = {}));
    class Hn extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Hn()), this._instance;
        }
        get _saveName() {
            return "->GameNewHandDataSave<-";
        }
        InitData() {
            this._saveData = this._ReadFromFile();
        }
        static get propData() {
            return this._instance._saveData.clone();
        }
        getNewData() {
            return new Gn();
        }
        static SaveToDisk() {
            this._instance._SaveToDisk(this._instance._saveData);
        }
    }
    class zn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Wheel_item");
        }
        onConstruct() {
            this.m_type = this.getControllerAt(0), this.m_num = this.getChildAt(1);
        }
    }
    zn.URL = "ui://8nmf3q479f3e1c1";
    class qn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Item_building");
        }
        onConstruct() {
            this.m_txt_infomation = this.getChildAt(1), this.m_txt_title = this.getChildAt(2),
                this.m_img_fins = this.getChildAt(3), this.m_btn_update = this.getChildAt(4), this.m_spr_water = this.getChildAt(5),
                this.m_txt_costWater = this.getChildAt(6), this.m_txt_waterWarn = this.getChildAt(7),
                this.m_costWater = this.getChildAt(8), this.m_picture = this.getChildAt(9), this.m_txt_progress = this.getChildAt(10);
        }
    }
    qn.URL = "ui://8nmf3q47aucl1w";
    class Qn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Item_Statistics");
        }
        onConstruct() {
            this.m_pro_blue = this.getChildAt(2), this.m_itemIcon = this.getChildAt(3), this.m_txt_progress = this.getChildAt(6),
                this.m_txt_title = this.getChildAt(7), this.m_txt_incomeRate = this.getChildAt(8),
                this.m_btn_go = this.getChildAt(9);
        }
    }
    Qn.URL = "ui://8nmf3q47aucl1x";
    class Kn extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "statistics_btn");
        }
        onConstruct() {
            this.m_shadow = this.getChildAt(0);
        }
    }
    Kn.URL = "ui://8nmf3q47aucl7";
    class Yn extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "BasePanel");
        }
        onConstruct() {
            this.m_btn_close = this.getChildAt(3);
        }
    }
    Yn.URL = "ui://8nmf3q47b3xq1a7";
    class Zn extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "DailyComm");
        }
        onConstruct() {
            this.m_bgColor = this.getControllerAt(1);
        }
    }
    Zn.URL = "ui://8nmf3q47b3xq1aj";
    class Jn extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "DailyComm2");
        }
        onConstruct() {
            this.m_bgColor = this.getControllerAt(1), this.m_t0 = this.getTransitionAt(0);
        }
    }
    Jn.URL = "ui://8nmf3q47b3xq1ao";
    class Xn extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Wheel_six");
        }
        onConstruct() {
            this.m_img_wheel = this.getChildAt(0), this.m_item_0 = this.getChildAt(1), this.m_item_1 = this.getChildAt(2),
                this.m_item_2 = this.getChildAt(3), this.m_item_3 = this.getChildAt(4), this.m_item_4 = this.getChildAt(5),
                this.m_item_5 = this.getChildAt(6), this.m_item_6 = this.getChildAt(7), this.m_item_7 = this.getChildAt(8);
        }
    }
    Xn.URL = "ui://8nmf3q47b3xq1as";
    class $n extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "SetButton");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0);
        }
    }
    $n.URL = "ui://8nmf3q47b3xqc";
    class to extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "BackgroundAnimation");
        }
        onConstruct() {
            this.m_t0 = this.getTransitionAt(0);
        }
    }
    to.URL = "ui://8nmf3q47b3xqi";
    class eo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "BoxEffect");
        }
        onConstruct() {
            this.m_t0 = this.getTransitionAt(0), this.m_t1 = this.getTransitionAt(1), this.m_t2 = this.getTransitionAt(2),
                this.m_t3 = this.getTransitionAt(3), this.m_t4 = this.getTransitionAt(4);
        }
    }
    eo.URL = "ui://8nmf3q47bj851y";
    class io extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "StaffBtn");
        }
        onConstruct() {
            this.m_txt_num = this.getChildAt(2);
        }
    }
    io.URL = "ui://8nmf3q47bj85e";
    class so extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Btn_turntable");
        }
        onConstruct() {
            this.m_t0 = this.getTransitionAt(0);
        }
    }
    so.URL = "ui://8nmf3q47bj85g";
    class ao extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "TaskBtn");
        }
        onConstruct() {
            this.m_progress = this.getChildAt(0);
        }
    }
    ao.URL = "ui://8nmf3q47bj85o";
    class no extends fgui.GProgressBar {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "task_progress");
        }
        onConstruct() {
            this.m_text_progress = this.getChildAt(3), this.m_text_task = this.getChildAt(4);
        }
    }
    no.URL = "ui://8nmf3q47bj85p";
    class oo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Buildings");
        }
        onConstruct() {
            this.m_Top1 = this.getChildAt(3), this.m_list = this.getChildAt(4);
        }
    }
    oo.URL = "ui://8nmf3q47fk6416";
    class ro extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Btn_build");
        }
        onConstruct() {
            this.m_txt_cost = this.getChildAt(1);
        }
    }
    ro.URL = "ui://8nmf3q47fk6419";
    class lo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "Statistics");
        }
        onConstruct() {
            this.m_bg = this.getChildAt(0), this.m_text_totalIncome = this.getChildAt(4), this.m_bg1 = this.getChildAt(7),
                this.m_text_flow = this.getChildAt(9), this.m_pro_2 = this.getChildAt(11), this.m_text_women = this.getChildAt(12),
                this.m_pro_3 = this.getChildAt(15), this.m_text_pee = this.getChildAt(16), this.m_pro_4 = this.getChildAt(19),
                this.m_text_men = this.getChildAt(20), this.m_topPanel = this.getChildAt(23), this.m_list = this.getChildAt(24);
        }
    }
    lo.URL = "ui://8nmf3q47fk641c";
    class ho extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "dark_bg");
        }
        onConstruct() {
            this.m_dark_bg = this.getChildAt(0);
        }
    }
    ho.URL = "ui://8nmf3q47gok71br";
    class co extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "StartBtn");
        }
        onConstruct() {
            this.m_text_num = this.getChildAt(3);
        }
    }
    co.URL = "ui://8nmf3q47kcby18v";
    class mo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "ButtonAD");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(1);
        }
    }
    mo.URL = "ui://8nmf3q47l4g51cz";
    class uo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "ButtonRecordShare");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(1), this.m_number = this.getChildAt(1);
        }
    }
    uo.URL = "ui://8nmf3q47nt6l1cu";
    class _o extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "ButtonLastTime");
        }
        onConstruct() {
            this.m_txt_lastTime = this.getChildAt(3);
        }
    }
    _o.URL = "ui://8nmf3q47pe2t1c4";
    class go extends fgui.GProgressBar {
        static createInstance() {
            return fgui.UIPackage.createObject("Main", "ProgressBar1");
        }
        onConstruct() {
            this.m_c1 = this.getControllerAt(0), this.m_bg1 = this.getChildAt(2);
        }
    }
    go.URL = "ui://8nmf3q47u5d1s";
    class fo {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(zn.URL, zn), fgui.UIObjectFactory.setExtension(Ci.URL, Ci),
                fgui.UIObjectFactory.setExtension(qn.URL, qn), fgui.UIObjectFactory.setExtension(Qn.URL, Qn),
                fgui.UIObjectFactory.setExtension(Kn.URL, Kn), fgui.UIObjectFactory.setExtension(mn.URL, mn),
                fgui.UIObjectFactory.setExtension(ln.URL, ln), fgui.UIObjectFactory.setExtension(Yn.URL, Yn),
                fgui.UIObjectFactory.setExtension(cn.URL, cn), fgui.UIObjectFactory.setExtension(on.URL, on),
                fgui.UIObjectFactory.setExtension(_n.URL, _n), fgui.UIObjectFactory.setExtension(Zn.URL, Zn),
                fgui.UIObjectFactory.setExtension(Jn.URL, Jn), fgui.UIObjectFactory.setExtension(Xn.URL, Xn),
                fgui.UIObjectFactory.setExtension(_s.URL, _s), fgui.UIObjectFactory.setExtension($n.URL, $n),
                fgui.UIObjectFactory.setExtension(to.URL, to), fgui.UIObjectFactory.setExtension(eo.URL, eo),
                fgui.UIObjectFactory.setExtension(io.URL, io), fgui.UIObjectFactory.setExtension(so.URL, so),
                fgui.UIObjectFactory.setExtension(ao.URL, ao), fgui.UIObjectFactory.setExtension(no.URL, no),
                fgui.UIObjectFactory.setExtension(Ea.URL, Ea), fgui.UIObjectFactory.setExtension(ys.URL, ys),
                fgui.UIObjectFactory.setExtension(oo.URL, oo), fgui.UIObjectFactory.setExtension(ro.URL, ro),
                fgui.UIObjectFactory.setExtension(lo.URL, lo), fgui.UIObjectFactory.setExtension(ho.URL, ho),
                fgui.UIObjectFactory.setExtension(Ne.URL, Ne), fgui.UIObjectFactory.setExtension(Vs.URL, Vs),
                fgui.UIObjectFactory.setExtension(en.URL, en), fgui.UIObjectFactory.setExtension(co.URL, co),
                fgui.UIObjectFactory.setExtension($a.URL, $a), fgui.UIObjectFactory.setExtension(mo.URL, mo),
                fgui.UIObjectFactory.setExtension(us.URL, us), fgui.UIObjectFactory.setExtension(ss.URL, ss),
                fgui.UIObjectFactory.setExtension(uo.URL, uo), fgui.UIObjectFactory.setExtension(Ba.URL, Ba),
                fgui.UIObjectFactory.setExtension(_o.URL, _o), fgui.UIObjectFactory.setExtension(go.URL, go),
                fgui.UIObjectFactory.setExtension(Ja.URL, Ja);
        }
    }
    class po extends rt { }
    class yo extends nt {
        static get instance() {
            return null == this._instance && (this._instance = new yo()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "DisableRoomData";
        }
        getNewData() {
            return new po();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !1, this._data.list.functionID = Nt.DisableToilet, this._data.list.index = 0,
                this._data.list.title = "无障碍卫生间", this._data.list.name = Gt.disableRoom, this._data.list.slots = [],
                this._SaveToDisk(this._data));
        }
    }
    class So extends rt { }
    class Io extends nt {
        constructor() {
            super();
        }
        static get instance() {
            return null == this._instance && (this._instance = new Io()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "CoffeeData";
        }
        getNewData() {
            return new So();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !1, this._data.list.functionID = Nt.CoffeeRoom, this._data.list.index = 0,
                this._data.list.title = "咖啡间", this._data.list.name = Gt.coffeeRoom, this._data.list.slots = [],
                this._SaveToDisk(this._data));
        }
    }
    class Co extends rt { }
    class wo extends nt {
        static get instance() {
            return null == this._instance && (this._instance = new wo()), this._instance;
        }
        get data() {
            return this._data;
        }
        get _saveName() {
            return "BabyRoomData";
        }
        getNewData() {
            return new Co();
        }
        InitData() {
            this._data = this._ReadFromFile(), null == this._data.list && (this._data.list = new ni(),
                this._data.list.active = !1, this._data.list.functionID = Nt.BabyRoom, this._data.list.name = Gt.babyRoom,
                this._data.list.index = 0, this._data.list.title = "无障碍卫生间", this._data.list.slots = [],
                this._SaveToDisk(this._data));
        }
    }
    class bo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "PGameStaffInfo");
        }
        onConstruct() {
            this.m_skill = this.getControllerAt(0), this.m_sex = this.getControllerAt(1), this.m_cutBtn = this.getControllerAt(2),
                this.m_starNum = this.getChildAt(4), this.m_loader_character = this.getChildAt(5),
                this.m_name = this.getChildAt(6), this.m_btn_staffReplace = this.getChildAt(10),
                this.m_btn_staffBuy = this.getChildAt(11), this.m_skillList = this.getChildAt(12);
        }
    }
    bo.URL = "ui://vcw5trqlb3xq2b5";
    class Lo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "StaffBuy");
        }
        onConstruct() {
            this.m_text_price = this.getChildAt(2);
            this.m_text_guyong = this.getChildAt(3);
        }
    }
    Lo.URL = "ui://vcw5trqlb3xq2bb";
    class xo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "Employee");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0), this.m_Titile = this.getChildAt(3), this.m_sprite = this.getChildAt(4),
                this.m_list_skillicon = this.getChildAt(5), this.m_img_starNum = this.getChildAt(7),
                this.m_btn_AD = this.getChildAt(8), this.m_btn_AddStaff = this.getChildAt(9);
        }
    }
    xo.URL = "ui://vcw5trqlgwsg2bz";
    class vo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "EmployeeBG");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0);
        }
    }
    vo.URL = "ui://vcw5trqlgwsg2c0";
    class Ao extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "StaffMarketBtnBg");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0);
        }
    }
    Ao.URL = "ui://vcw5trqlgwsg2c1";
    class Po extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "staffSkillicon");
        }
        onConstruct() {
            this.m_sprite = this.getChildAt(0);
        }
    }
    Po.URL = "ui://vcw5trqljfuc2bv";
    class Do extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "Btn_Staff");
        }
        onConstruct() {
            this.m_sex = this.getControllerAt(0), this.m_Titile = this.getChildAt(8), this.m_sprite = this.getChildAt(9),
                this.m_list_skillicon = this.getChildAt(10), this.m_img_starNum = this.getChildAt(12),
                this.m_btn_AD = this.getChildAt(13), this.m_btn_AddStaff = this.getChildAt(14);
        }
    }
    Do.URL = "ui://vcw5trqlkcby2b0";
    class ko extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "BottomPanel");
        }
        onConstruct() {
            this.m_btn_close = this.getChildAt(0);
        }
    }
    ko.URL = "ui://vcw5trqln0pd0";
    class Uo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "PButton_up");
        }
        onConstruct() {
            this.m_btn_bg = this.getChildAt(0), this.m_text_upCast = this.getChildAt(2);
        }
    }
    Uo.URL = "ui://vcw5trqlopplw9";
    class To extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "skillPanel");
        }
        onConstruct() {
            this.m_profession = this.getControllerAt(0), this.m_sprite = this.getChildAt(1),
                this.m_Title = this.getChildAt(2),
                this.m_Title.bold = false,
                this.m_Title.y = 18,
                this.m_Title.x = 56,
                this.m_Title.fontSize = 18;
            this.m_text_desc = this.getChildAt(3);
            this.m_text_desc.bold = false;
            this.m_text_desc.y = 56;
            this.m_text_desc.x = 56;
            this.m_text_desc.fontSize = 18;
        }
    }
    To.URL = "ui://vcw5trqls1ev2bs";
    class Ro extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "PButton_diam");
        }
        onConstruct() {
            this.m_btn_bg = this.getChildAt(0), this.m_text_price = this.getChildAt(3);
        }
    }
    Ro.URL = "ui://vcw5trqltp8l11n";
    class Oo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "MidPanel");
        }
        onConstruct() {
            this.m_upState = this.getControllerAt(0), this.m_bottomState = this.getControllerAt(1),
                this.m_levelSlider = this.getChildAt(2), this.m_picture = this.getChildAt(3), this.m_levelProgress = this.getChildAt(5),
                this.m_leftLevel = this.getChildAt(7), this.m_text_mid_title = this.getChildAt(8),
                this.m_text_mid_title_desc = this.getChildAt(9), this.m_btn_up = this.getChildAt(10),
                this.m_btn_buy = this.getChildAt(11), this.m_text_money_MoneyAdd = this.getChildAt(13),
                this.m_text_money = this.getChildAt(14), this.m_group_money = this.getChildAt(16),
                this.m_text_time = this.getChildAt(18), this.m_text_time_timeSub = this.getChildAt(19),
                this.m_group_time = this.getChildAt(20), this.m_text_clean_MoneyAdd = this.getChildAt(22),
                this.m_text_clean_Money = this.getChildAt(23), this.m_group_clean = this.getChildAt(24),
                this.m_text_replace_time = this.getChildAt(26), this.m_text_replace_timeSub = this.getChildAt(27),
                this.m_group_repair = this.getChildAt(28), this.m_text_volume = this.getChildAt(30),
                this.m_text_volume_volumeAdd = this.getChildAt(31), this.m_group_queue = this.getChildAt(32),
                this.m_text_woman = this.getChildAt(34), this.m_text_woman_womanadd = this.getChildAt(35),
                this.m_group_woman = this.getChildAt(36), this.m_text_pee = this.getChildAt(38),
                this.m_text_pee_peeadd = this.getChildAt(39), this.m_group_pee = this.getChildAt(40),
                this.m_text_man = this.getChildAt(42), this.m_text_pee_manAdd = this.getChildAt(43),
                this.m_group_man = this.getChildAt(44), this.m_group_water = this.getChildAt(45),
                this.m_text_water_WaterAdd = this.getChildAt(46), this.m_text_water = this.getChildAt(47),
                this.m_txt_needWater = this.getChildAt(49);
        }
    }
    Oo.URL = "ui://vcw5trqltp8l11o";
    class Eo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "TopPanel");
        }
        onConstruct() {
            this.m_progress = this.getControllerAt(0), this.m_c1 = this.getControllerAt(1),
                this.m_topProgress = this.getChildAt(0), this.m_text_top_moneyAdd = this.getChildAt(6),
                this.m_text_top_water = this.getChildAt(7), this.m_text_top_time = this.getChildAt(8),
                this.m_toilet = this.getChildAt(9), this.m_text_top_cleanTime = this.getChildAt(13),
                this.m_text_top_stuffNum = this.getChildAt(14), this.m_text_top_repairTime = this.getChildAt(15),
                this.m_cleanroom = this.getChildAt(16), this.m_text_top_expendWater = this.getChildAt(18),
                this.m_text_top_expend = this.getChildAt(19), this.m_handingroom = this.getChildAt(20),
                this.m_text_top_queueWoman = this.getChildAt(25), this.m_text_top_ridership = this.getChildAt(26),
                this.m_text_top_queueMan = this.getChildAt(27), this.m_text_top_queuePee = this.getChildAt(28),
                this.m_queue = this.getChildAt(29);
        }
    }
    Eo.URL = "ui://vcw5trqltp8l11q";
    class Mo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "commButton");
        }
        onConstruct() {
            this.m_bg = this.getControllerAt(1), this.m_level = this.getControllerAt(2), this.m_state = this.getControllerAt(3),
                this.m_bg_1 = this.getChildAt(1), this.m_image = this.getChildAt(4), this.m_levelLable = this.getChildAt(7),
                this.m_t0 = this.getTransitionAt(0);
        }
    }
    Mo.URL = "ui://vcw5trqltp8l11s";
    class Bo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("BuildUIPanel", "label");
        }
        onConstruct() {
            this.m_title = this.getChildAt(1);
        }
    }
    Bo.URL = "ui://vcw5trqltp8l11t";
    class Go {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(bo.URL, bo), fgui.UIObjectFactory.setExtension(Lo.URL, Lo),
                fgui.UIObjectFactory.setExtension(Ms.URL, Ms), fgui.UIObjectFactory.setExtension(xo.URL, xo),
                fgui.UIObjectFactory.setExtension(vo.URL, vo), fgui.UIObjectFactory.setExtension(Ao.URL, Ao),
                fgui.UIObjectFactory.setExtension(Es.URL, Es), fgui.UIObjectFactory.setExtension(Po.URL, Po),
                fgui.UIObjectFactory.setExtension(Do.URL, Do), fgui.UIObjectFactory.setExtension(ko.URL, ko),
                fgui.UIObjectFactory.setExtension(Os.URL, Os), fgui.UIObjectFactory.setExtension(Uo.URL, Uo),
                fgui.UIObjectFactory.setExtension(To.URL, To), fgui.UIObjectFactory.setExtension(Ro.URL, Ro),
                fgui.UIObjectFactory.setExtension(Oo.URL, Oo), fgui.UIObjectFactory.setExtension(Eo.URL, Eo),
                fgui.UIObjectFactory.setExtension(Mo.URL, Mo), fgui.UIObjectFactory.setExtension(Bo.URL, Bo);
        }
    }
    class No {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(Di.URL, Di);
        }
    }
    class Fo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "NewHappyEmoji");
        }
        onConstruct() {
            this.m_t1 = this.getTransitionAt(0);
        }
    }
    Fo.URL = "ui://gp34j27l8pj8ux";
    class Vo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "NewHelpButton");
        }
        onConstruct() {
            this.m_switch = this.getControllerAt(0), this.m_fill_yellow = this.getChildAt(2),
                this.m_fill_red = this.getChildAt(3), this.m_t1 = this.getTransitionAt(0), this.m_happy = this.getTransitionAt(1);
        }
    }
    Vo.URL = "ui://gp34j27l8pj8uy";
    class Wo extends fgui.GButton {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "CommonButton");
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0), this.m_bg = this.getChildAt(0), this.m_fill_green = this.getChildAt(1),
                this.m_t0 = this.getTransitionAt(0), this.m_t1 = this.getTransitionAt(1);
        }
    }
    Wo.URL = "ui://gp34j27lophfug";
    class jo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("EventPanel", "effectBG");
        }
        onConstruct() {
            this.m_switch = this.getControllerAt(0);
        }
    }
    jo.URL = "ui://gp34j27lqrltul";
    class Ho {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(Fo.URL, Fo), fgui.UIObjectFactory.setExtension(Vo.URL, Vo),
                fgui.UIObjectFactory.setExtension(Ee.URL, Ee), fgui.UIObjectFactory.setExtension(Re.URL, Re),
                fgui.UIObjectFactory.setExtension(Wo.URL, Wo), fgui.UIObjectFactory.setExtension(jo.URL, jo),
                fgui.UIObjectFactory.setExtension(Oe.URL, Oe);
        }
    }
    class zo extends fgui.GComponent {
        static createInstance() {
            return fgui.UIPackage.createObject("Guide", "GuideClick");
        }
        onConstruct() {
            this.m_t0 = this.getTransitionAt(0);
        }
    }
    zo.URL = "ui://09olrtmgujuei";
    class qo {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(Ts.URL, Ts), fgui.UIObjectFactory.setExtension(zo.URL, zo);
        }
    }
    class Qo {
        static bindAll() {
            fairygui.UIObjectFactory.setPackageItemExtension(an.URL, an), fairygui.UIObjectFactory.setPackageItemExtension(Li.URL, Li),
                fairygui.UIObjectFactory.setPackageItemExtension(xi.URL, xi), fairygui.UIObjectFactory.setPackageItemExtension(vi.URL, vi);
        }
    }
    class Ko extends kn {
        constructor() {
            super(...arguments), this._progress = {
                0: !1,
                30: !1,
                50: !1,
                80: !1,
                100: !1
            };
        }
        _Init() {
            pn.instance.GameInit(), this._initEmptyScreen = new An(p.FGUIPack("InitEmptyScreen")),
                this._initUiPack = new An(p.FGUIPack("InitLoad"), 0), this._needLoadOtherUIPack = [new An(p.FGUIPack("GameMain"), 0), new An(p.FGUIPack("Main"), 0), new An(p.FGUIPack("BuildUIPanel"), 0), new An(p.FGUIPack("TopInfoUI"), 0), new An(p.FGUIPack("EventPanel"), 0), new An(p.FGUIPack("Guide"), 0), new An(p.FGUIPack("EffectLayer"), 0)];
        }
        _OnInitEmptyScreen() {
            this._emptyScreenShowUI = ke.AddUI(En, qt.Main);
        }
        _OnInitUILoaded() {
            this._emptyScreenShowUI.dispose(), this._loadShowUI = ke.AddUI(Un, qt.Loading),
                this._loadShowUI.sortingOrder = Number.MAX_SAFE_INTEGER, this._loadShowUI.m_text_explain.text = tt.GameWhatTeam,
                this._loadShowUI.m_text_logo.text = tt.GameName_, this._loadShowUI.m_text_v.text = tt.versions,
                this._loadShowUI.m_text_game_explain.text = tt.GameExplain, this._loadShowUI.m_text_laya_v.text = Laya.version,
                this._loadingProgress = this._loadShowUI.m_progress, this._loadingProgressText = this._loadShowUI.m_loading_progress,
                this._loadingProgress.value = 0;
        }
        OnBindUI() {
            Mn.bindAll(), Bn.bindAll(), On.bindAll(), fo.bindAll(), Go.bindAll(), No.bindAll(),
                Ho.bindAll(), qo.bindAll(), Qo.bindAll();
        }
        OnSetLoadConfig() {
            vn.AddConfig(P), vn.AddConfig(v), vn.AddConfig(A), vn.AddConfig(Wa), vn.AddConfig(Ha),
                vn.AddConfig(C), vn.AddConfig(w), vn.AddConfig(Qa), vn.AddConfig(qa), vn.AddConfig(Ka),
                vn.AddConfig(ja), vn.AddConfig(Fa), vn.AddConfig(Bt), vn.AddConfig(ae), vn.AddConfig(jt),
                vn.AddConfig(Vt), vn.AddConfig(Wt), vn.AddConfig(te), vn.AddConfig(Ft), vn.AddConfig(Ht),
                vn.AddConfig(ce), vn.AddConfig(Jt);
        }
        loginData() {
            ht.instance.InitData(), Hn.instance.InitData(), Nn.instance.InitData(), Vn.instance.InitData(),
                jn.instance.InitData(), Cn.instance.InitData(), _i.instance.InitData(), di.instance.InitData(),
                Je.instance.InitData(), yo.instance.InitData(), Io.instance.InitData(), li.instance.InitData(),
                wo.instance.InitData(), fi.instance.InitData(), ji.instance.InitData(), xs.instance.InitData(),
                Ps.instance.InitData(), si.instance.InitData(), Gi.instance.InitData(), si.instance.InitData(),
                Be.instance.InitData();
        }
        OnGameResPrepared(t) {
            let e;
            for (let i in le) "" != (e = le[i]) && t.push(gs.music_url(e));
            for (let i in za) "" != (e = za[i]) && t.push(gs.sound_url(e));
            t.push(p.ConfigURL(Gt.GusetPool)), t.push(p.ConfigURL(Gt.MapRoot)), t.push(p.ConfigURL(Gt.EmployeeData));
            for (let e of fe.list) t.push(p.ConfigURL(fe.NameUpper(e) + ".json"));
        }
        onLoading(t) {
            this._loadingProgress.value = t;
            let e = Math.floor(t);
            this._loadingProgressText.text = e.toString() + "%", this.Check(0, e), this.Check(30, e),
                this.Check(50, e), this.Check(80, e), this.Check(100, e);
        }
        Check(t, e) {
            if (e == t) {
                this._progress[t] || (this._progress[t] = !0, console.log("加载" + t), Ge.trackEvent(Kt.LoadProgress, {
                    LoadProgress: t.toString()
                }));
            }
        }
        OnComplete() {
            this._loadShowUI.dispose(), pn.instance.GameOnInit();
        }
    }
    class Yo {
        constructor() { }
        static get instance() {
            return null == this._instance && (this._instance = new Yo()), this._instance;
        }
        enterGame() {
            this.initGame();
        }
        initGame() { }
    }
    class Zo {
        startTest() { }
    }
    class Jo extends Zo {
        constructor() {
            super(...arguments), this._consoleExStr = "输出测试";
        }
        startTest() {
            console.log("->开启测试<-"), console.log(...s.packLog(this._consoleExStr)), console.log(...s.packWarn(this._consoleExStr)),
                console.log(...s.packError(this._consoleExStr));
        }
    }
    class Xo extends Zo {
        startTest() {
            new Jo().startTest();
        }
    }
    class $o extends Zo {
        startTest() {
            this.asyncTest();
        }
        asyncTest() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("异步开始"), yield this._asyncTest(), console.log("异步结束");
            });
        }
        _asyncTest() {
            return new Promise(t => {
                Laya.timer.once(1e3, this, () => {
                    console.log("异步函数执行中"), t();
                });
            });
        }
    }
    class tr extends Zo {
        static get instance() {
            return this._instance ? this._instance : (this._instance = new tr(), this._instance);
        }
        start(t) { }
    }
    class er extends Zo {
        startTest() {
            new $o().startTest(), new tr().startTest();
        }
    }
    class ir {
        constructor() {
            this.init().then(() => {
                this.upGameLoad(), this.gameLoad();
            });
        }
        init() {
            return new Promise(t => {
                Ua.instance.init(), Ua.instance.initPlatform(), this.loadSubpackage().then(() => {
                    t();
                });
            });
        }
        loadSubpackage() {
            return new Promise(t => {
                if (g.subpackages.length > 0) {
                    let e = [];
                    for (let t of g.subpackages) t.name && e.push(new Promise(e => {
                        Ua.PlatformInstance.LoadSubpackage(t.name, Laya.Handler.create(this, () => {
                            e();
                        }), Laya.Handler.create(this, () => {
                            e();
                        }), void 0);
                    }));
                    Promise.all(e).then(() => {
                        t();
                    });
                } else t();
            });
        }
        upGameLoad() {
            J.ifTest && (new Xo().startTest(), new er().startTest());
        }
        gameLoad() {
            let t = new Ko();
            console.log(...s.comLog("开始加载游戏")), t.Enter(this, void 0, this.OnGameLoad);
        }
        OnGameLoad() {
            return new Promise(t => {
                t(), console.log(...s.comLog("游戏加载完成")), J.support3D && xn.instance.enterGame(),
                    J.support2D && Yo.instance.enterGame(), this.OnGameEnter();
            });
        }
        OnGameEnter() {
            Ge.trackEvent(Kt.OnGameEnter);
        }
    }
    new class {
        constructor() {
            const userAgent = window.navigator.userAgent;

            if (userAgent.indexOf("OS 15_1") > -1 || userAgent.indexOf("OS 15_0_2") > -1) {
                Config.useWebGL2 = false;
            }
            Config.isAntialias = true;
            window.Laya3D ? Laya3D.init(t.width, t.height) : Laya.init(t.width, t.height, Laya.WebGL),
                Laya.Physics && Laya.Physics.enable(), Laya.DebugPanel && Laya.DebugPanel.enable(),
                Laya.stage.scaleMode = t.scaleMode, Laya.stage.screenMode = t.screenMode, Laya.stage.alignV = t.alignV,
                Laya.stage.alignH = t.alignH, Laya.URL.exportSceneToJson = t.exportSceneToJson,
                (t.debug || "true" == Laya.Utils.getQueryString("debug")) && Laya.enableDebugPanel(),
                t.physicsDebug && Laya.PhysicsDebugDraw && Laya.PhysicsDebugDraw.enable(), t.stat && Laya.Stat.show(),
                Laya.alertGlobalError(!0), Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            YYGGames.init("Idle-Toilet-Tycoon", () => {
                window["showMetheAuthor"] = function () {
                    const iframe = document.createElement("iframe");
                    iframe.style.display = 'none';
                    document.head.appendChild(iframe);
                    const logger = iframe.contentWindow["console"];
                    logger.log.apply(this, [
                        "%c %c %c YYGGAMES %c%s %c %c ",
                        "background: #fb8cb3",
                        "background: #d44a52",
                        "color: #ffffff; background: #871905",
                        "color: #ffffff;background: #871905;",
                        '116,104,101,32,103,97,109,101,32,105,115,32,112,111,119,101,114,101,100,32,98,121,32,121,121,103'
                            .split(",").map(iter => { return String.fromCharCode(~~iter) }).join(""),
                        "background: #d44a52",
                        "background: #fb8cb3"]);
                }
                YYGGames.gameBanner.bottom = 10;
                YYGGames.icon.left = NaN;
                YYGGames.icon.right = 0;
                YYGGames.icon.scale(0.6, 0.6);
                YYGGames.gameBanner.bottom = 25;
                YYGGames.gameBanner.centerX = -50;
                YYGGames.gameBox.game1.left = 100;
                YYGGames.gameBox.game2.left = 452;
                YYGGames.gameBox.game2.bottom = 80;
                YYGGames.gameBox.game1.bottom = 80;
                YYGGames.gameBox.scale(0.5, 0.5);
                YYGGames.gameBox.bottom = 1080;
                YYGGames.gameBox.left = 300
                YYGGames.gameBox.visible = false;
                YYGGames.gameBanner.visible = false;
                Ge.InitUma(), new ir();

            })
            // Laya.loader.load("ui.json",Laya.Handler.create(this,(res)=>{
            //     console.log(res)
            //     htmlfs.saveui(res);
            // }))

        }
    }();
}();
function showReward(e) {
    if (!window.zy || window.zy == undefined) {
        console.log("不在最右环境直接下发奖励3");
        e && e()
        return;
    }

    __XCgs.call("playRewardAd")((err, ret) => {
        if (err) {
            // 播放失败
            // alert(err.message);
            // this.showTips('暂无视频，请稍后再试');
            return;
        }
        // 播放成功，但是不代表用户看完了激励视频
        console.log(ret.status);
        if (ret.status == 1) {
            console.log("下发回调奖励");
            e && e()
        } else {
            return;
        }
    });
}