
let court;
let teamDisplays; 

gameNumber = ('00' + 434).substr(-3);
d3.json('data/434playbyplay.json').then(playByPlayData => {
	console.log(playByPlayData);
	let playbyplay = playByPlayData.resultSets[0].rowSet;

	d3.json('data/0021500' + gameNumber + '_p2.json').then(gameData => {
		//Begin Possession Proprecessing
		console.log('possesions');
		console.log(gameData);
		let curTeam = 1610612744;
		for (event = 0; event < gameData.events.length; event++) {
			for (moment = 0; moment < gameData.events[event].moments.length; moment++) {
				let curMoment = gameData.events[event].moments[moment];
				if (curMoment[4].length < 3) { console.log('weird length'); continue; }
				let ball = curMoment[4][0];
				let ballIdx = 0;
				for (idx = 0; idx < curMoment[4].length; idx++) {
					if (curMoment[4][idx][0] === -1) {
						ball = curMoment[4][idx];
						ballIdx = idx;
					}
				}
				//console.log(ballIdx);
				let closestPerson = 1;
				let secondClosestPerson = 1;
				let ballPosition = ball[2] * ball[2] + ball[3] * ball[3];
				let closestDist = 10000;
				let secondClosestDist = 10000;
				for (idx = 0; idx < curMoment[4].length; idx++) {
					if (idx == ballIdx) {
						continue;
					}
					let newDist = Math.pow(ball[2] - curMoment[4][idx][2], 2) + Math.pow(ball[3] - curMoment[4][idx][3], 2);
					if (closestDist > newDist && newDist < 9) {
						secondClosestPerson = closestPerson;
						secondClosestDist = closestDist;
						closestDist = newDist;
						closestPerson = idx;
					}
					curMoment[4][idx].push(0);
				}
				if (closestDist < 9) {
					if (secondClosestDist < 9) {
						if (curMoment[4][closestPerson][0] == curTeam) {
							curMoment[4][closestPerson][5] = 1;
						}
						else if (curMoment[4][secondClosestPerson][0] == curTeam) {
							curMoment[4][secondClosestPerson][5] = 1;
						}
					}
					else {
						if (closestDist < 6) {
							curMoment[4][closestPerson][5] = 1;
							curTeam = curMoment[4][closestPerson][0];
						}
					}
				}
			}
		}
		//End Possession Preprocessing
		console.log(gameData);

		let players = [gameData.teams.home.players, gameData.teams.visitor.players].flat();
		let teams = [];

		teams['htm'] = gameData.teams.home;
		teams['vtm'] = gameData.teams.visitor;
		teams.htm.players.forEach(player => {
			player['active'] = false;
		})
		teams.vtm.players.forEach(player => {
			player['active'] = false;
		})

		let s;
		let t;
		d3.json('data/434_boxscoreplayertrack.json').then(chartData => {
			let playerStats = ['PASS', 'AST']

			//for (i = 0; i < playerStats.length; i++) {
			//	playerStatCol = chartData.resultSets[0].headers.indexOf(playerStats[i]);
			//	teamStatCol = chartData.resultSets[1].headers.indexOf(playerStats[i]);
			//	yMax = Math.max(...chartData.resultSets[1].rowSet.map(a => a[teamStatCol]).flat());
			//	stat = chartData.resultSets[0].rowSet.map(a => [a[2], a[4], a[5], a[playerStatCol]])
			//	new StackedBarChart(stat, teams, 'chart' + (i + 1), playerStatCol, yMax);
			//}
		});
		
		teamDisplays = new Player(teams);
		let playerDisplays = new PlayerDisplay(players);
		court = new Court(gameData, players, teams, teamDisplays, playbyplay, playerDisplays);
		court.drawPlayers();
		let draw = true;
		let pause = true;
		let timer = d3.timer((elapsed) => {
			timerCallback(elapsed)
		});


		//Simple Pause by clicking on the court
		d3.select('.court').on('click', function () {
			if (pause) {
				timer.stop()
			} else {
				timer.restart(elapsed => timerCallback(elapsed))
			}
			pause = !pause;
		});

		function timerCallback(elapsed) {
			let t = Math.min(100, elapsed / 1000);
			if (draw) court.update();
			draw = !draw;
			if (t == 100) timer.stop();
		}
	});
});


/*================================================ Example I found on the internet of d3.timer
    const duration = 50;
    const ease = d3.easeCubic;

    timer = d3.timer((elapsed) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points.forEach(point => {
        point.x = point.sx * (1 - t) + point.tx * t;
        point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    draw();

    // if this animation is over
    if (t === 1) {
        // stop this timer since we are done animating.
        timer.stop();
    }
    }); 
    ==================================================*/