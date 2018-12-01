
let court;
let teamDisplays; 
let playerCard;

gameNumber = ('00' + 434).substr(-3);
d3.json('data/0021500'+gameNumber+'_poss_wscores.json').then(gameData => {

    let players = [gameData.teams.home.players, gameData.teams.visitor.players].flat();
    let teams = [];
    
    teams['htm'] = gameData.teams.home;
    teams['vtm'] = gameData.teams.visitor;
    
    teams.htm.players.forEach(player => {
        player['active'] = false;
        player['team'] = teams.htm.name;
        player['abbreviation'] = teams.htm.abbreviation;
    })
    teams.vtm.players.forEach(player => {
        player['active'] = false;
        player['team'] = teams.vtm.name;
        player['abbreviation'] = teams.vtm.abbreviation;
    })

    let s;
    let t;
	playerCard = new PlayerCard();
	let forceGraph;
	d3.json('data/links.json').then(linkData => {
		forceGraph = new ForceGraph(linkData, players);
	});

	d3.json('data/434_boxscoreplayertrack.json').then(chartData => {
        let playerStats = [['PASS','PASSES'],['AST','ASSISTS']]

        for (i=0; i < playerStats.length; i++) {
            playerStatCol = chartData.resultSets[0].headers.indexOf(playerStats[i][0]);
            teamStatCol = chartData.resultSets[1].headers.indexOf(playerStats[i][0]);
            yMax = Math.max(...chartData.resultSets[1].rowSet.map(a => a[teamStatCol]).flat());
            stat = chartData.resultSets[0].rowSet.map(a => [a[2],a[4],a[5],a[playerStatCol]])
            stat = [stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.htm.abbreviation}),
                    stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.vtm.abbreviation})];
        
            new StackedBarChart(stat,teams,'chart'+(i+1),playerStatCol,yMax,playerStats[i],playerCard);
        }
    });

    d3.json('data/434_boxscoretraditional.json').then(chartData => {
        let playerStats = [[],[],['PTS','POINTS SCORED'],
                           ['FGA','FIELD GOAL ATTEMPTS'],['DREB','DEFENSIVE REBOUNDS'],['OREB','OFFENSIVE REBOUNDS'],
                           ['PF','PERSONAL FOULS'],['MIN','MINUTES PLAYED']]

        for (i=2; i < playerStats.length-1; i++) {
            playerStatCol = chartData.resultSets[0].headers.indexOf(playerStats[i][0]);
            teamStatCol = chartData.resultSets[1].headers.indexOf(playerStats[i][0]);
            yMax = Math.max(...chartData.resultSets[1].rowSet.map(a => a[teamStatCol]).flat());
            stat = chartData.resultSets[0].rowSet.map(a => [a[2],a[4],a[5],a[playerStatCol]])
            stat = [stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.htm.abbreviation}),
                    stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.vtm.abbreviation})];
            
            new StackedBarChart(stat,teams,'chart'+(i+1),playerStatCol,yMax,playerStats[i],playerCard);
        }

        playerStatCol = chartData.resultSets[0].headers.indexOf(playerStats[7][0]);
        teamStatCol = chartData.resultSets[1].headers.indexOf(playerStats[7][0]);
        yMax = Math.max(...chartData.resultSets[1].rowSet.map(a => +a[5].slice(0,a[5].indexOf(':'))).flat());
        
        console.log(chartData)
        console.log(yMax);
        stat = chartData.resultSets[0].rowSet.map(a => [a[2],a[4],a[5],a[8] == null ? 0 : (+a[8].slice(0,a[8].indexOf(':'))+((+a[8].slice(a[8].indexOf(':')+1)/60))).toFixed(2)])
        stat = [stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.htm.abbreviation}),
                stat.sort(function(a,b){ return b[3]-a[3]; }).filter(e => { return e[0] == teams.vtm.abbreviation})];
        new StackedBarChart(stat,teams,'chart'+(8),playerStatCol,yMax,playerStats[i],playerCard);
    });

    let statHeight = d3.select('#playerCardStats').node().getBoundingClientRect().height;
    let cardDivHeight = d3.select('#playerCardDiv').node().getBoundingClientRect().height;
    d3.select('#playerCardDiv')
        .style('margin-top', ((statHeight - cardDivHeight)/2)+'px');

	let passBar = new PassBar(players);
    teamDisplays = new Team(teams, playerCard);
	court = new Court(gameData, players, teams, teamDisplays, passBar);
    court.drawPlayers()
    let draw = true
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
        /* if (t == 100) timer.stop(); */
    }
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