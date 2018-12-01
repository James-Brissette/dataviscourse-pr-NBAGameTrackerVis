
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
    
    //console.log(gameData)
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

d3.json('data/teams.json').then(gameData => {
    /* let teams_p = gameData.league.standard.map(a => [a.fullName, a.isNBAFranchise, a.teamId, a.tricode]);
    teams_p = teams_p.filter(team => team[1] == true)

    let blob = new Blob([JSON.stringify(teams_p,null,4)], {type : 'application/json'});
    saveAs(blob, "teams_p.json"); */
});

d3.json('data/players.json').then(gameData => {
    let players = gameData.league.standard.map(a => [a.firstName, a.lastName, a.personId, a.teamId.slice(0,a.teamId.indexOf(' '))])

    /* let blob = new Blob([JSON.stringify(players)], {type : 'application/json'});
    saveAs(blob, "players_p.json"); */
});


gameNumber = ('00' + 434).substr(-3);
d3.json('data/0021500'+gameNumber+'_p2_possession.json').then(gameData => {
    d3.json('data/'+gameNumber+'_playbyplay.json').then(scoreData => {
        console.log(scoreData);
        k = 0;
        score = [0,0];
        for (i=0; i<gameData.events.length; i++) {
            
            //console.log(gameData.events[i]);
            for (j=0; j<gameData.events[i].moments.length; j++) {
                //console.log('Comparing ' + Math.floor(gameData.events[i].moments[j][1]) + ' and ' + scoreData.results.status[k][2])
                if (k >= scoreData.results.status.length) { break; }
                if (gameData.events[i].moments[j][0] == scoreData.results.status[k][3] &&
                    Math.floor(gameData.events[i].moments[j][1]) <= scoreData.results.status[k][2]) {
                        idx = scoreData.results.status[k][1].indexOf(':');
                        score = [+scoreData.results.status[k][1].slice(0,idx), +scoreData.results.status[k][1].slice(idx+1)];
                        console.log(idx)
                        console.log('i=' + i + '; j=' + j)
                        console.log('Match in Q'+ scoreData.results.status[k][3] + ' @ time=' + scoreData.results.status[k][2] +'. Score: ' + scoreData.results.status[k][1])
                        k++;
                        if (scoreData.results.status[k][2] == 0) { k++ }
                    }
                
                gameData.events[i].moments[j][3] = score;

            }


        }

        let blob = new Blob([JSON.stringify(gameData)], {type : 'application/json'});
        //saveAs(blob, '0021500' +gameNumber+'_p3-wscores.json');

    });
});








