var Movement = pc.createScript("movement");
Movement.attributes.add("speed", {
    type: "number",
    default: .1
}), Movement.attributes.add("speedUp", {
    type: "number",
    default: 10
}), Movement.attributes.add("turnSpeed", {
    type: "number",
    default: .05
}), Movement.attributes.add("originEntity", {
    type: "entity"
}), Movement.attributes.add("characterEntity", {
    type: "entity"
}), Movement.attributes.add("hoverEntity", {
    type: "entity"
}), Movement.attributes.add("touchStartEntity", {
    type: "entity"
}), Movement.attributes.add("touchMoveEntity", {
    type: "entity"
}), Movement.attributes.add("leftFoot", {
    type: "entity"
}), Movement.attributes.add("rightFoot", {
    type: "entity"
}), Movement.attributes.add("boostParticles", {
    type: "entity"
}), Movement.attributes.add("windEffect", {
    type: "entity"
}), Movement.attributes.add("isHovering", {
    type: "boolean",
    default: !1
}), Movement.attributes.add("isLocked", {
    type: "boolean",
    default: !1
}), Movement.prototype.initialize = function() {
    this.direction = 90, this.nextDirection = 90, this.isTouchMoved = !1, this.leanAngle = 0, this.floorType = "Wood", this.grounds = this.app.root.findByTag("Ground"), this.lastCarryTime = -1, this.traceIndex = 0, this.isCarrying = !1, this.currentSpeed = 0, this.isTouching = !1, this.touchStart = new pc.Vec2(0, 0), this.currentTouch = new pc.Vec2(0, 0), this.stepIndex = 1, this.isRunning = !1, this.characterEntity.anim.on("Sound", this.playSound, this), this.app.touch && (this.app.touch.on("touchstart", this.onTouchStart, this), this.app.touch.on("touchmove", this.onTouchMove, this), this.app.touch.on("touchend", this.onTouchEnd, this)), this.entity.on("Carry", this.setCarryState, this), this.app.on("Carry:Has", this.hasCarry, this), this.app.on("Player:Boost", this.boost, this), this.app.on("Player:Stop", this.stop, this)
}, Movement.prototype.stop = function() {
    this.isTouching = !1, this.isRunning = !1, this.isLocked = !0, clearTimeout(this.stopTimer), this.stopTimer = setTimeout((function(t) {
        t.isLocked = !1
    }), 1e3, this)
}, Movement.prototype.boost = function() {
    this.speed = 6, this.turnSpeed = .7, this.characterEntity.anim.speed = 1.2, this.windEffect.enabled = !0, this.boostParticles.enabled = !0, this.app.fire("MusicManager:Pitch", 1.5), setTimeout((function(t) {
        t.speed = 4, t.turnSpeed = .2, t.characterEntity.anim.speed = 1, t.boostParticles.enabled = !1, t.windEffect.enabled = !1, pc.app.fire("MusicManager:Pitch", 1)
    }), 25e3, this)
}, Movement.prototype.hasCarry = function(t, e, i) {
    this.isCarrying ? e() : i()
}, Movement.prototype.setCarryState = function(t) {
    this.isCarrying = t
}, Movement.prototype.onTouchStart = function(t) {
    var e = t.touches;
    e.length > 0 && (this.touchStart.x = e[0].x, this.touchStart.y = e[0].y, this.isTouchMoved = !1, this.touchStartEntity.setLocalPosition(2 * this.touchStart.x, 2 * (this.app.graphicsDevice.height - this.touchStart.y), 0), this.touchStartEntity.enabled = !0, this.isTouching = !0)
}, Movement.prototype.onTouchMove = function(t) {
    var e = t.touches;
    e.length > 0 && (this.currentTouch.x = e[0].x, this.currentTouch.y = e[0].y, this.isTouchMoved = !0, this.touchMoveEntity.setLocalPosition(2 * this.currentTouch.x, 2 * (this.app.graphicsDevice.height - this.currentTouch.y), 0), this.touchMoveEntity.enabled = !0)
}, Movement.prototype.onTouchEnd = function(t) {
    this.isTouching = !1, this.touchStartEntity.enabled = !1, this.touchMoveEntity.enabled = !1
}, Movement.prototype.updateFloorType = function() {
    var t = this.entity.getPosition().clone();
    t.y = -.01;
    for (var e = this.grounds.length; e--;) {
        var i = this.grounds[e];
        i.model.meshInstances[0].aabb.containsPoint(t) && (this.floorType = i.name)
    }
}, Movement.prototype.playSound = function(t) {
    if ("Run" == t.string) {
        this.updateFloorType();
        var e = this.floorType + "-Run-" + this.stepIndex,
            i = .9;
        this.isCarrying && (i = .8), this.entity.sound.slots[e].pitch = i + .1 * Math.random(), this.entity.sound.play(e), this.stepIndex++, this.stepIndex > 3 && (this.stepIndex = 1 + Math.round(3 * Math.random()))
    }
}, Movement.prototype.footstepTrace = function() {
    return !!this.isRunning && (!(Date.now() - this.lastFootstep < 150) && (this.traceIndex++, this.traceIndex > 1 && (this.traceIndex = 0), void(this.lastFootstep = Date.now())))
}, Movement.prototype.setTouch = function() {
    if (this.isLocked) return !1;
    if (this.isTouching && this.isTouchMoved) {
        var t = Utils.lookAt(this.touchStart.x, this.touchStart.y, this.currentTouch.x, this.currentTouch.y);
        this.nextDirection = (-t + Math.PI / 2) * pc.math.RAD_TO_DEG, this.isRunning = !0
    }
}, Movement.prototype.setKeyboard = function() {
    (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_UP)) && (this.nextDirection = -90, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_A) || this.app.keyboard.isPressed(pc.KEY_LEFT)) && (this.nextDirection = -180, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_RIGHT)) && (this.nextDirection = 0, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_DOWN)) && (this.nextDirection = 90, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_UP)) && (this.app.keyboard.isPressed(pc.KEY_A) || this.app.keyboard.isPressed(pc.KEY_LEFT)) && (this.nextDirection = -135, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_UP)) && (this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_RIGHT)) && (this.nextDirection = -45, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_DOWN)) && (this.app.keyboard.isPressed(pc.KEY_A) || this.app.keyboard.isPressed(pc.KEY_LEFT)) && (this.nextDirection = 135, this.isRunning = !0), (this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_DOWN)) && (this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_RIGHT)) && (this.nextDirection = 45, this.isRunning = !0)
}, Movement.prototype.setMovement = function(t) {
    if (this.isLocked) return this.characterEntity.anim.setBoolean("Running", !1), !1;
    if (this.isRunning = !1, this.setKeyboard(), this.setTouch(), this.isRunning) {
        var e = this.turnSpeed;
        this.isCarrying && (e *= .5), this.direction = Utils.rotate(this.direction, this.nextDirection * pc.math.DEG_TO_RAD, 60 * e * t);
        var i = this.speed;
        this.isCarrying && (i *= .85), this.isHovering && (i *= 1.1), this.currentSpeed = i;
        var s = Math.cos(this.direction) * this.currentSpeed * t,
            n = Math.sin(this.direction) * this.currentSpeed * t;
        this.entity.translateLocal(s, 0, n)
    } else this.currentSpeed = pc.math.lerp(this.currentSpeed, 0, this.speedUp * t);
    this.originEntity.setLocalEulerAngles(0, 90 - this.direction * pc.math.RAD_TO_DEG, 0), this.characterEntity.anim.setBoolean("Running", this.isRunning), this.characterEntity.anim.setBoolean("Carry", this.isCarrying), this.characterEntity.anim.setBoolean("Hovering", this.isHovering), this.isHovering ? (this.leanAngle = pc.math.lerpAngle(this.leanAngle, this.isRunning ? 1 : 0, .1), this.characterEntity.setLocalEulerAngles(8 * this.leanAngle, 0, 0), this.characterEntity.setLocalPosition(0, .228, 0), this.entity.sound.slots.Hover.volume = .25 * this.leanAngle, this.entity.sound.slots.Hover.pitch = .5 + .25 * this.leanAngle) : (this.characterEntity.setLocalEulerAngles(0, 0, 0), this.entity.sound.slots.Hover.volume = 0, this.characterEntity.setLocalPosition(0, 0, 0))
}, Movement.prototype.update = function(t) {
    if (this.setMovement(t), 0 === pc.app.timeScale) return !1;
    this.isHovering = this.hoverEntity.enabled, this.footstepTrace()
};
var CameraFollow = pc.createScript("cameraFollow");
CameraFollow.attributes.add("cameraEntity", {
    type: "entity"
}), CameraFollow.attributes.add("followEntity", {
    type: "entity"
}), CameraFollow.attributes.add("playerEntity", {
    type: "entity"
}), CameraFollow.attributes.add("movementEntity", {
    type: "entity"
}), CameraFollow.attributes.add("arrowEntity", {
    type: "entity"
}), CameraFollow.attributes.add("speed", {
    type: "number",
    default: .1
}), CameraFollow.prototype.initialize = function() {
    this.offset = new pc.Vec3(0, 0, 0), this.nextOffset = new pc.Vec3(0, 0, 0), this.isFocusing = !1, this.lastFollowedEntity = !1, this.lastFocusing = !1, this.defaultVector = new pc.Vec3(0, 0, 0), this.app.on("Camera:Focus", this.setCameraFocus, this), this.app.on("Camera:Offset", this.setCameraOffset, this), this.app.on("Camera:Zoom", this.adjustZoomLevel, this), this.zoomLevel = 0, this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this)
}, CameraFollow.prototype.onMouseWheel = function(t) {
    if (pc.hasActivePopup) return !1;
    t.wheelDelta > 0 ? this.zoomLevel += .1 : this.zoomLevel -= .1, this.zoomLevel = Math.min(Math.max(this.zoomLevel, -1), 1)
}, CameraFollow.prototype.adjustZoomLevel = function() {
    this.zoomLevel -= .25, this.zoomLevel < -1 && (this.zoomLevel = 1)
}, CameraFollow.prototype.setCameraOffset = function(t) {
    this.nextOffset = t
}, CameraFollow.prototype.setCameraFocus = function(t, e) {
    return !!t && (t != this.followEntity && (t != this.lastFollowedEntity && (!(Date.now() - this.lastFocusing < 500) && (this.followEntity = t, this.speed = 2.5, this.isFocusing = !0, this.movementEntity.script.movement.isLocked = !0, this.entity.sound.play("Spinning"), clearTimeout(this.cameraTimer), this.lastFollowedEntity = t, this.lastFollowedEntityTimer = setTimeout((function(t) {
        t.lastFollowedEntity = !1
    }), 5e3, this), this.cameraTimer = setTimeout((function(t) {
        t.movementEntity.script.movement.isLocked = !1, t.entity.sound.play("Spinning"), t.followEntity = t.playerEntity, t.speed = 3, t.isFocusing = !1
    }), e || 1e3, this), void(this.lastFocusing = Date.now())))))
}, CameraFollow.prototype.updateZoomLevel = function() {
    Utils.isMobile() ? this.cameraEntity.setLocalPosition(0, 0, 18 + 5 * this.zoomLevel) : this.cameraEntity.setLocalPosition(0, 0, 15 + 5 * this.zoomLevel)
}, CameraFollow.prototype.update = function(t) {
    if (this.updateZoomLevel(), !this.followEntity) return !1;
    var e = this.entity.getPosition().lerp(this.entity.getPosition(), this.followEntity.getPosition(), this.speed * t);
    this.offset = this.offset.lerp(this.offset, this.nextOffset, .05), this.nextOffset = this.nextOffset.lerp(this.nextOffset, this.defaultVector, .01), this.isFocusing ? this.entity.setPosition(e) : this.entity.setPosition(e.add(this.nextOffset))
};
var EffectManager = pc.createScript("effectManager");
EffectManager.attributes.add("splashEffect", {
    type: "entity"
}), EffectManager.attributes.add("splashSprite", {
    type: "entity"
}), EffectManager.attributes.add("waveEffect", {
    type: "entity"
}), EffectManager.attributes.add("landSmokeEffect", {
    type: "entity"
}), EffectManager.attributes.add("landSmokeSprite", {
    type: "entity"
}), EffectManager.attributes.add("unlockEffect", {
    type: "entity"
}), EffectManager.attributes.add("unlockSprite", {
    type: "entity"
}), EffectManager.prototype.initialize = function() {
    this.app.on("EffectManager:LandSmoke", this.playLandSmoke, this), this.app.on("EffectManager:Splash", this.playSplash, this), this.app.on("EffectManager:WoodDestroy", this.playWoodDestroy, this), this.app.on("EffectManager:Footstep", this.addFootstep, this), this.app.on("EffectManager:Unlock", this.playUnlockEffect, this), this.footstepIndex = 0, this.footsteps = this.entity.findByTag("Footstep")
}, EffectManager.prototype.addFootstep = function(t) {
    this.footsteps[this.footstepIndex].setPosition(t.getPosition().clone()), this.footsteps[this.footstepIndex].setRotation(t.getRotation().clone()), this.footstepIndex++, this.footsteps.length - 1 < this.footstepIndex && (this.footstepIndex = 0)
}, EffectManager.prototype.playLandSmoke = function(t) {
    this.landSmokeEffect.setPosition(t), this.landSmokeSprite.sprite.stop(), this.landSmokeSprite.sprite.play("Fire")
}, EffectManager.prototype.playUnlockEffect = function(t) {
    this.unlockEffect.setPosition(t), this.unlockSprite.sprite.stop(), this.unlockSprite.sprite.play("Fire"), this.entity.sound.play("Unlock")
}, EffectManager.prototype.playSplash = function(t) {
    this.splashEffect.setPosition(t), this.splashSprite.sprite.stop(), this.splashSprite.sprite.play("Fire"), this.waveEffect.sprite.stop(), this.waveEffect.sprite.play("Fire")
}, EffectManager.prototype.playWoodDestroy = function(t) {
    this.app.fire("BakedPhysics:WoodDestroy", t)
};
var Droppable = pc.createScript("droppable");
Droppable.attributes.add("accept", {
    type: "string",
    default: "Log"
}), Droppable.attributes.add("icon", {
    type: "asset"
}), Droppable.attributes.add("placeIndex", {
    type: "number"
}), Droppable.attributes.add("maxItems", {
    type: "number",
    default: 3
}), Droppable.attributes.add("dropType", {
    type: "string",
    enum: [{
        Smoke: "Smoke"
    }],
    default: "Smoke"
}), Droppable.attributes.add("placeEntity", {
    type: "entity"
}), Droppable.attributes.add("completeEntity", {
    type: "entity"
}), Droppable.attributes.add("repeatItself", {
    type: "boolean",
    default: !1
}), Droppable.attributes.add("type", {
    type: "string",
    enum: [{
        TimerBar: "TimerBar"
    }, {
        Completable: "Completable"
    }],
    default: "Completable"
}), Droppable.attributes.add("fillUpTime", {
    type: "number",
    default: 5
}), Droppable.prototype.initialize = function() {
    this.isBuilt = !1, this.isActive = !1, this.completeEntity && (this.completeEntity.enabled = !1), this.entity.on("Drop", this.onDrop, this), this.entity.on("Active", this.setActive, this), this.entity.on("Complete", this.setComplete, this), this.entity.on("Reset", this.setReset, this)
}, Droppable.prototype.setReset = function() {
    this.isBuilt = !1, this.isActive = !0, this.placeIndex = 0, this.completeEntity && (this.completeEntity.enabled = !1), this.clearPlaces()
}, Droppable.prototype.setActive = function() {
    this.isActive = !0
}, Droppable.prototype.setComplete = function() {
    this.completeEntity && (this.completeEntity.enabled = !0), this.isBuilt = !0, this.setActive()
}, Droppable.prototype.onDrop = function(t) {
    return !this.isBuilt && (t.name == this.accept && (this.dropEffect(), this.entity.fire("Station:Update"), this.maxItems <= this.placeIndex && !this.completeEntity && (this.clearPlaces(), setTimeout((function(t) {
        t.app.fire("Bank:Add", 200, t.entity)
    }), 1e3, this)), void(!this.isBuilt && this.completeEntity && this.maxItems <= this.placeIndex && (setTimeout((function(t) {
        t.build()
    }), 200, this), this.isBuilt = !0))))
}, Droppable.prototype.clearPlaces = function() {
    var t = this.entity.findByTag("PlaceIndex");
    for (var e in t) {
        var i = t[e].findByTag("Collectable");
        if (i.length > 0)
            for (var p in i) {
                i[p].destroy()
            }
    }
    this.placeIndex = 0
}, Droppable.prototype.dropEffect = function() {
    "Smoke" == this.dropType && this.app.fire("EffectManager:LandSmoke", this.entity.getPosition())
}, Droppable.prototype.build = function() {
    this.setComplete(), "Log" == this.accept && this.app.fire("EffectManager:WoodDestroy", this.entity.getPosition()), this.app.fire("Motion", "LittleShake"), this.entity.fire("Station:Complete")
};
var Motion = pc.createScript("motion");
Motion.attributes.add("motions", {
    type: "json",
    schema: [{
        name: "name",
        type: "string"
    }, {
        name: "position",
        type: "curve",
        curves: ["x", "y", "z"]
    }, {
        name: "rotation",
        type: "curve",
        curves: ["x", "y", "z"]
    }, {
        name: "scale",
        type: "curve",
        curves: ["x", "y", "z"]
    }, {
        name: "speed",
        type: "number",
        default: 1
    }, {
        name: "autoplay",
        type: "boolean",
        default: !1
    }, {
        name: "loop",
        type: "boolean",
        default: !1
    }],
    array: !0
}), Motion.attributes.add("events", {
    type: "json",
    schema: [{
        name: "animationName",
        type: "string"
    }, {
        name: "eventName",
        type: "string"
    }, {
        name: "time",
        type: "number",
        default: 1
    }, {
        name: "type",
        type: "string",
        default: "Anytime",
        enum: [{
            Anytime: "Anytime"
        }, {
            Start: "Start"
        }, {
            End: "End"
        }]
    }],
    array: !0
}), Motion.attributes.add("lerp", {
    type: "number",
    default: .5
}), Motion.prototype.initialize = function() {
    this.timestamp = 0, this.currentSpeed = 0, this.currentMotion = !1, this.isReverting = !1, this.startPosition = this.entity.getLocalPosition().clone(), this.startRotation = this.entity.getLocalEulerAngles().clone(), this.startScale = this.entity.getLocalScale().clone(), this.position = new pc.Vec3(0, 0, 0), this.rotation = new pc.Vec3(0, 0, 0), this.scale = new pc.Vec3(0, 0, 0), this.motions.length > 0 && this.motions[0].autoplay && this.onMotionPlay(this.motions[0].name), this.app.on("Motion", this.onMotionPlay, this), this.app.on("Motion:Stop", this.onMotionStop, this), this.entity.on("Motion", this.onMotionPlay, this), this.entity.on("Motion:Stop", this.onMotionStop, this)
}, Motion.prototype.findMotion = function(t) {
    var i = !1;
    for (var n in this.motions) {
        var e = this.motions[n];
        e.name == t && (i = e)
    }
    return i
}, Motion.prototype.onMotionStop = function(t) {
    this.currentMotion && this.currentMotion.name == t && (this.isPlaying = !1, this.currentMotion = !1)
}, Motion.prototype.onMotionPlay = function(t, i) {
    if (!i && this.currentMotion && this.currentMotion.name == t) return !1;
    var n = this.findMotion(t);
    if (!n) return !1;
    this.isPlaying = !0, this.timestamp = 0, this.currentMotion = n, this.triggerStartEvent(this.currentMotion)
}, Motion.prototype.triggerEvents = function(t) {
    for (var i in this.events) {
        var n = this.events[i],
            e = n.time;
        n.animationName == this.currentMotion.name && e > this.timestamp && e <= this.timestamp + t && this.app.fire(n.eventName)
    }
}, Motion.prototype.findEventByMotion = function(t, i) {
    for (var n in this.events) {
        var e = this.events[n];
        if (e.animationName == t.name && e.type == i) return e
    }
}, Motion.prototype.triggerStartEvent = function(t) {
    var i = this.findEventByMotion(t, "Start");
    i && this.app.fire(i.eventName)
}, Motion.prototype.triggerEndEvent = function(t) {
    var i = this.findEventByMotion(t, "End");
    i && this.app.fire(i.eventName)
}, Motion.prototype.update = function(t) {
    if (!this.isPlaying) return !1;
    if (!this.currentMotion) return !1;
    var i = this.currentMotion.position.value(this.timestamp),
        n = this.currentMotion.rotation.value(this.timestamp),
        e = this.currentMotion.scale.value(this.timestamp);
    this.position = this.position.lerp(this.position, new pc.Vec3(i[0], i[1], i[2]), this.lerp), this.rotation = this.rotation.lerp(this.rotation, new pc.Vec3(n[0], n[1], n[2]), this.lerp), this.scale = this.scale.lerp(this.scale, new pc.Vec3(e[0], e[1], e[2]), this.lerp), this.entity.setLocalPosition(this.position.clone().add(this.startPosition)), this.entity.setLocalEulerAngles(this.rotation.clone().add(this.startRotation)), this.entity.setLocalScale(this.scale.clone().add(this.startScale)), this.triggerEvents(t), this.timestamp >= 1 && (this.isPlaying = !1, this.currentMotion.loop ? this.onMotionPlay(this.currentMotion.name, !0) : (this.triggerEndEvent(this.currentMotion), this.currentMotion = !1)), this.isReverting ? (this.timestamp -= t * this.currentMotion.speed, this.timestamp <= 0 && (this.triggerEndEvent(this.currentMotion), this.currentMotion = !1, this.isPlaying = !1, this.isReverting = !1)) : this.timestamp += t * this.currentMotion.speed, this.timestamp = Math.max(this.timestamp, 0), this.timestamp = Math.min(this.timestamp, 1)
};
var BakedPhysicsPlayer = pc.createScript("bakedPhysicsPlayer");
BakedPhysicsPlayer.attributes.add("staticEntity", {
    type: "entity"
}), BakedPhysicsPlayer.attributes.add("speed", {
    type: "number",
    default: 1
}), BakedPhysicsPlayer.attributes.add("autoplay", {
    type: "boolean",
    default: !1
}), BakedPhysicsPlayer.attributes.add("file", {
    type: "asset",
    assetType: "json"
}), BakedPhysicsPlayer.attributes.add("soundPlay", {
    type: "boolean"
}), BakedPhysicsPlayer.prototype.initialize = function() {
    this.staticEntity.on("Model:Loaded", this._onModelLoaded, this), this.on("destroy", this.onDestroy, this)
}, BakedPhysicsPlayer.prototype._onModelLoaded = function(t) {
    !0 === t && this.onModelLoaded()
}, BakedPhysicsPlayer.prototype.onModelLoaded = function() {
    var t = this;
    this.isPlaying = !1, this.fps = 60, this.pool = [], this.data = {}, this.frames = [], this.frameIndex = 0, this.frameTime = 0, this.isHidden = !1, this.childVertices = !1, this.childScale = !1, this.app.assets.load(this.file), this.file.ready((function(i) {
        var e = this.resources[0];
        t.data = e, t.count = e.count, t.duration = e.duration, t.frames = e.frames, t.childVertices = e.childVertices, t.childScale = e.childScale, t.createPhysicalObjects(), t.hidePool()
    })), this.staticEntity.enabled = !1, this.app.on("BakedPhysics:" + this.entity.name, this.onPlay, this), this.autoplay && this.app.fire("BakedPhysics:" + this.entity.name, new pc.Vec3(0, 0, 0))
}, BakedPhysicsPlayer.prototype.onDestroy = function() {
    this.app.off("BakedPhysics:" + this.entity.name, this.onPlay, this)
}, BakedPhysicsPlayer.prototype.onPlay = function(t) {
    this.isPlaying = !0, this.isHidden = !1, this.isEnded = !1, this.frameIndex = 0, this.frameTime = 0, t && this.entity.setLocalPosition(t), this.showPool(), this.soundPlay && this.entity.sound.play("Sound")
}, BakedPhysicsPlayer.prototype.createPhysicalObjects = function() {
    if (this.data.childVertices) {
        var t = this.staticEntity.model.meshInstances;
        for (var i in t) {
            var e = t[i];
            parseInt(i) > -1 && (e.triggered = !1, e.isLarge = e.node.name.search("Large") > -1, this.pool.push(e))
        }
    } else
        for (var s = 0; s < this.count; s++) {
            var a = this.staticEntity.clone();
            a.enabled = !0, this.pool.push(a), this.entity.addChild(a)
        }
}, BakedPhysicsPlayer.prototype.showPool = function(t) {
    if (this.childVertices) this.staticEntity.enabled = !0;
    else
        for (var i = this.pool.length; i--;) this.pool[i].enabled = !0;
    this.staticEntity.enabled = !0
}, BakedPhysicsPlayer.prototype.hidePool = function(t) {
    if (this.isHidden) return !1;
    if (this.childVertices)
        for (var i = this.pool.length; i--;) this.pool[i].triggered = !1, this.pool[i].enabled = !1;
    else this.staticEntity.enabled = !1;
    this.staticEntity.enabled = !1, this.isHidden = !0
}, BakedPhysicsPlayer.prototype.onEnd = function() {
    if (this.isEnded) return !1;
    this.isEnded = !0
}, BakedPhysicsPlayer.prototype.getRadius = function(t) {
    return t.x + t.y + t.z
}, BakedPhysicsPlayer.prototype.update = function(t) {
    if (!this.isPlaying) return !1;
    if (0 === this.frames.length) return !1;
    if (this.frames.length - 1 < this.frameIndex) return this.isPlaying = !1, this.hidePool(), this.onEnd(), !1;
    for (var i = this.pool.length; i--;) {
        var e = this.frames[this.frameIndex][i],
            s = e,
            a = e[0];
        if (this.childVertices ? (this.pool[a].node.setLocalPosition(100 * s[1], 100 * s[2], 100 * s[3]), this.pool[a].node.setLocalEulerAngles(s[4], s[5], s[6])) : (this.pool[a].setLocalPosition(s[1], s[2], s[3]), this.pool[a].setLocalEulerAngles(s[4], s[5], s[6])), this.groundTrigger) {
            var o = this.pool[a].node.getPosition().clone();
            !this.pool[a].triggered && this.pool[a].isLarge && o.y < 0 && (this.pool[a].triggered = !0)
        }
    }
    this.frameTime += t * this.fps * this.speed, this.frameIndex = Math.round(this.frameTime)
};
var ModelComponent = pc.createScript("modelComponent");
ModelComponent.attributes.add("loaded", {
    type: "boolean",
    default: !1
}), ModelComponent.prototype.initialize = function() {
    if (this.loaded) return setTimeout((function(t) {
        t.entity.fire("Model:Loaded", !0)
    }), 1e3, this), !1;
    this.materialCount = 0, this.materialLoaded = 0;
    var t = this.entity.model.asset;
    if (!t) return !1;
    var e = this.app.assets.get(t),
        a = this;
    e.ready((function() {
        a.entity.fire("Model:Loaded", !1), a.checkMaterials()
    }))
}, ModelComponent.prototype.checkMaterials = function() {
    if (!this.entity.model) return !1;
    var t = this.entity.model.meshInstances,
        e = this;
    if (!t) return !1;
    for (var a in this.materialCount = t.length, t) {
        var i = t[a].material,
            o = this.app.assets.find(i.name);
        if (!o) return !1;
        o.ready((function() {
            e.checkTextures(i)
        })), this.app.assets.load(o)
    }
}, ModelComponent.prototype.checkTextures = function(t) {
    var e = t._assetReferences,
        a = 0,
        i = 0,
        o = this;
    for (var n in e) {
        var s = e[n];
        i++, this.app.assets.load(s.asset), s.asset.ready((function() {
            ++a >= i && o.setMaterial()
        }))
    }
    0 === i && this.setMaterial()
}, ModelComponent.prototype.setMaterial = function() {
    this.materialLoaded++, this.materialCount == this.materialLoaded && this.entity.fire("Model:Loaded", !0)
};
var Rotate = pc.createScript("rotate");
Rotate.attributes.add("axis", {
    type: "string",
    enum: [{
        x: "x"
    }, {
        y: "y"
    }, {
        z: "z"
    }]
}), Rotate.attributes.add("speed", {
    type: "number"
}), Rotate.attributes.add("waveStyle", {
    type: "boolean"
}), Rotate.attributes.add("waveWidth", {
    type: "number"
}), Rotate.attributes.add("children", {
    type: "boolean"
}), Rotate.attributes.add("graphName", {
    type: "string"
}), Rotate.prototype.initialize = function() {
    this.currentElement = this.entity, this.timestamp = 0, this.children && (this.currentElement = this.entity.findByName(this.graphName))
}, Rotate.prototype.update = function(t) {
    var e = this.speed * (60 * t);
    this.waveStyle && (e = Math.cos(this.timestamp * this.speed) * this.waveWidth, this.timestamp += 60 * t), this.currentElement ? ("x" == this.axis && this.currentElement.rotateLocal(e, 0, 0), "y" == this.axis && this.currentElement.rotateLocal(0, e, 0), "z" == this.axis && this.currentElement.rotateLocal(0, 0, e)) : this.children && (this.currentElement = this.entity.findByName(this.graphName))
};
var Collisions = pc.createScript("collisions");
Collisions.attributes.add("speed", {
    type: "number",
    default: 5
}), Collisions.attributes.add("triggerDistance", {
    type: "number",
    default: 1.5
}), Collisions.attributes.add("collectDistance", {
    type: "number",
    default: 3
}), Collisions.attributes.add("cookingStationDistance", {
    type: "number",
    default: 3
}), Collisions.attributes.add("isKinematic", {
    type: "boolean",
    default: !1
}), Collisions.prototype.initialize = function() {
    this.lastCollisionCheck = Date.now(), this.lastDropTime = Date.now(), this.lastCollectTime = Date.now(), this.currentlyCollidingTriggers = [], this.app.on("Scene:Triggers", this.scanTriggers, this), this.app.on("Scene:Collision", this.scanCollisions, this), this.entity.on("Trigger:Reset", this.resetTrigger, this), this.scanTriggers(), this.scanCollisions()
}, Collisions.prototype.resetTrigger = function() {
    this.lastTriggerEntity = !1, this.isColliding = !1
}, Collisions.prototype.scanTriggers = function() {
    this.triggers = this.app.root.findByTag("Trigger")
}, Collisions.prototype.scanCollisions = function() {
    this.collisions = this.app.root.findByTag("Collision"), this.collisions.forEach((function(i) {}))
}, Collisions.prototype.checkCollision = function(i) {
    if (Date.now() - this.lastCollisionCheck < 80) return !1;
    for (var t = this.entity.getPosition(), s = this.triggers.length, o = [], n = this.lastTriggerEntity && this.lastTriggerEntity.tags.list().indexOf("Collect") > -1; s--;) {
        if ((a = this.triggers[s]) && a.enabled && a.parent) {
            var e = a.getPosition().clone(),
                l = Utils.distance(e.x, e.z, t.x, t.z),
                r = this.triggerDistance;
            if (a.tags.list().indexOf("Collect") > -1 && (r = this.collectDistance, n && a !== this.lastTriggerEntity)) continue;
            a.tags.list().indexOf("CookingStation") > -1 && (r = this.cookingStationDistance), l < r && ((a.tags.list().indexOf("Loop") > -1 || this.lastTriggerEntity !== a) && (a.fire("Trigger", this.entity), this.lastTriggerEntity = a), o.push(a))
        }
    }
    for (s = 0; s < this.currentlyCollidingTriggers.length; s++) {
        var a = this.currentlyCollidingTriggers[s];
        o.includes(a) || a.fire("Leave", this.entity)
    }
    0 === o.length && (this.lastTriggerEntity = null), this.currentlyCollidingTriggers = o, this.lastCollisionCheck = Date.now()
}, Collisions.prototype.hasAnyCollision = function() {
    return this.isColliding
}, Collisions.prototype.checkBorderCollision = function(i) {
    for (var t = this.entity.getPosition(), s = this.collisions.length; s--;) {
        var o = this.collisions[s];
        if (o && o.enabled && o.collision) {
            var n = o.getPosition(),
                e = o.getPosition().clone().sub(t.clone()).length(),
                l = o.collision.radius;
            if (e < l) {
                var r = Utils.lookAt(t.x, t.z, n.x, n.z) - Math.PI,
                    a = Math.cos(r) * this.speed * i,
                    g = Math.sin(r) * this.speed * i;
                o.tags.list().indexOf("Kinematic") > -1 ? o.translateLocal(g, 0, -a) : this.isKinematic || this.entity.translateLocal(g, 0, a)
            }
            if (o.tags.list().indexOf("Kinematic") > -1) {
                o.originalPosition || (o.originalPosition = o.getPosition().clone());
                var c = o.getPosition().clone().lerp(o.getPosition(), o.originalPosition, .05);
                o.setPosition(c), e < l && o.fire("Collision")
            }
        }
    }
}, Collisions.prototype.update = function(i) {
    if (0 === pc.app.timeScale) return !1;
    this.isKinematic || this.entity.script.building && this.entity.script.building.currentBuilding || this.checkCollision(i), this.checkBorderCollision(i)
};
var SpawnTimer = pc.createScript("spawnTimer");
SpawnTimer.attributes.add("nextSpawn", {
    type: "number",
    default: 1
}), SpawnTimer.attributes.add("spawnEntity", {
    type: "entity"
}), SpawnTimer.attributes.add("timerEntity", {
    type: "entity"
}), SpawnTimer.prototype.initialize = function() {
    this.createTimerEntity(), this.setNextAlarm()
}, SpawnTimer.prototype.createTimerEntity = function() {
    var t = this.timerEntity.clone();
    t.setPosition(this.entity.getPosition()), t.enabled = !0, this.app.root.addChild(t), this.alarmEntity = t.findByName("Alarm"), this.alarmEntity.enabled = !1, this.clockEntity = t.findByName("Clock"), this.clockEntity.enabled = !0
}, SpawnTimer.prototype.setNextAlarm = function() {
    this.app.fire("Station:Clock"), this.alarmEntity.enabled = !1, this.clockEntity.enabled = !0, setTimeout((function(t) {
        t.spawn()
    }), 1e3 * this.nextSpawn, this)
}, SpawnTimer.prototype.spawn = function() {
    var t = this,
        i = this.spawnEntity.clone();
    i.setPosition(this.entity.getPosition()), i.setEulerAngles(0, 360 * Math.random(), 0), i.on("Collect", (function() {
        t.setNextAlarm()
    })), this.app.root.addChild(i), this.app.fire("Scene:Collectables"), this.app.fire("Station:Alarm"), this.alarmEntity.enabled = !0, this.clockEntity.enabled = !1
};
var SplineMotion = pc.createScript("splineMotion");
SplineMotion.attributes.add("speed", {
    type: "number",
    default: 1
}), SplineMotion.attributes.add("tension", {
    type: "number",
    default: 1
}), SplineMotion.prototype.initialize = function() {
    this.animations = [], this.points = this.entity.findByTag("Point"), this.hidePoints(), this.app.on("SplineMotion:" + this.entity.name, this.play, this), this.on("destroy", this.onDestroy)
}, SplineMotion.prototype.hidePoints = function() {
    for (var t in this.points) {
        var i = this.points[t];
        i.getPosition().clone();
        i.enabled = !1
    }
}, SplineMotion.prototype.onDestroy = function() {
    this.app.off("SplineMotion:" + this.entity.name, this.play, this)
}, SplineMotion.prototype.generateCurves = function() {
    var t = {
        timestamp: 0,
        isPlaying: !0
    };
    for (var i in t.curveX = new pc.Curve, t.curveY = new pc.Curve, t.curveZ = new pc.Curve, t.curveX.type = pc.CURVE_SPLINE, t.curveY.type = pc.CURVE_SPLINE, t.curveZ.type = pc.CURVE_SPLINE, t.curveX.tension = this.tension, t.curveY.tension = this.tension, t.curveZ.tension = this.tension, this.points) {
        var e = this.points[i],
            n = parseInt(i) / this.points.length,
            o = e.getPosition().clone();
        t.curveX.add(n, o.x), t.curveY.add(n, o.y), t.curveZ.add(n, o.z), e.enabled = !1
    }
    return t.firstPosition = this.points[0].getPosition().clone(), t
}, SplineMotion.prototype.play = function(t, i, e) {
    return 0 === this.points.length ? (console.error("No point tags found in spline motion!"), !1) : t ? !t.curve && (this.visualEntity = t, this.visualEntity.curve = this.generateCurves(), void this.animations.push(this.visualEntity)) : (console.error("First arg should be an entity!"), !1)
}, SplineMotion.prototype.update = function(t) {
    for (var i in this.animations) {
        var e = this.animations[i];
        if (e.curve.isPlaying) {
            var n = e.curve.curveX.value(e.curve.timestamp),
                o = e.curve.curveY.value(e.curve.timestamp),
                s = e.curve.curveZ.value(e.curve.timestamp);
            e.setPosition(n, o, s), e.curve.timestamp += t * this.speed, e.curve.timestamp >= 1 && (e.curve.isPlaying = !1, e.curve = !1, this.animations.splice(this.animations.indexOf(e), 1))
        }
    }
};
var ItemSpawn = pc.createScript("itemSpawn");
ItemSpawn.attributes.add("entities", {
    type: "entity",
    array: !0
}), ItemSpawn.prototype.initialize = function() {
    this.entities.forEach((function(t) {
        t.enabled = !1
    })), setTimeout((function(t) {
        t.spawnItem()
    }), 500, this)
}, ItemSpawn.prototype.spawnItem = function() {
    var t = this.entities[0].clone();
    t.enabled = !0, this.app.fire("SplineMotion:Slide", t), this.entity.addChild(t), this.app.fire("Scene:Collectables"), pc.firstSpawnItem || (pc.firstSpawnItem = t), setTimeout((function(t) {
        t.spawnItem()
    }), 3e3, this)
};
var World2Screen = pc.createScript("world2Screen");
World2Screen.attributes.add("cameraEntity", {
    type: "entity"
}), World2Screen.attributes.add("holderEntity", {
    type: "entity"
}), World2Screen.attributes.add("belowEntity", {
    type: "entity"
}), World2Screen.attributes.add("orderHolder", {
    type: "entity"
}), World2Screen.attributes.add("display", {
    type: "entity",
    array: !0
}), World2Screen.prototype.postInitialize = function() {
    this.interactions = [], this.frameDrawn = 0, this.nextFrameVisible = !1, this.app.on("World2Screen:Clone", this.cloneInteraction, this), this.app.on("World2Screen:Show", this.addInteraction, this), this.app.on("World2Screen:Visible", this.visibleInteraction, this), this.app.on("World2Screen:Hide", this.removeInteraction, this), this.hideAllDisplays(), this.on("destroy", this.onDestroy, this)
}, World2Screen.prototype.hideAllDisplays = function() {
    for (var t in this.display) {
        this.display[t].enabled = !1
    }
}, World2Screen.prototype.onDestroy = function() {
    this.app.off("World2Screen:Show", this.setInteraction, this)
}, World2Screen.prototype.getInteractionDisplay = function(t) {
    var e = !1;
    for (var i in this.display) {
        var n = this.display[i];
        n.name == t && (e = n)
    }
    return e
}, World2Screen.prototype.removeInteraction = function(t, e) {
    var i = this.getInteractionDisplay(t);
    i && (i.enabled = !1, i.entity = !1)
}, World2Screen.prototype.addInteraction = function(t, e, i) {
    var n = this.getInteractionDisplay(t);
    n && (n.entity != e && (n.enabled = !1), n.offset = i || new pc.Vec3(0, 0, 0), n.entity = e, n.type = t, n.enabled = !0, n.createdAt = Date.now())
}, World2Screen.prototype.cloneInteraction = function(t, e, i, n) {
    var r = this.getInteractionDisplay(t),
        o = this;
    r && ((r = r.clone()).name = e._guid, r.enabled = !0, r.offset = i || new pc.Vec3(0, 0, 0), r.entity = e, r.type = t, r.enabled = !0, r.createdAt = Date.now(), n && n(r), e.on("destroy", (function() {
        o.display.splice(o.display.indexOf(r), 1), r.destroy()
    })), this.holderEntity.addChild(r), this.display.push(r))
}, World2Screen.prototype.visibleInteraction = function(t, e, i) {
    this.addInteraction(t, e, i), this.frameDrawn = 0, this.nextFrameVisible = t
}, World2Screen.prototype.updateInteraction = function(t) {
    if (!this.cameraEntity) return !1;
    var e = new pc.Vec3,
        i = this.cameraEntity.camera,
        n = this.app.graphicsDevice.maxPixelRatio,
        r = this.entity.screen.scale,
        o = this.app.graphicsDevice;
    if (!i) return !1;
    if (!t.entity) return !1;
    (t.offset && t.offset.name ? i.worldToScreen(t.offset.getPosition().clone(), e) : i.worldToScreen(t.entity.getPosition().clone().add(t.offset), e), e.x *= n, e.y *= n, e.x < this.app.graphicsDevice.width && e.y > 0 && e.y < this.app.graphicsDevice.height && e.z > 0) ? (t.reparent(this.holderEntity), t.setLocalPosition(e.x / r, (o.height - e.y) / r, 0), t.enabled = t.entity.enabled) : t.entity.getPosition().z > this.belowEntity.getPosition().z ? t.setLocalPosition(e.x / r, 90, 0) : (t.reparent(this.orderHolder), t.setLocalPosition(0, 0, 0))
}, World2Screen.prototype.update = function(t) {
    for (var e = this.display.length; e--;) {
        var i = this.display[e];
        i && this.updateInteraction(i)
    }
    this.nextFrameVisible && this.frameDrawn > 0 && this.removeInteraction(this.nextFrameVisible), this.frameDrawn++
};
var WorldAttach = pc.createScript("worldAttach");
WorldAttach.attributes.add("type", {
    type: "string"
}), WorldAttach.attributes.add("offset", {
    type: "vec3",
    default: [0, 0, 0]
}), WorldAttach.prototype.initialize = function() {
    this.app.fire("World2Screen:Clone", this.type, this.entity, this.offset, this.onSetCallback.bind(this))
}, WorldAttach.prototype.onSetCallback = function(t) {
    console.log(t)
};
var MoneyManager = pc.createScript("moneyManager");
MoneyManager.attributes.add("startMoney", {
    type: "number",
    default: 500
}), MoneyManager.attributes.add("moneyColor", {
    type: "entity"
}), MoneyManager.attributes.add("noMoneyAlert", {
    type: "entity"
}), MoneyManager.attributes.add("moneyEntity", {
    type: "entity"
}), MoneyManager.attributes.add("bankEntity", {
    type: "entity"
}), MoneyManager.attributes.add("countryMoney", {
    type: "entity",
    array: !0
}), MoneyManager.attributes.add("playerEntity", {
    type: "entity"
}), MoneyManager.attributes.add("collectableMoneyEntity", {
    type: "entity"
}), MoneyManager.prototype.initialize = function() {
    this.money = this.startMoney, this.totalMoney = this.startMoney, this.lastMoneySave = -1, Utils.getItem("Money") && (this.money = parseInt(Utils.getItem("Money")));
    var t = Utils.getItem("TutorialIndex");
    t && parseInt(t) < 2 && (this.money = this.startMoney), this.app.on("Money:Remove", this.remove, this), this.app.on("Money:Add", this.add, this), this.app.on("Money:Has", this.has, this), this.app.on("Money:Drop", this.drop, this), this.app.on("Money:NoMoney", this.showNoMoney, this), this.updateMoney(), pc.MoneyManager = this
}, MoneyManager.prototype.drop = function(t, e) {
    var n = this.collectableMoneyEntity.clone();
    n.setPosition(t.x + 4 * Math.random() - 4 * Math.random(), 0, t.z + 4 * Math.random() - 4 * Math.random()), n.script.money.amount = e, n.enabled = !0, this.app.root.addChild(n)
}, MoneyManager.prototype.showNoMoney = function() {
    this.noMoneyAlert.enabled || (this.noMoneyAlert.enabled = !0, this.noMoneyTimer = setTimeout((function(t) {
        t.noMoneyAlert.enabled = !1
    }), 1e3, this))
}, MoneyManager.prototype.has = function(t, e, n) {
    var o = parseInt(t);
    this.money > o ? e && e() : n && n()
}, MoneyManager.prototype.remove = function(t) {
    t <= this.money && (this.money -= parseInt(t)), this.updateMoney(), this.app.fire("Sound:Play", "MoneyCount")
}, MoneyManager.prototype.add = function(t) {
    this.money += parseInt(t), this.totalMoney += parseInt(t), this.updateMoney(), this.app.fire("Sound:Play", "MoneyCount")
}, MoneyManager.prototype.updateMoney = function() {
    for (var t in this.moneyEntity.element.text = this.money + "", this.bankEntity.element.text = this.totalMoney + "", Date.now() - this.lastMoneySave > 1e3 && (Utils.setItem("Money", this.money), this.lastMoneySave = Date.now()), this.money <= 0 ? this.moneyColor.element.color = pc.Color.RED : this.moneyColor.element.color = pc.Color.GREEN, this.countryMoney) {
        var e = this.countryMoney[t];
        "USA" == e.name && (e.element.text = "$" + this.money)
    }
};
var Timeline = pc.createScript("timeline");
Timeline.attributes.add("autoplay", {
    type: "boolean"
}), Timeline.attributes.add("loop", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("yoyo", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("position", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("scale", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("rotation", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("opacity", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("custom", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("playSound", {
    type: "boolean",
    default: !1
}), Timeline.attributes.add("duration", {
    type: "number",
    default: 1
}), Timeline.attributes.add("delay", {
    type: "number",
    default: 0
}), Timeline.attributes.add("repeat", {
    type: "number",
    default: 0
}), Timeline.attributes.add("soundDelay", {
    type: "number",
    default: 0
}), Timeline.attributes.add("rollback", {
    type: "number",
    default: 0
}), Timeline.attributes.add("ease", {
    type: "string",
    enum: [{
        Linear: "Linear"
    }, {
        QuadraticIn: "QuadraticIn"
    }, {
        QuadraticOut: "QuadraticOut"
    }, {
        QuadraticInOut: "QuadraticInOut"
    }, {
        CubicIn: "CubicIn"
    }, {
        CubicOut: "CubicOut"
    }, {
        CubicInOut: "CubicInOut"
    }, {
        QuarticIn: "QuarticIn"
    }, {
        QuarticOut: "QuarticOut"
    }, {
        QuarticInOut: "QuarticInOut"
    }, {
        QuinticIn: "QuinticIn"
    }, {
        QuinticOut: "QuinticOut"
    }, {
        QuinticInOut: "QuinticInOut"
    }, {
        SineIn: "SineIn"
    }, {
        SineOut: "SineOut"
    }, {
        SineInOut: "SineInOut"
    }, {
        ExponentialIn: "ExponentialIn"
    }, {
        ExponentialOut: "ExponentialOut"
    }, {
        ExponentialInOut: "ExponentialInOut"
    }, {
        CircularIn: "CircularIn"
    }, {
        CircularOut: "CircularOut"
    }, {
        CircularInOut: "CircularInOut"
    }, {
        BackIn: "BackIn"
    }, {
        BackOut: "BackOut"
    }, {
        BackInOut: "BackInOut"
    }, {
        BounceIn: "BounceIn"
    }, {
        BounceOut: "BounceOut"
    }, {
        BounceInOut: "BounceInOut"
    }, {
        ElasticIn: "ElasticIn"
    }, {
        ElasticOut: "ElasticOut"
    }, {
        ElasticInOut: "ElasticInOut"
    }],
    default: "Linear"
}), Timeline.attributes.add("startFrame", {
    type: "json",
    schema: [{
        name: "position",
        type: "vec3"
    }, {
        name: "rotation",
        type: "vec3"
    }, {
        name: "scale",
        type: "vec3",
        default: [1, 1, 1]
    }, {
        name: "opacity",
        type: "number",
        default: 1
    }, {
        name: "custom",
        type: "string",
        description: "For example camera.fov = 40"
    }]
}), Timeline.attributes.add("endFrame", {
    type: "json",
    schema: [{
        name: "position",
        type: "vec3"
    }, {
        name: "rotation",
        type: "vec3"
    }, {
        name: "scale",
        type: "vec3",
        default: [1, 1, 1]
    }, {
        name: "opacity",
        type: "number",
        default: 1
    }, {
        name: "custom",
        type: "string",
        description: "For example camera.fov = 40"
    }]
}), Timeline.prototype.initialize = function() {
    this.animation = {
        custom: 0
    }, this.eventListener = !1, this.app.on("Timeline:" + this.entity.name, this.onPlay, this), this.app.on("Timeline:" + this.entity.name + "@Time", this.setTime, this), this.app.on("Timeline:" + this.entity.name + "@Loop", this.setLoop, this), this.entity.on("Timeline:Play", this.onPlay, this), this.on("destroy", this.onDestroy, this), this.on("state", this.onStateChange, this), this.autoplay && this.onPlay()
}, Timeline.prototype.setTime = function(t) {
    this.duration = t
}, Timeline.prototype.setLoop = function(t) {
    this.loop = t
}, Timeline.prototype.onStateChange = function(t) {
    !0 === t ? this.autoplay && this.onPlay() : this.reset()
}, Timeline.prototype.onDestroy = function() {}, Timeline.prototype.getEase = function() {
    return pc[this.ease]
}, Timeline.prototype.reset = function() {
    this.positionFrames && this.positionFrames.stop(), this.rotationFrames && this.rotationFrames.stop(), this.scaleFrames && this.scaleFrames.stop(), this.opacityFrames && this.opacityFrames.stop(), this.customFrames && this.customFrames.stop()
}, Timeline.prototype.setFirstFrame = function(options) {
    var frame = this.startFrame;
    if (options.isReverse && (frame = this.endFrame), this.position && this.entity.setLocalPosition(frame.position), this.rotation && this.entity.setLocalEulerAngles(frame.rotation), this.scale && this.entity.setLocalScale(frame.scale), this.opacity && (this.entity.element.opacity = frame.opacity), this.custom) {
        var parts = frame.custom.split(" = "),
            query = parts[0],
            value = parseFloat(parts[1]);
        this.animation.custom = value, eval("this.entity." + this.custom)
    }
}, Timeline.prototype.onComplete = function() {}, Timeline.prototype.onPlay = function(_options) {
    var self = this,
        options = {
            isReverse: !1,
            delay: this.delay,
            playSound: this.playSound
        };
    "object" == typeof _options && (options.isReverse = !!_options.isReverse), "object" == typeof _options && (options.playSound = !!_options.playSound), options.playSound && setTimeout((function(t) {
        t.entity.sound.play("Sound")
    }), 1e3 * this.soundDelay, this);
    var frame = this.endFrame;
    if (options.isReverse && (options.delay = 0, frame = this.startFrame), this.reset(), this.setFirstFrame(options), this.position && (this.positionFrames = this.entity.tween(this.entity.getLocalPosition()).to({
            x: frame.position.x,
            y: frame.position.y,
            z: frame.position.z
        }, this.duration, this.getEase()).delay(options.delay), this.eventListener || (this.eventListener = this.positionFrames.on("complete", this.onComplete, this)), this.loop && this.positionFrames.loop(!0), this.yoyo && this.positionFrames.yoyo(!0), this.repeat > 0 && this.positionFrames.repeat(this.repeat), this.positionFrames.start()), this.rotation && (this.rotationFrames = this.entity.tween(this.entity.getLocalEulerAngles()).rotate({
            x: frame.rotation.x,
            y: frame.rotation.y,
            z: frame.rotation.z
        }, this.duration, this.getEase()).delay(options.delay), this.eventListener || (this.eventListener = this.rotationFrames.on("complete", this.onComplete, this)), this.loop && this.rotationFrames.loop(!0), this.yoyo && this.rotationFrames.yoyo(!0), this.repeat > 0 && this.rotationFrames.repeat(this.repeat), this.rotationFrames.start()), this.scale && (this.scaleFrames = this.entity.tween(this.entity.getLocalScale()).to({
            x: frame.scale.x,
            y: frame.scale.y,
            z: frame.scale.z
        }, this.duration, this.getEase()).delay(options.delay), this.eventListener || (this.eventListener = this.scaleFrames.on("complete", this.onComplete, this)), this.loop && this.scaleFrames.loop(!0), this.yoyo && this.scaleFrames.yoyo(!0), this.repeat > 0 && this.scaleFrames.repeat(this.repeat), this.scaleFrames.start()), this.opacity && (this.opacityFrames = this.entity.tween(this.entity.element).to({
            opacity: frame.opacity
        }, this.duration, this.getEase()).delay(options.delay), this.eventListener || (this.eventListener = this.opacityFrames.on("complete", this.onComplete, this)), this.loop && this.opacityFrames.loop(!0), this.yoyo && this.opacityFrames.yoyo(!0), this.repeat > 0 && this.opacityFrames.repeat(this.repeat), this.opacityFrames.start()), this.custom) {
        var parts = frame.custom.split(" = "),
            query = parts[0],
            value = parseFloat(parts[1]);
        this.customFrames = this.entity.tween(this.animation).to({
            custom: value
        }, this.duration, this.getEase()).delay(options.delay), this.customFrames.on("update", (function() {
            eval("this.entity." + query + " = " + self.animation.custom)
        })), this.customFrames.start()
    }
    this.rollback > 0 && !options.isReverse && setTimeout((function(t) {
        t.onPlay({
            isReverse: !0
        })
    }), 1e3 * this.rollback, this)
};
pc.extend(pc, function() {
        var TweenManager = function(t) {
            this._app = t, this._tweens = [], this._add = []
        };
        TweenManager.prototype = {
            add: function(t) {
                return this._add.push(t), t
            },
            update: function(t) {
                for (var i = 0, e = this._tweens.length; i < e;) this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
                if (this._add.length) {
                    for (let t = 0; t < this._add.length; t++) this._tweens.indexOf(this._add[t]) > -1 || this._tweens.push(this._add[t]);
                    this._add.length = 0
                }
            }
        };
        var Tween = function(t, i, e) {
                pc.events.attach(this), this.manager = i, e && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = t, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new pc.Quat, this._toQuat = new pc.Quat, this._quat = new pc.Quat, this.easing = pc.Linear, this._sv = {}, this._ev = {}
            },
            _parseProperties = function(t) {
                var i;
                return t instanceof pc.Vec2 ? i = {
                    x: t.x,
                    y: t.y
                } : t instanceof pc.Vec3 ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z
                } : t instanceof pc.Vec4 || t instanceof pc.Quat ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z,
                    w: t.w
                } : t instanceof pc.Color ? (i = {
                    r: t.r,
                    g: t.g,
                    b: t.b
                }, void 0 !== t.a && (i.a = t.a)) : i = t, i
            };
        Tween.prototype = {
            to: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this
            },
            from: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._from = !0, this
            },
            rotate: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._slerp = !0, this
            },
            start: function() {
                var t, i, e, s;
                if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this._properties[t], this._ev[t] = this.target[t]);
                    this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(i, e, s))
                } else {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this.target[t], this._ev[t] = this._properties[t]);
                    this._slerp && (i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, void 0 !== this._properties.w ? (this._fromQuat.copy(this.target), this._toQuat.set(i, e, s, this._properties.w)) : (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), this._toQuat.setFromEulerAngles(i, e, s)))
                }
                return this._currentDelay = this._delay, this.manager.add(this), this
            },
            pause: function() {
                this.playing = !1
            },
            resume: function() {
                this.playing = !0
            },
            stop: function() {
                this.playing = !1, this.stopped = !0
            },
            delay: function(t) {
                return this._delay = t, this.pending = !0, this
            },
            repeat: function(t, i) {
                return this._count = 0, this._numRepeats = t, this._repeatDelay = i || 0, this
            },
            loop: function(t) {
                return t ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this
            },
            yoyo: function(t) {
                return this._yoyo = t, this
            },
            reverse: function() {
                return this._reverse = !this._reverse, this
            },
            chain: function() {
                for (var t = arguments.length; t--;) t > 0 ? arguments[t - 1]._chained = arguments[t] : this._chained = arguments[t];
                return this
            },
            update: function(t) {
                if (this.stopped) return !1;
                if (!this.playing) return !0;
                if (!this._reverse || this.pending ? this.time += t * this.timeScale : this.time -= t * this.timeScale, this.pending) {
                    if (!(this.time > this._currentDelay)) return !0;
                    this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time -= this._currentDelay, this.pending = !1
                }
                var i = 0;
                (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (i = this.duration - this.time, this.time = 0) : (i = this.time - this.duration, this.time = this.duration));
                var e, s, n = 0 === this.duration ? 1 : this.time / this.duration,
                    r = this.easing(n);
                for (var h in this._properties) this._properties.hasOwnProperty(h) && (e = this._sv[h], s = this._ev[h], this.target[h] = e + (s - e) * r);
                if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", t), this.complete) {
                    var a = this._repeat(i);
                    return a ? this.fire("loop") : (this.fire("complete", i), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), a
                }
                return !0
            },
            _repeat: function(t) {
                if (this._count < this._numRepeats) {
                    if (this._reverse ? this.time = this.duration - t : this.time = t, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
                        for (var i in this._properties) {
                            var e = this._sv[i];
                            this._sv[i] = this._ev[i], this._ev[i] = e
                        }
                        this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat))
                    }
                    return !0
                }
                return !1
            }
        };
        var BounceOut = function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            },
            BounceIn = function(t) {
                return 1 - BounceOut(1 - t)
            };
        return {
            TweenManager: TweenManager,
            Tween: Tween,
            Linear: function(t) {
                return t
            },
            QuadraticIn: function(t) {
                return t * t
            },
            QuadraticOut: function(t) {
                return t * (2 - t)
            },
            QuadraticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
            },
            CubicIn: function(t) {
                return t * t * t
            },
            CubicOut: function(t) {
                return --t * t * t + 1
            },
            CubicInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
            },
            QuarticIn: function(t) {
                return t * t * t * t
            },
            QuarticOut: function(t) {
                return 1 - --t * t * t * t
            },
            QuarticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
            },
            QuinticIn: function(t) {
                return t * t * t * t * t
            },
            QuinticOut: function(t) {
                return --t * t * t * t * t + 1
            },
            QuinticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
            },
            SineIn: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos(t * Math.PI / 2)
            },
            SineOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : Math.sin(t * Math.PI / 2)
            },
            SineInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : .5 * (1 - Math.cos(Math.PI * t))
            },
            ExponentialIn: function(t) {
                return 0 === t ? 0 : Math.pow(1024, t - 1)
            },
            ExponentialOut: function(t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
            },
            ExponentialInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            },
            CircularIn: function(t) {
                return 1 - Math.sqrt(1 - t * t)
            },
            CircularOut: function(t) {
                return Math.sqrt(1 - --t * t)
            },
            CircularInOut: function(t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            },
            BackIn: function(t) {
                var i = 1.70158;
                return t * t * ((i + 1) * t - i)
            },
            BackOut: function(t) {
                var i = 1.70158;
                return --t * t * ((i + 1) * t + i) + 1
            },
            BackInOut: function(t) {
                var i = 2.5949095;
                return (t *= 2) < 1 ? t * t * ((i + 1) * t - i) * .5 : .5 * ((t -= 2) * t * ((i + 1) * t + i) + 2)
            },
            BounceIn: BounceIn,
            BounceOut: BounceOut,
            BounceInOut: function(t) {
                return t < .5 ? .5 * BounceIn(2 * t) : .5 * BounceOut(2 * t - 1) + .5
            },
            ElasticIn: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), -e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4))
            },
            ElasticOut: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * t) * Math.sin((t - i) * (2 * Math.PI) / .4) + 1)
            },
            ElasticInOut: function(t) {
                var i, e = .1,
                    s = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = s * Math.asin(1 / e) / (2 * Math.PI), (t *= 2) < 1 ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * -.5 : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * .5 + 1)
            }
        }
    }()),
    function() {
        pc.AppBase.prototype.addTweenManager = function() {
            this._tweenManager = new pc.TweenManager(this), this.on("update", (function(t) {
                this._tweenManager.update(t)
            }))
        }, pc.AppBase.prototype.tween = function(t) {
            return new pc.Tween(t, this._tweenManager)
        }, pc.Entity.prototype.tween = function(t, i) {
            var e = this._app.tween(t);
            return e.entity = this, this.once("destroy", e.stop, e), i && i.element && (e.element = i.element), e
        };
        var t = pc.AppBase.getApplication();
        t && t.addTweenManager()
    }();
var Station = pc.createScript("station");
Station.attributes.add("condition", {
    type: "string",
    default: "None"
}), Station.attributes.add("conditionValue", {
    type: "string",
    default: "0"
}), Station.attributes.add("global", {
    type: "boolean",
    default: !1
}), Station.attributes.add("slowFeedback", {
    type: "boolean",
    default: !0
}), Station.attributes.add("connectedEntity", {
    type: "entity"
}), Station.attributes.add("timeBar", {
    type: "entity"
}), Station.attributes.add("cloneEntity", {
    type: "entity"
}), Station.attributes.add("onHoverShow", {
    type: "entity"
}), Station.attributes.add("onAppearDisable", {
    type: "entity"
}), Station.attributes.add("onAppearDisable2", {
    type: "entity"
}), Station.attributes.add("enableOnComplete", {
    type: "entity"
}), Station.attributes.add("disableOnComplete", {
    type: "entity"
}), Station.attributes.add("action", {
    type: "string",
    default: "Add:Item"
}), Station.attributes.add("value", {
    type: "string",
    default: "Wood"
}), Station.attributes.add("time", {
    type: "number",
    default: 1
}), Station.attributes.add("money", {
    type: "number",
    default: 0
}), Station.attributes.add("moneyStep", {
    type: "number",
    default: 1
}), Station.attributes.add("loop", {
    type: "boolean",
    default: !1
}), Station.attributes.add("bar", {
    type: "boolean",
    default: !0
}), Station.attributes.add("barName", {
    type: "string",
    default: "Bar"
}), Station.attributes.add("visualBar", {
    type: "entity"
}), Station.attributes.add("doDestroy", {
    type: "boolean",
    default: !0
}), Station.attributes.add("waitAnimation", {
    type: "string",
    default: ""
}), Station.attributes.add("waitValue", {
    type: "string",
    default: ""
}), Station.attributes.add("waitTime", {
    type: "number",
    default: 750
}), Station.prototype.initialize = function() {
    this.offset = new pc.Vec3(0, 3, 0), this.createdAt = Date.now(), this.startTime = parseInt("" + this.time);
    var t = Utils.getItem("Station_" + this.entity._guid);
    if (t && "Completed" == t) return setTimeout((function(t) {
        t.completeCarry(), t.destroy()
    }), 50, this), !1;
    this.who = !1, this.waitingVolume = 0, this.hoverEntity = this.entity.findByName("Hover"), this.edgeEntity = this.entity.findByName("Edge"), this.edgeEntity.enabled = !1, this.progressEntity = this.entity.findByName("Progress"), this.progressEntity && (this.progressEntity.enabled = !1), this.animationEntity = this.entity.findByName("Animation"), this.groupEntity = this.entity.findByName("Group"), this.moneyIcon = this.entity.findByName("MoneyIcon"), this.moneyText = this.entity.findByName("MoneyText"), this.moneyText && (this.moneyText.element.text = this.money + "$"), this.onAppearDisable && (this.onAppearDisable.enabled = !1), this.onAppearDisable2 && (this.onAppearDisable2.enabled = !1), this.startMoney = this.money, this.entity.on("Trigger", this.onTrigger, this), this.entity.on("Leave", this.onLeave, this), this.entity.on("Station:Upgrade", this.stationUpgrade, this), this.entity.on("Reset", this.reset, this), this.entity.on("Complete", this.onComplete, this), this.enoughMoneyToBuyOnce = !1, this.lastMoneyCheck = Date.now()
}, Station.prototype.onComplete = function() {
    setTimeout((function(t) {
        t.completeCarry(), t.destroy()
    }), 50, this)
}, Station.prototype.stationUpgrade = function(t, e) {
    this.time = this.startTime / e, this.timeBar && (this.timeBar.script.timeline.duration = this.time)
}, Station.prototype.conditionCallback = function(t) {
    this.bar && (this.app.fire("Timeline:Fill@Loop", !1), this.app.fire("Timeline:Fill@Time", this.time), this.app.fire("World2Screen:Show", this.barName, this.entity, this.offset)), this.who = t, this.lastTrigger = Date.now(), this.edgeEntity.element.color = pc.Color.GREEN
}, Station.prototype.conditionFallback = function(t) {
    this.app.fire("Sound:Play", "Error"), this.edgeEntity.element.color = pc.Color.RED, this.money > 0 && (this.app.fire("RewardManager:Show", "Money"), this.app.fire("Money:NoMoney"))
}, Station.prototype.onTrigger = function(t) {
    this.progressEntity && (this.progressEntity.enabled = !0), this.onHoverShow && (this.onHoverShow.enabled = !0), this.hoverEntity && this.hoverEntity.element && this.hoverEntity.element.opacity && (this.hoverEntity.element.opacity = .5, this.app.fire("Sound:Play", "Hover")), this.slowFeedback ? (clearTimeout(this.triggerTimer), this.triggerTimer = setTimeout((function(e) {
        e.updateTrigger(t)
    }), 500, this)) : this.updateTrigger(t)
}, Station.prototype.updateTrigger = function(t) {
    var e = this;
    this.progressEntity && (this.progressEntity.enabled = !0), this.hoverEntity && this.hoverEntity.element && (this.hoverEntity.element.opacity = .5, "None" == this.condition ? this.conditionCallback(t) : this.app.fire(this.condition, this.conditionValue, (function() {
        e.conditionCallback(t)
    }), (function() {
        e.conditionFallback(t)
    })), this.edgeEntity.enabled = !0), t && (this.waitingVolume = 1, this.app.fire(this.waitAnimation, this.waitValue, this.waitTime))
}, Station.prototype.onLeave = function(t) {
    clearTimeout(this.triggerTimer), this.progressEntity && (this.progressEntity.enabled = !1), this.onHoverShow && (this.onHoverShow.enabled = !1), this.hoverEntity && (this.hoverEntity.element.opacity = .8, this.who = !1, this.bar && this.app.fire("World2Screen:Hide", this.barName), this.edgeEntity.enabled = !1), this.app.fire("ThrowDisable"), this.waitingVolume = 0
}, Station.prototype.reset = function() {
    this.groupEntity && (this.groupEntity.enabled = !0), this.money = this.startMoney, this.moneyText && (this.moneyText.element.text = this.money + "$")
}, Station.prototype.complete = function() {
    if (this.money <= 0 && !this.doDestroy) return this.groupEntity && (this.groupEntity.enabled = !1), !1;
    if (this.money -= this.moneyStep, this.moneyText && (this.moneyText.element.text = this.money + "$", this.app.fire("Money:Remove", this.moneyStep)), this.money <= 0 && (this.completeCarry(), this.startMoney > 0 && this.doDestroy)) return this.destroy(), !1;
    var t = this.who;
    this.who = !1, this.updateTrigger(t), this.enoughMoneyToBuyOnce = !0
}, Station.prototype.destroy = function() {
    if (this.isDestroyed) return !1;
    this.entity.destroy(), Utils.setItem("Station_" + this.entity._guid, "Completed"), this.app.fire("MaterialShader:Progress", "progress", .001), this.enoughMoneyToBuyOnce = !0, this.isDestroyed = !0
}, Station.prototype.completeCarry = function() {
    if (this.app.fire("World2Screen:Hide", this.barName), this.action && (this.global ? this.app.fire(this.action, this.value, this.connectedEntity) : this.who.fire(this.action, this.value, this.connectedEntity)), this.enableOnComplete && (this.enableOnComplete.enabled = !0), this.disableOnComplete && (this.disableOnComplete.enabled = !1), this.cloneEntity) {
        var t = this.cloneEntity.clone();
        t.enabled = !0, t.sound.play("Whoosh"), t.sound.play("Drop"), this.app.fire("EffectManager:LandSmoke", t.getPosition()), this.app.root.addChild(t), this.app.fire("Motion", "LittleShake")
    }
    var e = this.who;
    this.who = !1, this.updateTrigger(e)
}, Station.prototype.upgradeStation = function() {
    return !this.enoughMoneyToBuyOnce && (!this.who && void(this.enoughMoneyToBuyOnce = !0))
}, Station.prototype.update = function(t) {
    if (0 === pc.app.timeScale) return !1;
    if (Date.now() - this.lastMoneyCheck > 1500 && !this.isCompleted && this.money > 0) {
        var e = this;
        this.app.fire("Money:Has", this.startMoney, (function() {
            e.upgradeStation()
        })), this.lastMoneyCheck = Date.now()
    }
    if (this.who && Date.now() - this.lastTrigger > 1e3 * this.time && (this.loop ? (this.complete(), this.bar && this.app.fire("World2Screen:Show", this.barName, this.entity, this.offset)) : (this.complete(), this.doDestroy ? this.destroy() : this.completeCarry())), this.entity.sound && this.entity.sound.slots.Waiting && (this.entity.sound.slots.Waiting.volume = pc.math.lerp(this.entity.sound.slots.Waiting.volume, this.waitingVolume, .1)), this.visualBar) {
        var i = (this.startMoney - this.money) / this.startMoney;
        this.visualBar.setLocalScale(i, 1, 1)
    }
    if (this.animationEntity && (this.who && !this.isDestroyed ? this.animationEntity.enabled = !0 : this.animationEntity.enabled = !1), this.who && !this.isDestroyed && this.progressEntity) {
        i = (this.startMoney - this.money) / this.startMoney;
        this.app.fire("MaterialShader:Progress", "progress", i)
    }
};
var Actions = pc.createScript("actions");
Actions.prototype.initialize = function() {
    this.entity.on("Money:Add", this.onMoneyAdd, this)
}, Actions.prototype.onMoneyAdd = function(t) {
    this.app.fire("Money:Add", t)
};
var Tone = pc.createScript("tone");
Tone.attributes.add("offset", {
    type: "number",
    default: .5
}), Tone.attributes.add("scale", {
    type: "number",
    default: .5
}), Tone.prototype.initialize = function() {
    this.on("state", this.onStateChange, this)
}, Tone.prototype.onStateChange = function(t) {
    t ? (this.entity.sound.play("Tone"), this.entity.sound.play("TickTock")) : (this.entity.sound.stop("Tone"), this.entity.sound.stop("TickTock"))
}, Tone.prototype.update = function(t) {
    var e = this.entity.getLocalScale().x;
    this.entity.sound.pitch = e * this.scale + this.offset
};
var Sound = pc.createScript("sound");
Sound.prototype.initialize = function() {
    this.app.on("Sound:Play", this.playSound, this)
}, Sound.prototype.playSound = function(n) {
    this.entity.sound.play(n)
};
var DealtDamage = pc.createScript("dealtDamage");
DealtDamage.attributes.add("numberEntity", {
    type: "entity"
}), DealtDamage.attributes.add("holderEntity", {
    type: "entity"
}), DealtDamage.prototype.initialize = function() {
    this.numbers = [], this.lastDamage = 100, this.defaultOffset = new pc.Vec3(0, .1, 0), this.isMinus = 1, this.cameraEntity = this.app.root.findByName("Lens"), this.numberEntity.enabled = !1, this.app.on("DealtDamage:Trigger", this.onDamageDealt, this), this.app.on("DealtDamage:Screen", this.onTextScreen, this)
}, DealtDamage.prototype.destroyEntity = function(e) {
    this.numbers.splice(this.numbers.indexOf(e), 1), e.destroy()
}, DealtDamage.prototype.onDamageDealt = function(e, t, i) {
    var n = this.numberEntity.clone();
    n.element.text = e > 0 ? Math.round(e) + "" : e, this.offset = this.defaultOffset, n.player = new pc.Vec3(t.x, t.y, t.z), n.element.offsetX = 50 * Math.random() - 50 * Math.random(), n.element.offsetY = -1.7, n.element.opacity = 1;
    this.isMinus = i ? 1 : -1, this.lastDamage = e;
    var a = n.tween(n.getLocalScale()).to({
        x: 3,
        y: 3,
        z: 3
    }, .15, pc.BounceOut).delay(.1);
    a.on("complete", (function() {
        this.entity.tween(this.entity.getLocalScale()).to({
            x: 1,
            y: 1,
            z: 1
        }, .4, pc.BounceOut).start()
    })), a.start(), n.tween(n.element).to({
        offsetY: 0
    }, .3, pc.Linear).start().on("complete", (function() {
        n.tween(n.element).to({
            opacity: 0,
            offsetY: .8
        }, .3, pc.Linear).delay(1).start()
    })), setTimeout((function(e, t) {
        e.destroyEntity(t)
    }), 3e3, this, n), this.numbers.push(n), this.holderEntity.addChild(n)
}, DealtDamage.prototype.onTextScreen = function(e, t, i) {
    var n = this.numberEntity.clone();
    n.element.text = e > 0 ? Math.round(e) + "" : e, this.offset = this.defaultOffset, n.originalPosition = new pc.Vec3(t.x, t.y, t.z), n.element.offsetX = 1 * Math.random() - 1 * Math.random(), n.element.offsetY = 0, n.element.opacity = 1, n.isScreenElement = !0;
    this.isMinus = i ? 1 : -1, this.lastDamage = e;
    var a = n.tween(n.getLocalScale()).to({
        x: 3,
        y: 3,
        z: 3
    }, .15, pc.BounceOut).delay(.1);
    a.on("complete", (function() {
        this.entity.tween(this.entity.getLocalScale()).to({
            x: 1,
            y: 1,
            z: 1
        }, .4, pc.BounceOut).start()
    })), a.start(), n.tween(n.element).to({
        offsetY: .25
    }, .3, pc.Linear).start().on("complete", (function() {
        n.tween(n.element).to({
            opacity: 0,
            offsetY: .8
        }, .3, pc.Linear).delay(1).start()
    })), setTimeout((function(e, t) {
        e.destroyEntity(t)
    }), 3e3, this, n), this.numbers.push(n), this.holderEntity.addChild(n)
}, DealtDamage.prototype.updateNumberPosition = function(e) {
    var t = new pc.Vec3,
        i = this.cameraEntity.camera,
        n = this.app.graphicsDevice.maxPixelRatio,
        a = this.entity.screen.scale,
        s = this.app.graphicsDevice;
    if (e.isScreenElement) return t.x *= n, t.y *= n, e.setLocalPosition(e.originalPosition.x + 10 * e.element.offsetX, (s.height - t.y) / a - e.originalPosition.y + 120 * e.element.offsetY, 0), e.enabled = !0, !1;
    var o = !1;
    return o = e.player.name ? e.player.getPosition().clone().add(this.offset) : e.player, !!i && (!!e && (i.worldToScreen(o, t), t.x *= n, t.y *= n, void(t.x > 0 && t.x < this.app.graphicsDevice.width && t.y > 0 && t.y < this.app.graphicsDevice.height && t.z > 0 ? (e.setLocalPosition(t.x / a + e.element.offsetX, (s.height - t.y) / a + this.isMinus * Math.cos(e.element.offsetY) * Math.cos(e.element.offsetY) * 120 + (this.isMinus < 0 ? 150 : 0), 0), e.element.outlineThickness = e.element.opacity, e.enabled = !0) : e.enabled = !1)))
}, DealtDamage.prototype.update = function(e) {
    for (var t = this.numbers.length; t--;) this.updateNumberPosition(this.numbers[t])
};
var Carry = pc.createScript("carry");
Carry.attributes.add("resetEntity", {
    type: "entity"
}), Carry.prototype.initialize = function() {
    this.isShowingBar = !1, this.offset = new pc.Vec3(0, 1, 0), this.takingThreshold = 0, this.lastDt = .1, this.who = !1, this.entity.on("Trigger", this.onTrigger, this), this.entity.on("Leave", this.onLeave, this), this.on("destroy", this.onDestroy, this), this.app.fire("Scene:Triggers")
}, Carry.prototype.onDestroy = function() {
    this.onLeave(), this.isColliding = !1, this.app.fire("Scene:Triggers")
}, Carry.prototype.showTakingBar = function() {
    if (this.isShowingBar) return !1;
    this.app.fire("World2Screen:Show", "TakeBar", this.entity, this.offset), this.isShowingBar = !0
}, Carry.prototype.onLeave = function() {
    this.app.fire("World2Screen:Hide", "TakeBar"), this.isColliding = !1, this.isShowingBar = !1, this.takingThreshold = 0
}, Carry.prototype.onTrigger = function(t) {
    return this.isColliding = !1, this.takingThreshold < 1 && this.entity.tags.list().indexOf("WaitCarry") > -1 ? (this.isColliding = !0, this.showTakingBar(), !1) : !(Date.now() - t.script.movement.lastCarryTime < 200) && (t.script.movement.lastCarryTime = Date.now(), t.script.carries.hasSpace() ? (this.who = t, this.who.fire("Carry", this.entity), this.entity.fire("Take", this.who), this.entity.reparent(this.who.script.carries.getAvailable()), this.entity.ownerEntity = this.who, this.entity.setLocalEulerAngles(0, 0, 0), this.entity.setLocalPosition(0, 0, 0), this.entity.tags.remove("Trigger"), this.entity.sound.play("Whoosh"), this.entity.sound.play("Take"), this.app.fire("Scene:Triggers"), this.app.fire("EffectManager:LandSmoke", this.entity.getPosition()), this.app.fire("Carry", this.entity.name), this.who.on("Drop", this.onDrop, this), this.resetEntity && this.resetEntity.fire("Reset"), t.script.carries.updateCarries(), this.app.fire("World2Screen:Hide", "TakeBar"), void t.script.collisions.hasAnyCollision()) : (t.script.carries && !t.script.carries.maxTextEntity.enabled && (t.script.carries.maxTextEntity.enabled = !0, setTimeout((function() {
        t.script.carries.maxTextEntity.enabled = !1
    }), 2e3)), !1))
}, Carry.prototype.onDrop = function(t, i) {
    return !!this.who && ((!t || t == this.entity.name) && (!(Date.now() - this.who.script.movement.lastCarryTime < 200) && (this.app.fire("EffectManager:LandSmoke", this.entity.getPosition()), i && i.fire("Drop", this.entity.name), this.entity.sound && (this.entity.sound.play("Drop"), this.entity.sound.play("Whoosh")), this.entity.fire("Drop", this.who), this.who.off("Drop", this.onDrop, this), this.who.script.movement.lastCarryTime = Date.now(), this.entity.destroy(), this.who.script.carries.hasAnyCarry() || this.who.fire("Carry", !1), this.who.script.carries.updateCarries(), void(this.who = !1))))
}, Carry.prototype.update = function(t) {
    this.isColliding && this.takingThreshold < 1 && (this.takingThreshold += 2 * t, this.app.fire("Bar:Taking", this.takingThreshold))
};
var Switch = pc.createScript("switch");
Switch.prototype.initialize = function() {
    this.options = this.entity.findByTag("Option"), this.options.forEach((function(t) {
        t.enabled = !1
    })), this.entity.on("Drop", this.onDrop, this)
}, Switch.prototype.onDrop = function(t) {
    for (var i = this.options.length; i--;) {
        var n = this.options[i];
        n.name == t ? n.enabled = !0 : n.enabled = !1
    }
    this.entity.sound.play("Option"), this.entity.fire("Timeline:Play"), this.app.fire("EffectManager:LandSmoke", this.entity.getPosition()), this.app.fire("Motion", "LittleShake")
};
var TableManager = pc.createScript("tableManager");
TableManager.attributes.add("tables", {
    type: "entity",
    array: !0
}), TableManager.attributes.add("stations", {
    type: "entity",
    array: !0
}), TableManager.prototype.initialize = function() {
    this.app.on("Create:Table", this.onCreateTable, this);
    for (var t = 0; t < this.tables.length; t++) this.tables[t].enabled = !1;
    for (t = 0; t < this.stations.length; t++) this.stations[t].enabled = !1;
    this.stations[0].enabled = !0, this.stationIndex = 0, this.isTutorialCompleted = !1, "Completed" == Utils.getItem("Tutorial") && (this.isTutorialCompleted = !0), this.app.on("Tutorial:Complete", this.onTutorialCompleted, this)
}, TableManager.prototype.onTutorialCompleted = function() {
    this.isTutorialCompleted = !0
}, TableManager.prototype.onCreateTable = function(t) {
    this.tables[t].enabled = !0, this.stationIndex++
}, TableManager.prototype.update = function() {
    this.isTutorialCompleted
};
var CustomerManager = pc.createScript("customerManager");
CustomerManager.attributes.add("customerEntities", {
    type: "entity",
    array: !0
}), CustomerManager.attributes.add("harderCustomerEntities", {
    type: "entity",
    array: !0
}), CustomerManager.attributes.add("happyNumberEntity", {
    type: "entity"
}), CustomerManager.attributes.add("sadNumberEntity", {
    type: "entity"
}), CustomerManager.attributes.add("moreCustomersUpgrade", {
    type: "entity"
}), CustomerManager.prototype.initialize = function() {
    this.happyCount = 0, this.sadCount = 0, pc.gameStartTime = Date.now(), this.lastCheck = Date.now(), this.totalTableCount = 0, this.lastCustomerCreateTime = Date.now() - 15e3, this.lastTableClear = Date.now() - 15e3, this.nextDelay = 1e3, this.app.on("Customer:RefreshTable", this.onTableCreated, this), this.app.on("Customer:ResetSpawnTimer", this.resetSpawnTimer, this), this.app.on("Customer:Vote", this.setCustomerVote, this)
}, CustomerManager.prototype.resetSpawnTimer = function() {
    this.lastTableClear = Date.now()
}, CustomerManager.prototype.setCustomerVote = function(t) {
    "Happy" == t && this.happyCount++, "Sad" == t && this.sadCount++, this.happyNumberEntity.element.text = this.happyCount + "", this.sadNumberEntity.element.text = this.sadCount + ""
}, CustomerManager.prototype.onTableCreated = function() {
    this.tables = this.app.root.findByTag("Table");
    var t = 0;
    this.tables.forEach((function(e) {
        e.enabled && t++
    })), this.totalTableCount = t
}, CustomerManager.prototype.getAvailableTable = function() {
    for (var t = [], e = this.tables.length; e--;) this.tables[e].enabled && this.tables[e].script && !this.tables[e].script.table.customer && !this.tables[e].script.table.isDirty && t.push(this.tables[e]);
    return t.length > 0 && t[Math.floor(Math.random() * t.length)]
}, CustomerManager.prototype.getTotalTableCount = function() {
    for (var t = 0, e = this.tables.length; e--;) this.tables[e].enabled && this.tables[e].script && t++;
    return t
}, CustomerManager.prototype.createCustomer = function() {
    var t = 9e3,
        e = this.getTotalTableCount();
    if (e > 2 && (t = 14e3), e >= 4 && (t = 13e3), this.moreCustomersUpgrade.enabled && (t = 3e3), Date.now() - this.lastCustomerCreateTime < t || Date.now() - this.lastTableClear < t) return !1;
    var a = this.getAvailableTable();
    if (!a) return !1;
    Math.random() > .85 && (Date.now(), pc.gameStartTime);
    var s = (Math.random() > .9 && Date.now() - pc.gameStartTime > 18e4 ? this.harderCustomerEntities[Math.floor(Math.random() * this.harderCustomerEntities.length)] : this.customerEntities[Math.floor(Math.random() * this.customerEntities.length)]).clone();
    a.script.table.customer = s, s.script.customer.target = a, s.script.customer.sitTable = a, s.enabled = !0, this.app.root.addChild(s), this.app.fire("Scene:Collision"), this.lastCustomerCreateTime = Date.now()
}, CustomerManager.prototype.update = function() {
    this.totalTableCount > 0 && Date.now() - this.lastCheck > 1e3 && (this.createCustomer(), this.lastCheck = Date.now())
};
var Customer = pc.createScript("customer");
Customer.attributes.add("isFat", {
    type: "boolean",
    default: !1
}), Customer.attributes.add("target", {
    type: "entity"
}), Customer.attributes.add("characterEntity", {
    type: "entity"
}), Customer.attributes.add("rigEntity", {
    type: "entity"
}), Customer.attributes.add("doorTarget", {
    type: "entity"
}), Customer.attributes.add("cashMachineEntity", {
    type: "entity"
}), Customer.attributes.add("kitchenEntity", {
    type: "entity"
}), Customer.attributes.add("modelEntity", {
    type: "entity"
}), Customer.attributes.add("sitTable", {
    type: "entity"
}), Customer.attributes.add("speed", {
    type: "number",
    default: .1
}), Customer.attributes.add("turnSpeed", {
    type: "number",
    default: .1
}), Customer.attributes.add("wants", {
    type: "string",
    default: "Burger"
}), Customer.attributes.add("cokeEntity", {
    type: "entity"
}), Customer.attributes.add("burgerEntity", {
    type: "entity"
}), Customer.attributes.add("iceCreamEntity", {
    type: "entity"
}), Customer.prototype.initialize = function() {
    var t = !1;
    this.offset = new pc.Vec3(0, 2, 0), this.lastDropAllow = -1, this.state = "Sit", this.isReadyToPay = !1, this.targetCashMachine = !1, this.direction = 0, this.nextDirection = 0, this.options = this.kitchenEntity.script.kitchenManager.getAvailableOptions(), this.pieceItems = [], this.wants = [];
    var e = this.app.root.findByTag("Customer"),
        i = 0;
    for (var s in e) {
        var a = e[s];
        a && a.enabled && (i += a.script.customer.wants.length)
    }
    var n = .2;
    for (var r in i >= 3 && (n = .5), i >= 5 && (n = .75), i >= 7 && (n = .85), this.options) {
        var o = this.options[r];
        if (Math.random() > n && o) {
            var h = 1;
            Math.random() > .2 && (h = 1 + Math.floor(1 * Math.random())), "Coke" == o && (h = 1), this.wants.push({
                name: o,
                amount: h
            })
        }
    }
    if (0 === this.wants.length && (this.wants = [{
            name: "Burger",
            amount: 1 + Math.floor(3 * Math.random())
        }]), pc.RequestNumber) {
        this.howManyPieces = 0;
        for (var p = 0; p < this.wants.length; p++) this.howManyPieces += this.wants[p].amount
    } else pc.RequestNumber = "Set", t = !0, this.howManyPieces = 1, this.wants = [{
        name: "Burger",
        amount: 1
    }];
    if (this.isFat ? this.sadLeaveTime = 150 : this.sadLeaveTime = 45 + 10 * this.howManyPieces, this.howLongWait = 6500 * this.howManyPieces, this.money = 8 * this.howManyPieces, t && (this.sadLeaveTime = 150, this.howLongWait = 4e3), this.isFat && (this.money *= 2), this.wantDisplay = !1, this.entity.on("Trigger", this.onTrigger, this), this.entity.on("TrigerWaiter", this.onTrigerWaiter, this), this.characterEntity.anim.on("Sound", this.playSound, this), this.on("destroy", this.onDestroy, this), pc.RandomModelNumber || (pc.RandomModelNumber = 1), !this.isFat) {
        var y = this,
            m = this.app.assets.find("Model-" + pc.RandomModelNumber);
        m.ready((function(t) {
            y.rigEntity.render.asset = t
        })), this.app.assets.load(m)
    }
    pc.RandomModelNumber++, pc.RandomModelNumber > 5 && (pc.RandomModelNumber = 1), this.app.fire("Scene:Triggers"), setTimeout((function() {
        pc.app.fire("Motion", "Open"), pc.app.fire("Sound:Play", "DoorBell")
    }), 1200), this.app.on("CashOrderChanged", this.onCashOrderChanged, this)
}, Customer.prototype.playSound = function(t) {
    this.entity.sound.play(t.string + "-" + (Math.floor(Math.random()) + 1))
}, Customer.prototype.onCashOrderChanged = function() {
    if ("Leave" == this.state) return !1;
    if (this.targetCashMachine) {
        var t = Number(this.entity.tags.list()[3]) - 1;
        this.entity.tags.list()[3] = t.toString(), this.target = this.cashMachineEntity.script.cashMachine.getTarget(t)
    }
}, Customer.prototype.onDestroy = function() {
    this.wantDisplay && this.wantDisplay.destroy(), this.paymentDisplay && this.paymentDisplay.destroy(), this.entity.off("CashOrderChanged", this.onCashOrderChanged, this), clearTimeout(this.sadLeaveTimer)
}, Customer.prototype.getTotalNumber = function() {
    for (var t = 0, e = 0; e < this.wants.length; e++) t += this.wants[e].amount;
    return t
}, Customer.prototype.onTrigerWaiter = function(t, e) {
    for (var i in this.wants) this.wants[i].name == e && (this.wants[i].amount--, t.fire("Drop", this.wants[i].name), this.app.fire("Deliver", this.wants[i].name), this.sitTable.fire("Deliver"), this.updateItems(), this.getTotalNumber() <= 0 && this.completeRequest())
}, Customer.prototype.onTrigger = function(t) {
    if ("Leave" == this.state) return !1;
    if ("Pay" == this.state) return !1;
    if ("Sit" == this.state) return !1;
    if (Date.now() - this.lastDropAllow < 200) return !1;
    if (t.script.carries.hasCarryByName("Garbage")) return this.leave(), !1;
    var e = t.script.carries.hasCarryByNameAny(this.wants);
    return !!e && (!(e.amount <= 0) && (e.amount--, t.fire("Drop", e.name), this.app.fire("Deliver", e.name), this.sitTable.fire("Deliver"), this.updateItems(), this.getTotalNumber() <= 0 && this.completeRequest(), void(this.lastDropAllow = Date.now())))
}, Customer.prototype.hasCoke = function() {
    var t = !1;
    for (var e in this.wants) {
        "Coke" == this.wants[e].name && (t = !0)
    }
    return t
}, Customer.prototype.hasIceCream = function() {
    var t = !1;
    for (var e in this.wants) {
        "IceCream" == this.wants[e].name && (t = !0)
    }
    return t
}, Customer.prototype.completeRequest = function() {
    this.hasIceCream() ? (this.characterEntity.anim.setTrigger("IceCream"), this.iceCreamEntity.enabled = !0) : this.hasCoke() ? (this.characterEntity.anim.setTrigger("Drink"), this.cokeEntity.enabled = !0) : (this.characterEntity.anim.setTrigger("Eat"), this.burgerEntity.enabled = !0), this.state = "Pay", clearTimeout(this.sadLeaveTimer), this.wantDisplay && this.wantDisplay.destroy(), setTimeout((function(t) {
        t.goToPay()
    }), this.howLongWait, this)
}, Customer.prototype.leaveHappy = function() {
    this.paymentDisplayState.element.textureAsset = this.app.assets.find("Happy-Icon.png"), this.app.fire("Customer:Vote", "Happy"), this.leaveShop()
}, Customer.prototype.readyToPay = function() {
    this.isReadyToPay = !0, this.characterEntity.anim.setTrigger("Stop"), this.entity.sound.play("Ready"), this.app.fire("World2Screen:Clone", "Pay", this.entity, this.offset, this.setPaymentDisplay.bind(this)), this.setSadLeaveTimer(this.sadLeaveTime)
}, Customer.prototype.walk = function() {
    this.characterEntity.anim.setTrigger("Walk"), this.characterEntity.setLocalPosition(0, 0, 0)
}, Customer.prototype.sit = function() {
    this.characterEntity.anim.setTrigger("Sit"), Math.random() > .5 ? (this.characterEntity.setLocalPosition(0, 0, .81), this.modelEntity.setLocalEulerAngles(0, -90, 0)) : (this.characterEntity.setLocalPosition(0, 0, .44), this.modelEntity.setLocalEulerAngles(0, 90, 0))
}, Customer.prototype.goToPay = function() {
    this.app.fire("Customer:ResetSpawnTimer"), this.sitTable.fire("SetDirty"), this.sitTable.script.table.customer = !1, this.cokeEntity.enabled = !1, this.burgerEntity.enabled = !1, setTimeout((function(t) {
        t.cashMachineEntity.script.cashMachine.setCustomer(t.entity), t.walk(), t.targetCashMachine = !0, t.target = t.cashMachineEntity.script.cashMachine.getTarget()
    }), 1800, this)
}, Customer.prototype.leaveShop = function() {
    this.state = "Leave", this.walk(), this.target = this.doorTarget
}, Customer.prototype.hasMoney = function() {
    return this.money >= 2
}, Customer.prototype.getMoney = function() {
    return this.money -= 2, 2
}, Customer.prototype.showRequest = function() {
    this.app.fire("World2Screen:Clone", "Want", this.entity, this.offset, this.setDisplay.bind(this)), this.entity.sound.play("Notify"), this.state = "Wait", this.setSadLeaveTimer(this.sadLeaveTime)
}, Customer.prototype.setSadLeaveTimer = function(t) {
    clearTimeout(this.sadLeaveTimer), this.sadLeaveTimer = setTimeout((function(t) {
        t.leave()
    }), 1e3 * t, this)
}, Customer.prototype.leave = function() {
    this.walk(), this.wantDisplay.destroy(), this.state = "Leave", this.wants = [{
        name: "Sad",
        amount: -1
    }], this.app.fire("Customer:Vote", "Sad"), this.entity.sound.play("Fail"), this.isReadyToPay ? (this.cashMachineEntity.script.cashMachine.cancelPayment(this.entity), this.paymentDisplayState && (this.paymentDisplayState.element.textureAsset = this.app.assets.find("Sad-Icon.png"))) : (this.app.fire("World2Screen:Clone", "Want", this.entity, this.offset, this.setDisplay.bind(this)), this.sitTable.script.table.customer = !1), this.target = this.doorTarget
}, Customer.prototype.update = function(t) {
    var e = 1;
    if (this.target) {
        e = this.entity.getPosition().sub(this.target.getPosition()).length();
        var i = this.entity.getPosition(),
            s = this.target.getPosition();
        this.nextDirection = Utils.lookAt(i.x, i.z, s.x, s.z), this.direction = Utils.rotate(this.direction, this.nextDirection, this.turnSpeed), e > .1 && this.entity.translateLocal(Math.sin(this.direction) * this.speed * t, 0, Math.cos(this.direction) * this.speed * t), this.modelEntity.lookAt(this.target.getPosition())
    }
    e <= .25 && this.target && ("Sit" == this.state && (this.sit(), this.showRequest()), "Pay" == this.state && (this.isReadyToPay || this.readyToPay()), "Leave" == this.state && (this.paymentDisplay && this.paymentDisplay.destroy(), this.app.fire("Customer:Leave"), this.entity.destroy()), this.target = !1)
}, Customer.prototype.setDisplay = function(t) {
    this.wantDisplay = t, this.backgroundEntity = t.findByName("Background"), this.pieceItem = t.findByName("Item"), this.pieceHolder = t.findByName("ContentHolder"), this.barEntity = t.findByName("Bar"), this.pieceItem.enabled = !1, this.updateItems(), t.findByName("Fat").enabled = this.isFat, this.barEntity && "Leave" == this.state && this.barEntity.destroy()
}, Customer.prototype.updateItems = function() {
    for (var t = this.pieceItems.length; t--;) this.pieceItems[t] && this.pieceItems[t].destroy();
    for (var e in this.pieceItems = [], this.wants) {
        var i = this.wants[e],
            s = this.pieceItem.clone();
        if (i.amount > 0) s.enabled = !0, (a = s.findByName("Icon")) && (a.element.textureAsset = this.app.assets.find(i.name + "-Icon.png"), s.findByName("Number").element.text = i.amount + ""), this.pieceHolder.addChild(s), this.pieceItems.push(s);
        else if (-1 === i.amount) {
            var a;
            s.enabled = !0, (a = s.findByName("Icon")) && (a.element.textureAsset = this.app.assets.find(i.name + "-Icon.png"), s.findByName("Number").enabled = !1), this.pieceHolder.addChild(s), this.pieceItems.push(s)
        }
    }
    this.backgroundEntity && this.backgroundEntity.element && this.backgroundEntity.element.width > 0 && (this.backgroundEntity.element.width = 80 * this.pieceItems.length), this.wantDisplay && this.wantDisplay.element && this.wantDisplay.element.width > 0 && (this.wantDisplay.element.width = 90 * this.pieceItems.length + 40)
}, Customer.prototype.getWantByName = function(t) {
    if ("Wait" != this.state) return !1;
    var e = !1;
    for (var i in this.wants) {
        var s = this.wants[i];
        s.name == t && s.amount > 0 && (e = !0)
    }
    return e
}, Customer.prototype.setPaymentDisplay = function(t) {
    this.paymentDisplay = t, this.paymentDisplayState = t.findByName("Icon"), this.paymentDisplayTimer = t.findByName("Bar")
};
var Table = pc.createScript("table");
Table.attributes.add("customer", {
    type: "entity"
}), Table.attributes.add("plateEntity", {
    type: "entity"
}), Table.attributes.add("isDirty", {
    type: "boolean",
    default: !1
}), Table.prototype.initialize = function() {
    this.app.fire("Customer:RefreshTable"), this.entity.on("SetDirty", this.setDirty, this), this.entity.on("Deliver", this.setDeliver, this), this.entity.sound.play("Rank"), this.entity.sound.play("Whoosh"), this.app.fire("EffectManager:LandSmoke", this.entity.getPosition()), this.app.fire("Light:Render")
}, Table.prototype.setDeliver = function() {
    this.plateEntity.enabled = !0, this.entity.sound.play("Whoosh"), this.entity.sound.play("Deliver")
}, Table.prototype.setDirty = function() {
    this.plateEntity.enabled = !1, this.app.fire("Kitchen:DirtyPlate", this), this.isDirty = !0
};
var KitchenManager = pc.createScript("kitchenManager");
KitchenManager.attributes.add("foods", {
    type: "entity",
    array: !0
}), KitchenManager.attributes.add("stations", {
    type: "entity",
    array: !0
}), KitchenManager.attributes.add("assistants", {
    type: "entity",
    array: !0
}), KitchenManager.attributes.add("placePointsBurger", {
    type: "entity",
    array: !0
}), KitchenManager.attributes.add("placePointsFries", {
    type: "entity",
    array: !0
}), KitchenManager.attributes.add("dirtyPlate", {
    type: "entity"
}), KitchenManager.attributes.add("garbage", {
    type: "entity"
}), KitchenManager.prototype.initialize = function() {
    this.cookIndex = 0, this.counts = {
        Burger: 3,
        Fries: 3,
        Coke: 3
    }, this.lastGarbageTime = Date.now(), this.app.on("Kitchen:Create", this.create, this), this.app.on("Kitchen:GhostCreate", this.ghostCreate, this), this.app.on("Kitchen:ChefCook", this.chefCook, this), this.app.on("Kitchen:Open", this.open, this), this.app.on("Kitchen:Assistant", this.hire, this), this.app.on("Kitchen:DirtyPlate", this.createDirtyPlate, this), this.app.on("Kitchen:Upgrade", this.upgrade, this), this.app.on("Kitchen:HasSpace", this.hasSpace, this);
    for (var t = 0; t < this.foods.length; t++) this.foods[t].enabled = !1;
    for (t = 0; t < this.assistants.length; t++) this.assistants[t].enabled = !1
}, KitchenManager.prototype.upgrade = function(t, e) {
    this.counts[t] = e
}, KitchenManager.prototype.createDirtyPlate = function(t) {
    var e = this.dirtyPlate.clone();
    e.enabled = !0, e.setPosition(t.entity.getPosition().clone().add(new pc.Vec3(0, .85, 0))), e.on("Take", (function() {
        t.isDirty = !1
    })), this.app.root.addChild(e), this.app.fire("DirtyPlate:Created", e)
}, KitchenManager.prototype.open = function(t) {
    for (var e = 0; e < this.stations.length; e++) this.stations[e].name === t && (this.stations[e].enabled = !0, this.app.fire("EffectManager:Unlock", this.stations[e].getPosition()), this.app.fire("Light:Render"))
}, KitchenManager.prototype.hire = function(t) {
    for (var e = 0; e < this.assistants.length; e++) this.assistants[e].name === t && (this.assistants[e].enabled = !0, this.app.fire("EffectManager:Unlock", this.assistants[e].getPosition()), this.app.fire("Scene:Collision"), this.app.fire("Camera:Focus", this.assistants[e]))
}, KitchenManager.prototype.getFoodCount = function(t) {
    for (var e = this.app.root.findByTag("Collect"), a = 0, i = 0; i < e.length; i++) e[i].name === t && e[i].enabled && !e[i].script.carry.who && a++;
    return a
}, KitchenManager.prototype.hasSpace = function(t, e, a) {
    this.totalFoodCountByName(t) < this.counts[t] ? e() : a()
}, KitchenManager.prototype.totalFoodCount = function() {
    for (var t = this.app.root.findByTag("Food"), e = 0, a = 0; a < t.length; a++) t[a].enabled && e++;
    return e
}, KitchenManager.prototype.totalFoodCountByName = function(t) {
    for (var e = this.app.root.findByTag("Food"), a = 0, i = 0; i < e.length; i++) e[i].enabled && e[i].name == t && !e[i].script.carry.who && a++;
    return a
}, KitchenManager.prototype.ghostCreate = function(t) {
    this.create(t, !0)
}, KitchenManager.prototype.chefCook = function() {
    1 === this.cookIndex ? this.create("Burger", !0) : 0 === this.cookIndex && this.create("Fries", !0), this.cookIndex++, this.cookIndex > 1 && (this.cookIndex = 0)
}, KitchenManager.prototype.getAvailablePlacePoint = function(t) {
    for (var e = this["placePoints" + t].length; e--;) {
        var a = this["placePoints" + t][e];
        if (a && !0 === a.enabled && 0 === a.children.length) return a
    }
}, KitchenManager.prototype.create = function(t, e) {
    if (this.getFoodCount(t) >= this.counts[t]) return !1;
    var a = this.foods.find((function(e) {
        return e.name === t
    })).clone();
    this.totalFoodCount();
    if (a.enabled = !0, "Burger" == t) a.setLocalPosition(0, 0, 0), e || this.app.fire("Camera:Offset", new pc.Vec3(.1, 0, -.15)), this.app.fire("Throw", "Burger", 750), setTimeout((function(t) {
        var e = t.getAvailablePlacePoint("Burger");
        e && e.addChild(a)
    }), 750, this);
    else if ("Fries" == t) {
        a.setLocalPosition(0, 0, 0);
        var i = this.getAvailablePlacePoint("Fries");
        i && i.addChild(a)
    } else this.app.root.addChild(a);
    e || this.app.fire("Motion", "LittleShake")
}, KitchenManager.prototype.getAvailableOptions = function() {
    var t = [];
    for (var e in this.stations) {
        var a = this.stations[e];
        a.enabled && t.push(a.name)
    }
    return t
}, KitchenManager.prototype.updateGarbage = function() {
    if (Date.now() - this.lastGarbageTime > 3e5) {
        if (this.app.root.findByTag("GarbageBag").length > 1) return !1;
        var t = this.garbage.clone(),
            e = this.garbage.getPosition().clone();
        t.setPosition(e.x + .5 * (Math.random() - Math.random()), 0, e.z + .5 * (Math.random() - Math.random())), t.enabled = !0, this.app.root.addChild(t), this.lastGarbageTime = Date.now()
    }
}, KitchenManager.prototype.update = function() {
    this.updateGarbage()
};
var Money = pc.createScript("money");
Money.attributes.add("amount", {
    type: "number",
    default: 100
}), Money.prototype.initialize = function() {
    this.entity.on("Trigger", this.onTrigger, this), this.app.fire("Scene:Triggers")
}, Money.prototype.onTrigger = function() {
    this.app.fire("Money:Add", this.amount), this.entity.destroy()
};
var Carries = pc.createScript("carries");
Carries.attributes.add("maxTextEntity", {
    type: "entity"
}), Carries.prototype.initialize = function() {
    this.carryPoints = this.entity.findByTag("CarryPoint"), this.entity.on("Station:Upgrade", this.setUpgradeState, this)
}, Carries.prototype.setUpgradeState = function(r, t) {
    for (var i = [...this.carryPoints].reverse(), n = i.length; n--;) n < r && (i[n].enabled = !0)
}, Carries.prototype.getAvailable = function() {
    for (var r = this.carryPoints.length; r--;)
        if (this.carryPoints[r].enabled && 0 === this.carryPoints[r].children.length) return this.carryPoints[r];
    return null
}, Carries.prototype.hasAnyCarry = function() {
    for (var r = 0; r < this.carryPoints.length; r++)
        if (this.carryPoints[r].enabled && this.carryPoints[r].children.length > 0 && "Garbage" != this.carryPoints[r].children[0].name) return !0
}, Carries.prototype.hasSpace = function() {
    if (this.entity.script.building.currentBuilding) return !1;
    for (var r = 0; r < this.carryPoints.length; r++)
        if (this.carryPoints[r].enabled && 0 === this.carryPoints[r].children.length) return !0
}, Carries.prototype.hasCarryByName = function(r) {
    for (var t = 0; t < this.carryPoints.length; t++)
        if (this.carryPoints[t].enabled && this.carryPoints[t].children.length > 0 && this.carryPoints[t].children[0].name === r) return !0
}, Carries.prototype.hasCarryByNameAny = function(r) {
    for (var t = 0; t < this.carryPoints.length; t++)
        if (this.carryPoints[t].enabled && this.carryPoints[t].children.length > 0)
            for (var i in r) {
                var n = r[i];
                if (this.carryPoints[t].children[0].name === n.name) return n
            }
}, Carries.prototype.updateCarries = function() {
    for (var r = this.carryPoints.length; r--;)
        if (this.carryPoints[r].children.length > 0 && this.carryPoints[r].enabled) {
            var t = this.carryPoints[r + 1];
            t && t.enabled && 0 === t.children.length && this.carryPoints[r].children[0].reparent(t)
        }
};
var TrashBin = pc.createScript("trashBin");
TrashBin.attributes.add("particleEntity", {
    type: "entity"
}), TrashBin.prototype.initialize = function() {
    this.lastDrop = -1, this.entity.on("Trigger", this.onTrigger, this), this.app.fire("Scene:Triggers")
}, TrashBin.prototype.onTrigger = function(i) {
    i && (Date.now() - this.lastDrop > 1e3 && i.script.carries.hasAnyCarry() && (this.app.fire("TrashBin", i.name), this.entity.sound.play("Wash"), this.entity.sound.play("Whoosh"), this.entity.sound.play("Sink"), this.app.fire("Motion", "Sink"), this.particleEntity.enabled = !0, setTimeout((function(i) {
        i.particleEntity.enabled = !1
    }), 3e3, this), this.lastDrop = Date.now()), i.fire("Drop", "Burger"), i.fire("Drop", "Fries"), i.fire("Drop", "DirtyPlate"), i.fire("Drop", "Coke"), i.fire("Drop", "IceCream"), i.fire("Trigger:Reset"))
};
var Chef = pc.createScript("chef");
Chef.attributes.add("modelEntity", {
    type: "entity"
}), Chef.attributes.add("characterEntity", {
    type: "entity"
}), Chef.attributes.add("cookEvent", {
    type: "string"
}), Chef.attributes.add("cookTime", {
    type: "number",
    default: 5
}), Chef.attributes.add("targets", {
    type: "entity",
    array: !0
}), Chef.attributes.add("speed", {
    type: "number",
    default: 1
}), Chef.attributes.add("turnSpeed", {
    type: "number",
    default: .1
}), Chef.prototype.initialize = function() {
    this.targetIndex = 1, this.target = this.targets[this.targetIndex], this.lastCookTime = -1, this.direction = 0, this.nextDirection = 0
}, Chef.prototype.update = function(t) {
    this.moveTarget(t)
}, Chef.prototype.cook = function() {
    this.app.fire(this.cookEvent)
}, Chef.prototype.moveTarget = function(t) {
    if (!this.target) return !1;
    var e = this.entity.getPosition().sub(this.target.getPosition()).length(),
        i = this.entity.getPosition(),
        n = this.target.getPosition();
    this.nextDirection = Utils.lookAt(i.x, i.z, n.x, n.z), this.direction = Utils.rotate(this.direction, this.nextDirection, this.turnSpeed * t), e > .1 ? (this.entity.translateLocal(Math.sin(this.direction) * this.speed * t, 0, Math.cos(this.direction) * this.speed * t), this.characterEntity.anim.setBoolean("Walking", !0)) : this.characterEntity.anim.setBoolean("Walking", !1), this.modelEntity.setLocalEulerAngles(0, this.direction * pc.math.RAD_TO_DEG, 0), e <= .1 && this.target && (this.target = !1, setTimeout((function(t) {
        t.cook()
    }), 500, this), setTimeout((function(t) {
        t.targetIndex++, t.targetIndex > t.targets.length - 1 && (t.targetIndex = 0), t.target = t.targets[t.targetIndex]
    }), 1e3, this))
};
var Mount = pc.createScript("mount");
Mount.attributes.add("event", {
    type: "string"
}), Mount.prototype.initialize = function() {
    this.app.fire(this.event)
};
var Door = pc.createScript("door");
Door.attributes.add("originEntity", {
    type: "entity"
}), Door.attributes.add("collisionEntity", {
    type: "entity"
}), Door.prototype.initialize = function() {
    this.lastPlayTime = -1, this.collisionEntity.on("Collision", this.onCollision, this)
}, Door.prototype.onCollision = function() {
    Date.now() - this.lastPlayTime > 1e3 && (this.entity.sound.play("Slam"), this.lastPlayTime = Date.now())
}, Door.prototype.update = function(t) {
    this.originEntity.lookAt(this.collisionEntity.getPosition())
};
var StreetNpc = pc.createScript("streetNpc");
StreetNpc.attributes.add("speed", {
    type: "number",
    default: 1
}), StreetNpc.attributes.add("characterEntity", {
    type: "entity"
}), StreetNpc.attributes.add("carEntity", {
    type: "entity"
}), StreetNpc.prototype.initialize = function() {
    this.createdAt = Date.now(), this.entity.translateLocal(pc.math.random(-1, 1), 0, pc.math.random(-1, 1)), this.characterEntity ? this.characterEntity.render.asset = this.app.assets.find("Model-" + Math.round(pc.math.random(1, 5))) : this.carEntity.render.asset = this.app.assets.find("Car-" + Math.round(pc.math.random(1, 5)))
}, StreetNpc.prototype.update = function(t) {
    Date.now() - this.createdAt > 25e3 && this.entity.destroy(), this.entity.translateLocal(0, 0, this.speed * t)
};
var Street = pc.createScript("street");
Street.attributes.add("stuff", {
    type: "entity",
    array: !0
}), Street.attributes.add("time", {
    type: "number",
    default: 1
}), Street.prototype.initialize = function() {
    this.lastSpawnTime = Date.now()
}, Street.prototype.update = function(t) {
    Date.now() - this.lastSpawnTime > 1e3 * this.time && this.spawn()
}, Street.prototype.spawn = function() {
    var t = this.stuff[Math.floor(Math.random() * this.stuff.length)].clone();
    t.enabled = !0, this.entity.addChild(t), this.lastSpawnTime = Date.now()
};
var Condition = pc.createScript("condition");
Condition.attributes.add("eventName", {
    type: "string"
}), Condition.attributes.add("eventValue", {
    type: "string"
}), Condition.attributes.add("complete", {
    type: "string"
}), Condition.attributes.add("time", {
    type: "number",
    default: 0
}), Condition.attributes.add("station", {
    type: "entity"
}), Condition.attributes.add("upgradeStation", {
    type: "entity"
}), Condition.attributes.add("onEnableEvent", {
    type: "string"
}), Condition.attributes.add("onEnableArg", {
    type: "string"
}), Condition.attributes.add("showMidroll", {
    type: "boolean"
}), Condition.prototype.preInitialize = function() {
    this.isCompleted = !1, this.app.on(this.eventName, this.onFunction, this)
}, Condition.prototype.initialize = function() {
    this.upgradeStation && this.upgradeStation.enabled && (console.log("Already completed: ", this.entity.name), this.onFunctionValid()), this.station && (this.station.enabled = !0), this.onEnableEvent && this.app.fire(this.onEnableEvent, this.onEnableArg), this.entity.on("Complete", this.onComplete, this), this.alreadyCompleted && this.onFunctionValid()
}, Condition.prototype.onComplete = function() {
    this.isCompleted = !0
}, Condition.prototype.onFunction = function(t) {
    return this.entity.enabled ? !this.isCompleted && ((!t || t == this.eventValue) && void this.onFunctionValid()) : (t && t == this.eventValue && (this.alreadyCompleted = !0), !1)
}, Condition.prototype.onFunctionValid = function() {
    this.time > 0 ? setTimeout((function(t) {
        pc.app.fire(t.complete, t.entity.tutorialIndex)
    }), 1e3 * this.time, this) : this.app.fire(this.complete, this.entity.tutorialIndex), this.isCompleted = !0
};
var TutorialManager = pc.createScript("tutorialManager");
TutorialManager.attributes.add("arrowEntity", {
    type: "entity"
}), TutorialManager.attributes.add("doorEntity1", {
    type: "entity"
}), TutorialManager.attributes.add("doorEntity2", {
    type: "entity"
}), TutorialManager.attributes.add("firstLockEntity", {
    type: "entity"
}), TutorialManager.attributes.add("lockedEntities", {
    type: "entity",
    array: !0
}), TutorialManager.attributes.add("playerEntity", {
    type: "entity"
}), TutorialManager.attributes.add("lineEntity", {
    type: "entity"
}), TutorialManager.prototype.initialize = function() {
    this.createdAt = Date.now(), this.lastTriggeredStation = new pc.Vec3(0, 0, 0), this.lineEntity.enabled = !1, this.currentStep = -1, this.tutorialPoints = this.app.root.findByTag("TutorialIndex");
    for (var t = 0; t < this.tutorialPoints.length; t++) this.tutorialPoints[t] && (this.tutorialPoints[t].script.condition.preInitialize(), this.tutorialPoints[t].tutorialIndex = t, this.tutorialPoints[t].enabled = !1);
    var i = Utils.getItem("TutorialIndex");
    i && (this.currentStep = parseInt(i)), this.app.on("Tutorial:SetIndex", this.setIndex, this), this.app.on("Tutorial:Next", this.nextStep, this), this.app.on("Tutorial:Complete", this.onComplete, this), this.app.on("Tutorial:Arrow", this.setArrow, this), console.log("Step state:", this.currentStep), -1 === this.currentStep ? (this.arrowEntity.enabled = !1, setTimeout((function(t) {
        t.nextStep()
    }), 1e3, this)) : setTimeout((function(t) {
        t.onLoad()
    }), 100, this)
}, TutorialManager.prototype.unlockDoors = function() {
    console.log("Attempt to unlock door"), this.doorEntity1.fire("Activate"), this.doorEntity2.fire("Activate"), this.arrowEntity.enabled = !1, this.firstLockEntity.destroy(), this.app.fire("Tutorial:FirstPhaseCompleted")
}, TutorialManager.prototype.unlockPopups = function() {
    for (var t = 0; t < this.lockedEntities.length; t++) this.lockedEntities[t].enabled = !1
}, TutorialManager.prototype.onLoad = function() {
    console.log("Onload completed", this.currentStep);
    for (var t = 0; t < this.currentStep; t++) this.tutorialPoints[t] && (this.tutorialPoints[t].enabled = !0, this.tutorialPoints[t].fire("Complete"));
    this.currentStep > 0 && this.unlockDoors(), this.currentStep > 1 && this.unlockPopups(), this.setStep()
}, TutorialManager.prototype.setIndex = function(t) {
    var i = parseInt(t);
    i >= this.currentStep && (this.currentStep = i, this.nextStep())
}, TutorialManager.prototype.saveCheckpoint = function() {
    var t = this.tutorialPoints[this.currentStep];
    if (window.location.href.search("playcanvas") > -1) return !1;
    if (t) {
        var i = t.name;
        this.logCheckpoint(i)
    }
}, TutorialManager.prototype.nextStep = function() {
    if (Date.now() - this.createdAt < 1e3) return !1;
    this.tutorialPoints[this.currentStep] && (this.tutorialPoints[this.currentStep].enabled = !1), this.saveCheckpoint(), this.currentStep++, this.currentStep > 0 && this.unlockDoors(), this.currentStep > 1 && this.unlockPopups(), this.setStep()
}, TutorialManager.prototype.setStep = function() {
    if (this.currentStep - 1 == this.tutorialPoints.length) return this.arrowEntity.enabled = !1, !1;
    if (!this.tutorialPoints[this.currentStep]) return this.arrowEntity.enabled = !1, !1;
    var t = this.tutorialPoints[this.currentStep].script.condition;
    if (t && t.upgradeStation) {
        var i = Utils.getItem("Station_" + t.upgradeStation._guid);
        if (console.log("Already completed Station_" + t.upgradeStation._guid), i) return setTimeout((function(t) {
            t.nextStep()
        }), 1e3, this), !1
    }
    clearTimeout(this.arrowTimer);
    var e = this.tutorialPoints[this.currentStep].getPosition().clone();
    this.tutorialPoints[this.currentStep].enabled = !0, -1 === this.tutorialPoints[this.currentStep].tags.list().indexOf("NoArrow") ? (this.arrowEntity.enabled = !0, this.arrowEntity.setPosition(e)) : this.arrowEntity.enabled = !1, Utils.setItem("TutorialIndex", this.currentStep)
}, TutorialManager.prototype.onComplete = function() {
    this.arrowEntity.enabled = !1, Utils.setItem("Tutorial", "Completed")
}, TutorialManager.prototype.setArrow = function(t) {
    this.arrowEntity.enabled = !0, this.arrowEntity.setPosition(t.getPosition()), clearTimeout(this.arrowTimer), this.arrowTimer = setTimeout((function(t) {
        t.arrowEntity.enabled = !1
    }), 3e3, this)
}, TutorialManager.prototype.logCheckpoint = function(t) {
    Utils.service("?request=save_data", {
        game_name: Utils.gameName,
        checkpoint: t
    }, (function(t) {}))
}, TutorialManager.prototype.update = function(t) {
    this.arrowEntity.enabled && ((i = this.playerEntity.getPosition().sub(this.arrowEntity.getPosition()).length()) < .5 && (this.arrowEntity.enabled = !1));
    if (this.tutorialPoints.length == this.currentStep) return this.lineEntity.enabled = !1, !1;
    var i, e = this.playerEntity.getPosition(),
        o = this.arrowEntity.getPosition(),
        r = Utils.lookAt(e.x, e.z, o.x, o.z);
    (i = o.clone().sub(e.clone()).length()) < 2 ? (this.lastTriggeredStation = o.clone(), this.lineEntity.enabled = !1) : this.lastTriggeredStation.clone().sub(o).length() < .1 || (this.lineEntity.enabled = !0, this.lineEntity.setLocalEulerAngles(0, r * pc.math.RAD_TO_DEG, 0), this.lineEntity.setLocalScale(1, 1, i / 10))
};
var Throw = pc.createScript("throw");
Throw.attributes.add("throwables", {
    type: "entity",
    array: !0
}), Throw.prototype.initialize = function() {
    this.app.on("Throw", this.onThrow, this), this.app.on("ThrowDisable", this.onThrowDisable, this), this.app.on("PlayFastWhoosh", this.playFastWhoosh, this), this.throwables.forEach((function(t) {
        t.enabled = !1
    }))
}, Throw.prototype.playFastWhoosh = function() {
    this.entity.sound.play("FastThrow")
}, Throw.prototype.onThrowDisable = function(t, o) {
    this.throwables.forEach((function(t) {
        t.enabled = !1
    }))
}, Throw.prototype.onThrow = function(t, o) {
    for (var h = 0; h < this.throwables.length; h++) this.throwables[h].name === t && (this.throwables[h].enabled = !0, this.app.fire("Motion", "Throw"), this.entity.sound.play("Whoosh"), clearTimeout(this.throwTimer), this.throwTimer = setTimeout((function(t) {
        pc.app.fire("Motion", "LittleShake"), t.enabled = !1
    }), o, this.throwables[h]))
};
var MusicManager = pc.createScript("musicManager");
MusicManager.prototype.initialize = function() {
    this.durations = [73, 84], this.musicIndex = 0, this.currentDuration = 1e3 * this.durations[0], this.currentStart = Date.now(), this.playNextSong(), this.defaultVolume = parseFloat(this.entity.sound.volume + ""), this.app.on("MusicManager:Pitch", this.setPitch, this), this.app.on("MusicManager:Mute", this.mute, this)
}, MusicManager.prototype.setPitch = function(t) {
    this.entity.sound.pitch = t
}, MusicManager.prototype.playNextSong = function() {
    this.musicIndex++, this.entity.sound.play("Music-" + this.musicIndex), this.musicIndex >= 2 && (this.musicIndex = 1);
    var t = this.durations[this.musicIndex - 1];
    this.currentDuration = t, this.currentStart = Date.now()
}, MusicManager.prototype.mute = function() {
    0 === this.entity.sound.volume ? this.entity.sound.volume = this.defaultVolume : this.entity.sound.volume = 0
}, MusicManager.prototype.update = function(t) {
    Date.now() - this.currentStart > 1e3 * this.currentDuration && this.playNextSong()
};
var CashMachine = pc.createScript("cashMachine");
CashMachine.attributes.add("waitPoints", {
    type: "entity",
    array: !0
}), CashMachine.attributes.add("moneyEntity", {
    type: "entity"
}), CashMachine.prototype.initialize = function() {
    this.waitingCustomers = [], this.currentCustomer = !1, this.customerIndex = 0, this.currentStack = 0, this.currentMoneyIndex = .01, this.entity.on("Trigger", this.onTrigger, this), this.entity.on("Leave", this.onLeave, this), this.app.fire("Scene:Triggers")
}, CashMachine.prototype.setCustomer = function(t) {
    this.customerIndex++, t.tags.add(this.customerIndex.toString()), this.waitingCustomers.push(t)
}, CashMachine.prototype.getTarget = function(t) {
    return t ? this.waitPoints[t] : this.waitPoints[this.customerIndex]
}, CashMachine.prototype.cancelPayment = function(t) {
    var e = this.waitingCustomers.length;
    if (e > 0)
        for (; e--;)
            if (this.waitingCustomers[e] === t) {
                this.waitingCustomers.splice(e, 1);
                break
            }
    this.currentCustomer === t && (this.currentCustomer = !1), this.customerIndex > 0 && (this.customerIndex--, this.app.fire("CashOrderChanged"))
}, CashMachine.prototype.onTrigger = function() {
    return this.currentCustomer && this.currentCustomer.script && this.currentCustomer.script.customer ? (this.currentCustomer.script.customer.isReadyToPay && (this.currentCustomer.script.customer.hasMoney() ? (this.currentStack += this.currentCustomer.script.customer.getMoney(), this.currentMoneyIndex += .1, this.app.fire("Sound:Play", "MoneyCount"), this.app.fire("StateTime:Money", "Add"), this.lastMoneyCountTime = Date.now()) : this.currentStack >= 0 ? Date.now() - this.lastMoneyCountTime > 500 && (this.currentStack -= 2, this.currentMoneyIndex -= .1, this.app.fire("Money:Add", 2), this.app.fire("StateTime:Money", "Remove")) : (this.customerIndex > 0 && (this.customerIndex--, this.app.fire("CashOrderChanged")), this.currentMoneyIndex = .02, this.app.fire("StateTime:Money", "Default"), this.app.fire("Sound:Play", "CashComplete"), this.currentCustomer.script.customer.leaveHappy(), this.currentCustomer = !1)), this.moneyEntity.setLocalScale(1, .1 * this.currentMoneyIndex, 1), !1) : 0 !== this.waitingCustomers.length && void(this.currentCustomer = this.waitingCustomers.shift())
}, CashMachine.prototype.onLeave = function() {
    this.app.fire("StateTime:Money", "Default")
};
var StateTime = pc.createScript("stateTime");
StateTime.attributes.add("timeline", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "Default"
    }, {
        name: "time",
        type: "number",
        default: 0
    }, {
        name: "enable",
        type: "entity",
        array: !0
    }, {
        name: "disable",
        type: "entity",
        array: !0
    }],
    array: !0
}), StateTime.prototype.initialize = function() {
    this.timeouts = [], this.currentState = "None", this.app.on("StateTime:" + this.entity.name, this.onPlay, this), this.onPlay("Default")
}, StateTime.prototype.onPlay = function(t) {
    if (this.currentState == t) return !1;
    for (var e in this.timeouts) clearTimeout(this.timeouts[e]);
    for (var i in this.timeouts = [], this.timeline) {
        var a = this.timeline[i];
        if (a.name == t) {
            var n = setTimeout((function(t) {
                for (var e in t.enable) {
                    t.enable[e].enabled = !0
                }
                for (var i in t.disable) {
                    t.disable[i].enabled = !1
                }
            }), 1e3 * a.time, a);
            this.timeouts.push(n)
        }
    }
    this.currentState = t
};
var Test = pc.createScript("test");
Test.prototype.initialize = function() {
    this.progress = 1
}, Test.prototype.update = function(t) {
    this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.app.fire("DirtyPlate:Created")
};
var MaterialShader = pc.createScript("materialShader");
MaterialShader.attributes.add("inEditor", {
    type: "boolean",
    default: !0,
    title: "In Editor"
}), MaterialShader.attributes.add("isDebug", {
    type: "boolean",
    default: !1
}), MaterialShader.attributes.add("isStatic", {
    type: "boolean",
    default: !1
}), MaterialShader.attributes.add("isBatched", {
    type: "boolean",
    default: !1
}), MaterialShader.attributes.add("color", {
    type: "boolean",
    default: !0
}), MaterialShader.attributes.add("transform", {
    type: "boolean",
    default: !0
}), MaterialShader.attributes.add("light", {
    type: "boolean",
    default: !0
}), MaterialShader.attributes.add("material", {
    type: "asset",
    assetType: "material"
}), MaterialShader.attributes.add("textures", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "texture_0"
    }, {
        name: "texture",
        type: "asset",
        assetType: "texture"
    }],
    array: !0
}), MaterialShader.attributes.add("colors", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "color_0"
    }, {
        name: "color",
        type: "rgba"
    }],
    array: !0
}), MaterialShader.attributes.add("vectors", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "vector_0"
    }, {
        name: "vector",
        type: "vec2"
    }],
    array: !0
}), MaterialShader.attributes.add("numbers", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "number_0"
    }, {
        name: "number",
        type: "number",
        default: 0
    }],
    array: !0
}), MaterialShader.attributes.add("curves", {
    type: "json",
    schema: [{
        name: "name",
        type: "string",
        default: "curve_0"
    }, {
        name: "curve",
        type: "curve",
        curves: ["x", "y", "z"]
    }, {
        name: "speed",
        type: "number",
        default: 1
    }],
    array: !0
}), MaterialShader.attributes.add("billboard", {
    type: "boolean",
    default: !1
}), MaterialShader.attributes.add("vertexSet", {
    type: "boolean",
    default: !1
}), MaterialShader.attributes.add("alphaRef", {
    type: "number",
    default: .15
}), MaterialShader.attributes.add("shader", {
    type: "string",
    default: "dmVjNCBnZXRDb2xvcih2ZWMyIFVWKXsKLy92ZWMzIHRleHR1cmVfY29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZV8wLCBVVikucmdiOwpjb2xvci5yZ2IgPSB2ZWMzKDAuMCwgMS4wLCAwLjApOwpjb2xvci5hID0gMS4wOwoKcmV0dXJuIGNvbG9yOwp9Cgp2ZWMzIGdldFZlcnRleCh2ZWMzIGxvY2FsUG9zaXRpb24sIHZlYzMgd29ybGRQb3NpdGlvbiwgdmVjMiBVVil7CnZlcnRleC54eXogPSB2ZWMzKDAuMCwgMC4wLCAwLjApOwoKcmV0dXJuIHZlcnRleDsKfQ=="
}), MaterialShader.prototype.initialize = function() {
    this.once = !1, this.reset(), this.isDebug ? this.addCodeEditor() : (this.emissive = atob(this.shader), this.updateMaterial()), this.on("attr:textures", this.onAttributeChange, this), this.on("attr:colors", this.onAttributeChange, this), this.on("attr:vectors", this.onAttributeChange, this), this.on("attr:numbers", this.onAttributeChange, this), this.on("attr:curves", this.onAttributeChange, this), this.on("attr:shader", this.onAttributeChange, this), this.entity.on("MaterialShader:Set", this.setVariable, this), this.app.on("MaterialShader:" + this.entity.name, this.setVariable, this), this.on("state", this.onStateChange, this), this.entity.on("Model:Loaded", this.onModelLoaded, this), this.app.on("MaterialShader:Reset", this.onStateChange, this), this.material && (this.totalAssets = 2 + this.textures.length, this.loaded = 0, this.loadAllAssets())
}, MaterialShader.prototype.loadAllAssets = function() {
    var e = this,
        t = this.entity.model.asset,
        a = this.app.assets.get(t);
    for (var i in a ? (a.ready((function() {
            e.loaded++, e.isLoaded()
        })), this.app.assets.load(a)) : (this.loaded++, this.isLoaded()), this.material.ready((function() {
            e.loaded++, e.isLoaded()
        })), this.app.assets.load(this.material), this.textures) {
        var r = this.textures[i];
        r.texture.ready((function() {
            e.loaded++, e.isLoaded()
        })), this.app.assets.load(r.texture)
    }
}, MaterialShader.prototype.isLoaded = function() {
    this.loaded >= this.totalAssets && (this.isBatched ? setTimeout((function(e) {
        e.getMaterialByBatch(), e.updateMaterial()
    }), 100, this) : (this.currentMaterial = this.material.resource, this.currentMaterial.chunks.APIVersion = pc.CHUNKAPI_1_55, this.updateMaterial()))
}, MaterialShader.prototype.setVariable = function(e, t) {
    for (var a in this.parameters) {
        var i = this.parameters[a];
        this.currentMaterial.setParameter(i.name, i.resource), i.name == e && (this.parameters[a].resource = t)
    }
}, MaterialShader.prototype.updateDynamicVariables = function() {
    for (var e in this.curves) {
        var t = this.curves[e];
        for (var a in this.parameters) {
            var i = this.parameters[a];
            if (i.name == t.name) {
                var r = t.curve.value(this.timestamp * t.speed % 1);
                i.resource = [r[0], r[1], r[2]]
            }
        }
    }
}, MaterialShader.prototype.onModelLoaded = function(e) {
    !0 === e && setTimeout((function(e) {
        e.onAttributeChange()
    }), 3e3, this)
}, MaterialShader.prototype.onStateChange = function(e) {
    this.reset()
}, MaterialShader.prototype.copy = function(e) {
    var t = btoa(e);
    navigator.clipboard.writeText(t).then((function() {
        console.log("Async: Copying to clipboard was successful!")
    }), (function(e) {
        console.error("Async: Could not copy text: ", e)
    }))
}, MaterialShader.prototype.addCodeEditor = function() {
    var e = this,
        t = document.createElement("button");
    t.style.position = "fixed", t.style.left = "10px", t.style.top = "340px", t.style.width = "100px", t.style.height = "40px", t.style.zIndex = "5000", t.style.background = "rgba(0, 0, 0, 0.5)", t.style.color = "#fff", t.textContent = "Copy", t.onclick = function() {
        e.copy(e.emissiveCode.value)
    }, document.body.appendChild(t);
    var a = document.createElement("textarea");
    a.style.position = "fixed", a.style.left = "10px", a.style.top = "10px", a.style.width = "400px", a.style.height = "300px", a.style.padding = "10px", a.style.zIndex = "5000", a.style.background = "rgba(0, 0, 0, 0.5)", a.style.outline = "none", a.style.color = "white", a.onkeyup = this.onShaderChange.bind(this);
    var i = document.createElement("style");
    i.innerText = "#application-console{max-height: 80px;}", document.body.appendChild(i), this.emissiveCode = a, this.emissiveCode.value = atob(this.shader), this.emissive = this.emissiveCode.value, this.updateMaterial(), document.body.appendChild(a)
}, MaterialShader.prototype.onShaderChange = function() {
    clearTimeout(this.timer), this.timer = setTimeout((function(e) {
        e.emissive = e.emissiveCode.value, e.updateMaterial()
    }), 100, this)
}, MaterialShader.prototype.reset = function() {
    this.timestamp = 0, this.parameters = []
}, MaterialShader.prototype.line = function(e) {
    return e + "\n"
}, MaterialShader.prototype.number = function(e) {
    return parseFloat(e).toFixed(2)
}, MaterialShader.prototype.colorRGB = function(e) {
    return "vec3(" + this.number(e.data[0]) + ", " + this.number(e.data[1]) + ", " + this.number(e.data[2]) + ")"
}, MaterialShader.prototype.colorRGBA = function(e) {
    return "vec4(" + this.number(e.data[0]) + ", " + this.number(e.data[1]) + ", " + this.number(e.data[2]) + ", " + this.number(e.data[3]) + ")"
}, MaterialShader.prototype.addParameter = function(e, t) {
    var a = "";
    for (var i in this[e]) {
        var r = this[e][i],
            s = !1;
        if (a += this.line("uniform " + t + " " + r.name + ";"), "textures" == e && (s = r.texture.resource), "colors" == e && (s = r.color.data), "vectors" == e && (s = r.vector.data), "curves" == e) {
            var n = r.curve.value(this.timestamp * r.speed);
            s = [n[0], n[1], n[2]]
        }
        "numbers" == e && (s = r.number), this.parameters.push({
            name: r.name,
            resource: s
        })
    }
    return a
}, MaterialShader.prototype.generateShaderOutput = function() {
    var e = "";
    return e += this.addParameter("textures", "sampler2D"), e += this.addParameter("colors", "vec4"), e += this.addParameter("vectors", "vec2"), e += this.addParameter("numbers", "float"), e += this.addParameter("curves", "vec3"), e += this.line("uniform float timestamp;"), e += this.line("uniform float alpha_ref;"), e += this.line("uniform float alphaRef;"), e += this.line("vec4 color  = vec4(0.0);"), e += this.line("vec3 vertex = vec3(0.0);"), e += this.line(this.emissive), e += this.line("void getEmission() {"), e += this.line("}"), e += this.line("void getAlbedo() {"), e += this.line("}"), e += this.line("void getOpacity() {"), e += this.line("}"), e += this.line("void alphaTest(float a) {"), e += this.line("if (a < alpha_ref) discard;"), e += this.line("}")
}, MaterialShader.prototype.onAttributeChange = function() {
    this.reset(), this.updateMaterial()
}, MaterialShader.prototype.generateTransformOutput = function() {
    var e = "";
    return e += this.addParameter("textures", "sampler2D"), e += this.addParameter("colors", "vec4"), e += this.addParameter("vectors", "vec2"), e += this.addParameter("numbers", "float"), e += this.addParameter("curves", "vec3"), this.isBatched && (e += this.line("#define DYNAMICBATCH")), e += this.line("uniform float timestamp;"), e += this.line("uniform mat4 matrix_viewInverse;"), e += this.line("mat4 getModelMatrix() {"), e += this.line("#ifdef DYNAMICBATCH"), e += this.line("return getBoneMatrix(vertex_boneIndices);"), e += this.line("#elif defined(INSTANCING)"), e += this.line("return mat4(instance_line1, instance_line2, instance_line3, instance_line4);"), e += this.line("#else"), e += this.line("return matrix_model;"), e += this.line("#endif"), e += this.line("}"), e += this.line("vec4 color  = vec4(0.0);"), e += this.line("vec3 vertex = vec3(0.0);"), e += this.line(this.emissive), e += this.line("vec4 getPosition() {"), e += this.line("dModelMatrix = getModelMatrix();"), e += this.line("vec3 localPos = vertex_position;"), e += this.line("vec4 posW   = dModelMatrix * vec4(localPos, 1.0);"), e += this.line("vec2 UV     = localPos.xy * 0.5 + vec2(0.5, 0.5);"), this.billboard && (e += this.line("vec3 CameraUp_worldspace = matrix_viewInverse[1].xyz;"), e += this.line("vec3 CameraRight_worldspace = matrix_viewInverse[0].xyz;"), e += this.line("vec3 particleCenter_wordspace = ( dModelMatrix * vec4(0.0, 0.0, 0.0, 1.0) ).xyz;"), e += this.line("posW.xyz = particleCenter_wordspace.xyz + CameraRight_worldspace * localPos.x + CameraUp_worldspace * localPos.y;")), this.vertexSet ? e += this.line("posW.xyz = getFullVertex(localPos, posW.xyz, UV, dModelMatrix, matrix_viewInverse);") : e += this.line("posW.xyz+= getVertex(localPos, posW.xyz, UV);"), e += this.line("dPositionW = posW.xyz;"), e += this.line("vec4 outputPosition = matrix_viewProjection * posW;"), e += this.line("return outputPosition;"), e += this.line("}"), e += this.line("vec3 getWorldPosition() {"), e += this.line("return dPositionW;"), e += this.line("}")
}, MaterialShader.prototype.getMaterialByBatch = function() {
    var e = this.entity.model.batchGroupId,
        t = this.app.batcher.getBatches(e);
    for (var a in t) {
        var i = t[a].meshInstance.material;
        this.currentMaterial = i
    }
}, MaterialShader.prototype.updateMaterial = function() {
    if (this.timestamp = 0, !this.currentMaterial) return !1;
    this.transform && (this.currentMaterial.chunks.transformVS = this.generateTransformOutput()), this.color && (this.currentMaterial.chunks.diffusePS = this.generateShaderOutput(), this.currentMaterial.chunks.opacityPS = " ", this.currentMaterial.chunks.emissivePS = " ", this.currentMaterial.chunks.alphaTestPS = " ", this.currentMaterial.chunks.endPS = "vec4 outputColor = getColor(vUv0);", this.currentMaterial.chunks.endPS += "dAlpha = outputColor.a;", this.currentMaterial.chunks.endPS += "if (dAlpha < alphaRef){ discard; }", this.currentMaterial.chunks.endPS += "gl_FragColor.rgb = outputColor.rgb;", this.light && (this.currentMaterial.chunks.endPS += "gl_FragColor.rgb = mix(gl_FragColor.rgb * dDiffuseLight, dSpecularLight + dReflection.rgb * dReflection.a, dSpecularity);", this.currentMaterial.chunks.endPS += "gl_FragColor.rgb = addFog(gl_FragColor.rgb);", this.currentMaterial.chunks.endPS += "gl_FragColor.rgb = toneMap(gl_FragColor.rgb);", this.currentMaterial.chunks.endPS += "gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);")), this.currentMaterial.update()
}, MaterialShader.prototype.update = function(e) {
    if (this.currentMaterial) {
        if (this.updateDynamicVariables(), !this.isStatic || !this.once) {
            for (var t in this.parameters) {
                var a = this.parameters[t];
                this.currentMaterial.setParameter(a.name, a.resource)
            }
            this.once = !0
        }
        this.currentMaterial.setParameter("timestamp", this.timestamp), this.currentMaterial.setParameter("alphaRef", this.alphaRef), this.currentMaterial.update()
    }
    this.timestamp += e
};
var Time = pc.createScript("time");
Time.prototype.initialize = function() {
    this.time = 0
}, Time.prototype.update = function(t) {
    this.time += t, this.entity.element.text = Utils.mmss(this.time)
};
var Experience = pc.createScript("experience");
Experience.attributes.add("barEntity", {
    type: "entity"
}), Experience.attributes.add("iconEntity", {
    type: "entity"
}), Experience.attributes.add("insideIconEntity", {
    type: "entity"
}), Experience.attributes.add("levelTitleEntity", {
    type: "entity"
}), Experience.attributes.add("happyGroupEntity", {
    type: "entity"
}), Experience.attributes.add("happyBar", {
    type: "entity"
}), Experience.attributes.add("happyTextEntity", {
    type: "entity"
}), Experience.attributes.add("boostEffect", {
    type: "entity"
}), Experience.attributes.add("levels", {
    type: "json",
    schema: [{
        name: "title",
        type: "string",
        default: "Unknown"
    }, {
        name: "nextCustomerCount",
        type: "number",
        default: 1
    }, {
        name: "items",
        type: "entity",
        array: !0
    }, {
        name: "icon",
        type: "asset"
    }],
    array: !0
}), Experience.prototype.initialize = function() {
    this.happyCount = Utils.getItemAsNumber("HappyCount"), this.sadCount = Utils.getItemAsNumber("SadCount"), this.lastBoostEffectTime = Date.now(), this.boostEffect.enabled = !1, this.currentIndex = Utils.getItemAsNumber("Level"), this.currentRatio = 0, setTimeout((function(t) {
        t.setLevel(!0)
    }), 100, this), this.app.on("Customer:Vote", this.setCustomerVote, this)
}, Experience.prototype.setCustomerVote = function(t) {
    "Happy" == t && this.happyCount++, "Sad" == t && this.sadCount++, this.happyCount >= this.nextHappyCount && this.completeLevel(), this.happyTextEntity.element.text = this.happyCount + " / " + this.nextHappyCount, Utils.setItem("HappyCount", this.happyCount), Utils.setItem("SadCount", this.sadCount), this.app.fire("Timeline:Happy")
}, Experience.prototype.completeLevel = function() {
    var t = this.levels[this.currentIndex];
    if (!t) return !1;
    for (var e = 0; e < t.items.length; e++) t.items[e].enabled = !0;
    this.app.fire("Camera:Focus", t.items[0], 3e3), this.app.fire("Tutorial:Arrow", t.items[0]), setTimeout((function(t) {
        t.currentIndex++, t.setLevel()
    }), 1e3, this)
}, Experience.prototype.setLevel = function(t) {
    var e = this.levels[this.currentIndex];
    if (!e) return !1;
    if (t || (this.happyCount = 0), this.nextHappyCount = e.nextCustomerCount, this.iconEntity.element.textureAsset = e.icon, this.insideIconEntity.element.textureAsset = e.icon, this.levelTitleEntity.element.text = e.title, this.happyTextEntity.element.text = this.happyCount + " / " + this.nextHappyCount, Utils.setItem("Level", this.currentIndex), t)
        for (var i = 0; i < this.levels.length; i++)
            if (i < this.currentIndex)
                for (var n = 0; n < this.levels[i].items.length; n++) this.levels[i].items[n].enabled = !0
}, Experience.prototype.update = function(t) {
    var e = 1 * this.happyCount / this.nextHappyCount + .01;
    this.currentRatio > e && (this.currentRatio = e), e > 0 && (this.currentRatio = pc.math.lerp(this.currentRatio, e, 1 * t)), this.currentRatio = Math.min(this.currentRatio, 1), this.happyBar.setLocalScale(this.currentRatio, 1, 1), this.happyGroupEntity.setLocalScale(1 / this.currentRatio, 1, 1), Date.now() - this.lastBoostEffectTime > 18e4 && (this.boostEffect.enabled = !0, this.lastBoostEffectTime = Date.now()), this.insideIconEntity.fire("SetProgress", this.currentRatio)
};
pc.script.createLoadingScreen((function(e) {
    var t, a;
    t = ["body {", "    background-color: #6663a7;", "}", "", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", '    background: #6663a7 url("https://assets.venge.io/BackgroundImage.jpg") no-repeat center center;', "    background-size: cover;", "}", "", "#application-splash {", "    position: absolute;", "    top: calc(50% - 150px);", "    width: 500px;", "    left: calc(50% - 250px);", "}", "", "#application-splash img {", "    width: 100%;", "}", "", "#progress-bar-container {", "    margin: 20px auto 0 auto;", "    height: 20px;", "    border: solid 4px #000;", "    border-radius: 4px;", "    width: 100%;", "    background-color: #1d292c;", "}", "", "#progress-bar {", "    width: 0%;", "    height: 100%;", "    background-color: #fff;", "}", "", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n"), (a = document.createElement("style")).type = "text/css", a.styleSheet ? a.styleSheet.cssText = t : a.appendChild(document.createTextNode(t)), document.head.appendChild(a),
        function() {
            var e = document.createElement("div");
            e.id = "application-splash-wrapper", document.body.appendChild(e);
            var t = document.createElement("div");
            t.id = "application-splash", e.appendChild(t), t.style.display = "none";
            var a = document.createElement("img");
            a.src = "https://assets.venge.io/BurgerRush-Logo.png", t.appendChild(a), a.onload = function() {
                t.style.display = "block"
            };
            var o = document.createElement("div");
            o.id = "progress-bar-container", t.appendChild(o);
            var n = document.createElement("div");
            n.id = "progress-bar", o.appendChild(n)
        }(), e.on("preload:end", (function() {
            e.off("preload:progress")
        })), e.on("preload:progress", (function(e) {
            var t = document.getElementById("progress-bar");
            t && (e = Math.min(1, Math.max(0, e)), t.style.width = 100 * e + "%")
        })), e.on("start", (function() {
            var e = document.getElementById("application-splash-wrapper");
            e.parentElement.removeChild(e)
        }))
}));
var Button = pc.createScript("button");
Button.attributes.add("action", {
    type: "string"
}), Button.attributes.add("value", {
    type: "string"
}), Button.attributes.add("hitAnimation", {
    type: "boolean",
    default: !1
}), Button.prototype.initialize = function() {
    this.originalScale = this.entity.getLocalScale().clone(), this.entity.element.on("mouseup", this.onUp, this), this.entity.element.on("mousedown", this.onPress, this), this.entity.element.on("touchstart", this.onPress, this), this.entity.element.on("touchend", this.onUp, this), this.entity.element.on("mouseenter", this.onHover, this), this.entity.element.on("mouseleave", this.onLeave, this)
}, Button.prototype.onUp = function() {
    this.hitAnimation && this.entity.setLocalScale(this.originalScale)
}, Button.prototype.onHover = function() {
    document.body.style.cursor = "pointer"
}, Button.prototype.onLeave = function() {
    document.body.style.cursor = "default"
}, Button.prototype.onPress = function(t) {
    this.app.fire(this.action, this.value, this.entity, t), this.hitAnimation && this.entity.setLocalScale(this.originalScale.clone().scale(.75)), this.entity.fire("Button:Press", this)
};
var RewardManager = pc.createScript("rewardManager");
RewardManager.attributes.add("rewardEntity", {
    type: "entity"
}), RewardManager.attributes.add("rewardButtonEntity", {
    type: "entity"
}), RewardManager.attributes.add("rewardCount", {
    type: "entity"
}), RewardManager.attributes.add("rewardText", {
    type: "entity"
}), RewardManager.attributes.add("rewardHoverboardButton", {
    type: "entity"
}), RewardManager.attributes.add("rewardHoverboardCount", {
    type: "entity"
}), RewardManager.attributes.add("hoverboardEntity", {
    type: "entity"
}), RewardManager.attributes.add("hoverboardRewardTimerEntity", {
    type: "entity"
}), RewardManager.attributes.add("disableAdblock", {
    type: "entity"
}), RewardManager.attributes.add("rewardPopup", {
    type: "entity"
}), RewardManager.attributes.add("adsIndicator", {
    type: "entity"
}), RewardManager.prototype.initialize = function() {
    this.time = 0, this.adsIndex = 1, this.rewardIndex = 1, this.disabledAdsIndexes = [1], this.gameStartTime = Date.now(), this.isAvailable = !1, this.isAvailableHoverboard = !0, this.hoverboardTimer = !1, this.totalReward = 25, this.lastMidroll = Date.now(), this.lastRewardOpportunity = Date.now(), this.rewardEntity.enabled = !1, this.app.on("RewardManager:Show", this.showRewardButton, this), this.app.on("RewardManager:Get", this.getReward, this), this.app.on("RewardManager:GetWithCallback", this.getRewardWithCallback, this), this.app.on("RewardManager:ShowPopup", this.showRewardPopup, this), this.app.on("RewardManager:ClosePopup", this.closeRewardPopup, this), this.app.on("RewardManager:GetHoverboard", this.getGetHoverboardReward, this)
}, RewardManager.prototype.showRewardPopup = function() {
    this.rewardPopup.enabled = !0
}, RewardManager.prototype.closeRewardPopup = function() {
    this.rewardPopup.enabled = !1
}, RewardManager.prototype.getReward = function(t) {
    var e = this;
    if (this.hideRewardOpportunity(), this.rewardButtonEntity.enabled = !0, this.rewardPopup.enabled = !1, PokiPlugin.adblock) return this.disableAdblock.enabled = !0, this.entity.sound.play("Error"), setTimeout((function(t) {
        t.disableAdblock.enabled = !1
    }), 3e3, this), !1;
    PokiPlugin.showReward((function() {
        t ? pc.app.fire("Money:Add", parseInt(t)) : pc.app.fire("Money:Add", e.totalReward), e.lastMidroll = Date.now()
    })), this.closeRewardPopup(), this.logCheckpoint("reward_" + this.rewardIndex), this.rewardIndex++
}, RewardManager.prototype.getRewardWithCallback = function(t, e) {
    var a = this;
    if (this.hideRewardOpportunity(), this.rewardButtonEntity.enabled = !0, this.rewardPopup.enabled = !1, PokiPlugin.adblock) return this.disableAdblock.enabled = !0, this.entity.sound.play("Error"), setTimeout((function(t) {
        t.disableAdblock.enabled = !1
    }), 3e3, this), !1;
    PokiPlugin.showReward((function() {
        e(), a.lastMidroll = Date.now()
    })), this.closeRewardPopup(), this.logCheckpoint("reward_" + t)
}, RewardManager.prototype.getGetHoverboardReward = function(t) {
    var e = this;
    if (this.hideRewardOpportunity(), this.rewardEntity.enabled = !1, this.rewardHoverboardButton.enabled = !1, this.rewardPopup.enabled = !1, PokiPlugin.adblock) return this.disableAdblock.enabled = !0, this.entity.sound.play("Error"), setTimeout((function(t) {
        t.disableAdblock.enabled = !1
    }), 3e3, this), !1;
    PokiPlugin.showReward((function() {
        e.hoverboardEntity.enabled = !0, e.hoverboardTimer = 90, e.hoverboardRewardTimerEntity.enabled = !0, e.lastMidroll = Date.now()
    }))
}, RewardManager.prototype.showRewardButton = function() {
    return !(Date.now() - this.lastRewardOpportunity < 6e4) && (!this.isAvailable && (this.isAvailable = !0, this.rewardEntity.enabled = !0, this.rewardButtonEntity.enabled = !0, this.time = 11, this.totalReward < 200 && (this.totalReward += 5), this.rewardText.element.text = "+" + this.totalReward + "$", this.entity.sound.play("ShowUp"), void(this.lastRewardOpportunity = Date.now())))
}, RewardManager.prototype.showRewardOpportunity = function() {
    return !(Date.now() - this.lastRewardOpportunity < 18e4) && (!this.isAvailable && (this.isAvailable = !0, this.rewardEntity.enabled = !0, this.time = 11, this.totalReward < 200 && (this.totalReward += 5), this.rewardText.element.text = "+" + this.totalReward + "$", this.entity.sound.play("ShowUp"), void(this.lastRewardOpportunity = Date.now())))
}, RewardManager.prototype.showMidroll = function() {
    if (Date.now() - this.lastMidroll < 12e4) return !1; - 1 === this.disabledAdsIndexes.indexOf(this.adsIndex) ? (Utils.isMobile() || (this.adsIndicator.enabled = !0), setTimeout((function(t) {
        t.adsIndicator.enabled = !1, PokiPlugin.showMidroll()
    }), 5e3, this)) : console.log("Ads index disabled:", this.adsIndex), this.logCheckpoint("midroll_" + this.adsIndex), this.adsIndex++, this.lastMidroll = Date.now() + 45e3
}, RewardManager.prototype.hideRewardOpportunity = function(t) {
    if (!this.isAvailable) return !1;
    this.isAvailable = !1, this.rewardEntity.enabled = !1
}, RewardManager.prototype.update = function(t) {
    this.isAvailable ? (this.time -= t, this.rewardCount.element.text = Utils.mmss(this.time), this.time <= 0 && (this.hideRewardOpportunity(!0), this.rewardButtonEntity.enabled = !1)) : (this.showMidroll(), this.showRewardOpportunity())
}, RewardManager.prototype.logCheckpoint = function(t) {
    Utils.service("?request=save_data", {
        game_name: Utils.gameName,
        checkpoint: t
    }, (function(t) {}))
};
var LookAt = pc.createScript("lookAt");
LookAt.attributes.add("lookEntity", {
    type: "entity"
}), LookAt.prototype.initialize = function() {}, LookAt.prototype.update = function(t) {
    this.lookEntity && this.entity.lookAt(this.lookEntity.getPosition())
};
var Boost = pc.createScript("boost");
Boost.attributes.add("timeEntity", {
    type: "entity"
}), Boost.prototype.initialize = function() {
    this.time = 10, this.lastSecond = 10, this.on("state", this.onStateChange, this), this.entity.on("Trigger", this.onTrigger, this)
}, Boost.prototype.onStateChange = function(t) {
    !0 === t && (this.time = 10, this.lastSecond = 10)
}, Boost.prototype.onTrigger = function() {
    this.app.fire("Player:Boost"), this.entity.enabled = !1
}, Boost.prototype.update = function(t) {
    this.time -= t;
    var i = Math.floor(this.time);
    this.lastSecond != i && this.entity.sound.play("Tick"), this.lastSecond = i, this.timeEntity.element.text = Utils.mmss(this.time), this.time <= 0 && (this.entity.enabled = !1)
};
var FillImage = pc.createScript("fillImage");
FillImage.prototype.initialize = function() {
    this.progress = 0, this.entity.on("SetProgress", this.setProgress, this)
}, FillImage.prototype.setProgress = function(t) {
    this.progress = t
}, FillImage.prototype.update = function(t) {
    this.entity.element.rect.w = this.progress, this.entity.element.height = 100 * this.progress
};
var AttentionIcon = pc.createScript("attentionIcon");
AttentionIcon.attributes.add("iconName", {
    type: "string"
}), AttentionIcon.attributes.add("offset", {
    type: "vec3",
    default: [0, .5, 0]
}), AttentionIcon.prototype.postInitialize = function() {
    this.attentionDisplay = !1, this.app.fire("World2Screen:Clone", this.iconName, this.entity, this.offset, this.setDisplay.bind(this)), this.entity.on("Trigger", this.onTrigger, this), this.on("destroy", this.onTrigger, this)
}, AttentionIcon.prototype.onTrigger = function(t) {
    this.attentionDisplay && this.attentionDisplay.destroy()
}, AttentionIcon.prototype.setDisplay = function(t) {
    this.attentionDisplay = t
};
var Waitress = pc.createScript("waitress");
Waitress.attributes.add("sinkEntity", {
    type: "entity"
}), Waitress.attributes.add("plateEntity", {
    type: "entity"
}), Waitress.attributes.add("characterEntity", {
    type: "entity"
}), Waitress.prototype.initialize = function() {
    this.isCollecting = !1, this.lastCheck = Date.now(), this.originalSpeed = parseFloat("" + this.entity.script.pathMove.speed), this.entity.on("Waypoint:Reach", this.onWayPoint, this), this.entity.on("Station:Upgrade", this.setUpgradeState, this)
}, Waitress.prototype.setUpgradeState = function(t, i) {
    this.entity.script.pathMove.speed = Math.min(this.originalSpeed * i, .075)
}, Waitress.prototype.onDirtyPlate = function(t) {
    if (this.isCollecting) return !1;
    this.entity.fire("Waypoint:Target", t), this.isCollecting = !0
}, Waitress.prototype.onWayPoint = function(t) {
    "DirtyPlate" == t.name && (this.plateEntity.enabled = !0, this.characterEntity.anim.setBoolean("Carry", !0), t.ownerEntity && t.ownerEntity.fire("Carry", !1), setTimeout((function(i) {
        i.entity.fire("Waypoint:Target", i.sinkEntity), t.fire("Take"), t.destroy()
    }), 500, this)), "Sink" == t.name && (this.plateEntity.enabled = !1, this.characterEntity.anim.setBoolean("Carry", !1), this.isCollecting = !1)
}, Waitress.prototype.checkDirtyPlates = function() {
    if (Date.now() - this.lastCheck > 1e3) {
        var t = this.app.root.findByTag("DirtyPlate");
        (t = t.filter((function(t) {
            return t.enabled
        }))).length > 0 && this.onDirtyPlate(t[0]), this.lastCheck = Date.now()
    }
}, Waitress.prototype.update = function(t) {
    this.checkDirtyPlates()
};
var Waypoint = pc.createScript("waypoint");
Waypoint.attributes.add("target", {
    type: "entity"
}), Waypoint.attributes.add("baseTarget", {
    type: "entity"
}), Waypoint.attributes.add("characterEntity", {
    type: "entity"
}), Waypoint.prototype.initialize = function() {
    this.entity.on("Waypoint:Target", this.setNewTarget, this), this.entity.on("Path:State", this.setWalking, this)
}, Waypoint.prototype.setNewTarget = function(t) {
    var i = this;
    if (this.target && this.target.getPosition().clone().sub(t).length() < .1) return !1;
    this.app.fire("PathFinding:Find", this.entity.getPosition(), t.getPosition(), (function(t) {
        i.entity.fire("Path:Move", t)
    })), this.target = t
}, Waypoint.prototype.setWalking = function(t) {
    this.characterEntity.anim.setBoolean("Walking", t)
}, Waypoint.prototype.update = function(t) {
    if (this.target) {
        if (this.target && this.target.ownerEntity) return this.setNewTarget(this.baseTarget), !1;
        this.entity.getPosition().distance(this.target.getPosition()) < 1 && (this.entity.fire("Waypoint:Reach", this.target), this.setWalking(!1))
    } else this.setWalking(!1)
};
var Input = pc.createScript("input");
Input.attributes.add("placeholder", {
    type: "string"
}), Input.attributes.add("type", {
    type: "string",
    enum: [{
        Text: "text"
    }, {
        Email: "email"
    }, {
        Password: "password"
    }],
    default: "text"
}), Input.attributes.add("maxLength", {
    type: "number",
    default: 64
}), Input.attributes.add("fontSize", {
    type: "number",
    default: 1
}), Input.attributes.add("padding", {
    type: "number",
    default: 1
}), Input.attributes.add("hasIcon", {
    type: "boolean"
}), Input.attributes.add("scaleUnit", {
    type: "string",
    enum: [{
        "Viewport Width": "vw"
    }, {
        "Viewport Height": "vh"
    }, {
        Pixel: "px"
    }],
    default: "vw"
}), Input.attributes.add("color", {
    type: "rgb"
}), Input.attributes.add("disableTab", {
    type: "boolean"
}), Input.attributes.add("whitePlaceholder", {
    type: "boolean"
}), Input.attributes.add("temporary", {
    type: "boolean"
}), Input.attributes.add("fontFamily", {
    type: "string",
    default: "Arial, sans-serif"
}), Input.attributes.add("storeValue", {
    type: "boolean"
}), Input.attributes.add("containerEntity", {
    type: "entity"
}), Input.attributes.add("focusEntity", {
    type: "entity"
}), Input.attributes.add("sleepValue", {
    type: "string"
}), Input.attributes.add("blurFunction", {
    type: "string"
}), Input.attributes.add("key", {
    type: "string"
}), Input.prototype.initialize = function() {
    this.timeout = !1, this.app.on("Input:" + this.entity.name, this.setValue, this), this.on("state", (function(t) {
        t ? this.temporary ? this.element.style.display = "block" : this.createElement() : this.temporary ? this.element.style.display = "none" : this.onDestroy()
    }), this), this.on("destroy", this.onDestroy, this), this.createElement()
}, Input.prototype.createElement = function() {
    this.currentWidth = 0, this.currentHeight = 0, this.isDestroyed = !1, this.element = document.createElement("input"), this.element.placeholder = this.placeholder, this.element.type = this.type, this.element.style.position = "absolute", this.element.style.fontFamily = this.fontFamily, this.element.style.border = "0px", this.element.style.background = "transparent", this.element.style.fontSize = this.fontSize + this.scaleUnit, this.element.style.padding = this.padding + this.scaleUnit, this.element.style.boxSizing = "border-box", this.element.style.display = "block", this.hasIcon && (this.element.style.paddingRight = "2.5vw"), this.disableTab && (this.element.tabindex = !1), this.maxLength > 0 && (this.element.maxLength = this.maxLength);
    var t = "rgb(" + 255 * this.color.r + ", " + 255 * this.color.g + ", " + 255 * this.color.b + ")";
    this.element.style.color = t, this.element.style.outline = "none", this.whitePlaceholder && (this.element.className = "white-placeholder"), this.containerEntity ? (this.element.style.position = "fixed", this.containerEntity.script.container.insideElement.appendChild(this.element)) : document.body.appendChild(this.element), this.focusEntity && (this.focusEntity.enabled = !1), this.element.onfocus = this.onFocus.bind(this), this.element.onblur = this.onBlur.bind(this), this.blurFunction && (this.element.onblur = this.onBlurFunction.bind(this)), this.element.onchange = this.onChange.bind(this), Utils.getItem(this.entity._guid) && this.setValue(Utils.getItem(this.entity._guid)), this.updateStyle(), this.app.on("DOM:Clear", this.onDOMClear, this), this.app.on("DOM:Update", this.onDomUpdate, this), this.app.on("Input:" + this.entity.name, this.setResultValue, this), this.sleepValue && this.setValue(this.sleepValue)
}, Input.prototype.onBlurFunction = function() {
    var t = this.blurFunction.split(", ");
    if (t.length > 0)
        for (var e in t) {
            var i = t[e].split("@"),
                n = i[0];
            if (i.length > 1) {
                var s = i[1];
                this.app.fire(n, s)
            } else this.app.fire(n)
        }
}, Input.prototype.onDOMClear = function() {
    this.entity.destroy()
}, Input.prototype.onDestroy = function() {
    this.app.off("DOM:Clear", this.onDOMClear, this), this.app.off("DOM:Update", this.onDomUpdate, this), this.app.off("Input:" + this.entity.name, this.setResultValue, this), this.isDestroyed = !0, this.element && this.element.remove(), this.app.off("Input:" + this.entity.name, this.setValue, this)
}, Input.prototype.store = function() {
    this.storeValue = !0, this.onChange()
}, Input.prototype.onFocus = function() {
    this.focusEntity && (this.focusEntity.enabled = !0), this.app.fire("Input:Focus", !0)
}, Input.prototype.onBlur = function() {
    this.focusEntity && (this.focusEntity.enabled = !1), this.app.fire("Input:Focus", !1)
}, Input.prototype.onChange = function() {
    this.storeValue && Utils.setItem(this.entity._guid, this.getValue())
}, Input.prototype.onDomUpdate = function() {
    this._updateStyle()
}, Input.prototype.updateStyle = function() {
    if (this.currentWidth == window.innerWidth && this.currentHeight == window.innerHeight) return !1;
    this._updateStyle(), this.currentWidth = window.innerWidth, this.currentHeight = window.innerHeight
}, Input.prototype._updateStyle = function() {
    if (this.isDestroyed) return !1;
    var t = this;
    if (t.entity && t.entity.element && t.entity.element.screenCorners) {
        var e = t.entity.element.screenCorners,
            i = 1 / t.app.graphicsDevice.maxPixelRatio,
            n = 0,
            s = 0,
            o = (e[2].x - e[0].x) * i,
            l = (e[2].y - e[0].y) * i;
        if (this.containerEntity) {
            var h = this.containerEntity.scaleX,
                a = this.containerEntity.scaleY;
            n = (e[0].x - this.containerEntity.offsetLeft) / h, s = (e[0].y - this.containerEntity.offsetTop) / a - l + this.containerEntity.element.height, this.containerEntity && this.containerEntity.script.container.autoResize && (this.element.style.transform = "scale(" + 1 / h + ", " + 1 / a + ")", this.element.style.transformOrigin = "left bottom")
        } else n = e[0].x, s = e[0].y;
        t.element.style.left = n * i + "px", t.element.style.bottom = s * i + "px", t.element.style.width = o + "px", t.element.style.height = l + "px"
    }
}, Input.prototype.setResultValue = function(t) {
    if (!t) return !1;
    if (!t.result) return this.element.value = t, !1;
    var e = t.result;
    this.element ? (this.element.value = e, this.sleepValue = !1) : this.sleepValue = e
}, Input.prototype.setValue = function(t) {
    if (this.key && t && t[this.key] && this.element) return this.element.value = t[this.key], !1;
    this.element ? "string" == typeof t && this.element && (this.element.value = t, this.sleepValue = !1) : this.sleepValue = t
}, Input.prototype.getValue = function() {
    if (this.element) return this.element.value
}, Input.prototype.focus = function() {
    this.element && this.element.focus()
}, Input.prototype.blur = function() {
    this.element && this.element.blur()
};
var Kinematic = pc.createScript("kinematic");
Kinematic.attributes.add("state", {
    type: "boolean",
    default: !0
}), Kinematic.prototype.initialize = function() {
    this.isActive = !1, this.entity.on("Activate", this.setActivate, this), this.entity.on("Deactivate", this.setDeactivate, this), this.entity.on("ApplyForce", this.applyForce, this), this.state && this.setActivate()
}, Kinematic.prototype.applyForce = function(t) {
    this.entity.translateLocal(t)
}, Kinematic.prototype.setActivate = function() {
    if (this.isActive) return !1;
    this.entity.tags.add("Kinematic"), this.app.fire("Scene:Collision"), this.isActive = !0
}, Kinematic.prototype.setDeactivate = function() {
    if (!this.isActive) return !1;
    this.entity.tags.remove("Kinematic"), this.app.fire("Scene:Collision"), this.isActive = !1
};
var CharacterCustomization = pc.createScript("characterCustomization");
CharacterCustomization.attributes.add("renderEntity", {
    type: "entity"
}), CharacterCustomization.attributes.add("materials", {
    type: "asset",
    array: !0
}), CharacterCustomization.prototype.initialize = function() {
    this.gender = "Male", this.materialIndex = {
        Male: [2, 3, 1, 4],
        Female: [1, 4, 2, 3]
    }, this.currentMaterialIndexes = ["1", "3", "4", "4"];
    var e = Utils.getItem("CharacterGender"),
        t = Utils.getItem("CharacterCustomizationMaterial");
    if (t) {
        e && (this.gender = e);
        try {
            this.currentMaterialIndexes = JSON.parse(t)
        } catch (e) {}
    }
    this.updateAllMaterialIndexes(), this.app.on("CharacterCustomization:Tshirt", this.setTshirtColor, this), this.app.on("CharacterCustomization:Pant", this.setPantsColor, this), this.app.on("CharacterCustomization:Shoes", this.setShoesColor, this), this.app.on("CharacterCustomization:Hair", this.setHairColor, this), this.app.on("CharacterCustomization:Gender", this.setGender, this)
}, CharacterCustomization.prototype.setGender = function(e) {
    this.renderEntity.render.asset = this.app.assets.find("Chef-" + e), this.gender = e, this.updateAllMaterialIndexes(), this.saveMaterialIndexes()
}, CharacterCustomization.prototype.setShoesColor = function(e) {
    this.renderEntity.render.meshInstances.length > 0 && (this.renderEntity.render.meshInstances[this.materialIndex[this.gender][2]].material = this.materials[parseInt(e)].resource, this.currentMaterialIndexes[2] = e, this.saveMaterialIndexes())
}, CharacterCustomization.prototype.setTshirtColor = function(e) {
    this.renderEntity.render.meshInstances.length > 0 && (this.renderEntity.render.meshInstances[this.materialIndex[this.gender][0]].material = this.materials[parseInt(e)].resource, this.currentMaterialIndexes[0] = e)
}, CharacterCustomization.prototype.setPantsColor = function(e) {
    this.renderEntity.render.meshInstances.length > 0 && (this.renderEntity.render.meshInstances[this.materialIndex[this.gender][1]].material = this.materials[parseInt(e)].resource, this.currentMaterialIndexes[1] = e, this.saveMaterialIndexes())
}, CharacterCustomization.prototype.setHairColor = function(e) {
    this.renderEntity.render.meshInstances.length > 0 && (this.renderEntity.render.meshInstances[this.materialIndex[this.gender][3]].material = this.materials[parseInt(e)].resource, this.currentMaterialIndexes[3] = e, this.saveMaterialIndexes())
}, CharacterCustomization.prototype.saveMaterialIndexes = function() {
    Utils.setItem("CharacterCustomizationMaterial", JSON.stringify(this.currentMaterialIndexes)), Utils.setItem("CharacterGender", this.gender)
}, CharacterCustomization.prototype.updateAllMaterialIndexes = function() {
    this.renderEntity.render.meshInstances.length > 0 && (this.renderEntity.render.meshInstances[this.materialIndex[this.gender][0]].material = this.materials[this.currentMaterialIndexes[0]].resource, this.renderEntity.render.meshInstances[this.materialIndex[this.gender][1]].material = this.materials[this.currentMaterialIndexes[1]].resource, this.renderEntity.render.meshInstances[this.materialIndex[this.gender][2]].material = this.materials[this.currentMaterialIndexes[2]].resource, this.renderEntity.render.meshInstances[this.materialIndex[this.gender][3]].material = this.materials[this.currentMaterialIndexes[3]].resource)
};
var Building = pc.createScript("building");
Building.attributes.add("buildingPlace", {
    type: "entity"
}), Building.attributes.add("carryPoint", {
    type: "entity"
}), Building.attributes.add("placeholderEntity", {
    type: "entity"
}), Building.attributes.add("edgeEntity", {
    type: "entity"
}), Building.attributes.add("placeEntity", {
    type: "entity"
}), Building.attributes.add("placeDownButton", {
    type: "entity"
}), Building.attributes.add("greenColor", {
    type: "rgb"
}), Building.attributes.add("redColor", {
    type: "rgb"
}), Building.attributes.add("shopItems", {
    type: "entity",
    array: !0
}), Building.prototype.initialize = function() {
    this.guides = this.app.root.findByTag("Guide"), this.currentBuilding = !1, this.closerSnap = !1, this.buildings = this.app.root.findByTag("Placeable"), this.buildings.forEach((function(i) {
        i.enabled = !1
    })), this.placedBuildings = [];
    var i = Utils.getItem("PlacedBuildings");
    i && (this.placedBuildings = JSON.parse(i)), this.placeBuildings(), this.buildingPlace.enabled = !1, this.placeholderEntity.enabled = !1, this.resetShopItems(), this.showGuides([]), this.app.on("Building:Place", this.setBuilding, this), this.app.on("Building:Build", this.build, this)
}, Building.prototype.getBuildingByName = function(i) {
    var t;
    return this.buildings.forEach((function(e) {
        e.name === i && (t = e)
    })), t
}, Building.prototype.setBuilding = function(i) {
    this.currentBuilding = this.getBuildingByName(i), this.currentBuilding ? (this.hoverEntity = this.currentBuilding.clone(), this.hoverEntity.enabled = !0, this.hoverEntity.setLocalPosition(0, 0, 0), this.carryPoint.addChild(this.hoverEntity), this.entity.fire("Carry", !0), this.placeholderEntity.enabled = !0, this.showGuides(this.hoverEntity.tags.list()), this.placeDownButton.enabled = !0) : (this.hoverEntity && this.hoverEntity.destroy(), this.entity.fire("Carry", !1), this.placeholderEntity.enabled = !1, this.showGuides([]), this.placeDownButton.enabled = !1)
}, Building.prototype.showGuides = function(i) {
    for (var t = this.guides.length; t--;) {
        var e = this.guides[t],
            n = e.tags.list();
        for (var s in e.enabled = !1, i) {
            var l = i[s];
            n.indexOf(l) > -1 && (e.enabled = !0)
        }
    }
}, Building.prototype.snapToGuide = function() {
    var i = this.guides.length;
    if (this.closerSnap = !1, !this.currentBuilding) return !1;
    for (; i--;) {
        var t = this.guides[i];
        if (!0 === t.enabled) t.getPosition().clone().sub(this.buildingPlace.getPosition()).length() < 1 && (this.closerSnap = t.getPosition())
    }
}, Building.prototype.resetShopItems = function() {
    for (var i = this.shopItems.length; i--;) this.shopItems[i].fire("Reset")
}, Building.prototype.build = function() {
    if (!this.currentBuilding) return !1;
    if (!this.closerSnap) return this.app.fire("DealtDamage:Trigger", "BLOCKED", this.entity.getPosition()), !1;
    this.removeCloserBuilding(this.closerSnap.clone());
    var i = this.currentBuilding.clone();
    i.setPosition(this.closerSnap.clone()), i.enabled = !0, this.app.root.addChild(i), this.placedBuildings.push({
        name: i.name,
        position: this.closerSnap.clone()
    }), this.app.fire("EffectManager:LandSmoke", this.closerSnap.clone()), Utils.setItem("PlacedBuildings", JSON.stringify(this.placedBuildings)), this.currentBuilding = !1, this.placeholderEntity.enabled = !1, this.resetShopItems(), this.showGuides([]), this.entity.fire("Carry", !1), this.placeDownButton.enabled = !1, this.hoverEntity && this.hoverEntity.destroy(), this.app.fire("Building:Placed")
}, Building.prototype.removeCloserBuilding = function(i) {
    for (var t = !1, e = this.app.root.findByTag("Placeable"), n = e.length; n--;) {
        var s = e[n];
        if (s) s.getPosition().clone().sub(i).length() < 1.5 && (t = s.getPosition().clone(), s.destroy())
    }
    for (var l = this.placedBuildings.length; l--;) {
        var o = this.placedBuildings[l];
        if (t) {
            i = o.position;
            new pc.Vec3(i.x, i.y, i.z).sub(t).length() < 1.5 && this.placedBuildings.splice(l, 1)
        }
    }
}, Building.prototype.placeBuildings = function() {
    for (var i = this.placedBuildings.length; i--;) {
        var t = this.placedBuildings[i].name,
            e = this.placedBuildings[i].position,
            n = this.getBuildingByName(t);
        n && ((n = n.clone()).setPosition(e.x, e.y, e.z), n.enabled = !0, this.app.root.addChild(n))
    }
}, Building.prototype.setKeyboard = function() {
    (this.app.keyboard.wasPressed(pc.KEY_SPACE) || this.app.keyboard.wasPressed(pc.KEY_ENTER)) && this.build()
}, Building.prototype.updatePlaceholder = function() {
    this.snapToGuide(), this.closerSnap ? (this.edgeEntity.element.color = this.greenColor, this.placeEntity.element.color = this.greenColor, this.placeholderEntity.setPosition(this.closerSnap)) : (this.edgeEntity.element.color = this.redColor, this.placeEntity.element.color = this.redColor, this.placeholderEntity.setPosition(this.buildingPlace.getPosition()))
}, Building.prototype.update = function(i) {
    if (!this.currentBuilding) return !1;
    this.setKeyboard(), this.updatePlaceholder()
};
var Option = pc.createScript("option");
Option.attributes.add("action", {
    type: "string"
}), Option.attributes.add("value", {
    type: "string"
}), Option.attributes.add("checkEntity", {
    type: "entity"
}), Option.attributes.add("isChecked", {
    type: "boolean",
    default: !1
}), Option.prototype.initialize = function() {
    this.entity.element.on("mousedown", this.onPress, this), this.entity.element.on("touchstart", this.onPress, this), this.entity.element.on("mouseenter", this.onHover, this), this.entity.element.on("mouseleave", this.onLeave, this);
    var t = Utils.getItem("Check_" + this.entity._guid);
    t ? "true" == t ? this.setState(!0) : this.setState(!1) : this.isChecked ? this.setState(!0) : this.checkEntity.enabled = !1
}, Option.prototype.setState = function(t) {
    var e = this;
    this.app.root.findByTag(this.entity.tags.list()[0]).forEach((function(t) {
        e.entity != t && (t.script.option.checkEntity.enabled = !1, t.script.option.isChecked = !1)
    })), this.isChecked = t, this.checkEntity.enabled = t, Utils.setItem("Check_" + this.entity._guid, t), this.app.fire(this.action, this.value)
}, Option.prototype.toggle = function() {
    this.isChecked = !this.isChecked, this.setState(this.isChecked)
}, Option.prototype.onHover = function() {
    document.body.style.cursor = "pointer"
}, Option.prototype.onLeave = function() {
    document.body.style.cursor = "default"
}, Option.prototype.onPress = function(t) {
    this.toggle()
};
var Cosmetics = pc.createScript("cosmetics");
Cosmetics.attributes.add("popupEntity", {
    type: "entity"
}), Cosmetics.attributes.add("showroomEntity", {
    type: "entity"
}), Cosmetics.attributes.add("playerEntity", {
    type: "entity"
}), Cosmetics.attributes.add("outPosition", {
    type: "entity"
}), Cosmetics.prototype.initialize = function() {
    this.app.on("Cosmetics:Open", this.onOpen, this), this.app.on("Cosmetics:Close", this.onClose, this)
}, Cosmetics.prototype.onOpen = function() {
    this.popupEntity.enabled = !0, this.showroomEntity.enabled = !0, this.playerEntity.script.movement.isLocked = !0, this.entity.collision.enabled = !1
}, Cosmetics.prototype.onClose = function() {
    this.popupEntity.enabled = !1, this.showroomEntity.enabled = !1, this.playerEntity.script.movement.isLocked = !1, this.entity.collision.enabled = !0
};
var DoorKey = pc.createScript("doorKey");
DoorKey.attributes.add("doorEntity1", {
    type: "entity"
}), DoorKey.attributes.add("doorEntity2", {
    type: "entity"
}), DoorKey.prototype.initialize = function() {
    this.doorEntity1.fire("Activate"), this.doorEntity2.fire("Activate")
};
var Gameplay = pc.createScript("gameplay");
Gameplay.attributes.add("pauseEntity", {
    type: "entity"
}), Gameplay.attributes.add("playEntity", {
    type: "entity"
}), Gameplay.attributes.add("lightEntity", {
    type: "entity"
}), Gameplay.attributes.add("resetPopupEntity", {
    type: "entity"
}), Gameplay.prototype.initialize = function() {
    this.isPaused = !1, Utils.isMobile() && (this.lightEntity.light.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME), this.app.on("Gameplay:Pause", this.onPause, this), this.app.on("Gameplay:Reset", this.onReset, this), this.app.on("Gameplay:ShowResetPopup", this.showResetPopup, this), this.app.on("Gameplay:CloseResetPopup", this.closeResetPopup, this)
}, Gameplay.prototype.showResetPopup = function() {
    this.resetPopupEntity.enabled = !0
}, Gameplay.prototype.closeResetPopup = function() {
    this.resetPopupEntity.enabled = !1
}, Gameplay.prototype.onReset = function() {
    window.localStorage.clear(), window.location.reload()
}, Gameplay.prototype.onPause = function() {
    this.isPaused = !this.isPaused, this.pauseEntity.enabled = !this.isPaused, this.playEntity.enabled = this.isPaused
}, Gameplay.prototype.update = function() {
    this.app.keyboard.wasPressed(pc.KEY_P) && this.onPause()
};
var OptimizedLight = pc.createScript("optimizedLight");
OptimizedLight.prototype.initialize = function() {
    this.app.on("Light:Render", this.onRender, this)
}, OptimizedLight.prototype.onRender = function() {
    this.entity.light.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME
};
var Overlay = pc.createScript("overlay");
Overlay.attributes.add("rewardHolder", {
    type: "entity"
}), Overlay.attributes.add("rewardEntity", {
    type: "entity"
}), Overlay.attributes.add("popupEntity", {
    type: "entity"
}), Overlay.attributes.add("characterEntity", {
    type: "entity"
}), Overlay.attributes.add("playerEntity", {
    type: "entity"
}), Overlay.attributes.add("cameraBaseEntity", {
    type: "entity"
}), Overlay.attributes.add("wantBar", {
    type: "entity"
}), Overlay.attributes.add("orderHolder", {
    type: "entity"
}), Overlay.attributes.add("cookBar", {
    type: "entity"
}), Overlay.attributes.add("takeBar", {
    type: "entity"
}), Overlay.attributes.add("useArrowsEntity", {
    type: "entity"
}), Overlay.attributes.add("useTouchEntity", {
    type: "entity"
}), Overlay.attributes.add("bottomShadowEntity", {
    type: "entity"
}), Overlay.attributes.add("moneyEntity", {
    type: "entity"
}), Overlay.attributes.add("gameControlsEntity", {
    type: "entity"
}), Overlay.attributes.add("otherCafesEntity", {
    type: "entity"
}), Overlay.attributes.add("countryPopup", {
    type: "entity"
}), Overlay.attributes.add("countryTitle", {
    type: "entity"
}), Overlay.attributes.add("countryThumbnail", {
    type: "entity"
}), Overlay.attributes.add("countryComingSoon", {
    type: "entity"
}), Overlay.attributes.add("switchButton", {
    type: "entity"
}), Overlay.attributes.add("indicatorArrow", {
    type: "entity"
}), Overlay.attributes.add("tutorialArrow", {
    type: "entity"
}), Overlay.attributes.add("dailyRewardPopup", {
    type: "entity"
}), Overlay.attributes.add("dailyRewardTimeEntity", {
    type: "entity"
}), Overlay.attributes.add("upgradePopup", {
    type: "entity"
}), Overlay.attributes.add("pauseEntity", {
    type: "entity"
}), Overlay.attributes.add("designPopup", {
    type: "entity"
}), Overlay.attributes.add("designHolder", {
    type: "entity"
}), Overlay.attributes.add("designItem", {
    type: "entity"
}), Overlay.attributes.add("designItems", {
    type: "json",
    schema: [{
        name: "name",
        type: "string"
    }, {
        name: "type",
        type: "string",
        enum: [{
            Props: "Props"
        }, {
            Floor: "Floor"
        }, {
            Wall: "Wall"
        }],
        default: "Props"
    }, {
        name: "price",
        type: "number"
    }],
    array: !0
}), Overlay.prototype.initialize = function() {
    this.indicatorTimer = 0, this.isPlacing = !1, this.lastOfferTime = -1, this.designItemsArray = [], Utils.isMobile() ? (this.rewardEntity.setLocalScale(2.28, 2.28, 2.28), this.popupEntity.setLocalPosition(0, 0, 0), this.characterEntity.enabled = !1, this.wantBar.script.timeline.endFrame.scale.x = 2, this.wantBar.script.timeline.endFrame.scale.y = 2, this.wantBar.script.timeline.endFrame.scale.z = 2, this.orderHolder.setLocalScale(.671, .671, .671), this.orderHolder.setLocalPosition(0, -80, 0), this.rewardHolder.script.timeline.endFrame.position.y = 200, this.otherCafesEntity.setLocalScale(1.636, 1.636, 1.636), this.cookBar.script.timeline.endFrame.scale.x = 1.5, this.cookBar.script.timeline.endFrame.scale.y = 1.5, this.cookBar.script.timeline.endFrame.scale.z = 1.5, this.takeBar.script.timeline.endFrame.scale.x = 1.5, this.takeBar.script.timeline.endFrame.scale.y = 1.5, this.takeBar.script.timeline.endFrame.scale.z = 1.5, this.useArrowsEntity.enabled = !1, this.useTouchEntity.enabled = !0, this.bottomShadowEntity.enabled = !0, this.moneyEntity.setLocalScale(1.4, 1.4, 1.4), this.gameControlsEntity.setLocalScale(1.4, 1.4, 1.4)) : this.useTouchEntity.enabled = !1, Utils.isIOS() && (this.useArrowsEntity.enabled = !1, this.useTouchEntity.enabled = !0), Utils.getItem("DailyReward") ? this.lastDailyReward = parseInt(Utils.getItem("DailyReward")) : Utils.getItem("TutorialIndex") && (this.lastDailyReward = -1), Date.now() - this.lastDailyReward > 864e5 && this.showDailyRewardPopup(), this.app.on("Country:Switch", this.showCountryPopup, this), this.app.on("Country:Close", this.closeCountryPopup, this), this.app.on("Design:Show", this.showDesignPopup, this), this.app.on("Design:Buy", this.buyDesign, this), this.app.on("Design:Filter", this.filterDesignItems, this), this.app.on("Design:Close", this.closeDesignPopup, this), this.app.on("DailyReward:Claim", this.claimDailyReward, this), this.app.on("DailyReward:Close", this.closeRewardClaim, this), this.app.on("Upgrade:Show", this.showUpgradePopup, this), this.app.on("Upgrade:Close", this.closeUpgradePopup, this), this.app.on("Building:Placed", this.onPlace, this), this.app.on("Gameplay:Play", this.onPlay, this), this.app.on("Gameplay:Pause", this.onPause, this), this.filterDesignItems("Props")
}, Overlay.prototype.onPlay = function() {
    this.pauseEntity.enabled = !1
}, Overlay.prototype.onPause = function() {
    this.pauseEntity.enabled = !0
}, Overlay.prototype.showUpgradePopup = function() {
    this.upgradePopup.enabled = !0
}, Overlay.prototype.closeUpgradePopup = function() {
    this.upgradePopup.enabled = !1
}, Overlay.prototype.showDailyRewardPopup = function() {
    this.dailyRewardPopup.enabled = !0, this.dailyRewardTime = 86400
}, Overlay.prototype.closeRewardClaim = function() {
    this.dailyRewardPopup.enabled = !1
}, Overlay.prototype.claimDailyReward = function() {
    Utils.setItem("DailyReward", Date.now()), this.app.fire("RewardManager:Get", 250), this.closeRewardClaim(), Utils.logCheckpoint("daily_reward")
}, Overlay.prototype.onPlace = function() {
    this.isPlacing = !1
}, Overlay.prototype.filterDesignItems = function(t) {
    for (var e = this.designItemsArray.length; e--;) this.designItemsArray[e].destroy();
    this.designItemsArray = [];
    for (e = 0; e < this.designItems.length; e++)
        if (t == this.designItems[e].type) {
            var i = this.designItem.clone();
            i.enabled = !0, i.script.button.value = this.designItems[e].name, i.findByName("Name").element.text = this.designItems[e].name, i.findByName("Price").element.text = "$" + this.designItems[e].price, i.findByName("Icon").element.textureAsset = this.app.assets.find(this.designItems[e].name + "-Icon.png"), this.designHolder.addChild(i), this.designItemsArray.push(i)
        }
}, Overlay.prototype.showCountryPopup = function(t) {
    this.countryPopup.enabled = !0, this.countryTitle.element.text = t, this.countryThumbnail.element.textureAsset = this.app.assets.find("Location-" + t + ".jpg"), "Japan" == t ? (this.countryComingSoon.enabled = !0, this.switchButton.enabled = !1) : (this.countryComingSoon.enabled = !1, this.switchButton.enabled = !0), this.playerEntity.script.movement.isLocked = !0
}, Overlay.prototype.closeCountryPopup = function() {
    this.countryPopup.enabled = !1, this.playerEntity.script.movement.isLocked = !1
}, Overlay.prototype.showDesignPopup = function() {
    if (this.isPlacing) return !1;
    this.designPopup.enabled = !0, this.playerEntity.script.movement.isLocked = !0
}, Overlay.prototype.buyDesign = function(t) {
    var e = this.designItems.find((function(e) {
        return e.name === t
    }));
    e && (pc.MoneyManager.money < e.price ? (Date.now() - this.lastOfferTime < 12e4 ? this.app.fire("Money:NoMoney") : this.app.fire("RewardManager:ShowPopup"), this.lastOfferTime = Date.now()) : ("Props" == e.type ? (this.isPlacing = !0, this.app.fire("Building:Place", t)) : "Floor" == e.type ? this.app.fire("Decoration:SetFloor", t) : "Wall" == e.type && this.app.fire("Decoration:SetWall", t), this.entity.sound.play("CashComplete"), this.app.fire("Money:Remove", e.price), this.closeDesignPopup()), Utils.logCheckpoint("decoration_" + t))
}, Overlay.prototype.closeDesignPopup = function() {
    this.designPopup.enabled = !1, this.playerEntity.script.movement.isLocked = !1, PokiPlugin.playGame()
}, Overlay.prototype.update = function(t) {
    pc.hasActivePopup = this.designPopup.enabled || this.popupEntity.enabled || this.dailyRewardPopup.enabled || this.upgradePopup.enabled, this.dailyRewardPopup && (this.dailyRewardTimeEntity.element.text = Utils.mmss(this.dailyRewardTime), this.dailyRewardTime -= t)
};
var UpgradeManager = pc.createScript("upgradeManager");
UpgradeManager.attributes.add("playerEntity", {
    type: "entity"
}), UpgradeManager.attributes.add("outPosition", {
    type: "entity"
}), UpgradeManager.attributes.add("popupEntity", {
    type: "entity"
}), UpgradeManager.attributes.add("titleEntity", {
    type: "entity"
}), UpgradeManager.attributes.add("moneyEntity", {
    type: "entity"
}), UpgradeManager.attributes.add("imageEntity", {
    type: "entity"
}), UpgradeManager.attributes.add("upgradePoint", {
    type: "entity"
}), UpgradeManager.attributes.add("upgrades", {
    type: "json",
    schema: [{
        name: "title",
        type: "string"
    }, {
        name: "money",
        type: "number",
        default: 10
    }, {
        name: "entity",
        type: "entity"
    }, {
        name: "station",
        type: "entity"
    }, {
        name: "image",
        type: "asset"
    }],
    array: !0
}), UpgradeManager.prototype.initialize = function() {
    this.createdAt = Date.now(), this.index = -1;
    var t = Utils.getItem("UpgradeIndex");
    t && t > -1 && (this.index = t, this.unlockUntilIndex()), this.app.on("UpgradeManager:Show", this.onShow, this), this.app.on("UpgradeManager:Details", this.showDetails, this), this.app.on("UpgradeManager:Unlock", this.unlock, this)
}, UpgradeManager.prototype.onShow = function(t) {
    var e = parseInt(t),
        a = this.getUpgrade(e);
    a && (a.station.enabled = !0)
}, UpgradeManager.prototype.showDetails = function(t) {
    if (this.popupEntity.enabled) return !1;
    this.popupEntity.enabled = !0;
    var e = this.getUpgrade(t);
    e && (this.titleEntity.element.text = e.title, this.imageEntity.element.textureAsset = e.image, this.moneyEntity.element.text = "$" + e.money), setTimeout((function(t) {
        t.popupEntity.enabled = !1
    }), 5e3, this)
}, UpgradeManager.prototype.onClose = function() {
    this.popupEntity.enabled = !1, this.playerEntity.setPosition(this.outPosition.getPosition().clone()), this.playerEntity.script.movement.isLocked = !1
}, UpgradeManager.prototype.getUpgrade = function(t) {
    return this.upgrades[parseInt(t)]
}, UpgradeManager.prototype.unlock = function(t) {
    var e = this.getUpgrade(t);
    e && e.entity && !e.entity.enabled && (e.entity.enabled = !0, this.entity.sound.play("Upgrade"), this.app.fire("Camera:Focus", e.entity), this.app.fire("EffectManager:Unlock", e.entity.getPosition()), Date.now() - this.createdAt > 5e3 && setTimeout((function() {
        pc.app.fire("Tutorial:Next")
    }), 3e3, this), Utils.setItem("UpgradeIndex", this.index), this.index++)
}, UpgradeManager.prototype.unlockUntilIndex = function() {
    for (var t = 0; t <= this.index; t++) upgrade = this.getUpgrade(t), upgrade && upgrade.entity && (upgrade.entity.enabled = !0)
};
var StateEvent = pc.createScript("stateEvent");
StateEvent.attributes.add("events", {
    type: "json",
    schema: [{
        name: "eventName",
        type: "string"
    }, {
        name: "eventValue",
        type: "string"
    }, {
        name: "arg1",
        type: "string"
    }],
    array: !0
}), StateEvent.prototype.initialize = function() {
    this.events.forEach((function(e) {
        pc.app.fire(e.eventName, e.eventValue, e.arg1)
    }), this)
};
var TimeUpgrade = pc.createScript("timeUpgrade");
TimeUpgrade.attributes.add("entitiesToUpdate", {
    type: "entity",
    array: !0,
    title: "Entities to Update"
}), TimeUpgrade.attributes.add("barEntity", {
    type: "entity",
    title: "Bar Entity"
}), TimeUpgrade.attributes.add("stoveEntity", {
    type: "entity"
}), TimeUpgrade.attributes.add("upgradeName", {
    type: "string"
}), TimeUpgrade.prototype.initialize = function() {
    for (var t = 0; t < this.entitiesToUpdate.length; t++) this.entitiesToUpdate[t].script.station.time = 1;
    this.upgradeName && this.app.fire("Station:SetUpgrade", this.upgradeName, 3), this.stoveEntity.model.meshInstances[0].material = this.app.assets.find("Palette-Lux").resource
};
var GarbageBin = pc.createScript("garbageBin");
GarbageBin.prototype.initialize = function() {
    this.lastDrop = -1, this.entity.on("Trigger", this.onTrigger, this), this.app.fire("Scene:Triggers")
}, GarbageBin.prototype.onTrigger = function(r) {
    r && (Date.now() - this.lastDrop > 100 && r.script.carries.hasCarryByName("Garbage") && (this.app.fire("Throw", "Garbage", 1200), this.entity.sound.play("Whoosh"), r.fire("Drop", "Garbage"), this.lastDrop = Date.now()), r.fire("Trigger:Reset"))
};
var ExpansionManager = pc.createScript("expansionManager");
ExpansionManager.attributes.add("expansions", {
    type: "entity",
    array: !0
}), ExpansionManager.prototype.initialize = function() {
    this.app.on("ExpansionManager:Upgrade", this.upgrade, this)
}, ExpansionManager.prototype.upgrade = function(a) {};
var Garbage = pc.createScript("garbage");
Garbage.prototype.initialize = function() {
    this.entity.on("Trigger", this.onTrigger, this)
}, Garbage.prototype.onTrigger = function(r) {
    if (!r) return !1;
    pc.carriedGarbageBefore || (pc.carriedGarbageBefore = !0, setTimeout((function(r) {
        r.app.fire("Camera:Focus", r.app.root.findByName("GarbageBin"))
    }), 1500, this))
};
var ColorTransfusion = pc.createScript("colorTransfusion");
ColorTransfusion.attributes.add("colorCurve", {
    type: "curve",
    color: "rgb",
    default: {
        keys: [
            [0, .5, .5, 1, 1, 0],
            [0, 0, .5, .5, 1, 1],
            [0, 1, .5, 0, 1, .5]
        ]
    }
}), ColorTransfusion.attributes.add("time", {
    type: "number",
    default: 1
}), ColorTransfusion.attributes.add("loop", {
    type: "boolean"
}), ColorTransfusion.prototype.initialize = function() {
    this.timer = 0
}, ColorTransfusion.prototype.update = function(o) {
    this.timer += o / this.time;
    var t = this.colorCurve.value(this.timer);
    this.entity.element.color = new pc.Color(t[0], t[1], t[2], t[3]), this.loop && this.timer >= 1 && (this.timer = 0)
};
var Waiter = pc.createScript("waiter");
Waiter.attributes.add("waiterType", {
    type: "string",
    default: "Burger"
}), Waiter.attributes.add("baseEntity", {
    type: "entity"
}), Waiter.attributes.add("kitchenManager", {
    type: "entity"
}), Waiter.attributes.add("characterEntity", {
    type: "entity"
}), Waiter.attributes.add("plateWithFood", {
    type: "entity"
}), Waiter.attributes.add("floatingFood", {
    type: "boolean",
    default: !1
}), Waiter.prototype.initialize = function() {
    this.isCarry = !1, this.onBase = !0, this.customerIsSelected = !1, this.selectedCustomer = !1, this.plateWithFood.enabled = !1, this.originalSpeed = parseFloat("" + this.entity.script.pathMove.speed), this.entity.on("Waypoint:Reach", this.onWayPoint, this), this.entity.on("Station:Upgrade", this.setUpgradeState, this)
}, Waiter.prototype.setUpgradeState = function(t, e) {
    this.entity.script.pathMove.speed = Math.min(this.originalSpeed * e, .075)
}, Waiter.prototype.onWayPoint = function(t) {
    t.name == this.baseEntity.name && (this.onBase = !0), "Customer" != t.name && "FatCustomer" != t.name || (this.selectedCustomer.fire("TrigerWaiter", this.entity, this.waiterType), this.isCarry = !1, this.selectedCustomer = !1, this.entity.fire("Waypoint:Target", this.baseEntity))
}, Waiter.prototype.deliver = function() {
    if (this.selectedCustomer && 0 === this.selectedCustomer.children.length && (this.selectedCustomer = !1), this.selectedCustomer && "Leave" == this.selectedCustomer.script.customer.state && (this.selectedCustomer = !1), this.selectedCustomer) return !1;
    this.customerIsSelected = !1;
    var t = this.app.root.findByTag("Customer");
    if (t.length > 0)
        for (var e in t) !this.customerIsSelected && t[e].enabled && 1 == t[e].script.customer.getWantByName(this.waiterType) && (this.entity.fire("Waypoint:Target", t[e]), this.onBase = !1, this.selectedCustomer = t[e], this.customerIsSelected = !0);
    this.customerIsSelected || this.entity.fire("Waypoint:Target", this.baseEntity)
}, Waiter.prototype.update = function(t) {
    if (this.isCarry) this.characterEntity.anim.setBoolean("Carry", !0), this.plateWithFood.enabled = !0, this.deliver();
    else if (this.characterEntity.anim.setBoolean("Carry", !1), this.plateWithFood.enabled = !1, this.onBase && (totalFoodTypeCount = this.kitchenManager.script.kitchenManager.totalFoodCountByName(this.waiterType), this.floatingFood && (totalFoodTypeCount = 1), totalFoodTypeCount > 0)) {
        this.isCarry = !0;
        var e = this.app.root.findByName(this.waiterType + "PlacePoint" + totalFoodTypeCount);
        e && e.children && e.children.length > 0 && e.children[0].destroy()
    }
};
var DecorationManager = pc.createScript("decorationManager");
DecorationManager.attributes.add("floorEntity", {
    type: "entity"
}), DecorationManager.attributes.add("secondFloorEntity", {
    type: "entity"
}), DecorationManager.attributes.add("wallEntities", {
    type: "entity",
    array: !0
}), DecorationManager.prototype.initialize = function() {
    var t = Utils.getItem("Floor");
    t && this.setFloor(t);
    var e = Utils.getItem("Wall");
    e && this.setWall(e), this.app.on("Decoration:SetFloor", this.setFloor, this), this.app.on("Decoration:SetWall", this.setWall, this)
}, DecorationManager.prototype.setFloor = function(t) {
    var e = this,
        a = this.app.assets.find(t);
    a.ready((function() {
        e.floorEntity.model.meshInstances[0].material = a.resource, e.secondFloorEntity.model.meshInstances[0].material = a.resource
    })), this.app.assets.load(a), Utils.setItem("Floor", t)
}, DecorationManager.prototype.setWall = function(t) {
    var e = this,
        a = this.app.assets.find(t);
    a.ready((function() {
        e.wallEntities.forEach((function(t) {
            t.model.meshInstances[0].material = a.resource
        }))
    })), this.app.assets.load(a), Utils.setItem("Wall", t)
};
var Node = function(t, i) {
        this.x = t, this.z = i, this.f = 0, this.g = 0, this.h = 0, this.parent = null, this.walkable = !0
    },
    PathFinding = pc.createScript("pathFinding");
PathFinding.attributes.add("gridWidth", {
    type: "number",
    default: 100
}), PathFinding.attributes.add("gridHeight", {
    type: "number",
    default: 100
}), PathFinding.attributes.add("size", {
    type: "number",
    default: 1
}), PathFinding.attributes.add("offset", {
    type: "number",
    default: 1
}), PathFinding.prototype.initialize = function() {
    this.grid = [], this.entities = [], this.app.on("PathFinding:Find", this.createPath, this)
}, PathFinding.prototype.createPath = function(t, i, e) {
    var s = this;
    this.player = t, this.destination = i, this.createGrid();
    var n = this.calculatePath(this.snap(t.x), this.snap(t.z), this.snap(i.x), this.snap(i.z));
    n && e && e(n.map((function(t) {
        return new pc.Vec3(t.x / s.size - parseInt(s.offset), 0, t.z / s.size - parseInt(s.offset))
    })))
}, PathFinding.prototype.createGrid = function() {
    var t, i;
    for (t = -this.gridWidth; t < this.gridWidth; t++)
        for (this.grid[t] = [], i = -this.gridHeight; i < this.gridHeight; i++) this.grid[t][i] = new Node(t, i);
    for (this.obstacles = this.app.root.findByTag("Obstacle"), t = 0; t < this.obstacles.length; t++) {
        var e = this.snap(this.obstacles[t].getPosition().x),
            s = this.snap(this.obstacles[t].getPosition().z);
        this.grid[e][s].walkable = !1
    }
}, PathFinding.prototype.snap = function(t) {
    return Math.round(t * this.size) + this.offset
}, PathFinding.prototype.calculatePath = function(t, i, e, s) {
    var n = [],
        h = [],
        a = [],
        r = this.grid[t][i],
        d = this.grid[e][s];
    if (!d) return !1;
    if (!d.walkable) return !1;
    for (n.push(r); n.length > 0;) {
        for (var g = n[0], o = 0; o < n.length; o++) n[o].f < g.f && (g = n[o]);
        if (n.splice(n.indexOf(g), 1), h.push(g), g.x === d.x && g.z === d.z) {
            for (var p = h[h.length - 1]; p.parent;) a.push(p), p = p.parent;
            return n = [], h = [], a.reverse(), a
        }
        var u = this.getAdjacentNodes(g);
        for (o = 0; o < u.length; o++) {
            var f = u[o]; - 1 === h.indexOf(f) && f.walkable && (-1 === n.indexOf(f) ? (f.g = g.g + this.getCost(g, f), f.h = this.getCost(f, d), f.f = f.g + f.h, f.parent = g, n.push(f)) : f.g > g.g + this.getCost(g, f) && (f.g = g.g + this.getCost(g, f), f.f = f.g + f.h, f.parent = g))
        }
    }
    return !1
}, PathFinding.prototype.getAdjacentNodes = function(t) {
    var i = [];
    return t.x > 0 && i.push(this.grid[t.x - 1][t.z]), t.x < this.gridWidth - 1 && i.push(this.grid[t.x + 1][t.z]), t.z > 0 && i.push(this.grid[t.x][t.z - 1]), t.z < this.gridHeight - 1 && i.push(this.grid[t.x][t.z + 1]), i
}, PathFinding.prototype.getCost = function(t, i) {
    return 10
};
var PathMove = pc.createScript("pathMove");
PathMove.attributes.add("directionEntity", {
    type: "entity"
}), PathMove.attributes.add("speed", {
    type: "number",
    default: .025
}), PathMove.attributes.add("turnSpeed", {
    type: "number",
    default: .15
}), PathMove.prototype.initialize = function() {
    this.direction = 0, this.nextDirection = 90, this.randomizedVector = new pc.Vec3, this.speedFactor = .01 * Math.random(), this.isMoving = !1, this.isFocusing = !1, this.path = [], this.entity.on("Path:Move", this.setPath, this), this.entity.on("Path:Stop", this.stopMoving, this), this.entity.on("Path:Focus", this.setFocus, this)
}, PathMove.prototype.stopMoving = function() {
    this.isMoving = !1, this.path = []
}, PathMove.prototype.setFocus = function(t) {
    this.isFocusing = t
}, PathMove.prototype.update = function(t) {
    var i = this.entity.getLocalPosition();
    if (this.isFocusing) {
        var s = this.isFocusing.getPosition();
        this.nextDirection = Utils.lookAt(i.x, i.z, s.x, s.z)
    }
    if ((this.isFocusing || this.isMoving) && (this.direction = Utils.rotate(this.direction, this.nextDirection, this.turnSpeed)), this.directionEntity.setLocalEulerAngles(0, this.direction * pc.math.RAD_TO_DEG, 0), this.isMoving && this.path.length > 0) {
        s = this.path[0].clone().add(this.randomizedVector);
        var e = (new pc.Vec3).sub2(s, i);
        this.nextDirection = Utils.lookAt(this.entity.getLocalPosition().x, this.entity.getLocalPosition().z, s.x, s.z), e.length() < .15 ? this.path.shift() : (e.normalize().scale(this.speed + this.speedFactor), this.entity.translateLocal(e))
    }
    this.entity.fire("Path:State", this.isMoving)
}, PathMove.prototype.setPath = function(t) {
    if (t.length > 0) {
        this.path = t;
        var i = this.entity.getLocalPosition(),
            s = this.path[this.path.length - 1].clone();
        (new pc.Vec3).sub2(s, i).length() > 1 && (this.isFocusing = !1, this.isMoving = !0)
    } else this.isFocusing = !1, this.isMoving = !1
};
var TestGrid = pc.createScript("testGrid");
TestGrid.prototype.initialize = function() {}, TestGrid.prototype.update = function(t) {
    if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        var i = this;
        this.app.fire("PathFinding:Find", this.entity.getPosition(), this.app.root.findByName("Cash").getPosition(), (function(t) {
            i.entity.fire("Path:Move", t)
        }))
    }
};
var ResponsiveController = pc.createScript("responsiveController");
ResponsiveController.attributes.add("elements", {
    type: "json",
    schema: [{
        name: "desktop",
        type: "entity"
    }, {
        name: "mobile",
        type: "entity"
    }],
    array: !0
}), ResponsiveController.prototype.initialize = function() {
    for (var e = 0; e < this.elements.length; e++) Utils.isMobile() ? (this.elements[e].mobile && (this.elements[e].mobile.enabled = !0), this.elements[e].desktop && (this.elements[e].desktop.enabled = !1)) : (this.elements[e].mobile && (this.elements[e].mobile.enabled = !1), this.elements[e].desktop && (this.elements[e].desktop.enabled = !0))
};
var GrindManager = pc.createScript("grindManager");
GrindManager.attributes.add("stations", {
    type: "entity",
    array: !0
}), GrindManager.prototype.postInitialize = function() {
    PokiPlugin.adblock && this.stations.forEach((function(t) {
        t.script.station.startMoney = parseInt(1.5 * t.script.station.money), t.script.station.reset()
    }))
};
var StationUpgrades = pc.createScript("stationUpgrades");
StationUpgrades.attributes.add("upgrades", {
    type: "json",
    schema: [{
        name: "name",
        type: "string"
    }, {
        name: "type",
        type: "string",
        default: "StationTime",
        enum: [{
            StationTime: "StationTime"
        }, {
            NPCSpeed: "NPCSpeed"
        }, {
            CarryCount: "CarryCount"
        }]
    }, {
        name: "entity",
        type: "entity"
    }, {
        name: "station",
        type: "entity"
    }, {
        name: "level",
        type: "number",
        default: 1
    }, {
        name: "icon",
        type: "asset"
    }],
    array: !0
}), StationUpgrades.attributes.add("costs", {
    type: "json",
    schema: [{
        name: "cost",
        type: "number",
        default: 100
    }, {
        name: "multiplier",
        type: "number",
        default: 1
    }],
    array: !0
}), StationUpgrades.attributes.add("listEntity", {
    type: "entity"
}), StationUpgrades.attributes.add("listHolder", {
    type: "entity"
}), StationUpgrades.attributes.add("notificationEntities", {
    type: "entity",
    array: !0
}), StationUpgrades.prototype.initialize = function() {
    this.list = [], this.listEntity.enabled = !1, this.lastMoneyThreshold = 30, this.lastUpgradeCheck = Date.now(), this.lastRewardUpgrade = -1, this.sinceLastUpgrade = -1, this.isTutorialFinished = !1, setTimeout((function(e) {
        e.loadUpgrades()
    }), 500, this), this.app.on("Station:Upgrade", this.onUpgrade, this), this.app.on("Station:RewardUpgrade", this.onRewardUpgrade, this), this.app.on("Station:SetUpgrade", this.setUpgradeLevel, this), this.app.on("Upgrade:Show", this.showUpgradePopup, this), this.app.on("Tutorial:FirstPhaseCompleted", this.onTutorialFinished, this), this.setNotificationState(!1)
}, StationUpgrades.prototype.onTutorialFinished = function() {
    this.isTutorialFinished = !0
}, StationUpgrades.prototype.loadUpgrades = function() {
    var e = this;
    this.upgrades.forEach((function(t) {
        var a = Utils.getItem(t.name + "_UpgradeLevel");
        a && (t.level = parseInt(a), e.onUpgradeUpdate(t))
    })), this.renderUpgrades()
}, StationUpgrades.prototype.setUpgradeLevel = function(e, t) {
    var a = this.getUpgrade(e);
    a && (a.level = parseInt(t), this.onUpgradeUpdate(a))
}, StationUpgrades.prototype.getUpgrade = function(e) {
    return this.upgrades.find((function(t) {
        return t.name === e
    }))
}, StationUpgrades.prototype.getLevelMultiplier = function(e) {
    return this.costs[e - 1] ? this.costs[e - 1].multiplier : this.costs[this.costs.length - 1].multiplier
}, StationUpgrades.prototype.getLevelCost = function(e) {
    return this.costs[e - 1] ? this.costs[e - 1].cost : this.costs[this.costs.length - 1].cost
}, StationUpgrades.prototype.onRewardUpgrade = function(e) {
    if (Date.now() - this.sinceLastUpgrade < 120) return !1;
    if (Date.now() - this.lastRewardUpgrade < 1e3) return !1;
    var t = this;
    this.app.fire("RewardManager:GetWithCallback", "Upgrade", (function() {
        t.onUpgrade(e)
    })), this.lastRewardUpgrade = Date.now(), this.sinceLastUpgrade = Date.now()
}, StationUpgrades.prototype.onUpgrade = function(e, t, a) {
    if (Date.now() - this.sinceLastUpgrade < 120) return !1;
    var i = this.getUpgrade(e),
        n = this.getLevelCost(i.level);
    if (i) {
        if (this.costs.length - 1 < i.level) return !1;
        i.level++, this.app.fire("Money:Remove", n), this.app.fire("Sound:Play", "CashComplete"), this.onUpgradeUpdate(i), setTimeout((function(e) {
            e.renderUpgrades()
        }), 100, this), a && this.app.fire("DealtDamage:Screen", "UPGRADE", new pc.Vec3(a.x, a.y - 50, 0))
    }
    this.sinceLastUpgrade = Date.now()
}, StationUpgrades.prototype.onUpgradeUpdate = function(e) {
    e && (e.entity.fire("Station:Upgrade", e.level, this.getLevelMultiplier(e.level)), e.station && e.station.fire("Complete"), Utils.setItem(e.name + "_UpgradeLevel", e.level))
}, StationUpgrades.prototype.clearHolder = function() {
    for (var e = this.list.length; e--;) this.list[e].destroy();
    this.list = []
}, StationUpgrades.prototype.renderUpgrades = function() {
    this.clearHolder();
    for (var e = 0; e < this.upgrades.length; e++) {
        var t = this.upgrades[e],
            a = this.getLevelCost(t.level);
        if (t.entity.enabled) {
            var i = this.listEntity.clone(),
                n = 1 * t.level / this.costs.length,
                s = "Unknown";
            i.enabled = !0, i.findByName("Upgrade").script.button.value = t.name, i.findByName("RewardUpgrade").script.button.value = t.name, i.findByName("Name").element.text = t.name, i.findByName("Level").element.text = "Level " + t.level, i.findByName("Fill").setLocalScale(n, 1, 1), "StationTime" == t.type && (s = this.getLevelMultiplier(t.level) + " seconds"), i.findByName("State").element.text = s, i.findByName("Max").enabled = !1, i.findByName("Icon").element.textureAsset = t.icon, t.level > this.costs.length - 1 ? (i.findByName("Max").enabled = !0, i.findByName("Upgrade").enabled = !1, i.findByName("RewardUpgrade").enabled = !1, i.findByName("PriceLabel").enabled = !1) : (pc.MoneyManager.money < a ? Date.now() - this.lastRewardUpgrade < 12e4 ? (i.findByName("Upgrade").enabled = !1, i.findByName("RewardUpgrade").enabled = !1) : (i.findByName("Upgrade").enabled = !1, i.findByName("RewardUpgrade").enabled = !0) : (i.findByName("Upgrade").enabled = !0, i.findByName("RewardUpgrade").enabled = !1), i.findByName("Price").element.text = "$" + a), this.listHolder.addChild(i), this.list.push(i)
        }
    }
}, StationUpgrades.prototype.showUpgradePopup = function() {
    this.renderUpgrades(), this.setNotificationState(!1)
}, StationUpgrades.prototype.setNotificationState = function(e) {
    for (var t = 0; t < this.notificationEntities.length; t++) this.notificationEntities[t].enabled = e
}, StationUpgrades.prototype.checkUpgradeThreshold = function() {
    if (Date.now() - this.lastUpgradeCheck < 1e3) return !1;
    for (var e = 0; e < this.upgrades.length; e++) {
        var t = this.upgrades[e],
            a = this.getLevelCost(t.level);
        t.entity.enabled && (this.lastMoneyThreshold = Math.max(a, this.lastMoneyThreshold))
    }
    pc.MoneyManager.money >= this.lastMoneyThreshold && this.setNotificationState(!0), this.lastUpgradeCheck = Date.now()
}, StationUpgrades.prototype.update = function() {
    if (!this.isTutorialFinished) return !1;
    this.checkUpgradeThreshold()
};
var CustomBoost = pc.createScript("customBoost");
CustomBoost.prototype.initialize = function() {
    "CarryFix" == this.entity.name && this.app.fire("Station:SetUpgrade", "Carry", 6)
};
var Tabs = pc.createScript("tabs");
Tabs.attributes.add("tabEntity", {
    type: "entity"
}), Tabs.attributes.add("tabs", {
    type: "string",
    array: !0
}), Tabs.prototype.initialize = function() {
    this.tabEntities = [], this.tabEntity.enabled = !1;
    for (var t = 0; t < this.tabs.length; t++) {
        var i = this.tabEntity.clone();
        i.script.button.value = this.tabs[t], i.on("Button:Press", this.onButtonPress, this), i.findByName("Text").element.text = this.tabs[t], i.enabled = !0, this.entity.addChild(i), this.tabEntities.push(i)
    }
    this.tabEntities.length > 0 && this.onButtonPress(this.tabEntities[0].script.button)
}, Tabs.prototype.onButtonPress = function(t) {
    for (var i = 0; i < this.tabEntities.length; i++) this.tabEntities[i].element.opacity = 0;
    t.entity.element.opacity = 1
};
var Bar = pc.createScript("bar");
Bar.prototype.initialize = function() {
    this.app.on("Bar:" + this.entity.name, this.setBarPercentage, this), this.on("destroy", this.onDestroy, this)
}, Bar.prototype.onDestroy = function() {
    this.app.off("Bar:" + this.entity.name, this.setBarPercentage, this)
}, Bar.prototype.setBarPercentage = function(t) {
    this.entity.setLocalScale(Math.max(Math.min(t, 1), 0), 1, 1)
};
