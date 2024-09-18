var Movement = pc.createScript("movement");
Movement.attributes.add("speed", {
    type: "number",
    default: .1,
    precision: 2,
    description: "Controls the movement speed"
}), Movement.attributes.add("max_speed", {
    type: "number",
    default: .1,
    precision: 2
}), Movement.attributes.add("rot_speed", {
    type: "number",
    default: 50,
    precision: 2,
    description: "Controls the movement rotation speed"
}), Movement.attributes.add("max_rot_speed", {
    type: "number",
    default: .1,
    precision: 2
}), Movement.attributes.add("allow_control", {
    type: "boolean",
    default: !0
}), Movement.attributes.add("particle_system", {
    type: "entity"
}), Movement.attributes.add("head", {
    type: "entity"
}), Movement.attributes.add("flag", {
    type: "entity"
}), Movement.attributes.add("team", {
    type: "number",
    enum: [{
        1: "1"
    }, {
        2: "2"
    }]
}), Movement.prototype.initialize = function() {
    GameManager.instance.cars.push(this.entity), this.force = new pc.Vec3, this.rot = new pc.Vec3, this.start_pos = this.entity.getPosition().clone(), this.start_rot = this.entity.getRotation().clone(), this.lerp_force = 0, this.c_left = !1, this.c_right = !1, this.c_up = !1, this.c_down = !1, this.force = new pc.Vec3, this.entity.enabled = !1
}, Movement.prototype.resetPosition = function(t) {
    this.head.enabled = !1, this.flag.enabled = !1, this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO, this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO, this.entity.rigidbody.teleport(this.start_pos, this.start_rot), this.flag.enabled = !0, this.head.enabled = !0
}, Movement.prototype.update = function(t) {
    this.force.x = 0, this.force.y = 0, this.force.z = 0, this.rot.y = 0, this.allow_control && (this.c_left && (this.rot.y = this.rot_speed * t), this.c_right && (this.rot.y = -this.rot_speed * t), this.c_up && (this.force = this.entity.right.scale(-this.speed * t)), this.c_down && (this.force = this.entity.right.scale(this.speed * t), this.c_up || (this.c_left && (this.rot.y = -this.rot_speed * t), this.c_right && (this.rot.y = this.rot_speed * t)))), this.entity.rigidbody.angularVelocity.length() > 1 ? this.particle_system.particlesystem.play() : this.particle_system.particlesystem.stop(), this.force.y = 0, this.entity.sound.slot("drift").volume = Math.max(0, .02 * Math.abs(this.entity.rigidbody.angularVelocity.y) - .01), this.lerp_force = pc.math.lerp(this.lerp_force, (this.c_up || this.c_down) && this.allow_control ? 1 : 0, 4 * t), this.entity.sound.slot("motor").volume = Math.max(0, .3 * this.lerp_force - .01), this.entity.sound.slot("motor").pitch = Math.max(0, .5 * this.lerp_force - .01), this.entity.rigidbody.linearVelocity.length() < this.max_speed && this.entity.rigidbody.applyImpulse(this.force), this.entity.rigidbody.angularVelocity.length() < this.max_rot_speed && this.entity.rigidbody.applyTorqueImpulse(this.rot), this.entity.rigidbody.angularVelocity = new pc.Vec3(.75 * this.entity.rigidbody.angularVelocity.x, this.entity.rigidbody.angularVelocity.y, .75 * this.entity.rigidbody.angularVelocity.z)
};
var Goal = pc.createScript("goal");
Goal.attributes.add("is_p1", {
    type: "boolean",
    description: "marcar si es arco del player 1"
}), Goal.attributes.add("particle_system", {
    type: "entity"
}), Goal.prototype.initialize = function() {
    this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, Goal.prototype.update = function(t) {}, Goal.prototype.onTriggerEnter = function(t) {
    t.script && t.script.ball && t.script.ball.alive && (this.app.p && PokiSDK.happyTime(1), console.log("goal!"), t.script.ball.alive = !1, this.is_p1 ? GameManager.instance.scoreP2++ : GameManager.instance.scoreP1++, this.particle_system.particlesystem.play(), GameManager.instance.onGoal(), this._timerHandle = pc.timer.add(1, this.onTimerEnd, this))
}, Goal.prototype.onTimerEnd = function() {
    this.particle_system.particlesystem.stop()
};
var Ball = pc.createScript("ball");
Ball.attributes.add("curve_bounce", {
    type: "curve"
}), Ball.prototype.initialize = function() {
    this.last_linear_velocity = 0, this.alive = !0, this.last_bounce = 0, this.last_distort = new pc.Vec3(1, 1, 1)
}, Ball.prototype.update = function(t) {
    var i = Math.abs(this.last_linear_velocity - this.entity.rigidbody.linearVelocity.length());
    if (i > 1) {
        this.entity.sound.volume = .1 * (i - 1), this.entity.sound.pitch = .25 * Math.random() + .75, this.entity.sound.play("bounce");
        this.entity.rigidbody.linearVelocity.clone();
        this.last_bounce = Date.now();
        var e = .1;
        this.last_distort = new pc.Vec3(1.1 - Math.random() * e * 2, 1.1 - Math.random() * e * 2, 1.1 - Math.random() * e * 2)
    }
    var a = this.entity.getLocalScale().clone(),
        l = this.curve_bounce.value((Date.now() - this.last_bounce) / 500);
    a.x = pc.math.lerp(this.last_distort.x, 1, l), a.y = pc.math.lerp(this.last_distort.y, 1, l), a.z = pc.math.lerp(this.last_distort.z, 1, l), this.entity.setLocalScale(a), this.last_linear_velocity = this.entity.rigidbody.linearVelocity.length()
};
var CameraMovement = pc.createScript("cameraMovement");
CameraMovement.prototype.initialize = function() {
    this.interpolation = new pc.Vec3
}, CameraMovement.prototype.update = function(t) {
    this.interpolation.lerp(this.entity.getPosition(), this.start_pos, t), this.entity.setPosition(this.interpolation)
}, CameraMovement.prototype.zoomIn = function() {
    null == this.start_pos && (this.start_pos = this.entity.getPosition().clone()), this.entity.setPosition(this.start_pos.clone().mulScalar(1.1))
};
var GameManager = pc.createScript("gameManager");
GameManager.attributes.add("score_text", {
    type: "entity",
    description: "Texto que muestra el score"
}), GameManager.attributes.add("count_down", {
    type: "entity"
}), GameManager.attributes.add("ball", {
    type: "entity"
}), GameManager.attributes.add("cam", {
    type: "entity"
}), GameManager.attributes.add("cam_menu", {
    type: "entity"
}), GameManager.attributes.add("home_screen", {
    type: "entity"
}), GameManager.attributes.add("skins_screen", {
    type: "entity"
}), GameManager.attributes.add("restart_button", {
    type: "entity"
}), GameManager.attributes.add("home_button", {
    type: "entity"
}), GameManager.attributes.add("menu_cont", {
    type: "entity"
}), GameManager.attributes.add("palco_1", {
    type: "entity"
}), GameManager.attributes.add("palco_2", {
    type: "entity"
}), GameManager.attributes.add("tuto_1", {
    type: "entity"
}), GameManager.attributes.add("tuto_2", {
    type: "entity"
}), GameManager.attributes.add("robot_head", {
    type: "asset"
}), GameManager.attributes.add("skinsP1", {
    type: "asset",
    array: !0
}), GameManager.attributes.add("skinsP2", {
    type: "asset",
    array: !0
}), GameManager.attributes.add("skinsNames", {
    type: "string",
    array: !0
}), GameManager.attributes.add("skinsUnlocked", {
    type: "boolean",
    array: !0
}), GameManager.attributes.add("watch_ad_string", {
    type: "string"
}), GameManager.attributes.add("disable_adBlock_string", {
    type: "string"
}), GameManager.prototype.initialize = function() {
    if (this.progress = window.localStorage.getItem("progress"), this.is_in_gameplay = !1, null != this.progress && (this.skinsUnlocked = JSON.parse(this.progress)), GameManager.instance ? console.error("Instance already created") : (GameManager.instance = this, this.on("destroy", (function() {
            GameManager.instance = null
        }))), this.cam.enabled = !1, this.cars = [], this.palco_1.enabled = !1, this.palco_2.enabled = !1, this.skins_screen.enabled = !1, this.first_time = !0, this.app.p) {
      /*  const a = ["top", "indexOf", "aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==", "hostname", "length", "location", "LnBva2ktZ2RuLmNvbQ==", "href"];
        t = a, e = 430,
            function(e) {
                for (; --e;) t.push(t.shift())
            }(++e);
        const _0xcdc9 = function(t, e) {
            return a[t -= 0]
        };
        ! function checkInit() {
            const t = ["bG9jYWxob3N0", "LnBva2kuY29t", _0xcdc9("0x0")];
            let e = !1;
            const a = window[_0xcdc9("0x7")][_0xcdc9("0x5")];
            for (let s = 0; s < t[_0xcdc9("0x6")]; s++) {
                const i = atob(t[s]);
                if (-1 !== a[_0xcdc9("0x3")](i, a.length - i.length)) {
                    e = !0;
                    break
                }
            }
            if (!e) {
                const t = _0xcdc9("0x4"),
                    e = atob(t);
                window.location[_0xcdc9("0x1")] = e, window[_0xcdc9("0x2")][_0xcdc9("0x7")] !== window[_0xcdc9("0x7")] && (window[_0xcdc9("0x2")][_0xcdc9("0x7")] = window[_0xcdc9("0x7")])
            }
        }()*/
    }
    var t, e;
    this.p1_skin = 0, this.p2_skin = 0
}, GameManager.prototype.update = function() {
    this.app.keyboard.isPressed(pc.KEY_B) && this.app.keyboard.isPressed(pc.KEY_P) && confirm("Are you sure you want to delete the progress?") && (window.localStorage.clear(), window.location.reload())
}, GameManager.prototype.nextSkin = function(t) {
    switch (t) {
        case 1:
            this.p1_skin++, this.p1_skin %= this.skinsP1.length, this.changeSkin(1, this.skinsP1[this.p1_skin]);
            break;
        case 2:
            this.p2_skin++, this.p2_skin %= this.skinsP1.length, this.changeSkin(2, this.skinsP2[this.p2_skin])
    }
}, GameManager.prototype.prevSkin = function(t) {
    switch (t) {
        case 1:
            this.p1_skin--, this.p1_skin = this.p1_skin < 0 ? this.skinsP1.length - 1 : this.p1_skin, this.changeSkin(1, this.skinsP1[this.p1_skin]);
            break;
        case 2:
            this.p2_skin--, this.p2_skin = this.p2_skin < 0 ? this.skinsP2.length - 1 : this.p2_skin, this.changeSkin(2, this.skinsP2[this.p2_skin])
    }
}, GameManager.prototype.changeSkin = function(t, e) {
    var a;
    switch (t) {
        case 1:
            a = this.app.root.findByTag("p1_skin");
            break;
        case 2:
            a = this.app.root.findByTag("p2_skin")
    }
    for (var s = 0; s < a.length; s++) a[s].model.asset = e
}, GameManager.prototype.resetSkin = function(t) {
    var e;
    switch (t) {
        case 1:
            e = this.skinsP1[this.p1_skin];
            break;
        case 2:
            e = this.skinsP2[this.p2_skin]
    }
    this.changeSkin(t, e)
}, GameManager.prototype.resetCars = function() {
    this.cam.enabled = !0, this.cam_menu.enabled = !1;
    for (var t = 0; t < this.cars.length; t++) this.cars[t].script.movement.resetPosition()
}, GameManager.prototype.onGoal = function() {
    this.entity.sound.slot("goal").play();
    for (var t = 0; t < this.cars.length; t++) this.cars[t].script.movement.allow_control = !1;
    this.score_text.element.text = this.scoreP1 + ":" + this.scoreP2, this.scoreP1 < 3 && this.scoreP2 < 3 ? this._timerHandle = pc.timer.add(2, this.onTimerEnd, this) : this._timerHandle = pc.timer.add(2, this.onWinTimer, this), this.app.p && this.is_in_gameplay && (this.is_in_gameplay = !1, PokiSDK.gameplayStop())
}, GameManager.prototype.onWinTimer = function() {
    for (var t = 0; t < this.cars.length; t++) this.cars[t].enabled = !1;
    this.ball.enabled = !1, this.cam.enabled = !1, this.cam_menu.enabled = !1, this.scoreP1 > this.scoreP2 ? this.palco_1.enabled = !0 : this.palco_2.enabled = !0, this._timerHandle = pc.timer.add(4, this.onWinTimerEnd, this)
}, GameManager.prototype.onWinTimerEnd = function() {
    this.palco_1.enabled = !1, this.palco_2.enabled = !1, this.goToHome()
}, GameManager.prototype.onCountDownFinished = function() {
    this.entity.sound.slot("whistle").play();
    for (var t = 0; t < this.cars.length; t++) this.cars[t].script.movement.allow_control = !0
}, GameManager.prototype.onTimerEnd = function() {
    var t = new pc.Vec3(0, 5, 0);
    this.ball.rigidbody.teleport(t, pc.Vec3.ZERO), this.ball.rigidbody.angularVelocity = pc.Vec3.ZERO, this.ball.rigidbody.linearVelocity = pc.Vec3.ZERO, this.ball.script.ball.alive = !0, this.resetCars(), this.count_down.script.countDown.startCountDown(), this.app.p && !this.is_in_gameplay && (this.is_in_gameplay = !0, PokiSDK.gameplayStart())
}, GameManager.prototype.onRestart = function() {
    this.app.p ? (this.last_volume = this.app.systems.sound.volume, this.app.systems.sound.volume = 0, this.app.timeScale = 0, this.is_in_gameplay && (this.is_in_gameplay = !1, PokiSDK.gameplayStop()), PokiSDK.commercialBreak().then((() => {
        this.app.systems.sound.volume = this.last_volume, this.app.timeScale = 1, this.is_in_gameplay || (this.is_in_gameplay = !0, PokiSDK.gameplayStart()), this.resetScene(), this.count_down.script.countDown.startCountDown()
    }))) : (this.app.timeScale = 1, this.resetScene(), this.count_down.script.countDown.startCountDown())
}, GameManager.prototype.onPlay = function() {
    this.app.p && this.first_time ? (this.first_time = !1, this.last_volume = this.app.systems.sound.volume, this.app.systems.sound.volume = 0, this.app.timeScale = 0, PokiSDK.commercialBreak().then((() => {
        this.app.timeScale = 1, this.app.systems.sound.volume = this.last_volume, this.is_in_gameplay || (this.is_in_gameplay = !0, PokiSDK.gameplayStart()), this.onPlay2()
    }))) : (this.app.timeScale = 1, this.onPlay2())
}, GameManager.prototype.onGoToSkins = function() {
    CameraMenu.instance.toSkinScreen(), this.skins_screen.enabled = !0, this.skins_screen.script.skinsScreen.updateScreen(), this.home_screen.enabled = !1
}, GameManager.prototype.onBackFromSkins = function() {
    CameraMenu.instance.toMainMenu(), this.skins_screen.enabled = !1, this.home_screen.enabled = !0
}, GameManager.prototype.onPlay2 = function() {
    this.skins_screen.enabled = !1, this.home_screen.enabled = !1, this.onRestart(), this.tuto_1.script.tutoControls.reset(), this.tuto_2.script.tutoControls.reset()
}, GameManager.prototype.resetScene = function() {
    this.ball.enabled = !0, this.cam.script.cameraMovement.zoomIn(), this.palco_1.enabled = !1, this.palco_2.enabled = !1;
    for (var t = 0; t < this.cars.length; t++) this.cars[t].enabled = !0, this.cars[t].script.movement.allow_control = !1;
    this.count_down.script.countDown.resetCountDown(), this.ball.script.ball.alive = !0, this.restart_button.enabled = !0, this.home_button.enabled = !0, this.menu_cont.enabled = !1, null != this._timerHandle && pc.timer.remove(this._timerHandle), this.scoreP1 = 0, this.scoreP2 = 0, this.score_text.element.text = "0:0";
    var e = new pc.Vec3(0, 5, 0);
    this.ball.rigidbody.teleport(e, pc.Vec3.ZERO), this.ball.rigidbody.angularVelocity = pc.Vec3.ZERO, this.ball.rigidbody.linearVelocity = pc.Vec3.ZERO, this.resetCars()
}, GameManager.prototype.goToHome = function() {
    CameraMenu.instance.toMainMenu(), this.app.p && this.is_in_gameplay && (this.is_in_gameplay = !1, PokiSDK.gameplayStop()), this.count_down.script.countDown.resetCountDown(), this.resetScene(), this.cam.enabled = !1, this.cam_menu.enabled = !0, this.menu_cont.enabled = !0, this.home_screen.enabled = !0, this.restart_button.enabled = !1, this.home_button.enabled = !1;
    for (var t = 0; t < this.cars.length; t++) this.cars[t].enabled = !1;
    this.tuto_1.script.tutoControls.stop(), this.tuto_2.script.tutoControls.stop()
};
var CountDown = pc.createScript("countDown");
CountDown.attributes.add("game_manager", {
    type: "entity"
}), CountDown.prototype.initialize = function() {
    this.entity.element.text = "", this.start_scale = this.entity.getLocalScale().clone()
}, CountDown.prototype.update = function(t) {
    this.entity.setLocalScale(this.entity.getLocalScale().clone().mulScalar(.997))
}, CountDown.prototype.resetCountDown = function() {
    null != this._timerHandle && pc.timer.remove(this._timerHandle), this.entity.element.text = ""
}, CountDown.prototype.startCountDown = function() {
    null != this._timerHandle && pc.timer.remove(this._timerHandle), this.entity.sound.slot("countdown").play(), this.entity.setLocalScale(this.start_scale), this.second = 3, this.entity.element.text = "" + this.second, this._timerHandle = pc.timer.add(1, this.moveToRandomPosition, this)
}, CountDown.prototype.moveToRandomPosition = function() {
    this.second--, this.entity.setLocalScale(this.start_scale), 0 == this.second ? (this.entity.element.text = "", this.game_manager.script.gameManager.onCountDownFinished()) : (this.entity.sound.slot("countdown").play(), this.entity.element.text = "" + this.second, this._timerHandle = pc.timer.add(1, this.moveToRandomPosition, this))
};
! function() {
    var e = {},
        c = 0;
    pc.timer = {}, pc.timer.add = function(t, i, n) {
        if (t > 0) {
            var a = {};
            return a.id = c, e[c] = {
                secsLeft: t,
                callback: i,
                scope: n
            }, c += 1, a
        }
        return null
    }, pc.timer.remove = function(c) {
        c && delete e[c.id]
    }, pc.timer.update = function(c) {
        for (var t in e) {
            var i = e[t];
            i.secsLeft -= c, i.secsLeft <= 0 && (i.callback.call(i.scope), delete e[t])
        }
    };
    var t = pc.Application.getApplication();
    t && t.on("update", (function(e) {
        pc.timer.update(e)
    }))
}();
var RestartButton = pc.createScript("restartButton");
RestartButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.onRestart()
    }), this), this.entity.enabled = !1
};
var Controls = pc.createScript("controls");
Controls.attributes.add("controls_scheme", {
    type: "string",
    enum: [{
        wasd: "wasd"
    }, {
        arrows: "arrows"
    }, {
        ijkl: "ijkl"
    }, {
        numpad: "numpad"
    }, {
        ai: "ai"
    }]
}), Controls.attributes.add("ball", {
    type: "entity"
}), Controls.attributes.add("opponent_goal", {
    type: "entity"
}), Controls.attributes.add("head", {
    type: "entity"
}), Controls.attributes.add("circle", {
    type: "entity"
}), Controls.attributes.add("draggable", {
    type: "entity"
}), Controls.attributes.add("error", {
    type: "number",
    max: 2,
    min: 0
}), Controls.prototype.initialize = function() {
    this.timer = 0, console.log("initialize")
}, Controls.prototype.update = function(t) {
    if ("ai" != this.controls_scheme) {
        if (!this.app.touch) {
            if (!this.keys) switch (this.controls_scheme) {
                case "arrows":
                    this.keys = [pc.KEY_LEFT, pc.KEY_RIGHT, pc.KEY_UP, pc.KEY_DOWN];
                    break;
                case "wasd":
                    this.keys = [pc.KEY_A, pc.KEY_D, pc.KEY_W, pc.KEY_S];
                    break;
                case "ijkl":
                    this.keys = [pc.KEY_J, pc.KEY_L, pc.KEY_I, pc.KEY_K];
                    break;
                case "numpad":
                    this.keys = [pc.KEY_NUMPAD_4, pc.KEY_NUMPAD_6, pc.KEY_NUMPAD_8, pc.KEY_NUMPAD_5]
            }
            this.entity.script.movement.c_left = this.app.keyboard.isPressed(this.keys[0]), this.entity.script.movement.c_right = this.app.keyboard.isPressed(this.keys[1]), this.entity.script.movement.c_up = this.app.keyboard.isPressed(this.keys[2]), this.entity.script.movement.c_down = this.app.keyboard.isPressed(this.keys[3])
        }
    } else this.timer += t, this.timer > Math.random() + this.error && (this.timer = 0, this.think()), this.think()
}, Controls.prototype.think = function() {
    var t = new pc.Vec2(this.entity.getLocalPosition().x, this.entity.getLocalPosition().z),
        e = new pc.Vec2(this.ball.getLocalPosition().x, this.ball.getLocalPosition().z).add(new pc.Vec3(20 * Math.random() - 10, 0, 20 * Math.random() - 10)),
        i = new pc.Vec2(this.opponent_goal.getLocalPosition().x, this.opponent_goal.getLocalPosition().z),
        s = new pc.Vec2(this.entity.right.x, this.entity.right.z),
        n = (new pc.Vec2(t.x - e.x, t.y - e.y).normalize(), new pc.Vec2(e.x - i.x, e.y - i.y).normalize()),
        o = new pc.Vec2(e.x + 3 * n.x, e.y + 3 * n.y);
    o.x = Math.max(Math.min(27, o.x), -27), o.y = Math.max(Math.min(12, o.y), -12);
    var a = new pc.Vec2(t.x - o.x, t.y - o.y).normalize(),
        r = this.getSignedAngleDiff(s, a);
    Math.random() < .5 ? (this.entity.script.movement.c_left = r < 0, this.entity.script.movement.c_right = r > 0) : (this.entity.script.movement.c_left = !1, this.entity.script.movement.c_right = !1);
    var c = Math.abs(e.y) > 11 && Math.abs(e.x) > 24,
        p = new pc.Vec2(t.x - e.x, t.y - e.y).length() < 5;
    c && p ? (this.entity.script.movement.c_down = !0, this.entity.script.movement.c_up = !1) : (this.entity.script.movement.c_down = !1, this.entity.script.movement.c_up = Math.abs(r) < 30)
}, Controls.prototype.getSignedAngleDiff = function(t, e) {
    var i = Math.sqrt(t.x * t.x + t.y * t.y) * Math.sqrt(e.x * e.x + e.y * e.y),
        s = (t.x * e.y - e.x * t.y) / i,
        n = (t.x * e.x + t.y * e.y) / i;
    return Math.atan2(s, n) * pc.math.RAD_TO_DEG
};
var ChangeModeButton = pc.createScript("changeModeButton");
ChangeModeButton.attributes.add("car", {
    type: "entity"
}), ChangeModeButton.attributes.add("car_menu", {
    type: "entity"
}), ChangeModeButton.attributes.add("car_menu2", {
    type: "entity"
}), ChangeModeButton.attributes.add("car_palco", {
    type: "entity"
}), ChangeModeButton.attributes.add("other_button", {
    type: "entity"
}), ChangeModeButton.attributes.add("controls_scheme", {
    type: "string",
    enum: [{
        arrows: "arrows"
    }, {
        ai: "ai"
    }]
}), ChangeModeButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        1 != this.entity.element.opacity && (this.entity.element.opacity = 1, this.other_button.element.opacity = .7, "ai" == this.controls_scheme ? GameManager.instance.changeSkin(this.car.script.movement.team, GameManager.instance.robot_head) : GameManager.instance.resetSkin(this.car.script.movement.team), this.car.script.controls.controls_scheme = this.controls_scheme, this.car_menu.script.carMenu.resetCar(), this.car_menu2.script.carMenu.resetCar())
    }), this)
};
pc.script.createLoadingScreen((function(M) {
    M.p = !0, window.addEventListener("keydown", (M => {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", " "].includes(M.key) && M.preventDefault()
    })), window.addEventListener("wheel", (M => M.preventDefault()), {
        passive: !1
    }), M.p && (PokiSDK.init().then((() => {
        M.ab = !1
    })).catch((() => {
        M.ab = !0
    })), PokiSDK.gameLoadingStart());
    var L, j;
    L = ["body {", "    background-color: #d1232a;", "}", "", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #d1232a;", "}", "", "#application-splash {", "    position: absolute;", "    top: calc(50% - 28px);", "    width: 264px;", "    left: calc(50% - 132px);", "}", "", "#application-splash img {", "    width: 100%;", "}", "", "#progress-bar-container {", "    margin: 20px auto 0 auto;", "    height: 2px;", "    width: 100%;", "    background-color: #000000;", "}", "", "#progress-bar {", "    width: 0%;", "    height: 100%;", "    background-color: #ffc713;", "}", "", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n"), (j = document.createElement("style")).type = "text/css", j.styleSheet ? j.styleSheet.cssText = L : j.appendChild(document.createTextNode(L)), document.head.appendChild(j),
        function() {
            var M = document.createElement("div");
            M.id = "application-splash-wrapper", document.body.appendChild(M);
            var L = document.createElement("div");
            L.id = "application-splash", M.appendChild(L), L.style.display = "none";
            var j = document.createElement("img");
            j.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI1NiA3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjU2IDc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe29wYWNpdHk6MC4xO2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQoJLnN0MXtvcGFjaXR5OjAuMjtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDJ7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZGRkZGO30KCS5zdDN7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7fQoJLnN0NHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGRkM3MTM7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjQ0Ljc2LDcuNWMwLTEuMTIsMC4zOS0yLjA2LDEuMTktMi44M2MwLjc5LTAuNzksMS43NC0xLjE5LDIuODYtMS4xOXMyLjA2LDAuNCwyLjgzLDEuMTkKCWMwLjc5LDAuNzcsMS4xOCwxLjcyLDEuMTgsMi44M2MwLDEuMTItMC40LDIuMDctMS4xOCwyLjg2Yy0wLjc3LDAuNzktMS43MiwxLjE5LTIuODMsMS4xOWMtMS4xMiwwLTIuMDctMC40LTIuODYtMS4xOQoJQzI0NS4xNSw5LjU3LDI0NC43Niw4LjYyLDI0NC43Niw3LjV6IE0yNDkuNDIsNi43YzAtMC4xOS0wLjA2LTAuMzMtMC4xOC0wLjQ0Yy0wLjE0LTAuMS0wLjMxLTAuMTUtMC41Mi0wLjE1CgljLTAuMTksMC0wLjMzLDAuMDItMC40MSwwLjA1djEuMTNoMC4zOWMwLjIyLDAsMC40LTAuMDUsMC41NC0wLjE1QzI0OS4zNiw3LjAyLDI0OS40Miw2Ljg3LDI0OS40Miw2Ljd6IE0yNDkuNDIsNy41NQoJYzAuMjQsMC4xLDAuNDEsMC4zNCwwLjUyLDAuN2MwLjE1LDAuNjIsMC4yNSwwLjk2LDAuMjgsMS4wM2gtMC43Yy0wLjA3LTAuMTUtMC4xNS0wLjQ0LTAuMjMtMC44NWMtMC4wNS0wLjI0LTAuMTMtMC40LTAuMjMtMC40OQoJYy0wLjA5LTAuMS0wLjIyLTAuMTUtMC40MS0wLjE1aC0wLjMzdjEuNDloLTAuNjdWNS43YzAuMjYtMC4wNSwwLjU5LTAuMDgsMS0wLjA4YzAuNTIsMCwwLjg5LDAuMDksMS4xMywwLjI4CgljMC4yMSwwLjE3LDAuMzEsMC40MiwwLjMxLDAuNzVjMCwwLjIxLTAuMDcsMC40LTAuMjEsMC41OUMyNDkuNzYsNy4zOCwyNDkuNjEsNy40OCwyNDkuNDIsNy41NXogTTI0NS43NiwyNy4zMQoJYy0wLjA3LDEuOTktMC40MywzLjk2LTEuMDgsNS45Yy0wLjYzLDEuOTEtMS41MywzLjcyLTIuNjgsNS40NGMxLjAxLDEuNjUsMS44MSwzLjM5LDIuNCw1LjIzYzAuNTgsMS44NCwwLjkzLDMuNzEsMS4wMyw1LjYyCgljMC4yNiwxLjUzLDAuMzcsMy4wMSwwLjMzLDQuNDZjLTAuMDksMi45NC0wLjcyLDUuNzItMS45MSw4LjM1Yy0xLjE3LDIuNjUtMi43Nyw0LjkxLTQuODIsNi44Yy0yLjA2LDEuOTEtNC4zNSwzLjM3LTYuODgsNC4zOAoJYy0yLjUyLDEuMDEtNS4xMiwxLjUyLTcuNzgsMS41MmMtMi43NSwwLTUuNDYtMC41Mi04LjE0LTEuNTdzLTUuMTQtMi41NC03LjM5LTQuNDhjLTIuMTMsMS43Ny00LjUxLDMuMTMtNy4xNCw0LjA3CgljLTIuNjMsMC45NS01LjMyLDEuNDItOC4wNiwxLjQyYy0yLjc1LDAtNS4zOC0wLjQ4LTcuOTEtMS40NGMtMi41Mi0wLjk2LTQuNzctMi4zNS02Ljc1LTQuMTdjLTEuMzYtMS4yNS0yLjUzLTIuNjYtMy41LTQuMjMKCWMtMC43NCwxLjAzLTEuNDQsMS45LTIuMTEsMi42Yy0yLjI3LDIuMzQtNC44LDQuMTItNy42LDUuMzZjLTIuODIsMS4yNS01LjcyLDEuODgtOC43MSwxLjg4Yy0zLjExLDAtNi4xMS0wLjY0LTguOTktMS45MQoJYy0yLjc4LTEuMi01LjI3LTIuOS03LjQ1LTUuMWMtMi4xNy0yLjItMy44NS00LjcxLTUuMDUtNy41MmMtMS4yNC0yLjkyLTEuODYtNS45NC0xLjg2LTkuMDd2LTAuNTJsLTEzLjE3LDE0Ljg5CgljLTIuMTUsMi40NC00LjY4LDQuMzItNy42LDUuNjRjLTIuOTQsMS4zMi02LDEuOTgtOS4yLDEuOThzLTYuMjYtMC42Ni05LjItMS45OGMtMi45Mi0xLjMyLTUuNDUtMy4yLTcuNi01LjY0bC02LjY3LTcuNTUKCWMtMC41MywxLjc5LTEuMjUsMy40Ni0yLjE2LDUuMDJjLTAuOTUsMS42LTIuMDgsMy4wNS0zLjQsNC4zNWMtMi4wNCwyLjAzLTQuNDEsMy41Ny03LjA5LDQuNjRjLTIuNjgsMS4wOC01LjUxLDEuNjItOC40OCwxLjYyCgljLTMuMDIsMC01Ljk4LTAuNTgtOC44Ni0xLjc1Yy0yLjktMS4xNS01LjQ3LTIuNzktNy43LTQuOTJsLTAuNzItMC42OWwtMC45OCwwLjk4Yy0yLjMyLDIuMi00LjkyLDMuOTEtNy44MSw1LjEzCgljLTIuODksMS4yLTUuOCwxLjgtOC43MywxLjhjLTIuODksMC01LjY3LTAuNTctOC4zNS0xLjdjLTIuNjgtMS4xMi01LjA4LTIuNzMtNy4yMS00Ljg0Yy0yLjYxLTIuNTgtNC40NS01LjY0LTUuNTEtOS4yCgljLTEuMDUtMy41NC0xLjIxLTcuMTgtMC40OS0xMC45MmMwLjIxLTIuNTYsMC44MS01LjAzLDEuOC03LjQyYzEuMDEtMi4zOSwyLjM2LTQuNTUsNC4wNS02LjQ5TDI0Ljg0LDE0LjUKCWMyLjE3LTIuNDksNC43Mi00LjQyLDcuNjUtNS44YzIuOTUtMS4zNyw2LjA1LTIuMDYsOS4yNy0yLjA2YzMuMjMsMCw2LjMyLDAuNjgsOS4yNywyLjAzYzIuOTQsMS4zNiw1LjQ4LDMuMjgsNy42Myw1Ljc3bDYuOCw3Ljg2CgljMC41LTEuODYsMS4yMS0zLjYsMi4xNC01LjIzYzAuOTQtMS42NSwyLjA4LTMuMTQsMy40LTQuNDhjMi4wNC0yLjA0LDQuMzktMy42Miw3LjAzLTQuNzFjMi42NC0xLjEsNS40NC0xLjY1LDguMzctMS42NQoJYzMuMjMsMCw2LjM1LDAuNjcsOS4zNSwyLjAxYzMuMDEsMS4zNCw1LjYzLDMuMjIsNy44OCw1LjY0bDAuMSwwLjEzbDAuMS0wLjEzYzIuMjUtMi40Miw0Ljg4LTQuMyw3Ljg4LTUuNjQKCWMzLjAxLTEuMzQsNi4xMi0yLjAxLDkuMzUtMi4wMWMyLjk0LDAsNS43MywwLjU1LDguMzcsMS42NWMyLjY1LDEuMSw0Ljk5LDIuNjcsNy4wMyw0LjcxYzAuNDUsMC40NiwwLjg5LDAuOTYsMS4zNCwxLjQ5CgljMi4wMS0zLjI4LDQuNjYtNS44Niw3Ljk2LTcuNzNjMy4zNy0xLjkyLDcuMDItMi44OSwxMC45NS0yLjg5YzMuODgsMCw3LjQ4LDAuOTMsMTAuOCwyLjc4YzMuMjUsMS44LDUuODksNC4yOSw3Ljk0LDcuNDcKCWMwLjkzLTEuNTEsMi4wMi0yLjg3LDMuMjctNC4wN2MxLjk2LTEuODYsNC4yMy0zLjI3LDYuOC00LjI1YzIuNTYtMSw1LjI2LTEuNDksOC4wOS0xLjQ5YzIuNzEsMCw1LjQsMC40Niw4LjA2LDEuMzcKCXM1LjA5LDIuMjEsNy4yOSwzLjkyYzIuMjItMS43LDQuNjUtMy4wMSw3LjMyLTMuOTJjMi42Ni0wLjkxLDUuMzUtMS4zNyw4LjA2LTEuMzdjMi44MywwLDUuNTQsMC41LDguMTIsMS40OQoJYzIuNTYsMC45OCw0LjgyLDIuNCw2Ljc4LDQuMjVjMi40LDIuMjcsNC4xMiw0Ljk1LDUuMTUsOC4wNGMwLjUzLDEuNDEsMC45MSwzLjA3LDEuMTMsNC45N0MyNDUuNzYsMjQuMjQsMjQ1LjgzLDI1Ljc5LDI0NS43NiwyNy4zMQoJeiBNMjQ2LjU2LDkuNzRjMC42MiwwLjYyLDEuMzcsMC45MywyLjI0LDAuOTNjMC44NiwwLDEuNi0wLjMxLDIuMjItMC45M3MwLjkzLTEuMzcsMC45My0yLjI0YzAtMC44Ni0wLjMxLTEuNi0wLjkzLTIuMjIKCWMtMC42Mi0wLjYyLTEuMzYtMC45My0yLjIyLTAuOTNjLTAuODgsMC0xLjYyLDAuMzEtMi4yNCwwLjkzYy0wLjYsMC42Mi0wLjksMS4zNi0wLjksMi4yMkMyNDUuNjYsOC4zOCwyNDUuOTYsOS4xMiwyNDYuNTYsOS43NHoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTI0NC43Niw3LjA1YzAtMS4xMiwwLjM5LTIuMDYsMS4xOS0yLjgzYzAuNzktMC43OSwxLjc0LTEuMTksMi44Ni0xLjE5czIuMDYsMC40LDIuODMsMS4xOQoJYzAuNzksMC43NywxLjE4LDEuNzIsMS4xOCwyLjgzYzAsMS4xMi0wLjQsMi4wNy0xLjE4LDIuODZjLTAuNzcsMC43OS0xLjcyLDEuMTktMi44MywxLjE5Yy0xLjEyLDAtMi4wNy0wLjQtMi44Ni0xLjE5CglDMjQ1LjE1LDkuMTIsMjQ0Ljc2LDguMTcsMjQ0Ljc2LDcuMDV6IE0yNDkuNDIsNi4yNWMwLTAuMTktMC4wNi0wLjMzLTAuMTgtMC40NGMtMC4xNC0wLjEtMC4zMS0wLjE1LTAuNTItMC4xNQoJYy0wLjE5LDAtMC4zMywwLjAyLTAuNDEsMC4wNXYxLjEzaDAuMzljMC4yMiwwLDAuNC0wLjA1LDAuNTQtMC4xNUMyNDkuMzYsNi41NywyNDkuNDIsNi40MiwyNDkuNDIsNi4yNXogTTI0OS40Miw3LjEKCWMwLjI0LDAuMSwwLjQxLDAuMzQsMC41MiwwLjdjMC4xNSwwLjYyLDAuMjUsMC45NiwwLjI4LDEuMDNoLTAuN2MtMC4wNy0wLjE1LTAuMTUtMC40NC0wLjIzLTAuODVjLTAuMDUtMC4yNC0wLjEzLTAuNC0wLjIzLTAuNDkKCWMtMC4wOS0wLjEtMC4yMi0wLjE1LTAuNDEtMC4xNWgtMC4zM3YxLjQ5aC0wLjY3VjUuMjVjMC4yNi0wLjA1LDAuNTktMC4wOCwxLTAuMDhjMC41MiwwLDAuODksMC4wOSwxLjEzLDAuMjgKCWMwLjIxLDAuMTcsMC4zMSwwLjQyLDAuMzEsMC43NWMwLDAuMjEtMC4wNywwLjQtMC4yMSwwLjU5QzI0OS43Niw2LjkzLDI0OS42MSw3LjAzLDI0OS40Miw3LjF6IE0yNDUuNzYsMjUuNjcKCWMtMC4wNywxLjk5LTAuNDMsMy45Ni0xLjA4LDUuOWMtMC42MywxLjkxLTEuNTMsMy43Mi0yLjY4LDUuNDRjMS4wMSwxLjY1LDEuODEsMy4zOSwyLjQsNS4yM2MwLjU4LDEuODQsMC45MywzLjcxLDEuMDMsNS42MgoJYzAuMjYsMS41MywwLjM3LDMuMDEsMC4zMyw0LjQ2Yy0wLjA5LDIuOTQtMC43Miw1LjcyLTEuOTEsOC4zNWMtMS4xNywyLjY1LTIuNzcsNC45MS00LjgyLDYuOGMtMi4wNiwxLjkxLTQuMzUsMy4zNy02Ljg4LDQuMzgKCWMtMi41MiwxLjAxLTUuMTIsMS41Mi03Ljc4LDEuNTJjLTIuNzUsMC01LjQ2LTAuNTItOC4xNC0xLjU3cy01LjE0LTIuNTQtNy4zOS00LjQ4Yy0yLjEzLDEuNzctNC41MSwzLjEzLTcuMTQsNC4wNwoJYy0yLjYzLDAuOTUtNS4zMiwxLjQyLTguMDYsMS40MmMtMi43NSwwLTUuMzgtMC40OC03LjkxLTEuNDRjLTIuNTItMC45Ni00Ljc3LTIuMzUtNi43NS00LjE3Yy0xLjM2LTEuMjUtMi41My0yLjY2LTMuNS00LjIzCgljLTAuNzQsMS4wMy0xLjQ0LDEuOS0yLjExLDIuNmMtMi4yNywyLjM0LTQuOCw0LjEyLTcuNiw1LjM2Yy0yLjgyLDEuMjUtNS43MiwxLjg4LTguNzEsMS44OGMtMy4xMSwwLTYuMTEtMC42NC04Ljk5LTEuOTEKCWMtMi43OC0xLjItNS4yNy0yLjktNy40NS01LjFjLTIuMTctMi4yLTMuODUtNC43MS01LjA1LTcuNTJjLTEuMjQtMi45Mi0xLjg2LTUuOTQtMS44Ni05LjA3di0wLjUybC0xMy4xNywxNC44OQoJYy0yLjE1LDIuNDQtNC42OCw0LjMyLTcuNiw1LjY0Yy0yLjk0LDEuMzItNiwxLjk4LTkuMiwxLjk4cy02LjI2LTAuNjYtOS4yLTEuOThjLTIuOTItMS4zMi01LjQ1LTMuMi03LjYtNS42NGwtNi42Ny03LjU1CgljLTAuNTMsMS43OS0xLjI1LDMuNDYtMi4xNiw1LjAyYy0wLjk1LDEuNi0yLjA4LDMuMDUtMy40LDQuMzVjLTIuMDQsMi4wMy00LjQxLDMuNTctNy4wOSw0LjY0Yy0yLjY4LDEuMDgtNS41MSwxLjYyLTguNDgsMS42MgoJYy0zLjAyLDAtNS45OC0wLjU4LTguODYtMS43NWMtMi45LTEuMTUtNS40Ny0yLjc5LTcuNy00LjkybC0wLjcyLTAuNjlsLTAuOTgsMC45OGMtMi4zMiwyLjItNC45MiwzLjkxLTcuODEsNS4xMwoJYy0yLjg5LDEuMi01LjgsMS44LTguNzMsMS44Yy0yLjg5LDAtNS42Ny0wLjU3LTguMzUtMS43Yy0yLjY4LTEuMTItNS4wOC0yLjczLTcuMjEtNC44NGMtMi42MS0yLjU4LTQuNDUtNS42NC01LjUxLTkuMgoJYy0xLjA1LTMuNTQtMS4yMS03LjE4LTAuNDktMTAuOTJjMC4yMS0yLjU2LDAuODEtNS4wMywxLjgtNy40MmMxLjAxLTIuMzksMi4zNi00LjU1LDQuMDUtNi40OWwxNi4yMS0xOC43OAoJYzIuMTctMi40OSw0LjcyLTQuNDIsNy42NS01LjhDMzUuNDQsNS42OSwzOC41NCw1LDQxLjc2LDVjMy4yMywwLDYuMzIsMC42OCw5LjI3LDIuMDNjMi45NCwxLjM2LDUuNDgsMy4yOCw3LjYzLDUuNzdsNi44LDcuODYKCWMwLjUtMS44NiwxLjIxLTMuNiwyLjE0LTUuMjNjMC45NC0xLjY1LDIuMDgtMy4xNCwzLjQtNC40OGMyLjA0LTIuMDQsNC4zOS0zLjYyLDcuMDMtNC43MWMyLjY0LTEuMSw1LjQ0LTEuNjUsOC4zNy0xLjY1CgljMy4yMywwLDYuMzUsMC42Nyw5LjM1LDIuMDFjMy4wMSwxLjM0LDUuNjMsMy4yMiw3Ljg4LDUuNjRsMC4xLDAuMTNsMC4xLTAuMTNjMi4yNS0yLjQyLDQuODgtNC4zLDcuODgtNS42NAoJYzMuMDEtMS4zNCw2LjEyLTIuMDEsOS4zNS0yLjAxYzIuOTQsMCw1LjczLDAuNTUsOC4zNywxLjY1YzIuNjUsMS4xLDQuOTksMi42Nyw3LjAzLDQuNzFjMC40NSwwLjQ2LDAuODksMC45NiwxLjM0LDEuNDkKCWMyLjAxLTMuMjgsNC42Ni01Ljg2LDcuOTYtNy43M2MzLjM3LTEuOTIsNy4wMi0yLjg5LDEwLjk1LTIuODljMy44OCwwLDcuNDgsMC45MywxMC44LDIuNzhjMy4yNSwxLjgsNS44OSw0LjI5LDcuOTQsNy40NwoJYzAuOTMtMS41MSwyLjAyLTIuODcsMy4yNy00LjA3YzEuOTYtMS44Niw0LjIzLTMuMjcsNi44LTQuMjVjMi41Ni0xLDUuMjYtMS40OSw4LjA5LTEuNDljMi43MSwwLDUuNCwwLjQ2LDguMDYsMS4zNwoJczUuMDksMi4yMSw3LjI5LDMuOTJjMi4yMi0xLjcsNC42NS0zLjAxLDcuMzItMy45MmMyLjY2LTAuOTEsNS4zNS0xLjM3LDguMDYtMS4zN2MyLjgzLDAsNS41NCwwLjUsOC4xMiwxLjQ5CgljMi41NiwwLjk4LDQuODIsMi40LDYuNzgsNC4yNWMyLjQsMi4yNyw0LjEyLDQuOTUsNS4xNSw4LjA0YzAuNTMsMS40MSwwLjkxLDMuMDcsMS4xMyw0Ljk3QzI0NS43NiwyMi42LDI0NS44MywyNC4xNSwyNDUuNzYsMjUuNjd6CgkgTTI0Ni41Niw5LjI5YzAuNjIsMC42MiwxLjM3LDAuOTMsMi4yNCwwLjkzYzAuODYsMCwxLjYtMC4zMSwyLjIyLTAuOTNzMC45My0xLjM3LDAuOTMtMi4yNGMwLTAuODYtMC4zMS0xLjYtMC45My0yLjIyCgljLTAuNjItMC42Mi0xLjM2LTAuOTMtMi4yMi0wLjkzYy0wLjg4LDAtMS42MiwwLjMxLTIuMjQsMC45M2MtMC42LDAuNjItMC45LDEuMzYtMC45LDIuMjJDMjQ1LjY2LDcuOTMsMjQ1Ljk2LDguNjcsMjQ2LjU2LDkuMjl6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yNDQuNzYsNi42M2MwLTEuMTIsMC4zOS0yLjA2LDEuMTktMi44M2MwLjc5LTAuNzksMS43NC0xLjE5LDIuODYtMS4xOXMyLjA2LDAuNCwyLjgzLDEuMTkKCWMwLjc5LDAuNzcsMS4xOCwxLjcyLDEuMTgsMi44M2MwLDEuMTItMC40LDIuMDctMS4xOCwyLjg2Yy0wLjc3LDAuNzktMS43MiwxLjE5LTIuODMsMS4xOWMtMS4xMiwwLTIuMDctMC40LTIuODYtMS4xOQoJQzI0NS4xNSw4LjcsMjQ0Ljc2LDcuNzUsMjQ0Ljc2LDYuNjN6IE0yNDkuNDIsNS44M2MwLTAuMTktMC4wNi0wLjMzLTAuMTgtMC40NGMtMC4xNC0wLjEtMC4zMS0wLjE1LTAuNTItMC4xNQoJYy0wLjE5LDAtMC4zMywwLjAyLTAuNDEsMC4wNXYxLjEzaDAuMzljMC4yMiwwLDAuNC0wLjA1LDAuNTQtMC4xNUMyNDkuMzYsNi4xNSwyNDkuNDIsNiwyNDkuNDIsNS44M3ogTTI0OS40Miw2LjY4CgljMC4yNCwwLjEsMC40MSwwLjM0LDAuNTIsMC43YzAuMTUsMC42MiwwLjI1LDAuOTYsMC4yOCwxLjAzaC0wLjdjLTAuMDctMC4xNS0wLjE1LTAuNDQtMC4yMy0wLjg1Yy0wLjA1LTAuMjQtMC4xMy0wLjQtMC4yMy0wLjQ5CgljLTAuMDktMC4xLTAuMjItMC4xNS0wLjQxLTAuMTVoLTAuMzN2MS40OWgtMC42N1Y0LjgzYzAuMjYtMC4wNSwwLjU5LTAuMDgsMS0wLjA4YzAuNTIsMCwwLjg5LDAuMDksMS4xMywwLjI4CgljMC4yMSwwLjE3LDAuMzEsMC40MiwwLjMxLDAuNzVjMCwwLjIxLTAuMDcsMC40LTAuMjEsMC41OUMyNDkuNzYsNi41MSwyNDkuNjEsNi42MSwyNDkuNDIsNi42OHogTTI0NS43NiwyNC41NAoJYy0wLjA3LDEuOTktMC40MywzLjk2LTEuMDgsNS45Yy0wLjYzLDEuOTEtMS41MywzLjcyLTIuNjgsNS40NGMxLjAxLDEuNjUsMS44MSwzLjM5LDIuNCw1LjIzYzAuNTgsMS44NCwwLjkzLDMuNzEsMS4wMyw1LjYyCgljMC4yNiwxLjUzLDAuMzcsMy4wMSwwLjMzLDQuNDZjLTAuMDksMi45NC0wLjcyLDUuNzItMS45MSw4LjM1Yy0xLjE3LDIuNjUtMi43Nyw0LjkxLTQuODIsNi44Yy0yLjA2LDEuOTEtNC4zNSwzLjM3LTYuODgsNC4zOAoJYy0yLjUyLDEuMDEtNS4xMiwxLjUyLTcuNzgsMS41MmMtMi43NSwwLTUuNDYtMC41Mi04LjE0LTEuNTdzLTUuMTQtMi41NC03LjM5LTQuNDhjLTIuMTMsMS43Ny00LjUxLDMuMTMtNy4xNCw0LjA3CgljLTIuNjMsMC45NS01LjMyLDEuNDItOC4wNiwxLjQyYy0yLjc1LDAtNS4zOC0wLjQ4LTcuOTEtMS40NGMtMi41Mi0wLjk2LTQuNzctMi4zNS02Ljc1LTQuMTdjLTEuMzYtMS4yNS0yLjUzLTIuNjYtMy41LTQuMjMKCWMtMC43NCwxLjAzLTEuNDQsMS45LTIuMTEsMi42Yy0yLjI3LDIuMzQtNC44LDQuMTItNy42LDUuMzZjLTIuODIsMS4yNS01LjcyLDEuODgtOC43MSwxLjg4Yy0zLjExLDAtNi4xMS0wLjY0LTguOTktMS45MQoJYy0yLjc4LTEuMi01LjI3LTIuOS03LjQ1LTUuMWMtMi4xNy0yLjItMy44NS00LjcxLTUuMDUtNy41MmMtMS4yNC0yLjkyLTEuODYtNS45NC0xLjg2LTkuMDd2LTAuNTJsLTEzLjE3LDE0Ljg5CgljLTIuMTUsMi40NC00LjY4LDQuMzItNy42LDUuNjRjLTIuOTQsMS4zMi02LDEuOTgtOS4yLDEuOThzLTYuMjYtMC42Ni05LjItMS45OGMtMi45Mi0xLjMyLTUuNDUtMy4yLTcuNi01LjY0bC02LjY3LTcuNTUKCWMtMC41MywxLjc5LTEuMjUsMy40Ni0yLjE2LDUuMDJjLTAuOTUsMS42LTIuMDgsMy4wNS0zLjQsNC4zNWMtMi4wNCwyLjAzLTQuNDEsMy41Ny03LjA5LDQuNjRjLTIuNjgsMS4wOC01LjUxLDEuNjItOC40OCwxLjYyCgljLTMuMDIsMC01Ljk4LTAuNTgtOC44Ni0xLjc1Yy0yLjktMS4xNS01LjQ3LTIuNzktNy43LTQuOTJsLTAuNzItMC42OWwtMC45OCwwLjk4Yy0yLjMyLDIuMi00LjkyLDMuOTEtNy44MSw1LjEzCgljLTIuODksMS4yLTUuOCwxLjgtOC43MywxLjhjLTIuODksMC01LjY3LTAuNTctOC4zNS0xLjdjLTIuNjgtMS4xMi01LjA4LTIuNzMtNy4yMS00Ljg0Yy0yLjYxLTIuNTgtNC40NS01LjY0LTUuNTEtOS4yCgljLTEuMDUtMy41NC0xLjIxLTcuMTgtMC40OS0xMC45MmMwLjIxLTIuNTYsMC44MS01LjAzLDEuOC03LjQyYzEuMDEtMi4zOSwyLjM2LTQuNTUsNC4wNS02LjQ5bDE2LjIxLTE4Ljc4CgljMi4xNy0yLjQ5LDQuNzItNC40Miw3LjY1LTUuOGMyLjk1LTEuMzcsNi4wNS0yLjA2LDkuMjctMi4wNmMzLjIzLDAsNi4zMiwwLjY4LDkuMjcsMi4wM2MyLjk0LDEuMzYsNS40OCwzLjI4LDcuNjMsNS43N2w2LjgsNy44NgoJYzAuNS0xLjg2LDEuMjEtMy42LDIuMTQtNS4yM2MwLjk0LTEuNjUsMi4wOC0zLjE0LDMuNC00LjQ4YzIuMDQtMi4wNCw0LjM5LTMuNjIsNy4wMy00LjcxYzIuNjQtMS4xLDUuNDQtMS42NSw4LjM3LTEuNjUKCWMzLjIzLDAsNi4zNSwwLjY3LDkuMzUsMi4wMWMzLjAxLDEuMzQsNS42MywzLjIyLDcuODgsNS42NGwwLjEsMC4xM2wwLjEtMC4xM2MyLjI1LTIuNDIsNC44OC00LjMsNy44OC01LjY0CgljMy4wMS0xLjM0LDYuMTItMi4wMSw5LjM1LTIuMDFjMi45NCwwLDUuNzMsMC41NSw4LjM3LDEuNjVjMi42NSwxLjEsNC45OSwyLjY3LDcuMDMsNC43MWMwLjQ1LDAuNDYsMC44OSwwLjk2LDEuMzQsMS40OQoJYzIuMDEtMy4yOCw0LjY2LTUuODYsNy45Ni03LjczYzMuMzctMS45Miw3LjAyLTIuODksMTAuOTUtMi44OWMzLjg4LDAsNy40OCwwLjkzLDEwLjgsMi43OGMzLjI1LDEuOCw1Ljg5LDQuMjksNy45NCw3LjQ3CgljMC45My0xLjUxLDIuMDItMi44NywzLjI3LTQuMDdjMS45Ni0xLjg2LDQuMjMtMy4yNyw2LjgtNC4yNWMyLjU2LTEsNS4yNi0xLjQ5LDguMDktMS40OWMyLjcxLDAsNS40LDAuNDYsOC4wNiwxLjM3CglzNS4wOSwyLjIxLDcuMjksMy45MmMyLjIyLTEuNyw0LjY1LTMuMDEsNy4zMi0zLjkyYzIuNjYtMC45MSw1LjM1LTEuMzcsOC4wNi0xLjM3YzIuODMsMCw1LjU0LDAuNSw4LjEyLDEuNDkKCWMyLjU2LDAuOTgsNC44MiwyLjQsNi43OCw0LjI1YzIuNCwyLjI3LDQuMTIsNC45NSw1LjE1LDguMDRjMC41MywxLjQxLDAuOTEsMy4wNywxLjEzLDQuOTdDMjQ1Ljc2LDIxLjQ3LDI0NS44MywyMy4wMiwyNDUuNzYsMjQuNTQKCXogTTI0Ni41Niw4Ljg3YzAuNjIsMC42MiwxLjM3LDAuOTMsMi4yNCwwLjkzYzAuODYsMCwxLjYtMC4zMSwyLjIyLTAuOTNzMC45My0xLjM3LDAuOTMtMi4yNGMwLTAuODYtMC4zMS0xLjYtMC45My0yLjIyCglzLTEuMzYtMC45My0yLjIyLTAuOTNjLTAuODgsMC0xLjYyLDAuMzEtMi4yNCwwLjkzYy0wLjYsMC42Mi0wLjksMS4zNi0wLjksMi4yMkMyNDUuNjYsNy41MSwyNDUuOTYsOC4yNSwyNDYuNTYsOC44N3oiLz4KPHBhdGggY2xhc3M9InN0MyIgZD0iTTQxLjU4LDExLjQyYzEuODksMCwzLjcsMC40LDUuNDQsMS4yMWMxLjc0LDAuODIsMy4yNCwxLjk4LDQuNTEsMy40NWwxNi4yMywxOC45OQoJYzEuMTUsMS4zMiwyLjA0LDIuOCwyLjY4LDQuNDNjMC42MiwxLjU4LDAuOTYsMy4yLDEuMDMsNC44N2MwLjUxLDIuMywwLjQ5LDQuNTQtMC4wOCw2LjczYy0wLjU4LDIuMjctMS42OCw0LjIxLTMuMyw1LjgyCgljLTEuMTksMS4xNy0yLjU2LDIuMDctNC4xMiwyLjcxYy0xLjU1LDAuNjQtMy4xOSwwLjk1LTQuOTIsMC45NWMtMS44NywwLTMuNjktMC4zNy01LjQ2LTEuMTFjLTEuNzktMC43NC0zLjM3LTEuNzctNC43NC0zLjA5CglsLTYuMDUtNS44MmMtMC4zMS0wLjMxLTAuNzEtMC40Ni0xLjIxLTAuNDZjLTAuNDgsMC0wLjg4LDAuMTUtMS4xOSwwLjQ2bC02LjA1LDYuMDhjLTEuNDMsMS4zOC0zLjAxLDIuNDYtNC43NCwzLjI1CgljLTEuODQsMC44MS0zLjY2LDEuMjEtNS40NiwxLjIxYy0xLjY4LDAtMy4zMy0wLjM1LTQuOTUtMS4wNmMtMS41MS0wLjY5LTIuODktMS42NC00LjEyLTIuODZjLTEuNi0xLjYyLTIuNy0zLjU3LTMuMy01Ljg1CgljLTAuNTctMi4yMS0wLjU5LTQuNDgtMC4wOC02LjhjMC4wOS0xLjY4LDAuNDQtMy4zMSwxLjA2LTQuODljMC42My0xLjYzLDEuNTItMy4xMSwyLjY1LTQuNDNsMTYuMjYtMTkuMDcKCWMxLjI3LTEuNDgsMi43Ny0yLjYzLDQuNTEtMy40NUMzNy45LDExLjg0LDM5LjcsMTEuNDIsNDEuNTgsMTEuNDJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik04MS41MSwxMS45NmMxLjUzLTAuNjMsMy4xMy0wLjk1LDQuODItMC45NWMxLjk0LDAsMy44MiwwLjQxLDUuNjQsMS4yNGMxLjgyLDAuODQsMy40MiwyLjAxLDQuNzksMy41CglsNi41NCw3LjE5YzAuMTQsMC4xNSwwLjI3LDAuMjMsMC4zOSwwLjIzczAuMjUtMC4wOCwwLjM5LTAuMjNsNi41NC03LjE5YzEuMzctMS40OSwyLjk3LTIuNjYsNC43OS0zLjUKCWMxLjgyLTAuODIsMy43LTEuMjQsNS42NC0xLjI0YzEuNywwLDMuMzEsMC4zMiw0Ljg0LDAuOTVjMS41MSwwLjY0LDIuODUsMS41NCw0LjAyLDIuNzFjMS4xMywxLjE3LDIuMDIsMi41MiwyLjY1LDQuMDcKCWMwLjYsMS40OCwwLjk0LDMuMDQsMSw0LjY5YzAuNTMsMi4yMywwLjUxLDQuNDktMC4wOCw2Ljc4Yy0wLjYsMi4zNS0xLjcyLDQuNDctMy4zNSw2LjM0bC0xNi41NywxOC45OQoJYy0xLjI3LDEuNDQtMi43NywyLjU3LTQuNDgsMy4zN2MtMS43MywwLjc5LTMuNTQsMS4xOS01LjQxLDEuMTlzLTMuNjctMC40LTUuMzktMS4xOWMtMS43Mi0wLjgxLTMuMjEtMS45My00LjQ4LTMuMzdsLTE2LjU3LTE5CgljLTEuNjEtMS44Ny0yLjcyLTMuOTgtMy4zMi02LjM0Yy0wLjU4LTIuMjgtMC42Mi00LjU0LTAuMS02Ljc4YzAuMDctMS42NSwwLjQxLTMuMjEsMS4wMy00LjY5YzAuNjItMS41NSwxLjUtMi45LDIuNjUtNC4wNwoJQzc4LjY2LDEzLjUsODAsMTIuNiw4MS41MSwxMS45NnoiLz4KPHBhdGggY2xhc3M9InN0MyIgZD0iTTE2NS42MSwxMS43M2MyLjQ2LDIuMywzLjkxLDUuMjIsNC4zNSw4Ljc2YzAuNDgsMS40OCwwLjcyLDIuOTgsMC43Miw0LjUxdjIyYzAsMS45Mi0wLjMzLDMuNzUtMC45OCw1LjQ5CgljLTAuNjcsMS44Mi0xLjY0LDMuMzktMi45MSw0LjcxYy0xLjM0LDEuMzktMi44MywyLjQ4LTQuNDYsMy4yN2MtMS43LDAuODEtMy40NCwxLjIxLTUuMjMsMS4yMWMtMS44NywwLTMuNjgtMC4zOS01LjQ0LTEuMTgKCWMtMS42OC0wLjc2LTMuMTktMS44My00LjUxLTMuMjJjLTEuMzItMS4zNi0yLjM0LTIuOTEtMy4wNy00LjY2Yy0wLjc2LTEuODItMS4xMy0zLjY5LTEuMTMtNS42MlYyNWMwLTEuNTMsMC4yNC0zLjAzLDAuNzItNC41MQoJYzAuNDMtMy41NCwxLjg3LTYuNDYsNC4zMy04Ljc2YzIuNDctMi4zNCw1LjQxLTMuNSw4LjgxLTMuNUMxNjAuMjEsOC4yMywxNjMuMTMsOS40LDE2NS42MSwxMS43M3oiLz4KPHBhdGggY2xhc3M9InN0MyIgZD0iTTIzNi40OCwxOC44MmMwLjI0LDEuMzksMC4zNCwyLjczLDAuMjgsNC4wMmMtMC4wNywxLjkxLTAuNTcsMy43NC0xLjUyLDUuNTFjLTAuOTQsMS43OS0yLjIzLDMuMzUtMy44Niw0LjY5CglsLTEuNDcsMS4xOGwyLjQ1LDIuNjNjMS4zMSwxLjM5LDIuMzEsMi45NSwzLjAxLDQuNjljMC42OSwxLjY4LDEuMDUsMy40LDEuMDgsNS4xNWMwLjIyLDEuMDgsMC4zMywyLjE2LDAuMzEsMy4yMgoJYy0wLjA1LDEuNy0wLjQsMy4zMi0xLjA2LDQuODdjLTAuNjcsMS41OC0xLjU4LDIuOTEtMi43MywzLjk5Yy0xLjE3LDEuMDgtMi40NiwxLjkyLTMuODYsMi41MmMtMS41LDAuNjUtMy4wMSwwLjk4LTQuNTYsMC45OAoJYy0xLjg5LDAtMy43OS0wLjQ1LTUuNjktMS4zN2MtMS44Mi0wLjg2LTMuNDYtMi4wNS00LjkyLTMuNThsLTMuOTctNC4zYy0wLjI0LTAuMjQtMC41MS0wLjM3LTAuOC0wLjM5CgljLTAuMjktMC4wMi0wLjU2LDAuMDktMC44LDAuMzFsLTMuOTcsNC4xMmMtMS40MywxLjQ4LTMuMDcsMi42Mi00LjkyLDMuNDNjLTEuODQsMC44MS0zLjczLDEuMjEtNS42OSwxLjIxCgljLTEuNiwwLTMuMTItMC4yNy00LjU2LTAuODJjLTEuNDQtMC41Ny0yLjcyLTEuMzctMy44NC0yLjRjLTEuNjEtMS41LTIuNzItMy4zMi0zLjMyLTUuNDljLTAuNi0yLjEtMC42Ny00LjI2LTAuMjEtNi40OQoJYzAuMDUtMS43MiwwLjQtMy40LDEuMDYtNS4wNWMwLjY1LTEuNywxLjYtMy4yNCwyLjgzLTQuNjFsMi4zNS0yLjYzbC0xLjM0LTEuMTNjLTEuNjEtMS4zNy0yLjg3LTIuOTYtMy43Ni00Ljc3CgljLTAuOTEtMS43OS0xLjM5LTMuNjItMS40NC01LjUxYzAtMi4xNSwwLjMzLTQuMjMsMS4wMS02LjI2YzAuNjktMi4wNCwxLjU4LTMuNTksMi42OC00LjY0YzEuMS0xLjA1LDIuMzktMS44NiwzLjg3LTIuNDIKCWMxLjQ2LTAuNTcsMy4wMi0wLjg1LDQuNjktMC44NWMxLjgsMCwzLjYsMC4zNCw1LjM5LDFjMS43OSwwLjY3LDMuNDEsMS42MSw0Ljg3LDIuODNsMy40NSwyLjkxYzAuMTcsMC4xNSwwLjQxLDAuMjgsMC43MiwwLjM5CgljMC4yOSwwLjA5LDAuNjEsMC4xMywwLjk1LDAuMTNzMC42Ni0wLjA0LDAuOTUtMC4xM2MwLjMxLTAuMSwwLjU2LTAuMjMsMC43NS0wLjM5bDMuNDMtMi45MWMxLjQ2LTEuMjIsMy4wOC0yLjE2LDQuODctMi44MwoJczMuNTgtMSw1LjM4LTFjMS42NSwwLDMuMjEsMC4yOCw0LjY5LDAuODVjMS40OCwwLjU3LDIuNzcsMS4zNywzLjg2LDIuNDJjMC45NCwwLjkxLDEuNywxLjk0LDIuMjcsMy4wOQoJQzIzNS44NiwxNiwyMzYuMjMsMTcuMjcsMjM2LjQ4LDE4LjgyeiIvPgo8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMTY0LjQ3LDIxLjE0djIyYzAsMi4xMS0wLjczLDMuOTQtMi4xOSw1LjQ5Yy0xLjQ2LDEuNTEtMy4xOSwyLjI3LTUuMTgsMi4yN2MtMS45OCwwLTMuNjktMC43Ni01LjE1LTIuMjcKCWMtMS40OC0xLjU1LTIuMjItMy4zOC0yLjIyLTUuNDl2LTIyYzAtMi4xMywwLjc0LTMuOTYsMi4yMi01LjQ5YzEuNDYtMS41MywzLjE4LTIuMjksNS4xNS0yLjI5YzEuOTksMCwzLjcyLDAuNzYsNS4xOCwyLjI5CglDMTYzLjc0LDE3LjE4LDE2NC40NywxOS4wMSwxNjQuNDcsMjEuMTR6Ii8+CjxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0xODkuMSwxNS4yNmMxLjItMS4xMywyLjgyLTEuNjEsNC44NC0xLjQ0YzIuMDEsMC4xNywzLjg0LDAuOTQsNS40OSwyLjI5bDMuNSwyLjg5YzEuNjcsMS4zNiwzLjY3LDIuMDQsNiwyLjA0CgljMi4zNCwwLDQuMzMtMC42OCw1Ljk4LTIuMDRsMy41My0yLjg5YzEuNjMtMS4zNiwzLjQ3LTIuMTIsNS41MS0yLjI5YzIuMDEtMC4xNywzLjYxLDAuMzEsNC44MiwxLjQ0YzEuMiwxLjEyLDEuNjQsMi41NiwxLjMxLDQuMzMKCWMtMC4zMywxLjc1LTEuMzEsMy4zMS0yLjk2LDQuNjZsLTIuMDYsMS42N2MtMS42NSwxLjM2LTIuNTMsMy4wNy0yLjY1LDUuMTNjLTAuMTQsMi4wNiwwLjUzLDMuODYsMi4wMSw1LjM5bDMuMzUsMy41CgljMS40OCwxLjU1LDIuMjgsMy4zLDIuNCw1LjI2YzAuMTIsMS45Ny0wLjQ3LDMuNTYtMS43OCw0Ljc3Yy0xLjI5LDEuMjItMi45MywxLjcyLTQuOTIsMS40OWMtMS45Ny0wLjI0LTMuNy0xLjEzLTUuMTgtMi42OAoJbC0zLjk5LTQuMTVjLTEuNDYtMS41NS0zLjI1LTIuMzItNS4zNi0yLjMycy0zLjksMC43Ny01LjM2LDIuMzJsLTMuOTksNC4xNWMtMS40OCwxLjU1LTMuMjEsMi40NC01LjIsMi42OAoJYy0xLjk4LDAuMjItMy42Mi0wLjI4LTQuOTItMS40OWMtMS4yOS0xLjItMS44OS0yLjgtMS44LTQuNzljMC4xLTEuOTksMC44OC0zLjc4LDIuMzItNS4zNmwyLjk2LTMuMjVjMS40NC0xLjU4LDIuMS0zLjQzLDEuOTYtNS41NAoJYy0wLjEyLTIuMTEtMS0zLjg2LTIuNjMtNS4yM2wtMS42Mi0xLjQyYy0xLjYzLTEuMzctMi42LTIuOTYtMi45MS00Ljc3QzE4Ny40NSwxNy44MywxODcuOSwxNi4zOCwxODkuMSwxNS4yNnoiLz4KPHBhdGggY2xhc3M9InN0NCIgZD0iTTQxLjM0LDE2LjU1YzIuMDEsMCwzLjcxLDAuOCw1LjEsMi40bDE2LjU5LDE4Ljk5YzEuMzksMS42MiwyLjEyLDMuNDYsMi4xOSw1LjU0CgljMC4wNywyLjA4LTAuNTUsMy43Ny0xLjg2LDUuMDhjLTEuMzIsMS4zMS0zLDEuOTEtNS4wMiwxLjhjLTIuMDMtMC4xMi0zLjgxLTAuOTMtNS4zNi0yLjQybC02LjA1LTUuODIKCWMtMS41My0xLjQ4LTMuMzktMi4yMi01LjU5LTIuMjJzLTQuMDYsMC43NC01LjU5LDIuMjJsLTYuMDYsNS44MmMtMS41NSwxLjQ5LTMuMzMsMi4zLTUuMzYsMi40MmMtMi4wMywwLjEtMy42OS0wLjUtNS0xLjgKCWMtMS4zMi0xLjMtMS45NS0zLTEuODgtNS4wOGMwLjA3LTIuMSwwLjgxLTMuOTQsMi4yMi01LjU0bDE2LjU3LTE4Ljk5QzM3LjY1LDE3LjM1LDM5LjM1LDE2LjU1LDQxLjM0LDE2LjU1eiIvPgo8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNNzkuNTgsMjIuOTZjLTAuMDctMi4wOCwwLjU2LTMuNzgsMS44OC01LjFjMS4zMS0xLjMxLDIuOTQtMS44Niw0LjkyLTEuNjdjMS45NiwwLjE3LDMuNjcsMS4wNCw1LjEzLDIuNgoJbDYuNjcsNy4xNmMxLjQ2LDEuNTYsMy4yMiwyLjM0LDUuMjgsMi4zNGMyLjA4LDAsMy44NC0wLjc4LDUuMjgtMi4zNGw2LjY3LTcuMTZjMS40Ni0xLjU2LDMuMTgtMi40Myw1LjE1LTIuNgoJYzEuOTYtMC4xOSwzLjYsMC4zNyw0LjkyLDEuNjdjMS4zMSwxLjMyLDEuOTIsMy4wMiwxLjg2LDUuMWMtMC4wNywyLjA4LTAuOCwzLjkzLTIuMTksNS41NGwtMTYuNTksMTguOTYKCWMtMS4zOSwxLjYxLTMuMDksMi40Mi01LjEsMi40MmMtMS45OSwwLTMuNjktMC44MS01LjEtMi40Mkw4MS43OSwyOC41QzgwLjM5LDI2Ljg5LDc5LjY1LDI1LjA0LDc5LjU4LDIyLjk2eiIvPgo8L3N2Zz4K", L.appendChild(j), j.onload = function() {
                L.style.display = "block"
            };
            var N = document.createElement("div");
            N.id = "progress-bar-container", L.appendChild(N);
            var u = document.createElement("div");
            u.id = "progress-bar", N.appendChild(u)
        }(), M.on("preload:end", (function() {
            M.p && PokiSDK.gameLoadingFinished(), M.off("preload:progress")
        })), M.on("preload:progress", (function(M) {
            var L = document.getElementById("progress-bar");
            L && (M = Math.min(1, Math.max(0, M)), L.style.width = 100 * M + "%")
        })), M.on("start", (function() {
            var M = document.getElementById("application-splash-wrapper");
            M.parentElement.removeChild(M)
        }))
}));
var MuteButton = pc.createScript("muteButton");
MuteButton.attributes.add("image_mute", {
    type: "asset"
}), MuteButton.prototype.initialize = function() {}, MuteButton.prototype.initialize = function() {
    this.is_muted = !1, this.no_mute_image = this.entity.element.textureAsset, this.entity.button.on("click", (function(t) {
        this.is_muted = !this.is_muted, this.is_muted ? (this.app.systems.sound.volume = 0, this.entity.element.textureAsset = this.image_mute) : (this.entity.element.textureAsset = this.no_mute_image, this.app.systems.sound.volume = 1)
    }), this)
};
var HomeButton = pc.createScript("homeButton");
HomeButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.goToHome()
    }), this), this.entity.enabled = !1
};
var BallShadow = pc.createScript("ballShadow");
BallShadow.attributes.add("ball", {
    type: "entity"
}), BallShadow.attributes.add("max_scale", {
    type: "number"
}), BallShadow.attributes.add("min_scale", {
    type: "number"
}), BallShadow.prototype.initialize = function() {}, BallShadow.prototype.update = function(a) {
    var t = this.ball.getPosition().clone(),
        l = (Math.min(Math.max(2, t.y), 14) - 2) / 12;
    this.entity.setLocalScale(new pc.Vec3(1, 1, 1).mulScalar(pc.math.lerp(this.max_scale, this.min_scale, l))), t.y = .05, this.entity.setLocalPosition(t)
};
pc.extend(pc, function() {
    var VignetteEffect = function(e) {
        var t = {
                aPosition: pc.SEMANTIC_POSITION
            },
            i = ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n"),
            s = ["precision " + e.precision + " float;", "", "uniform sampler2D uColorBuffer;", "uniform float uDarkness;", "uniform float uOffset;", "", "varying vec2 vUv0;", "", "void main() {", "    vec4 texel = texture2D(uColorBuffer, vUv0);", "    vec2 uv = (vUv0 - vec2(0.5)) * vec2(uOffset);", "    gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - uDarkness), dot(uv, uv)), texel.a);", "}"].join("\n");
        this.vignetteShader = new pc.Shader(e, {
            attributes: t,
            vshader: i,
            fshader: s
        }), this.offset = 1, this.darkness = 1
    };
    return (VignetteEffect = pc.inherits(VignetteEffect, pc.PostEffect)).prototype = pc.extend(VignetteEffect, {
        render: function(e, t, i) {
            var s = this.device,
                f = s.scope;
            f.resolve("uColorBuffer").setValue(e.colorBuffer), f.resolve("uOffset").setValue(this.offset), f.resolve("uDarkness").setValue(this.darkness), pc.drawFullscreenQuad(s, t, this.vertexBuffer, this.vignetteShader, i)
        }
    }), {
        VignetteEffect: VignetteEffect
    }
}());
var Vignette = pc.createScript("vignette");
Vignette.attributes.add("offset", {
    type: "number",
    default: 1,
    min: 0,
    precision: 5,
    title: "Offset"
}), Vignette.attributes.add("darkness", {
    type: "number",
    default: 1,
    precision: 5,
    title: "Darkness"
}), Vignette.prototype.initialize = function() {
    this.effect = new pc.VignetteEffect(this.app.graphicsDevice), this.effect.offset = this.offset, this.effect.darkness = this.darkness, this.on("attr", (function(e, t) {
        this.effect[e] = t
    }), this);
    var e = this.entity.camera.postEffects;
    e.addEffect(this.effect), this.on("state", (function(t) {
        t ? e.addEffect(this.effect) : e.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        e.removeEffect(this.effect)
    }))
};

function VerticalTiltShiftEffect(t) {
    pc.PostEffect.call(this, t), this.shader = new pc.Shader(t, {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION
        },
        vshader: ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n"),
        fshader: ["precision " + t.precision + " float;", "", "uniform sampler2D uColorBuffer;", "uniform float uV;", "uniform float uR;", "", "varying vec2 vUv0;", "", "void main() {", "    vec4 sum = vec4( 0.0 );", "    float vv = uV * abs( uR - vUv0.y );", "", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y - 4.0 * vv ) ) * 0.051;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y - 3.0 * vv ) ) * 0.0918;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y - 2.0 * vv ) ) * 0.12245;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y - 1.0 * vv ) ) * 0.1531;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y ) ) * 0.1633;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y + 1.0 * vv ) ) * 0.1531;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y + 2.0 * vv ) ) * 0.12245;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y + 3.0 * vv ) ) * 0.0918;", "    sum += texture2D( uColorBuffer, vec2( vUv0.x, vUv0.y + 4.0 * vv ) ) * 0.051;", "", "    gl_FragColor = sum;", "}"].join("\n")
    }), this.focus = .35
}
VerticalTiltShiftEffect.prototype = Object.create(pc.PostEffect.prototype), VerticalTiltShiftEffect.prototype.constructor = VerticalTiltShiftEffect, Object.assign(VerticalTiltShiftEffect.prototype, {
    render: function(t, e, i) {
        var f = this.device,
            v = f.scope;
        v.resolve("uV").setValue(1 / t.height), v.resolve("uR").setValue(this.focus), v.resolve("uColorBuffer").setValue(t.colorBuffer), pc.drawFullscreenQuad(f, e, this.vertexBuffer, this.shader, i)
    }
});
var VerticalTiltShift = pc.createScript("verticalTiltShift");
VerticalTiltShift.attributes.add("focus", {
    type: "number",
    default: .35,
    min: 0,
    max: 1,
    title: "Focus"
}), VerticalTiltShift.prototype.initialize = function() {
    this.effect = new VerticalTiltShiftEffect(this.app.graphicsDevice), this.effect.focus = this.focus, this.on("attr:focus", (function(t) {
        this.effect.focus = t
    }), this);
    var t = this.entity.camera.postEffects;
    t.addEffect(this.effect), this.on("state", (function(e) {
        e ? t.addEffect(this.effect) : t.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        t.removeEffect(this.effect)
    }))
};
pc.extend(pc, function() {
    function computeGaussian(e, t) {
        return 1 / Math.sqrt(2 * Math.PI * t) * Math.exp(-e * e / (2 * t * t))
    }

    function calculateBlurValues(e, t, s, o, r) {
        e[0] = computeGaussian(0, r), t[0] = 0, t[1] = 0;
        var i, a, l = e[0];
        for (i = 0, a = Math.floor(7.5); i < a; i++) {
            var u = computeGaussian(i + 1, r);
            e[2 * i] = u, e[2 * i + 1] = u, l += 2 * u;
            var h = 2 * i + 1.5;
            t[4 * i] = s * h, t[4 * i + 1] = o * h, t[4 * i + 2] = -s * h, t[4 * i + 3] = -o * h
        }
        for (i = 0, a = e.length; i < a; i++) e[i] /= l
    }
    var BloomEffect = function(e) {
        var t = {
                aPosition: pc.SEMANTIC_POSITION
            },
            s = ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition + 1.0) * 0.5;", "}"].join("\n"),
            o = ["precision " + e.precision + " float;", "", "varying vec2 vUv0;", "", "uniform sampler2D uBaseTexture;", "uniform float uBloomThreshold;", "", "void main(void)", "{", "    vec4 color = texture2D(uBaseTexture, vUv0);", "", "    gl_FragColor = clamp((color - uBloomThreshold) / (1.0 - uBloomThreshold), 0.0, 1.0);", "}"].join("\n"),
            r = ["precision " + e.precision + " float;", "", "#define SAMPLE_COUNT 15", "", "varying vec2 vUv0;", "", "uniform sampler2D uBloomTexture;", "uniform vec2 uBlurOffsets[SAMPLE_COUNT];", "uniform float uBlurWeights[SAMPLE_COUNT];", "", "void main(void)", "{", "    vec4 color = vec4(0.0);", "    for (int i = 0; i < SAMPLE_COUNT; i++)", "    {", "        color += texture2D(uBloomTexture, vUv0 + uBlurOffsets[i]) * uBlurWeights[i];", "    }", "", "    gl_FragColor = color;", "}"].join("\n"),
            i = ["precision " + e.precision + " float;", "", "varying vec2 vUv0;", "", "uniform float uBloomEffectIntensity;", "uniform sampler2D uBaseTexture;", "uniform sampler2D uBloomTexture;", "", "void main(void)", "{", "    vec4 bloom = texture2D(uBloomTexture, vUv0) * uBloomEffectIntensity;", "    vec4 base = texture2D(uBaseTexture, vUv0);", "", "    base *= (1.0 - clamp(bloom, 0.0, 1.0));", "", "    gl_FragColor = base + bloom;", "}"].join("\n");
        this.extractShader = new pc.Shader(e, {
            attributes: t,
            vshader: s,
            fshader: o
        }), this.blurShader = new pc.Shader(e, {
            attributes: t,
            vshader: s,
            fshader: r
        }), this.combineShader = new pc.Shader(e, {
            attributes: t,
            vshader: s,
            fshader: i
        });
        var a = e.width,
            l = e.height;
        this.targets = [];
        for (var u = 0; u < 2; u++) {
            var h = new pc.Texture(e, {
                format: pc.PIXELFORMAT_R8_G8_B8_A8,
                width: a >> 1,
                height: l >> 1
            });
            h.minFilter = pc.FILTER_LINEAR, h.magFilter = pc.FILTER_LINEAR, h.addressU = pc.ADDRESS_CLAMP_TO_EDGE, h.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
            var n = new pc.RenderTarget(e, h, {
                depth: !1
            });
            this.targets.push(n)
        }
        this.bloomThreshold = .25, this.blurAmount = 4, this.bloomIntensity = 1.25, this.sampleWeights = new Float32Array(15), this.sampleOffsets = new Float32Array(30)
    };
    return (BloomEffect = pc.inherits(BloomEffect, pc.PostEffect)).prototype = pc.extend(BloomEffect.prototype, {
        render: function(e, t, s) {
            var o = this.device,
                r = o.scope;
            r.resolve("uBloomThreshold").setValue(this.bloomThreshold), r.resolve("uBaseTexture").setValue(e.colorBuffer), pc.drawFullscreenQuad(o, this.targets[0], this.vertexBuffer, this.extractShader), calculateBlurValues(this.sampleWeights, this.sampleOffsets, 1 / this.targets[1].width, 0, this.blurAmount), r.resolve("uBlurWeights[0]").setValue(this.sampleWeights), r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets), r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer), pc.drawFullscreenQuad(o, this.targets[1], this.vertexBuffer, this.blurShader), calculateBlurValues(this.sampleWeights, this.sampleOffsets, 0, 1 / this.targets[0].height, this.blurAmount), r.resolve("uBlurWeights[0]").setValue(this.sampleWeights), r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets), r.resolve("uBloomTexture").setValue(this.targets[1].colorBuffer), pc.drawFullscreenQuad(o, this.targets[0], this.vertexBuffer, this.blurShader), r.resolve("uBloomEffectIntensity").setValue(this.bloomIntensity), r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer), r.resolve("uBaseTexture").setValue(e.colorBuffer), pc.drawFullscreenQuad(o, t, this.vertexBuffer, this.combineShader, s)
        }
    }), {
        BloomEffect: BloomEffect
    }
}());
var Bloom = pc.createScript("bloom");
Bloom.attributes.add("bloomIntensity", {
    type: "number",
    default: 1,
    min: 0,
    title: "Intensity"
}), Bloom.attributes.add("bloomThreshold", {
    type: "number",
    default: .25,
    min: 0,
    max: 1,
    precision: 2,
    title: "Threshold"
}), Bloom.attributes.add("blurAmount", {
    type: "number",
    default: 4,
    min: 1,
    title: "Blur amount"
}), Bloom.prototype.initialize = function() {
    this.effect = new pc.BloomEffect(this.app.graphicsDevice), this.effect.bloomThreshold = this.bloomThreshold, this.effect.blurAmount = this.blurAmount, this.effect.bloomIntensity = this.bloomIntensity;
    var e = this.entity.camera.postEffects;
    e.addEffect(this.effect), this.on("attr", (function(e, t) {
        this.effect[e] = t
    }), this), this.on("state", (function(t) {
        t ? e.addEffect(this.effect) : e.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        e.removeEffect(this.effect)
    }))
};
pc.extend(pc, function() {
    var HueSaturationEffect = function(t) {
        this.shader = new pc.Shader(t, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n"),
            fshader: ["precision " + t.precision + " float;", "uniform sampler2D uColorBuffer;", "uniform float uHue;", "uniform float uSaturation;", "varying vec2 vUv0;", "void main() {", "gl_FragColor = texture2D( uColorBuffer, vUv0 );", "float angle = uHue * 3.14159265;", "float s = sin(angle), c = cos(angle);", "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;", "float len = length(gl_FragColor.rgb);", "gl_FragColor.rgb = vec3(", "dot(gl_FragColor.rgb, weights.xyz),", "dot(gl_FragColor.rgb, weights.zxy),", "dot(gl_FragColor.rgb, weights.yzx)", ");", "float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;", "if (uSaturation > 0.0) {", "gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - uSaturation));", "} else {", "gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-uSaturation);", "}", "}"].join("\n")
        }), this.hue = 0, this.saturation = 0
    };
    return (HueSaturationEffect = pc.inherits(HueSaturationEffect, pc.PostEffect)).prototype = pc.extend(HueSaturationEffect.prototype, {
        render: function(t, e, r) {
            var o = this.device,
                a = o.scope;
            a.resolve("uHue").setValue(this.hue), a.resolve("uSaturation").setValue(this.saturation), a.resolve("uColorBuffer").setValue(t.colorBuffer), pc.drawFullscreenQuad(o, e, this.vertexBuffer, this.shader, r)
        }
    }), {
        HueSaturationEffect: HueSaturationEffect
    }
}());
var HueSaturation = pc.createScript("hueSaturation");
HueSaturation.attributes.add("hue", {
    type: "number",
    default: 0,
    min: -1,
    max: 1,
    precision: 5,
    title: "Hue"
}), HueSaturation.attributes.add("saturation", {
    type: "number",
    default: 0,
    min: -1,
    max: 1,
    precision: 5,
    title: "Saturation"
}), HueSaturation.prototype.initialize = function() {
    this.effect = new pc.HueSaturationEffect(this.app.graphicsDevice), this.effect.hue = this.hue, this.effect.saturation = this.saturation, this.on("attr", (function(t, e) {
        this.effect[t] = e
    }), this);
    var t = this.entity.camera.postEffects;
    t.addEffect(this.effect), this.on("state", (function(e) {
        e ? t.addEffect(this.effect) : t.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        t.removeEffect(this.effect)
    }))
};
pc.extend(pc, function() {
    var SepiaEffect = function(t) {
        this.shader = new pc.Shader(t, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n"),
            fshader: ["precision " + t.precision + " float;", "", "uniform float uAmount;", "uniform sampler2D uColorBuffer;", "", "varying vec2 vUv0;", "", "void main() {", "    vec4 color = texture2D(uColorBuffer, vUv0);", "    vec3 c = color.rgb;", "", "    color.r = dot(c, vec3(1.0 - 0.607 * uAmount, 0.769 * uAmount, 0.189 * uAmount));", "    color.g = dot(c, vec3(0.349 * uAmount, 1.0 - 0.314 * uAmount, 0.168 * uAmount));", "    color.b = dot(c, vec3(0.272 * uAmount, 0.534 * uAmount, 1.0 - 0.869 * uAmount));", "", "    gl_FragColor = vec4(min(vec3(1.0), color.rgb), color.a);", "}"].join("\n")
        }), this.amount = 1
    };
    return (SepiaEffect = pc.inherits(SepiaEffect, pc.PostEffect)).prototype = pc.extend(SepiaEffect.prototype, {
        render: function(t, e, o) {
            var i = this.device,
                n = i.scope;
            n.resolve("uAmount").setValue(this.amount), n.resolve("uColorBuffer").setValue(t.colorBuffer), pc.drawFullscreenQuad(i, e, this.vertexBuffer, this.shader, o)
        }
    }), {
        SepiaEffect: SepiaEffect
    }
}());
var Sepia = pc.createScript("sepia");
Sepia.attributes.add("amount", {
    type: "number",
    default: 1,
    min: 0,
    max: 1,
    title: "Amount"
}), Sepia.prototype.initialize = function() {
    this.effect = new pc.SepiaEffect(this.app.graphicsDevice), this.effect.amount = this.amount, this.on("attr:amount", (function(t) {
        this.effect.amount = t
    }), this);
    var t = this.entity.camera.postEffects;
    t.addEffect(this.effect), this.on("state", (function(e) {
        e ? t.addEffect(this.effect) : t.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        t.removeEffect(this.effect)
    }))
};
var Constraint = pc.createScript("constraint");
Constraint.attributes.add("partA", {
    type: "entity",
    title: "Part A"
}), Constraint.attributes.add("partB", {
    type: "entity",
    title: "Part B"
}), Constraint.attributes.add("angularLowerLimit", {
    type: "vec3",
    title: "Angular Lower Limits (degrees)"
}), Constraint.attributes.add("angularUpperLimit", {
    type: "vec3",
    title: "Angular Upper Limits (degrees)"
}), Constraint.attributes.add("partOrientationOffsetA", {
    type: "vec3",
    title: "Part A Orientation Offset (degrees)"
}), Constraint.attributes.add("partOrientationOffsetB", {
    type: "vec3",
    title: "Part B Orientation Offset (degrees)"
}), Constraint.attributes.add("disableCollision", {
    type: "boolean",
    default: !1,
    title: "Disable Collision"
}), Constraint.attributes.add("debugDraw", {
    type: "boolean",
    default: !1,
    title: "Debug Draw"
}), Constraint.prototype.initialize = function() {
    this.createJoint(), this.white = new pc.Color(1, 1, 1, 1), this.temp = new pc.Vec3, this.on("attr:limits", (function(t, i) {}))
}, Constraint.prototype.draw = function() {
    this.app.renderLine(this.partA.getPosition(), this.entity.getPosition(), this.white), this.app.renderLine(this.partB.getPosition(), this.entity.getPosition(), this.white)
}, Constraint.prototype.update = function(t) {
    this.debugDraw && this.draw()
}, Constraint.prototype.createJoint = function() {
    var t = this.partA.rigidbody.body,
        i = this.partB.rigidbody.body,
        e = new pc.Vec3,
        n = this.partA.getWorldTransform().clone();
    n.invert(), n.transformPoint(this.entity.getPosition(), e);
    var s = new pc.Vec3,
        r = this.partB.getWorldTransform().clone();
    r.invert(), r.transformPoint(this.entity.getPosition(), s);
    var a = new Ammo.btTransform,
        o = new Ammo.btTransform;
    a.setIdentity(), o.setIdentity();
    var p = this.partOrientationOffsetA,
        d = this.partOrientationOffsetB;
    a.getBasis().setEulerZYX(p.x * pc.math.DEG_TO_RAD, p.y * pc.math.DEG_TO_RAD, p.z * pc.math.DEG_TO_RAD), a.setOrigin(new Ammo.btVector3(e.x, e.y, e.z)), o.getBasis().setEulerZYX(d.x * pc.math.DEG_TO_RAD, d.y * pc.math.DEG_TO_RAD, d.z * pc.math.DEG_TO_RAD), o.setOrigin(new Ammo.btVector3(s.x, s.y, s.z)), this.joint = new Ammo.btGeneric6DofConstraint(t, i, a, o, !0);
    var h = this.angularLowerLimit,
        m = this.angularUpperLimit,
        l = new Ammo.btVector3(h.x, h.y, h.z),
        c = new Ammo.btVector3(m.x, m.y, m.z);
    this.joint.setAngularLowerLimit(l), this.joint.setAngularUpperLimit(c), this.app.systems.rigidbody.dynamicsWorld.addConstraint(this.joint, this.disableCollision)
};
var HingeConstraint = pc.createScript("hingeConstraint");
HingeConstraint.attributes.add("partA", {
    type: "entity",
    title: "Part A"
}), HingeConstraint.attributes.add("partB", {
    type: "entity",
    title: "Part B"
}), HingeConstraint.attributes.add("limits", {
    type: "vec2",
    title: "Joint Limits (degrees)"
}), HingeConstraint.attributes.add("partOrientationOffsetA", {
    type: "vec3",
    title: "Part A Orientation Offset (degrees)"
}), HingeConstraint.attributes.add("partOrientationOffsetB", {
    type: "vec3",
    title: "Part B Orientation Offset (degrees)"
}), HingeConstraint.attributes.add("disableCollision", {
    type: "boolean",
    default: !1,
    title: "Disable Collision"
}), HingeConstraint.attributes.add("debugDraw", {
    type: "boolean",
    default: !1,
    title: "Debug Draw"
}), HingeConstraint.prototype.initialize = function() {
    this.createJoint(), this.white = new pc.Color(1, 1, 1, 1), this.temp = new pc.Vec3, this.on("attr:limits", (function(t, i) {
        this.joint.setLimit(t.x * pc.math.DEG_TO_RAD, t.y * pc.math.DEG_TO_RAD, .9, .3, 1)
    }))
}, HingeConstraint.prototype.draw = function() {
    this.app.renderLine(this.partA.getPosition(), this.entity.getPosition(), this.white), this.app.renderLine(this.partB.getPosition(), this.entity.getPosition(), this.white)
}, HingeConstraint.prototype.update = function(t) {
    this.debugDraw && this.draw()
}, HingeConstraint.prototype.createJoint = function() {
    var t = this.partA.rigidbody.body,
        i = this.partB.rigidbody.body,
        e = new pc.Vec3,
        n = this.partA.getWorldTransform().clone();
    n.invert(), n.transformPoint(this.entity.getPosition(), e);
    var s = new pc.Vec3,
        r = this.partB.getWorldTransform().clone();
    r.invert(), r.transformPoint(this.entity.getPosition(), s);
    var a = new Ammo.btTransform,
        o = new Ammo.btTransform;
    a.setIdentity(), o.setIdentity();
    var p = this.partOrientationOffsetA,
        d = this.partOrientationOffsetB;
    a.getBasis().setEulerZYX(p.x * pc.math.DEG_TO_RAD, p.y * pc.math.DEG_TO_RAD, p.z * pc.math.DEG_TO_RAD), a.setOrigin(new Ammo.btVector3(e.x, e.y, e.z)), o.getBasis().setEulerZYX(d.x * pc.math.DEG_TO_RAD, d.y * pc.math.DEG_TO_RAD, d.z * pc.math.DEG_TO_RAD), o.setOrigin(new Ammo.btVector3(s.x, s.y, s.z)), this.joint = new Ammo.btHingeConstraint(t, i, a, o), this.joint.setLimit(this.limits.x * pc.math.DEG_TO_RAD, this.limits.y * pc.math.DEG_TO_RAD, .9, .3, 1), this.app.systems.rigidbody.dynamicsWorld.addConstraint(this.joint, this.disableCollision)
};
var ConeTwistConstraint = pc.createScript("coneTwistConstraint");
ConeTwistConstraint.attributes.add("partA", {
    type: "entity",
    title: "Part A"
}), ConeTwistConstraint.attributes.add("partB", {
    type: "entity",
    title: "Part B"
}), ConeTwistConstraint.attributes.add("limits", {
    type: "vec3",
    title: "Joint Limits (degrees)"
}), ConeTwistConstraint.attributes.add("partOrientationOffsetA", {
    type: "vec3",
    title: "Part A Orientation Offset (degrees)"
}), ConeTwistConstraint.attributes.add("partOrientationOffsetB", {
    type: "vec3",
    title: "Part B Orientation Offset (degrees)"
}), ConeTwistConstraint.attributes.add("disableCollision", {
    type: "boolean",
    default: !1,
    title: "Disable Collision"
}), ConeTwistConstraint.prototype.initialize = function() {
    this.createJoint(), this.on("attr:limits", (function(t, i) {
        this.joint.setLimit(this.limits.y * pc.math.DEG_TO_RAD, this.limits.z * pc.math.DEG_TO_RAD, this.limits.x * pc.math.DEG_TO_RAD)
    }))
}, ConeTwistConstraint.prototype.createJoint = function() {
    var t = this.partA.rigidbody.body,
        i = this.partB.rigidbody.body,
        e = new pc.Vec3,
        n = this.partA.getWorldTransform().clone();
    n.invert(), n.transformPoint(this.entity.getPosition(), e);
    var s = new pc.Vec3,
        r = this.partB.getWorldTransform().clone();
    r.invert(), r.transformPoint(this.entity.getPosition(), s);
    var a = new Ammo.btTransform,
        o = new Ammo.btTransform;
    a.setIdentity(), o.setIdentity();
    var p = this.partOrientationOffsetA,
        d = this.partOrientationOffsetB;
    a.getBasis().setEulerZYX(p.x * pc.math.DEG_TO_RAD, p.y * pc.math.DEG_TO_RAD, p.z * pc.math.DEG_TO_RAD), a.setOrigin(new Ammo.btVector3(e.x, e.y, e.z)), o.getBasis().setEulerZYX(d.x * pc.math.DEG_TO_RAD, d.y * pc.math.DEG_TO_RAD, d.z * pc.math.DEG_TO_RAD), o.setOrigin(new Ammo.btVector3(s.x, s.y, s.z)), this.joint = new Ammo.btConeTwistConstraint(t, i, a, o), this.joint.setLimit(3, this.limits.x * pc.math.DEG_TO_RAD), this.joint.setLimit(4, this.limits.y * pc.math.DEG_TO_RAD), this.joint.setLimit(5, this.limits.z * pc.math.DEG_TO_RAD), this.joint.setAngularOnly(!0), this.app.systems.rigidbody.dynamicsWorld.addConstraint(this.joint, this.disableCollision)
};
var Head = pc.createScript("head");
Head.prototype.initialize = function() {}, Head.prototype.update = function(e) {
    this.entity.rigidbody.applyImpulse(new pc.Vec3(0, .01, 0))
};
var Menu = pc.createScript("menu");
Menu.attributes.add("car_menu_01", {
    type: "entity"
}), Menu.attributes.add("car_menu_head_01", {
    type: "entity"
}), Menu.attributes.add("car_menu_flag_01", {
    type: "entity"
}), Menu.attributes.add("car_menu_02", {
    type: "entity"
}), Menu.attributes.add("car_menu_head_02", {
    type: "entity"
}), Menu.attributes.add("car_menu_flag_02", {
    type: "entity"
}), Menu.prototype.initialize = function() {
    this.start_pos_01 = this.car_menu_01.getPosition().clone(), this.start_pos_02 = this.car_menu_02.getPosition().clone(), this.start_rot_01 = this.car_menu_01.getRotation().clone(), this.start_rot_02 = this.car_menu_02.getRotation().clone()
}, Menu.prototype.resetCar01 = function() {
    this.car_menu_head_01.enabled = !1, this.car_menu_flag_01.enabled = !1, this.car_menu_01.rigidbody.teleport(this.start_pos_01, this.start_rot_01), this.car_menu_01.rigidbody.linearVelocity = new pc.Vec3, this.car_menu_01.rigidbody.angularVelocity = new pc.Vec3, this.car_menu_head_01.enabled = !0, this.car_menu_flag_01.enabled = !0
}, Menu.prototype.resetCar02 = function() {
    this.car_menu_head_02.enabled = !1, this.car_menu_flag_02.enabled = !1, this.car_menu_02.rigidbody.teleport(this.start_pos_02, this.start_rot_02), this.car_menu_02.rigidbody.linearVelocity = new pc.Vec3, this.car_menu_02.rigidbody.angularVelocity = new pc.Vec3, this.car_menu_head_02.enabled = !0, this.car_menu_flag_02.enabled = !0
};
var PlayButton = pc.createScript("playButton");
PlayButton.prototype.update = function(t) {
    this.app.keyboard.isPressed(pc.KEY_ENTER) && GameManager.instance.onPlay()
}, PlayButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.onPlay()
    }), this)
};
var CarMenu = pc.createScript("carMenu");
CarMenu.attributes.add("head", {
    type: "entity"
}), CarMenu.attributes.add("flag", {
    type: "entity"
}), CarMenu.prototype.initialize = function() {
    this.start_pos_01 = this.entity.getPosition().clone(), this.start_rot_01 = this.entity.getRotation().clone()
}, CarMenu.prototype.resetCar = function() {
    this.head.enabled = !1, this.flag.enabled = !1, this.entity.rigidbody.teleport(this.start_pos_01, this.start_rot_01), this.entity.rigidbody.linearVelocity = new pc.Vec3, this.entity.rigidbody.angularVelocity = new pc.Vec3, this.head.enabled = !0, this.flag.enabled = !0
};
var Rotate = pc.createScript("rotate");
Rotate.attributes.add("rotationSpeed", {
    type: "number",
    default: 10
}), Rotate.prototype.initialize = function() {}, Rotate.prototype.update = function(t) {
    this.entity.rotateLocal(0, t * this.rotationSpeed, 0)
};
var AntenaHit = pc.createScript("antenaHit");
AntenaHit.attributes.add("particle_system", {
    type: "entity"
}), AntenaHit.prototype.initialize = function() {
    this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, AntenaHit.prototype.onTriggerEnter = function(t) {
    console.log("antenahit")
}, AntenaHit.prototype.onTimerEnd = function() {
    this.particle_system.particlesystem.stop()
};
var TutoControls = pc.createScript("tutoControls");
TutoControls.attributes.add("controls_scheme", {
    type: "string",
    enum: [{
        wasd: "wasd"
    }, {
        arrows: "arrows"
    }]
}), TutoControls.attributes.add("car", {
    type: "entity"
}), TutoControls.prototype.initialize = function() {
    this.opacity_to = 0, this.entity.element.opacity = 0, this.animate = !1
}, TutoControls.prototype.update = function(t) {
    this.animate && (this.entity.element.opacity = pc.math.lerp(this.entity.element.opacity, this.opacity_to, 5 * t))
}, TutoControls.prototype.stop = function() {
    null != this._timerHandle && pc.timer.remove(this._timerHandle), this.animate = !1, this.opacity_to = 0, this.entity.element.opacity = 0
}, TutoControls.prototype.reset = function() {
    this.app.touch || this.car.script.controls.controls_scheme == this.controls_scheme && (this.entity.element.opacity = 0, this.animate = !0, this.opacity_to = 0, this._timerHandle = pc.timer.add(1, this.etapa01, this))
}, TutoControls.prototype.etapa01 = function() {
    this.opacity_to = 1, this._timerHandle = pc.timer.add(2, this.etapa02, this)
}, TutoControls.prototype.etapa02 = function() {
    this.opacity_to = 0, this._timerHandle = pc.timer.add(1, this.etapa03, this)
}, TutoControls.prototype.etapa03 = function() {
    this.opacity_to = 0, this.entity.element.opacity = 0, this.animate = !1
};
var Flag = pc.createScript("flag");
Flag.attributes.add("particle_ball", {
    type: "entity"
}), Flag.attributes.add("particle_flag", {
    type: "entity"
}), Flag.prototype.initialize = function() {
    this.entity.collision.on("collisionstart", this.onCollisionStart, this)
}, Flag.prototype.onCollisionStart = function(t) {
    t.other.script && t.other.script.ball && t.other.script.ball.alive && (console.log("hit con bola"), this.particle_ball.particlesystem.play(), this._timerHandle = pc.timer.add(.2, this.onTimerEnd, this), this.particle_flag.particlesystem.play(), this._timerHandle = pc.timer.add(.1, this.onTimerEnd2, this))
}, Flag.prototype.onTimerEnd = function() {
    this.particle_ball.particlesystem.stop()
}, Flag.prototype.onTimerEnd2 = function() {
    this.particle_flag.particlesystem.stop()
};
var JoyStickLeft = pc.createScript("JoyStickLeft");
JoyStickLeft.attributes.add("handle", {
    type: "entity",
    default: null,
    title: "Handle"
}), JoyStickLeft.attributes.add("axis", {
    type: "string",
    default: "y",
    title: "Axis",
    description: "lock drag to axis: x, y or xy"
}), JoyStickLeft.attributes.add("Target", {
    type: "entity"
}), JoyStickLeft.attributes.add("circle", {
    type: "entity"
});
var deltaTime = 0;
JoyStickLeft.prototype.postInitialize = function() {
    if (!this.app.touch) return this.entity.enabled = !1, void(this.circle.enabled = !1);
    if (this.entity.setPosition(this.circle.getPosition()), !this.handle) throw new Error("JoyStickLeft has no handle");
    this.addHandleListeners(), this.isDragging = !1, this.touchId = -1, this.mousePos = new pc.Vec3, this.anchorPos = this.handle.getLocalPosition().clone(), this.screen = this.getUIScreenComponent(), this.app.graphicsDevice.on("resizecanvas", this.resizeCanvas, this)
}, JoyStickLeft.prototype.resizeCanvas = function() {
    this.entity.setPosition(this.circle.getPosition()), this.isDragging = !1, this.touchId = -1, this.mousePos = new pc.Vec3, this.anchorPos = this.handle.getLocalPosition().clone(), this.screen = this.getUIScreenComponent()
}, JoyStickLeft.prototype.getUIScreenComponent = function() {
    return this.handle.element.screen.screen
}, JoyStickLeft.prototype.addHandleListeners = function() {
    this.handle.element.useInput = !0, this.handle.element.on(pc.EVENT_MOUSEDOWN, this.onPressDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onPressUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onPressMove, this), this.app.touch && (console.log("initing touches"), this.handle.element.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this), this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this)), this.on("destroy", (function() {
        this.handle.element.off(pc.EVENT_MOUSEDOWN, this.onPressDown, this), this.app.mouse.off(pc.EVENT_MOUSEUP, this.onPressUp, this), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onPressMove, this), this.app.touch && (this.handle.element.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this), this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this), this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this))
    }))
}, JoyStickLeft.prototype.onTouchStart = function(t) {
    var e = t.changedTouches[0];
    this.touchId = e.identifier, this.startDrag(t.x, t.y), t.event.stopPropagation()
}, JoyStickLeft.prototype.onTouchMove = function(t) {
    for (var e = 0; e < t.changedTouches.length; e++) {
        var i = t.changedTouches[e];
        if (i.id == this.touchId) return t.event.stopPropagation(), void this.updateMove(i.x, i.y)
    }
}, JoyStickLeft.prototype.onTouchEnd = function(t) {
    for (var e = 0; e < t.changedTouches.length; e++) {
        var i = t.changedTouches[e];
        if (i.id == this.touchId) return t.event.stopImmediatePropagation(), this.touchId = -1, void this.endDrag(i.x, i.y)
    }
}, JoyStickLeft.prototype.onPressDown = function(t) {
    t.event.stopImmediatePropagation(), this.startDrag(t.x, t.y)
}, JoyStickLeft.prototype.onPressUp = function(t) {
    t.event.stopImmediatePropagation(), this.endDrag(t.x, t.y)
}, JoyStickLeft.prototype.onPressMove = function(t) {
    this.updateMove(t.x, t.y), t.event.stopImmediatePropagation()
}, JoyStickLeft.prototype.startDrag = function(t, e) {
    this.isDragging = !0, this.setMouseXY(t, e)
}, JoyStickLeft.prototype.updateMove = function(t, e) {
    this.isDragging && this.setMouseXY(t, e)
}, JoyStickLeft.prototype.endDrag = function(t, e) {
    this.isDragging = !1, this.setMouseXY(t, e)
}, JoyStickLeft.prototype.setMouseXY = function(t, e) {
    this.mousePos.x = t, this.mousePos.y = e
}, JoyStickLeft.prototype.update = function(t) {
    deltaTime = t, this.updateDrag()
};
var cursorPosition = new pc.Vec3(0, 0, 0);
JoyStickLeft.prototype.LimitInCircle = function(t, e, i) {
    var o = new pc.Vec3(0, 0, 0),
        s = (o = o.sub2(t, e)).length(),
        n = new pc.Vec3(0, 0, 0);
    return n = o.scale(1 / s), cursorPosition = s > i ? cursorPosition.add2(e, n.scale(i)) : t
}, JoyStickLeft.prototype.Horizontal = function(t) {
    return new pc.Vec3(1, 0, 0).mul(t)
}, JoyStickLeft.prototype.Vertical = function(t) {
    return new pc.Vec3(0, 1, 0).mul(t)
}, JoyStickLeft.prototype.updateDrag = function() {
    if (!this.Target.script.movement.allow_control || "ai" == this.Target.script.controls.controls_scheme) return this.entity.element.enabled = !1, void(this.circle.enabled = !1);
    if (this.entity.element.enabled = !0, this.circle.enabled = !0, this.handle.setLocalPosition(this.anchorPos), this.Target.script.movement.c_right = !1, this.Target.script.movement.c_left = !1, this.Target.script.movement.c_up = !1, this.isDragging) {
        var t = this.app.graphicsDevice,
            e = this.handle.element.anchor.x * t.width,
            i = this.handle.element.anchor.y * t.height,
            o = 1 / this.screen.scale,
            s = "x" == this.axis || "xy" == this.axis ? (this.mousePos.x - e) * o : this.anchorPos.x,
            n = "y" == this.axis || "xy" == this.axis ? (-this.mousePos.y + i) * o : this.anchorPos.y,
            h = this.LimitInCircle(new pc.Vec3(s, n, 0), this.anchorPos, 50),
            c = new pc.Vec3(0, 0, 0),
            r = (c = c.sub2(this.Horizontal(this.anchorPos), this.Horizontal(h))).length() / 50,
            a = new pc.Vec3(0, 0, 0),
            p = (a = a.sub2(this.Vertical(this.anchorPos), this.Vertical(h))).length() / 50;
        h.x < this.anchorPos.x && (r *= -1), h.y < this.anchorPos.y && (p *= -1);
        Math.atan2(p, r);
        var u = new pc.Vec2(this.Target.forward.x, this.Target.forward.z),
            l = new pc.Vec2(-r, p),
            d = this.getSignedAngleDiff(u, l) - 90;
        l.length() > .5 ? (this.Target.script.movement.c_right = d > 30, this.Target.script.movement.c_left = d < -30, this.Target.script.movement.c_up = !0) : (this.Target.script.movement.c_right = !1, this.Target.script.movement.c_left = !1, this.Target.script.movement.c_up = !1), this.handle.setLocalPosition(h)
    }
}, JoyStickLeft.prototype.getSignedAngleDiff = function(t, e) {
    var i = Math.sqrt(t.x * t.x + t.y * t.y) * Math.sqrt(e.x * e.x + e.y * e.y),
        o = (t.x * e.y - e.x * t.y) / i,
        s = (t.x * e.x + t.y * e.y) / i;
    return Math.atan2(o, s) * pc.math.RAD_TO_DEG
};
var NextSkin = pc.createScript("nextSkin");
NextSkin.attributes.add("team", {
    type: "number",
    enum: [{
        1: "1"
    }, {
        2: "2"
    }]
}), NextSkin.attributes.add("skin_screen", {
    type: "entity"
}), NextSkin.prototype.update = function(t) {}, NextSkin.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.nextSkin(this.team), this.skin_screen.script.skinsScreen.updateScreen()
    }), this)
};
var GotoSkinsButton = pc.createScript("gotoSkinsButton");
GotoSkinsButton.prototype.initialize = function() {}, GotoSkinsButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.onGoToSkins()
    }), this)
};
var SkinsScreen = pc.createScript("skinsScreen");
SkinsScreen.attributes.add("selectors_p1", {
    type: "entity"
}), SkinsScreen.attributes.add("selectors_p2", {
    type: "entity"
}), SkinsScreen.attributes.add("car_p1", {
    type: "entity"
}), SkinsScreen.attributes.add("car_p2", {
    type: "entity"
}), SkinsScreen.attributes.add("play_button", {
    type: "entity"
}), SkinsScreen.prototype.updateScreen = function() {
    this.selectors_p1.enabled = "ai" != this.car_p1.script.controls.controls_scheme, this.selectors_p2.enabled = "ai" != this.car_p2.script.controls.controls_scheme, this.selectors_p1.script.skinSelector.updateSelector(), this.selectors_p2.script.skinSelector.updateSelector();
    var e = !this.selectors_p1.enabled || GameManager.instance.skinsUnlocked[GameManager.instance.p1_skin],
        t = !this.selectors_p2.enabled || GameManager.instance.skinsUnlocked[GameManager.instance.p2_skin];
    this.play_button.button.active = e && t
};
var BackFromSkinsButton = pc.createScript("backFromSkinsButton");
BackFromSkinsButton.prototype.initialize = function() {
    this.entity.button.on("click", (function(t) {
        GameManager.instance.onBackFromSkins()
    }), this)
};
var PrevSkin = pc.createScript("prevSkin");
PrevSkin.attributes.add("team", {
    type: "number",
    enum: [{
        1: "1"
    }, {
        2: "2"
    }]
}), PrevSkin.attributes.add("skin_screen", {
    type: "entity"
}), PrevSkin.prototype.initialize = function() {
    this.entity.button.on("click", (function(e) {
        GameManager.instance.prevSkin(this.team), this.skin_screen.script.skinsScreen.updateScreen()
    }), this)
};
var CameraMenu = pc.createScript("cameraMenu");
CameraMenu.attributes.add("skin_screen_pos", {
    type: "vec3"
}), CameraMenu.prototype.initialize = function() {
    CameraMenu.instance ? console.error("Instance already created") : (CameraMenu.instance = this, this.on("destroy", (function() {
        CameraMenu.instance = null
    }))), this.initialPos = this.entity.getPosition().clone(), this.moveTo = this.initialPos, this.interpolation = new pc.Vec3, this.entity.setPosition(this.skin_screen_pos)
}, CameraMenu.prototype.update = function(t) {
    this.interpolation.lerp(this.entity.getPosition(), this.moveTo, 5 * t), this.entity.setPosition(this.interpolation)
}, CameraMenu.prototype.toMainMenu = function() {
    this.moveTo = this.initialPos
}, CameraMenu.prototype.toSkinScreen = function() {
    this.moveTo = this.skin_screen_pos
};
var SkinSelector = pc.createScript("skinSelector");
SkinSelector.attributes.add("text", {
    type: "entity"
}), SkinSelector.attributes.add("button", {
    type: "entity"
}), SkinSelector.attributes.add("team", {
    type: "number",
    enum: [{
        1: "1"
    }, {
        2: "2"
    }]
}), SkinSelector.prototype.updateSelector = function() {
    var t = 1 == this.team ? GameManager.instance.p1_skin : GameManager.instance.p2_skin;
    GameManager.instance.skinsUnlocked[t] ? (this.text.element.text = GameManager.instance.skinsNames[t], this.button.enabled = !1) : (this.button.enabled = !0, this.app.ab ? (this.text.element.text = "", this.button.button.active = !1) : (this.text.element.text = "", this.button.button.active = !0))
};
var WatchAdbutton = pc.createScript("watchAdbutton");
WatchAdbutton.attributes.add("team", {
    type: "number",
    enum: [{
        1: "1"
    }, {
        2: "2"
    }]
}), WatchAdbutton.attributes.add("skin_screen", {
    type: "entity"
}), WatchAdbutton.prototype.initialize = function() {
    this.entity.button.on("click", (function(e) {
        this.app.p && !this.app.ab ? (this.last_volume = this.app.systems.sound.volume, this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((e => {
            e && (GameManager.instance.skinsUnlocked[1 == this.team ? GameManager.instance.p1_skin : GameManager.instance.p2_skin] = !0, window.localStorage.setItem("progress", JSON.stringify(GameManager.instance.skinsUnlocked)), this.skin_screen.script.skinsScreen.updateScreen()), this.app.systems.sound.volume = this.last_volume
        }))) : window.location.href.indexOf("launch.playcanvas.com") > -1 && (GameManager.instance.skinsUnlocked[1 == this.team ? GameManager.instance.p1_skin : GameManager.instance.p2_skin] = !0, window.localStorage.setItem("progress", JSON.stringify(GameManager.instance.skinsUnlocked)), this.skin_screen.script.skinsScreen.updateScreen())
    }), this)
};
var DisableAdblock = pc.createScript("disableAdblock");
DisableAdblock.prototype.initialize = function() {
    this.entity.enabled = this.app.ab
};
var PleaseRotateScreen = pc.createScript("pleaseRotateScreen");
PleaseRotateScreen.attributes.add("pleaseRotatePopup", {
    type: "entity"
}), PleaseRotateScreen.prototype.initialize = function() {
    this.covering = !1, this.savedTimescale = 1, this.savedVolume = 1, console.log("UND: " + this.pleaseRotatePopup), PleaseRotateScreen.instance = this, this.calculateDimensions(), window.addEventListener("orientationchange", this.calculateDimensions, !1), window.addEventListener("resize", this.calculateDimensions, !1)
}, PleaseRotateScreen.prototype.update = function(e) {}, PleaseRotateScreen.prototype.calculateDimensions = function() {
    let e = window.innerWidth,
        t = window.innerHeight,
        a = PleaseRotateScreen.instance;
    e >= t ? a.pleaseRotatePopup.enabled && (a.pleaseRotatePopup.enabled = !1, a.covering = !1, a.app.timeScale = a.savedTimescale, a.app.systems.sound.volume = a.savedVolume) : a.pleaseRotatePopup.enabled || (a.pleaseRotatePopup.enabled = !0, a.covering = !0, a.savedTimescale = a.app.timeScale, a.savedVolume = a.app.systems.sound.volume, a.app.timeScale = 0, a.app.systems.sound.volume = 0)
};