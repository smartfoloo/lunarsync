var canvas = document.querySelector('#openfl-content canvas');
var ratio = canvas.width / canvas.height;

var originalWidth = canvas.width;
var originalHeight = canvas.height;
var newWidth;
var newHeight;

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("click", resizeCanvas);



function resizeCanvas(){
	canvas.style.removeProperty("width"); canvas.style.removeProperty("height");
	console.log(ratio);
	if(1 == 2){
		console.log("not greater than original");
		newWidth = originalWidth;
	}
	else{
		newWidth = window.innerWidth;
	} 
	
	if(Math.floor(newWidth / ratio) > window.innerHeight){
		newHeight = window.innerHeight;
		newWidth = Math.floor(newHeight * ratio);
	}
	else {
		newHeight = Math.floor(newWidth / ratio);
	}
	canvas.style.width = newWidth + "px";
	canvas.style.height = newHeight + "px";
}
resizeCanvas();