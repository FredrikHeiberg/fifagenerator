var numTeams = 0;
var teams = [];
var objectTeams = [];
var notPlayed = [];
var playedTeams = [];
var hTeam = 0;
var aTeam = 0;
var hTeam2 = 0;
var aTeam2 = 0;
var roundCounter = 0;
var teamOneMet = [];
var boolBox = false;
var resultString2 = "";

var roundId = 0;

$(document).ready(function() {

	/* Functionality when choosing number of teams,
	 storing number of teams and show team names meny */
	$("#sub").click(function() {
		numTeams = $("#n").val();
		if (numTeams > 1) {
			//console.log(numTeams);
			$("#nTeams").hide();  
        	$('#tNames').show();
        	teamSelection(numTeams);
		}

	/* When all teams are selected, store teams 
	and go to next view*/
	$("#submit2").click(function() {
		addTeams();
		if (jQuery.inArray("", teams) < 0) {
			//console.log(teams);
			$("#tNames").hide();  
        	$('#oView').show();
        	teamObject();
        	table();
        	notPlayed = objectTeams.slice(0);
        	var matchString = match();
        	$('#match').text(matchString);
		}
		else {
			addTeams();
		}
		$("#warning").hide();
		$("#done").hide();
		$("#result2").hide();
	})

	/* When result is registered, go to next match
	checks weather all matches are played. If so, 
	show top 3 table*/
	$("#next").click(function() {
		$("#warning").hide();
		$("#done").hide();
		/*var tempPoints = 0;
		var resultString = $("#result").val().split("-");
		var scoreHome = resultString[0];
		var scoreAway = resultString[1];
		getHomeTeam();
		getAwayTeam();

		if (scoreHome > scoreAway) {
			var tempPoints = objectTeams[hTeam].points + 3;
			objectTeams[hTeam].points = tempPoints;
		}
		else if (scoreAway > scoreHome) {
			var tempPoints = objectTeams[aTeam].points + 3;
			objectTeams[aTeam].points = tempPoints;
		}
		else {
			var tempPointsH = objectTeams[hTeam].points + 1;
			var tempPointsA = objectTeams[aTeam].points + 1;
			objectTeams[hTeam].points = tempPointsH;
			objectTeams[aTeam].points = tempPointsA;
		}*/
		var resultString = $("#result").val();

		if (boolBox == true) {
			resultString2 = $("#result2").val();
		}

		if (/\d{1}\-\d{1}/.test(resultString) && /\d{1}\-\d{1}/.test(resultString2)) {
			console.log("MULTIPLE TEAMS RESULTS");
			console.log("resultString: "+resultString)
			console.log("resultString2: "+resultString2)
			result();
			result2();
			console.log(objectTeams)
			var matchString = match();
			var matchString2 = match2();
			console.log("matchString: "+matchString)
			console.log("matchString2: "+matchString2)
			$('#match').text(matchString);
			$('#match2').text(matchString2);
       		$('#result').val('');
       		$('#result2').val('');
       		$('#table').empty();
       		sortByPoints();
       		table();
		}	
		else if (/\d{1}\-\d{1}/.test(resultString) && boolBox == false) {
			console.log("SINGLE TEAMS RESULTS");
			result();
			var matchString = match();
			$('#match').text(matchString);
       		$('#result').val('');
       		$('#table').empty();
       		sortByPoints();
       		table();
		}
		else {
			$("#warning").show();
		}

		// Check if multiple matches is initialized
		//if (document.getElementById('multiple')) {
		//	boxBool = true;
		//	$("#result2").show();
		//}
		//else {
		//	$("#result2").hide();
		//}

		})

		$('#multiple').change(function(){
        	if(this.checked) {
            	$('#result2').fadeIn('slow');
            	var matchString = match2();
            	$('#match2').text(matchString);
            	boolBox = true;
            }
        	else {
            	$('#result2').fadeOut('slow');
            	boolBox = false;
			}
    	});
	})
})

// Function that puts a textfield for each team in DOM
function teamSelection(numTeams) {
	var id = 0;
	for (i = 0; i < numTeams; i++) {
		id = i;
		var idString = "<input type='text' class='form-control' id='team" + id +"' class='btn btn btn-default' placeholder='Team Name' /><br/>";
		document.getElementById('listOfTeams').innerHTML += idString;
	}
	document.getElementById('listOfTeams').innerHTML += "<br/><button type='submit' class='btn btn btn-default' id='submit2'>Submitt</button><br/><br>";
}

// Add teams to array
function addTeams() {
	for (i = 0; i < numTeams; i++) {
		teams.push($("#team"+i).val());
	}
}

/* Create team object 
[matches played, points, goals, conceeds] */
function teamObject() {
	for (i = 0; i < teams.length; i++) {
		var map = {team: teams[i], matches:0, points:0, goals:0, conceded:0, teamsMeet:[]};
		objectTeams.push(map);
	}
	//console.log(objectTeams);
	//console.log(objectTeams[0]);
}

function sortByPoints() {
	var leader;
	objectTeams.sort(function(a, b) {
		if (a.points > b.points) {
			return -1;
		} else if (a.points < b.points) {
			return 1;
		} else {
			return 0;
		}
	})
}

// Function that populates table
function table() {
	var tableLayout = "<tr><th>Position</th><th>Team</th><th>Matches</th><th>GD</th><th>Points</th></tr>";
	document.getElementById('table').innerHTML += tableLayout
	for (i = 0; i < objectTeams.length; i++) {
		var position = i+1;
		var gd = objectTeams[i].goals - objectTeams[i].conceded;
		var matches = objectTeams[i].matches;
		var teamInfo = "<tbody><tr><td>"+position+"</td><td>"+objectTeams[i].team+"</td><td>"+matches+"</td></td>"+"</td><td>"+gd+"</td><td>"+objectTeams[i].points+"</td></tr></tbody>";
		document.getElementById('table').innerHTML += teamInfo;
	}
}

/* Function that displays next match.
Checks if the round is over, if so, set playedTeams to zero*/
function match() {

	if (playedTeams.length === objectTeams.length) {
		playedTeams = [];
		notPlayed = objectTeams.slice(0); //Copy objectTeams to notPlayed
		//Check if all teams have met each other, if so, reset teamsMeet and start new round
		if (roundCounter/2 == objectTeams.length - 1) {
			roundId++;
			for (i = 0; i < objectTeams.length; i++) {
				objectTeams[i].teamsMeet = [];
				var roundString = "Round: " + roundId;
				document.getElementById('rId').innerHTML = roundString;
			}
			roundCounter = 0;
		}
	}

	getFirstTeam();
	getSecondTeam();

	var matchupList = [];

	var matchup = hTeam+" - "+aTeam;
	console.log("================");
	console.log(hTeam);
	console.log("================");
	//document.getElementById('match').innerHTML += matchup;
	//console.log(notPlayed);
	roundCounter++;

	// If multiple matches is selected
	//if (boxBool == true) {
	//	checkIfBoolBox = true;
	//	getFirstTeam();
	//	getSecondTeam();
	//	var matchup2 = hTeam2+" - "+aTeam2;
	//}
	//matchupList.push(matchup2);

	// TODO: set an alert when the desired number of rounds are played 
	if (roundId === 2) {
		var winnerString = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span> The tournament is over! the winner is ..." ;
		document.getElementById('done').innerHTML += winnerString;
		$("#done").show();
		alert("Competition is over!");
	}
	//checkIfBoolBox = false;
	//return matchup;
	return matchup;
}

// Choose the first team to play this round
function getFirstTeam() {
	if (notPlayed.length % 2 == 0) {
		//console.log("EVEN NUMBER OF TEAMS!!");
		var firstTeam = Math.floor(Math.random() * notPlayed.length);
		playedTeams.push(notPlayed[firstTeam]);
		var teamOneName = notPlayed[firstTeam].team;
		teamOneMet = notPlayed[firstTeam].teamsMeet;
		notPlayed.splice(firstTeam, 1);
		hTeam = teamOneName;
	}
	else {
		//console.log("ODD NUMBER OF TEAMS!!");
		hTeam = checkFewestPlayedGamesHomeTeam();
		//console.log(hTeam);
	}
}

/* Choose the second team to play this round.
Makes sure that two teams don't meet twice in a round*/
function getSecondTeam() {
	//console.log(notPlayed.length);
	if (playedTeams.length % 2 != 0 && notPlayed.length > 0) {
		//console.log("EVEN NUMBER OF TEAMS!!");
		var secondTeam = Math.floor(Math.random() * notPlayed.length);

		// Check if selected team have not played yet, and check that they have not met before
		if (jQuery.inArray(notPlayed[secondTeam].team, teamOneMet) < 0) {
			playedTeams.push(notPlayed[secondTeam]);
			var teamTwoName = notPlayed[secondTeam].team;
			notPlayed.splice(secondTeam, 1);
			aTeam = teamTwoName;
		}
		else {
			getSecondTeam();
		}
	}
	else {
		if (playedTeams.length == 0) {
			aTeam = checkFewestPlayedGamesHomeTeam();
		}
		else {
			aTeam = checkFewestPlayedGames();
			//console.log("ODD NUMBER OF TEAMS!!");
		}
	}
}


// Function that adds attributes to team 
function result() {
	var tempPoints = 0;
	var resultString = $("#result").val().split("-");
	console.log(resultString)
	var scoreHome = 0;
	var scoreAway = 0;
	scoreHome = resultString[0];
	scoreAway = resultString[1];
	getHomeTeam();
	getAwayTeam();
	console.log("hTEAM1: " + hTeam)

	if (scoreHome > scoreAway) {
		console.log("================");
		console.log(objectTeams[hTeam]);
		console.log("================");
		var tempPoints = objectTeams[hTeam].points + 3;
		objectTeams[hTeam].points = tempPoints;
	}
	else if (scoreAway > scoreHome) {
		var tempPoints = objectTeams[aTeam].points + 3;
		objectTeams[aTeam].points = tempPoints;
	}
	else {
		var tempPointsH = objectTeams[hTeam].points + 1;
		var tempPointsA = objectTeams[aTeam].points + 1;
		objectTeams[hTeam].points = tempPointsH;
		objectTeams[aTeam].points = tempPointsA;
	}
	// Add goals and conceds to team object
	console.log("------------ 1 -------------")
	var updateHomeGoals = parseInt(objectTeams[hTeam].goals) + parseInt(scoreHome); 
	console.log("UpdateHomeGoals: "+updateHomeGoals)
	var updateHomeConcede = parseInt(objectTeams[hTeam].conceded) + parseInt(scoreAway);
	console.log("UpdateHomeConcede: "+updateHomeConcede)
	var updateAwayGoals = parseInt(objectTeams[aTeam].goals) + parseInt(scoreAway);
	console.log("updateAwayGoals: "+updateAwayGoals)
	var updateAwayConcede = parseInt(objectTeams[aTeam].conceded) + parseInt(scoreHome);
	console.log("updateAwayConcede: "+updateAwayConcede)

	console.log("=========== 1 ============")
	console.log("Original H goals: " + objectTeams[hTeam].goals);
	objectTeams[hTeam].goals = updateHomeGoals;
	console.log("New H goals: " + objectTeams[hTeam].goals);
	console.log("Original H conceds: " + objectTeams[hTeam].conceded);
	objectTeams[hTeam].conceded = updateHomeConcede;
	console.log("New H concedes: " + objectTeams[hTeam].conceded);
	console.log("Original A goals: " + objectTeams[aTeam].goals);
	objectTeams[aTeam].goals = updateAwayGoals;
	console.log("New A goals: " + objectTeams[aTeam].goals);
	console.log("Original A concedes: " + objectTeams[aTeam].conceded);
	objectTeams[aTeam].conceded = updateAwayConcede;
	console.log("New A concedes: " + objectTeams[aTeam].conceded);
	console.log(objectTeams[hTeam])
	console.log(objectTeams[aTeam])

	console.log("============ /1 ============")

	// Add teams meet 
	objectTeams[hTeam].teamsMeet.push(objectTeams[aTeam].team);
	objectTeams[aTeam].teamsMeet.push(objectTeams[hTeam].team);

	// Add match count
	objectTeams[hTeam].matches++;
	objectTeams[aTeam].matches++;
}

// Get home team index
function getHomeTeam() {
	for (i = 0; i < objectTeams.length; i++) {
		if (objectTeams[i].team === hTeam) {
			hTeam = i;
		}
	}
}

// Get away team index
function getAwayTeam() {
	for (i = 0; i < objectTeams.length; i++) {
		if (objectTeams[i].team === aTeam) {
			aTeam = i;
		}
	}	
}

// Get the team that have played fewest matches
function checkFewestPlayedGames() {
	//console.log("TEST");
	var lowestValue = 100;
	var team;
	//console.log("Played Teams: " +playedTeams.length);
	for (i = 0; i < playedTeams.length; i++) {
		//console.log("Played Teams: " +playedTeams.length);
		//console.log("Original home Team: "+hTeam);
		if (playedTeams[i].matches < lowestValue && playedTeams[i].team != hTeam) {
			//console.log(playedTeams[i])
			team = playedTeams[i].team;
			lowestValue = objectTeams[i].matches;
		}
	}
	//console.log("AWAY TEAM "+team);
	return(team);
}

// Get the team that have played fewest matches as home team (in case of odd number of teams)
function checkFewestPlayedGamesHomeTeam() {
	var lowestValue = 100;
	var team;
	var index;
	//console.log("NOT EVEN NUMBER TEAMS H");
	//console.log(notPlayed.length);
	for (i = 0; i < notPlayed.length; i++) {
		if (notPlayed[i].matches < lowestValue) {
			//console.log("Not Played Teams: " +notPlayed.length);
			team = notPlayed[i].team;
			index = [i];
			lowestValue = objectTeams[i].matches;
		}
	}
	//console.log("TEAM: "+ team);
	//console.log("TEAM: "+ notPlayed[index].team);
	playedTeams.push(notPlayed[index]);
	notPlayed.splice(index,1);
	//console.log("HOME TEAM "+team);
	return(team);
}

/* Function that displays next match if multiple matches are selected.
Checks if the round is over, if so, set playedTeams to zero*/
function match2() {

	if (playedTeams.length === objectTeams.length) {
		playedTeams = [];
		notPlayed = objectTeams.slice(0); //Copy objectTeams to notPlayed
		//Check if all teams have met each other, if so, reset teamsMeet and start new round
		if (roundCounter/2 == objectTeams.length - 1) {
			roundId++;
			for (i = 0; i < objectTeams.length; i++) {
				objectTeams[i].teamsMeet = [];
				var roundString = "Round: " + roundId;
				document.getElementById('rId').innerHTML = roundString;
			}
			roundCounter = 0;
		}
	}

	getFirstTeam2();
	getSecondTeam2();

	var matchup2 = hTeam2+" - "+aTeam2;
	//document.getElementById('match').innerHTML += matchup;
	//console.log(notPlayed);
	roundCounter++;

	// TODO: set an alert when the desired number of rounds are played 
	if (roundId === 2) {
		var winnerString = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span> The tournament is over! the winner is ..." ;
		document.getElementById('done').innerHTML += winnerString;
		$("#done").show();
		alert("Competition is over!");
	}
	return matchup2;
}

// Choose the first team to play this round
function getFirstTeam2() {
	if (notPlayed.length % 2 == 0) {
		//console.log("EVEN NUMBER OF TEAMS!!");
		var firstTeam = Math.floor(Math.random() * notPlayed.length);
		playedTeams.push(notPlayed[firstTeam]);
		var teamOneName = notPlayed[firstTeam].team;
		teamOneMet = notPlayed[firstTeam].teamsMeet;
		notPlayed.splice(firstTeam, 1);
		hTeam2 = teamOneName;
	}
	else {
		//console.log("ODD NUMBER OF TEAMS!!");
		hTeam2 = checkFewestPlayedGamesHomeTeam();
		//console.log(hTeam);
	}
}

/* Choose the second team to play this round.
Makes sure that two teams don't meet twice in a round*/
function getSecondTeam2() {
	//console.log(notPlayed.length);
	if (playedTeams.length % 2 != 0 && notPlayed.length > 0) {
		//console.log("EVEN NUMBER OF TEAMS!!");
		var secondTeam = Math.floor(Math.random() * notPlayed.length);

		// Check if selected team have not played yet, and check that they have not met before
		if (jQuery.inArray(notPlayed[secondTeam].team, teamOneMet) < 0) {
			playedTeams.push(notPlayed[secondTeam]);
			var teamTwoName = notPlayed[secondTeam].team;
			notPlayed.splice(secondTeam, 1);
			aTeam2 = teamTwoName;
		}
		else {
			getSecondTeam();
		}
	}
	else {
		if (playedTeams.length == 0) {
			aTeam2 = checkFewestPlayedGamesHomeTeam();
		}
		else {
			aTeam2 = checkFewestPlayedGames();
			//console.log("ODD NUMBER OF TEAMS!!");
		}
	}
}

// Function that adds attributes to teams when multiple matches are selected
function result2() {
	console.log("RESULT 2")
	var tempPoints = 0;
	var resultString2 = $("#result2").val().split("-");
	var scoreHome2 = 0;
	var scoreAway2 = 0;
	scoreHome2 = resultString2[0];
	scoreAway2 = resultString2[1];
	console.log("Run hTeam2?")
	getHomeTeam2();
	console.log("Run hTeam2?")
	getAwayTeam2();
	console.log("hTEAM2: " + hTeam2)

	if (scoreHome2 > scoreAway2) {
		var tempPoints = objectTeams[hTeam2].points + 3;
		objectTeams[hTeam2].points = tempPoints;
	}
	else if (scoreAway2 > scoreHome2) {
		var tempPoints = objectTeams[aTeam2].points + 3;
		objectTeams[aTeam2].points = tempPoints;
	}
	else {
		var tempPointsH = objectTeams[hTeam2].points + 1;
		var tempPointsA = objectTeams[aTeam2].points + 1;
		objectTeams[hTeam2].points = tempPointsH;
		objectTeams[aTeam2].points = tempPointsA;
	}
	// Add goals and conceds to team object
	var updateHomeGoals = parseInt(objectTeams[hTeam2].goals) + parseInt(scoreHome2); 
	var updateHomeConcede = parseInt(objectTeams[hTeam2].conceded) + parseInt(scoreAway2);
	var updateAwayGoals = parseInt(objectTeams[aTeam2].goals) + parseInt(scoreAway2);
	var updateAwayConcede = parseInt(objectTeams[aTeam2].conceded) + parseInt(scoreHome2);
	console.log("Original H goals: " + objectTeams[hTeam2].goals);
	objectTeams[hTeam2].goals = updateHomeGoals;
	console.log("New H goals: " + objectTeams[hTeam2].goals);
	console.log("Original H conceds: " + objectTeams[hTeam2].conceded);
	objectTeams[hTeam2].conceded = updateHomeConcede;
	console.log("New H concedes: " + objectTeams[hTeam2].conceded);
	console.log("Original A goals: " + objectTeams[aTeam2].goals);
	objectTeams[aTeam2].goals = updateAwayGoals;
	console.log("New A goals: " + objectTeams[aTeam2].goals);
	console.log("Original A concedes: " + objectTeams[aTeam2].conceded);
	objectTeams[aTeam2].conceded = updateAwayConcede;
	console.log("New A concedes: " + objectTeams[aTeam2].conceded);
	console.log(objectTeams)

	// Add teams meet 
	objectTeams[hTeam2].teamsMeet.push(objectTeams[aTeam2].team);
	objectTeams[aTeam2].teamsMeet.push(objectTeams[hTeam2].team);

	// Add match count
	objectTeams[hTeam2].matches++;
	objectTeams[aTeam2].matches++;
}

// Get home team index when multiple matches are selected
function getHomeTeam2() {
	for (i = 0; i < objectTeams.length; i++) {
		if (objectTeams[i].team === hTeam2) {
			hTeam2 = i;
		}
	}
}

// Get away team index
function getAwayTeam2() {
	for (i = 0; i < objectTeams.length; i++) {
		if (objectTeams[i].team === aTeam2) {
			aTeam2 = i;
		}
	}	
}

window.onbeforeunload = function() {
  return "Data will be lost if you leave the page, are you sure?";
};

