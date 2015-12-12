var numTeams = 0;
var teams = [];
var objectTeams = [];
var notPlayed = [];
var playedTeams = [];
var hTeam = 0;
var aTeam = 0;

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
	})

	/* When result is registered, go to next match
	checks weather all matches are played. If so, 
	show top 3 table*/
	$("#next").click(function() {
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
		if (/\d{1}\-\d{1}/.test(resultString)) {
			result();
			var matchString = match();
       		$('#match').text(matchString);
       		$('#result').val('');
       		$('#table').empty();
       		sortByPoints();
       		table();
       		console.log("test");
		}	
	})

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
	var tableLayout = "<tr><th>Position</th><th>Team</th><th>GD</th><th>Points</th></tr>";
	document.getElementById('table').innerHTML += tableLayout
	for (i = 0; i < objectTeams.length; i++) {
		var position = i+1;
		var gd = objectTeams[i].goals - objectTeams[i].conceded;
		var teamInfo = "<tbody><tr><td>"+position+"</td><td>"+objectTeams[i].team+"</td><td>"+gd+"</td><td>"+objectTeams[i].points+"</td></tr></tbody>";
		document.getElementById('table').innerHTML += teamInfo;
	}
}

/* Function that displays next match.
Checks if the round is over, if so, set playedTeams to zero*/
function match() {
	if (playedTeams.length === objectTeams.length) {
		notPlayed = objectTeams.slice(0);
	}
	else {
		hTeam = getFirstTeam();
		aTeam = getSecondTeam(hTeam);

		var matchup = hTeam+" - "+aTeam;
		//document.getElementById('match').innerHTML += matchup;
		return matchup;
	}
}

// Choose the first team to play this round
function getFirstTeam() {
	var firstTeam = Math.floor(Math.random() * notPlayed.length);
	playedTeams.push(notPlayed[firstTeam]);
	var teamOneName = notPlayed[firstTeam].team;
	notPlayed.splice(firstTeam, 1);
	return teamOneName;
}

/* Choose the second team to play this round.
Makes sure that two teams don't meet twice in a round*/
function getSecondTeam(t1) {
	var secondTeam = Math.floor(Math.random() * notPlayed.length);
	console.log(secondTeam);
	if (jQuery.inArray(notPlayed[secondTeam].team, t1.team) < 0) {
		playedTeams.push(notPlayed[secondTeam]);
		var teamTwoName = notPlayed[secondTeam].team;
		notPlayed.splice(secondTeam, 1);
		return teamTwoName;
	}
	else {
		getSecondTeam(t1);
	}
}

// Function that adds attributes to team 
function result() {
	var tempPoints = 0;
	var resultString = $("#result").val().split("-");
	var scoreHome = 0;
	var scoreAway = 0;
	scoreHome = resultString[0];
	scoreAway = resultString[1];
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
	}
	var updateHomeGoals = parseInt(objectTeams[hTeam].goals) + parseInt(scoreHome); 
	var updateHomeConcede = parseInt(objectTeams[hTeam].goals) + parseInt(scoreAway);
	var updateAwayGoals = parseInt(objectTeams[aTeam].goals) + parseInt(scoreAway);
	var updateAwayConcede = parseInt(objectTeams[aTeam].conceded) + parseInt(scoreHome);
	objectTeams[hTeam].goals = updateHomeGoals;
	objectTeams[hTeam].conceded = updateHomeConcede;
	objectTeams[aTeam].goals = updateAwayGoals;
	objectTeams[aTeam].conceded = updateAwayConcede;
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

