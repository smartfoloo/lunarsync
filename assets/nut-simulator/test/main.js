let time = 0;
let nuts = 0;
let nutAmount = 1;
let combo = 1;
let maxcombo = 3;
let nutspersec = 0;
let currentImage = 0;
let level = {
	level:0,
	xp:0
};

function Story(text, required, delay){
	this.req = required;
	this.text = text;
	this.unlocked = null;
	this.letters = 0;
	this.delay = delay ? delay : 50;
}

let story = [
	//main story
	new Story("you wake up   after a long Sleep...   u are surrounded by  Nut.", "nuts >= 0"),
	new Story("at middle there sstands  a buton with nut on it....", "nuts >= 0"),
	new Story("holy cr*******p ....  u say AS A   child  climb out of  nut pile .  he offer to  Help  u collect nut... FOR a price >: )", "nuts >= 15"),
	new Story("one hunder nut,,, lots of nut being made now...", "currentImage >= 3"),
	new Story("good progress  soldier .", "nuts >= 500"),
	new Story("1000 nut .  u now  run  the local Town  nut  economy .", "currentImage >= 4"),
	new Story("THE nut  business is growing .... ", "currentImage >= 5"),
	new Story("100 thosand nuts.  your   now becomming  known as '' da nut guy '' ", "currentImage >= 6"),
	new Story("1  millien nuts.   the  nut production line is now  Set up ..  big thing `s comnig...", "currentImage >= 7"),
	new Story("u become ownner of   A village    and call it '' nut  village '' ", "currentImage >= 8"),
	new Story("nut village  is now... nut  town !  every one love you,r  nuts", "currentImage >= 9"),
	new Story("larrge  factory  for nut production are now  made ...   with 1 billien  nuts,, nothing can Stop  You !!.", "currentImage >= 10"),
	new Story("the hole  of australia  is now yours ,,  it now known as '' nutstralia'' ", "currentImage >= 11"),
	new Story("every  city in da world  is now yours ... nuts  are tacking over the world !!!", "currentImage >= 12"),
	new Story("the earth is no longer  known as ' the earth ' . it is now ' the nut '", "currentImage >= 13"),
	new Story("the  journey  to the stars  is  beginnning .. rockets fuelled  by nuts will take  us  to the  Distennt worlds...", "currentImage >= 14"),
	new Story("deep into the  galaxies  now..    we  ar e getting  close ...", "currentImage >= 15"),
	new Story("i can sense......... the  Nut,,", "currentImage >= 16"),
	new Story("we now know what is in  singularity   of black hole ,,, answer:  nut", "currentImage >= 17"),
	new Story("a nut   planet  has been found.  .. we  cannot stop here  thogh....", "currentImage >= 18"),
	new Story("this   is it........ the  nut galaxy ...", "currentImage >= 19"),
	new Story("we cannot  stop  now . it is  inevitable .... the  nut is  upon us", "currentImage >= 20"),
	new Story("we have  reached it.. nut heaven.  this is where  dreams come true .  all the nuts  u want ,,  what a paradise", "currentImage >= 21"),
	new Story("oh  no ........ we have made  too many nuts ..... welcome ...........t o  nut  hell........", "currentImage >= 22"),
	
	//nut types
	new Story("your  new homie gladly  takes your Nuts  and goes  out to colect  more . ", "nutTypes[0].bought > 0"),
	new Story("5 kids  Now are in the clan...", "nutTypes[0].bought >= 5"),
	new Story("a boy join the nut Gang... ", "nutTypes[1].bought >= 1"),
	new Story("a man   help out getting nuts .. ", "nutTypes[2].bought >= 1"),
	new Story("you start up a farm for making  Nuts ..", "nutTypes[3].bought >= 1"),
	new Story("nut factory!!  this will bring in a lot of nuts ...", "nutTypes[4].bought >= 1"),
	new Story("nuts are now the local   currency .  you start up a bank", "nutTypes[5].bought >= 1"),
	new Story("you begin a nut empire . nothing will stop  you", "nutTypes[6].bought >= 1"),
	new Story("you now control all the nuts in the world.   good  Job", "nutTypes[7].bought >= 1"),
	new Story("you now produce nuts for the whole galaxy", "nutTypes[8].bought >= 1"),
	new Story("the legendary  '' deez  Nut'' guy come and help teach you  how to  make the finest quality nuts you ,ve ever seen", "nutTypes[9].bought >= 1"),
	new Story("your  new nuts allow  you to travel back in time   ,", "nutTypes[10].bought >= 1"),
	new Story("the whole universe  now gets their nuts from you .", "nutTypes[11].bought >= 1"),
	new Story("the nut religion is now the  only religion  , with 100% of  life forms following it", "nutTypes[12].bought >= 1"),
	new Story("your nuts  have now allowed you to  defeat  death and live  in nut paradise .", "nutTypes[13].bought >= 1"),

];

function Nut(name, cost, amount){
	this.name = name;
	this.cost = cost;
	this.bought = 0;
	this.amount = amount;
	this.unlocked = false;
}

let nutTypes = [
	new Nut("nut kid", 15, 0.1),
	new Nut("nut boy", 50, 8),
	new Nut("nut man", 1000, 47),
	new Nut("nut farm", 13000, 260),
	new Nut("nut factory", 150000, 1400),
	new Nut("nut bank", 1400000, 7800),
	new Nut("nut empire", 20000000, 44000),
	new Nut("world nut control", 330000000, 260000),
	new Nut("galactic nut reign", 1500000000, 1600000),
	new Nut("deez nut guy", 75000000000, 10000000),
	new Nut("time travelling nuts", 1000000000000, 65000000),
	new Nut("universal nut domination", 40000000000000, 1),
	new Nut("nut god", 170000000000000, 430000000),
	new Nut("nut afterlife", 1000000000000000, 2900000000)
]

function updatenutcolours(){
	let inc = 360/nutTypes.length;
	nutTypes.forEach((e, i) => {
		e.colour = "hsl(" + (inc*i+1) + ", 81%, 38%)";
	});
}
updatenutcolours();

function buy(nut){
	if(nuts >= nut.cost){
		nuts -= nut.cost;
		nut.cost = Math.floor(nut.cost * Math.pow(1.1, nut.bought));
		nut.bought++;
		update();
	}
}

function totalnuthelpers(){
	let total = 0;
	for(type of nutTypes)
		total += type.bought;
	return total;
}

let started;
let clicks = 0;
let clicking = false;
let resetTimeoutHandle;
const nutSound = new Audio("nut.wav");
function clicknut(){
	//cps
	clicks++;
	if(!clicking){
		resetClicking();
		clicking = true;
	}

	clearTimeout(resetTimeoutHandle);
	resetTimeoutHandle = setTimeout(() => resetClicking(), 500);
	combo = round(1 + clicksPerSecond() / 2);
	if(combo > maxcombo)
		combo = maxcombo;

	//do thing
	let newAmount = nutAmount * combo;
	nuts += newAmount;

	document.getElementById("nutclicked").style.animationName = "";
	document.getElementById("nutclicked").innerHTML = "+" + formatnumber(newAmount);
	setTimeout(() => {
		document.getElementById("nutclicked").style.animationName = "click";
		document.getElementById("nutclicked").addEventListener("animationend", () => document.getElementById("nutclicked").style.animationName = "" );
	}, 0);

	stopAudio(nutSound);
	setTimeout(() => nutSound.play(), 0);
	addfallingnuts(newAmount);
	level.xp += Math.floor(newAmount);
	
	update();
}

function resetClicking(){
	clicking = false;
	started = new Date();
	click = 0;
	combo = 1;
}

function clicksPerSecond() {
	let diff = new Date() - started;
	if(diff < 1000)
		return 0;

	return clicks / diff * 1000;
}

function round(num){
	return Math.round(num * 100)/100;
}

function donuts(){ //hehe donuts XD
	nutspersec = 0;
	for(nut of nutTypes){
		nutspersec += nut.bought * nut.amount;
	}

	nutspersec = round(nutspersec);
	if(nutspersec <= 0) return;
	nuts += nutspersec;
	level.xp += 0.5;

	setTimeout(() => {
		document.getElementById("nutpopup").style.animationName = "fadeOut";
		document.getElementById("nutpopup").addEventListener("animationend", () => document.getElementById("nutpopup").style.animationName = "" );
	}, 0);

	update();
}

function animatestory(){
	let sorted = story.slice(0).sort((a, b) => a.unlocked - b.unlocked); //in proper order

	let first = -1;
	let amount = 0;
	for(let i=0;i<sorted.length;i++){
		let message = sorted[i];

		if(sorted[i].unlocked){
			let index = story.indexOf(message);

			if(message.letters < message.fulltext.length + 1){
				if(first == -1) first = i;
				amount++;
			} else if(!document.getElementById("story" + index)){
				elem = document.createElement("div");
				elem.id = "story" + index;
				elem.innerHTML = message.fulltext;
				document.getElementById("story").insertAdjacentElement("afterbegin", elem);
			}
		}
	}

	let fullDelay = 500;
	if(first != -1){
		let message = sorted[first];
		let index = story.indexOf(message);

		let extraDelay = 0;
		let elem = document.getElementById("story" + index);
		if(!elem){
			elem = document.createElement("div");
			elem.id = "story" + index;
			document.getElementById("story").insertAdjacentElement("afterbegin", elem);
		}

		let randomDelay = Math.floor(Math.random() * message.delay/2);
		fullDelay = message.delay + randomDelay + extraDelay;
		elem.innerHTML = message.fulltext.substr(0, message.letters);
		message.letters++;

		if(amount > 1)
			fullDelay -= amount * 15;
	}

	setTimeout(() => {
		animatestory();
	}, fullDelay);
}

function makeelem(parent, name, type, onclick){
	if(!document.getElementById(name)){
		let elem = document.createElement(type);
		elem.id = name;
		elem.className = "hidden";
		if(onclick)
			elem.onclick = onclick;
		parent.appendChild(elem);
	}
}

function update(){
	nuts = round(nuts);

	//stuff
	document.getElementById("nutAmount").innerHTML = formatnumber(nuts) + (nuts == 1 ? " nut" : " nuts");
	document.getElementById("nutpopup").innerHTML = "+" + formatnumber(nutspersec);
	if(nutspersec > 0)
		document.getElementById("nutspersec").innerHTML = "+" + formatnumber(nutspersec) + "/sec";
	if(combo > 1)
		document.getElementById("combo").innerHTML = "combo: " + combo;

	//bg
	let nutImage = Math.floor(Math.log10(nuts)) + 1;
	if(nutImage == -Infinity) nutImage = 1; //dumb
	if(nutImage > 22) nutImage = 22;

	if(currentImage < nutImage){
		smoothimage(document.getElementById("bg"), "bgs/"+ nutImage +".jpg", currentImage == 0 ? 0 : 1);
		currentImage = nutImage;
	}

	//story
	for(let i=0;i<story.length;i++){
		let message = story[i];

		if(!message.unlocked && eval(message.req)){ //ik eval is bad but its easy
			message.unlocked = Date.now();

			let time = new Date();
			time = time.toLocaleString("en-US", { hour:"numeric", minute:"numeric", hour12:true });
			message.fulltext = time + ": " + message.text;
		}
	}

	//update nut-related things
	for(nut of nutTypes){
		//unlocking
		if(!nut.unlocked && nuts >= nut.cost)
			nut.unlocked = true;

		////////////////info////////////////
		let infoName = nut.name + " info";
		makeelem(document.getElementById("nutHelpers"), infoName, "div");

		let infoElem = document.getElementById(infoName);
		if(infoElem.classList.contains("hidden") && nut.unlocked)
			infoElem.classList.remove("hidden");

		let nps = round(nut.bought * nut.amount);
		let infoText = nut.name + ": " + nut.bought + " - " + formatnumber(nps) + " n/s";
		if(infoElem.innerHTML != infoText)
			infoElem.innerHTML = infoText;

		////////////////button////////////////
		let buttonName = nut.name + " button";
		let current = nut; //fix scope issues
		makeelem(document.getElementById("nuts"), buttonName, "button", () => buy(current));

		let buttonElem = document.getElementById(buttonName);
		if(buttonElem.classList.contains("hidden") && nut.unlocked)
			buttonElem.classList.remove("hidden");

		if(!buttonElem.style.backgroundColor)
			buttonElem.style.backgroundColor = nut.colour;

		let buttonText = nut.name + "<br>" +
		"(+" + formatnumber(nut.amount) + " nuts/sec)" + "<br>" +
		"cost: " + formatnumber(nut.cost) + " nuts";
		if(buttonElem.innerHTML != buttonText)
			buttonElem.innerHTML = buttonText;
	}

	//level stuff
	let totalSections = 100;
	let requiredClicks = 20 + level.level * 2;

	//divide the width by amount to get a percent to add to the width
	let barMultiplier = totalSections / requiredClicks;

	//multiply percent by xp to get fill amount
	barAmount = barMultiplier * level.xp;

	//if the width equals the total width level up and reset
	if(barAmount >= totalSections){
		level.level++;
		barAmount = 0;
		level.xp = 0;
	}

	document.getElementById("innerlevel").style.width = barAmount + "%";
	document.getElementById("levelnum").innerHTML = "level " + level.level;
	document.getElementById("xpnum").innerHTML = level.xp + "/" + round(requiredClicks) + " xp";
}

function updatetime(){
	time++;
	document.getElementById("playtime").innerHTML = "played for " + parseS(time);
}

setInterval(function(){
	donuts();
	updatetime();
}, 1000);

let canvas = document.getElementById("nutcanvas");
let ctx = canvas.getContext("2d");
let fallingnuts = [];

function addfallingnuts(amount){
	amount = Math.floor(amount);
	if(amount > 10)
		amount = 10;

	for(let i=0;i<amount;i++){
		setTimeout(() => {
			fallingnuts.push(new fallingnut);
		}, i * 15)
	}
}

function fallingnut(){
	this.w = 50;
	this.h = 50;

	this.x = Math.random() * (canvas.width - this.w * 2);
	this.y = 0 - this.h;
	this.yvel = 1;
	this.gravity = 0.4;
}

let nutimg = new Image();
nutimg.src = "nut.png";

function animatebg(){
	canvas.width = document.getElementById("container").offsetWidth;
	canvas.height = document.getElementById("container").offsetHeight;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.5;
	for(let i=fallingnuts.length-1;i>=0;i--){
		let nut = fallingnuts[i];

		ctx.drawImage(nutimg, nut.x, nut.y, nut.w, nut.h);
		nut.yvel += nut.gravity;
		nut.y += nut.yvel;

		if(nut.y > canvas.height)
			fallingnuts.splice(i, 1);
	}

	requestAnimationFrame(animatebg);
}

function init(){
	smoothimage(document.getElementById("nut"), "nut.png", 0, [document.getElementById("container")]);
	load();
	update();
	updatetime();
	animatestory();
	animatebg();
}

/////////////////////////////////

function save(){
	let save = {
		nuts:nuts,
		time:time,
		level:level,

		nutTypes:nutTypes,
		story:story,
	};

	localStorage.setItem("save", JSON.stringify(save))
}

function checksave(current, save){
	for(let i=0;i<current.length;i++){
		Object.assign(current[i], save[i]);
	}
}

function load(){
	let save = localStorage.getItem("save");
	if(save){
		save = JSON.parse(save);
		if (typeof save.nuts !== "undefined") nuts = save.nuts;
		if (typeof save.time !== "undefined") time = save.time;
		if (typeof save.level !== "undefined") level = save.level;

		if (typeof save.nutTypes !== "undefined")
			checksave(nutTypes, save.nutTypes);

		if (typeof save.story !== "undefined")
			checksave(story, save.story);

		for(storysave of save.story)
			for(let i=0;i<story.length;i++)
				if(story[i].text == storysave.text)
					story[i] = storysave;
		update();
	}
}

let clearing = false;
function clear(){
	clearing = true;
	localStorage.removeItem("save");
	location.reload();
}

window.addEventListener("beforeunload", () => {
	if(!clearing) save();
})

/////////////////////////////////

function getemoji(s) {
	return s.match(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g)
			.map( e => "\\u" + e.charCodeAt(0).toString(16) + "\\u" + e.charCodeAt(1).toString(16))
}

const bignumbers = ["", "k", "m", "b", "t", " quadrillion", " quintillion", " sextillion", " septillion", " octillion", " nonillion", " decillion", " stopplayingthisgameillion", " please"];
function formatnumber(number){
	// what tier? (determines SI prefix)
	var tier = Math.log10(number) / 3 | 0;

	// if zero, we don't need a prefix
	if(tier == 0) return number;

	// get prefix and determine scale
	var prefix = bignumbers[tier];
	var scale = Math.pow(10, tier * 3);

	// scale the number
	var scaled = number / scale;

	// format number and add prefix as suffix
	return round(scaled) + prefix;
}

function parseS(s){
	let delim = ":";
	let hours = Math.floor(s / (60 * 60) % 60);
	let minutes = Math.floor(s / 60 % 60);
	let seconds = Math.floor(s % 60);
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return hours + delim + minutes + delim + seconds;
}

function lerp(val1,val2,time){
	return val1*(1-time)+val2*time;
}

function stopAudio(audio){
	audio.pause();
	audio.currentTime = 0;
}

function smoothimage(elem, src, start, extraelems){
	if(start == undefined)
		start = 1;
	let opacity = start;

	new Promise(resolve => {
		let interval = setInterval(function(){
			opacity -= 0.05;
			elem.style.opacity = opacity;
			if(extraelems)
				for(extra of extraelems)
					extra.style.opacity = opacity;

			if(elem.style.opacity < 0){
				clearInterval(interval);
				resolve();
			}
		}, 1000/60);
	})
	.then(() => {
		let image = new Image();
		image.src = src;
		image.onload = () => {
			console.log("loaded " + src);
			let interval = setInterval(function(){
				opacity += 0.05;
				elem.style.opacity = opacity;
				if(extraelems)
					for(extra of extraelems)
						extra.style.opacity = opacity;

				if(opacity > 1) clearInterval(interval);
			}, 1000/60);
			elem.style.backgroundImage = "url('" + image.src + "')";
		}
	})
}

/////////////////////////////////

document.addEventListener('contextmenu', e => e.preventDefault());

let keys = [];
document.addEventListener("keydown", e => {
	if(!keys[e.keyCode]){ //if it wasnt pressed last event
		if(e.key == " ")
			clicknut();
	}

	keys[e.keyCode] = true;
});

document.addEventListener("keyup", e => keys[e.keyCode] = false);
document.getElementById("nut").addEventListener("mousedown", e => {
	if(e.button == 0)
		clicknut();
})

let expandinginterval;
for(expander of document.getElementsByClassName("expander")){
	let current = expander;

	let smallsize = 40;
	let smallsizeW = 70;
	current.style.height = smallsize;
	current.style.width = smallsizeW;

	expander.addEventListener("click", e => {
		current.classList.toggle("expandshown");
		clearInterval(expandinginterval);

		let height = current.offsetHeight;
		current.style.height = "";
		let expanded = current.offsetHeight;
		current.style.height = height;

		let width = current.offsetWidth;
		current.style.width = "";
		let expandedW = current.offsetWidth;
		current.style.width = width;

		let goal = current.classList.contains("expandshown") ? expanded : smallsize;
		let goalW = current.classList.contains("expandshown") ? expandedW : smallsizeW;
		console.log(goalW);

		expandinginterval = setInterval(() => {
			current.style.height = height;
			current.style.width = width;

			height = lerp(height, goal, 0.2);
			width = lerp(width, goalW, 0.2);

			if(Math.abs(height - goal) < 0.1 && Math.abs(width - goalW) < 0.1)
				clearInterval(expandinginterval);
		}, 1000/60)
	});
}

/////////////////////////////////

init();