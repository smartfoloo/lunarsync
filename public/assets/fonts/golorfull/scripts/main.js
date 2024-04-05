'use strict';

function x(g, a, b, c) {
    g.v.lc(g.Xa, a, b, c, void 0)
}

function D(g, a, b, c) {
    g.v.ra ? x(g, a, b, c) : g.v.hf()._OnMessageFromDOM({
        type: "event",
        component: g.Xa,
        handler: a,
        dispatchOpts: c || null,
        data: b,
        responseId: null
    })
}

function G(g, a, b) {
    g.v.B(g.Xa, a, b)
}

function I(g, a) {
    for (const [b, c] of a) G(g, b, c)
}

function J(g) {
    g.Pb || (g.v.Te(g.be), g.Pb = !0)
}
window.ub = class {
    constructor(g, a) {
        this.v = g;
        this.Xa = a;
        this.Pb = !1;
        this.be = () => this.Da()
    }
    cd() {}
    Da() {}
};

function K(g) {
    -1 !== g.Oa && (self.clearTimeout(g.Oa), g.Oa = -1)
}
window.Ke = class {
    constructor(g, a) {
        this.Kc = g;
        this.vg = a;
        this.Oa = -1;
        this.Qb = -Infinity;
        this.ce = () => {
            this.Oa = -1;
            this.Qb = Date.now();
            this.bb = !0;
            this.Kc();
            this.bb = !1
        };
        this.Ld = this.bb = !1
    }
    c() {
        K(this);
        this.ce = this.Kc = null
    }
};
"use strict";

function L(g, a) {
    const b = a.elementId,
        c = g.gd(b, a);
    g.Y.set(b, c);
    a.isVisible || (c.style.display = "none");
    a = g.vc(c);
    a.addEventListener("focus", () => {
        M(g, "elem-focused", b)
    });
    a.addEventListener("blur", () => {
        M(g, "elem-blurred", b)
    });
    g.Kb && document.body.appendChild(c)
}

function N(g, a) {
    G(g, "get-element", b => {
        const c = g.Y.get(b.elementId);
        return a(c, b)
    })
}

function M(g, a, b) {
    var c;
    c || (c = {});
    c.elementId = b;
    x(g, a, c)
}
window.xe = class extends self.ub {
    constructor(g, a) {
        super(g, a);
        this.Y = new Map;
        this.Kb = !0;
        I(this, [
            ["create", b => L(this, b)],
            ["destroy", b => {
                {
                    b = b.elementId;
                    const c = this.Y.get(b);
                    this.Kb && c.parentElement.removeChild(c);
                    this.Y.delete(b)
                }
            }],
            ["set-visible", b => {
                this.Kb && (this.Y.get(b.elementId).style.display = b.isVisible ? "" : "none")
            }],
            ["update-position", b => {
                if (this.Kb) {
                    var c = this.Y.get(b.elementId);
                    c.style.left = b.left + "px";
                    c.style.top = b.top + "px";
                    c.style.width = b.width + "px";
                    c.style.height = b.height + "px";
                    b = b.fontSize;
                    null !== b && (c.style.fontSize = b + "em")
                }
            }],
            ["update-state", b => {
                {
                    const c = this.Y.get(b.elementId);
                    this.rc(c, b)
                }
            }],
            ["focus", b => {
                {
                    const c = this.vc(this.Y.get(b.elementId));
                    b.focus ? c.focus() : c.blur()
                }
            }],
            ["set-css-style", b => {
                this.Y.get(b.elementId).style[b.prop] = b.val
            }],
            ["set-attribute", b => {
                this.Y.get(b.elementId).setAttribute(b.name, b.val)
            }],
            ["remove-attribute", b => {
                this.Y.get(b.elementId).removeAttribute(b.name)
            }]
        ]);
        N(this, b => b)
    }
    gd() {
        throw Error("required override");
    }
    rc() {
        throw Error("required override");
    }
    vc(g) {
        return g
    }
};
"use strict"; {
    const g = /(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(navigator.userAgent);
    let a = 0;

    function b(k, d) {
        const h = document.createElement("script");
        h.async = !1;
        "module" === d && (h.type = "module");
        return k.Fg ? new Promise(l => {
            const n = "c3_resolve_" + a;
            ++a;
            self[n] = l;
            h.textContent = k.Ig + `\n\nself["${n}"]();`;
            document.head.appendChild(h)
        }) : new Promise((l, n) => {
            h.onload = l;
            h.onerror = n;
            h.src = k;
            document.head.appendChild(h)
        })
    }
    let c = !1,
        f = !1;

    function m() {
        if (!c) {
            try {
                new Worker("blob://", {
                    get type() {
                        f = !0
                    }
                })
            } catch (k) {}
            c = !0
        }
        return f
    }
    let p = new Audio;
    const v = {
        "audio/webm; codecs=opus": !!p.canPlayType("audio/webm; codecs=opus"),
        "audio/ogg; codecs=opus": !!p.canPlayType("audio/ogg; codecs=opus"),
        "audio/webm; codecs=vorbis": !!p.canPlayType("audio/webm; codecs=vorbis"),
        "audio/ogg; codecs=vorbis": !!p.canPlayType("audio/ogg; codecs=vorbis"),
        "audio/mp4": !!p.canPlayType("audio/mp4"),
        "audio/mpeg": !!p.canPlayType("audio/mpeg")
    };
    p = null;
    async function A(k) {
        k = await B(k);
        return (new TextDecoder("utf-8")).decode(k)
    }

    function B(k) {
        return new Promise((d,
            h) => {
            const l = new FileReader;
            l.onload = n => d(n.target.result);
            l.onerror = n => h(n);
            l.readAsArrayBuffer(k)
        })
    }
    const u = [];
    let w = 0;
    window.RealFile = window.File;
    const C = [],
        y = new Map,
        E = new Map;
    let F = 0;
    const H = [];
    self.runOnStartup = function(k) {
        if ("function" !== typeof k) throw Error("runOnStartup called without a function");
        H.push(k)
    };
    const e = new Set(["cordova", "playable-ad", "instant-games"]);
    window.Ta = class k {
        constructor(d) {
            this.ra = d.Kg;
            this.pa = null;
            this.D = "";
            this.Yb = d.Hg;
            this.da = d.fe;
            this.qb = {};
            this.Ha = this.pb = null;
            this.Nb = [];
            this.eb = this.J = this.Ma = null;
            this.La = -1;
            this.Ag = () => this.Hf();
            this.Ka = [];
            this.L = d.de;
            !this.ra || "undefined" !== typeof OffscreenCanvas && navigator.userActivation && ("module" !== this.da || m()) || (this.ra = !1);
            e.has(this.L) && this.ra && (console.warn("[C3 runtime] Worker mode is enabled and supported, but is disabled in WebViews due to crbug.com/923007. Reverting to DOM mode."), this.ra = !1);
            this.Sb = this.ia = null;
            "html5" !== this.L && "playable-ad" !== this.L || "file" !== location.protocol.substr(0, 4) || alert("Exported games won't work until you upload them. (When running on the file: protocol, browsers block many features from working for security reasons.)");
            this.B("runtime", "cordova-fetch-local-file", h => this.rf(h));
            this.B("runtime", "create-job-worker", () => this.sf());
            "cordova" === this.L ? document.addEventListener("deviceready", () => this.xd(d)) : this.xd(d)
        }
        c() {
            this.sc();
            this.pa && (this.pa = this.pa.onmessage = null);
            this.pb && (this.pb.terminate(), this.pb = null);
            this.Ha && (this.Ha.c(), this.Ha = null);
            this.J && (this.J.parentElement.removeChild(this.J), this.J = null)
        }
        md() {
            return g && "cordova" === this.L
        }
        kc() {
            return g && e.has(this.L) || navigator.standalone
        }
        async xd(d) {
            if ("playable-ad" ===
                this.L) {
                this.ia = self.c3_base64files;
                this.Sb = {};
                await this.Ye();
                for (let l = 0, n = d.Pa.length; l < n; ++l) {
                    var h = d.Pa[l].toLowerCase();
                    this.Sb.hasOwnProperty(h) ? d.Pa[l] = {
                        Fg: !0,
                        Ig: this.Sb[h]
                    } : this.ia.hasOwnProperty(h) && (d.Pa[l] = URL.createObjectURL(this.ia[h]))
                }
            }
            d.Bg ? this.D = d.Bg : (h = location.origin, this.D = ("null" === h ? "file:///" : h) + location.pathname, h = this.D.lastIndexOf("/"), -1 !== h && (this.D = this.D.substr(0, h + 1)));
            d.Mg && (this.qb = d.Mg);
            h = new MessageChannel;
            this.pa = h.port1;
            this.pa.onmessage = l => this._OnMessageFromRuntime(l.data);
            window.c3_addPortMessageHandler && window.c3_addPortMessageHandler(l => this.Df(l));
            this.eb = new self.Ge(this);
            await O(this.eb);
            "object" === typeof window.StatusBar && window.StatusBar.hide();
            "object" === typeof window.AndroidFullScreen && window.AndroidFullScreen.immersiveMode();
            this.ra ? await this.kf(d, h.port2) : await this.jf(d, h.port2)
        }
        wc(d) {
            d = this.qb.hasOwnProperty(d) ? this.qb[d] : d.endsWith("/workermain.js") && this.qb.hasOwnProperty("workermain.js") ? this.qb["workermain.js"] : "playable-ad" === this.L && this.ia.hasOwnProperty(d.toLowerCase()) ?
                this.ia[d.toLowerCase()] : d;
            d instanceof Blob && (d = URL.createObjectURL(d));
            return d
        }
        async cc(d, h, l) {
            if (d.startsWith("blob:")) return new Worker(d, l);
            if (this.md() && "file:" === location.protocol) return d = await this.tb(this.Yb + d), new Worker(URL.createObjectURL(new Blob([d], {
                type: "application/javascript"
            })), l);
            d = new URL(d, h);
            if (location.origin !== d.origin) {
                d = await fetch(d);
                if (!d.ok) throw Error("failed to fetch worker script");
                d = await d.blob();
                return new Worker(URL.createObjectURL(d), l)
            }
            return new Worker(d,
                l)
        }
        wa() {
            return Math.max(window.innerWidth, 1)
        }
        va() {
            return Math.max(window.innerHeight, 1)
        }
        vd(d) {
            var h = this.eb;
            return {
                baseUrl: this.D,
                windowInnerWidth: this.wa(),
                windowInnerHeight: this.va(),
                devicePixelRatio: window.devicePixelRatio,
                isFullscreen: k.jc(),
                projectData: d.Rg,
                scriptsType: d.fe,
                previewImageBlobs: window.cr_previewImageBlobs || this.ia,
                previewProjectFileBlobs: window.cr_previewProjectFileBlobs,
                previewProjectFileSWUrls: window.cr_previewProjectFiles,
                swClientId: window.Pg || "",
                exportType: d.de,
                isDebug: -1 < self.location.search.indexOf("debug"),
                ife: !!self.Qg,
                jobScheduler: {
                    inputPort: h.Qc,
                    outputPort: h.Xc,
                    maxNumWorkers: h.xg
                },
                supportedAudioFormats: v,
                opusWasmScriptUrl: window.cr_opusWasmScriptUrl || this.Yb + "opus.wasm.js",
                opusWasmBinaryUrl: window.cr_opusWasmBinaryUrl || this.Yb + "opus.wasm.wasm",
                isiOSCordova: this.md(),
                isiOSWebView: this.kc(),
                isFBInstantAvailable: "undefined" !== typeof self.FBInstant
            }
        }
        async kf(d, h) {
            var l = this.wc(d.Lg);
            this.pb = await this.cc(l, this.D, {
                type: this.da,
                name: "Runtime"
            });
            this.J = document.createElement("canvas");
            this.J.style.display =
                "none";
            l = this.J.transferControlToOffscreen();
            document.body.appendChild(this.J);
            window.c3canvas = this.J;
            this.pb.postMessage(Object.assign(this.vd(d), {
                type: "init-runtime",
                isInWorker: !0,
                messagePort: h,
                canvas: l,
                workerDependencyScripts: d.bd || [],
                engineScripts: d.Pa,
                projectScripts: d.rb,
                mainProjectScript: d.ee,
                projectScriptsStatus: self.C3_ProjectScriptsStatus
            }), [h, l, ...P(this.eb)]);
            this.Nb = C.map(n => new n(this));
            this.ud();
            self.c3_callFunction = (n, q) => this.Ma.lf(n, q);
            "preview" === this.L && (self.goToLastErrorScript =
                () => this.lc("runtime", "go-to-last-error-script"))
        }
        async jf(d, h) {
            this.J = document.createElement("canvas");
            this.J.style.display = "none";
            document.body.appendChild(this.J);
            window.c3canvas = this.J;
            this.Nb = C.map(q => new q(this));
            this.ud();
            var l = d.Pa.map(q => "string" === typeof q ? (new URL(q, this.D)).toString() : q);
            Array.isArray(d.bd) && l.unshift(...d.bd);
            l = await Promise.all(l.map(q => this.Ac(q, this.da)));
            await Promise.all(l.map(q => b(q, this.da)));
            const n = self.C3_ProjectScriptsStatus;
            if ("module" === this.da) {
                l = d.ee;
                const q =
                    d.rb;
                for (let [t, r] of q)
                    if (r || (r = t), t === l) try {
                        r = await this.Ac(r, this.da), await b(r, this.da), "preview" !== this.L || n[t] || this.Fd(t, "main script did not run to completion")
                    } catch (z) {
                        this.Fd(t, z)
                    } else if ("scriptsInEvents.js" === t || t.endsWith("/scriptsInEvents.js")) r = await this.Ac(r, this.da), await b(r, this.da)
            } else if (d.rb && 0 < d.rb.length) try {
                if (await Promise.all(d.rb.map(q => b(q[1], this.da))), Object.values(n).some(q => !q)) {
                    self.setTimeout(() => this.Gd(n), 100);
                    return
                }
            } catch (q) {
                console.error("[Preview] Error loading project scripts: ",
                    q);
                self.setTimeout(() => this.Gd(n), 100);
                return
            }
            "preview" === this.L && "object" !== typeof self.Ng.Og ? (this.Va(), console.error("[C3 runtime] Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."), alert("Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax.")) : (d = Object.assign(this.vd(d), {
                isInWorker: !1,
                messagePort: h,
                canvas: this.J,
                runOnStartupFunctions: H
            }), this.zd(), this.Ha = self.C3_CreateRuntime(d), await self.C3_InitRuntime(this.Ha,
                d))
        }
        Gd(d) {
            this.Va();
            d = `Failed to load project script '${Object.entries(d).filter(h=>!h[1]).map(h=>h[0])[0]}'. Check all your JavaScript code has valid syntax.`;
            console.error("[Preview] " + d);
            alert(d)
        }
        Fd(d, h) {
            this.Va();
            console.error(`[Preview] Failed to load project main script (${d}): `, h);
            alert(`Failed to load project main script (${d}). Check all your JavaScript code has valid syntax. Press F12 and check the console for error details.`)
        }
        zd() {
            this.Va()
        }
        Va() {
            const d = window.Cg;
            d && (d.parentElement.removeChild(d),
                window.Cg = null)
        }
        async sf() {
            const d = await Q(this.eb);
            return {
                outputPort: d,
                transferables: [d]
            }
        }
        hf() {
            if (this.ra) throw Error("not available in worker mode");
            return this.Ha
        }
        lc(d, h, l, n, q) {
            this.pa.postMessage({
                type: "event",
                component: d,
                handler: h,
                dispatchOpts: n || null,
                data: l,
                responseId: null
            }, q)
        }
        nd(d, h, l, n, q) {
            const t = F++,
                r = new Promise((z, T) => {
                    E.set(t, {
                        resolve: z,
                        reject: T
                    })
                });
            this.pa.postMessage({
                type: "event",
                component: d,
                handler: h,
                dispatchOpts: n || null,
                data: l,
                responseId: t
            }, q);
            return r
        }["_OnMessageFromRuntime"](d) {
            const h =
                d.type;
            if ("event" === h) return this.xf(d);
            if ("result" === h) this.Kf(d);
            else if ("runtime-ready" === h) this.Lf();
            else if ("alert-error" === h) this.Va(), alert(d.message);
            else if ("creating-runtime" === h) this.zd();
            else throw Error(`unknown message '${h}'`);
        }
        xf(d) {
            const h = d.component,
                l = d.handler,
                n = d.data,
                q = d.responseId;
            if (d = y.get(h))
                if (d = d.get(l)) {
                    var t = null;
                    try {
                        t = d(n)
                    } catch (r) {
                        console.error(`Exception in '${h}' handler '${l}':`, r);
                        null !== q && this.Fb(q, !1, "" + r);
                        return
                    }
                    if (null === q) return t;
                    t && t.then ? t.then(r => this.Fb(q, !0, r)).catch(r => {
                        console.error(`Rejection from '${h}' handler '${l}':`, r);
                        this.Fb(q, !1, "" + r)
                    }) : this.Fb(q, !0, t)
                } else console.warn(`[DOM] No handler '${l}' for component '${h}'`);
            else console.warn(`[DOM] No event handlers for component '${h}'`)
        }
        Fb(d, h, l) {
            let n;
            l && l.transferables && (n = l.transferables);
            this.pa.postMessage({
                type: "result",
                responseId: d,
                isOk: h,
                result: l
            }, n)
        }
        Kf(d) {
            const h = d.responseId,
                l = d.isOk;
            d = d.result;
            const n = E.get(h);
            l ? n.resolve(d) : n.reject(d);
            E.delete(h)
        }
        B(d, h, l) {
            let n = y.get(d);
            n || (n = new Map,
                y.set(d, n));
            if (n.has(h)) throw Error(`[DOM] Component '${d}' already has handler '${h}'`);
            n.set(h, l)
        }
        static sb(d) {
            if (C.includes(d)) throw Error("DOM handler already added");
            C.push(d)
        }
        ud() {
            for (const d of this.Nb)
                if ("runtime" === d.Xa) {
                    this.Ma = d;
                    return
                }
            throw Error("cannot find runtime DOM handler");
        }
        Df(d) {
            this.lc("debugger", "message", d)
        }
        Lf() {
            for (const d of this.Nb) d.cd()
        }
        static jc() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)
        }
        Te(d) {
            this.Ka.push(d);
            this.Ic()
        }
        Wf(d) {
            d = this.Ka.indexOf(d);
            if (-1 === d) throw Error("invalid callback");
            this.Ka.splice(d, 1);
            this.Ka.length || this.sc()
        }
        Ic() {
            -1 === this.La && this.Ka.length && (this.La = requestAnimationFrame(this.Ag))
        }
        sc() {
            -1 !== this.La && (cancelAnimationFrame(this.La), this.La = -1)
        }
        Hf() {
            this.La = -1;
            for (const d of this.Ka) d();
            this.Ic()
        }
        ua(d) {
            this.Ma.ua(d)
        }
        Ca(d) {
            this.Ma.Ca(d)
        }
        Hc() {
            this.Ma.Hc()
        }
        Ab(d) {
            this.Ma.Ab(d)
        }
        Fe() {
            return !!v["audio/webm; codecs=opus"]
        }
        async tg(d) {
            d = await this.nd("runtime", "opus-decode", {
                    arrayBuffer: d
                },
                null, [d]);
            return new Float32Array(d)
        }
        Ee(d) {
            return /^(?:[a-z\-]+:)?\/\//.test(d) || "data:" === d.substr(0, 5) || "blob:" === d.substr(0, 5)
        }
        ld(d) {
            return !this.Ee(d)
        }
        async Ac(d, h) {
            return "cordova" === this.L && "module" === h && (d.startsWith("file:") || "file:" === location.protocol && this.ld(d)) ? (d.startsWith(this.D) && (d = d.substr(this.D.length)), d = await this.tb(d), URL.createObjectURL(new Blob([d], {
                type: "application/javascript"
            }))) : d
        }
        async rf(d) {
            const h = d.filename;
            switch (d.as) {
                case "text":
                    return await this.we(h);
                case "buffer":
                    return await this.tb(h);
                default:
                    throw Error("unsupported type");
            }
        }
        fd(d) {
            const h = window.cordova.file.applicationDirectory + "www/" + d.toLowerCase();
            return new Promise((l, n) => {
                window.resolveLocalFileSystemURL(h, q => {
                    q.file(l, n)
                }, n)
            })
        }
        async we(d) {
            d = await this.fd(d);
            return await A(d)
        }
        tc() {
            if (u.length && !(8 <= w)) {
                w++;
                var d = u.shift();
                this.Ze(d.filename, d.Jg, d.Eg)
            }
        }
        tb(d) {
            return new Promise((h, l) => {
                u.push({
                    filename: d,
                    Jg: n => {
                        w--;
                        this.tc();
                        h(n)
                    },
                    Eg: n => {
                        w--;
                        this.tc();
                        l(n)
                    }
                });
                this.tc()
            })
        }
        async Ze(d, h, l) {
            try {
                const n = await this.fd(d),
                    q = await B(n);
                h(q)
            } catch (n) {
                l(n)
            }
        }
        async Ye() {
            const d = [];
            for (const [h, l] of Object.entries(this.ia)) d.push(this.Xe(h, l));
            await Promise.all(d)
        }
        async Xe(d, h) {
            if ("object" === typeof h) this.ia[d] = new Blob([h.str], {
                type: h.type
            }), this.Sb[d] = h.str;
            else {
                let l = await this.ff(h);
                l || (l = this.af(h));
                this.ia[d] = l
            }
        }
        async ff(d) {
            try {
                return await (await fetch(d)).blob()
            } catch (h) {
                return console.warn("Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.",
                    h), null
            }
        }
        af(d) {
            d = this.Qf(d);
            return this.We(d.data, d.Gg)
        }
        Qf(d) {
            var h = d.indexOf(",");
            if (0 > h) throw new URIError("expected comma in data: uri");
            var l = d.substring(h + 1);
            h = d.substring(5, h).split(";");
            d = h[0] || "";
            const n = h[2];
            l = "base64" === h[1] || "base64" === n ? atob(l) : decodeURIComponent(l);
            return {
                Gg: d,
                data: l
            }
        }
        We(d, h) {
            var l = d.length;
            let n = l >> 2,
                q = new Uint8Array(l),
                t = new Uint32Array(q.buffer, 0, n),
                r, z;
            for (z = r = 0; r < n; ++r) t[r] = d.charCodeAt(z++) | d.charCodeAt(z++) << 8 | d.charCodeAt(z++) << 16 | d.charCodeAt(z++) << 24;
            for (l &=
                3; l--;) q[z] = d.charCodeAt(z), ++z;
            return new Blob([q], {
                type: h
            })
        }
    }
}
"use strict"; {
    const g = self.Ta;

    function a(e) {
        return e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents || e.originalEvent && e.originalEvent.sourceCapabilities && e.originalEvent.sourceCapabilities.firesTouchEvents
    }
    const b = new Map([
            ["OSLeft", "MetaLeft"],
            ["OSRight", "MetaRight"]
        ]),
        c = {
            dispatchRuntimeEvent: !0,
            dispatchUserScriptEvent: !0
        },
        f = {
            dispatchUserScriptEvent: !0
        },
        m = {
            dispatchRuntimeEvent: !0
        };

    function p(e) {
        return new Promise((k, d) => {
            const h = document.createElement("link");
            h.onload = () => k(h);
            h.onerror = l => d(l);
            h.rel =
                "stylesheet";
            h.href = e;
            document.head.appendChild(h)
        })
    }

    function v(e) {
        return new Promise((k, d) => {
            const h = new Image;
            h.onload = () => k(h);
            h.onerror = l => d(l);
            h.src = e
        })
    }
    async function A(e) {
        e = URL.createObjectURL(e);
        try {
            return await v(e)
        } finally {
            URL.revokeObjectURL(e)
        }
    }

    function B(e) {
        return new Promise((k, d) => {
            let h = new FileReader;
            h.onload = l => k(l.target.result);
            h.onerror = l => d(l);
            h.readAsText(e)
        })
    }
    async function u(e, k, d) {
        if (!/firefox/i.test(navigator.userAgent)) return await A(e);
        var h = await B(e);
        h = (new DOMParser).parseFromString(h,
            "image/svg+xml");
        const l = h.documentElement;
        if (l.hasAttribute("width") && l.hasAttribute("height")) {
            const n = l.getAttribute("width"),
                q = l.getAttribute("height");
            if (!n.includes("%") && !q.includes("%")) return await A(e)
        }
        l.setAttribute("width", k + "px");
        l.setAttribute("height", d + "px");
        h = (new XMLSerializer).serializeToString(h);
        e = new Blob([h], {
            type: "image/svg+xml"
        });
        return await A(e)
    }

    function w(e) {
        do {
            if (e.parentNode && e.hasAttribute("contenteditable")) return !0;
            e = e.parentNode
        } while (e);
        return !1
    }
    const C = new Set(["canvas",
        "body", "html"
    ]);

    function y(e) {
        C.has(e.target.tagName.toLowerCase()) && e.preventDefault()
    }

    function E(e) {
        (e.metaKey || e.ctrlKey) && e.preventDefault()
    }
    self.C3_GetSvgImageSize = async function(e) {
        e = await A(e);
        if (0 < e.width && 0 < e.height) return [e.width, e.height]; {
            e.style.position = "absolute";
            e.style.left = "0px";
            e.style.top = "0px";
            e.style.visibility = "hidden";
            document.body.appendChild(e);
            const k = e.getBoundingClientRect();
            document.body.removeChild(e);
            return [k.width, k.height]
        }
    };
    self.C3_RasterSvgImageBlob = async function(e,
        k, d, h, l) {
        e = await u(e, k, d);
        const n = document.createElement("canvas");
        n.width = h;
        n.height = l;
        n.getContext("2d").drawImage(e, 0, 0, k, d);
        return n
    };
    let F = !1;
    document.addEventListener("pause", () => F = !0);
    document.addEventListener("resume", () => F = !1);

    function H() {
        try {
            return window.parent && window.parent.document.hasFocus()
        } catch (e) {
            return !1
        }
    }
    g.sb(class extends self.ub {
        constructor(e) {
            super(e, "runtime");
            this.Qd = !0;
            this.Na = -1;
            this.Zc = "any";
            this.Hd = this.Id = !1;
            this.Tc = this.mb = this.ya = null;
            e.B("canvas", "update-size", h =>
                this.Of(h));
            e.B("runtime", "invoke-download", h => this.Bf(h));
            e.B("runtime", "raster-svg-image", h => this.If(h));
            e.B("runtime", "get-svg-image-size", h => this.zf(h));
            e.B("runtime", "set-target-orientation", h => this.Mf(h));
            e.B("runtime", "register-sw", () => this.Jf());
            e.B("runtime", "post-to-debugger", h => this.Bd(h));
            e.B("runtime", "go-to-script", h => this.Bd(h));
            e.B("runtime", "before-start-ticking", () => this.qf());
            e.B("runtime", "debug-highlight", h => this.tf(h));
            e.B("runtime", "enable-device-orientation", () => this.Ve());
            e.B("runtime", "enable-device-motion", () => this.Ue());
            e.B("runtime", "add-stylesheet", h => this.nf(h));
            e.B("runtime", "alert", h => this.pf(h));
            e.B("runtime", "hide-cordova-splash", () => this.Af());
            const k = new Set(["input", "textarea", "datalist"]);
            window.addEventListener("contextmenu", h => {
                const l = h.target;
                k.has(l.tagName.toLowerCase()) || w(l) || h.preventDefault()
            });
            const d = e.J;
            window.addEventListener("selectstart", y);
            window.addEventListener("gesturehold", y);
            d.addEventListener("selectstart", y);
            d.addEventListener("gesturehold",
                y);
            window.addEventListener("touchstart", y, {
                passive: !1
            });
            "undefined" !== typeof PointerEvent ? (window.addEventListener("pointerdown", y, {
                passive: !1
            }), d.addEventListener("pointerdown", y)) : d.addEventListener("touchstart", y);
            this.jb = 0;
            window.addEventListener("mousedown", h => {
                1 === h.button && h.preventDefault()
            });
            window.addEventListener("mousewheel", E, {
                passive: !1
            });
            window.addEventListener("wheel", E, {
                passive: !1
            });
            window.addEventListener("resize", () => this.Pf());
            window.addEventListener("fullscreenchange", () => this.Cc());
            window.addEventListener("webkitfullscreenchange", () => this.Cc());
            window.addEventListener("mozfullscreenchange", () => this.Cc());
            window.addEventListener("fullscreenerror", h => this.Dc(h));
            window.addEventListener("webkitfullscreenerror", h => this.Dc(h));
            window.addEventListener("mozfullscreenerror", h => this.Dc(h));
            e.kc() && window.addEventListener("focusout", () => {
                {
                    const n = document.activeElement;
                    if (n) {
                        var h = n.tagName.toLowerCase();
                        var l = new Set("email number password search tel text url".split(" "));
                        h = "textarea" ===
                            h ? !0 : "input" === h ? l.has(n.type.toLowerCase() || "text") : w(n)
                    } else h = !1
                }
                h || (document.scrollingElement.scrollTop = 0)
            });
            this.Ia = new Set;
            this.Tb = new WeakSet;
            this.oa = !1
        }
        qf() {
            "cordova" === this.v.L ? (document.addEventListener("pause", () => this.Gc(!0)), document.addEventListener("resume", () => this.Gc(!1))) : document.addEventListener("visibilitychange", () => this.Gc(document.hidden));
            return {
                isSuspended: !(!document.hidden && !F)
            }
        }
        cd() {
            window.addEventListener("focus", () => this.Gb("window-focus"));
            window.addEventListener("blur",
                () => {
                    this.Gb("window-blur", {
                        parentHasFocus: H()
                    });
                    this.jb = 0
                });
            window.addEventListener("keydown", k => this.Ad("keydown", k));
            window.addEventListener("keyup", k => this.Ad("keyup", k));
            window.addEventListener("dblclick", k => this.Ec("dblclick", k, c));
            window.addEventListener("wheel", k => this.Ff(k));
            "undefined" !== typeof PointerEvent ? (window.addEventListener("pointerdown", k => {
                this.xc(k);
                this.Ua("pointerdown", k)
            }), this.v.ra && "undefined" !== typeof window.onpointerrawupdate && self === self.top ? (this.mb = new self.Ke(() => this.df(),
                5), this.mb.Ld = !0, window.addEventListener("pointerrawupdate", k => this.Gf(k))) : window.addEventListener("pointermove", k => this.Ua("pointermove", k)), window.addEventListener("pointerup", k => this.Ua("pointerup", k)), window.addEventListener("pointercancel", k => this.Ua("pointercancel", k))) : (window.addEventListener("mousedown", k => {
                this.xc(k);
                this.Fc("pointerdown", k)
            }), window.addEventListener("mousemove", k => this.Fc("pointermove", k)), window.addEventListener("mouseup", k => this.Fc("pointerup", k)), window.addEventListener("touchstart",
                k => {
                    this.xc(k);
                    this.Eb("pointerdown", k)
                }), window.addEventListener("touchmove", k => this.Eb("pointermove", k)), window.addEventListener("touchend", k => this.Eb("pointerup", k)), window.addEventListener("touchcancel", k => this.Eb("pointercancel", k)));
            const e = () => this.Hc();
            window.addEventListener("pointerup", e, !0);
            window.addEventListener("touchend", e, !0);
            window.addEventListener("click", e, !0);
            window.addEventListener("keydown", e, !0);
            window.addEventListener("gamepadconnected", e, !0)
        }
        Gb(e, k) {
            x(this, e, k || null, m)
        }
        wa() {
            return this.v.wa()
        }
        va() {
            return this.v.va()
        }
        Pf() {
            const e =
                this.wa(),
                k = this.va();
            this.Gb("window-resize", {
                innerWidth: e,
                innerHeight: k,
                devicePixelRatio: window.devicePixelRatio
            });
            this.v.kc() && (-1 !== this.Na && clearTimeout(this.Na), this.Cd(e, k, 0))
        }
        Xf(e, k, d) {
            -1 !== this.Na && clearTimeout(this.Na);
            this.Na = setTimeout(() => this.Cd(e, k, d), 48)
        }
        Cd(e, k, d) {
            const h = this.wa(),
                l = this.va();
            this.Na = -1;
            h != e || l != k ? this.Gb("window-resize", {
                innerWidth: h,
                innerHeight: l,
                devicePixelRatio: window.devicePixelRatio
            }) : 10 > d && this.Xf(h, l, d + 1)
        }
        Mf(e) {
            this.Zc = e.targetOrientation
        }
        pg() {
            const e = this.Zc;
            if (screen.orientation && screen.orientation.lock) screen.orientation.lock(e).catch(k => console.warn("[Construct 3] Failed to lock orientation: ", k));
            else try {
                let k = !1;
                screen.lockOrientation ? k = screen.lockOrientation(e) : screen.webkitLockOrientation ? k = screen.webkitLockOrientation(e) : screen.mozLockOrientation ? k = screen.mozLockOrientation(e) : screen.msLockOrientation && (k = screen.msLockOrientation(e));
                k || console.warn("[Construct 3] Failed to lock orientation")
            } catch (k) {
                console.warn("[Construct 3] Failed to lock orientation: ",
                    k)
            }
        }
        Cc() {
            const e = g.jc();
            e && "any" !== this.Zc && this.pg();
            x(this, "fullscreenchange", {
                isFullscreen: e,
                innerWidth: this.wa(),
                innerHeight: this.va()
            })
        }
        Dc(e) {
            console.warn("[Construct 3] Fullscreen request failed: ", e);
            x(this, "fullscreenerror", {
                isFullscreen: g.jc(),
                innerWidth: this.wa(),
                innerHeight: this.va()
            })
        }
        Gc(e) {
            e ? this.v.sc() : this.v.Ic();
            x(this, "visibilitychange", {
                hidden: e
            })
        }
        Ad(e, k) {
            "Backspace" === k.key && y(k);
            const d = b.get(k.code) || k.code;
            D(this, e, {
                code: d,
                key: k.key,
                which: k.which,
                repeat: k.repeat,
                altKey: k.altKey,
                ctrlKey: k.ctrlKey,
                metaKey: k.metaKey,
                shiftKey: k.shiftKey,
                timeStamp: k.timeStamp
            }, c)
        }
        Ff(e) {
            x(this, "wheel", {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                deltaZ: e.deltaZ,
                deltaMode: e.deltaMode,
                timeStamp: e.timeStamp
            }, c)
        }
        Ec(e, k, d) {
            a(k) || D(this, e, {
                button: k.button,
                buttons: k.buttons,
                clientX: k.clientX,
                clientY: k.clientY,
                pageX: k.pageX,
                pageY: k.pageY,
                timeStamp: k.timeStamp
            }, d)
        }
        Fc(e, k) {
            if (!a(k)) {
                var d = this.jb;
                "pointerdown" === e && 0 !== d ? e = "pointermove" : "pointerup" ===
                    e && 0 !== k.buttons && (e = "pointermove");
                D(this, e, {
                    pointerId: 1,
                    pointerType: "mouse",
                    button: k.button,
                    buttons: k.buttons,
                    lastButtons: d,
                    clientX: k.clientX,
                    clientY: k.clientY,
                    pageX: k.pageX,
                    pageY: k.pageY,
                    width: 0,
                    height: 0,
                    pressure: 0,
                    tangentialPressure: 0,
                    tiltX: 0,
                    tiltY: 0,
                    twist: 0,
                    timeStamp: k.timeStamp
                }, c);
                this.jb = k.buttons;
                this.Ec(k.type, k, f)
            }
        }
        Ua(e, k) {
            if (this.mb && "pointermove" !== e) {
                var d = this.mb;
                d.bb || (K(d), d.Qb = Date.now())
            }
            d = 0;
            "mouse" === k.pointerType && (d = this.jb);
            D(this, e, {
                pointerId: k.pointerId,
                pointerType: k.pointerType,
                button: k.button,
                buttons: k.buttons,
                lastButtons: d,
                clientX: k.clientX,
                clientY: k.clientY,
                pageX: k.pageX,
                pageY: k.pageY,
                width: k.width || 0,
                height: k.height || 0,
                pressure: k.pressure || 0,
                tangentialPressure: k.tangentialPressure || 0,
                tiltX: k.tiltX || 0,
                tiltY: k.tiltY || 0,
                twist: k.twist || 0,
                timeStamp: k.timeStamp
            }, c);
            "mouse" === k.pointerType && (d = "mousemove", "pointerdown" === e ? d = "mousedown" : "pointerup" === e && (d = "mouseup"), this.Ec(d, k, f), this.jb = k.buttons)
        }
        Gf(e) {
            this.Tc = e;
            e = this.mb;
            if (-1 === e.Oa) {
                var k = Date.now(),
                    d = k - e.Qb,
                    h = e.vg;
                d >= h && e.Ld ? (e.Qb = k, e.bb = !0, e.Kc(), e.bb = !1) : e.Oa = self.setTimeout(e.ce, Math.max(h - d, 4))
            }
        }
        df() {
            this.Ua("pointermove", this.Tc);
            this.Tc = null
        }
        Eb(e, k) {
            for (let d = 0, h = k.changedTouches.length; d < h; ++d) {
                const l = k.changedTouches[d];
                D(this, e, {
                    pointerId: l.identifier,
                    pointerType: "touch",
                    button: 0,
                    buttons: 0,
                    lastButtons: 0,
                    clientX: l.clientX,
                    clientY: l.clientY,
                    pageX: l.pageX,
                    pageY: l.pageY,
                    width: 2 * (l.radiusX || l.webkitRadiusX || 0),
                    height: 2 * (l.radiusY || l.webkitRadiusY || 0),
                    pressure: l.force || l.webkitForce || 0,
                    tangentialPressure: 0,
                    tiltX: 0,
                    tiltY: 0,
                    twist: l.rotationAngle || 0,
                    timeStamp: k.timeStamp
                }, c)
            }
        }
        xc(e) {
            window !== window.top && window.focus();
            this.yd(e.target) && document.activeElement && !this.yd(document.activeElement) && document.activeElement.blur()
        }
        yd(e) {
            return !e || e === document || e === window || e === document.body || "canvas" === e.tagName.toLowerCase()
        }
        Ve() {
            this.Id || (this.Id = !0, window.addEventListener("deviceorientation", e => this.vf(e)), window.addEventListener("deviceorientationabsolute", e => this.wf(e)))
        }
        Ue() {
            this.Hd || (this.Hd = !0, window.addEventListener("devicemotion",
                e => this.uf(e)))
        }
        vf(e) {
            x(this, "deviceorientation", {
                absolute: !!e.absolute,
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
                timeStamp: e.timeStamp,
                webkitCompassHeading: e.webkitCompassHeading,
                webkitCompassAccuracy: e.webkitCompassAccuracy
            }, c)
        }
        wf(e) {
            x(this, "deviceorientationabsolute", {
                absolute: !!e.absolute,
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
                timeStamp: e.timeStamp
            }, c)
        }
        uf(e) {
            let k = null;
            var d = e.acceleration;
            d && (k = {
                x: d.x || 0,
                y: d.y || 0,
                z: d.z || 0
            });
            d = null;
            var h = e.accelerationIncludingGravity;
            h && (d = {
                x: h.x ||
                    0,
                y: h.y || 0,
                z: h.z || 0
            });
            h = null;
            const l = e.rotationRate;
            l && (h = {
                alpha: l.alpha || 0,
                beta: l.beta || 0,
                gamma: l.gamma || 0
            });
            x(this, "devicemotion", {
                acceleration: k,
                accelerationIncludingGravity: d,
                rotationRate: h,
                interval: e.interval,
                timeStamp: e.timeStamp
            }, c)
        }
        Of(e) {
            const k = this.v.J;
            k.style.width = e.styleWidth + "px";
            k.style.height = e.styleHeight + "px";
            k.style.marginLeft = e.marginLeft + "px";
            k.style.marginTop = e.marginTop + "px";
            this.Qd && (k.style.display = "", this.Qd = !1)
        }
        Bf(e) {
            const k = e.url;
            e = e.filename;
            const d = document.createElement("a"),
                h = document.body;
            d.textContent = e;
            d.href = k;
            d.download = e;
            h.appendChild(d);
            d.click();
            h.removeChild(d)
        }
        async If(e) {
            var k = e.imageBitmapOpts;
            e = await self.C3_RasterSvgImageBlob(e.blob, e.imageWidth, e.imageHeight, e.surfaceWidth, e.surfaceHeight);
            k = k ? await createImageBitmap(e, k) : await createImageBitmap(e);
            return {
                imageBitmap: k,
                transferables: [k]
            }
        }
        async zf(e) {
            return await self.C3_GetSvgImageSize(e.blob)
        }
        async nf(e) {
            await p(e.url)
        }
        Hc() {
            var e = [...this.Ia];
            this.Ia.clear();
            if (!this.oa)
                for (const k of e)(e = k.play()) &&
                    e.catch(() => {
                        this.Tb.has(k) || this.Ia.add(k)
                    })
        }
        ua(e) {
            if ("function" !== typeof e.play) throw Error("missing play function");
            this.Tb.delete(e);
            let k;
            try {
                k = e.play()
            } catch (d) {
                this.Ia.add(e);
                return
            }
            k && k.catch(() => {
                this.Tb.has(e) || this.Ia.add(e)
            })
        }
        Ca(e) {
            this.Ia.delete(e);
            this.Tb.add(e)
        }
        Ab(e) {
            this.oa = !!e
        }
        Af() {
            navigator.splashscreen && navigator.splashscreen.hide && navigator.splashscreen.hide()
        }
        tf(e) {
            if (e.show) {
                this.ya || (this.ya = document.createElement("div"), this.ya.id = "inspectOutline", document.body.appendChild(this.ya));
                var k = this.ya;
                k.style.display = "";
                k.style.left = e.left - 1 + "px";
                k.style.top = e.top - 1 + "px";
                k.style.width = e.width + 2 + "px";
                k.style.height = e.height + 2 + "px";
                k.textContent = e.name
            } else this.ya && (this.ya.style.display = "none")
        }
        Jf() {
            window.C3_RegisterSW && window.C3_RegisterSW()
        }
        Bd(e) {
            window.c3_postToMessagePort && (e.from = "runtime", window.c3_postToMessagePort(e))
        }
        lf(e, k) {
            return this.v.nd(this.Xa, "js-invoke-function", {
                name: e,
                params: k
            }, void 0, void 0)
        }
        pf(e) {
            alert(e.message)
        }
    })
}
"use strict";
async function O(g) {
    if (g.ug) throw Error("already initialised");
    g.ug = !0;
    var a = g.Xb.wc("dispatchworker.js");
    g.Mc = await g.Xb.cc(a, g.D, {
        name: "DispatchWorker"
    });
    a = new MessageChannel;
    g.Qc = a.port1;
    g.Mc.postMessage({
        type: "_init",
        "in-port": a.port2
    }, [a.port2]);
    g.Xc = await Q(g)
}

function P(g) {
    return [g.Qc, g.Xc]
}
async function Q(g) {
    const a = g.Rd.length;
    var b = g.Xb.wc("jobworker.js");
    b = await g.Xb.cc(b, g.D, {
        name: "JobWorker" + a
    });
    const c = new MessageChannel,
        f = new MessageChannel;
    g.Mc.postMessage({
        type: "_addJobWorker",
        port: c.port1
    }, [c.port1]);
    b.postMessage({
        type: "init",
        number: a,
        "dispatch-port": c.port2,
        "output-port": f.port2
    }, [c.port2, f.port2]);
    g.Rd.push(b);
    return f.port1
}
self.Ge = class {
    constructor(g) {
        this.Xb = g;
        this.D = g.D;
        this.D = "preview" === g.L ? this.D + "c3/workers/" : this.D + g.Yb;
        this.xg = Math.min(navigator.hardwareConcurrency || 2, 16);
        this.Mc = null;
        this.Rd = [];
        this.Xc = this.Qc = null
    }
};
"use strict";
window.C3_IsSupported && (window.c3_runtimeInterface = new self.Ta({
    Kg: !0,
    Lg: "workermain.js",
    Pa: ["scripts/c3runtime.js"],
    rb: [],
    ee: "",
    fe: "module",
    Hg: "scripts/",
    bd: ["box2d.wasm.js"],
    de: "html5"
}));
"use strict";
self.Ta.sb(class extends self.ub {
    constructor(g) {
        super(g, "mouse");
        G(this, "cursor", a => {
            document.documentElement.style.cursor = a
        })
    }
});
"use strict"; {
    function g(a) {
        a.stopPropagation()
    }
    self.Ta.sb(class extends self.xe {
        constructor(a) {
            super(a, "button")
        }
        gd(a, b) {
            const c = document.createElement("input");
            var f = c;
            b.isCheckbox ? (c.type = "checkbox", f = document.createElement("label"), f.appendChild(c), f.appendChild(document.createTextNode("")), f.style.fontFamily = "sans-serif", f.style.userSelect = "none", f.style.webkitUserSelect = "none", f.style.display = "inline-block", f.style.color = "black") : c.type = "button";
            f.style.position = "absolute";
            f.addEventListener("touchstart",
                g);
            f.addEventListener("touchmove", g);
            f.addEventListener("touchend", g);
            f.addEventListener("mousedown", g);
            f.addEventListener("mouseup", g);
            f.addEventListener("keydown", g);
            f.addEventListener("keyup", g);
            c.addEventListener("click", () => {
                var m = {
                    isChecked: c.checked
                };
                m.elementId = a;
                D(this, "click", m)
            });
            b.id && (c.id = b.id);
            this.rc(f, b);
            return f
        }
        wd(a) {
            return "input" === a.tagName.toLowerCase() ? a : a.firstChild
        }
        vc(a) {
            return this.wd(a)
        }
        rc(a, b) {
            const c = this.wd(a);
            c.checked = b.isChecked;
            c.disabled = !b.isEnabled;
            a.title = b.title;
            a === c ? c.value = b.text : a.lastChild.textContent = b.text
        }
    })
}
"use strict"; {
    const g = 180 / Math.PI;
    self.ea = class extends self.ub {
        constructor(a) {
            super(a, "audio");
            this.Mb = this.f = null;
            this.Ob = this.Pc = !1;
            this.qa = () => this.qg();
            this.ba = [];
            this.C = [];
            this.ha = null;
            this.Sd = "";
            this.Td = -1;
            this.lb = new Map;
            this.Uc = 1;
            this.oa = !1;
            this.$c = 0;
            this.$b = 1;
            this.Nc = 0;
            this.Vd = "HRTF";
            this.Md = "inverse";
            this.Wd = 600;
            this.Ud = 1E4;
            this.Yd = 1;
            this.Od = this.Yc = !1;
            this.ae = this.v.Fe();
            this.ca = new Map;
            this.Fa = new Set;
            this.Rc = !1;
            this.Vc = "";
            this.za = null;
            self.C3Audio_OnMicrophoneStream = (b, c) => this.Ef(b, c);
            this.Lb = null;
            self.C3Audio_GetOutputStream = () => this.yf();
            self.C3Audio_DOMInterface = this;
            I(this, [
                ["create-audio-context", b => this.$e(b)],
                ["play", b => this.Rf(b)],
                ["stop", b => this.ng(b)],
                ["stop-all", () => this.og()],
                ["set-paused", b => this.gg(b)],
                ["set-volume", b => this.lg(b)],
                ["fade-volume", b => this.ef(b)],
                ["set-master-volume", b => this.eg(b)],
                ["set-muted", b => this.fg(b)],
                ["set-silent", b => this.ig(b)],
                ["set-looping", b => this.dg(b)],
                ["set-playback-rate", b => this.hg(b)],
                ["seek", b => this.Yf(b)],
                ["preload", b => this.Sf(b)],
                ["unload", b =>
                    this.rg(b)
                ],
                ["unload-all", () => this.sg()],
                ["set-suspended", b => this.jg(b)],
                ["add-effect", b => this.sd(b)],
                ["set-effect-param", b => this.ag(b)],
                ["remove-effects", b => this.Uf(b)],
                ["tick", b => this.Nf(b)],
                ["load-state", b => this.Cf(b)]
            ])
        }
        async $e(a) {
            a.isiOSCordova && (this.Yc = !0);
            this.$c = a.timeScaleMode;
            this.Vd = ["equalpower", "HRTF", "soundfield"][a.panningModel];
            this.Md = ["linear", "inverse", "exponential"][a.distanceModel];
            this.Wd = a.refDistance;
            this.Ud = a.maxDistance;
            this.Yd = a.rolloffFactor;
            var b = {
                latencyHint: a.latencyHint
            };
            this.ae || (b.sampleRate = 48E3);
            if ("undefined" !== typeof AudioContext) this.f = new AudioContext(b);
            else if ("undefined" !== typeof webkitAudioContext) this.f = new webkitAudioContext(b);
            else throw Error("Web Audio API not supported");
            this.td();
            this.f.onstatechange = () => {
                "running" !== this.f.state && this.td()
            };
            this.Mb = this.f.createGain();
            this.Mb.connect(this.f.destination);
            b = a.listenerPos;
            this.f.listener.setPosition(b[0], b[1], b[2]);
            this.f.listener.setOrientation(0, 0, 1, 0, -1, 0);
            self.C3_GetAudioContextCurrentTime = () =>
                this.dc();
            try {
                await Promise.all(a.preloadList.map(c => this.Cb(c.originalUrl, c.url, c.type, !1)))
            } catch (c) {
                console.error("[Construct 3] Preloading sounds failed: ", c)
            }
            return {
                sampleRate: this.f.sampleRate
            }
        }
        td() {
            this.Ob || (this.Pc = !1, window.addEventListener("pointerup", this.qa, !0), window.addEventListener("touchend", this.qa, !0), window.addEventListener("click", this.qa, !0), window.addEventListener("keydown", this.qa, !0), this.Ob = !0)
        }
        bf() {
            this.Ob && (this.Pc = !0, window.removeEventListener("pointerup", this.qa, !0), window.removeEventListener("touchend",
                this.qa, !0), window.removeEventListener("click", this.qa, !0), window.removeEventListener("keydown", this.qa, !0), this.Ob = !1)
        }
        qg() {
            if (!this.Pc) {
                var a = this.f;
                "suspended" === a.state && a.resume && a.resume();
                var b = a.createBuffer(1, 220, 22050),
                    c = a.createBufferSource();
                c.buffer = b;
                c.connect(a.destination);
                c.start(0);
                "running" === a.state && this.bf()
            }
        }
        W() {
            return this.f
        }
        dc() {
            return this.f.currentTime
        }
        sa() {
            return this.Mb
        }
        jd(a) {
            return (a = this.ca.get(a.toLowerCase())) ? a[0].P() : this.sa()
        }
        ge(a, b) {
            a = a.toLowerCase();
            let c = this.ca.get(a);
            c || (c = [], this.ca.set(a, c));
            b.cg(c.length);
            b.kg(a);
            c.push(b);
            this.Ed(a)
        }
        Ed(a) {
            let b = this.sa();
            const c = this.ca.get(a);
            if (c && c.length) {
                b = c[0].P();
                for (let f = 0, m = c.length; f < m; ++f) {
                    const p = c[f];
                    f + 1 === m ? p.S(this.sa()) : p.S(c[f + 1].P())
                }
            }
            for (const f of this.ma(a)) f.Le(b);
            this.za && this.Vc === a && (this.za.disconnect(), this.za.connect(b))
        }
        wb() {
            return this.Uc
        }
        xb() {
            return this.oa
        }
        bg() {
            this.Od = !0
        }
        ze(a, b) {
            return b ? this.v.tg(a).then(c => {
                    const f = this.f.createBuffer(1, c.length, 48E3);
                    f.getChannelData(0).set(c);
                    return f
                }) :
                new Promise((c, f) => {
                    this.f.decodeAudioData(a, c, f)
                })
        }
        ua(a) {
            this.v.ua(a)
        }
        Ca(a) {
            this.v.Ca(a)
        }
        od(a) {
            let b = 0;
            for (let c = 0, f = this.C.length; c < f; ++c) {
                const m = this.C[c];
                this.C[b] = m;
                m.K === a ? m.c() : ++b
            }
            this.C.length = b
        }
        Me() {
            let a = 0;
            for (let b = 0, c = this.ba.length; b < c; ++b) {
                const f = this.ba[b];
                this.ba[a] = f;
                f.ta() ? f.c() : ++a
            }
            this.ba.length = a
        }* ma(a) {
            if (a)
                for (const b of this.C) self.ea.Ae(b.$, a) && (yield b);
            else this.ha && !this.ha.T() && (yield this.ha)
        }
        async Cb(a, b, c, f, m) {
            for (const p of this.ba)
                if (p.Ra() === b) return await R(p),
                    p;
            if (m) return null;
            f && (this.Yc || this.Od) && this.Me();
            m = "audio/webm; codecs=opus" === c && !this.ae;
            f && m && this.bg();
            a = !f || this.Yc || m ? new self.ue(this, a, b, c, f, m) : new self.se(this, a, b, c, f);
            this.ba.push(a);
            await R(a);
            return a
        }
        async uc(a, b, c, f, m) {
            for (const p of this.C)
                if (p.Ra() === b && (p.bc() || m)) return p.Oe(f), p;
            a = await this.Cb(a, b, c, m);
            f = "html5" === a.Jc ? new self.te(a.i, a, f) : new self.ve(a.i, a, f);
            this.C.push(f);
            return f
        }
        Se(a) {
            let b = this.lb.get(a);
            if (!b) {
                let c = null;
                b = {
                    ad: 0,
                    promise: new Promise(f => c = f),
                    resolve: c
                };
                this.lb.set(a, b)
            }
            b.ad++
        }
        Vf(a) {
            const b = this.lb.get(a);
            if (!b) throw Error("expected pending tag");
            b.ad--;
            0 === b.ad && (b.resolve(), this.lb.delete(a))
        }
        qc(a) {
            a || (a = this.Sd);
            return (a = this.lb.get(a)) ? a.promise : Promise.resolve()
        }
        Db() {
            if (0 < this.Fa.size) J(this);
            else
                for (const a of this.C)
                    if (a.kd()) {
                        J(this);
                        break
                    }
        }
        Da() {
            for (var a of this.Fa) a.Da();
            a = this.dc();
            for (var b of this.C) b.Da(a);
            b = this.C.filter(c => c.kd()).map(c => c.Qa());
            x(this, "state", {
                tickCount: this.Td,
                audioInstances: b,
                analysers: [...this.Fa].map(c => c.Ce())
            });
            0 === b.length && 0 === this.Fa.size && this.Pb && (this.v.Wf(this.be), this.Pb = !1)
        }
        mc(a, b, c) {
            x(this, "trigger", {
                type: a,
                tag: b,
                aiid: c
            })
        }
        async Rf(a) {
            const b = a.originalUrl,
                c = a.url,
                f = a.type,
                m = a.isMusic,
                p = a.tag,
                v = a.isLooping,
                A = a.vol,
                B = a.pos,
                u = a.panning;
            let w = a.off;
            0 < w && !a.trueClock && (this.f.getOutputTimestamp ? (a = this.f.getOutputTimestamp(), w = w - a.performanceTime / 1E3 + a.contextTime) : w = w - performance.now() / 1E3 + this.f.currentTime);
            this.Sd = p;
            this.Se(p);
            try {
                this.ha = await this.uc(b, c, f, p, m), u ? (this.ha.zb(!0), this.ha.Ne(u.x,
                    u.y, u.angle, u.innerAngle, u.outerAngle, u.outerGain), u.hasOwnProperty("uid") && this.ha.Pe(u.uid)) : this.ha.zb(!1), this.ha.Play(v, A, B, w)
            } catch (C) {
                console.error("[Construct 3] Audio: error starting playback: ", C);
                return
            } finally {
                this.Vf(p)
            }
            J(this)
        }
        ng(a) {
            a = a.tag;
            for (const b of this.ma(a)) b.na()
        }
        og() {
            for (const a of this.C) a.na()
        }
        gg(a) {
            const b = a.tag;
            a = a.paused;
            for (const c of this.ma(b)) a ? c.Sa() : c.yb();
            this.Db()
        }
        lg(a) {
            const b = a.tag;
            a = a.vol;
            for (const c of this.ma(b)) c.Bb(a)
        }
        async ef(a) {
            const b = a.tag,
                c = a.vol,
                f = a.duration;
            a = a.stopOnEnd;
            await this.qc(b);
            for (const m of this.ma(b)) m.Be(c, f, a);
            this.Db()
        }
        eg(a) {
            this.Uc = a.vol;
            for (const b of this.C) b.Ib()
        }
        fg(a) {
            const b = a.tag;
            a = a.isMuted;
            for (const c of this.ma(b)) c.pd(a)
        }
        ig(a) {
            this.oa = a.isSilent;
            this.v.Ab(this.oa);
            for (const b of this.C) b.Hb()
        }
        dg(a) {
            const b = a.tag;
            a = a.isLooping;
            for (const c of this.ma(b)) c.oc(a)
        }
        async hg(a) {
            const b = a.tag;
            a = a.rate;
            await this.qc(b);
            for (const c of this.ma(b)) c.rd(a)
        }
        async Yf(a) {
            const b = a.tag;
            a = a.pos;
            await this.qc(b);
            for (const c of this.ma(b)) c.nc(a)
        }
        async Sf(a) {
            const b =
                a.originalUrl,
                c = a.url,
                f = a.type;
            a = a.isMusic;
            try {
                await this.uc(b, c, f, "", a)
            } catch (m) {
                console.error("[Construct 3] Audio: error preloading: ", m)
            }
        }
        async rg(a) {
            if (a = await this.Cb("", a.url, a.type, a.isMusic, !0)) a.c(), a = this.ba.indexOf(a), -1 !== a && this.ba.splice(a, 1)
        }
        sg() {
            for (const a of this.ba) a.c();
            this.ba.length = 0
        }
        jg(a) {
            a = a.isSuspended;
            !a && this.f.resume && this.f.resume();
            for (const b of this.C) b.pc(a);
            a && this.f.suspend && this.f.suspend()
        }
        Nf(a) {
            this.$b = a.timeScale;
            this.Nc = a.gameTime;
            this.Td = a.tickCount;
            if (0 !==
                this.$c)
                for (var b of this.C) b.Ea();
            (b = a.listenerPos) && this.f.listener.setPosition(b[0], b[1], b[2]);
            for (const c of a.instPans) {
                a = c.uid;
                for (const f of this.C) f.ga === a && f.qd(c.x, c.y, c.angle)
            }
        }
        async sd(a) {
            var b = a.type;
            const c = a.tag;
            var f = a.params;
            if ("filter" === b) f = new self.me(this, ...f);
            else if ("delay" === b) f = new self.ke(this, ...f);
            else if ("convolution" === b) {
                b = null;
                try {
                    b = await this.Cb(a.bufferOriginalUrl, a.bufferUrl, a.bufferType, !1)
                } catch (m) {
                    console.log("[Construct 3] Audio: error loading convolution: ",
                        m);
                    return
                }
                f = new self.je(this, b.aa, ...f);
                f.Zf(a.bufferOriginalUrl, a.bufferType)
            } else if ("flanger" === b) f = new self.ne(this, ...f);
            else if ("phaser" === b) f = new self.pe(this, ...f);
            else if ("gain" === b) f = new self.oe(this, ...f);
            else if ("tremolo" === b) f = new self.re(this, ...f);
            else if ("ringmod" === b) f = new self.qe(this, ...f);
            else if ("distortion" === b) f = new self.le(this, ...f);
            else if ("compressor" === b) f = new self.ie(this, ...f);
            else if ("analyser" === b) f = new self.he(this, ...f);
            else throw Error("invalid effect type");
            this.ge(c,
                f);
            this.Dd()
        }
        ag(a) {
            const b = a.index,
                c = a.param,
                f = a.value,
                m = a.ramp,
                p = a.time;
            a = this.ca.get(a.tag);
            !a || 0 > b || b >= a.length || (a[b].X(c, f, m, p), this.Dd())
        }
        Uf(a) {
            a = a.tag.toLowerCase();
            const b = this.ca.get(a);
            if (b && b.length) {
                for (const c of b) c.c();
                this.ca.delete(a);
                this.Ed(a)
            }
        }
        Re(a) {
            this.Fa.add(a);
            this.Db()
        }
        Tf(a) {
            this.Fa.delete(a)
        }
        Dd() {
            this.Rc || (this.Rc = !0, Promise.resolve().then(() => this.cf()))
        }
        cf() {
            const a = {};
            for (const [b, c] of this.ca) a[b] = c.map(f => f.Qa());
            x(this, "fxstate", {
                fxstate: a
            });
            this.Rc = !1
        }
        async Cf(a) {
            const b =
                a.saveLoadMode;
            if (3 !== b)
                for (var c of this.C) c.ta() && 1 === b || (c.ta() || 2 !== b) && c.na();
            for (const f of this.ca.values())
                for (const m of f) m.c();
            this.ca.clear();
            this.$b = a.timeScale;
            this.Nc = a.gameTime;
            c = a.listenerPos;
            this.f.listener.setPosition(c[0], c[1], c[2]);
            this.oa = a.isSilent;
            this.v.Ab(this.oa);
            this.Uc = a.masterVolume;
            c = [];
            for (const f of Object.values(a.effects)) c.push(Promise.all(f.map(m => this.sd(m))));
            await Promise.all(c);
            await Promise.all(a.playing.map(f => this.mf(f, b)));
            this.Db()
        }
        async mf(a, b) {
            if (3 !==
                b) {
                var c = a.bufferOriginalUrl,
                    f = a.bufferUrl,
                    m = a.bufferType,
                    p = a.isMusic,
                    v = a.tag,
                    A = a.isLooping,
                    B = a.volume,
                    u = a.playbackTime;
                if (!p || 1 !== b)
                    if (p || 2 !== b) {
                        b = null;
                        try {
                            b = await this.uc(c, f, m, v, p)
                        } catch (w) {
                            console.error("[Construct 3] Audio: error loading audio state: ", w);
                            return
                        }
                        b.Je(a.pan);
                        b.Play(A, B, u, 0);
                        a.isPlaying || b.Sa();
                        b.zc(a)
                    }
            }
        }
        Ef(a, b) {
            this.za && this.za.disconnect();
            this.Vc = b.toLowerCase();
            this.za = this.f.createMediaStreamSource(a);
            this.za.connect(this.jd(this.Vc))
        }
        yf() {
            this.Lb || (this.Lb = this.f.createMediaStreamDestination(),
                this.Mb.connect(this.Lb));
            return this.Lb.stream
        }
        static Ae(a, b) {
            return a.length !== b.length ? !1 : a === b ? !0 : a.toLowerCase() === b.toLowerCase()
        }
        static Qe(a) {
            return a * g
        }
        static ye(a) {
            return Math.pow(10, a / 20)
        }
        static hd(a) {
            return Math.max(Math.min(self.ea.ye(a), 1), 0)
        }
        static Ie(a) {
            return Math.log(a) / Math.log(10) * 20
        }
        static He(a) {
            return self.ea.Ie(Math.max(Math.min(a, 1), 0))
        }
        static Dg(a, b) {
            return 1 - Math.exp(-b * a)
        }
    };
    self.Ta.sb(self.ea)
}
"use strict";

function R(g) {
    g.Rb || (g.Rb = g.yc());
    return g.Rb
}
self.dd = class {
    constructor(g, a, b, c, f) {
        this.i = g;
        this.zg = a;
        this.Aa = b;
        this.R = c;
        this.wg = f;
        this.Jc = "";
        this.Rb = null
    }
    c() {
        this.Rb = this.i = null
    }
    yc() {}
    W() {
        return this.i.W()
    }
    fc() {
        return this.zg
    }
    Ra() {
        return this.Aa
    }
    ec() {
        return this.R
    }
    ta() {
        return this.wg
    }
    fa() {}
};
"use strict";
self.se = class extends self.dd {
    constructor(g, a, b, c, f) {
        super(g, a, b, c, f);
        this.Jc = "html5";
        this.I = new Audio;
        this.I.crossOrigin = "anonymous";
        this.I.autoplay = !1;
        this.I.preload = "auto";
        this.fb = this.gb = null;
        this.I.addEventListener("canplaythrough", () => !0);
        this.kb = this.W().createGain();
        this.ib = null;
        this.I.addEventListener("canplay", () => {
            this.gb && (this.gb(), this.fb = this.gb = null);
            !this.ib && this.I && (this.ib = this.W().createMediaElementSource(this.I), this.ib.connect(this.kb))
        });
        this.onended = null;
        this.I.addEventListener("ended",
            () => {
                if (this.onended) this.onended()
            });
        this.I.addEventListener("error", m => {
            console.error(`[Construct 3] Audio '${this.Aa}' error: `, m);
            this.fb && (this.fb(m), this.fb = this.gb = null)
        })
    }
    c() {
        this.i.od(this);
        this.kb.disconnect();
        this.kb = null;
        this.ib.disconnect();
        this.ib = null;
        this.I && !this.I.paused && this.I.pause();
        this.I = this.onended = null;
        super.c()
    }
    yc() {
        return new Promise((g, a) => {
            this.gb = g;
            this.fb = a;
            this.I.src = this.Aa
        })
    }
    O() {
        return this.I
    }
    fa() {
        return this.I.duration
    }
};
"use strict";
async function S(g) {
    if (g.xa) return g.xa;
    var a = g.i.v;
    if ("cordova" === a.L && a.ld(g.Aa) && "file:" === location.protocol) g.xa = await a.tb(g.Aa);
    else {
        a = await fetch(g.Aa);
        if (!a.ok) throw Error(`error fetching audio data: ${a.status} ${a.statusText}`);
        g.xa = await a.arrayBuffer()
    }
}
async function U(g) {
    if (g.aa) return g.aa;
    g.aa = await g.i.ze(g.xa, g.yg);
    g.xa = null
}
self.ue = class extends self.dd {
    constructor(g, a, b, c, f, m) {
        super(g, a, b, c, f);
        this.Jc = "webaudio";
        this.aa = this.xa = null;
        this.yg = !!m
    }
    c() {
        this.i.od(this);
        this.aa = this.xa = null;
        super.c()
    }
    async yc() {
        try {
            await S(this), await U(this)
        } catch (g) {
            console.error(`[Construct 3] Failed to load audio '${this.Aa}': `, g)
        }
    }
    fa() {
        return this.aa ? this.aa.duration : 0
    }
};
"use strict"; {
    let g = 0;
    self.ed = class {
        constructor(a, b, c) {
            this.i = a;
            this.K = b;
            this.$ = c;
            this.Jb = g++;
            this.M = this.W().createGain();
            this.M.connect(this.sa());
            this.A = null;
            this.cb = !1;
            this.ka = [0, 0, 0];
            this.ja = [0, 0, 0];
            this.G = !0;
            this.V = this.la = this.F = !1;
            this.ob = 1;
            this.Ga = !1;
            this.Z = 1;
            a = this.i.$c;
            this.Sc = 1 === a && !this.ta() || 2 === a;
            this.$a = this.ga = -1;
            this.$d = !1
        }
        c() {
            this.K = this.i = null;
            this.A && (this.A.disconnect(), this.A = null);
            this.M.disconnect();
            this.M = null
        }
        W() {
            return this.i.W()
        }
        sa() {
            return this.i.jd(this.$)
        }
        wb() {
            return this.i.wb()
        }
        vb() {
            return this.Sc ?
                this.i.Nc : performance.now() / 1E3
        }
        fc() {
            return this.K.fc()
        }
        Ra() {
            return this.K.Ra()
        }
        ec() {
            return this.K.ec()
        }
        ta() {
            return this.K.ta()
        }
        Oe(a) {
            this.$ = a
        }
        T() {}
        bc() {}
        IsPlaying() {
            return !this.G && !this.F && !this.T()
        }
        kd() {
            return !this.G && !this.T()
        }
        Ba() {}
        fa() {
            return this.K.fa()
        }
        Play() {}
        na() {}
        Sa() {}
        yb() {}
        Bb(a) {
            this.ob = a;
            this.M.gain.cancelScheduledValues(0);
            this.$a = -1;
            this.M.gain.value = this.hc()
        }
        Be(a, b, c) {
            if (!this.Ga) {
                a *= this.wb();
                var f = this.M.gain;
                f.cancelScheduledValues(0);
                var m = this.i.dc();
                b = m + b;
                f.setValueAtTime(f.value,
                    m);
                f.linearRampToValueAtTime(a, b);
                this.ob = a;
                this.$a = b;
                this.$d = c
            }
        }
        Ib() {
            this.Bb(this.ob)
        }
        Da(a) {
            -1 !== this.$a && a >= this.$a && (this.$a = -1, this.$d && this.na(), this.i.mc("fade-ended", this.$, this.Jb))
        }
        hc() {
            const a = this.ob * this.wb();
            return isFinite(a) ? a : 0
        }
        pd(a) {
            a = !!a;
            this.Ga !== a && (this.Ga = a, this.Hb())
        }
        xb() {
            return this.i.xb()
        }
        Hb() {}
        oc() {}
        rd(a) {
            this.Z !== a && (this.Z = a, this.Ea())
        }
        Ea() {}
        nc() {}
        pc() {}
        zb(a) {
            a = !!a;
            this.cb !== a && ((this.cb = a) ? (this.A || (this.A = this.W().createPanner(), this.A.panningModel = this.i.Vd, this.A.distanceModel =
                this.i.Md, this.A.refDistance = this.i.Wd, this.A.maxDistance = this.i.Ud, this.A.rolloffFactor = this.i.Yd), this.M.disconnect(), this.M.connect(this.A), this.A.connect(this.sa())) : (this.A.disconnect(), this.M.disconnect(), this.M.connect(this.sa())))
        }
        Ne(a, b, c, f, m, p) {
            this.cb && (this.qd(a, b, c), a = self.ea.Qe, this.A.coneInnerAngle = a(f), this.A.coneOuterAngle = a(m), this.A.coneOuterGain = p)
        }
        qd(a, b, c) {
            this.cb && (this.ka[0] = a, this.ka[1] = b, this.ka[2] = 0, this.ja[0] = Math.cos(c), this.ja[1] = Math.sin(c), this.ja[2] = 0, this.A.setPosition(...this.ka),
                this.A.setOrientation(...this.ja))
        }
        Pe(a) {
            this.ga = a
        }
        ic() {}
        Le(a) {
            const b = this.A || this.M;
            b.disconnect();
            b.connect(a)
        }
        Qa() {
            return {
                aiid: this.Jb,
                tag: this.$,
                duration: this.fa(),
                volume: this.ob,
                isPlaying: this.IsPlaying(),
                playbackTime: this.Ba(),
                playbackRate: this.Z,
                uid: this.ga,
                bufferOriginalUrl: this.fc(),
                bufferUrl: "",
                bufferType: this.ec(),
                isMusic: this.ta(),
                isLooping: this.V,
                isMuted: this.Ga,
                resumePosition: this.ic(),
                pan: this.De()
            }
        }
        zc(a) {
            this.rd(a.playbackRate);
            this.pd(a.isMuted)
        }
        De() {
            if (!this.A) return null;
            const a =
                this.A;
            return {
                pos: this.ka,
                orient: this.ja,
                cia: a.coneInnerAngle,
                coa: a.coneOuterAngle,
                cog: a.coneOuterGain,
                uid: this.ga
            }
        }
        Je(a) {
            if (a) {
                this.zb(!0);
                a = this.A;
                var b = a.pos;
                this.ka[0] = b[0];
                this.ka[1] = b[1];
                this.ka[2] = b[2];
                b = a.orient;
                this.ja[0] = b[0];
                this.ja[1] = b[1];
                this.ja[2] = b[2];
                a.setPosition(...this.ka);
                a.setOrientation(...this.ja);
                a.coneInnerAngle = a.cia;
                a.coneOuterAngle = a.coa;
                a.coneOuterGain = a.cog;
                this.ga = a.uid
            } else this.zb(!1)
        }
    }
}
"use strict";
self.te = class extends self.ed {
    constructor(g, a, b) {
        super(g, a, b);
        this.K.kb.connect(this.M);
        this.K.onended = () => this.Bc()
    }
    c() {
        this.na();
        this.K.kb.disconnect();
        super.c()
    }
    O() {
        return this.K.O()
    }
    Bc() {
        this.G = !0;
        this.ga = -1;
        this.i.mc("ended", this.$, this.Jb)
    }
    T() {
        return this.O().ended
    }
    bc() {
        return this.G ? !0 : this.T()
    }
    Ba(g) {
        let a = this.O().currentTime;
        g && (a *= this.Z);
        this.V || (a = Math.min(a, this.fa()));
        return a
    }
    Play(g, a, b) {
        const c = this.O();
        1 !== c.playbackRate && (c.playbackRate = 1);
        c.loop !== g && (c.loop = g);
        this.Bb(a);
        c.muted &&
            (c.muted = !1);
        if (c.currentTime !== b) try {
            c.currentTime = b
        } catch (f) {
            console.warn(`[Construct 3] Exception seeking audio '${this.K.Ra()}' to position '${b}': `, f)
        }
        this.i.ua(c);
        this.F = this.G = !1;
        this.V = g;
        this.Z = 1
    }
    na() {
        const g = this.O();
        g.paused || g.pause();
        this.i.Ca(g);
        this.G = !0;
        this.F = !1;
        this.ga = -1
    }
    Sa() {
        if (!(this.F || this.G || this.T())) {
            var g = this.O();
            g.paused || g.pause();
            this.i.Ca(g);
            this.F = !0
        }
    }
    yb() {
        !this.F || this.G || this.T() || (this.i.ua(this.O()), this.F = !1)
    }
    Hb() {
        this.O().muted = this.Ga || this.xb()
    }
    oc(g) {
        g = !!g;
        this.V !== g && (this.V = g, this.O().loop = g)
    }
    Ea() {
        let g = this.Z;
        this.Sc && (g *= this.i.$b);
        try {
            this.O().playbackRate = g
        } catch (a) {
            console.warn(`[Construct 3] Unable to set playback rate '${g}':`, a)
        }
    }
    nc(g) {
        if (!this.G && !this.T()) try {
            this.O().currentTime = g
        } catch (a) {
            console.warn(`[Construct 3] Error seeking audio to '${g}': `, a)
        }
    }
    ic() {
        return this.Ba()
    }
    pc(g) {
        g ? this.IsPlaying() ? (this.O().pause(), this.la = !0) : this.la = !1 : this.la && (this.i.ua(this.O()), this.la = !1)
    }
};
"use strict";

function V(g) {
    g.j && g.j.disconnect();
    g.j = null;
    g.Wa = null
}
self.ve = class extends self.ed {
    constructor(g, a, b) {
        super(g, a, b);
        this.j = null;
        this.Ub = c => this.Bc(c);
        this.Oc = !0;
        this.Wa = null;
        this.N = this.Zb = 0;
        this.Wc = 1
    }
    c() {
        this.na();
        V(this);
        this.Ub = null;
        super.c()
    }
    Bc(g) {
        this.F || this.la || g.target !== this.Wa || (this.G = this.Oc = !0, this.ga = -1, V(this), this.i.mc("ended", this.$, this.Jb))
    }
    T() {
        return !this.G && this.j && this.j.loop || this.F ? !1 : this.Oc
    }
    bc() {
        return !this.j || this.G ? !0 : this.T()
    }
    Ba(g) {
        let a;
        a = this.F ? this.N : this.vb() - this.Zb;
        g && (a *= this.Z);
        this.V || (a = Math.min(a, this.fa()));
        return a
    }
    Play(g,
        a, b, c) {
        this.Wc = 1;
        this.Bb(a);
        V(this);
        this.j = this.W().createBufferSource();
        this.j.buffer = this.K.aa;
        this.j.connect(this.M);
        this.Wa = this.j;
        this.j.onended = this.Ub;
        this.j.loop = g;
        this.j.start(c, b);
        this.F = this.G = this.Oc = !1;
        this.V = g;
        this.Z = 1;
        this.Zb = this.vb() - b
    }
    na() {
        if (this.j) try {
            this.j.stop(0)
        } catch (g) {}
        this.G = !0;
        this.F = !1;
        this.ga = -1
    }
    Sa() {
        this.F || this.G || this.T() || (this.N = this.Ba(!0), this.V && (this.N %= this.fa()), this.F = !0, this.j.stop(0))
    }
    yb() {
        !this.F || this.G || this.T() || (V(this), this.j = this.W().createBufferSource(),
            this.j.buffer = this.K.aa, this.j.connect(this.M), this.Wa = this.j, this.j.onended = this.Ub, this.j.loop = this.V, this.Ib(), this.Ea(), this.Zb = this.vb() - this.N / (this.Z || .001), this.j.start(0, this.N), this.F = !1)
    }
    hc() {
        return super.hc() * this.Wc
    }
    Hb() {
        this.Wc = this.Ga || this.xb() ? 0 : 1;
        this.Ib()
    }
    oc(g) {
        g = !!g;
        this.V !== g && (this.V = g, this.j && (this.j.loop = g))
    }
    Ea() {
        let g = this.Z;
        this.Sc && (g *= this.i.$b);
        this.j && (this.j.playbackRate.value = g)
    }
    nc(g) {
        this.G || this.T() || (this.F ? this.N = g : (this.Sa(), this.N = g, this.yb()))
    }
    ic() {
        return this.N
    }
    pc(g) {
        g ?
            this.IsPlaying() ? (this.la = !0, this.N = this.Ba(!0), this.V && (this.N %= this.fa()), this.j.stop(0)) : this.la = !1 : this.la && (V(this), this.j = this.W().createBufferSource(), this.j.buffer = this.K.aa, this.j.connect(this.M), this.Wa = this.j, this.j.onended = this.Ub, this.j.loop = this.V, this.Ib(), this.Ea(), this.Zb = this.vb() - this.N / (this.Z || .001), this.j.start(0, this.N), this.la = !1)
    }
    zc(g) {
        super.zc(g);
        this.N = g.resumePosition
    }
};
"use strict"; {
    class g {
        constructor(a) {
            this.i = a;
            this.f = a.W();
            this.Pd = -1;
            this.R = this.$ = "";
            this.g = null
        }
        c() {
            this.f = null
        }
        cg(a) {
            this.Pd = a
        }
        kg(a) {
            this.$ = a
        }
        o() {
            return this.f.createGain()
        }
        P() {}
        S() {}
        m(a, b, c, f) {
            a.cancelScheduledValues(0);
            if (0 === f) a.value = b;
            else {
                var m = this.f.currentTime;
                f += m;
                switch (c) {
                    case 0:
                        a.setValueAtTime(b, f);
                        break;
                    case 1:
                        a.setValueAtTime(a.value, m);
                        a.linearRampToValueAtTime(b, f);
                        break;
                    case 2:
                        a.setValueAtTime(a.value, m), a.exponentialRampToValueAtTime(b, f)
                }
            }
        }
        Qa() {
            return {
                type: this.R,
                tag: this.$,
                params: this.g
            }
        }
    }
    self.me = class extends g {
        constructor(a, b, c, f, m, p, v) {
            super(a);
            this.R = "filter";
            this.g = [b, c, f, m, p, v];
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = v;
            this.a = this.o();
            this.a.gain.value = 1 - v;
            this.u = this.f.createBiquadFilter();
            this.u.type = b;
            this.u.frequency.value = c;
            this.u.detune.value = f;
            this.u.Q.value = m;
            this.u.gain.vlaue = p;
            this.l.connect(this.u);
            this.l.connect(this.a);
            this.u.connect(this.b)
        }
        c() {
            this.l.disconnect();
            this.u.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[5] = b;
                    this.m(this.b.gain, b, c, f);
                    this.m(this.a.gain, 1 - b, c, f);
                    break;
                case 1:
                    this.g[1] = b;
                    this.m(this.u.frequency, b, c, f);
                    break;
                case 2:
                    this.g[2] = b;
                    this.m(this.u.detune, b, c, f);
                    break;
                case 3:
                    this.g[3] = b;
                    this.m(this.u.Q, b, c, f);
                    break;
                case 4:
                    this.g[4] = b, this.m(this.u.gain, b, c, f)
            }
        }
    };
    self.ke = class extends g {
        constructor(a, b, c, f) {
            super(a);
            this.R = "delay";
            this.g = [b, c, f];
            this.l =
                this.o();
            this.b = this.o();
            this.b.gain.value = f;
            this.a = this.o();
            this.a.gain.value = 1 - f;
            this.hb = this.o();
            this.U = this.f.createDelay(b);
            this.U.delayTime.value = b;
            this.Za = this.o();
            this.Za.gain.value = c;
            this.l.connect(this.hb);
            this.l.connect(this.a);
            this.hb.connect(this.b);
            this.hb.connect(this.U);
            this.U.connect(this.Za);
            this.Za.connect(this.hb)
        }
        c() {
            this.l.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            this.hb.disconnect();
            this.U.disconnect();
            this.Za.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            const m = self.ea.hd;
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[2] = b;
                    this.m(this.b.gain, b, c, f);
                    this.m(this.a.gain, 1 - b, c, f);
                    break;
                case 4:
                    this.g[1] = m(b);
                    this.m(this.Za.gain, m(b), c, f);
                    break;
                case 5:
                    this.g[0] = b, this.m(this.U.delayTime, b, c, f)
            }
        }
    };
    self.je = class extends g {
        constructor(a, b, c, f) {
            super(a);
            this.R = "convolution";
            this.g = [c, f];
            this.Kd = this.Jd = "";
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = f;
            this.a = this.o();
            this.a.gain.value =
                1 - f;
            this.Ya = this.f.createConvolver();
            this.Ya.normalize = c;
            this.Ya.buffer = b;
            this.l.connect(this.Ya);
            this.l.connect(this.a);
            this.Ya.connect(this.b)
        }
        c() {
            this.l.disconnect();
            this.Ya.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0), this.g[1] = b, this.m(this.b.gain, b, c, f), this.m(this.a.gain, 1 - b, c, f)
            }
        }
        Zf(a, b) {
            this.Jd = a;
            this.Kd = b
        }
        Qa() {
            const a =
                super.Qa();
            a.bufferOriginalUrl = this.Jd;
            a.bufferUrl = "";
            a.bufferType = this.Kd;
            return a
        }
    };
    self.ne = class extends g {
        constructor(a, b, c, f, m, p) {
            super(a);
            this.R = "flanger";
            this.g = [b, c, f, m, p];
            this.l = this.o();
            this.a = this.o();
            this.a.gain.value = 1 - p / 2;
            this.b = this.o();
            this.b.gain.value = p / 2;
            this.ab = this.o();
            this.ab.gain.value = m;
            this.U = this.f.createDelay(b + c);
            this.U.delayTime.value = b;
            this.s = this.f.createOscillator();
            this.s.frequency.value = f;
            this.H = this.o();
            this.H.gain.value = c;
            this.l.connect(this.U);
            this.l.connect(this.a);
            this.U.connect(this.b);
            this.U.connect(this.ab);
            this.ab.connect(this.U);
            this.s.connect(this.H);
            this.H.connect(this.U.delayTime);
            this.s.start(0)
        }
        c() {
            this.s.stop(0);
            this.l.disconnect();
            this.U.disconnect();
            this.s.disconnect();
            this.H.disconnect();
            this.a.disconnect();
            this.b.disconnect();
            this.ab.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[4] = b;
                    this.m(this.b.gain,
                        b / 2, c, f);
                    this.m(this.a.gain, 1 - b / 2, c, f);
                    break;
                case 6:
                    this.g[1] = b / 1E3;
                    this.m(this.H.gain, b / 1E3, c, f);
                    break;
                case 7:
                    this.g[2] = b;
                    this.m(this.s.frequency, b, c, f);
                    break;
                case 8:
                    this.g[3] = b / 100, this.m(this.ab.gain, b / 100, c, f)
            }
        }
    };
    self.pe = class extends g {
        constructor(a, b, c, f, m, p, v) {
            super(a);
            this.R = "phaser";
            this.g = [b, c, f, m, p, v];
            this.l = this.o();
            this.a = this.o();
            this.a.gain.value = 1 - v / 2;
            this.b = this.o();
            this.b.gain.value = v / 2;
            this.u = this.f.createBiquadFilter();
            this.u.type = "allpass";
            this.u.frequency.value = b;
            this.u.detune.value =
                c;
            this.u.Q.value = f;
            this.s = this.f.createOscillator();
            this.s.frequency.value = p;
            this.H = this.o();
            this.H.gain.value = m;
            this.l.connect(this.u);
            this.l.connect(this.a);
            this.u.connect(this.b);
            this.s.connect(this.H);
            this.H.connect(this.u.frequency);
            this.s.start(0)
        }
        c() {
            this.s.stop(0);
            this.l.disconnect();
            this.u.disconnect();
            this.s.disconnect();
            this.H.disconnect();
            this.a.disconnect();
            this.b.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a,
            b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[5] = b;
                    this.m(this.b.gain, b / 2, c, f);
                    this.m(this.a.gain, 1 - b / 2, c, f);
                    break;
                case 1:
                    this.g[0] = b;
                    this.m(this.u.frequency, b, c, f);
                    break;
                case 2:
                    this.g[1] = b;
                    this.m(this.u.detune, b, c, f);
                    break;
                case 3:
                    this.g[2] = b;
                    this.m(this.u.Q, b, c, f);
                    break;
                case 6:
                    this.g[3] = b;
                    this.m(this.H.gain, b, c, f);
                    break;
                case 7:
                    this.g[4] = b, this.m(this.s.frequency, b, c, f)
            }
        }
    };
    self.oe = class extends g {
        constructor(a, b) {
            super(a);
            this.R = "gain";
            this.g = [b];
            this.h = this.o();
            this.h.gain.value =
                b
        }
        c() {
            this.h.disconnect();
            super.c()
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a)
        }
        P() {
            return this.h
        }
        X(a, b, c, f) {
            const m = self.ea.hd;
            switch (a) {
                case 4:
                    this.g[0] = m(b), this.m(this.h.gain, m(b), c, f)
            }
        }
    };
    self.re = class extends g {
        constructor(a, b, c) {
            super(a);
            this.R = "tremolo";
            this.g = [b, c];
            this.h = this.o();
            this.h.gain.value = 1 - c / 2;
            this.s = this.f.createOscillator();
            this.s.frequency.value = b;
            this.H = this.o();
            this.H.gain.value = c / 2;
            this.s.connect(this.H);
            this.H.connect(this.h.gain);
            this.s.start(0)
        }
        c() {
            this.s.stop(0);
            this.s.disconnect();
            this.H.disconnect();
            this.h.disconnect();
            super.c()
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a)
        }
        P() {
            return this.h
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[1] = b;
                    this.m(this.h.gain, 1 - b / 2, c, f);
                    this.m(this.H.gain, b / 2, c, f);
                    break;
                case 7:
                    this.g[0] = b, this.m(this.s.frequency, b, c, f)
            }
        }
    };
    self.qe = class extends g {
        constructor(a, b, c) {
            super(a);
            this.R = "ringmod";
            this.g = [b, c];
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = c;
            this.a = this.o();
            this.a.gain.value = 1 - c;
            this.nb = this.o();
            this.nb.gain.value =
                0;
            this.s = this.f.createOscillator();
            this.s.frequency.value = b;
            this.s.connect(this.nb.gain);
            this.s.start(0);
            this.l.connect(this.nb);
            this.l.connect(this.a);
            this.nb.connect(this.b)
        }
        c() {
            this.s.stop(0);
            this.s.disconnect();
            this.nb.disconnect();
            this.l.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c()
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0);
                    this.g[1] = b;
                    this.m(this.b.gain, b, c, f);
                    this.m(this.a.gain, 1 - b, c, f);
                    break;
                case 7:
                    this.g[0] = b, this.m(this.s.frequency, b, c, f)
            }
        }
    };
    self.le = class extends g {
        constructor(a, b, c, f, m, p) {
            super(a);
            this.R = "distortion";
            this.g = [b, c, f, m, p];
            this.l = this.o();
            this.Wb = this.o();
            this.Vb = this.o();
            this.$f(f, m);
            this.b = this.o();
            this.b.gain.value = p;
            this.a = this.o();
            this.a.gain.value = 1 - p;
            this.ac = this.f.createWaveShaper();
            this.Lc = new Float32Array(65536);
            this.gf(b, c);
            this.ac.curve = this.Lc;
            this.l.connect(this.Wb);
            this.l.connect(this.a);
            this.Wb.connect(this.ac);
            this.ac.connect(this.Vb);
            this.Vb.connect(this.b)
        }
        c() {
            this.l.disconnect();
            this.Wb.disconnect();
            this.ac.disconnect();
            this.Vb.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c()
        }
        $f(a, b) {
            .01 > a && (a = .01);
            this.Wb.gain.value = a;
            this.Vb.gain.value = Math.pow(1 / a, .6) * b
        }
        gf(a, b) {
            for (let c = 0; 32768 > c; ++c) {
                let f = c / 32768;
                f = this.mg(f, a, b);
                this.Lc[32768 + c] = f;
                this.Lc[32768 - c - 1] = -f
            }
        }
        mg(a, b, c) {
            c = 1.05 * c * b - b;
            const f = 0 > a ? -a : a;
            return (f < b ? f : b + c * self.ea.Dg(f - b, 1 / c)) * (0 > a ? -1 : 1)
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a)
        }
        P() {
            return this.l
        }
        X(a, b, c, f) {
            switch (a) {
                case 0:
                    b = Math.max(Math.min(b / 100, 1), 0), this.g[4] = b, this.m(this.b.gain, b, c, f), this.m(this.a.gain, 1 - b, c, f)
            }
        }
    };
    self.ie = class extends g {
        constructor(a, b, c, f, m, p) {
            super(a);
            this.R = "compressor";
            this.g = [b, c, f, m, p];
            this.h = this.f.createDynamicsCompressor();
            this.h.threshold.value = b;
            this.h.knee.value = c;
            this.h.ratio.value = f;
            this.h.attack.value = m;
            this.h.release.value = p
        }
        c() {
            this.h.disconnect();
            super.c()
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a)
        }
        P() {
            return this.h
        }
        X() {}
    };
    self.he = class extends g {
        constructor(a, b, c) {
            super(a);
            this.R = "analyser";
            this.g = [b, c];
            this.h = this.f.createAnalyser();
            this.h.fftSize = b;
            this.h.smoothingTimeConstant = c;
            this.Nd = new Float32Array(this.h.frequencyBinCount);
            this.Zd = new Uint8Array(b);
            this.Xd = this.Ja = 0;
            this.i.Re(this)
        }
        c() {
            this.i.Tf(this);
            this.h.disconnect();
            super.c()
        }
        Da() {
            this.h.getFloatFrequencyData(this.Nd);
            this.h.getByteTimeDomainData(this.Zd);
            const a = this.h.fftSize;
            let b = this.Ja = 0;
            for (var c = 0; c < a; ++c) {
                let f = (this.Zd[c] - 128) / 128;
                0 > f && (f = -f);
                this.Ja < f && (this.Ja = f);
                b += f * f
            }
            c = self.ea.He;
            this.Ja = c(this.Ja);
            this.Xd = c(Math.sqrt(b / a))
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a)
        }
        P() {
            return this.h
        }
        X() {}
        Ce() {
            return {
                tag: this.$,
                index: this.Pd,
                peak: this.Ja,
                rms: this.Xd,
                binCount: this.h.frequencyBinCount,
                freqBins: this.Nd
            }
        }
    }
};