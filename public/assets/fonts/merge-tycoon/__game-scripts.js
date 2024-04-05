const _0x1918 = ['top', 'indexOf', 'aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==', 'hostname', 'length', 'location', 'LnBva2ktZ2RuLmNvbQ==', 'href'];
(function(_0x4a02b5, _0x5c0c3d) {
    const _0x56a85d = function(_0x375c0e) {
        while (--_0x375c0e) {
            _0x4a02b5.push(_0x4a02b5.shift());
        }
    };
    _0x56a85d(++_0x5c0c3d);
}(_0x1918, 0x1ae));
const _0xcdc9 = function(_0x4a02b5, _0x5c0c3d) {
    _0x4a02b5 -= 0x0;
    const _0x56a85d = _0x1918[_0x4a02b5];
    return _0x56a85d;
};
(function checkInit() { 
}());
var StorageFactory = pc.createScript("storageFactory");
StorageFactory.prototype.initialize = function() {
    void 0 === this.inMemoryStorage && (this.inMemoryStorage = {})
}, StorageFactory.prototype.isSupported = function() {
    try {
        var t = "__some_random_key_you_are_not_going_to_use__";
        return localStorage.setItem(t, t), localStorage.removeItem(t), !0
    } catch (t) {
        return !1
    }
}, StorageFactory.prototype.clear = function() {
    this.isSupported() ? localStorage.clear() : this.inMemoryStorage = {}
}, StorageFactory.prototype.getItem = function(t) {
    return this.isSupported() ? localStorage.getItem(t) : void 0 !== this.inMemoryStorage && this.inMemoryStorage.hasOwnProperty(t) ? this.inMemoryStorage[t] : null
}, StorageFactory.prototype.key = function key(t) {
    return this.isSupported() ? localStorage.key(t) : Object.keys(this.inMemoryStorage)[t] || null
}, StorageFactory.prototype.removeItem = function(t) {
    this.isSupported() ? localStorage.removeItem(t) : delete this.inMemoryStorage[t]
}, StorageFactory.prototype.setItem = function(t, e) {
    this.isSupported() ? localStorage.setItem(t, e) : (void 0 === this.inMemoryStorage && (this.inMemoryStorage = {}), this.inMemoryStorage[t] = String(e))
}, StorageFactory.prototype.getLength = function() {
    return this.isSupported() ? localStorage.length : void 0 === this.inMemoryStorage ? -1 : Object.keys(this.inMemoryStorage).length
};
var SettingsHandler = pc.createScript("settingsHandler");
SettingsHandler.attributes.add("settingsBtn", {
    type: "entity"
}), SettingsHandler.attributes.add("settingScreen", {
    type: "entity"
}), SettingsHandler.attributes.add("soundBtn", {
    type: "entity"
}), SettingsHandler.attributes.add("soundTxt", {
    type: "entity"
}), SettingsHandler.attributes.add("musicBtn", {
    type: "entity"
}), SettingsHandler.attributes.add("musicTxt", {
    type: "entity"
}), SettingsHandler.attributes.add("audioListener", {
    type: "entity"
}), SettingsHandler.attributes.add("musicObjects", {
    type: "entity",
    array: !0
}), SettingsHandler.attributes.add("storageHandler", {
    type: "entity"
}), SettingsHandler.prototype.initialize = function() {
    var t = document.createElement("script");
    t.setAttribute("src", "./poki-sdk.js"), t.setAttribute("type", "text/javascript"), document.head.appendChild(t);
    var e = this;
    t.addEventListener("load", (function(t) {
        e.initializePoki()
    })), this.storageFactory = this.storageHandler.script.storageFactory
}, SettingsHandler.prototype.postInitialize = function() {
    try {
        var t = JSON.parse(this.storageFactory.getItem("settings"));
        null === t && (this.storageFactory.setItem("settings", JSON.stringify([!0, !0, !0])), t = JSON.parse(this.storageFactory.getItem("settings")))
    } catch (t) {
        console.log(t)
    }
    this.onSound(!0), this.soundBtn.element.on("click", (function() {
        this.entity.sound.play("Click"), this.onSound(!1)
    }), this), this.onMusic(!0), this.musicBtn.element.on("click", (function() {
        this.entity.sound.play("Click"), this.onMusic(!1)
    }), this), this.settingsBtn.element.on("click", (function() {
        this.entity.sound.play("Click"), this.settingScreen.enabled = !0
    }), this)
}, SettingsHandler.prototype.onSound = function(t = !1) {
    try {
        var e = JSON.parse(this.storageFactory.getItem("settings"));
        t || (e[0] = !e[0]), this.soundBtn.button.active = e[0], this.soundTxt.element.text = "Sound " + (e[0] ? "On" : "Off"), this.app.systems.sound.volume = e[0] ? 1 : 0, this.storageFactory.setItem("settings", JSON.stringify(e))
    } catch (t) {
        console.log(t)
    }
}, SettingsHandler.prototype.onMusic = function(t = !1) {
    try {
        var e = JSON.parse(this.storageFactory.getItem("settings"));
        t || (e[1] = !e[1]), this.musicBtn.button.active = e[1], this.musicTxt.element.text = "Music " + (e[1] ? "On" : "Off"), this.musicObjects.forEach((function(t) {
            t.sound.enabled = e[1]
        })), this.storageFactory.setItem("settings", JSON.stringify(e))
    } catch (t) {
        console.log(t)
    }
}, SettingsHandler.prototype.initializePoki = function() {
    this.app.systems.sound.volume = 0, PokiSDK.init().then((() => {
        console.log("Poki SDK successfully initialized"), PokiSDK.gameLoadingStart(), PokiSDK.gameLoadingFinished(), PokiSDK.commercialBreak().then((() => {
            console.log("Commercial break finished, proceeding to game"), PokiSDK.gameplayStart();
            try {
                JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
            } catch (t) {
                console.log(t)
            }
        }))
    }), this).catch((() => {
        console.log("Initialized, but the user likely has adblock"), PokiSDK.gameLoadingStart(), PokiSDK.gameLoadingFinished(), PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (t) {
            console.log(t)
        }
    }))
};
var GameHandler = pc.createScript("gameHandler");
GameHandler.attributes.add("worldData", {
    type: "asset",
    assetType: "json"
}), GameHandler.attributes.add("initialized", {
    type: "boolean",
    default: !1
}), GameHandler.attributes.add("camera", {
    type: "entity"
}), GameHandler.attributes.add("packageBtn", {
    type: "entity"
}), GameHandler.attributes.add("shopHandler", {
    type: "entity"
}), GameHandler.attributes.add("shore", {
    type: "entity",
    array: !0
}), GameHandler.attributes.add("timer", {
    type: "number",
    default: 10
}), GameHandler.attributes.add("currentTimer", {
    type: "number",
    default: 10
}), GameHandler.attributes.add("package", {
    type: "entity"
}), GameHandler.attributes.add("building", {
    type: "entity"
}), GameHandler.attributes.add("gift", {
    type: "entity"
}), GameHandler.attributes.add("giftTime", {
    type: "number"
}), GameHandler.attributes.add("giftBoxScreen", {
    type: "entity"
}), GameHandler.attributes.add("upgradeBuildingBtn", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardScreen", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardTxt", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardBtn", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardAmount", {
    type: "number",
    default: 0
}), GameHandler.attributes.add("bonusRewardHudBtn", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardHudBtnTimer", {
    type: "entity"
}), GameHandler.attributes.add("bonusRewardHudTimer", {
    type: "entity"
}), GameHandler.attributes.add("timeMachineScreen", {
    type: "entity"
}), GameHandler.attributes.add("timeMachineBtn", {
    type: "entity"
}), GameHandler.attributes.add("timeMachineHudBtn", {
    type: "entity"
}), GameHandler.attributes.add("timeMachineTxt", {
    type: "entity"
}), GameHandler.attributes.add("stopwatch", {
    type: "entity"
}), GameHandler.attributes.add("level", {
    type: "number",
    default: 1
}), GameHandler.attributes.add("maxLevel", {
    type: "number",
    default: 35
}), GameHandler.attributes.add("experience", {
    type: "number"
}), GameHandler.attributes.add("remainder", {
    type: "number"
}), GameHandler.attributes.add("experienceBar", {
    type: "entity"
}), GameHandler.attributes.add("levelTxt", {
    type: "entity"
}), GameHandler.attributes.add("levelPopUp", {
    type: "entity"
}), GameHandler.attributes.add("levelPopUpWorld", {
    type: "entity"
}), GameHandler.attributes.add("scalableBar", {
    type: "entity"
}), GameHandler.attributes.add("currencyIcon", {
    type: "asset",
    assetType: "sprite"
}), GameHandler.attributes.add("currency", {
    type: "number",
    default: 1e3
}), GameHandler.attributes.add("currencyPerSec", {
    type: "number"
}), GameHandler.attributes.add("currencyTxt", {
    type: "entity"
}), GameHandler.attributes.add("currencyPerSecTxt", {
    type: "entity"
}), GameHandler.attributes.add("currencySprite", {
    type: "entity"
}), GameHandler.attributes.add("currencyPerSecSprite", {
    type: "entity"
}), GameHandler.attributes.add("maxBuildingLevel", {
    type: "number"
}), GameHandler.attributes.add("buildingLevelDiscovered", {
    type: "number"
}), GameHandler.attributes.add("buildingDiscoveredScreen", {
    type: "entity"
}), GameHandler.attributes.add("buildingDiscoveredSprite", {
    type: "entity"
}), GameHandler.attributes.add("buildingDiscoveredTxt", {
    type: "entity"
}), GameHandler.attributes.add("welcomeBackScreen", {
    type: "entity"
}), GameHandler.attributes.add("offlineEarningsTxt", {
    type: "entity"
}), GameHandler.attributes.add("offlineEarningsDoubleTxt", {
    type: "entity"
}), GameHandler.attributes.add("doubleEarningsBtn", {
    type: "entity"
}), GameHandler.attributes.add("tutorial", {
    type: "entity",
    array: !0
}), GameHandler.attributes.add("showingAd", {
    type: "boolean",
    default: !1
}), GameHandler.attributes.add("storageHandler", {
    type: "entity"
}), GameHandler.prototype.postInitialize = function() {
    console.log(this.entity.name + " INIT"), this.initialized = !0, this.storageFactory = this.storageHandler.script.storageFactory, this.packagesSpawned = 0, this.packagesOpened = 0, this.housesMerged = 0, null !== this.app.bonusRewardTimer && void 0 !== this.app.bonusRewardTimer || (this.app.bonusRewardTimer = 3e5, this.bonusRewardHudBtnTimer.enabled = !1, this.bonusRewardHudBtn.enabled = !0), null !== this.app.timeMachineTimer && void 0 !== this.app.timeMachineTimer || (this.app.timeMachineTimer = 6e5, this.app.stopwatchStage = 0);
    try {
        this.settings = JSON.parse(this.storageFactory.getItem("settings")), this.settings[2] && (this.tutorial[0].enabled = !0)
    } catch (e) {
        console.error(e)
    }
    this.onEnable()
}, GameHandler.prototype.update = function() {
    var e = window.innerWidth / window.innerHeight,
        t = this.app.graphicsDevice.canvas;
    if (void 0 === this.app.fillMode2 && (this.app.fillMode2 = null), e < 1) {
        if (this.app.fillMode2 == pc.FILLMODE_FILL_WINDOW) return;
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW), t.style.marginTop = "", this.shore.forEach((function(e) {
            e.enabled = !1
        })), this.scalableBar.setLocalScale(1, 1, 1)
    } else {
        if (this.app.fillMode2 == pc.FILLMODE_KEEP_ASPECT) return;
        this.app.graphicsDevice.resizeCanvas(t.clientWidth, t.clientHeight), this.app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT), t.style.marginTop = Math.floor((window.innerHeight - t.clientHeight) / 2) + "px";
        var i = this;
        this.shore.forEach((function(e) {
            e.enabled = !1
        })), this.shore.forEach((function(e) {
            "World_3" === i.entity.name && "Shore_2" === e.name || "World_3" !== i.entity.name && "Shore_3" === e.name || (e.enabled = !0)
        })), this.scalableBar.setLocalScale(1.25, 1.25, 1.25)
    }
}, GameHandler.prototype.onEnable = function() {
    console.log(this.entity.name + " ENABLE");
    try {
        this.saveable = !0, this.data = this.worldData.resource, this.state = JSON.parse(this.storageFactory.getItem(this.entity.name)), console.log(this.state), null === this.state && (this.saveGameState(), this.state = JSON.parse(this.storageFactory.getItem(this.entity.name))), this.saveable = !1, this.level = this.state.level, this.maxBuildingLevel = this.data.buildings.length - 1, this.lastSpawnedBuilding = null, this.shopHandler.script.shopHandler.gameHandler = this.entity, this.shopHandler.script.shopHandler.setupShop();
        for (var e = 0; e < this.state.slots.length; e++) {
            var t = this.entity.children[e];
            switch (t.enabled = !0, this.state.slots[e].type) {
                case "empty":
                    break;
                case "package":
                    this.spawnPackage(this.state.slots[e].level, t);
                    break;
                case "building":
                    this.spawnBuilding(this.state.slots[e].level, t);
                    break;
                case "gift":
                    this.spawnGift(t)
            }
            this.state.slots[e].level > this.buildingLevelDiscovered && (this.buildingLevelDiscovered = this.state.slots[e].level)
        }
        this.pickedEntity = null, this.hoveredSlot = null, this.lastTouch = new pc.Vec2(0, 0), null !== this.app.touch && (this.app.touch.on(pc.EVENT_TOUCHSTART, (function(e) {
            this.onMouseDown(this.getTouch(e), !0)
        }), this), this.app.touch.on(pc.EVENT_TOUCHEND, (function(e) {
            this.onMouseUp(this.lastTouch, !0)
        }), this)), this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.packageBtn.element.on("click", (function() {
            this.getSlots().length > 0 ? this.shopHandler.sound.play("Package_Click") : this.shopHandler.sound.play("Unclickable"), this.onPackageClick()
        }), this), this.on("attr:currentTimer", this.onCurrentTimer, this), this.on("attr:level", this.onLevel, this), this.on("attr:experience", this.onExperience, this), this.on("attr:currency", this.onCurrency, this), this.on("attr:currencyPerSec", (function(e, t) {
            this.currencyPerSecTxt.element.text = this.abbreviateNumber(e)
        })), this.on("attr:buildingLevelDiscovered", this.onBuildingDiscovered, this), this.upgradeBuildingBtn.element.on("click", this.onUpgradeBuilding, this), this.doubleEarningsBtn.element.on("click", this.onEarningsDouble, this), this.bonusRewardBtn.element.on("click", this.onBonusReward, this), this.bonusRewardHudBtn.element.on("click", (function() {
            this.bonusRewardScreen.enabled = !0, this.triggerCommercialBreak()
        }), this), this.timeMachineHudBtn.element.on("click", (function() {
            this.timeMachineScreen.enabled = !0, this.triggerCommercialBreak()
        }), this), this.timeMachineBtn.element.on("click", this.onTimeMachine, this), this.level = this.state.level, this.experience = this.state.experience, this.currency = this.state.currency, this.buildingMaxLevel = this.data.buildings.length - 1, this.giftTime = this.state.giftTime;
        var i = 1e4 * this.level,
            a = 2e4 * this.level;
        this.bonusRewardAmount = Math.floor(Math.random() * (a - i) + i), this.bonusRewardTxt.element.text = this.abbreviateNumber(this.bonusRewardAmount), this.calculateCurrencyPerSec(), this.currencySprite.element.sprite = this.currencyIcon.resource, this.currencyPerSecSprite.element.sprite = this.currencyIcon.resource, Date.now() - this.state.time > 6e4 && (this.earnings = Math.round((Date.now() - this.state.time) / 1e3 * this.currencyPerSec / 10), 0 !== this.earnings && (this.currency += this.earnings, this.offlineEarningsTxt.element.text = "You earned: " + this.abbreviateNumber(this.earnings) + "\nWatch an ad to double it to:", this.offlineEarningsDoubleTxt.element.text = this.abbreviateNumber(2 * this.earnings), this.welcomeBackScreen.enabled = !0));
        var n = this;
        n.onPackageClick(), this.packageInterval = setInterval((function() {
            n.onPackageClick()
        }), 1e3), this.bonusRewardInterval = setInterval((function() {
            if (n.app.bonusRewardTimer += 1e3, n.app.bonusRewardTimer < 3e5) {
                var e = (3e5 - n.app.bonusRewardTimer) / 1e3,
                    t = parseInt(e / 60);
                e %= 60, n.bonusRewardHudTimer.element.text = Math.round(t) + ":" + (Math.round(e) < 10 ? "0" + Math.round(e) : Math.round(e)), n.bonusRewardHudBtnTimer.enabled = !0, n.bonusRewardHudBtn.enabled = !1
            }
            if (n.app.bonusRewardTimer >= 3e5 && !n.bonusRewardHudBtn.enabled) {
                n.bonusRewardHudBtnTimer.enabled = !1, n.bonusRewardHudBtn.enabled = !0;
                var i = 1e4 * n.level,
                    a = 2e4 * n.level;
                n.bonusRewardAmount = Math.floor(Math.random() * (a - i) + i), n.bonusRewardTxt.element.text = n.abbreviateNumber(n.bonusRewardAmount)
            }
        }), 1e3), this.timeMachineInterval = setInterval((function() {
            if (n.app.timeMachineTimer += 1e3, n.app.timeMachineTimer < 6e5) {
                var e = (6e5 - n.app.timeMachineTimer) / 1e3,
                    t = parseInt(e / 60);
                e %= 60, n.timeMachineBtn.button.active = !1, n.timeMachineTxt.element.text = Math.round(t) + ":" + (Math.round(e) < 10 ? "0" + Math.round(e) : Math.round(e))
            }
            n.app.timeMachineTimer >= 6e5 && !n.timeMachineBtn.button.active && (n.timeMachineBtn.button.active = !0, n.timeMachineTxt.element.text = "Watch Ad")
        }), 1e3), this.scaleCamera(), this.saveable = !0
    } catch (e) {
        console.error(e)
    }
}, GameHandler.prototype.onDisable = function() {
    console.log(this.entity.name + " DISABLE"), this.saveable = !1, this.showingAd = !1, clearInterval(this.packageInterval), clearInterval(this.bonusRewardInterval), clearInterval(this.timeMachineInterval), null !== this.app.touch && (this.app.touch.off(pc.EVENT_TOUCHSTART), this.app.touch.off(pc.EVENT_TOUCHEND)), this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.packageBtn.element.off("click"), this.off("attr:currentTimer", this.onCurrentTimer, this), this.off("attr:level", this.onLevel, this), this.off("attr:experience", this.onExperience, this), this.off("attr:currency", this.onCurrency, this), this.off("attr:currencyPerSec", (function(e, t) {
        this.currencyPerSecTxt.element.text = this.abbreviateNumber(e)
    })), this.off("attr:buildingLevelDiscovered", this.onBuildingDiscovered, this), this.upgradeBuildingBtn.element.off("click"), this.doubleEarningsBtn.element.off("click"), this.bonusRewardBtn.element.off("click"), this.bonusRewardHudBtn.element.off("click"), this.timeMachineHudBtn.element.off("click"), this.timeMachineBtn.element.off("click");
    for (var e = 0; e < this.entity.children.length; e++) {
        var t = this.entity.children[e];
        t.enabled && (t.script.has("slotHandler") && (t.script.slotHandler.building && (t.script.slotHandler.building.script.has("buildingHandler") ? t.script.slotHandler.building.script.buildingHandler.destroy() : (t.script.slotHandler.building.script.has("packageHandler") || t.script.slotHandler.building.script.has("giftHandler")) && (t.script.slotHandler.building.destroy(), t.script.slotHandler.building = null)), e > 5 && (t.enabled = !1)))
    }
    this.entity.enabled = !1
}, GameHandler.prototype.saveGameState = function() {
    try {
        if (!this.saveable) return;
        var e = [],
            t = class {
                constructor(e, t) {
                    this.type = e, this.level = t
                }
            },
            i = this.shopHandler.script.shopHandler.getPrices();
        this.entity.children.forEach((function(i) {
            i.enabled && i.script.has("slotHandler") && (null !== i.script.slotHandler.building ? i.script.slotHandler.building.script.has("buildingHandler") ? e.push(new t("building", i.script.slotHandler.building.script.buildingHandler.level)) : i.script.slotHandler.building.script.has("packageHandler") ? e.push(new t("package", i.script.slotHandler.building.script.packageHandler.level)) : i.script.slotHandler.building.script.has("giftHandler") && e.push(new t("gift", 0)) : e.push(new t("empty", 0)))
        }));
        var a = new class {
            constructor(e, t, i, a, n, s, r) {
                this.level = e, this.experience = t, this.currency = i, this.slots = a, this.prices = n, this.time = s, this.giftTime = r
            }
        }(this.level, this.experience, this.currency, e, i, Date.now(), this.giftTime);
        try {
            this.storageFactory.setItem(this.entity.name, JSON.stringify(a))
        } catch (e) {
            console.error(e)
        }
    } catch (e) {
        console.log(e)
    }
}, GameHandler.prototype.onMouseMove = function(e) {
    if (this.pickedEntity) {
        var t = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.nearClip),
            i = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.farClip);
        this.pickedEntity.setPosition(t.x, t.y, 1);
        var a = this.app.systems.rigidbody.raycastFirst(t, i);
        if (a) {
            if (!a.entity.script.has("slotHandler")) return;
            a.entity != this.hoveredSlot && (this.hoveredSlot && (this.hoveredSlot.script.slotHandler.shadow.enabled = !1), this.hoveredSlot = a.entity, this.hoveredSlot.script.slotHandler.shadow.enabled = !0)
        }
    }
}, GameHandler.prototype.onMouseDown = function(e, t = !1) {
    var i = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.nearClip),
        a = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.farClip),
        n = this.app.systems.rigidbody.raycastFirst(i, a);
    if (n && n.entity.script) {
        if (!n.entity.script.has("slotHandler")) return;
        var s = n.entity.script.slotHandler.building;
        s && (s.script.has("buildingHandler") ? s.script.movementHandler.isMoving || (this.pickedEntity = s, this.pickedEntity.sprite.drawOrder = 3, this.setHints(!0, this.pickedEntity), t ? this.app.touch.on(pc.EVENT_TOUCHMOVE, (function(e) {
            this.onMouseMove(this.getTouch(e))
        }), this) : this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)) : s.script.has("packageHandler") ? (s.script.packageHandler.openPackage(), this.shopHandler.sound.play("Package_Click"), this.settings[2] && (this.packagesOpened++, 2 == this.packagesOpened && (this.tutorial[1].enabled = !1, this.tutorial[2].enabled = !0))) : s.script.has("giftHandler") && s.script.giftHandler.openGift())
    }
}, GameHandler.prototype.onMouseUp = function(e) {
    if (this.pickedEntity) {
        var t = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.nearClip),
            i = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.farClip),
            a = this.app.systems.rigidbody.raycastFirst(t, i);
        if (a) {
            if (a.entity.script.has("slotHandler"))
                if (a.entity.script.slotHandler.building && a.entity != this.pickedEntity.script.buildingHandler.slot) {
                    var n = a.entity,
                        s = n.script.slotHandler.building,
                        r = this.pickedEntity.script.buildingHandler.slot,
                        l = this.pickedEntity;
                    r != n && (s.script.has("buildingHandler") && l.script.buildingHandler.level == s.script.buildingHandler.level && l.script.buildingHandler.level < this.buildingMaxLevel ? (s.script.buildingHandler.level++, l.script.buildingHandler.destroy(), r.script.slotHandler.building = null, this.experience += s.script.buildingHandler.level, s.script.buildingHandler.level > this.buildingLevelDiscovered && (this.buildingLevelDiscovered = s.script.buildingHandler.level), this.shopHandler.sound.play("Merge"), this.settings[2] && (this.housesMerged++, 1 == this.housesMerged && (this.tutorial[2].enabled = !1, this.tutorial[3].enabled = !0))) : (l.script.buildingHandler.slot = n, r.script.slotHandler.building = s, s.script.has("buildingHandler") ? s.script.buildingHandler.slot = r : s.script.has("packageHandler") ? s.script.packageHandler.slot = r : s.script.has("giftHandler") && (s.script.giftHandler.slot = r), n.script.slotHandler.building = l))
                } else this.pickedEntity.script.buildingHandler.slot.script.slotHandler.building = null, this.pickedEntity.script.buildingHandler.slot = a.entity, a.entity.script.slotHandler.building = this.pickedEntity;
            this.setHints(!1, this.pickedEntity), this.hoveredSlot && (this.hoveredSlot.script.slotHandler.shadow.enabled = !1), this.pickedEntity.sprite && (this.pickedEntity.sprite.drawOrder = 2), this.pickedEntity = null, this.hoveredSlot = null, this.packageBtn.script.barHandler.toggle(this.getSlots().length > 0), null !== this.app.touch && this.app.touch.off(pc.EVENT_TOUCHMOVE), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
        } else this.setHints(!1, this.pickedEntity), this.hoveredSlot && (this.hoveredSlot.script.slotHandler.shadow.enabled = !1), this.pickedEntity.sprite.drawOrder = 2, this.pickedEntity.script.movementHandler.moveToSlot(this.pickedEntity.getPosition(), this.pickedEntity.script.buildingHandler.slot.getPosition()), this.pickedEntity = null, this.hoveredSlot = null, this.packageBtn.script.barHandler.toggle(this.getSlots().length > 0), null !== this.app.touch && this.app.touch.off(pc.EVENT_TOUCHMOVE), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
    }
}, GameHandler.prototype.getTouch = function(e) {
    return this.lastTouch = new pc.Vec2(e.touches[0].x, e.touches[0].y), this.lastTouch
}, GameHandler.prototype.onPackageClick = function() {
    0 !== this.getSlots().length && this.currentTimer--
}, GameHandler.prototype.onCurrentTimer = function(e, t) {
    if (!this.showingAd) {
        if (e <= 0) Math.floor(Math.random() * Math.floor(100)) <= 4 && !this.settings[2] ? this.spawnGift() : this.spawnPackage(), this.currentTimer = this.timer;
        this.packageBtn.script.barHandler.changeValues(this.currentTimer, this.timer)
    }
}, GameHandler.prototype.spawnPackage = function(e = 0, t = null) {
    if (!t) {
        var i = this.getSlots();
        t = i[Math.floor(Math.random() * i.length)]
    }
    var a = this.package.clone();
    this.entity.addChild(a), a.enabled = !0;
    var n = this;
    setTimeout((function() {
        a.script.movementHandler.timeToMove = .2, a.setPosition((new pc.Vec3).add2(t.getPosition(), new pc.Vec3(0, 10, 0))), a.script.packageHandler.level = e, a.script.packageHandler.slot = t, t.script.slotHandler.building = a, n.packageBtn.script.barHandler.toggle(n.getSlots().length > 0), n.settings[2] && (n.packagesSpawned++, 2 == n.packagesSpawned && (n.tutorial[0].enabled = !1, n.tutorial[1].enabled = !0))
    }), 5)
}, GameHandler.prototype.spawnBuilding = function(e, t) {
    var i = this.building.clone();
    this.entity.addChild(i), i.enabled = !0, i.setPosition(t.getPosition()), i.script.buildingHandler.level = e, i.script.buildingHandler.slot = t, t.script.slotHandler.building = i, this.lastSpawnedBuilding = i, this.packageBtn.script.barHandler.toggle(this.getSlots().length > 0)
}, GameHandler.prototype.spawnGift = function(e = null) {
    if (!e) {
        var t = this.getSlots();
        if (1 == t.length) return;
        e = t[Math.floor(Math.random() * t.length)]
    }
    var i = this.gift.clone();
    this.entity.addChild(i), i.enabled = !0;
    var a = this;
    setTimeout((function() {
        i.script.movementHandler.timeToMove = .2, i.setPosition((new pc.Vec3).add2(e.getPosition(), new pc.Vec3(0, 10, 0))), i.script.giftHandler.slot = e, e.script.slotHandler.building = i, a.packageBtn.script.barHandler.toggle(a.getSlots().length > 0)
    }), 5)
}, GameHandler.prototype.getSlots = function() {
    var e = [];
    return this.entity.children.forEach((function(t) {
        t.enabled && t.script.has("slotHandler") && (t.script.slotHandler.building || e.push(t))
    })), this.calculateCurrencyPerSec(), this.shopHandler.script.shopHandler.updateShop(), this.saveGameState(), e
}, GameHandler.prototype.triggerCommercialBreak = function() {
    this.showingAd || (this.showingAd = !0, PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.commercialBreak().then((() => {
        console.log("Commercial break finished, proceeding to game"), this.showingAd = !1, PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (e) {
            console.error(e)
        }
    }), this))
}, GameHandler.prototype.setHints = function(e, t) {
    e && t.script.buildingHandler.level == this.maxBuildingLevel || this.entity.children.forEach((function(i) {
        if (i.enabled && i.script.has("slotHandler"))
            if (e) {
                if (!i.script.slotHandler.building) return;
                if (!i.script.slotHandler.building.script.has("buildingHandler")) return;
                if (i.script.slotHandler.building == t) return;
                i.script.slotHandler.building.script.buildingHandler.level == t.script.buildingHandler.level && (i.script.slotHandler.hint.enabled = !0)
            } else i.script.slotHandler.hint.enabled = !1
    }))
}, GameHandler.prototype.calculateCurrencyPerSec = function() {
    var e = 0;
    this.entity.children.forEach((function(t) {
        t.enabled && t.script.has("buildingHandler") && (e += Math.pow(2, t.script.buildingHandler.level + 1))
    })), this.currencyPerSec = Math.round(e / 3)
}, GameHandler.prototype.onExperience = function(e, t) {
    this.experienceBar.script.barHandler.changeValues(e, this.remainder), e >= this.remainder && (this.experience = e - this.remainder, this.level = pc.math.clamp(this.level + 1, 1, this.maxLevel))
}, GameHandler.prototype.onLevel = function(e, t) {
    var i = this;
    this.entity.children.forEach((function(t) {
        t.name == "Slot_" + (e + 5) && (t.enabled = !0, i.scaleCamera())
    })), this.remainder = e < 6 ? 6 * (e + 1) * (e + 1) - 6 * (e + 1) : e < 7 ? 5 * (e + 1) * (e + 1) - 5 * (e + 1) : e < 8 ? 4 * (e + 1) * (e + 1) - 4 * (e + 1) : e < 9 ? 3 * (e + 1) * (e + 1) - 3 * (e + 1) : e < 10 ? 2 * (e + 1) * (e + 1) - 2 * (e + 1) : (e + 1) * (e + 1) - (e + 1), this.levelTxt.element.text = e, this.experienceBar.script.barHandler.changeValues(this.experience, this.remainder), e != t && (6 == e ? this.levelPopUpWorld.enabled = !0 : this.levelPopUp.enabled = !0, PokiSDK.happyTime(pc.math.clamp(this.level / 10), 0, 1)), this.shopHandler.script.worldHandler.updateWorlds()
}, GameHandler.prototype.onCurrency = function(e, t) {
    this.currencyTxt.element.text = this.abbreviateNumber(e)
}, GameHandler.prototype.onBuildingDiscovered = function(e, t) {
    if (this.settings[2]) {
        try {
            this.settings = JSON.parse(this.storageFactory.getItem("settings"))
        } catch (e) {
            console.error(e)
        }
        if (this.settings[2]) return
    }
    PokiSDK.happyTime(pc.math.clamp(e / 10), 0, 1), this.buildingDiscoveredScreen.enabled = !0, this.buildingDiscoveredTxt.element.text = this.data.buildings[e].name, this.buildingDiscoveredSprite.element.sprite = this.building.sprite.sprite, this.buildingDiscoveredSprite.element.spriteFrame = e
}, GameHandler.prototype.onUpgradeBuilding = function() {
    this.showingAd || (this.showingAd = !0, PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((e => {
        e && this.lastSpawnedBuilding.script.buildingHandler.level++, this.showingAd = !1, PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (e) {
            console.error(e)
        }
        this.giftBoxScreen.enabled = !1
    })))
}, GameHandler.prototype.onEarningsDouble = function() {
    this.showingAd || (this.showingAd = !0, PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((e => {
        e && (this.currency += this.earnings), this.showingAd = !1, PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (e) {
            console.error(e)
        }
        this.welcomeBackScreen.enabled = !1
    }), this))
}, GameHandler.prototype.onBonusReward = function() {
    this.showingAd || (this.showingAd = !0, PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((e => {
        e && (this.app.bonusRewardTimer = 0, this.currency += this.bonusRewardAmount), this.showingAd = !1, PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (e) {
            console.error(e)
        }
        this.bonusRewardScreen.enabled = !1
    }), this))
}, GameHandler.prototype.onTimeMachine = function() {
    this.showingAd || this.app.timeMachineTimer < 6e5 || (this.showingAd = !0, PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((e => {
        e && (this.app.stopwatchStage++, this.timeMachineBtn.button.active = !1, this.app.timeMachineTimer = 0, this.app.stopwatchStage >= 3 && (this.currency += Math.round(3600 * this.currencyPerSec), this.timeMachineScreen.enabled = !1, this.app.stopwatchStage = 0), this.stopwatch.element.spriteFrame = this.app.stopwatchStage), this.showingAd = !1, PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (e) {
            console.error(e)
        }
    }), this))
}, GameHandler.prototype.scaleCamera = function() {
    var e = [];
    this.entity.children.forEach((function(t) {
        t.enabled && t.script.has("slotHandler") && e.push(t)
    }));
    var t = 0,
        i = 0,
        a = 0,
        n = 0;
    e.forEach((function(e) {
        var s = e.getPosition();
        s.x < t && (t = s.x - 1.2), s.x > i && (i = s.x + 1.2), s.y < a && (a = s.y - 1.2), s.y > n && (n = s.y + 1.2)
    }));
    var s = new pc.Vec3(i, n / 2, 0),
        r = new pc.Vec3(t, a / 2, 0),
        l = s.distance(r),
        o = new pc.Vec3(i, 0, 0),
        d = new pc.Vec3(t, 0, 0),
        h = new pc.Vec3(0, n, 0),
        c = new pc.Vec3(0, a, 0),
        p = o.distance(d),
        u = h.distance(c);
    this.camera.camera.orthoHeight = l, this.camera.setPosition(t + p / 2, -.6 + (a + u / 2), 5)
}, GameHandler.prototype.abbreviateNumber = function(e, t = 2) {
    t = Math.pow(10, t);
    for (var i = ["k", "m", "b", "t"], a = i.length - 1; a >= 0; a--) {
        var n = Math.pow(10, 3 * (a + 1));
        if (n <= e) {
            1e3 == (e = Math.round(e * t / n) / t) && a < i.length - 1 && (e = 1, a++), e += i[a];
            break
        }
    }
    return e
};
var SlotHandler = pc.createScript("slotHandler");
SlotHandler.attributes.add("building", {
    type: "entity"
}), SlotHandler.attributes.add("hint", {
    type: "entity"
}), SlotHandler.attributes.add("shadow", {
    type: "entity"
}), SlotHandler.prototype.initialize = function() {};
var BuildingHandler = pc.createScript("buildingHandler");
BuildingHandler.attributes.add("slot", {
    type: "entity"
}), BuildingHandler.attributes.add("level", {
    type: "number"
}), BuildingHandler.attributes.add("rays", {
    type: "entity"
}), BuildingHandler.attributes.add("canvas", {
    type: "entity"
}), BuildingHandler.attributes.add("currencyTxt", {
    type: "entity"
}), BuildingHandler.attributes.add("currencySprite", {
    type: "entity"
}), BuildingHandler.prototype.initialize = function() {
    this.deltaTime = .016, this.entity.sprite.frame = this.level, this.currencySprite.element.sprite = this.entity.parent.script.gameHandler.currencyIcon.resource, this.on("attr:slot", (function(t, e) {
        t.script.slotHandler.building = this.entity, this.entity.script.movementHandler.moveToSlot(this.entity.getPosition(), this.slot.getPosition())
    })), this.on("attr:level", (function(t, e) {
        this.entity.sprite.frame = t, .016 != this.deltaTime && (this.raysLoop(0), this.sizeLoop(0))
    }));
    var t = this;
    this.currencyTimeout = setTimeout((function() {
        t.currencyInterval = setInterval((function() {
            t.entity.parent.script.gameHandler.currency += Math.pow(2, t.level + 1), t.currencyTxt.element.text = t.abbreviateNumber(Math.pow(2, t.level + 1)), t.currencyLoop(0, new pc.Vec3(0, .5, 0), new pc.Vec3(0, 1.5, 0))
        }), 3e3)
    }), Math.floor(Math.random() * Math.floor(3e3)))
}, BuildingHandler.prototype.update = function(t) {
    this.deltaTime = t, this.rays && this.rays.rotate(0, 0, -360 * t)
}, BuildingHandler.prototype.destroy = function() {
    this.destroyed = !0, clearInterval(this.currencyInterval), clearTimeout(this.currencyTimeout), this.slot.script.slotHandler.building = null, this.entity.destroy()
}, BuildingHandler.prototype.currencyLoop = function(t, e, i) {
    if (!this.destroyed && t < 1) {
        t += this.deltaTime / 1, this.canvas.setLocalPosition((new pc.Vec3).lerp(e, i, t)), this.currencyTxt.element.opacity = pc.math.lerp(1.5, 0, t), this.currencySprite.element.opacity = pc.math.lerp(1.5, 0, t);
        var n = this;
        setTimeout((function() {
            n.currencyLoop(t, e, i)
        }), 1e3 * this.deltaTime)
    }
}, BuildingHandler.prototype.raysLoop = function(t) {
    if (!this.destroyed && t < 1) {
        t += this.deltaTime / 1, this.rays.sprite.opacity = pc.math.lerp(1.5, 0, t);
        var e = this;
        setTimeout((function() {
            e.raysLoop(t)
        }), 1e3 * this.deltaTime)
    }
}, BuildingHandler.prototype.sizeLoop = function(t, e = 0) {
    if (!this.destroyed)
        if (t < 1) {
            var i = new pc.Vec3(.7, .7, .7),
                n = (new pc.Vec3).mul2(i, new pc.Vec3(1.3, 1.3, 1.3));
            t += this.deltaTime / .1, 0 === e ? this.entity.setLocalScale((new pc.Vec3).lerp(i, n, t)) : this.entity.setLocalScale((new pc.Vec3).lerp(n, i, t));
            var r = this;
            setTimeout((function() {
                r.sizeLoop(t, e)
            }), 1e3 * this.deltaTime)
        } else if (0 === e) {
        r = this;
        setTimeout((function() {
            r.sizeLoop(0, 1)
        }), 1e3 * this.deltaTime)
    }
}, BuildingHandler.prototype.abbreviateNumber = function(t, e = 2) {
    e = Math.pow(10, e);
    for (var i = ["k", "m", "b", "t"], n = i.length - 1; n >= 0; n--) {
        var r = Math.pow(10, 3 * (n + 1));
        if (r <= t) {
            1e3 == (t = Math.round(t * e / r) / e) && n < i.length - 1 && (t = 1, n++), t += i[n];
            break
        }
    }
    return t
};
var PackageHandler = pc.createScript("packageHandler");
PackageHandler.attributes.add("level", {
    type: "number"
}), PackageHandler.attributes.add("slot", {
    type: "entity"
}), PackageHandler.attributes.add("building", {
    type: "entity"
}), PackageHandler.prototype.initialize = function() {
    this.on("attr:slot", (function(t, e) {
        this.entity.script.movementHandler.moveToSlot(this.entity.getPosition(), this.slot.getPosition())
    })), this.on("attr:level", (function(t, e) {
        this.entity.sprite.frame = t
    })), this.entity.sprite.frame = this.level
}, PackageHandler.prototype.openPackage = function() {
    var t = this.building.clone();
    this.entity.parent.addChild(t), t.enabled = !0, t.setPosition(this.slot.getPosition()), t.script.buildingHandler.level = this.level, t.script.buildingHandler.slot = this.slot, this.slot.script.slotHandler.building = t, setTimeout((function() {
        t.script.buildingHandler.raysLoop(0), t.script.buildingHandler.sizeLoop(0)
    }), 5), this.entity.parent.script.gameHandler.experience += this.level, this.entity.destroy()
};
var MovementHandler = pc.createScript("movementHandler");
MovementHandler.attributes.add("timeToMove", {
    type: "number",
    default: .1
}), MovementHandler.attributes.add("isMoving", {
    type: "boolean"
}), MovementHandler.prototype.update = function(e) {
    this.deltaTime = e
}, MovementHandler.prototype.moveToSlot = function(e, t) {
    this.movementLoop(0, e, t)
}, MovementHandler.prototype.movementLoop = function(e, t, o) {
    if (this.isMoving = !0, e < 1) {
        e += this.deltaTime / this.timeToMove, this.entity.setPosition((new pc.Vec3).lerp(t, o, e));
        var i = this;
        setTimeout((function() {
            i.movementLoop(e, t, o)
        }), 1e3 * this.deltaTime)
    } else this.entity.setPosition(o), this.timeToMove = .1, this.isMoving = !1
};
var BarHandler = pc.createScript("barHandler");
BarHandler.attributes.add("fill", {
    type: "entity"
}), BarHandler.attributes.add("fillDirection", {
    type: "boolean",
    enum: [{
        Horizontal: !0
    }, {
        Vertical: !1
    }]
}), BarHandler.attributes.add("fillSpeed", {
    type: "number",
    default: .1
}), BarHandler.attributes.add("inverted", {
    type: "boolean"
}), BarHandler.attributes.add("text", {
    type: "entity"
}), BarHandler.attributes.add("textFormat", {
    type: "string"
}), BarHandler.attributes.add("button", {
    type: "entity"
}), BarHandler.attributes.add("activeObjects", {
    type: "entity",
    array: !0
}), BarHandler.attributes.add("inactiveObjects", {
    type: "entity",
    array: !0
}), BarHandler.prototype.initialize = function() {
    this.minValue || (this.minValue = 0), this.maxValue || (this.maxValue = 1), this.defaultFill = !0 === this.fillDirection ? this.fill.element.width : this.fill.element.height
}, BarHandler.prototype.update = function(t) {
    !0 === this.fillDirection ? this.fill.element.width = pc.math.lerp(this.fill.element.width, this.defaultFill * ((this.inverted ? this.maxValue - this.minValue : this.minValue) / this.maxValue), this.fillSpeed) : !1 === this.fillDirection && (this.fill.element.height = pc.math.lerp(this.fill.element.height, this.defaultFill * ((this.inverted ? this.maxValue - this.minValue : this.minValue) / this.maxValue), this.fillSpeed))
}, BarHandler.prototype.changeValues = function(t, e) {
    this.minValue = t, this.maxValue = e;
    var i = this.textFormat.replace("<1>", t).replace("<2>", e).replace("<3>", Math.round(t / e * 100));
    this.text.element.text = i
}, BarHandler.prototype.toggle = function(t) {
    this.button && (this.entity.button.active = t), this.activeObjects.forEach((function(e) {
        e.enabled = t
    })), this.inactiveObjects.forEach((function(e) {
        e.enabled = !t
    }))
};
var PanelHandler = pc.createScript("panelHandler");
PanelHandler.attributes.add("continueBtn", {
    type: "entity"
}), PanelHandler.attributes.add("scroll", {
    type: "entity"
}), PanelHandler.attributes.add("content", {
    type: "entity"
}), PanelHandler.prototype.postInitialize = function() {
    this.soundHandler = pc.app.root.findByName("GameHandler").sound, this.continueBtn.element.on("click", (function() {
        this.entity.enabled = !1, this.soundHandler.play("Click")
    }), this), this.scroll && this.content.element.on("mousewheel", (function(e) {
        var t = this.scroll.scrollview.scroll;
        this.scroll.scrollview._onSetScroll(t.x, t.y + .1 * e.wheelDelta, !1)
    }), this)
};
var ShopRowHandler = pc.createScript("shopRowHandler");
ShopRowHandler.attributes.add("shopHandler", {
    type: "entity"
}), ShopRowHandler.attributes.add("level", {
    type: "number"
}), ShopRowHandler.attributes.add("price", {
    type: "number"
}), ShopRowHandler.attributes.add("buildingSprite", {
    type: "entity"
}), ShopRowHandler.attributes.add("buildingTxt", {
    type: "entity"
}), ShopRowHandler.attributes.add("buyBtn", {
    type: "entity"
}), ShopRowHandler.attributes.add("buyBtnTxt", {
    type: "entity"
}), ShopRowHandler.attributes.add("buyBtnSprite", {
    type: "entity"
}), ShopRowHandler.attributes.add("activeObjects", {
    type: "entity",
    array: !0
}), ShopRowHandler.attributes.add("insufficientObjects", {
    type: "entity",
    array: !0
}), ShopRowHandler.attributes.add("lockedObjects", {
    type: "entity",
    array: !0
}), ShopRowHandler.attributes.add("adBtn", {
    type: "entity"
}), ShopRowHandler.prototype.initialize = function() {
    this.buyBtn.element.on("click", this.onBuy, this), this.adBtn.element.on("click", this.onAd, this), this.on("attr:price", (function(t, e) {
        this.buyBtnTxt.element.text = this.abbreviateNumber(t), this.shopHandler.script.shopHandler.gameHandler.script.gameHandler.saveGameState()
    }), this)
}, ShopRowHandler.prototype.onBuy = function() {
    this.buyBtn.button.active ? this.shopHandler.script.shopHandler.buy(this.level, this.price) && (this.price = Math.floor(1.2 * this.price)) : this.shopHandler.sound.play("Unclickable")
}, ShopRowHandler.prototype.onAd = function() {
    this.shopHandler.script.shopHandler.onAd(this.level, this.price) && (this.adBtn.enabled = !1)
}, ShopRowHandler.prototype.destroy = function() {
    this.buyBtn.element.off("click", this.onBuy, this), this.off("attr:price", (function(t, e) {
        buyBtnTxt.element.text = this.abbreviateNumber(t)
    }), this), this.entity.destroy()
}, ShopRowHandler.prototype.setup = function(t, e, i, n, a) {
    this.buildingSprite.element.sprite = t, this.level = i, this.buildingSprite.element.spriteFrame = i, this.buildingTxt.element.text = e, this.buyBtnSprite.element.sprite = n, this.buyBtnTxt.element.text = this.abbreviateNumber(a), this.price = a
}, ShopRowHandler.prototype.toggle = function(t) {
    switch (this.activeObjects.forEach((function(t) {
        t.enabled = !1
    })), this.insufficientObjects.forEach((function(t) {
        t.enabled = !1
    })), this.lockedObjects.forEach((function(t) {
        t.enabled = !1
    })), t) {
        case "active":
            this.buyBtn.button.active = !0, this.activeObjects.forEach((function(t) {
                t.enabled = !0
            }));
            break;
        case "insufficient":
            this.buyBtn.button.active = !1, this.insufficientObjects.forEach((function(t) {
                t.enabled = !0
            }));
            break;
        case "locked":
            this.buyBtn.button.active = !1, this.lockedObjects.forEach((function(t) {
                t.enabled = !0
            }))
    }
}, ShopRowHandler.prototype.abbreviateNumber = function(t, e = 2) {
    e = Math.pow(10, e);
    for (var i = ["k", "m", "b", "t"], n = i.length - 1; n >= 0; n--) {
        var a = Math.pow(10, 3 * (n + 1));
        if (a <= t) {
            1e3 == (t = Math.round(t * e / a) / e) && n < i.length - 1 && (t = 1, n++), t += i[n];
            break
        }
    }
    return t
};
var ShopHandler = pc.createScript("shopHandler");
ShopHandler.attributes.add("gameHandler", {
    type: "entity"
}), ShopHandler.attributes.add("shopContent", {
    type: "entity"
}), ShopHandler.attributes.add("shopRow", {
    type: "entity"
}), ShopHandler.attributes.add("shopScreen", {
    type: "entity"
}), ShopHandler.attributes.add("shopBtn", {
    type: "entity"
}), ShopHandler.attributes.add("slotsPopUp", {
    type: "entity"
}), ShopHandler.attributes.add("freeGiftBtn", {
    type: "entity"
}), ShopHandler.attributes.add("giftActive", {
    type: "entity",
    array: !0
}), ShopHandler.attributes.add("giftInactive", {
    type: "entity",
    array: !0
}), ShopHandler.attributes.add("tutorial", {
    type: "entity"
}), ShopHandler.attributes.add("priceDiscount", {
    type: "number"
}), ShopHandler.attributes.add("storageHandler", {
    type: "entity"
}), ShopHandler.attributes.add("clearData", {
    type: "boolean",
    title: "Clear Data",
    default: !1
}), ShopHandler.prototype.initialize = function() {
    this.rows = [], this.storageFactory = this.storageHandler.script.storageFactory, this.clearData && this.storageFactory.clear(), this.shopBtn.element.on("click", (function() {
        this.shopScreen.enabled = !0, this.entity.sound.play("Click");
        try {
            var t = JSON.parse(this.storageFactory.getItem("settings"));
            t[2] && (this.tutorial.enabled = !1, t[2] = !1, this.storageFactory.setItem("settings", JSON.stringify(t)))
        } catch (t) {
            console.log(t)
        }
        this.gameHandler.script.gameHandler.triggerCommercialBreak()
    }), this), this.freeGiftBtn.element.on("click", this.onGift, this)
}, ShopHandler.prototype.buy = function(t, e) {
    var a = this.gameHandler.script.gameHandler;
    return e > a.currency ? (this.updateShop(), this.entity.sound.play("Unclickable"), !1) : a.getSlots().length > 0 ? (a.currency -= e, a.spawnPackage(t), this.updateShop(), this.entity.sound.play("Click"), !0) : (this.slotsPopUp.enabled = !0, this.entity.sound.play("Unclickable"), !1)
}, ShopHandler.prototype.onAd = function(t, e) {
    var a = this.gameHandler.script.gameHandler;
    if (!a.showingAd) return a.showingAd = !0, a.getSlots().length > 0 ? (PokiSDK.gameplayStop(), this.app.systems.sound.volume = 0, PokiSDK.rewardedBreak().then((i => {
        i && (a.currency -= e * this.priceDiscount, a.spawnPackage(t), this.updateShop()), PokiSDK.gameplayStart();
        try {
            JSON.parse(this.storageFactory.getItem("settings"))[0] && (this.app.systems.sound.volume = 1)
        } catch (t) {
            console.log(t)
        }
        a.showingAd = !1
    }), this), this.updateShop(), this.entity.sound.play("Click"), !0) : (this.slotsPopUp.enabled = !0, this.entity.sound.play("Unclickable"), !1)
}, ShopHandler.prototype.setupShop = function() {
    0 !== this.rows.length && this.clearShop();
    for (var t = this.gameHandler.script.gameHandler, e = 1; e < t.data.buildings.length; e++) {
        var a = t.data.buildings[e],
            i = this.shopRow.clone();
        this.shopContent.addChild(i), i.enabled = !0, i.script.shopRowHandler.setup(t.building.sprite.sprite, a.name, e, t.currencyIcon.resource, e > t.state.prices.length - 1 ? a.price : t.state.prices[e - 1]), e > t.level ? i.script.shopRowHandler.toggle("locked") : a.price > t.currency ? i.script.shopRowHandler.toggle("insufficient") : i.script.shopRowHandler.toggle("active"), this.rows.push(i)
    }
    this.shopContent.element.height = this.rows.length * (this.shopContent.layoutgroup.spacing.y + this.shopRow.element.height)
}, ShopHandler.prototype.updateShop = function() {
    var t = this.gameHandler.script.gameHandler;
    if (!t.showingAd) {
        this.rows.forEach((function(e) {
            if (e.script.shopRowHandler.level > t.level ? e.script.shopRowHandler.toggle("locked") : e.script.shopRowHandler.price > t.currency ? e.script.shopRowHandler.toggle("insufficient") : e.script.shopRowHandler.toggle("active"), e.script.shopRowHandler.adBtn.enabled = !1, e.script.shopRowHandler.level == t.level) {
                var a = Math.floor(10 * Math.random());
                t.currency >= e.script.shopRowHandler.price * this.priceDiscount && t.currency < e.script.shopRowHandler.price && a >= 3 && (e.script.shopRowHandler.adBtn.enabled = !0)
            }
        }), this);
        var e = Date.now() - t.giftTime;
        if (e > 72e5) this.freeGiftBtn.button.active = !0, this.giftActive.forEach((function(t) {
            t.enabled = !0
        })), this.giftInactive.forEach((function(t) {
            t.enabled = !1
        }));
        else {
            e = 72e5 - e, this.freeGiftBtn.button.active = !1, this.giftInactive.forEach((function(t) {
                t.enabled = !0
            })), this.giftActive.forEach((function(t) {
                t.enabled = !1
            }));
            var a = e / 1e3,
                i = parseInt(a / 3600);
            a %= 3600;
            var n = parseInt(a / 60);
            a %= 60, this.giftInactive[0].element.text = Math.round(i) + ":" + (Math.round(n) < 10 ? "0" + Math.round(n) : Math.round(n)) + ":" + (Math.round(a) < 10 ? "0" + Math.round(a) : Math.round(a))
        }
    }
}, ShopHandler.prototype.clearShop = function() {
    this.rows.forEach((function(t) {
        t.script.shopRowHandler.destroy()
    })), this.rows = []
}, ShopHandler.prototype.getPrices = function() {
    var t = [];
    return this.rows.forEach((function(e) {
        t.push(e.script.shopRowHandler.price)
    })), t
}, ShopHandler.prototype.onGift = function() {
    var t = this.gameHandler.script.gameHandler;
    Date.now() - t.giftTime > 72e5 ? t.getSlots().length > 0 ? (t.giftTime = Date.now(), t.spawnGift(), this.updateShop(), this.entity.sound.play("Click")) : (this.slotsPopUp.enabled = !0, this.entity.sound.play("Unclickable")) : this.entity.sound.play("Unclickable")
};
var RaysHandler = pc.createScript("raysHandler");
RaysHandler.prototype.update = function(a) {
    this.entity.rotateLocal(0, 0, -180 * a)
};
var WorldHandler = pc.createScript("worldHandler");
WorldHandler.attributes.add("currentWorld", {
    type: "number",
    default: 0
}), WorldHandler.attributes.add("buttons", {
    type: "entity",
    array: !0
}), WorldHandler.attributes.add("worlds", {
    type: "entity",
    array: !0
}), WorldHandler.attributes.add("shore", {
    type: "entity",
    array: !0
}), WorldHandler.attributes.add("camera", {
    type: "entity"
}), WorldHandler.attributes.add("icyOceanColor", {
    type: "rgb"
}), WorldHandler.attributes.add("normalOceanColor", {
    type: "rgb"
}), WorldHandler.attributes.add("sunnyOceanColor", {
    type: "rgb"
}), WorldHandler.attributes.add("storageHandler", {
    type: "entity"
}), WorldHandler.prototype.initialize = function() {
    this.storageFactory = this.storageHandler.script.storageFactory;
    try {
        var t = JSON.parse(this.storageFactory.getItem("unlockedWorlds"));
        null === t && (this.storageFactory.setItem("unlockedWorlds", JSON.stringify([!0, !1, !1])), t = JSON.parse(this.storageFactory.getItem("unlockedWorlds")))
    } catch (t) {
        console.log(t)
    }
    this.buttons[0].element.on("click", (function() {
        this.buttons[0].button.active ? (this.currentWorld = 0, this.camera.camera.clearColor = this.normalOceanColor) : this.entity.sound.play("Unclickable")
    }), this), this.buttons[1].element.on("click", (function() {
        this.buttons[1].button.active ? (this.currentWorld = 1, this.camera.camera.clearColor = this.sunnyOceanColor) : this.entity.sound.play("Unclickable")
    }), this), this.buttons[3].element.on("click", (function() {
        this.buttons[3].button.active ? (this.currentWorld = 2, this.camera.camera.clearColor = this.icyOceanColor) : this.entity.sound.play("Unclickable")
    }), this), this.buttons[2].element.on("click", (function() {
        this.currentWorld = 1
    }), this), this.buttons[4].element.on("click", (function() {
        this.currentWorld = 2
    }), this), this.on("attr:currentWorld", this.onWorld, this), this.updateWorlds()
}, WorldHandler.prototype.updateWorlds = function() {
    try {
        var t = JSON.parse(this.storageFactory.getItem("unlockedWorlds"));
        this.buttons[0].button.active = t[0], this.buttons[1].button.active = t[1], this.buttons[3].button.active = t[2]
    } catch (t) {
        console.log(t)
    }
}, WorldHandler.prototype.onWorld = function(t, e) {
    if (t != e) {
        if (this.worlds[e].script.gameHandler.onDisable(), this.worlds[t].script.gameHandler.initialized) this.worlds[t].enabled = !0, this.worlds[t].script.gameHandler.onEnable();
        else {
            this.worlds[t].enabled = !0;
            try {
                var r = JSON.parse(this.storageFactory.getItem("unlockedWorlds"));
                r[t] = !0, this.storageFactory.setItem("unlockedWorlds", JSON.stringify(r))
            } catch (t) {
                console.log(t)
            }
            this.updateWorlds()
        }
        this.shore.forEach((function(e) {
            e.element.spriteFrame = t
        })), 2 == t ? (this.shore[1].enabled = !1, this.shore[2].enabled = !0, this.shore[2].element.spriteFrame = 3, this.camera.camera.clearColor = this.icyOceanColor) : this.camera.camera.clearColor = this.normalOceanColor, this.entity.sound.play("Click"), this.worlds[t].script.gameHandler.triggerCommercialBreak()
    } else this.entity.sound.play("Unclickable")
};
var GiftHandler = pc.createScript("giftHandler");
GiftHandler.attributes.add("giftBoxScreen", {
    type: "entity"
}), GiftHandler.attributes.add("giftBoxSprite", {
    type: "entity"
}), GiftHandler.attributes.add("giftBoxTxt", {
    type: "entity"
}), GiftHandler.attributes.add("slot", {
    type: "entity"
}), GiftHandler.attributes.add("building", {
    type: "entity"
}), GiftHandler.prototype.initialize = function() {
    this.on("attr:slot", (function(t, i) {
        this.entity.script.movementHandler.moveToSlot(this.entity.getPosition(), this.slot.getPosition())
    }))
}, GiftHandler.prototype.openGift = function() {
    var t = this.entity.parent.script.gameHandler,
        i = Math.floor(Math.random() * Math.floor(t.buildingLevelDiscovered));
    this.giftBoxScreen.enabled = !0, this.giftBoxSprite.element.sprite = this.building.sprite.sprite, this.giftBoxSprite.element.spriteFrame = i, this.giftBoxTxt.element.text = t.data.buildings[i].name;
    var e = this.building.clone();
    this.entity.parent.addChild(e), e.enabled = !0, e.setPosition(this.slot.getPosition()), e.script.buildingHandler.level = i, e.script.buildingHandler.slot = this.slot, this.slot.script.slotHandler.building = e, this.entity.parent.script.gameHandler.lastSpawnedBuilding = e, this.entity.destroy()
};
var AchievementRowHandler = pc.createScript("achievementRowHandler");
AchievementRowHandler.attributes.add("achievementHandler", {
    type: "entity"
}), AchievementRowHandler.attributes.add("id", {
    type: "number"
}), AchievementRowHandler.attributes.add("price", {
    type: "number"
}), AchievementRowHandler.attributes.add("achievementName", {
    type: "entity"
}), AchievementRowHandler.attributes.add("achievementDescription", {
    type: "entity"
}), AchievementRowHandler.attributes.add("rewardBtn", {
    type: "entity"
}), AchievementRowHandler.attributes.add("rewardBtnTxt", {
    type: "entity"
}), AchievementRowHandler.attributes.add("rewardBtnSprite", {
    type: "entity"
}), AchievementRowHandler.attributes.add("medal", {
    type: "entity"
}), AchievementRowHandler.attributes.add("stars", {
    type: "entity"
}), AchievementRowHandler.attributes.add("barHandler", {
    type: "entity"
}), AchievementRowHandler.prototype.initialize = function() {}, AchievementRowHandler.prototype.update = function(e) {};
var AchievementHandler = pc.createScript("achievementHandler");
AchievementHandler.prototype.initialize = function() {}, AchievementHandler.prototype.update = function(e) {};