class WorldSaveData {
	constructor({
		unlocked = false,
		finished = false,
		eatenBits = 0,
		curLevel = 0,
		workerLevel = 0,
		strengthLevel = 0,
		speedLevel = 0,
		uid
	}, staticData) {
		
		this.unlocked = unlocked;
		this.finished = finished;
		this.eatenBits = eatenBits;
		this.curLevel = curLevel;
		this.workerLevel = workerLevel;
		this.strengthLevel = strengthLevel;
		this.speedLevel = speedLevel;
		this.uid = uid;
		this.staticData = staticData;
	}
	
	get lastProgress() {
		return 100 * this.eatenBits/this.staticData.levels[this.curLevel].data.fragments;
	}
	
	isMaxWorker() { return this.workerLevel >= this.staticData.maxNbWorkers }
	upgradeWorker() { !this.isMaxWorker() && this.workerLevel++ }
	
	isMaxSpeed() { return this.speedLevel >= this.staticData.maxNbSpeed	}
	upgradeSpeed() { !this.isMaxSpeed() && this.speedLevel++ }
	
	isMaxStrength() { return this.strengthLevel >= this.staticData.maxNbStrength }
	upgradeStrength() { !this.isMaxStrength() && this.strengthLevel++ }
	
	eatBit(boost = 1) {
		this.eatenBits++;
		return Math.ceil(this.staticData.moneyPerFragment * boost);
	}
	
	nextLevel() {
		this.curLevel++;
		this.eatenBits = 0;
		if (this.curLevel >= this.staticData.nbLevelsToComplete) {
			this.curLevel = 0
			this.finished = true;
			return true;
		}
		return false;
	}
	
	saveToJson() {
		return {
			unlocked: this.unlocked,
			finished: this.finished,
			eatenBits: this.eatenBits,
			curLevel: this.curLevel,
			workerLevel: this.workerLevel,
			strengthLevel: this.strengthLevel,
			speedLevel: this.speedLevel,
			uid: this.uid,
		};
	}
	
	loadFromJson(o) {
		this.unlocked = o.unlocked || this.unlocked;
		this.finished = o.finished || this.finished;
		this.eatenBits = o.eatenBits || this.eatenBits;
		this.curLevel = o.curLevel || this.curLevel;
		this.workerLevel = o.workerLevel || this.workerLevel;
		this.strengthLevel = o.strengthLevel || this.strengthLevel;
		this.speedLevel = o.speedLevel || this.speedLevel;
		this.uid = o.uid || this.uid;
	}
}

export default class SaveData {
	constructor(staticData, baseCashPool, langs) {
		this.worlds = staticData.worlds.map(x=>new WorldSaveData({worldId: x.worldId}, x));
		this.timestamp = Date.now();
		this.curWorldId = 0;
		for(let i = 0; i <= this.curWorldId; i++) this.unlockWorld(i);
		this.hasSeenTuto = false;
		this._awayTime = 0;
		this.money = baseCashPool;
		this.staticData = staticData;
		this.audio = true;
		this.freeMoneyBagHasHappened = false;
		this.language = this.detectLanguage(langs);
		this.langs = langs;
	}
	
	detectLanguage(langs) {
	  var userLangs = navigator.language || navigator.userLanguage;
	  userLangs = navigator.languages || [userLangs];
	  let compareLangs = (lang, curLang) => {
		if (curLang.toLowerCase() === lang.slice(0, curLang.length).toLowerCase()) {
		  return true;
		}
		let subLang = curLang.split("-")[0];
		return (
		  subLang.toLowerCase() === lang.slice(0, subLang.length).toLowerCase()
		);
	  };
	  for (let i = 0; i < userLangs.length; i++) {
		let curLang = userLangs[i];
		let res = langs.find(compareLangs.bind(null, curLang));
		if (res) return res;
	  }
	  return "en";
	}
	
	setLanguage(lang) {
		if (this.langs.includes(lang))
			this.language = lang
	}
	
	awayTime() {
		let a = this._awayTime;
		this._awayTime = 0;
		return a;
	}
	
	setWorld(worldId) {
		worldId = Math.min(Math.max(0, worldId), this.worlds.length - 1);
		this.curWorldId = worldId;
	}
	
	unlockWorld(worldId) {
		if (worldId !== Math.min(Math.max(0, worldId), this.worlds.length - 1)) return;
		this.worlds[worldId].unlocked = true;
	}
	
	canUnlockWorld(worldId) {
		if (worldId !== Math.min(Math.max(0, worldId), this.worlds.length - 1)) return false;
		return !this.worlds[worldId].unlocked;
	}
	
	nextLevel() {
		let curWorld = this.worlds[this.curWorldId];
		let hasWrapped = curWorld.nextLevel();
		if (hasWrapped && this.canUnlockWorld(this.curWorldId + 1)) {
			this.unlockWorld(this.curWorldId + 1);
			return true;
		}
		return false;
	}
	
	saveToJson() {
		this.timestamp = Date.now();
		return {
			worlds: this.worlds.map(x=>x.saveToJson()),
			timestamp: this.timestamp,
			curWorldId: this.curWorldId,
			money: this.money.saveToJson(),
			hasSeenTuto: this.hasSeenTuto,
			freeMoneyBagHasHappened: this.freeMoneyBagHasHappened,
			audio: this.audio,
			language: this.language,
		};
	}
	
	getLastUnlockedWorld() {
		for(let i = this.worlds.length - 1; i >= 0; i--) {
			if (this.worlds[i].unlocked) return i;
		}
		return 0;
	}
	
	loadFromJson(o) {
		this.worlds.forEach((world, i) => {
			world.loadFromJson(o.worlds[i]);
		});
		
		this._awayTime = (new Date(this.timestamp) - new Date(o.timestamp))/(1000 * 60);
		if (this._awayTime < this.staticData.globalValues.minMinutesAwayThreshold) {
			this._awayTime = 0;
		} else {
			this._awayTime = Math.max(this.staticData.globalValues.minMinutesAway, Math.min(this.staticData.globalValues.maxMinutesAway, this._awayTime));
		}
		
		
		this.curWorldId = o.curWorldId || this.curWorldId;
		if (o.hasOwnProperty("money")) this.money.loadFromJson(o.money)
		if (o.hasOwnProperty("hasSeenTuto")) this.hasSeenTuto = o.hasSeenTuto;
		if (o.hasOwnProperty("audio")) this.audio = o.audio;
		if (o.hasOwnProperty("freeMoneyBagHasHappened")) this.freeMoneyBagHasHappened = o.freeMoneyBagHasHappened;
		if (o.hasOwnProperty("language")) this.setLanguage(o.language);
	}
	
	save() {
		return JSON.stringify(this.saveToJson());
	}
	
	load(str) {
		try {
			this.loadFromJson(JSON.parse(str));
		} catch(e) {console.error("invalid save data, resetting", e, str)}
	}
}