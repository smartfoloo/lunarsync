(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.i = function (value) {
        return value;
    };
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module['default'];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 46);
}({
    46: function (module, exports, __webpack_require__) {
        window.pokiGameTracker = 'UA-68704721-10';
        var gaWhitelist = [
            { category: 'rewarded_video' },
            { category: 'midroll' },
            {
                category: 'promotion',
                action: 'app_impression'
            },
            {
                category: 'promotion',
                action: 'app_click_from'
            },
            {
                category: 'promotion',
                action: 'app_click_to'
            }
        ];
        window.analytics = {
            init: function init() {
                var _this = this;
                this.track('technical_performance', 'version', "9.0.0", 1536236337426);
                window.addEventListener('error', function (error) {
                    _this.track('technical_performance', 'javascript_error', error.filename + '@l' + error.lineno + 'c' + error.colno + ': ' + error.message);
                });
            },
            track: function track(category, action, label, value, skipAnalytics) {
                if (false) {
                    console.log('TRACK: ', category, action || '', label || '', value || 0);
                    return;
                }
                var value = parseFloat(value);
                if (isNaN(value)) {
                    value = undefined;
                }
                if (!skipAnalytics) {
                    var track = false;
                    gaWhitelist.forEach(function (evt) {
                        if (evt.category === category && (!evt.action || evt.action === action)) {
                            track = true;
                        }
                    });
                    if (track) {
                        POKI_ANALYTICS.forceFullAnalytics();
                        POKI_ANALYTICS.valueHit(category, action, label, value);
                    }
                }
                POKI_TRACKER.track(poki.tracking.custom, {
                    category: category ? category.toString() : '',
                    action: action ? action.toString() : '',
                    label: label ? label.toString() : '',
                    value: value
                });
            },
            setDimension: function setDimension(dimension, value) {
                if (false) {
                    console.log('SETTING DIMENSION: ', dimension, value);
                    return;
                }
                POKI_ANALYTICS.setDimension(dimension, value);
            }
        };
        analytics.init();
    }
}));