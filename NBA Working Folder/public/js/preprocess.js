
//Process PlayByPlay data and add seconds, quarter and scoring team
d3.json("data/PlayByPlay.json").then(playData => {
    /* console.log(playData);
    for (j = 0; j < playData.length; j++) {

        gameNumber = ('00' + j).substr(-3);

        let q = 1;
        let time = 720;
        let p = playData[+gameNumber];
        let t = 0;
        for (i=0; i < p.results.status.length; i++) {
            t = p.results.status.map(a => a[0])[i]
            t = (+t.slice(0,t.indexOf(':')) * 60) + (+t.slice(t.indexOf(':')+1,t.length));
            if (t <= time) {
                p.results.status[i].push(t);
                p.results.status[i].push(q);
                if (p.results.htm[i] == "") {
                    p.results.status[i].push('vtm')
                } else {
                    p.results.status[i].push('htm')
                }
                time = t;
            } else {
                time = 720;
                q++;
                p.results.status[i].push(t);
                p.results.status[i].push(q);
                if (p.results.htm[i] == "") {
                    p.results.status[i].push('vtm')
                } else {
                    p.results.status[i].push('htm')
                }
            }
        }

    }

    var blob = new Blob([JSON.stringify(playData)], {type : 'application/json'});
    saveAs(blob, "PlayByPlay_p.json"); */
});

//Filter events from Game to remove duplicate events and duplicate moments
gameNumber = ('00' + 434).substr(-3);
d3.json('data/0021500'+gameNumber+'_p2.json').then(gameData => {
    
    console.log(gameData)
    /* let filteredEvents = filterEvents(gameData); */

    /* var blob = new Blob([JSON.stringify(filteredEvents)], {type : 'application/json'});
    saveAs(blob, "preproccessed.json"); */
});

function filterEvents(gameData) {
    //console.log(gameData);
    let events = gameData.events.map(a => a.moments.map(b => b[5]));
    //console.log('Total number of events: ' + events.length);

    uniqueEvents = [];
    let uniqueID = [];
    uniqueID.push(1)

    let unique = true;
    for (i=1; i<events.length-1;i++) {
        unique = false;
        for (j = 0; j < Math.min(events[i].length,events[i+1].length); j++) {
            /* Here i is the event index and j is the moment we're comparing. [0] is the index of the ball and [2],[3] correspond the X,Y values */
            if (events[i][j][0][2] != events[i+1][j][0][2] && events[i][j][0][3] != events[i+1][j][0][3]) {
                /* If there is ANY x or y value that is different, we'll call it unique. Surprising how many aren't */
                unique = true;
            }
        }
        //console.log('Comparing events ' + (i+1) + ' & ' + (i+2) + ': ' + unique);
        if (unique == true) {
            uniqueID.push(i+1);
        }
    }

    uniqueID.forEach(eventID => {
        uniqueEvents.push(gameData.events[eventID]);
    });
    //console.log(uniqueEvents);
    uniqueEvents = {'gameid': gameData.gameid, 'gamedate': gameData.gamedate, 'events': uniqueEvents};
    console.log(gameData)
    console.log(gameData.events[0].visitor)

    
    let testList = [];
    let outputList = [];
    let moments = uniqueEvents.events.map(a => a.moments.map(b => b[5]))

    console.log(uniqueEvents);
    for (j = 0; j < uniqueEvents.events.length; j++) {
        console.log('Event ' + (j+1) + ' of ' + uniqueEvents.events.length)
        i = 0;
        momentList = [];
        //flat = uniqueEvents.events.map(a => a.moments.map(b => b[5])).flat();
        while(i < moments[j].length) {
            //console.log('i: ' + i + '; flat.length = ' + flat.length);
            //console.log('j = ' + j + ' i=' + i)
            t = ''+ moments[j][i][0][0] + ''+moments[j][i][0][1] + ''+moments[j][i][0][2] + ''+moments[j][i][0][3] + ''+moments[j][i][0][4]
            if (testList.indexOf(t) == -1) {
                momentList.push([uniqueEvents.events[j].moments[i][0], uniqueEvents.events[j].moments[i][2], uniqueEvents.events[j].moments[i][3], uniqueEvents.events[j].moments[i][4], moments[j][i]])
                testList.push(t)
                i++;
            } else {
                //console.log('duplicate found at i: ' + i)
                moments[j].splice(i,1);
            }
        }
        outputList.push({'eventId':j, 'moments':momentList})
    }

    console.log(outputList);
    return {'gameid': gameData.gameid, 'gamedate': gameData.gamedate, 'events': outputList, 'teams': {'home': gameData.events[0].home, 'visitor': gameData.events[0].visitor}} 
}

//Combine all PlayByPlay data into one JSON file
 d3.json("python/PlayByPlay1-28.json").then(a => {
/*    playbyplay.push(a)
    d3.json("python/PlayByPlay29-30.json").then(b => {
        playbyplay.push(b)
        d3.json("python/PlayByPlay31-72.json").then(c => {
            playbyplay.push(c)
            d3.json("python/PlayByPlay73-350.json").then(d => {
                playbyplay.push(d)
                d3.json("python/PlayByPlay351-475.json").then(e => {
                    playbyplay.push(e)
                    d3.json("python/PlayByPlay476-514.json").then(f => {
                        playbyplay.push(f)
                        d3.json("python/PlayByPlay515-663.json").then(g => {
                            playbyplay.push(g)
                            playbyplay = playbyplay.flat();
                            console.log(playbyplay);
                            var blob = new Blob([JSON.stringify(playbyplay)], {type : 'application/json'});
                            saveAs(blob, "PlayByPlay.json");
                        });
                    });
                });
            });
        });
    });*/
}); 

//Process Time Clock information to line up with play by play
gameNumber = ('00' + 434).substr(-3);
 d3.json('data/0021500'+gameNumber+'_p.json').then(gameData => {
    /*console.log(gameData);
    d3.json("data/PlayByPlay_p.json").then(playData => {
        console.log(gameData);
        p = playData[+gameNumber -1];
        k = 0;
        for (i=0; i<gameData.events.length; i++) {
                console.log(i);
                if (k >= p.results.status.length) { 
                    console.log('@i='+i+',j='+j+' and k=' + k+ '; Breaking out')
                    break;
                }
            for (j = 0; j<gameData.events[i].moments.length; j++) {
                console.log('Play at ' + p.results.status[k][2] +'. @i=' +i+',j='+j+'=> moment = ' + gameData.events[i].moments[j][1])
                if (Math.floor(gameData.events[i].moments[j][1]) == p.results.status[k][2]){
                    gameData.events[i].moments[j][3] = {'status': p.results.status[k], 'play': p.results[p.results.status[k][4]][k]};
                    console.log('    => adding')
                } else if (Math.floor(gameData.events[i].moments[j][1]) < p.results.status[k][2] && gameData.events[i].moments[j][0] == p.results.status[k][3]) {
                    k++;
                    console.log('k = ' + k);
                    if (k >= p.results.status.length) { 
                        console.log('@i='+i+',j='+j+' and k=' + k+ '; Breaking out')
                        break; 
                    } else if (p.results.status[k][2] == 0) {
                        k++;
                        if (k >= p.results.status.length) { 
                            console.log('@i='+i+',j='+j+' and k=' + k+ '; Breaking out')
                            break;
                        }
                    }
                    if (Math.floor(gameData.events[i].moments[j][1]) == p.results.status[k][2]){
                        gameData.events[i].moments[j][3] = {'status': p.results.status[k], 'play': p.results[p.results.status[k][4]][k]};
                    }
                }
            }
        }

        console.log(gameData);
        console.log(p);
         var blob = new Blob([JSON.stringify(gameData)], {type : 'application/json'});
        saveAs(blob, '0021500'+gameNumber+'_p2.json');

    }); */



});

function calculatePossession() {
	d3.json('data/0021500' + gameNumber + '_p2.json').then(gameData => {
		console.log('possesions');
		console.log(gameData);
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
				let ballPosition = ball[2] * ball[2] + ball[3] * ball[3];
				let closestDist = 10000;
				for (idx = 0; idx < curMoment[4].length; idx++) {
					if (idx == ballIdx) {
						continue;
					}
					let newDist = Math.pow(ball[2] - curMoment[4][idx][2], 2) + Math.pow(ball[3] - curMoment[4][idx][3], 2);
					if (closestDist > newDist) {
						closestDist = newDist;
						closestPerson = idx;
					}
					curMoment[4][idx].push(0);
				}
				if (closestDist < 9) {
					curMoment[4][closestPerson][5] = 1;
				}
			}
		}
		//var blob = new Blob([JSON.stringify(gameData)], { type: 'application/json' });
		//var int = 3;
		//var blob = new Blob([JSON.stringify(int)], { type: 'application/json' });
		//var name = "data/0021500" + gameNumber + "_withPossession.json";
		//var name = "0021500" + gameNumber + "_withPossession.json";
		//saveAs(blob, name);
		var num = 5;
		let players = [gameData.teams.home.players, gameData.teams.visitor.players].flat();
		let teams = [];

		teams['htm'] = gameData.teams.home;
		teams['vtm'] = gameData.teams.visitor;

		teamDisplays = "";
		//teamDisplays = new Team(teams);
		court = new Court(gameData, players, teams, teamDisplays);
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
}
calculatePossession();