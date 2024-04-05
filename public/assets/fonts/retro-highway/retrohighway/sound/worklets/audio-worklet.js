AudioWorkletProcessor.prototype._01 = function() {
    this._11 = true;
    this.port.onmessage = (_21) => {
        if (_21.data === "kill") this._11 = false;
    };
};
class _31 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }];
    }
    constructor() {
        super();
        this._01();
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const bypass = parameters.bypass;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _51[_81][c][_71] = _61[_71];
            }
        }
        return this._11;
    }
}
class _91 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1,
            minValue: 0
        }];
    }
    constructor() {
        super();
        this._01();
    }
    process(_41, _51, parameters) {
        const _a1 = _41[0];
        const _b1 = _41[1];
        const output = _51[0];
        const gain = parameters.gain;
        for (let c = 0; c < _b1.length; ++c) {
            const _61 = _b1[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) _c1[_71] = _61[_71];
        }
        for (let c = 0; c < _a1.length; ++c) {
            const _61 = _a1[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                _c1[_71] += _61[_71] * _d1;
            }
        }
        return this._11;
    }
}
registerProcessor("audio-bus-input", _31);
registerProcessor("audio-bus-output", _91);
class _e1 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 0.0
        }, {
            name: "factor",
            automationRate: "a-rate",
            defaultValue: 20,
            minValue: 1,
            maxValue: 100
        }, {
            name: "resolution",
            automationRate: "a-rate",
            defaultValue: 8,
            minValue: 2,
            maxValue: 16
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.8,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    static _f1 = [undefined, undefined, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._i1 = new Float32Array(_h1);
        this._j1 = new Uint32Array(_h1);
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const gain = parameters.gain;
        const factor = parameters.factor;
        const resolution = parameters.resolution;
        const mix = parameters.mix;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                _c1[_71] = _61[_71];
                if (this._j1[c] === 0) this._i1[c] = _61[_71];
                const _k1 = (factor[_71] !== undefined) ? factor[_71] : factor[0];
                ++this._j1[c];
                this._j1[c] %= _k1;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0.0) {
                    continue;
                }
                let _l1 = this._i1[c];
                const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                _l1 *= _d1;
                _l1 = Math.max(Math.min(_l1,
                    1.0), -1.0);
                const _m1 = (resolution[_71] !== undefined) ? resolution[_71] : resolution[0];
                const max = (_l1 > 0.0) ? _e1._f1[_m1] - 1 : _e1._f1[_m1];
                _l1 = Math.round(_l1 * max) / max;
                const _n1 = (mix[_71] !== undefined) ? mix[_71] : mix[0];
                _c1[_71] *= (1.0 - _n1);
                _c1[_71] += (_l1 * _n1);
            }
        }
        return this._11;
    }
}
registerProcessor("bitcrusher-processor", _e1);
class _o1 {
    constructor(_p1 = 1e-3) {
        this.setTime(_p1);
    }
    setTime(_p1) {
        this._q1 = Math.exp(-1 / (_p1 * sampleRate));
    }
    process(_r1, _s1) {
        return _r1 + this._q1 * (_s1 - _r1);
    }
}
class _t1 {
    constructor(_u1, _v1) {
        this._w1 = new _o1(_u1);
        this._x1 = new _o1(_v1);
        this._y1 = _u1;
        this._z1 = _v1;
    }
    _A1(_p1) {
        if (_p1 === this._y1) return;
        this._w1.setTime(_p1);
        this._y1 = _p1;
    }
    _B1(_p1) {
        if (_p1 === this._z1) return;
        this._x1.setTime(_p1);
        this._z1 = _p1;
    }
    process(_r1, _s1) {
        if (_r1 > _s1) return this._w1.process(_r1, _s1);
        else return this._x1.process(_r1, _s1);
    }
}
class _C1 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "ingain",
            automationRate: "a-rate",
            defaultValue: 1,
            minValue: 0
        }, {
            name: "threshold",
            automationRate: "a-rate",
            defaultValue: 0.125,
            minValue: 1e-3,
            maxValue: 1
        }, {
            name: "ratio",
            automationRate: "a-rate",
            defaultValue: 4,
            minValue: 1
        }, {
            name: "attack",
            automationRate: "a-rate",
            defaultValue: 0.05,
            minValue: 1e-3,
            maxValue: 1e-1
        }, {
            name: "release",
            automationRate: "a-rate",
            defaultValue: 0.25,
            minValue: 1e-2,
            maxValue: 1
        }, {
            name: "outgain",
            automationRate: "a-rate",
            defaultValue: 1,
            minValue: 0
        }];
    }
    constructor(_D1) {
        super();
        this._01();
        const _w1 = _C1.parameterDescriptors.find(_E1 => _E1.name === "attack");
        const _x1 = _C1.parameterDescriptors.find(_E1 => _E1.name === "release");
        this._F1 = new _t1(_w1.defaultValue, _x1.defaultValue);
        this._G1 = 0;
    }
    process(_H1, _I1, _J1) {
        const input = _H1[0];
        const output = _I1[0];
        const bypass = _J1.bypass;
        const ingain = _J1.ingain;
        const outgain = _J1.outgain;
        const threshold = _J1.threshold;
        const ratio = _J1.ratio;
        const attack = _J1.attack;
        const release = _J1.release;
        if (input.length === 0) return this._11;
        for (let _71 = 0; _71 < input[0].length; ++_71) {
            let frame = input.map(_K1 => _K1[_71]);
            output.forEach((_K1, _L1) => {
                _K1[_71] = frame[_L1];
            });
            const _M1 = (ingain[_71] !== undefined) ? ingain[_71] : ingain[0];
            frame = frame.map(_N1 => _N1 *= _M1);
            const rect = frame.map(_N1 => Math.abs(_N1));
            const max = Math.max(...rect);
            const _O1 = _P1(max);
            const _Q1 = (threshold[_71] !== undefined) ? threshold[_71] : threshold[0];
            const _R1 = _P1(_Q1);
            const _S1 = Math.max(0, _O1 - _R1);
            const _w1 = (attack[_71] !== undefined) ? attack[_71] : attack[0];
            const _x1 = (release[_71] !== undefined) ? release[_71] : release[0];
            this._F1._A1(_w1);
            this._F1._B1(_x1);
            this._G1 = this._F1.process(_S1, this._G1);
            const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
            if (_81 > 0) continue;
            const _m1 = (ratio[_71] !== undefined) ? ratio[_71] : ratio[0];
            const _T1 = (this._G1 / _m1) - this._G1;
            const _d1 = _U1(_T1);
            frame = frame.map(_N1 => _N1 *= _d1);
            const _V1 = (outgain[_71] !== undefined) ? outgain[_71] : outgain[0];
            frame = frame.map(_N1 => _N1 *= _V1);
            output.forEach((_K1, _L1) => {
                _K1[_71] = frame[_L1];
            });
        }
        return this._11;
    }
}

function _P1(_W1) {
    return 20 * Math.log10(_W1);
}

function _U1(_W1) {
    return Math.pow(10, _W1 / 20);
}
registerProcessor("compressor-processor", _C1);
class _X1 extends AudioWorkletProcessor {
    static _Y1 = 5.0;
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "time",
            automationRate: "a-rate",
            defaultValue: 0.2,
            minValue: 0.0,
            maxValue: _X1._Y1
        }, {
            name: "feedback",
            automationRate: "a-rate",
            defaultValue: 0.5,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.35,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        const _Z1 = (_X1._Y1 * sampleRate) + 1;
        this.buffer = new Array(_h1);
        this.__1 = new Uint32Array(_h1);
        for (let c = 0; c < _h1; ++c) this.buffer[c] = new Float32Array(_Z1);
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const time = parameters.time;
        const feedback = parameters.feedback;
        const mix = parameters.mix;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                _c1[_71] = _61[_71];
                const _Q1 = (time[_71] !== undefined) ? time[_71] : time[0];
                const _02 = this._12(c, _Q1);
                const _k1 = (feedback[_71] !== undefined) ? feedback[_71] : feedback[0];
                const _22 = _61[_71] + (_02 * _k1);
                this.write(c, _22);
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0.0) {
                    continue;
                }
                const _n1 = (mix[_71] !== undefined) ? mix[_71] : mix[0];
                _c1[_71] *= (1 - _n1);
                _c1[_71] += (_02 * _n1);
            }
        }
        return this._11;
    }
    _12(_32, _p1) {
        const _42 = _p1 * sampleRate;
        let _52 = (this.__1[_32] - ~~_42);
        let _62 = (_52 - 1);
        while (_52 < 0) _52 += this.buffer[_32].length;
        while (_62 < 0) _62 += this.buffer[_32].length;
        const frac = _42 - ~~_42;
        const _72 = this.buffer[_32][_52];
        const _82 = this.buffer[_32][_62];
        return _72 + (_82 - _72) * frac;
    }
    write(_32, _92) {
        ++this.__1[_32];
        this.__1[_32] %= this.buffer[_32].length;
        this.buffer[_32][this.__1[_32]] = _92;
    }
}
registerProcessor("delay-processor", _X1);
class _a2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [];
    }
    constructor() {
        super();
        this._01();
    }
    process(_b2, _c2, _d2) {
        const input = _b2[0];
        const _e2 = _c2[0];
        const _f2 = _c2[1];
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _g2 = _e2[c];
            const _h2 = _f2[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                _g2[_71] = _61[_71];
                _h2[_71] = _61[_71];
            }
        }
        return this._11;
    }
}
class _i2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }];
    }
    constructor() {
        super();
        this._01();
    }
    process(_b2, _c2, _d2) {
        const _a1 = _b2[0];
        const _b1 = _b2[1];
        const output = _c2[0];
        const bypass = _d2.bypass;
        for (let c = 0; c < _b1.length; ++c) {
            const _j2 = _a1[c];
            const _k2 = _b1[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _j2.length; ++_71) {
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0) {
                    _c1[_71] = _k2[_71];
                } else {
                    _c1[_71] = _j2[_71];
                }
            }
        }
        return this._11;
    }
}
registerProcessor("eq-input", _a2);
registerProcessor("eq-output", _i2);
class _l2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 0.5,
            minValue: 0.0
        }];
    }
    constructor() {
        super();
        this._01();
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const gain = parameters.gain;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                _c1[_71] = _61[_71];
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0.0) {
                    continue;
                }
                const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                _c1[_71] *= _d1;
            }
        }
        return this._11;
    }
}
registerProcessor("gain-processor", _l2);
class _m2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _n2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "freq",
            automationRate: "a-rate",
            defaultValue: Math.min(5000.0, _n2),
            minValue: 10.0,
            maxValue: _n2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 1.0,
            maxValue: 100.0
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1e-2,
            minValue: 1e-6
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._o2 = 0;
        this._p2 = 0;
        this._q2 = 0;
        this._r2 = 0;
        this._s2 = 0;
        this._t2 = new Float32Array(_h1);
        this._u2 = new Float32Array(_h1);
        this._v2 = new Float32Array(_h1);
        this._w2 = new Float32Array(_h1);
        this._x2 = -1;
        this._y2 = -1;
        this._z2 = -1;
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const freq = parameters.freq;
        const q = parameters.q;
        const gain = parameters.gain;
        const _A2 = (freq.length === 1 && q.length === 1 && gain.length === 1);
        if (_A2) this._B2(freq[0], q[0], gain[0]);
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                if (_A2 === false) {
                    const _k1 = (freq[_71] !== undefined) ? freq[_71] : freq[0];
                    const _C2 = (q[_71] !== undefined) ? q[_71] : q[0];
                    const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                    this._B2(_k1, _C2, _d1);
                }
                const _D2 = this._q2 * _61[_71] + this._r2 * this._t2[c] + this._s2 * this._u2[c] - this._o2 * this._v2[c] - this._p2 * this._w2[c];
                this._u2[c] = this._t2[c];
                this._t2[c] = _61[_71];
                this._w2[c] = this._v2[c];
                this._v2[c] = _D2;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _c1[_71] = (_81 > 0) ? _61[_71] : _D2;
            }
        }
        return this._11;
    }
    _B2(_E2, _F2, _G2) {
        if (_E2 === this._x2 && _F2 === this._y2 && _G2 === this._z2) return;
        const _H2 = 2 * Math.PI * _E2 / sampleRate;
        const _I2 = Math.cos(_H2);
        const _J2 = Math.sqrt(_G2);
        const _K2 = _J2 + 1;
        const _L2 = _J2 - 1;
        const _M2 = _K2 * _I2;
        const _N2 = _L2 * _I2;
        const _O2 = _K2 - _N2;
        const _P2 = _K2 + _N2;
        const alpha = Math.sin(_H2) / (2 * _F2);
        const _Q2 = (2 * Math.sqrt(_J2) * alpha);
        const _R2 = _O2 + _Q2;
        const _o2 = 2 * (_L2 - _M2);
        const _p2 = _O2 - _Q2;
        const _q2 = _J2 * (_P2 + _Q2);
        const _r2 = -2 * _J2 * (_L2 + _M2);
        const _s2 = _J2 * (_P2 - _Q2);
        this._o2 = _o2 / _R2;
        this._p2 = _p2 / _R2;
        this._q2 = _q2 / _R2;
        this._r2 = _r2 / _R2;
        this._s2 = _s2 / _R2;
        this._x2 = _E2;
        this._y2 = _F2;
        this._z2 = _G2;
    }
}
registerProcessor("hi-shelf-processor", _m2);
class _S2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _T2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "cutoff",
            automationRate: "a-rate",
            defaultValue: Math.min(1500.0, _T2),
            minValue: 10.0,
            maxValue: _T2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.5,
            minValue: 1.0,
            maxValue: 100.0
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._o2 = 0;
        this._p2 = 0;
        this._q2 = 0;
        this._r2 = 0;
        this._s2 = 0;
        this._t2 = new Float32Array(_h1);
        this._u2 = new Float32Array(_h1);
        this._v2 = new Float32Array(_h1);
        this._w2 = new Float32Array(_h1);
        this._U2 = -1;
        this._y2 = -1;
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const cutoff = parameters.cutoff;
        const q = parameters.q;
        const _A2 = (cutoff.length === 1 && q.length === 1);
        if (_A2) this._B2(cutoff[0], q[0]);
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                if (_A2 === false) {
                    const c = (cutoff[_71] !== undefined) ? cutoff[_71] : cutoff[0];
                    const _C2 = (q[_71] !== undefined) ? q[_71] : q[0];
                    this._B2(c, _C2);
                }
                const _D2 = this._q2 * _61[_71] + this._r2 * this._t2[c] + this._s2 * this._u2[c] - this._o2 * this._v2[c] - this._p2 * this._w2[c];
                this._u2[c] = this._t2[c];
                this._t2[c] = _61[_71];
                this._w2[c] = this._v2[c];
                this._v2[c] = _D2;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _c1[_71] = (_81 > 0) ? _61[_71] : _D2;
            }
        }
        return this._11;
    }
    _B2(_V2, _F2) {
        if (_V2 === this._U2 && _F2 === this._y2) return;
        const _H2 = 2 * Math.PI * _V2 / sampleRate;
        const alpha = Math.sin(_H2) / (2 * _F2);
        const _I2 = Math.cos(_H2);
        const _R2 = 1 + alpha;
        const _o2 = -2 * _I2;
        const _p2 = 1 - alpha;
        const _q2 = (1 + _I2) / 2;
        const _r2 = -1 - _I2;
        const _s2 = (1 + _I2) / 2;
        this._o2 = _o2 / _R2;
        this._p2 = _p2 / _R2;
        this._q2 = _q2 / _R2;
        this._r2 = _r2 / _R2;
        this._s2 = _s2 / _R2;
        this._U2 = _V2;
        this._y2 = _F2;
    }
}
registerProcessor("hpf2-processor", _S2);
class _W2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _n2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "freq",
            automationRate: "a-rate",
            defaultValue: Math.min(500.0, _n2),
            minValue: 10.0,
            maxValue: _n2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 1.0,
            maxValue: 100.0
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1e-2,
            minValue: 1e-6
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._o2 = 0;
        this._p2 = 0;
        this._q2 = 0;
        this._r2 = 0;
        this._s2 = 0;
        this._t2 = new Float32Array(_h1);
        this._u2 = new Float32Array(_h1);
        this._v2 = new Float32Array(_h1);
        this._w2 = new Float32Array(_h1);
        this._x2 = -1;
        this._y2 = -1;
        this._z2 = -1;
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const freq = parameters.freq;
        const q = parameters.q;
        const gain = parameters.gain;
        const _A2 = (freq.length === 1 && q.length === 1 && gain.length === 1);
        if (_A2) this._B2(freq[0], q[0], gain[0]);
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                if (_A2 === false) {
                    const _k1 = (freq[_71] !== undefined) ? freq[_71] : freq[0];
                    const _C2 = (q[_71] !== undefined) ? q[_71] : q[0];
                    const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                    this._B2(_k1, _C2, _d1);
                }
                const _D2 = this._q2 * _61[_71] + this._r2 * this._t2[c] + this._s2 * this._u2[c] - this._o2 * this._v2[c] - this._p2 * this._w2[c];
                this._u2[c] = this._t2[c];
                this._t2[c] = _61[_71];
                this._w2[c] = this._v2[c];
                this._v2[c] = _D2;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _c1[_71] = (_81 > 0) ? _61[_71] : _D2;
            }
        }
        return this._11;
    }
    _B2(_E2, _F2, _G2) {
        if (_E2 === this._x2 && _F2 === this._y2 && _G2 === this._z2) return;
        const _H2 = 2 * Math.PI * _E2 / sampleRate;
        const _I2 = Math.cos(_H2);
        const _J2 = Math.sqrt(_G2);
        const _K2 = _J2 + 1;
        const _L2 = _J2 - 1;
        const _M2 = _K2 * _I2;
        const _N2 = _L2 * _I2;
        const _O2 = _K2 - _N2;
        const _P2 = _K2 + _N2;
        const alpha = Math.sin(_H2) / (2 * _F2);
        const _Q2 = (2 * Math.sqrt(_J2) * alpha);
        const _R2 = _P2 + _Q2;
        const _o2 = -2 * (_L2 + _M2);
        const _p2 = _P2 - _Q2;
        const _q2 = _J2 * (_O2 + _Q2);
        const _r2 = 2 * _J2 * (_L2 - _M2);
        const _s2 = _J2 * (_O2 - _Q2);
        this._o2 = _o2 / _R2;
        this._p2 = _p2 / _R2;
        this._q2 = _q2 / _R2;
        this._r2 = _r2 / _R2;
        this._s2 = _s2 / _R2;
        this._x2 = _E2;
        this._y2 = _F2;
        this._z2 = _G2;
    }
}
registerProcessor("lo-shelf-processor", _W2);
class _X2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _T2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "cutoff",
            automationRate: "a-rate",
            defaultValue: Math.min(500.0, _T2),
            minValue: 10.0,
            maxValue: _T2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.5,
            minValue: 1.0,
            maxValue: 100.0
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._o2 = 0;
        this._p2 = 0;
        this._q2 = 0;
        this._r2 = 0;
        this._s2 = 0;
        this._t2 = new Float32Array(_h1);
        this._u2 = new Float32Array(_h1);
        this._v2 = new Float32Array(_h1);
        this._w2 = new Float32Array(_h1);
        this._U2 = -1;
        this._y2 = -1;
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const cutoff = parameters.cutoff;
        const q = parameters.q;
        const _A2 = (cutoff.length === 1 && q.length === 1);
        if (_A2) this._B2(cutoff[0], q[0]);
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                if (_A2 === false) {
                    const c = (cutoff[_71] !== undefined) ? cutoff[_71] : cutoff[0];
                    const _C2 = (q[_71] !== undefined) ? q[_71] : q[0];
                    this._B2(c, _C2);
                }
                const _D2 = this._q2 * _61[_71] + this._r2 * this._t2[c] + this._s2 * this._u2[c] - this._o2 * this._v2[c] - this._p2 * this._w2[c];
                this._u2[c] = this._t2[c];
                this._t2[c] = _61[_71];
                this._w2[c] = this._v2[c];
                this._v2[c] = _D2;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _c1[_71] = (_81 > 0) ? _61[_71] : _D2;
            }
        }
        return this._11;
    }
    _B2(_V2, _F2) {
        if (_V2 === this._U2 && _F2 === this._y2) return;
        const _H2 = 2 * Math.PI * _V2 / sampleRate;
        const alpha = Math.sin(_H2) / (2 * _F2);
        const _I2 = Math.cos(_H2);
        const _R2 = 1 + alpha;
        const _o2 = -2 * _I2;
        const _p2 = 1 - alpha;
        const _q2 = (1 - _I2) / 2;
        const _r2 = 1 - _I2;
        const _s2 = (1 - _I2) / 2;
        this._o2 = _o2 / _R2;
        this._p2 = _p2 / _R2;
        this._q2 = _q2 / _R2;
        this._r2 = _r2 / _R2;
        this._s2 = _s2 / _R2;
        this._U2 = _V2;
        this._y2 = _F2;
    }
}
registerProcessor("lpf2-processor", _X2);
class _Y2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _n2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "freq",
            automationRate: "a-rate",
            defaultValue: Math.min(1500.0, _n2),
            minValue: 10.0,
            maxValue: _n2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 1.0,
            maxValue: 100.0
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1e-2,
            minValue: 1e-6
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._o2 = 0;
        this._p2 = 0;
        this._q2 = 0;
        this._r2 = 0;
        this._s2 = 0;
        this._t2 = new Float32Array(_h1);
        this._u2 = new Float32Array(_h1);
        this._v2 = new Float32Array(_h1);
        this._w2 = new Float32Array(_h1);
        this._x2 = -1;
        this._y2 = -1;
        this._z2 = -1;
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const freq = parameters.freq;
        const q = parameters.q;
        const gain = parameters.gain;
        const _A2 = (freq.length === 1 && q.length === 1 && gain.length === 1);
        if (_A2) this._B2(freq[0], q[0], gain[0]);
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                if (_A2 === false) {
                    const _k1 = (freq[_71] !== undefined) ? freq[_71] : freq[0];
                    const _C2 = (q[_71] !== undefined) ? q[_71] : q[0];
                    const _d1 = (gain[_71] !== undefined) ? gain[_71] : gain[0];
                    this._B2(_k1, _C2, _d1);
                }
                const _D2 = this._q2 * _61[_71] + this._r2 * this._t2[c] + this._s2 * this._u2[c] - this._o2 * this._v2[c] - this._p2 * this._w2[c];
                this._u2[c] = this._t2[c];
                this._t2[c] = _61[_71];
                this._w2[c] = this._v2[c];
                this._v2[c] = _D2;
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                _c1[_71] = (_81 > 0) ? _61[_71] : _D2;
            }
        }
        return this._11;
    }
    _B2(_E2, _F2, _G2) {
        if (_E2 === this._x2 && _F2 === this._y2 && _G2 === this._z2) return;
        const _H2 = 2 * Math.PI * _E2 / sampleRate;
        const _I2 = Math.cos(_H2);
        const _J2 = Math.sqrt(_G2);
        const alpha = Math.sin(_H2) / (2 * _F2);
        const _Z2 = alpha / _J2;
        const __2 = alpha * _J2;
        const _R2 = 1 + _Z2;
        const _o2 = -2 * _I2;
        const _p2 = 1 - _Z2;
        const _q2 = 1 + __2;
        const _r2 = _o2;
        const _s2 = 1 - __2;
        this._o2 = _o2 / _R2;
        this._p2 = _p2 / _R2;
        this._q2 = _q2 / _R2;
        this._r2 = _r2 / _R2;
        this._s2 = _s2 / _R2;
        this._x2 = _E2;
        this._y2 = _F2;
        this._z2 = _G2;
    }
}
registerProcessor("peak-eq-processor", _Y2);
class _03 {
    constructor(_13) {
        this._23 = 0;
        this._33 = 0;
        this.feedback = 0;
        this._43 = 0;
        this.buffer = new Float32Array(_13);
        this._53 = 0;
    }
    process(_92) {
        const out = this.buffer[this._53];
        this._43 = (this._43 * this._23) + (out * this._33);
        this.buffer[this._53] = _92 + (this._43 * this.feedback);
        ++this._53;
        this._53 %= this.buffer.length;
        return out;
    }
    _63(_73) {
        this.feedback = Math.min(Math.max(0, _73), 1);
    }
    _83(_93) {
        this._23 = Math.min(Math.max(0, _93), 1);
        this._33 = 1 - this._23;
    }
}
class _a3 {
    constructor(_13) {
        this.feedback = 0;
        this.buffer = new Float32Array(_13);
        this._53 = 0;
    }
    process(_92) {
        const out = this.buffer[this._53];
        this.buffer[this._53] = _92 + (out * this.feedback);
        ++this._53;
        this._53 %= this.buffer.length;
        return (out - _92);
    }
    _63(_73) {
        this.feedback = Math.min(Math.max(0, _73), 1);
    }
}
class _b3 extends AudioWorkletProcessor {
    static _c3 = 8;
    static _d3 = 4;
    static _e3 = 0.015;
    static _f3 = 0.4;
    static _g3 = 0.28;
    static _h3 = 0.7;
    static _i3 = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
    static _j3 = [1139, 1211, 1300, 1379, 1445, 1514, 1580, 1640];
    static _k3 = [556, 441, 341, 225];
    static _l3 = [579, 464, 364, 248];
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "size",
            automationRate: "a-rate",
            defaultValue: 0.7,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "damp",
            automationRate: "a-rate",
            defaultValue: 0.1,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.35,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._m3 = -1;
        this._n3 = -1;
        this._o3 = new Array(_h1);
        this._p3 = new Array(_h1);
        const _q3 = [_b3._i3, _b3._j3];
        const _r3 = [_b3._k3,
            _b3._l3
        ];
        for (let c = 0; c < _h1; ++c) {
            this._o3[c] = new Array(_b3._c3);
            this._p3[c] = new Array(_b3._d3);
            for (let i = 0; i < _b3._c3; ++i) this._o3[c][i] = new _03(_q3[c % _q3.length][i]);
            for (let i = 0; i < _b3._d3; ++i) this._p3[c][i] = new _a3(_r3[c % _r3.length][i]);
        }
        this._s3(0.5);
        this._83(0.5);
        for (let c = 0; c < _h1; ++c)
            for (let i = 0; i < _b3._d3; ++i) this._p3[c][i]._63(0.5);
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const size = parameters.size;
        const damp = parameters.damp;
        const mix = parameters.mix;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                const _71 = (size[_71] !== undefined) ? size[_71] : size[0];
                const _t3 = (damp[_71] !== undefined) ? damp[_71] : damp[0];
                this._s3(_71);
                this._83(_t3);
                _c1[_71] = _61[_71];
                let out = 0;
                const _l1 = _61[_71] * _b3._e3;
                for (let i = 0; i < _b3._c3; ++i) out += this._o3[c][i].process(_l1);
                for (let i = 0; i < _b3._d3; ++i) out = this._p3[c][i].process(out);
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0.0) {
                    continue;
                }
                const _n1 = (mix[_71] !== undefined) ? mix[_71] : mix[0];
                _c1[_71] *= (1 - _n1);
                _c1[_71] += (out * _n1);
            }
        }
        return this._11;
    }
    _s3(_13) {
        if (_13 === this._m3) return;
        const size = (_13 * _b3._g3) + _b3._h3;
        for (let c = 0; c < this._o3.length; ++c)
            for (let i = 0; i < _b3._c3; ++i) this._o3[c][i]._63(size);
        this._m3 = _13;
    }
    _83(_93) {
        if (_93 === this._n3) return;
        const damp = _93 * _b3._f3;
        for (let c = 0; c < this._o3.length; ++c)
            for (let i = 0; i < _b3._c3; ++i) this._o3[c][i]._83(damp);
        this._n3 = _93;
    }
}
registerProcessor("reverb1-processor", _b3);
class _u3 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "rate",
            automationRate: "a-rate",
            defaultValue: 5.0,
            minValue: 0.0,
            maxValue: 20.0
        }, {
            name: "intensity",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "offset",
            automationRate: "a-rate",
            defaultValue: 0.0,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "shape",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 4
        }];
    }
    constructor(_g1) {
        super();
        this._01();
        const _h1 = _g1.outputChannelCount[0];
        this._v3 = new Array(_h1).fill(1.0);
        this._w3 = new Array(_h1).fill(0.0);
        this._x3 = new Array(_h1).fill(_y3._z3._A3);
        this._B3 = new Array(_h1);
        for (let c = 0; c < _h1; ++c) {
            this._B3[c] = new _C3();
            this._B3[c]._D3(sampleRate);
            this._B3[c]._E3(this._v3[c]);
            this._B3[c]._F3(this._x3[c]);
            if (c % 2 === 1) {
                this._B3[c]._G3(this._w3[c]);
            }
        }
    }
    process(_41, _51, parameters) {
        const input = _41[0];
        const output = _51[0];
        const bypass = parameters.bypass;
        const rate = parameters.rate;
        const intensity = parameters.intensity;
        const offset = parameters.offset;
        const shape = parameters.shape;
        for (let c = 0; c < input.length; ++c) {
            const _61 = input[c];
            const _c1 = output[c];
            for (let _71 = 0; _71 < _61.length; ++_71) {
                _c1[_71] = _61[_71];
                const _m1 = (rate[_71] !== undefined) ? rate[_71] : rate[0];
                const _H3 = (offset[_71] !== undefined) ? offset[_71] : offset[0];
                const _I3 = (shape[_71] !== undefined) ? shape[_71] : shape[0];
                this._J3(c, _m1, _H3, _I3);
                const _K3 = this._B3[c]._12();
                const _81 = (bypass[_71] !== undefined) ? bypass[_71] : bypass[0];
                if (_81 > 0.0) {
                    continue;
                }
                const i = (intensity[_71] !== undefined) ? intensity[_71] : intensity[0];
                const out = _61[_71] * _K3 * i;
                _c1[_71] *= (1.0 - i);
                _c1[_71] += out;
            }
        }
        return this._11;
    }
    _J3(_32, _L3, _M3, _N3) {
        if (_L3 !== this._v3[_32]) {
            this._B3[_32]._E3(_L3);
            this._v3[_32] = _L3;
        }
        if (_M3 !== this._w3[_32]) {
            if (_32 % 2 === 1) {
                this._B3[_32]._G3(_M3);
            }
            this._w3[_32] = _M3;
        }
        if (_N3 !== this._x3[_32]) {
            this._B3[_32]._F3(_N3);
            this._x3[_32] = _N3;
        }
    }
}
registerProcessor("tremolo-processor", _u3);

function _y3() {}
_y3._z3 = {
    _A3: 0,
    _O3: 1,
    _P3: 2,
    _Q3: 3,
    _R3: 4,
    _S3: 5
};
_y3._T3 = function(_U3) {
    return 1.0 - _U3;
};
_y3._V3 = function(_U3) {
    return _U3;
};
_y3._W3 = function(_U3) {
    return 0.5 * (Math.sin((_U3 * 2.0 * Math.PI) - (Math.PI / 2.0)) + 1.0);
};
_y3._X3 = function(_U3) {
    if (_U3 < 0.5) {
        return 0.0;
    }
    return 1.0;
};
_y3._Y3 = function(_U3) {
    if (_U3 < 0.5) {
        return 2.0 * _U3;
    }
    return 2.0 - (2.0 * _U3);
};
_y3._Z3 = [_y3._T3, _y3._V3, _y3._W3, _y3._X3, _y3._Y3];
__3._04 = 512;
__3._14 = 1.0 / __3._04;

function __3(_24) {
    this.data = new Float32Array(__3._04);
    for (let i = 0; i < __3._04; ++i) {
        this.data[i] = _24(i * __3._14);
    }
}
__3.prototype._12 = function(_U3) {
    _U3 = Math.max(0.0, _U3);
    _U3 = Math.min(_U3, 1.0);
    const _34 = _U3 * __3._04;
    const _44 = ~~_34;
    const _54 = _34 - _44;
    let _52 = _44;
    let _62 = _52 + 1;
    if (_52 >= __3._04) {
        _52 -= __3._04;
    }
    if (_62 >= __3._04) {
        _62 -= __3._04;
    }
    const _72 = this.data[_52];
    const _82 = this.data[_62];
    return _72 + (_82 - _72) * _54;
};
_C3._64 = [];
_C3._74 = false;
_C3._84 = 0.0;
_C3._n2 = 20.0;

function _C3() {
    this._94 = 48000;
    this.shape = _y3._z3._P3;
    this.freq = 1.0;
    this._a4 = 0.0;
    this._14 = 0.0;
    this._b4 = 0.0;
    if (_C3._74 == true) {
        return;
    }
    for (let i = 0; i < _y3._z3._S3; ++i) {
        _C3._64[i] = new __3(_y3._Z3[i]);
    }
    _C3._74 = true;
}
_C3._c4 = function() {
    return (_C3._74 == true);
};
_C3.prototype._D3 = function(_d4) {
    this._94 = _d4;
    this._e4();
};
_C3.prototype._E3 = function(_E2) {
    _E2 = Math.max(_C3._84, _E2);
    _E2 = Math.min(_E2,
        _C3._n2);
    this.freq = _E2;
    this._e4();
};
_C3.prototype._G3 = function(_M3) {
    _M3 = Math.max(0.0, _M3);
    _M3 = Math.min(_M3, 1.0);
    const _f4 = _M3 - this._b4;
    this._b4 = _M3;
    this._a4 += _f4;
    while (this._a4 >= 1.0) {
        this._a4 -= 1.0;
    }
    while (this._a4 < 0.0) {
        this._a4 += 1.0;
    }
};
_C3.prototype._F3 = function(_N3) {
    _N3 = Math.max(0, _N3);
    _N3 = Math.min(_N3, _y3._z3._S3 - 1);
    this.shape = _N3;
};
_C3.prototype._12 = function() {
    const result = _C3._64[this.shape]._12(this._a4);
    this._a4 += this._14;
    while (this._a4 >= 1.0) {
        this._a4 -= 1.0;
    }
    return result;
};
_C3.prototype._e4 = function() {
    this._14 = this.freq / this._94;
};