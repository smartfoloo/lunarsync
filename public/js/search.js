function startTime() {
  var today = new Date();
  var hours = today.getHours();
  // Convert to 12-hour clock
  hours = hours % 12 || 12;  // 0 becomes 12
  var minutes = today.getMinutes();
  // Add leading zero for single-digit minutes
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var time = hours + ":" + minutes;
  document.getElementById("time-text").innerHTML = time;
  setTimeout(startTime, 1000);
}
startTime();