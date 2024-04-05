function mc_show_leaderboard() {
	
	MC.Leaderboard.showAll(function(code){
		console.log(code);
	});	
	/*
	MC.Leaderboard.show(0, function(code){
		console.log(code);
	});
	*/
}