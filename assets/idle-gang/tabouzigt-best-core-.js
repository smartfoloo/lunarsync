(() => {
    var e = {
            564: (e, t, i) => {
                var n, r, a;
                ! function(i, o) {
                    if (i) {
                        var s = {},
                            d = i.TraceKit,
                            A = [].slice,
                            c = "?",
                            l = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                        s.noConflict = function() {
                            return i.TraceKit = d, s
                        }, s.wrap = function(e) {
                            return function() {
                                try {
                                    return e.apply(this, arguments)
                                } catch (e) {
                                    throw s.report(e), e
                                }
                            }
                        }, s.report = function() {
                            var e, t, n, r, a = [],
                                o = null,
                                d = null;

                            function A(e, t, i) {
                                var n = null;
                                if (!t || s.collectWindowErrors) {
                                    for (var r in a)
                                        if (p(a, r)) try {
                                            a[r](e, t, i)
                                        } catch (e) {
                                            n = e
                                        }
                                    if (n) throw n
                                }
                            }

                            function c(t, i, n, r, a) {
                                if (d) s.computeStackTrace.augmentStackTraceWithInitialElement(d, i, n, t), m();
                                else if (a) A(s.computeStackTrace(a), !0, a);
                                else {
                                    var o, c = {
                                            url: i,
                                            line: n,
                                            column: r
                                        },
                                        p = t;
                                    if ("[object String]" === {}.toString.call(t)) {
                                        var u = t.match(l);
                                        u && (o = u[1], p = u[2])
                                    }
                                    c.func = s.computeStackTrace.guessFunctionName(c.url, c.line), c.context = s.computeStackTrace.gatherContext(c.url, c.line), A({
                                        name: o,
                                        message: p,
                                        mode: "onerror",
                                        stack: [c]
                                    }, !0, null)
                                }
                                return !!e && e.apply(this, arguments)
                            }

                            function u(e) {
                                A(s.computeStackTrace(e.reason), !0, e.reason)
                            }

                            function m() {
                                var e = d,
                                    t = o;
                                d = null, o = null, A(e, !1, t)
                            }

                            function h(e) {
                                if (d) {
                                    if (o === e) return;
                                    m()
                                }
                                var t = s.computeStackTrace(e);
                                throw d = t, o = e, setTimeout((function() {
                                    o === e && m()
                                }), t.incomplete ? 2e3 : 0), e
                            }
                            return h.subscribe = function(o) {
                                ! function() {
                                    if (!0 === t) return;
                                    e = i.onerror, i.onerror = c, t = !0
                                }(),
                                function() {
                                    if (!0 === r) return;
                                    n = i.onunhandledrejection, i.onunhandledrejection = u, r = !0
                                }(), a.push(o)
                            }, h.unsubscribe = function(o) {
                                for (var s = a.length - 1; s >= 0; --s) a[s] === o && a.splice(s, 1);
                                0 === a.length && (t && (i.onerror = e, t = !1), r && (i.onunhandledrejection = n, r = !1))
                            }, h
                        }(), s.computeStackTrace = function() {
                            var e = !1,
                                t = {};

                            function n(e) {
                                if ("string" != typeof e) return [];
                                if (!p(t, e)) {
                                    var n = "",
                                        r = "";
                                    try {
                                        r = i.document.domain
                                    } catch (e) {}
                                    var a = /(.*)\:\/\/([^:\/]+)([:\d]*)\/{0,1}([\s\S]*)/.exec(e);
                                    a && a[2] === r && (n = function(e) {
                                        if (!s.remoteFetching) return "";
                                        try {
                                            var t = function() {
                                                try {
                                                    return new i.XMLHttpRequest
                                                } catch (e) {
                                                    return new i.ActiveXObject("Microsoft.XMLHTTP")
                                                }
                                            }();
                                            return t.open("GET", e, !1), t.send(""), t.responseText
                                        } catch (e) {
                                            return ""
                                        }
                                    }(e)), t[e] = n ? n.split("\n") : []
                                }
                                return t[e]
                            }

                            function r(e, t) {
                                var i, r = /function ([^(]*)\(([^)]*)\)/,
                                    a = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
                                    o = "",
                                    s = n(e);
                                if (!s.length) return c;
                                for (var d = 0; d < 10; ++d)
                                    if (!u(o = s[t - d] + o)) {
                                        if (i = a.exec(o)) return i[1];
                                        if (i = r.exec(o)) return i[1]
                                    } return c
                            }

                            function a(e, t) {
                                var i = n(e);
                                if (!i.length) return null;
                                var r = [],
                                    a = Math.floor(s.linesOfContext / 2),
                                    o = a + s.linesOfContext % 2,
                                    d = Math.max(0, t - a - 1),
                                    A = Math.min(i.length, t + o - 1);
                                t -= 1;
                                for (var c = d; c < A; ++c) u(i[c]) || r.push(i[c]);
                                return r.length > 0 ? r : null
                            }

                            function o(e) {
                                return e.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
                            }

                            function d(e) {
                                return o(e).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
                            }

                            function A(e, t) {
                                for (var i, r, a = 0, o = t.length; a < o; ++a)
                                    if ((i = n(t[a])).length && (i = i.join("\n"), r = e.exec(i))) return {
                                        url: t[a],
                                        line: i.substring(0, r.index).split("\n").length,
                                        column: r.index - i.lastIndexOf("\n", r.index) - 1
                                    };
                                return null
                            }

                            function l(e, t, i) {
                                var r, a = n(t),
                                    s = new RegExp("\\b" + o(e) + "\\b");
                                return i -= 1, a && a.length > i && (r = s.exec(a[i])) ? r.index : null
                            }

                            function m(e) {
                                if (!u(i && i.document)) {
                                    for (var t, n, r, a, s = [i.location.href], c = i.document.getElementsByTagName("script"), l = "" + e, p = 0; p < c.length; ++p) {
                                        var m = c[p];
                                        m.src && s.push(m.src)
                                    }
                                    if (r = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(l)) {
                                        var h = r[1] ? "\\s+" + r[1] : "",
                                            g = r[2].split(",").join("\\s*,\\s*");
                                        t = o(r[3]).replace(/;$/, ";?"), n = new RegExp("function" + h + "\\s*\\(\\s*" + g + "\\s*\\)\\s*{\\s*" + t + "\\s*}")
                                    } else n = new RegExp(o(l).replace(/\s+/g, "\\s+"));
                                    if (a = A(n, s)) return a;
                                    if (r = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(l)) {
                                        var f = r[1];
                                        if (t = d(r[2]), a = A(n = new RegExp("on" + f + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]", "i"), s[0])) return a;
                                        if (a = A(n = new RegExp(t), s)) return a
                                    }
                                    return null
                                }
                            }

                            function h(e) {
                                if (!e.stack) return null;
                                for (var t, i, n, o = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, s = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i, d = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, A = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, p = /\((\S*)(?::(\d+))(?::(\d+))\)/, m = e.stack.split("\n"), h = [], g = /^(.*) is undefined$/.exec(e.message), f = 0, v = m.length; f < v; ++f) {
                                    if (i = o.exec(m[f])) {
                                        var b = i[2] && 0 === i[2].indexOf("native");
                                        i[2] && 0 === i[2].indexOf("eval") && (t = p.exec(i[2])) && (i[2] = t[1], i[3] = t[2], i[4] = t[3]), n = {
                                            url: b ? null : i[2],
                                            func: i[1] || c,
                                            args: b ? [i[2]] : [],
                                            line: i[3] ? +i[3] : null,
                                            column: i[4] ? +i[4] : null
                                        }
                                    } else if (i = d.exec(m[f])) n = {
                                        url: i[2],
                                        func: i[1] || c,
                                        args: [],
                                        line: +i[3],
                                        column: i[4] ? +i[4] : null
                                    };
                                    else {
                                        if (!(i = s.exec(m[f]))) continue;
                                        i[3] && i[3].indexOf(" > eval") > -1 && (t = A.exec(i[3])) ? (i[3] = t[1], i[4] = t[2], i[5] = null) : 0 !== f || i[5] || u(e.columnNumber) || (h[0].column = e.columnNumber + 1), n = {
                                            url: i[3],
                                            func: i[1] || c,
                                            args: i[2] ? i[2].split(",") : [],
                                            line: i[4] ? +i[4] : null,
                                            column: i[5] ? +i[5] : null
                                        }
                                    }!n.func && n.line && (n.func = r(n.url, n.line)), n.context = n.line ? a(n.url, n.line) : null, h.push(n)
                                }
                                return h.length ? (h[0] && h[0].line && !h[0].column && g && (h[0].column = l(g[1], h[0].url, h[0].line)), {
                                    mode: "stack",
                                    name: e.name,
                                    message: e.message,
                                    stack: h
                                }) : null
                            }

                            function g(e, t, i, n) {
                                var o = {
                                    url: t,
                                    line: i
                                };
                                if (o.url && o.line) {
                                    e.incomplete = !1, o.func || (o.func = r(o.url, o.line)), o.context || (o.context = a(o.url, o.line));
                                    var s = / '([^']+)' /.exec(n);
                                    if (s && (o.column = l(s[1], o.url, o.line)), e.stack.length > 0 && e.stack[0].url === o.url) {
                                        if (e.stack[0].line === o.line) return !1;
                                        if (!e.stack[0].line && e.stack[0].func === o.func) return e.stack[0].line = o.line, e.stack[0].context = o.context, !1
                                    }
                                    return e.stack.unshift(o), e.partial = !0, !0
                                }
                                return e.incomplete = !0, !1
                            }

                            function f(e, t) {
                                for (var i, n, a, o = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, d = [], A = {}, p = !1, u = f.caller; u && !p; u = u.caller)
                                    if (u !== v && u !== s.report) {
                                        if (n = {
                                                url: null,
                                                func: c,
                                                args: [],
                                                line: null,
                                                column: null
                                            }, u.name ? n.func = u.name : (i = o.exec(u.toString())) && (n.func = i[1]), void 0 === n.func) try {
                                            n.func = i.input.substring(0, i.input.indexOf("{"))
                                        } catch (e) {}
                                        if (a = m(u)) {
                                            n.url = a.url, n.line = a.line, n.func === c && (n.func = r(n.url, n.line));
                                            var h = / '([^']+)' /.exec(e.message || e.description);
                                            h && (n.column = l(h[1], a.url, a.line))
                                        }
                                        A["" + u] ? p = !0 : A["" + u] = !0, d.push(n)
                                    } t && d.splice(0, t);
                                var b = {
                                    mode: "callers",
                                    name: e.name,
                                    message: e.message,
                                    stack: d
                                };
                                return g(b, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description), b
                            }

                            function v(t, o) {
                                var s = null;
                                o = null == o ? 0 : +o;
                                try {
                                    if (s = function(e) {
                                            var t = e.stacktrace;
                                            if (t) {
                                                for (var i, n = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i, o = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i, s = t.split("\n"), d = [], A = 0; A < s.length; A += 2) {
                                                    var c = null;
                                                    if ((i = n.exec(s[A])) ? c = {
                                                            url: i[2],
                                                            line: +i[1],
                                                            column: null,
                                                            func: i[3],
                                                            args: []
                                                        } : (i = o.exec(s[A])) && (c = {
                                                            url: i[6],
                                                            line: +i[1],
                                                            column: +i[2],
                                                            func: i[3] || i[4],
                                                            args: i[5] ? i[5].split(",") : []
                                                        }), c) {
                                                        if (!c.func && c.line && (c.func = r(c.url, c.line)), c.line) try {
                                                            c.context = a(c.url, c.line)
                                                        } catch (e) {}
                                                        c.context || (c.context = [s[A + 1]]), d.push(c)
                                                    }
                                                }
                                                return d.length ? {
                                                    mode: "stacktrace",
                                                    name: e.name,
                                                    message: e.message,
                                                    stack: d
                                                } : null
                                            }
                                        }(t)) return s
                                } catch (t) {
                                    e
                                }
                                try {
                                    if (s = h(t)) return s
                                } catch (t) {
                                    e
                                }
                                try {
                                    if (s = function(e) {
                                            var t = e.message.split("\n");
                                            if (t.length < 4) return null;
                                            var o, s = /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
                                                c = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
                                                l = /^\s*Line (\d+) of function script\s*$/i,
                                                u = [],
                                                m = i && i.document && i.document.getElementsByTagName("script"),
                                                h = [];
                                            for (var g in m) p(m, g) && !m[g].src && h.push(m[g]);
                                            for (var f = 2; f < t.length; f += 2) {
                                                var v = null;
                                                if (o = s.exec(t[f])) v = {
                                                    url: o[2],
                                                    func: o[3],
                                                    args: [],
                                                    line: +o[1],
                                                    column: null
                                                };
                                                else if (o = c.exec(t[f])) {
                                                    v = {
                                                        url: o[3],
                                                        func: o[4],
                                                        args: [],
                                                        line: +o[1],
                                                        column: null
                                                    };
                                                    var b = +o[1],
                                                        y = h[o[2] - 1];
                                                    if (y) {
                                                        var k = n(v.url);
                                                        if (k) {
                                                            var w = (k = k.join("\n")).indexOf(y.innerText);
                                                            w >= 0 && (v.line = b + k.substring(0, w).split("\n").length)
                                                        }
                                                    }
                                                } else if (o = l.exec(t[f])) {
                                                    var I = i.location.href.replace(/#.*$/, ""),
                                                        S = A(new RegExp(d(t[f + 1])), [I]);
                                                    v = {
                                                        url: I,
                                                        func: "",
                                                        args: [],
                                                        line: S ? S.line : o[1],
                                                        column: null
                                                    }
                                                }
                                                if (v) {
                                                    v.func || (v.func = r(v.url, v.line));
                                                    var E = a(v.url, v.line),
                                                        T = E ? E[Math.floor(E.length / 2)] : null;
                                                    E && T.replace(/^\s*/, "") === t[f + 1].replace(/^\s*/, "") ? v.context = E : v.context = [t[f + 1]], u.push(v)
                                                }
                                            }
                                            return u.length ? {
                                                mode: "multiline",
                                                name: e.name,
                                                message: t[0],
                                                stack: u
                                            } : null
                                        }(t)) return s
                                } catch (t) {
                                    e
                                }
                                try {
                                    if (s = f(t, o + 1)) return s
                                } catch (t) {
                                    e
                                }
                                return {
                                    name: t.name,
                                    message: t.message,
                                    mode: "failed"
                                }
                            }
                            return v.augmentStackTraceWithInitialElement = g, v.computeStackTraceFromStackProp = h, v.guessFunctionName = r, v.gatherContext = a, v.ofCaller = function(e) {
                                e = 1 + (null == e ? 0 : +e);
                                try {
                                    throw new Error
                                } catch (t) {
                                    return v(t, e + 1)
                                }
                            }, v.getSource = n, v
                        }(), s.extendToAsynchronousCallbacks = function() {
                            var e = function(e) {
                                var t = i[e];
                                i[e] = function() {
                                    var e = A.call(arguments),
                                        i = e[0];
                                    return "function" == typeof i && (e[0] = s.wrap(i)), t.apply ? t.apply(this, e) : t(e[0], e[1])
                                }
                            };
                            e("setTimeout"), e("setInterval")
                        }, s.remoteFetching || (s.remoteFetching = !0), s.collectWindowErrors || (s.collectWindowErrors = !0), (!s.linesOfContext || s.linesOfContext < 1) && (s.linesOfContext = 11), r = [], void 0 === (a = "function" == typeof(n = s) ? n.apply(t, r) : n) || (e.exports = a)
                    }

                    function p(e, t) {
                        return Object.prototype.hasOwnProperty.call(e, t)
                    }

                    function u(e) {
                        return void 0 === e
                    }
                }("undefined" != typeof window ? window : i.g)
            }
        },
        t = {};

    function i(n) {
        if (t[n]) return t[n].exports;
        var r = t[n] = {
            exports: {}
        };
        return e[n](r, r.exports, i), r.exports
    }
    i.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return i.d(t, {
            a: t
        }), t
    }, i.d = (e, t) => {
        for (var n in t) i.o(t, n) && !i.o(e, n) && Object.defineProperty(e, n, {
            enumerable: !0,
            get: t[n]
        })
    }, i.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        "use strict";
        var e = i(564),
            t = i.n(e);
        const n = {
            ready: "pokiAppReady",
            adblocked: "pokiAppAdblocked",
            ads: {
                completed: "pokiAdsCompleted",
                error: "pokiAdsError",
                impression: "pokiAdsImpression",
                durationChange: "pokiAdsDurationChange",
                limit: "pokiAdsLimit",
                ready: "pokiAdsReady",
                requested: "pokiAdsRequested",
                prebidRequested: "pokiAdsPrebidRequested",
                skipped: "pokiAdsSkipped",
                started: "pokiAdsStarted",
                stopped: "pokiAdsStopped",
                busy: "pokiAdsBusy",
                position: {
                    preroll: "PP",
                    midroll: "PM",
                    rewarded: "PR",
                    display: "DP"
                },
                video: {
                    clicked: "pokiVideoAdsClicked",
                    firstQuartile: "pokiVideoAdsFirstQuartile",
                    midPoint: "pokiVideoAdsMidPoint",
                    thirdQuartile: "pokiVideoAdsThirdQuartile",
                    error: "pokiVideoAdsError",
                    loaderError: "pokiVideoAdsLoaderError",
                    paused: "pokiVideoAdsPauseTriggered",
                    resumed: "pokiVideoAdsResumedTriggered",
                    progress: "pokiVideoAdsProgress",
                    buffering: "pokiVideoAdsBuffering"
                }
            },
            info: {
                messages: {
                    timeLimit: "The ad-request was not processed, because of a time constraint",
                    prerollLimit: "The ad-request was cancelled, because we're not allowed to show a preroll"
                }
            },
            message: {
                event: "pokiMessageEvent",
                sdkDetails: "pokiMessageSdkDetails",
                toggleProgrammaticAds: "pokiMessageToggleProgrammaticAds"
            },
            tracking: {
                custom: "pokiTrackingCustom",
                togglePlayerAdvertisingConsent: "pokiTrackingTogglePlayerAdvertisingConsent",
                debugTrueInProduction: "pokiMessageDebugTrueProduction",
                screen: {
                    gameplayStart: "pokiTrackingScreenGameplayStart",
                    gameplayStop: "pokiTrackingScreenGameplayStop",
                    gameLoadingStarted: "pokiTrackingScreenGameLoadingStarted",
                    gameLoadingProgress: "pokiTrackingScreenGameLoadingProgress",
                    gameLoadingFinished: "pokiTrackingScreenGameLoadingFinished",
                    commercialBreak: "pokiTrackingScreenCommercialBreak",
                    rewardedBreak: "pokiTrackingScreenRewardedBreak",
                    happyTime: "pokiTrackingScreenHappyTime",
                    firstRound: "pokiTrackingScreenFirstRound",
                    roundStart: "pokiTrackingScreenRoundStart",
                    roundEnd: "pokiTrackingScreenRoundEnd",
                    gameInteractive: "pokiTrackingScreenGameInteractive",
                    displayAd: "pokiTrackingScreenDisplayAdRequest",
                    destroyAd: "pokiTrackingScreenDisplayAdDestroy"
                },
                sdk: {
                    status: {
                        initialized: "pokiTrackingSdkStatusInitialized",
                        failed: "pokiTrackingSdkStatusFailed"
                    }
                },
                ads: {
                    status: {
                        busy: "pokiTrackingAdsStatusBusy",
                        completed: "pokiTrackingAdsStatusCompleted",
                        error: "pokiTrackingAdsStatusError",
                        displayError: "pokiTrackingAdsStatusDisplayError",
                        impression: "pokiTrackingAdsStatusImpression",
                        limit: "pokiTrackingAdsStatusLimit",
                        ready: "pokiTrackingAdsStatusReady",
                        requested: "pokiTrackingAdsStatusRequested",
                        prebidRequested: "pokiTrackingAdsStatusPrebidRequested",
                        skipped: "pokiTrackingAdsStatusSkipped",
                        started: "pokiTrackingAdsStatusStarted",
                        buffering: "pokiTrackingAdsStatusBuffering"
                    },
                    video: {
                        clicked: "pokiTrackingAdsVideoClicked",
                        error: "pokiTrackingAdsVideoError",
                        loaderError: "pokiTrackingAdsVideoLoaderError",
                        progress: "pokiTrackingAdsVideoProgress",
                        paused: "pokiTrackingAdsVideoPaused",
                        resumed: "pokiTrackingAdsVideoResumed"
                    },
                    display: {
                        requested: "pokiTrackingScreenDisplayAdRequested",
                        impression: "pokiTrackingScreenDisplayAdImpression",
                        viewable: "pokiTrackingScreenDisplayAdViewable"
                    }
                }
            }
        };
        var r = function() {
            return (r = Object.assign || function(e) {
                for (var t, i = 1, n = arguments.length; i < n; i++)
                    for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }).apply(this, arguments)
        };
        const a = function() {
            function e() {}
            return e.clearEventListeners = function() {
                this.listeners = {}
            }, e.removeEventListener = function(e, t) {
                if (Object.prototype.hasOwnProperty.call(this.listeners, e)) {
                    var i = this.listeners[e].indexOf(t); - 1 !== i && this.listeners[e].splice(i, 1)
                }
            }, e.addEventListener = function(e, t, i) {
                var n = this;
                if (void 0 === i && (i = !1), i = !!i, Object.prototype.hasOwnProperty.call(this.listeners, e) || (this.listeners[e] = []), i) {
                    var r = function(i) {
                        n.removeEventListener.bind(n)(e, r), t(i)
                    };
                    this.listeners[e].push(r)
                } else this.listeners[e].push(t)
            }, e.dispatchEvent = function(e, t) {
                void 0 === t && (t = {}), !this.debug || window.process && window.process.env && "test" === window.process.env.NODE_ENV || console.info(e, t);
                for (var i = Object.keys(this.listeners), n = 0; n < i.length; n++) {
                    var a = i[n];
                    if (e === a)
                        for (var o = this.listeners[a], s = 0; s < o.length; s++) o[s](r(r({}, this.dataAnnotations), t))
                }
            }, e.setDebug = function(e) {
                this.debug = e
            }, e.setDataAnnotations = function(e) {
                this.dataAnnotations = r(r({}, this.dataAnnotations), e)
            }, e.getDataAnnotations = function() {
                return this.dataAnnotations
            }, e.clearAnnotations = function() {
                this.dataAnnotations = {}
            }, e.listeners = {}, e.debug = !1, e.dataAnnotations = {}, e
        }();
        const o = function(e, t) {
            var i = !1;
            return Object.keys(t).forEach((function(n) {
                t[n] === e && (i = !0)
            })), i
        };
        const s = function() {
            function e() {}
            return e.sendMessage = function(e, t) {
                void 0 === t && (t = {});
                var i = window.parent;
                if (!o(e, n.message)) {
                    var r = Object.keys(n.message).map((function(e) {
                        return "poki.message." + e
                    }));
                    throw new TypeError("Argument 'type' must be one of " + r.join(", "))
                }
                i.postMessage({
                    type: e,
                    content: t
                }, "*")
            }, e
        }();
        var d = function(e) {
            var t = new Array;
            return Object.keys(e).forEach((function(i) {
                "object" == typeof e[i] ? t = t.concat(d(e[i])) : t.push(e[i])
            })), t
        };
        var A = d(n.tracking);
        const c = function() {
            function e() {}
            return e.setDebug = function(e) {
                this.debug = e
            }, e.track = function(e, t) {
                if (void 0 === t && (t = {}), -1 === A.indexOf(e)) throw new TypeError("Invalid 'event', must be one of " + A.join(", "));
                if ("object" != typeof t) throw new TypeError("Invalid data, must be an object");
                if (this.debug) {
                    if (window.process && window.process.env && "test" === window.process.env.NODE_ENV) return;
                    Object.keys(t).length ? console.info("%cPOKI_TRACKER: %cTracked event '" + e + "' with data:", "font-weight: bold", "", t) : console.info("%cPOKI_TRACKER: %cTracked event '" + e + "'", "font-weight: bold", "")
                }
                s.sendMessage(n.message.event, {
                    event: e,
                    data: t
                })
            }, e.setupDefaultEvents = function() {
                var t, i = ((t = {})[n.ready] = n.tracking.sdk.status.initialized, t[n.adblocked] = n.tracking.sdk.status.failed, t[n.ads.busy] = n.tracking.ads.status.busy, t[n.ads.completed] = n.tracking.ads.status.completed, t[n.ads.error] = n.tracking.ads.status.error, t[n.ads.displayError] = n.tracking.ads.status.displayError, t[n.ads.impression] = n.tracking.ads.status.impression, t[n.ads.limit] = n.tracking.ads.status.limit, t[n.ads.ready] = n.tracking.ads.status.ready, t[n.ads.requested] = n.tracking.ads.status.requested, t[n.ads.prebidRequested] = n.tracking.ads.status.prebidRequested, t[n.ads.skipped] = n.tracking.ads.status.skipped, t[n.ads.started] = n.tracking.ads.status.started, t[n.ads.video.clicked] = n.tracking.ads.video.clicked, t[n.ads.video.error] = n.tracking.ads.video.error, t[n.ads.video.loaderError] = n.tracking.ads.video.loaderError, t[n.ads.video.buffering] = n.tracking.ads.status.buffering, t[n.ads.video.progress] = n.tracking.ads.video.progress, t[n.ads.video.paused] = n.tracking.ads.video.paused, t[n.ads.video.resumed] = n.tracking.ads.video.resumed, t[n.tracking.screen.gameplayStart] = n.tracking.screen.gameplayStart, t[n.tracking.screen.gameplayStop] = n.tracking.screen.gameplayStop, t[n.tracking.screen.loadingProgress] = n.tracking.screen.loadingProgress, t[n.tracking.screen.commercialBreak] = n.tracking.screen.commercialBreak, t[n.tracking.screen.rewardedBreak] = n.tracking.screen.rewardedBreak, t[n.tracking.screen.happyTime] = n.tracking.screen.happyTime, t);
                Object.keys(i).forEach((function(t) {
                    a.addEventListener(t, (function(n) {
                        e.track(i[t], n)
                    }))
                }))
            }, e.debug = !1, e
        }();
        const l = {
            adTagUrl: "",
            adTiming: {
                preroll: !1,
                timeBetweenAds: 12e4,
                timePerTry: 7e3,
                startAdsAfter: 12e4
            },
            waterfallRetries: 2
        };
        const p = function(e) {
            return e instanceof Array ? e : [e]
        };
        const u = function() {
            function e(e) {
                void 0 === e && (e = {}), this.setTimings(e), this.timingIdx = {
                    timePerTry: 0
                }, this.timers = {
                    timePerTry: void 0,
                    timeBetweenAds: void 0,
                    startAdsAfter: void 0
                }, a.addEventListener(n.ads.requested, this.startTimeBetweenAdsTimer.bind(this)), a.addEventListener(n.ads.completed, this.startTimeBetweenAdsTimer.bind(this)), a.addEventListener(n.ads.stopped, this.startTimeBetweenAdsTimer.bind(this))
            }
            return e.prototype.setTimings = function(e) {
                var t = l.adTiming,
                    i = e.preroll,
                    n = void 0 === i ? t.preroll : i,
                    r = e.timePerTry,
                    a = void 0 === r ? t.timePerTry : r,
                    o = e.timeBetweenAds,
                    s = void 0 === o ? t.timeBetweenAds : o,
                    d = e.startAdsAfter,
                    A = void 0 === d ? t.startAdsAfter : d;
                this.timings = {
                    preroll: !1 !== n,
                    timePerTry: p(a),
                    timeBetweenAds: s,
                    startAdsAfter: A
                }
            }, e.prototype.startTimeBetweenAdsTimer = function() {
                this.startTimer("timeBetweenAds")
            }, e.prototype.startStartAdsAfterTimer = function() {
                this.startTimer("startAdsAfter")
            }, e.prototype.requestPossible = function() {
                return !this.timers.timeBetweenAds && !this.timers.startAdsAfter
            }, e.prototype.startWaterfallTimer = function(e) {
                this.startTimer("timePerTry", e)
            }, e.prototype.stopWaterfallTimer = function() {
                this.stopTimer("timePerTry")
            }, e.prototype.nextWaterfallTimer = function() {
                this.nextTiming("timePerTry")
            }, e.prototype.resetWaterfallTimerIdx = function() {
                this.resetTimingIdx("timePerTry")
            }, e.prototype.stopTimer = function(e) {
                this.timers[e] && (clearTimeout(this.timers[e]), this.timers[e] = void 0)
            }, e.prototype.startTimer = function(e, t) {
                var i = this;
                void 0 === t && (t = function() {}), this.getTiming(e) <= 0 ? t() : (this.timers[e] && clearTimeout(this.timers[e]), this.timers[e] = window.setTimeout((function() {
                    i.stopTimer(e), t()
                }), this.getTiming(e)))
            }, e.prototype.getTiming = function(e) {
                var t = this.timings[e];
                return t instanceof Array ? t[this.timingIdx[e]] : t
            }, e.prototype.nextTiming = function(e) {
                if (void 0 === this.timingIdx[e]) throw new Error("AdTimings Error: " + e + " does not have multiple timers");
                this.timingIdx[e] = (this.timingIdx[e] + 1) % this.timings[e].length
            }, e.prototype.resetTimingIdx = function(e) {
                if (void 0 === this.timingIdx[e]) throw new Error("AdTimings Error: " + e + " does not have multiple timers");
                this.timingIdx[e] = 0
            }, e.prototype.prerollPossible = function() {
                return this.timings.preroll
            }, e
        }();
        var m = document.location.hostname;

        function h(e) {
            var t = new RegExp(e + "=([^;]+)(?:;|$)").exec(document.cookie);
            return t ? t[1] : ""
        }

        function g(e, t) {
            document.cookie = e + "=" + t + "; path=/; samesite=lax; max-age=15552000; domain=" + m
        }
        m.endsWith("") && (m = "");
        var f = function(e, t, i, n) {
                return new(i || (i = Promise))((function(r, a) {
                    function o(e) {
                        try {
                            d(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function s(e) {
                        try {
                            d(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function(e) {
                            e(t)
                        }))).then(o, s)
                    }
                    d((n = n.apply(e, t || [])).next())
                }))
            },
            v = function(e, t) {
                var i, n, r, a, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1]
                    },
                    trys: [],
                    ops: []
                };
                return a = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                }), a;

                function s(a) {
                    return function(s) {
                        return function(a) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (i = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
                                switch (n = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                                    case 0:
                                    case 1:
                                        r = a;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = a[1], a = [0];
                                        continue;
                                    case 7:
                                        a = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                            o.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && o.label < r[1]) {
                                            o.label = r[1], r = a;
                                            break
                                        }
                                        if (r && o.label < r[2]) {
                                            o.label = r[2], o.ops.push(a);
                                            break
                                        }
                                        r[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                a = t.call(e, o)
                            } catch (e) {
                                a = [6, e], n = 0
                            } finally {
                                i = r = 0
                            }
                            if (5 & a[0]) throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, s])
                    }
                }
            },
            b = function(e, t) {
                for (var i = 0, n = t.length, r = e.length; i < n; i++, r++) e[r] = t[i];
                return e
            },
            y = "poki_gcuid",
            k = h(y);
        const w = function() {
                function e() {}
                return e.collectAndLog = function() {
                    return f(this, void 0, void 0, (function() {
                        var e, t, i, n, r;
                        return v(this, (function(a) {
                            switch (a.label) {
                                case 0:
                                    return a.trys.push([0, 5, , 6]), [4, window.cookieStore.getAll()];
                                case 1:
                                    return e = a.sent(), window.indexedDB.databases ? [4, window.indexedDB.databases()] : [3, 3];
                                case 2:
                                    return i = a.sent(), [3, 4];
                                case 3:
                                    i = [], a.label = 4;
                                case 4:
                                    return t = i, n = b(b(b([], e.map((function(e) {
                                        return {
                                            name: e.name,
                                            expire_seconds: Math.round((e.expires - Date.now()) / 1e3),
                                            type: "cookie"
                                        }
                                    }))), Object.keys(window.localStorage).map((function(e) {
                                        return {
                                            name: e,
                                            expire_seconds: 15552e3,
                                            type: "localStorage"
                                        }
                                    }))), t.map((function(e) {
                                        return {
                                            name: e.name,
                                            expire_seconds: 0,
                                            type: "idb"
                                        }
                                    }))), r = {
                                        cookies: n,
                                        p4d_game_id: We.gameId,
                                        user_id: k
                                    }, window.fetch("", {
                                        method: "post",
                                        body: JSON.stringify(r)
                                    }).catch(), [3, 6];
                                case 5:
                                    return a.sent(), [3, 6];
                                case 6:
                                    return [2]
                            }
                        }))
                    }))
                }, e.trackSavegames = function() {
                    window.cookieStore && window.cookieStore.getAll && We.gameId && (Math.random() > .01 || (k || (k = Math.random().toString(36).substr(2, 9), g(y, k)), e.collectAndLog(), setInterval(e.collectAndLog, 12e4)))
                }, e
            }(),
            I = function() {
                return window.location.href
            },
            S = function() {
                return "undefined" != typeof navigator && /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(navigator.userAgent)
            },
            E = function() {
                return "undefined" != typeof navigator && /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(navigator.userAgent)
            },
            T = function(e, t) {
                if ("undefined" == typeof window) return "";
                e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var i = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(t || window.location.search);
                return null === i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
            },
            x = function() {
                return "undefined" != typeof navigator && /MSIE \\d|Trident.*rv:/i.test(navigator.userAgent)
            };
        var C = {
            1: "eNjDw1AVTr",
            2: "HkuQJaWnBa",
            3: "AfRKClvdYk",
            4: "Db7uYbsnlW",
            5: "UprdYKe74r",
            6: "eHFDjD5npr",
            7: "mm1jSFJjLl",
            8: "tJ44vpLpuM",
            9: "mF5ASaga4A",
            10: "rKV8rMwiwk",
            11: "SvK8BH5qS5",
            12: "qjcaVGp8Hs",
            13: "ysxIcmt3tW",
            14: "fz6aK9wMQe",
            15: "RU6ebIFLw9",
            16: "r9G4tVMYw7",
            17: "SgcDa5B8s1",
            18: "9wDNMnChv6",
            19: "DNZX8XdJXV",
            20: "39o4YUyZTX",
            21: "5sb2HFpz5a",
            22: "pgXzCJZipE",
            23: "Oani8EAGI9",
            24: "IzCeh7d7vW",
            25: "I5vRNtjoMr",
            26: "KpySvG7luq",
            27: "dK42J4rI14",
            28: "HuYorw3fRg",
            29: "mf84cGYc1h",
            30: "I2v6sQKXVD",
            31: "lBzSdVGY8F",
            32: "hKYgk9Wb8q",
            33: "xPBr8E54eE",
            34: "ZvIK2WKC7G",
            35: "7kiYi3zlIX",
            36: "VpygYMTDgm",
            37: "mis9Mt4np4",
            38: "451KJIoEIh",
            41: "Fqmjp9Hit3",
            42: "lS2XGg058L",
            43: "3uFf2PlICy",
            46: "voeIq5uRvl",
            47: "21OybbiIdc",
            48: "9i3RwPHzWW",
            49: "CMVoMvvEmu",
            50: "IoQrhRb3wU"
        };
        const B = function(e) {
            return C[e] || ""
        };
        var P = ["AU", "CA", "IE", "NZ", "US", "GB"],
            D = ["AT", "BE", "DK", "FI", "FR", "DE", "JA", "NO", "NL", "SA", "ES", "SE", "CH", "AE", "IT"],
            _ = ["BR", "CL", "CZ", "HU", "PL", "PT", "RU", "SK", "TH"],
            L = ["AR", "BG", "CO", "EC", "GR", "IN", "MX", "PE", "PH", "RO", "TR", "UY"];

        function R(e) {
            return P.includes(e) ? .13 : D.includes(e) ? .07 : _.includes(e) ? .04 : .02
        }

        function M(e) {
            return "US" === e ? 1.5 : P.includes(e) ? .5 : D.includes(e) ? .15 : _.includes(e) ? .08 : L.includes(e) ? .03 : .02
        }
        var G = function() {
                return (G = Object.assign || function(e) {
                    for (var t, i = 1, n = arguments.length; i < n; i++)
                        for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    return e
                }).apply(this, arguments)
            },
            O = function(e, t) {
                for (var i = 0, n = t.length, r = e.length; i < n; i++, r++) e[r] = t[i];
                return e
            },
            z = parseInt(T("site_id"), 10) || 0,
            j = "desktop";
        S() && (j = "mobile"), E() && (j = "tablet");
        var Q, N, F, X, U = "rewarded",
            Z = "video",
            H = {
                "728x90": "/21682198607/" + j + "_ingame_728x90/" + z + "_" + j + "_ingame_728x90",
                "300x250": "/21682198607/" + j + "_ingame_300x250/" + z + "_" + j + "_ingame_300x250",
                "970x250": "/21682198607/" + j + "_ingame_970x250/" + z + "_" + j + "_ingame_970x250",
                "160x600": "/21682198607/" + j + "_ingame_160x600/" + z + "_" + j + "_ingame_160x600",
                "320x50": "/21682198607/" + j + "_ingame_320x50/" + z + "_" + j + "_ingame_320x50",
                "728x90_external": "/21682198607/external_" + j + "_display_ingame/external_" + j + "_ingame_728x90",
                "300x250_external": "/21682198607/external_" + j + "_display_ingame/external_" + j + "_ingame_300x250",
                "970x250_external": "/21682198607/external_" + j + "_display_ingame/external_" + j + "_ingame_970x250",
                "160x600_external": "/21682198607/external_" + j + "_display_ingame/external_" + j + "_ingame_160x600",
                "320x50_external": "/21682198607/external_" + j + "_display_ingame/external_" + j + "_ingame_320x50"
            },
            W = (Q = parseInt(T("site_id"), 10) || 0, N = x() || S() || E() ? ["video/mp4"] : ["video/mp4", "video/webm", "video/ogg"], X = {
                mimes: N,
                minduration: 0,
                maxduration: 15,
                protocols: [2, 3, 5, 6, 7, 8],
                api: [2],
                placement: 1,
                linearity: 1,
                w: 640,
                h: 360
            }, {
                bids: [{
                    bidder: "appnexus",
                    params: G(G({
                        placementId: 13184250,
                        maxduration: 15
                    }, F = {
                        allowSmallerSizes: !0,
                        frameworks: [2],
                        h: 480,
                        w: 640,
                        video: {
                            playback_method: ["auto_play_sound_on", "auto_play_sound_off", "auto_play_sound_unknown"]
                        }
                    }), {
                        video: G(G({}, F.video), {
                            skippable: !0
                        })
                    })
                }, {
                    bidder: "appnexus",
                    params: G(G({
                        placementId: 13184309,
                        maxduration: 15
                    }, F), {
                        video: G(G({}, F.video), {
                            skippable: !1,
                            maxduration: 15
                        })
                    })
                }, {
                    bidder: "openx",
                    params: {
                        unit: "540105196",
                        delDomain: "",
                        openrtb: {
                            imp: [{
                                video: {
                                    mimes: [N.join(",")],
                                    protocols: [2, 3, 5, 6, 7, 8],
                                    maxduration: 15,
                                    skip: 1,
                                    skipafter: 5,
                                    w: 640,
                                    h: 480
                                }
                            }]
                        }
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "540719065",
                        delDomain: "",
                        openrtb: {
                            imp: [{
                                video: {
                                    mimes: [N.join(",")],
                                    protocols: [2, 3, 5, 6, 7, 8],
                                    maxduration: 15,
                                    skip: 0,
                                    w: 640,
                                    h: 480
                                }
                            }]
                        }
                    }
                }, {
                    bidder: "districtm",
                    params: G(G({
                        placementId: 12906789,
                        maxduration: 15
                    }, F), {
                        video: G(G({}, F.video), {
                            skippable: !1,
                            maxduration: 15
                        })
                    })
                }, {
                    bidder: "spotx",
                    params: {
                        channel_id: "265590",
                        ad_unit: "instream",
                        secure: !0,
                        mimes: N,
                        hide_skin: !0
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "436284",
                        size: [640, 480],
                        video: {
                            mimes: N,
                            protocols: [2, 3, 5, 6, 7, 8],
                            minduration: 0,
                            maxduration: 15,
                            api: [1, 2]
                        }
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: B(Q),
                        supplyType: "site"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3607869@640x360",
                        video: G(G({}, X), {
                            startdelay: 0,
                            playbackmethod: [1, 2]
                        })
                    }
                }],
                mediaTypes: {
                    video: {
                        context: "instream",
                        playerSize: [640, 480],
                        mimes: N,
                        protocols: [2, 3, 5, 6, 7, 8],
                        maxduration: 15,
                        skip: 1,
                        linearity: 1,
                        api: [2]
                    }
                }
            }),
            V = [{
                code: Z,
                mediaTypes: W.mediaTypes,
                bids: O(O([], W.bids), [{
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "266914",
                        zoneId: "1322034",
                        video: {
                            size_id: 204
                        }
                    }
                }])
            }, {
                code: U,
                mediaTypes: W.mediaTypes,
                bids: O(O([], W.bids), [{
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "266916",
                        zoneId: "1322048",
                        video: {
                            size_id: 202
                        }
                    }
                }])
            }, {
                code: H["728x90"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [728, 90]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "12940427"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "539859872",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "268177",
                        size: [728, 90]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "1374895@728x90"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "80117"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "204596",
                        zoneId: "1008080"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "1V6a2fgLvX",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["300x250"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [300, 250]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "12935252"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "539859873",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "268178",
                        size: [300, 250]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "1374896@300x250"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "80118"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "204596",
                        zoneId: "1008080"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "pKqNt5LyvF",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["970x250"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [970, 250]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20595278"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543540497",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "597527",
                        size: [970, 250]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3344351@970x250"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "123738"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "yYyae7vnIh",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["160x600"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [160, 600]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "12940425"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "539859871",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "268175",
                        size: [160, 600]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "1374893@160x600"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "80119"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "204596",
                        zoneId: "1008080"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "rAEnPimPzC",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["320x50"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [320, 50]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20595224"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543540495",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "597529",
                        size: [320, 50]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3344350@320x50"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "204596",
                        zoneId: "1008080"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "123737"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "1DP5EtcOip",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["728x90_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [728, 90]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973406"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885656",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "268177",
                        placementId: "625562",
                        size: [728, 90]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457872"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132973"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "96373699",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-2"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "1V6a2fgLvX",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["300x250_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [300, 250]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973408"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885657",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625564",
                        size: [300, 250]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457874"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132975"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "94f55c24",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-15"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "pKqNt5LyvF",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["970x250_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [970, 250]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973415"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885650",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625560",
                        size: [970, 250]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457879"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132979"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "62235ccb",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-57"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "yYyae7vnIh",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["160x600_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [160, 600]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973407"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885653",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625563",
                        size: [160, 600]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457877"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132974"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "9960183e",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-9"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "rAEnPimPzC",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["320x50_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [320, 50]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973413"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885649",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625559",
                        size: [320, 50]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457875"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "402db827",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-43"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132978"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "1DP5EtcOip",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["468x60_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [480, 60]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973409"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885658",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625565",
                        size: [480, 60]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457880"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "e8872afe",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-1"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132976"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "KBD6r3P98m",
                        supplyType: "site"
                    }
                }]
            }, {
                code: H["320x100_external"],
                mediaTypes: {
                    banner: {
                        sizes: [
                            [320, 100]
                        ]
                    }
                },
                bids: [{
                    bidder: "districtm",
                    params: {
                        placementId: "12906789"
                    }
                }, {
                    bidder: "appnexus",
                    params: {
                        placementId: "20973412"
                    }
                }, {
                    bidder: "openx",
                    params: {
                        unit: "543885655",
                        delDomain: ""
                    }
                }, {
                    bidder: "ix",
                    params: {
                        siteId: "625561",
                        size: [320, 100]
                    }
                }, {
                    bidder: "pubmatic",
                    params: {
                        publisherId: "156838",
                        adSlot: "3457876"
                    }
                }, {
                    bidder: "conversant",
                    params: {
                        site_id: "117477",
                        tag_id: "c2a891f3",
                        secure: 1,
                        position: 1
                    }
                }, {
                    bidder: "rubicon",
                    params: {
                        accountId: "18608",
                        siteId: "362566",
                        zoneId: "1962680-117"
                    }
                }, {
                    bidder: "emx_digital",
                    params: {
                        tagid: "132977"
                    }
                }, {
                    bidder: "onetag",
                    params: {
                        pubId: "6da09f566a9dc06"
                    }
                }, {
                    bidder: "richaudience",
                    params: {
                        pid: "3VWazbgXML",
                        supplyType: "site"
                    }
                }]
            }],
            K = {
                debug: !1,
                enableSendAllBids: !0,
                usePrebidCache: !0,
                bidderTimeout: 1500,
                priceGranularity: {
                    buckets: [{
                        precision: 2,
                        min: .01,
                        max: 3,
                        increment: .01
                    }, {
                        precision: 2,
                        min: 3,
                        max: 8,
                        increment: .05
                    }, {
                        precision: 2,
                        min: 8,
                        max: 20,
                        increment: .5
                    }, {
                        precision: 2,
                        min: 20,
                        max: 45,
                        increment: 1
                    }]
                },
                currency: {
                    adServerCurrency: "EUR",
                    defaultRates: {
                        EUR: {
                            EUR: 1,
                            GBP: .86408,
                            USD: 1.2212
                        },
                        GBP: {
                            EUR: 1.157300249976854,
                            GBP: 1,
                            USD: 1.4132950652717342
                        },
                        USD: {
                            EUR: .8188666885031116,
                            GBP: .7075663282017687,
                            USD: 1
                        }
                    }
                },
                cache: {
                    url: ""
                },
                userSync: {
                    filterSettings: {
                        all: {
                            bidders: "*",
                            filter: "include"
                        }
                    },
                    syncsPerBidder: 1e3,
                    syncDelay: 100,
                    userIds: [{
                        name: "pubCommonId",
                        storage: {
                            type: "cookie",
                            name: "poki_pubcid",
                            expires: 180
                        }
                    }]
                }
            },
            J = function(e, t) {
                window.pbjs = window.pbjs || {}, window.pbjs.que = window.pbjs.que || [], window.pbjs.que.push((function() {
                    window.pbjs.aliasBidder("appnexus", "districtm"), window.pbjs.addAdUnits(e.adUnits || V), window.pbjs.setConfig(G(G({
                        floors: {
                            data: {
                                currency: "EUR",
                                schema: {
                                    fields: ["mediaType"]
                                },
                                values: {
                                    banner: R(t),
                                    video: M(t)
                                }
                            }
                        }
                    }, K), e.config)), window.pbjs.bidderSettings = {
                        districtm: {
                            bidCpmAdjustment: function(e) {
                                return .85 * e
                            }
                        },
                        richaudience: {
                            bidCpmAdjustment: function(e, t) {
                                return "video" === t.mediaType ? .9 * e : e
                            }
                        }
                    }
                }))
            },
            q = !1,
            Y = function() {
                ! function() {
                    if (!window.__tcfapi) {
                        var e = window.top,
                            t = {};
                        window.__tcfapi = function(i, n, r, a) {
                            var o = "" + Math.random(),
                                s = {
                                    __tcfapiCall: {
                                        command: i,
                                        parameter: a,
                                        version: n,
                                        callId: o
                                    }
                                };
                            t[o] = r, e.postMessage(s, "*")
                        }, window.addEventListener("message", (function(e) {
                            var i = {};
                            try {
                                i = "string" == typeof e.data ? JSON.parse(e.data) : e.data
                            } catch (e) {}
                            var n = i.__tcfapiReturn;
                            n && "function" == typeof t[n.callId] && (t[n.callId](n.returnValue, n.success), t[n.callId] = null)
                        }), !1)
                    }
                }(), window.pbjs.que.push((function() {
                    window.pbjs.setConfig({
                        consentManagement: {
                            gdpr: {
                                cmpApi: "iab",
                                timeout: 8e3,
                                defaultGdprScope: !0
                            }
                        }
                    })
                }))
            },
            $ = function() {
                ! function() {
                    if (!window.__uspapi) {
                        var e = window.top,
                            t = {};
                        window.__uspapi = function(i, n, r) {
                            var a = "" + Math.random(),
                                o = {
                                    __uspapiCall: {
                                        command: i,
                                        version: n,
                                        callId: a
                                    }
                                };
                            t[a] = r, e.postMessage(o, "*")
                        }, window.addEventListener("message", (function(e) {
                            var i = e && e.data && e.data.__uspapiReturn;
                            i && i.callId && "function" == typeof t[i.callId] && (t[i.callId](i.returnValue, i.success), t[i.callId] = null)
                        }), !1)
                    }
                }(), window.pbjs.que.push((function() {
                    window.pbjs.setConfig({
                        consentManagement: {
                            usp: {
                                cmpApi: "iab",
                                timeout: 8e3
                            }
                        }
                    })
                }))
            };

        function ee(e) {
            try {
                var t = window.pbjs.getBidResponsesForAdUnitCode(e).bids;
                window.pokiAuctionsSeen || (window.pokiAuctionsSeen = {}), window.pokiAuctionsSeen[e] || (window.pokiAuctionsSeen[e] = {});
                var i = 0;
                if (t) {
                    for (var n = 0; n < t.length; n++)
                        if (!window.pokiAuctionsSeen[e][t[n].auctionId]) {
                            var r = t[n].cpm;
                            r && r > i && (i = r)
                        } for (n = 0; n < t.length; n++) window.pokiAuctionsSeen[e][t[n].auctionId] = !0
                }
                return i
            } catch (e) {
                console.error(e)
            }
            return 0
        }
        const te = function() {
            function e(e, t) {
                void 0 === t && (t = {}), this.retries = 0, this.running = !1, this.ima = e, this.siteID = t.siteID || 3, 0 === t.siteID && (t.siteID = 3), this.totalRetries = t.totalRetries || l.waterfallRetries || 1, this.timing = t.timing || new u(l.adTiming), this.overwriteAdTagUrls = t.adTagUrl ? p(t.adTagUrl) : [], a.addEventListener(n.ads.video.error, this.moveThroughWaterfall.bind(this)), a.addEventListener(n.ads.video.loaderError, this.moveThroughWaterfall.bind(this)), a.addEventListener(n.ads.ready, this.timing.stopWaterfallTimer.bind(this.timing)), a.addEventListener(n.ads.started, this.stopWaterfall.bind(this))
            }
            return e.prototype.moveThroughWaterfall = function() {
                if (!1 !== this.running) {
                    if (this.timing.stopWaterfallTimer(), this.retries < this.totalRetries) return this.timing.nextWaterfallTimer(), void this.requestAd();
                    this.running = !1, this.timing.resetWaterfallTimerIdx(), a.dispatchEvent(n.ads.error, {
                        message: "No ads"
                    })
                }
            }, e.prototype.cutOffWaterfall = function() {
                this.ima.tearDown(), this.moveThroughWaterfall()
            }, e.prototype.buildAdTagUrls = function(e) {
                var t = "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}";
                if (this.debug) {
                    var i = "";
                    return e === n.ads.position.rewarded ? [i + "debug-video-rewarded" + t] : e === n.ads.position.preroll ? [i + "debug-video-preroll" + t] : [i + "debug-video-midroll" + t]
                }
                if (this.overwriteAdTagUrls.length > 0 && Ve.GetIsPokiPlatform()) return this.overwriteAdTagUrls;
                var r = "desktop",
                    a = "midroll";
                S() ? r = "mobile" : E() && (r = "tablet"), e === n.ads.position.rewarded && (a = "rewarded");
                var o = "";
                return Ve.GetIsPokiIFrame() ? ["" + o + r + "_ingame_" + a + "_1/" + this.siteID + "_" + r + "_ingame_" + a + "_1" + t, "" + o + r + "_ingame_" + a + "_2/" + this.siteID + "_" + r + "_ingame_" + a + "_2" + t] : [o + "external_" + r + "_video_1/external_" + r + "_ingame_" + a + "_1" + t, o + "external_" + r + "_video_2/external_" + r + "_ingame_" + a + "_2" + t]
            }, e.prototype.start = function(e, t) {
                void 0 === e && (e = {}), this.running = !0, this.retries = 0, this.criteria = e, this.timing.resetWaterfallTimerIdx(), this.rewarded = t === n.ads.position.rewarded, this.adTagUrls = this.buildAdTagUrls(t), this.requestAd()
            }, e.prototype.requestAd = function() {
                this.timing.startWaterfallTimer(this.cutOffWaterfall.bind(this)), this.retries++, Ve.GetIsPokiPlatform() || (this.criteria.waterfall = this.retries);
                var e = (this.retries - 1) % this.adTagUrls.length,
                    t = this.adTagUrls[e];
                Ve.consentString && Ve.consentString.length > 0 && (this.criteria.consent_string = Ve.consentString);
                var i, r, o = function(e) {
                    var t = I().split("?"),
                        i = encodeURIComponent(t[0]);
                    return (e = e.split("{descriptionUrl}").join(i)).split("{timestamp}").join((new Date).getTime().toString())
                }(t) + (i = this.criteria, r = "", Object.keys(i).forEach((function(e) {
                    if (Object.prototype.hasOwnProperty.call(i, e)) {
                        var t = i[e];
                        Array.isArray(t) && (t = t.join()), r += e + "=" + t + "&"
                    }
                })), "&cust_params=" + (r = encodeURIComponent(r)) + "&");
                Ve.childDirected && (o += "&tfcd=1"), Ve.nonPersonalized && (o += "&npa=1"), a.setDataAnnotations({
                    adTagUrl: o,
                    waterfall: this.retries
                }), a.dispatchEvent(n.ads.requested), 1 !== this.retries || S() || E() ? (console.debug("adRequest started in plain mode"), this.ima.requestAd(o)) : (console.debug("adRequest started with Prebid Video enabled"), function(e, t, i, r) {
                    if (window.pbjs && window.pbjs.que && window.pbjs.getConfig) {
                        var o, s = I().split("?"),
                            d = encodeURIComponent(s[0]),
                            A = r ? U : Z,
                            c = 1,
                            l = function() {
                                if (!(--c > 0)) try {
                                    a.dispatchEvent(n.ads.prebidRequested);
                                    var r = window.pbjs.adUnits.filter((function(e) {
                                        return e.code === A
                                    }))[0];
                                    if ("undefined" === r) return console.error("Video-ad-unit not found, did you give it the adunit.code='video' value?"), void e.requestAd(t);
                                    var s = window.pbjs.adServers.dfp.buildVideoUrl({
                                        adUnit: r,
                                        params: {
                                            iu: T("iu", t),
                                            sz: "640x360|640x480",
                                            output: "vast",
                                            cust_params: i,
                                            description_url: d
                                        }
                                    });
                                    window.pbjs.markWinningBidAsUsed({
                                        adUnitCode: A
                                    }), o && (s = s.replace("cust_params=", "cust_params=" + o + "%26")), a.setDataAnnotations({
                                        adTagUrl: s
                                    }), e.requestAd(s)
                                } catch (i) {
                                    e.requestAd(t)
                                }
                            };
                        q && (c++, window.apstag.fetchBids({
                            slots: [{
                                slotID: r ? "Rewarded" : "Midroll",
                                mediaType: "video"
                            }],
                            timeout: K.bidderTimeout
                        }, (function(e) {
                            e.length > 0 && (o = e[0].encodedQsParams), l()
                        }))), window.pbjs.que.push((function() {
                            window.pbjs.requestBids({
                                adUnitCodes: [A],
                                bidsBackHandler: function() {
                                    l()
                                }
                            })
                        }))
                    } else e.requestAd(t)
                }(this.ima, o, this.criteria, this.rewarded))
            }, e.prototype.isRunning = function() {
                return this.running
            }, e.prototype.stopWaterfall = function() {
                this.running = !1, this.timing.stopWaterfallTimer(), this.timing.resetWaterfallTimerIdx()
            }, e.prototype.setDebug = function(e) {
                this.debug = e
            }, e
        }();
        var ie = "pokiSdkContainer",
            ne = "pokiSdkFixed",
            re = "pokiSdkOverlay",
            ae = "pokiSdkHidden",
            oe = "pokiSdkInsideContainer",
            se = "pokiSdkPauseButton",
            de = "pokiSdkPauseButtonBG",
            Ae = "pokiSdkStartAdButton",
            ce = "pokiSdkProgressBar",
            le = "pokiSdkProgressContainer",
            pe = "pokiSdkSpinnerContainer",
            ue = "pokiSdkVideoContainer",
            me = "pokiSdkVisible",
            he = "pokiSDKAdContainer";
        var ge = function(e, t) {
            for (var i = 0, n = t.length, r = e.length; i < n; i++, r++) e[r] = t[i];
            return e
        };
        const fe = function() {
            function e(e) {
                var t = this;
                if (this.hideElement = function(e) {
                        e.classList.add(ae), e.classList.remove(me)
                    }, this.showElement = function(e) {
                        e.classList.add(me), e.classList.remove(ae)
                    }, this.wrapper = e.wrapper, this.progressFaker = new ve((function(e) {
                        return t.updateProgressBar(e)
                    })), this.progressFaker.queueFakeProgress(10, 1e3, n.ads.prebidRequested), this.progressFaker.queueFakeProgress(20, 2e3, n.ads.started), this.wrapper instanceof HTMLElement || (console.error("POKI-SDK: wrapper is not a HTMLElement, falling back to document.body"), this.wrapper = document.body), this.createElements(), "undefined" != typeof window && document) {
                    var i = document.createElement("style");
                    i.innerHTML = "\n.pokiSdkContainer {\n\toverflow: hidden;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1000;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n\n.pokiSdkContainer.pokiSdkFixed {\n\tposition: fixed;\n}\n\n.pokiSdkContainer.pokiSdkVisible {\n\tdisplay: block;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer.pokiSdkHidden {\n\tdisplay: none;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer {\n\tpointer-events: none;\n}\n\n.pokiSdkSpinnerContainer {\n\tz-index: 10;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: url('') 50% 50% no-repeat;\n\tuser-select: none;\n}\n\n.pokiSdkInsideContainer {\n\tbackground: #000;\n\tposition: relative;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\n\topacity: 0;\n\t-webkit-transition: opacity 0.5s ease-in-out;\n\t-moz-transition: opacity 0.5s ease-in-out;\n\t-ms-transition: opacity 0.5s ease-in-out;\n\t-o-transition: opacity 0.5s ease-in-out;\n\ttransition: opacity 0.5s ease-in-out;\n}\n\n.pokiSdkContainer.pokiSdkVisible .pokiSdkInsideContainer {\n\topacity: 1;\n}\n\n.pokiSDKAdContainer, .pokiSdkVideoContainer {\n\tposition: absolute;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.pokiSdkStartAdButton {\n\tposition: absolute;\n\tz-index: 9999;\n\ttop: 0;\n\n\tpadding-top: 10%;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n\tcolor: #FFF;\n\n\tfont: 700 15pt 'Arial', sans-serif;\n\tfont-weight: bold;\n\tletter-spacing: 1px;\n\ttransition: 0.1s ease-in-out;\n\tline-height: 1em;\n}\n\n.pokiSdkPauseButton {\n\tcursor:pointer;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    z-index: 1;\n}\n\n.pokiSdkPauseButton:before {\n\tcontent: '';\n\tposition: absolute;\n\twidth: 100px;\n\theight: 100px;\n\tdisplay: block;\n\tborder: 2px solid #fff;\n\tborder-radius: 50%;\n\tuser-select: none;\n\tbackground-color: rgba(0, 0, 0, 0.6);\n\ttransition: background-color 0.5s ease;\n\tanimation: 1s linear infinite pulse;\n}\n\n.pokiSdkPauseButton:after {\n\tcontent: '';\n\tposition: absolute;\n\tdisplay: block;\n\tbox-sizing: border-box;\n\tborder-color: transparent transparent transparent #fff;\n\tborder-style: solid;\n\tborder-width: 26px 0 26px 40px;\n\tpointer-events: none;\n\tanimation: 1s linear infinite pulse;\n\tleft: 6px;\n}\n.pokiSdkPauseButtonBG {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    content: '';\n    background: rgba(0, 43, 80, 0.5);\n    width: 100%;\n    height: 100%;\n}\n\n.pokiSdkPauseButtonBG:hover{\n\tbackground: rgba(0, 43, 80, 0.7);\n}\n\n@keyframes pulse {\n\t0% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n\t70% {\n\t\ttransform: translate(-50%, -50%) scale(1.1);\n\t}\n\t100% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n}\n\n.pokiSdkProgressContainer {\n\tbackground: #B8C7DD;\n\twidth: 100%;\n\theight: 5px;\n\tposition: absolute;\n\tbottom: 0;\n\tz-index: 9999;\n}\n\n.pokiSdkProgressBar {\n\tposition:relative;\n\tbottom:0px;\n\tbackground: #FFDC00;\n\theight: 100%;\n\twidth: 0%;\n\ttransition: width 0.5s;\n\ttransition-timing-function: linear;\n}\n\n.pokiSdkProgressBar.pokiSdkVisible, .pokiSdkPauseButton.pokiSdkVisible, .pokiSdkStartAdButton.pokiSdkVisible {\n\tdisplay: block;\n\tpointer-events: auto;\n}\n\n.pokiSdkProgressBar.pokiSdkHidden, .pokiSdkPauseButton.pokiSdkHidden, .pokiSdkStartAdButton.pokiSdkHidden {\n\tdisplay: none;\n\tpointer-events: none;\n}\n", document.head.appendChild(i)
                }
            }
            return e.prototype.updateProgressBar = function(e) {
                this.progressBar.style.width = e + "%"
            }, e.prototype.setupEvents = function(e) {
                this.internalSDK = e
            }, e.prototype.hide = function() {
                this.hideElement(this.containerDiv), this.hideElement(this.progressContainer), this.hidePauseButton(), this.hideElement(this.startAdButton), this.containerDiv.classList.remove(re), this.progressBar.style.width = "0%", this.progressFaker.reset()
            }, e.prototype.hideSpinner = function() {
                this.hideElement(this.spinnerContainer)
            }, e.prototype.show = function() {
                this.containerDiv.classList.add(re), this.showElement(this.containerDiv), this.showElement(this.progressContainer), this.progressFaker.start()
            }, e.prototype.getVideoBounds = function() {
                return this.adContainer.getBoundingClientRect()
            }, e.prototype.getAdContainer = function() {
                return this.adContainer
            }, e.prototype.getVideoContainer = function() {
                return this.videoContainer
            }, e.prototype.showPauseButton = function() {
                this.showElement(this.pauseButton), this.internalSDK && this.pauseButton.addEventListener("click", this.internalSDK.resumeAd.bind(this.internalSDK))
            }, e.prototype.hidePauseButton = function() {
                this.hideElement(this.pauseButton), this.internalSDK && this.pauseButton.removeEventListener("click", this.internalSDK.resumeAd.bind(this.internalSDK))
            }, e.prototype.showStartAdButton = function() {
                this.showElement(this.startAdButton), this.internalSDK && this.startAdButton.addEventListener("click", this.internalSDK.startAdClicked.bind(this.internalSDK))
            }, e.prototype.hideStartAdButton = function() {
                this.hideElement(this.startAdButton), this.internalSDK && this.startAdButton.removeEventListener("click", this.internalSDK.startAdClicked.bind(this.internalSDK))
            }, e.prototype.createElements = function() {
                if (this.containerDiv = document.createElement("div"), this.insideContainer = document.createElement("div"), this.pauseButton = document.createElement("div"), this.pauseButtonBG = document.createElement("div"), this.startAdButton = document.createElement("div"), this.progressBar = document.createElement("div"), this.progressContainer = document.createElement("div"), this.spinnerContainer = document.createElement("div"), this.adContainer = document.createElement("div"), this.videoContainer = document.createElement("video"), this.adContainer.id = "pokiSDKAdContainer", this.videoContainer.id = "pokiSDKVideoContainer", this.containerDiv.className = ie, this.insideContainer.className = oe, this.pauseButton.className = se, this.pauseButtonBG.className = de, this.pauseButton.appendChild(this.pauseButtonBG), this.startAdButton.className = Ae, this.startAdButton.innerHTML = "Tap anywhere to play ad", this.progressBar.className = ce, this.progressContainer.className = le, this.spinnerContainer.className = pe, this.adContainer.className = he, this.videoContainer.className = ue, this.hide(), this.videoContainer.setAttribute("playsinline", "playsinline"), this.videoContainer.setAttribute("muted", "muted"), this.containerDiv.appendChild(this.insideContainer), this.containerDiv.appendChild(this.spinnerContainer), this.insideContainer.appendChild(this.progressContainer), this.insideContainer.appendChild(this.videoContainer), this.insideContainer.appendChild(this.adContainer), this.containerDiv.appendChild(this.pauseButton), this.containerDiv.appendChild(this.startAdButton), this.progressContainer.appendChild(this.progressBar), this.wrapper.appendChild(this.containerDiv), this.wrapper === document.body) this.containerDiv.classList.add(ne);
                else {
                    var e = window.getComputedStyle(this.wrapper).position;
                    e && -1 !== ["absolute", "fixed", "relative"].indexOf(e) || (this.wrapper.style.position = "relative")
                }
            }, e
        }();
        var ve = function() {
                function e(e) {
                    var t = this;
                    this.storedQueue = [], this.progressCallback = e, this.reset(), a.addEventListener(n.ads.video.progress, (function(e) {
                        var i = 100 - t.currentProgress,
                            n = e.currentTime / e.duration * i;
                        n < i && t.progressCallback(t.currentProgress + n)
                    })), this.initializeNoProgressFix()
                }
                return e.prototype.queueFakeProgress = function(e, t, i) {
                    var n = this;
                    this.storedQueue.push({
                        progressToFake: e,
                        duration: t,
                        stopEvent: i
                    }), a.addEventListener(i, (function() {
                        n.eventWatcher[i] = !0, n.currentProgress = n.startProgress + e, n.startProgress = n.currentProgress, n.progressCallback(n.currentProgress), n.activeQueue.shift(), n.activeQueue.length > 0 ? n.continue() : n.pause()
                    }))
                }, e.prototype.fakeProgress = function(e, t, i) {
                    this.activeQueue.push({
                        progressToFake: e,
                        duration: t,
                        stopEvent: i
                    }), this.fakeProgressEvents = !0, this.continue()
                }, e.prototype.start = function() {
                    this.activeQueue.length > 0 || (this.activeQueue = ge([], this.storedQueue), this.active = !0, this.continue())
                }, e.prototype.continue = function() {
                    if (this.activeQueue.length > 0 && !this.tickInterval) {
                        this.startTime = Date.now();
                        this.tickInterval = window.setInterval(this.tick.bind(this), 50), this.active = !0
                    }
                }, e.prototype.pause = function() {
                    this.clearInterval()
                }, e.prototype.tick = function() {
                    var e = this.activeQueue[0],
                        t = Date.now() - this.startTime,
                        i = Math.min(t / e.duration, 1);
                    this.currentProgress = this.startProgress + e.progressToFake * i, this.fakeProgressEvents && a.dispatchEvent(n.ads.video.progress, {
                        duration: e.duration / 1e3,
                        currentTime: t / 1e3
                    }), this.progressCallback(this.currentProgress), (this.eventWatcher[e.stopEvent] || 1 === i) && this.pause()
                }, e.prototype.clearInterval = function() {
                    this.tickInterval && (clearInterval(this.tickInterval), this.tickInterval = 0)
                }, e.prototype.initializeNoProgressFix = function() {
                    var e = this;
                    a.addEventListener(n.ads.started, (function(t) {
                        e.progressWatcherTimeout = window.setTimeout((function() {
                            if (e.active) {
                                var i = 100 - e.currentProgress,
                                    r = 1e3 * t.duration - 1e3;
                                e.fakeProgress(i, r, n.ads.completed)
                            }
                        }), 1e3)
                    })), a.addEventListener(n.ads.video.progress, (function() {
                        e.progressWatcherTimeout && (clearTimeout(e.progressWatcherTimeout), e.progressWatcherTimeout = 0)
                    }))
                }, e.prototype.reset = function() {
                    this.eventWatcher = {}, this.startProgress = 0, this.startTime = 0, this.currentProgress = 0, this.activeQueue = [], this.active = !1, this.fakeProgressEvents = !1, this.clearInterval()
                }, e
            }(),
            be = !0,
            ye = {};

        function ke() {
            if (document.body && document.body.appendChild) {
                var e = document.createElement("iframe");
                e.style.display = "none", document.body.appendChild(e), e.contentWindow && (e.contentWindow.document.open(), e.contentWindow.document.write("<script>\nconst lsKey = 'poki_lsexpire';\nconst lifetime = 1000*60*60*24*30*6;\n\nwindow.addEventListener('storage', function(event) {\n    try {\n        const key = event.key;\n\n        // key is null when localStorage.clear() is called.\n        if (key === null) {\n            localStorage.removeItem(lsKey);\n            return;\n        }\n\n        if (key === lsKey) return;\n\n        const updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\n        // newValue is null when localStorage.removeItem() is called.\n        if (event.newValue === null) {\n            delete updates[key];\n        } else {\n            updates[key] = Date.now();\n        }\n        localStorage.setItem(lsKey, JSON.stringify(updates));\n    } catch (e) {}\n});\n\nfunction expire() {\n    const updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n    const expireBefore = Date.now() - lifetime;\n    var removed = false;\n\n    Object.keys(updates).map(function(key) {\n       if (updates[key] < expireBefore) {\n           localStorage.removeItem(key);\n           delete updates[key];\n           removed = true;\n       }\n    });\n\n    if (removed) {\n        localStorage.setItem(lsKey, JSON.stringify(updates));\n    }\n}\n\ntry {\n    expire();\n} catch (e) {}\n<\/script>"), e.contentWindow.document.close())
            } else document.addEventListener("DOMContentLoaded", ke)
        }
        var we = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO"],
            Ie = ["US"],
            Se = ["ZZ"];

        function Ee(e) {
            return we.includes(e)
        }

        function Te(e) {
            return Se.includes(e)
        }
        var xe = function(e, t, i, n) {
                return new(i || (i = Promise))((function(r, a) {
                    function o(e) {
                        try {
                            d(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function s(e) {
                        try {
                            d(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function(e) {
                            e(t)
                        }))).then(o, s)
                    }
                    d((n = n.apply(e, t || [])).next())
                }))
            },
            Ce = function(e, t) {
                var i, n, r, a, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1]
                    },
                    trys: [],
                    ops: []
                };
                return a = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                }), a;

                function s(a) {
                    return function(s) {
                        return function(a) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (i = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
                                switch (n = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                                    case 0:
                                    case 1:
                                        r = a;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = a[1], a = [0];
                                        continue;
                                    case 7:
                                        a = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                            o.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && o.label < r[1]) {
                                            o.label = r[1], r = a;
                                            break
                                        }
                                        if (r && o.label < r[2]) {
                                            o.label = r[2], o.ops.push(a);
                                            break
                                        }
                                        r[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                a = t.call(e, o)
                            } catch (e) {
                                a = [6, e], n = 0
                            } finally {
                                i = r = 0
                            }
                            if (5 & a[0]) throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, s])
                    }
                }
            };
        const Be = function() {
            function e(e) {
                var t = this;
                this.bannerTimeout = null, this.allowedToPlayAd = !1, this.runningAd = !1, this.currentWidth = 640, this.currentHeight = 480, this.currentRequestIsMuted = !1, this.volume = 1, this.canWeAutoPlayWithSound = function() {
                    return xe(t, void 0, void 0, (function() {
                        return Ce(this, (function(e) {
                            switch (e.label) {
                                case 0:
                                    if (!this.blankVideo) return [2, !1];
                                    e.label = 1;
                                case 1:
                                    return e.trys.push([1, 3, , 4]), [4, this.blankVideo.play()];
                                case 2:
                                    return e.sent(), [2, !0];
                                case 3:
                                    return e.sent(), [2, !1];
                                case 4:
                                    return [2]
                            }
                        }))
                    }))
                }, this.videoElement = document.getElementById("pokiSDKVideoContainer"), this.adsManager = null, this.volume = e, this.initAdDisplayContainer(), this.initBlankVideo(), this.initAdsLoader()
            }
            return e.prototype.initAdDisplayContainer = function() {
                this.adDisplayContainer || (this.adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById("pokiSDKAdContainer"), this.videoElement))
            }, e.prototype.initBlankVideo = function() {
                this.blankVideo = document.createElement("video"), this.blankVideo.setAttribute("playsinline", "playsinline");
                var e = document.createElement("source");
                e.src = "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw", this.blankVideo.appendChild(e)
            }, e.prototype.initAdsLoader = function() {
                var e = this;
                this.adsLoader || (this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer), this.adsLoader.getSettings().setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), this.adsLoader.getSettings().setDisableCustomPlaybackForIOS10Plus(!0), this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded, !1, this), this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdLoaderError, !1, this), this.videoElement.addEventListener("onended", (function() {
                    return e.adsLoader.contentComplete()
                })))
            }, e.prototype.requestAd = function(e) {
                return xe(this, void 0, void 0, (function() {
                    var t;
                    return Ce(this, (function(i) {
                        switch (i.label) {
                            case 0:
                                return this.runningAd ? [2] : (this.runningAd = !0, this.adDisplayContainer.initialize(), this.videoElement.src = "", (t = new google.ima.AdsRequest).adTagUrl = e, t.linearAdSlotWidth = this.currentWidth, t.linearAdSlotHeight = this.currentHeight, t.nonLinearAdSlotWidth = this.currentWidth, t.nonLinearAdSlotHeight = this.currentHeight, t.forceNonLinearFullSlot = !0, [4, this.canWeAutoPlayWithSound()]);
                            case 1:
                                return i.sent() ? (t.setAdWillPlayMuted(!1), this.currentRequestIsMuted = !1) : (t.setAdWillPlayMuted(!0), this.currentRequestIsMuted = !0), this.allowedToPlayAd = !0, this.adsLoader.requestAds(t), [2]
                        }
                    }))
                }))
            }, e.prototype.resize = function(e, t, i) {
                void 0 === i && (i = google.ima.ViewMode.NORMAL), this.currentWidth = e, this.currentHeight = t, this.adsManager && this.adsManager.resize(e, t, i)
            }, e.prototype.onAdsManagerLoaded = function(e) {
                var t = new google.ima.AdsRenderingSettings;
                t.enablePreloading = !0, t.restoreCustomPlaybackStateOnAdBreakComplete = !0, t.mimeTypes = x() || S() || E() ? ["video/mp4"] : ["video/mp4", "video/webm", "video/ogg"], t.loadVideoTimeout = 8e3, this.adsManager = e.getAdsManager(this.videoElement, t), this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume))), this.currentRequestIsMuted && this.adsManager.setVolume(0), this.allowedToPlayAd ? (this.attachAdEvents(), a.dispatchEvent(n.ads.ready)) : this.tearDown()
            }, e.prototype.setVolume = function(e) {
                this.volume = e, this.adsManager && this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume)))
            }, e.prototype.startPlayback = function() {
                try {
                    this.adsManager.init(this.currentWidth, this.currentHeight, google.ima.ViewMode.NORMAL), this.adsManager.start()
                } catch (e) {
                    this.videoElement.play()
                }
            }, e.prototype.startIOSPlayback = function() {
                this.adsManager.start()
            }, e.prototype.stopPlayback = function() {
                a.dispatchEvent(n.ads.stopped), this.tearDown()
            }, e.prototype.resumeAd = function() {
                a.dispatchEvent(n.ads.video.resumed), this.adsManager && this.adsManager.resume()
            }, e.prototype.tearDown = function() {
                this.adsManager && (this.adsManager.stop(), this.adsManager.destroy(), this.adsManager = null), null !== this.bannerTimeout && (clearTimeout(this.bannerTimeout), this.bannerTimeout = null), this.adsLoader && (this.adsLoader.contentComplete(), this.adsLoader.destroy(), this.adsLoader = null, this.initAdsLoader()), this.runningAd = !1
            }, e.prototype.attachAdEvents = function() {
                var e = this,
                    t = google.ima.AdEvent.Type;
                this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, !1, this), [t.AD_PROGRESS, t.ALL_ADS_COMPLETED, t.CLICK, t.COMPLETE, t.IMPRESSION, t.PAUSED, t.SKIPPED, t.STARTED, t.USER_CLOSE, t.AD_BUFFERING].forEach((function(t) {
                    e.adsManager.addEventListener(t, e.onAdEvent, !1, e)
                }))
            }, e.prototype.onAdEvent = function(e) {
                var t = this,
                    i = e.getAd();
                switch (e.type) {
                    case google.ima.AdEvent.Type.AD_PROGRESS:
                        a.dispatchEvent(n.ads.video.progress, e.getAdData());
                        break;
                    case google.ima.AdEvent.Type.STARTED:
                        e.remainingTime = this.adsManager.getRemainingTime(), e.remainingTime <= 0 && (e.remainingTime = 15), i.isLinear() || (this.bannerTimeout = window.setTimeout((function() {
                            a.dispatchEvent(n.ads.completed, {
                                rewardAllowed: !!e.rewardAllowed
                            }), t.tearDown()
                        }), 1e3 * (e.remainingTime + 1))), a.dispatchEvent(n.ads.started, {
                            creativeId: i.getCreativeId(),
                            adId: i.getAdId(),
                            duration: i.getDuration()
                        });
                        break;
                    case google.ima.AdEvent.Type.COMPLETE:
                        a.dispatchEvent(n.ads.completed, {
                            rewardAllowed: !0
                        }), this.tearDown();
                        break;
                    case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    case google.ima.AdEvent.Type.USER_CLOSE:
                        this.tearDown();
                        break;
                    case google.ima.AdEvent.Type.PAUSED:
                        this.adsManager.pause(), a.dispatchEvent(n.ads.video.paused);
                        break;
                    case google.ima.AdEvent.Type.AD_BUFFERING:
                        a.dispatchEvent(n.ads.video.buffering);
                        break;
                    case google.ima.AdEvent.Type.CLICK:
                        a.dispatchEvent(n.ads.video.clicked);
                        break;
                    case google.ima.AdEvent.Type.SKIPPED:
                        a.dispatchEvent(n.ads.skipped), a.dispatchEvent(n.ads.completed), document.activeElement && document.activeElement.blur();
                        break;
                    case google.ima.AdEvent.Type.IMPRESSION:
                        a.dispatchEvent(n.ads.impression, {
                            userValueIndicator: ee(a.getDataAnnotations().position === n.ads.position.rewarded ? U : Z)
                        })
                }
            }, e.prototype.onAdLoaderError = function(e) {
                this.tearDown();
                var t = e.getError && e.getError().toString() || "Unknown";
                a.dispatchEvent(n.ads.video.loaderError, {
                    message: t
                })
            }, e.prototype.onAdError = function(e) {
                this.tearDown();
                var t = e.getError && e.getError().toString() || "Unknown";
                a.dispatchEvent(n.ads.video.error, {
                    message: t
                })
            }, e.prototype.muteAd = function() {
                void 0 !== this.adsManager && null != this.adsManager && this.adsManager.setVolume(0)
            }, e.prototype.isAdRunning = function() {
                return this.runningAd
            }, e
        }();
        const Pe = function(e) {
            return new Promise((function(t, i) {
                var n = document.createElement("script");
                n.type = "text/javascript", n.async = !0, n.src = e;
                var r = function() {
                    n.readyState && "loaded" !== n.readyState && "complete" !== n.readyState || (t(), n.onload = null, n.onreadystatechange = null)
                };
                n.onload = r, n.onreadystatechange = r, n.onerror = i, document.head.appendChild(n)
            }))
        };
        var De = function(e, t, i, n) {
                return new(i || (i = Promise))((function(r, a) {
                    function o(e) {
                        try {
                            d(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function s(e) {
                        try {
                            d(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function(e) {
                            e(t)
                        }))).then(o, s)
                    }
                    d((n = n.apply(e, t || [])).next())
                }))
            },
            _e = function(e, t) {
                var i, n, r, a, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1]
                    },
                    trys: [],
                    ops: []
                };
                return a = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                }), a;

                function s(a) {
                    return function(s) {
                        return function(a) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (i = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
                                switch (n = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                                    case 0:
                                    case 1:
                                        r = a;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = a[1], a = [0];
                                        continue;
                                    case 7:
                                        a = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                            o.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && o.label < r[1]) {
                                            o.label = r[1], r = a;
                                            break
                                        }
                                        if (r && o.label < r[2]) {
                                            o.label = r[2], o.ops.push(a);
                                            break
                                        }
                                        r[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                a = t.call(e, o)
                            } catch (e) {
                                a = [6, e], n = 0
                            } finally {
                                i = r = 0
                            }
                            if (5 & a[0]) throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, s])
                    }
                }
            };
        const Le = function() {
            var e = window.location.pathname;
            "/" !== e[0] && (e = "/" + e);
            var t = encodeURIComponent(window.location.protocol + "//" + window.location.host + e + window.location.search),
                i = encodeURIComponent(document.referrer);
            return fetch("" + t + "" + i, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain"
                }
            }).then((function(e) {
                return De(void 0, void 0, void 0, (function() {
                    var t;
                    return _e(this, (function(i) {
                        switch (i.label) {
                            case 0:
                                return e.status >= 200 && e.status < 400 ? [4, e.json()] : [3, 2];
                            case 1:
                                return (t = i.sent()).game_id ? [2, {
                                    gameId: t.game_id,
                                    adTiming: {
                                        preroll: t.ad_settings.preroll,
                                        timePerTry: t.ad_settings.time_per_try,
                                        timeBetweenAds: t.ad_settings.time_between_ads,
                                        startAdsAfter: t.ad_settings.start_ads_after
                                    }
                                }] : [2, void 0];
                            case 2:
                                throw e
                        }
                    }))
                }))
            })).catch((function(e) {
                return function(e) {
                    return De(this, void 0, void 0, (function() {
                        var t, i, n, r, a, o, s, d, A, c, l, p;
                        return _e(this, (function(u) {
                            switch (u.label) {
                                case 0:
                                    return u.trys.push([0, 3, , 4]), "/" !== (t = window.location.pathname)[0] && (t = "/" + t), r = (n = JSON).stringify, c = {
                                        c: "sdk-p4d-error",
                                        ve: 7
                                    }, l = {
                                        k: "error"
                                    }, o = (a = JSON).stringify, p = {
                                        status: e.status
                                    }, (s = e.json) ? [4, e.json()] : [3, 2];
                                case 1:
                                    s = u.sent(), u.label = 2;
                                case 2:
                                    if (i = r.apply(n, [(c.d = [(l.v = o.apply(a, [(p.json = s, p.body = JSON.stringify({
                                            href: window.location.protocol + "//" + window.location.host + t + window.location.search
                                        }), p.name = e.name, p.message = e.message, p)]), l)], c)]), d = "", navigator.sendBeacon) navigator.sendBeacon(d, i);
                                    else try {
                                        (A = new XMLHttpRequest).open("POST", d, !0), A.send(i)
                                    } catch (e) {}
                                    return [3, 4];
                                case 3:
                                    return u.sent(), [3, 4];
                                case 4:
                                    return [2]
                            }
                        }))
                    }))
                }(e)
            }))
        };
        var Re = function(e, t, i, n) {
                return new(i || (i = Promise))((function(r, a) {
                    function o(e) {
                        try {
                            d(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function s(e) {
                        try {
                            d(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function(e) {
                            e(t)
                        }))).then(o, s)
                    }
                    d((n = n.apply(e, t || [])).next())
                }))
            },
            Me = function(e, t) {
                var i, n, r, a, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1]
                    },
                    trys: [],
                    ops: []
                };
                return a = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                }), a;

                function s(a) {
                    return function(s) {
                        return function(a) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (i = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
                                switch (n = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                                    case 0:
                                    case 1:
                                        r = a;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = a[1], a = [0];
                                        continue;
                                    case 7:
                                        a = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                            o.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && o.label < r[1]) {
                                            o.label = r[1], r = a;
                                            break
                                        }
                                        if (r && o.label < r[2]) {
                                            o.label = r[2], o.ops.push(a);
                                            break
                                        }
                                        r[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                a = t.call(e, o)
                            } catch (e) {
                                a = [6, e], n = 0
                            } finally {
                                i = r = 0
                            }
                            if (5 & a[0]) throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, s])
                    }
                }
            };

        function Ge() {
            return Re(this, void 0, Promise, (function() {
                var e, t, i, n;
                return Me(this, (function(r) {
                    switch (r.label) {
                        case 0:
                            return r.trys.push([0, 3, , 4]), [4, fetch("", {
                                method: "GET",
                                headers: {
                                    "Content-Type": "text/plain"
                                }
                            })];
                        case 1:
                            return [4, r.sent().json()];
                        case 2:
                            return e = r.sent(), t = e.ISO, i = e.ccpaApplies, [2, {
                                ISO: t,
                                ccpaApplies: i
                            }];
                        case 3:
                            return n = r.sent(), console.error(n), [2, {
                                ISO: "ZZ",
                                ccpaApplies: !1
                            }];
                        case 4:
                            return [2]
                    }
                }))
            }))
        }
        var Oe = function(e, t, i, n) {
                return new(i || (i = Promise))((function(r, a) {
                    function o(e) {
                        try {
                            d(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function s(e) {
                        try {
                            d(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    }

                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function(e) {
                            e(t)
                        }))).then(o, s)
                    }
                    d((n = n.apply(e, t || [])).next())
                }))
            },
            ze = function(e, t) {
                var i, n, r, a, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1]
                    },
                    trys: [],
                    ops: []
                };
                return a = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                }), a;

                function s(a) {
                    return function(s) {
                        return function(a) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (i = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
                                switch (n = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                                    case 0:
                                    case 1:
                                        r = a;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = a[1], a = [0];
                                        continue;
                                    case 7:
                                        a = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                            o.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && o.label < r[1]) {
                                            o.label = r[1], r = a;
                                            break
                                        }
                                        if (r && o.label < r[2]) {
                                            o.label = r[2], o.ops.push(a);
                                            break
                                        }
                                        r[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                a = t.call(e, o)
                            } catch (e) {
                                a = [6, e], n = 0
                            } finally {
                                i = r = 0
                            }
                            if (5 & a[0]) throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, s])
                    }
                }
            },
            je = !1,
            Qe = function() {
                return Oe(void 0, void 0, void 0, (function() {
                    var e, t, i;
                    return ze(this, (function(n) {
                        switch (n.label) {
                            case 0:
                                if (je) return [2];
                                n.label = 1;
                            case 1:
                                return n.trys.push([1, 4, , 5]), [4, fetch("./touchControllerConfig.json")];
                            case 2:
                                return [4, n.sent().json()];
                            case 3:
                                return (e = n.sent()) && ((t = document.createElement("script")).src = "", t.onload = function() {
                                    new window.OverlayController(document.body, e)
                                }, document.head.appendChild(t), je = !0), [3, 5];
                            case 4:
                                return i = n.sent(), console.log(i), [3, 5];
                            case 5:
                                return [2]
                        }
                    }))
                }))
            };
        const Ne = function() {
            for (var e = Math.floor(Date.now() / 1e3), t = "", i = 0; i < 4; i++) t = String.fromCharCode(255 & e) + t, e >>= 8;
            if (window.crypto && crypto.getRandomValues && Uint32Array) {
                var n = new Uint32Array(12);
                crypto.getRandomValues(n);
                for (i = 0; i < 12; i++) t += String.fromCharCode(255 & n[i])
            } else
                for (i = 0; i < 12; i++) t += String.fromCharCode(Math.floor(256 * Math.random()));
            return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
        };
        const Fe = function() {
            function e() {
                this.debugAds = !1, this.slotMap = new Map
            }
            return e.prototype.setIGDDebug = function(e) {
                this.debugAds = e
            }, e.prototype.waitUntilReady = function(e) {
                window.googletag.cmd.push((function() {
                    window.pbjs.que.push((function() {
                        e()
                    }))
                }))
            }, e.prototype.setupSlotRenderEndedListener = function() {
                var e = this;
                this.waitUntilReady((function() {
                    window.googletag.pubads().addEventListener("slotRenderEnded", (function(t) {
                        var i, r, a, o, s = t.slot.getSlotElementId(),
                            d = e.slotMap.get(s);
                        if (d && d.gptSlot) {
                            var A = t.slot || {},
                                l = (null === (i = A.getResponseInformation) || void 0 === i ? void 0 : i.call(A)) || {},
                                p = l.isBackfill,
                                u = l.lineItemId,
                                m = l.campaignId,
                                h = !! function(e) {
                                    if (!e || "function" != typeof e.indexOf) return null;
                                    if (-1 !== e.indexOf("amazon-adsystem.com/aax2/apstag")) return null;
                                    var t = new RegExp('(?:(?:pbjs\\.renderAd\\(document,|adId:*|hb_adid":\\[)|(?:pbadid=)|(?:adId=))[\'"](.*?)["\']', "gi"),
                                        i = e.replace(/ /g, ""),
                                        n = t.exec(i);
                                    return n && n[1] || null
                                }(null === (a = (r = A).getHtml) || void 0 === a ? void 0 : a.call(r)),
                                g = d.adserverTargeting || {},
                                f = g.hb_bidder,
                                v = parseFloat(g.hb_pb);
                            isNaN(v) && (v = void 0), c.track(n.tracking.ads.display.impression, {
                                size: d.size,
                                opportunityId: d.opportunityId,
                                duringGameplay: null === (o = d.duringGameplayFn) || void 0 === o ? void 0 : o.call(d),
                                adUnitPath: d.adUnitPath,
                                prebidBid: v,
                                prebidBidder: f,
                                preBidWon: h,
                                dfpIsBackfill: p,
                                dfpLineItemId: u,
                                dfpCampaignId: m
                            })
                        }
                    })), window.googletag.pubads().addEventListener("impressionViewable", (function(t) {
                        var i, r = t.slot.getSlotElementId(),
                            a = e.slotMap.get(r);
                        a && a.gptSlot && c.track(n.tracking.ads.display.viewable, {
                            size: a.size,
                            opportunityId: a.opportunityId,
                            duringGameplay: null === (i = a.duringGameplayFn) || void 0 === i ? void 0 : i.call(a),
                            adUnitPath: a.adUnitPath
                        })
                    }))
                }))
            }, e.prototype.validateDisplaySettings = function(e) {
                return !!(S() || E() || ["970x250", "300x250", "728x90", "160x600", "320x50"].includes(e)) && !((S() || E()) && !["320x50"].includes(e))
            }, e.prototype.getDisplaySlotConfig = function(e) {
                var t = e.split("x").map((function(e) {
                        return parseInt(e, 10)
                    })),
                    i = "/21682198607/debug-display/debug-display-" + e,
                    n = "desktop";
                S() && (n = "mobile"), E() && (n = "tablet");
                var r = parseInt(T("site_id"), 10) || 0;
                return this.debugAds || (i = Ve.GetIsPokiIFrame() ? "/21682198607/" + n + "_ingame_" + e + "/" + r + "_" + n + "_ingame_" + e : "/21682198607/external_" + n + "_display_ingame/external_" + n + "_ingame_" + e), {
                    id: "poki-" + Ne(),
                    adUnitPath: i,
                    size: e,
                    width: t[0],
                    height: t[1],
                    refresh: !1
                }
            }, e.prototype.renderIGDAd = function(e, t, i, n, r) {
                var a = this,
                    o = this.getIGDSlotID(e);
                (this.slotMap.get(o || "") || null) && this.clearIGDAd(e);
                var s = this.getDisplaySlotConfig(t);
                this.slotMap.set(s.id, s), s.opportunityId = n, s.duringGameplayFn = r;
                var d = document.createElement("div");
                d.style.width = s.width + "px", d.style.height = s.height + "px", e.appendChild(d), s.intersectionObserver = new window.IntersectionObserver((function(t) {
                    var n;
                    t[0].isIntersecting && (null === (n = s.intersectionObserver) || void 0 === n || n.disconnect(), a.waitUntilReady((function() {
                        if (a.slotMap.get(s.id)) {
                            d.style.background = "#CCC", d.innerHTML = "<p>ADVERTISEMENT</p>", d.style.display = "flex", d.style.justifyContent = "center", d.style.alignItems = "center", d.style.position = "absolute", d.style.zIndex = "1", d.style.fontFamily = "Helvetica", d.style.fontSize = "16px", d.style.color = "#888", d.style.pointerEvents = "none";
                            var t = document.createElement("div");
                            t.id = s.id, t.className = "poki-ad-slot", t.style.width = s.width + "px", t.style.height = s.height + "px", t.style.position = "relative", t.style.zIndex = "2", t.setAttribute("data-poki-ad-size", s.size), e.appendChild(t), e.setAttribute("data-poki-ad-id", s.id), a.setupGPT(s, i), a.requestAd(s)
                        }
                    })))
                }), {
                    threshold: 1
                }), s.intersectionObserver.observe(d)
            }, e.prototype.setupGPT = function(e, t) {
                var i;
                e.gptSlot = window.googletag.defineSlot(e.adUnitPath, [e.width, e.height], e.id).addService(window.googletag.pubads()), window.googletag.enableServices(), null === (i = e.gptSlot) || void 0 === i || i.clearTargeting(), Object.keys(t).forEach((function(i) {
                    var n;
                    null === (n = e.gptSlot) || void 0 === n || n.setTargeting(i, t[i])
                }))
            }, e.prototype.requestAd = function(e) {
                var t, i = this;
                c.track(n.tracking.ads.display.requested, {
                    size: e.size,
                    opportunityId: e.opportunityId,
                    adUnitPath: e.adUnitPath,
                    refresh: e.refresh,
                    duringGameplay: null === (t = e.duringGameplayFn) || void 0 === t ? void 0 : t.call(e)
                }), window.pbjs.requestBids({
                    adUnitCodes: [e.adUnitPath],
                    bidsBackHandler: function() {
                        i.bidsBackHandler(e.id)
                    }
                })
            }, e.prototype.clearIGDAd = function(e) {
                var t, i = this.getIGDSlotID(e),
                    r = this.slotMap.get(i || "") || null;
                if (r) {
                    for (c.track(n.tracking.screen.destroyAd, {
                            opportunityId: r.opportunityId
                        }), null === (t = r.intersectionObserver) || void 0 === t || t.disconnect(), r.gptSlot && googletag.destroySlots([r.gptSlot]); e.lastChild;) e.removeChild(e.lastChild);
                    e.removeAttribute("data-poki-ad-id"), this.slotMap.delete(r.id)
                }
            }, e.prototype.getIGDSlotID = function(e) {
                if (!e) return null;
                for (var t = 0, i = Array.from(e.getElementsByClassName("poki-ad-slot")); t < i.length; t++) {
                    var n = i[t],
                        r = this.slotMap.get(n.id);
                    if (r) return r.id
                }
                return null
            }, e.prototype.bidsBackHandler = function(e) {
                var t = this.slotMap.get(e);
                t && t.gptSlot && (window.pbjs.setTargetingForGPTAsync([t.adUnitPath]), t.adserverTargeting = window.pbjs.getAdserverTargetingForAdUnitCode([t.adUnitPath]), window.googletag.display(t.id))
            }, e
        }();
        var Xe, Ue = (Xe = function(e, t) {
            return (Xe = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(e, t) {
                    e.__proto__ = t
                } || function(e, t) {
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
                })(e, t)
        }, function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

            function i() {
                this.constructor = e
            }
            Xe(e, t), e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i)
        });
        const Ze = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return Ue(t, e), t.prototype.logEvent = function(e) {
                this.debugAds ? console.log(e) : fetch("", {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(e)
                })
            }, t.prototype.waitUntilReady = function(e) {
                window.pbjs.que.push((function() {
                    e()
                }))
            }, t.prototype.requestAd = function(t) {
                this.logEvent({
                    event: "request",
                    size: t.size,
                    opportunityId: t.opportunityId,
                    adUnitPath: t.adUnitPath,
                    p4d_game_id: We.gameId,
                    p4d_version_id: We.versionId
                }), e.prototype.requestAd.call(this, t)
            }, t.prototype.bidsBackHandler = function(e) {
                var t, i, r = this,
                    a = this.slotMap.get(e);
                if (a) {
                    var o = document.createElement("iframe");
                    o.setAttribute("frameborder", "0"), o.setAttribute("scrolling", "no"), o.setAttribute("marginheight", "0"), o.setAttribute("marginwidth", "0"), o.setAttribute("topmargin", "0"), o.setAttribute("leftmargin", "0"), o.setAttribute("allowtransparency", "true"), o.setAttribute("width", "" + a.width), o.setAttribute("height", "" + a.height);
                    var s = document.getElementById(a.id);
                    if (s) {
                        s.appendChild(o);
                        var d = null === (t = null == o ? void 0 : o.contentWindow) || void 0 === t ? void 0 : t.document;
                        if (!d) return console.error("IGD error - iframe injection for ad failed", e), void this.clearIGDAd(s.parentNode);
                        if (a.adserverTargeting = window.pbjs.getAdserverTargetingForAdUnitCode([a.adUnitPath]), !a.adserverTargeting.hb_adid) return console.error("IGD info - nothing to render", e, a.adserverTargeting), void this.clearIGDAd(s.parentNode);
                        var A = a.adserverTargeting.hb_bidder,
                            l = parseFloat(a.adserverTargeting.hb_pb);
                        isNaN(l) && (l = 0), window.pbjs.renderAd(d, a.adserverTargeting.hb_adid), c.track(n.tracking.ads.display.impression, {
                            size: a.size,
                            opportunityId: a.opportunityId,
                            duringGameplay: null === (i = a.duringGameplayFn) || void 0 === i ? void 0 : i.call(a),
                            adUnitPath: a.adUnitPath,
                            prebidBid: l,
                            prebidBidder: A,
                            preBidWon: !0,
                            dfpIsBackfill: !1,
                            dfpLineItemId: void 0,
                            dfpCampaignId: void 0
                        }), this.logEvent({
                            event: "impression",
                            size: a.size,
                            opportunityId: a.opportunityId,
                            adUnitPath: a.adUnitPath,
                            p4d_game_id: We.gameId,
                            p4d_version_id: We.versionId,
                            bidder: A,
                            bid: l
                        }), a.intersectionObserver = new IntersectionObserver((function(e) {
                            e.forEach((function(e) {
                                e.isIntersecting ? a.intersectingTimer || (a.intersectingTimer = setTimeout((function() {
                                    var t, i;
                                    null === (t = a.intersectionObserver) || void 0 === t || t.unobserve(e.target), c.track(n.tracking.ads.display.viewable, {
                                        size: a.size,
                                        opportunityId: a.opportunityId,
                                        duringGameplay: null === (i = a.duringGameplayFn) || void 0 === i ? void 0 : i.call(a),
                                        adUnitPath: a.adUnitPath
                                    }), r.logEvent({
                                        event: "viewable",
                                        size: a.size,
                                        opportunityId: a.opportunityId,
                                        adUnitPath: a.adUnitPath,
                                        p4d_game_id: We.gameId,
                                        p4d_version_id: We.versionId,
                                        bidder: A,
                                        bid: l
                                    })
                                }), 1e3)) : a.intersectingTimer && (clearTimeout(a.intersectingTimer), a.intersectingTimer = void 0)
                            }))
                        }), {
                            threshold: .5
                        }), a.intersectionObserver.observe(s)
                    } else console.error("IGD error - container not found", e)
                }
            }, t.prototype.setupGPT = function(e, t) {}, t.prototype.setupSlotRenderEndedListener = function() {}, t
        }(Fe);
        var He = function() {
                return (He = Object.assign || function(e) {
                    for (var t, i = 1, n = arguments.length; i < n; i++)
                        for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    return e
                }).apply(this, arguments)
            },
            We = {
                gameId: T("game_id"),
                versionId: T("game_version_id")
            };
        const Ve = function() {
            function e() {
                this.autoStartOnReady = !1, this.criteria = {}, this.debugIsOverwritten = !1, this.handlers = {}, this.initializingPromise = null, this.isInitialized = !1, this.programmaticAdsEnabled = !0, this.sdkBooted = !1, this.sdkImaError = !1, this.startAdEnabled = !1, this.startStartAdsAfterTimerOnInit = !1, this.initOptions = {}, this.forceDisableCommercialBreak = !1, this.installedTCFv2 = !1, this.installedUSP = !1, this.debug = !1, this.adReady = !1, this.debugTouchOverlayController = !1, this.setPlayerAge = function(e) {
                    e && function(e, t) {
                        if (be) try {
                            localStorage.setItem(e, t)
                        } catch (i) {
                            be = !1, ye[e] = t
                        } else ye[e] = t
                    }("playerAge", e)
                }, this.toggleNonPersonalized = function(t) {
                    e.nonPersonalized = t
                }, this.setConsentString = function(t) {
                    e.consentString = t
                }, this.sdkNotBootedButCalled = function() {
                    console.error("The Poki SDK has not yet been initialized")
                }, "" === We.gameId ? this.IGD = new Ze : this.IGD = new Fe;
                var t = T("pokiDebug");
                "" !== t && (this.setDebug("true" === t), this.debugIsOverwritten = !0)
            }
            return e.prototype.init = function(e) {
                if (void 0 === e && (e = {}), "undefined" != typeof window) {
                    var t = e.onReady,
                        i = void 0 === t ? null : t,
                        n = e.onAdblocked,
                        r = void 0 === n ? null : n;
                    return this.initOptions = e, i && this.registerHandler("onReady", i), r && this.registerHandler("onAdblocked", r), this.isInitialized ? console.error("Poki SDK has already been initialized") : (this.initializingPromise || (this.initializingPromise = this.lazyLoadInit()), this.initializingPromise)
                }
            }, e.prototype.lazyLoadInit = function() {
                var t = this,
                    i = this.initOptions,
                    r = i.adTagUrl,
                    o = i.adTiming,
                    s = void 0 === o ? {} : o,
                    d = i.customCriteria,
                    A = void 0 === d ? {} : d,
                    p = i.debug,
                    u = void 0 !== p && p,
                    m = i.prebid,
                    h = void 0 === m ? {} : m,
                    g = i.a9,
                    f = void 0 === g ? {} : g,
                    v = i.volume,
                    b = void 0 === v ? 1 : v,
                    y = i.waterfallRetries,
                    k = i.wrapper,
                    I = void 0 === k ? document.body : k,
                    x = parseInt(T("site_id"), 10) || 0;
                window.googletag = window.googletag || {
                    cmd: []
                }, this.setupDefaultEvents(), c.setupDefaultEvents(), ke(), setTimeout(w.trackSavegames, 1e4);
                var C = He({}, l);
                r ? (e.isPokiPlatform = !0, C = He(He({}, C), {
                    adTagUrl: r,
                    customCriteria: A,
                    adTiming: s
                })) : e.isPokiPlatform = !1;
                var B = Le;
                (e.isPokiPlatform || this.debug) && (B = function() {
                    return Promise.resolve()
                });
                var P = Ge,
                    D = T("ccpaApplies"),
                    _ = this.initOptions.country || T("country"),
                    L = void 0 !== this.initOptions.isCCPA ? this.initOptions.isCCPA : "" !== D ? "1" === D : void 0;
                _ && void 0 !== L && (P = function() {
                    return Promise.resolve({
                        ISO: _,
                        ccpaApplies: L
                    })
                });
                var R = !1;
                return _ && (J(h, _), R = !0), window.addEventListener("resize", this.resize.bind(this), !1), window.addEventListener("message", this.onMessage.bind(this), !1), this.debugIsOverwritten || this.setDebug(this.debug || u), this.debugTouchOverlayController && (S() || E()) && Qe(), Promise.all([B(), P(), Pe(""), Pe(""), Pe(""), Pe("")]).catch((function() {
                    a.dispatchEvent(n.adblocked)
                })).then((function(e) {
                    if (void 0 !== e) {
                        var i = e[0],
                            r = e[1];
                        if (t.country = _ || (null == r ? void 0 : r.ISO) || "zz", t.isCCPA = void 0 === L ? (null == r ? void 0 : r.ccpaApplies) || !1 : L, i) {
                            We.gameId || (We.gameId = i.gameId);
                            ["a1xpkhbm8exlorx3euezv4aa3e5vl9zw"].includes(We.gameId) && (S() || E()) && Qe(), C.adTiming = i.adTiming, C.customCriteria = He(He({}, C.customCriteria), {
                                p4d_game_id: We.gameId
                            })
                        }
                        R || J(h, t.country), t.debug && (C.adTiming.startAdsAfter = 0), t.enableSettings(C);
                        var o = Ee(t.country);
                        o && !t.debug && (Y(), console.debug("GDPR - waiting for __tcfapi callback"), window.__tcfapi("ping", 2, (function() {
                                console.debug("GDPR - __tcfapi callback received"), t.installedTCFv2 = !0
                            })), setTimeout((function() {
                                t.installedTCFv2 || console.error("GDPR - No __tcfapi callback after 2s, verify implementation!")
                            }), 2e3)), t.isCCPA && !t.debug && ($(), console.debug("USPrivacy - waiting for __uspapi callback"), window.__uspapi("uspPing", 1, (function() {
                                console.debug("USPrivacy - __uspapi callback received"), t.installedUSP = !0
                            })), setTimeout((function() {
                                t.installedUSP || console.error("USPrivacy - No __uspapi callback after 2s, verify implementation!")
                            }), 2e3)), t.playerSkin = new fe({
                                wrapper: I
                            }), t.ima = new Be(b), t.playerSkin.setupEvents(t), t.startStartAdsAfterTimerOnInit && t.adTimings.startStartAdsAfterTimer(), t.waterfall = new te(t.ima, {
                                timing: t.adTimings,
                                totalRetries: y,
                                adTagUrl: C.adTagUrl,
                                siteID: x
                            }), t.IGD.setupSlotRenderEndedListener(),
                            function(e, t) {
                                window.apstag && window.apstag.init(e.settings || G({
                                    pubID: "",
                                    adServer: "",
                                    videoAdServer: ""
                                }, t ? {
                                    gdpr: {
                                        cmpTimeout: 1e4
                                    }
                                } : {}), (function() {
                                    q = !0, e.callback && e.callback()
                                }))
                            }(f, o), t.isInitialized = !0, a.dispatchEvent(n.ready)
                    }
                }))
            }, e.prototype.requestAd = function(t) {
                void 0 === t && (t = {});
                var i = t.autoStart,
                    r = void 0 === i || i,
                    s = t.customCriteria,
                    d = void 0 === s ? {} : s,
                    A = t.onFinish,
                    c = void 0 === A ? null : A,
                    l = t.onStart,
                    p = void 0 === l ? null : l,
                    u = t.position,
                    m = void 0 === u ? null : u;
                if (this.autoStartOnReady = !1 !== r, c && this.registerHandler("onFinish", c), p && this.registerHandler("onStart", p), this.forceDisableCommercialBreak && [n.ads.position.midroll, n.ads.position.preroll].includes(m)) c && c();
                else {
                    if (!this.sdkBooted) return a.dispatchEvent(n.ads.error, {
                        message: "Requesting ad on unbooted SDK"
                    }), void this.sdkNotBootedButCalled();
                    if (this.sdkImaError) a.dispatchEvent(n.ads.error, {
                        message: "Adblocker has been detected"
                    });
                    else if (!S() && !E() || m === n.ads.position.rewarded)
                        if (null !== m && o(m, n.ads.position))
                            if (!Ee(this.country) || this.installedTCFv2 || this.debug)
                                if (!this.isCCPA || this.installedUSP)
                                    if (this.ima.isAdRunning() || this.waterfall.isRunning()) a.dispatchEvent(n.ads.busy);
                                    else if (this.adReady) a.dispatchEvent(n.ads.ready);
                    else if (m !== n.ads.position.preroll || this.adTimings.prerollPossible())
                        if (m === n.ads.position.rewarded || this.adTimings.requestPossible()) {
                            var h = He(He(He({}, this.genericCriteria()), this.criteria), {
                                position: m
                            });
                            (e.isPokiPlatform || m === n.ads.position.rewarded) && (h = He(He({}, h), d)), this.playerSkin.show(), this.resize(), this.waterfall.start(h, m)
                        } else a.dispatchEvent(n.ads.limit, {
                            reason: n.info.messages.timeLimit
                        });
                    else a.dispatchEvent(n.ads.limit, {
                        reason: n.info.messages.prerollLimit
                    });
                    else a.dispatchEvent(n.ads.error, {
                        message: "No USP detected, please contact developersupport@poki.com for more information"
                    });
                    else a.dispatchEvent(n.ads.error, {
                        message: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information"
                    });
                    else console.error("POKI-SDK: Invalid position");
                    else a.dispatchEvent(n.ads.error, {
                        reason: "Interstitials are disabled on mobile"
                    })
                }
            }, e.prototype.displayAd = function(e, t, i, r) {
                var o = n.ads.position.display;
                if (!Ee(this.country) || this.installedTCFv2 || this.debug)
                    if (!this.isCCPA || window.__uspapi)
                        if (t) {
                            if (!this.sdkBooted) return a.dispatchEvent(n.ads.error, {
                                message: "Requesting ad on unbooted SDK",
                                position: o
                            }), void this.sdkNotBootedButCalled();
                            if (e)
                                if (this.sdkImaError) a.dispatchEvent(n.ads.error, {
                                    message: "Adblocker has been detected",
                                    position: o
                                });
                                else {
                                    if (!this.IGD.validateDisplaySettings(t)) return a.dispatchEvent(n.ads.error, {
                                        reason: "Display size " + t + " is not supported on this device",
                                        position: o
                                    });
                                    var s = He(He({}, this.genericCriteria()), this.criteria);
                                    this.IGD.renderIGDAd(e, t, s, i, r)
                                }
                            else a.dispatchEvent(n.ads.error, {
                                message: "Provided container does not exist",
                                position: o
                            })
                        } else a.dispatchEvent(n.ads.error, {
                            message: "No ad size given, usage: displayAd(<container>, <size>)",
                            position: o
                        });
                else a.dispatchEvent(n.ads.error, {
                    message: "No USP detected, please contact developersupport@poki.com for more information",
                    position: o
                });
                else a.dispatchEvent(n.ads.error, {
                    message: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information",
                    position: o
                })
            }, e.prototype.destroyAd = function(e) {
                if (!this.sdkBooted) return a.dispatchEvent(n.ads.displayError, {
                    message: "Attempting destroyAd on unbooted SDK"
                }), void this.sdkNotBootedButCalled();
                this.sdkImaError ? a.dispatchEvent(n.ads.displayError, {
                    message: "Adblocker has been detected"
                }) : (e = e || document.body, this.IGD.clearIGDAd(e))
            }, e.prototype.startStartAdsAfterTimer = function() {
                this.sdkBooted && !this.sdkImaError ? this.adTimings.startStartAdsAfterTimer() : this.startStartAdsAfterTimerOnInit = !0
            }, e.prototype.enableSettings = function(e) {
                this.criteria = He({}, e.customCriteria), this.adTimings = new u(e.adTiming)
            }, e.prototype.togglePlayerAdvertisingConsent = function(e) {
                if (e) {
                    var t, i = parseInt(function(e) {
                            if (!be) return ye[e];
                            try {
                                return localStorage.getItem(e)
                            } catch (t) {
                                return ye[e]
                            }
                        }("playerAge"), 10) || 0,
                        n = this.country,
                        r = Ee(n),
                        a = (t = n, Ie.includes(t)),
                        o = Te(n);
                    (r || a || Te) && (r && i <= 12 || a && i <= 16 || o && i <= 16) ? this.disableProgrammatic(): this.enableProgrammatic()
                } else this.disableProgrammatic()
            }, e.prototype.disableProgrammatic = function() {
                e.childDirected = !0, this.programmaticAdsEnabled = !1
            }, e.prototype.enableProgrammatic = function() {
                e.childDirected = !1, this.programmaticAdsEnabled = !0
            }, e.prototype.getProgrammaticAdsEnabled = function() {
                return this.programmaticAdsEnabled
            }, e.prototype.setDebug = function(e) {
                var t = this;
                this.debugIsOverwritten ? e && c.track(n.tracking.debugTrueInProduction) : (c.setDebug(e), a.setDebug(e), this.waterfall ? this.waterfall.setDebug(e) : a.addEventListener(n.ready, (function() {
                    t.waterfall && t.waterfall.setDebug(e)
                })), this.IGD.setIGDDebug(e), this.debug = e)
            }, e.prototype.resize = function() {
                var e = this;
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                if (!this.sdkImaError) {
                    var t = this.playerSkin.getVideoBounds();
                    0 !== t.width && 0 !== t.height ? this.ima.resize(t.width, t.height) : setTimeout((function() {
                        e.resize()
                    }), 100)
                }
            }, e.prototype.onMessage = function(e) {
                if ("string" == typeof e.data.type) switch (e.data.type) {
                    case "toggleNonPersonalized":
                        this.toggleNonPersonalized(!(!e.data.content || !e.data.content.nonPersonalized));
                        break;
                    case "setPersonalizedADConsent":
                        this.toggleNonPersonalized(!(e.data.content && e.data.content.consent)), this.setConsentString(e.data.content ? e.data.content.consentString : "");
                        break;
                    case "forceDisableCommercialBreak":
                        this.forceDisableCommercialBreak = !0
                }
            }, e.prototype.startAd = function() {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.adReady ? (this.resize(), this.ima.startPlayback()) : a.dispatchEvent(n.ads.error, {
                    message: "No ads ready to start"
                }))
            }, e.prototype.startAdClicked = function() {
                "undefined" != typeof navigator && /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) && this.startAdEnabled && (this.startAdEnabled = !1, this.playerSkin.hideStartAdButton(), this.ima.startIOSPlayback())
            }, e.prototype.stopAd = function() {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.waterfall.stopWaterfall(), this.ima.stopPlayback(), this.playerSkin.hide())
            }, e.prototype.resumeAd = function() {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.playerSkin.hidePauseButton(), this.ima.resumeAd())
            }, e.prototype.skipAd = function() {
                this.stopAd(), this.callHandler("onFinish", {
                    type: n.ads.completed,
                    rewardAllowed: !0
                })
            }, e.prototype.muteAd = function() {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || this.ima.muteAd()
            }, e.prototype.registerHandler = function(e, t) {
                this.handlers[e] = t
            }, e.prototype.callHandler = function(e) {
                for (var t = [], i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
                "function" == typeof this.handlers[e] && this.handlers[e](t)
            }, e.prototype.setupDefaultEvents = function() {
                var e = this;
                a.addEventListener(n.ready, (function() {
                    e.sdkBooted = !0, e.callHandler("onReady")
                })), a.addEventListener(n.adblocked, (function() {
                    e.sdkBooted = !0, e.sdkImaError = !0, e.callHandler("onAdblocked")
                })), a.addEventListener(n.ads.ready, (function() {
                    e.adReady = !0, e.autoStartOnReady && e.startAd()
                })), a.addEventListener(n.ads.started, (function() {
                    e.playerSkin.hideSpinner(), e.callHandler("onStart", {
                        type: n.ads.limit
                    })
                })), a.addEventListener(n.ads.video.paused, (function() {
                    e.playerSkin.showPauseButton()
                })), a.addEventListener(n.ads.limit, (function() {
                    e.callHandler("onFinish", {
                        type: n.ads.limit,
                        rewardAllowed: !1
                    })
                })), a.addEventListener(n.ads.stopped, (function() {
                    e.callHandler("onFinish", {
                        type: n.ads.stopped,
                        rewardAllowed: !1
                    })
                })), a.addEventListener(n.ads.error, (function() {
                    e.callHandler("onFinish", {
                        type: n.ads.error,
                        rewardAllowed: !1
                    })
                })), a.addEventListener(n.ads.busy, (function() {
                    e.callHandler("onFinish", {
                        type: n.ads.busy,
                        rewardAllowed: !1
                    })
                })), a.addEventListener(n.ads.completed, (function(t) {
                    e.callHandler("onFinish", {
                        type: n.ads.completed,
                        rewardAllowed: !!t.rewardAllowed
                    })
                })), [n.ads.limit, n.ads.stopped, n.ads.error, n.ads.busy, n.ads.completed].forEach((function(t) {
                    a.addEventListener(t, (function() {
                        e.playerSkin && e.playerSkin.hide(), e.adReady = !1
                    }))
                }))
            }, e.prototype.genericCriteria = function() {
                var e = {},
                    t = encodeURIComponent(T("tag") || ""),
                    i = encodeURIComponent(T("site_id") || ""),
                    n = encodeURIComponent(T("experiment") || ""),
                    r = encodeURIComponent(T("categories") || "");
                return e.tag = t, e.tag_site = t + "|" + i, e.site_id = i, e.experiment = n, e.categories = r, this.programmaticAdsEnabled || (e.disable_programmatic = 1), e
            }, e.prototype.setVolume = function(e) {
                this.ima && this.ima.setVolume(e)
            }, e.GetIsPokiPlatform = function() {
                return e.isPokiPlatform
            }, e.GetIsPokiIFrame = function() {
                return (parseInt(T("site_id"), 10) || 0) > 0
            }, e.childDirected = !1, e.isPokiPlatform = !1, e.nonPersonalized = !1, e.consentString = "", e
        }();

        function Ke(e) {
            switch (Object.prototype.toString.call(e)) {
                case "[object Error]":
                case "[object Exception]":
                case "[object DOMException]":
                    return !0;
                default:
                    return e instanceof Error
            }
        }
        var Je = "poki_erruid",
            qe = Date.now(),
            Ye = h(Je);

        function $e(e) {
            if (We.gameId && We.versionId) {
                if (!(Date.now() < qe)) {
                    Ye || (Ye = Math.random().toString(36).substr(2, 9), g(Je, Ye));
                    try {
                        var t = JSON.stringify({
                                gid: We.gameId,
                                vid: We.versionId,
                                ve: 7,
                                n: e.name,
                                m: e.message,
                                s: JSON.stringify(e.stack),
                                ui: Ye
                            }),
                            i = "";
                        if (navigator.sendBeacon) navigator.sendBeacon(i, t);
                        else {
                            var n = new XMLHttpRequest;
                            n.open("POST", i, !0), n.send(t)
                        }
                        qe = Date.now() + 100
                    } catch (e) {
                        console.error(e)
                    }
                }
            } else console.log(e)
        }
        "undefined" != typeof window && (t().remoteFetching = !1, t().report.subscribe((function(e) {
            if ("Script error." === e.message && window.pokiLastCatch) {
                var i = window.pokiLastCatch;
                window.pokiLastCatch = null, t().report(i)
            } else $e(e)
        })), window.onunhandledrejection = function(e) {
            Ke(e.reason) ? t().report(e.reason) : $e({
                name: "unhandledrejection",
                message: JSON.stringify(e.reason)
            })
        });
        var et = function() {
            return (et = Object.assign || function(e) {
                for (var t, i = 1, n = arguments.length; i < n; i++)
                    for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }).apply(this, arguments)
        };
        var tt = new(function() {
            function t() {
                var t = this;
                this.gameStarted = !1, this.SDK = new Ve, this.gameplayStartCounter = 0, this.gameplayStopCounter = 0, this.duringGameplay = !1, this.init = function(e) {
                    return void 0 === e && (e = {}), new Promise((function(i, r) {
                        e && e.adTagUrl && window && (window.__InternalSDK = t.SDK), t.SDK.init(et({
                            onReady: i,
                            onAdblocked: r
                        }, e)), s.sendMessage(n.message.sdkDetails, {
                            version: "2.194.0"
                        })
                    }))
                }, this.initWithVideoHB = function() {
                    return t.init()
                }, this.gameLoadingProgress = function(e) {
                    var t = {};
                    void 0 !== e.percentageDone && (t.percentageDone = Number(e.percentageDone)), void 0 !== e.kbLoaded && (t.kbLoaded = Number(e.kbLoaded)), void 0 !== e.kbTotal && (t.kbTotal = Number(e.kbTotal)), void 0 !== e.fileNameLoaded && (t.fileNameLoaded = String(e.fileNameLoaded)), void 0 !== e.filesLoaded && (t.filesLoaded = Number(e.filesLoaded)), void 0 !== e.filesTotal && (t.filesTotal = Number(e.filesTotal)), c.track(n.tracking.screen.gameLoadingProgress, t)
                }, this.gameLoadingStart = function() {
                    var e, t;
                    c.track(n.tracking.screen.gameLoadingStarted, {
                        now: Math.round(null === (t = null === (e = window.performance) || void 0 === e ? void 0 : e.now) || void 0 === t ? void 0 : t.call(e)) || void 0
                    })
                }, this.gameLoadingFinished = function() {
                    var e, t, i;
                    try {
                        i = performance.getEntriesByType("resource").map((function(e) {
                            return e.transferSize
                        })).reduce((function(e, t) {
                            return e + t
                        })), i += performance.getEntriesByType("navigation")[0].transferSize
                    } catch (e) {}
                    c.track(n.tracking.screen.gameLoadingFinished, {
                        transferSize: i,
                        now: Math.round(null === (t = null === (e = window.performance) || void 0 === e ? void 0 : e.now) || void 0 === t ? void 0 : t.call(e)) || void 0
                    })
                }, this.gameplayStart = function(e) {
                    t.gameplayStartCounter++, t.duringGameplay = !0, t.gameStarted || (t.gameStarted = !0, c.track(n.tracking.screen.firstRound), t.SDK.startStartAdsAfterTimer()), c.track(n.tracking.screen.gameplayStart, et(et({}, e), {
                        playId: t.gameplayStartCounter
                    }))
                }, this.gameInteractive = function() {
                    c.track(n.tracking.screen.gameInteractive)
                }, this.gameplayStop = function(e) {
                    t.gameplayStopCounter++, t.duringGameplay = !1, c.track(n.tracking.screen.gameplayStop, et(et({}, e), {
                        playId: t.gameplayStartCounter,
                        stopId: t.gameplayStopCounter
                    }))
                }, this.roundStart = function(e) {
                    void 0 === e && (e = ""), e = String(e), c.track(n.tracking.screen.roundStart, {
                        identifier: e
                    })
                }, this.roundEnd = function(e) {
                    void 0 === e && (e = ""), e = String(e), c.track(n.tracking.screen.roundEnd, {
                        identifier: e
                    })
                }, this.customEvent = function(e, i, r) {
                    void 0 === r && (r = {}), e && i ? (e = String(e), i = String(i), r = et({}, r), c.track(n.tracking.custom, {
                        eventNoun: e,
                        eventVerb: i,
                        eventData: r
                    })) : t.error("customEvent", "customEvent needs at least a noun and a verb")
                }, this.commercialBreak = function(e) {
                    return new Promise((function(i) {
                        var r = t.gameStarted ? n.ads.position.midroll : n.ads.position.preroll;
                        a.clearAnnotations(), a.setDataAnnotations({
                            opportunityId: Ne(),
                            position: r
                        }), c.track(n.tracking.screen.commercialBreak), t.SDK.requestAd({
                            position: r,
                            onFinish: i,
                            onStart: e
                        })
                    }))
                }, this.rewardedBreak = function(e) {
                    return new Promise((function(i) {
                        var r = n.ads.position.rewarded;
                        a.clearAnnotations(), a.setDataAnnotations({
                            opportunityId: Ne(),
                            position: r
                        }), c.track(n.tracking.screen.rewardedBreak), t.SDK.requestAd({
                            position: r,
                            onFinish: function(e) {
                                e.length > 0 ? i(e[0].rewardAllowed) : i(!1)
                            },
                            onStart: e
                        })
                    }))
                }, this.happyTime = function(e) {
                    void 0 === e && (e = 1), ((e = Number(e)) < 0 || e > 1) && (e = Math.max(0, Math.min(1, e)), t.warning("happyTime", "Intensity should be a value between 0 and 1, adjusted to " + e)), c.track(n.tracking.screen.happyTime, {
                        intensity: e
                    })
                }, this.muteAd = function() {
                    t.SDK.muteAd()
                }, this.setPlayerAge = function(e) {
                    e && t.SDK.setPlayerAge(e)
                }, this.togglePlayerAdvertisingConsent = function(e) {
                    c.track(n.tracking.togglePlayerAdvertisingConsent, {
                        didConsent: e
                    }), t.SDK.togglePlayerAdvertisingConsent(e), s.sendMessage(n.message.toggleProgrammaticAds, {
                        enabled: t.SDK.getProgrammaticAdsEnabled()
                    })
                }, this.displayAd = function(e, i) {
                    a.clearAnnotations();
                    var r = Ne();
                    c.track(n.tracking.screen.displayAd, {
                        size: i,
                        opportunityId: r,
                        duringGameplay: t.duringGameplay
                    }), t.SDK.displayAd(e, i, r, (function() {
                        return t.duringGameplay
                    }))
                }, this.logError = function(t) {
                    Ke(t) ? e.report(t) : $e({
                        name: "logError",
                        message: JSON.stringify(t)
                    })
                }, this.sendHighscore = function() {}, this.setDebugTouchOverlayController = function(e) {
                    t.SDK.debugTouchOverlayController = e
                }, this.getLeaderboard = function() {
                    return Promise.resolve([])
                }, this.warning = function(e, t) {
                    console.warn("PokiSDK." + e + ": " + t)
                }, this.error = function(e, t) {
                    console.error("PokiSDK." + e + ": " + t)
                }
            }
            return t.prototype.setDebug = function(e) {
                void 0 === e && (e = !0), this.SDK.setDebug(e)
            }, t.prototype.disableProgrammatic = function() {
                this.SDK.disableProgrammatic()
            }, t.prototype.toggleNonPersonalized = function(e) {
                void 0 === e && (e = !1), this.SDK.toggleNonPersonalized(e)
            }, t.prototype.setConsentString = function(e) {
                this.SDK.setConsentString(e)
            }, t.prototype.destroyAd = function(e) {
                this.SDK.destroyAd(e)
            }, t.prototype.setVolume = function(e) {
                this.SDK.setVolume(e)
            }, t
        }());
        for (var it in tt) window.PokiSDK[it] = tt[it]
    })()
})();