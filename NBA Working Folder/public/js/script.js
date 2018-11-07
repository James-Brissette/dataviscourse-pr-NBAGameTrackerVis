
let court;
let teamDisplays; 

gameNumber = ('00' + 434).substr(-3);
d3.json('data/0021500'+gameNumber+'_p2.json').then(gameData => {
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
    d3.json('data/434_boxscoreplayertrack.json').then(chartData => {
        console.log(chartData);
        let playerStatCol = 17;
        let teamStatCol = 13;
        let yMax = Math.max(...chartData.resultSets[1].rowSet.map(a => a[teamStatCol]).flat());
        let passes = chartData.resultSets[0].rowSet.map(a => [a[2],a[4],a[5],a[playerStatCol]])
        s = new StackedBarChart(passes,teams,'abc',playerStatCol,yMax);
    });

    teamDisplays = new Team(teams);
    court = new Court(gameData, players, teams, teamDisplays);
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
        if (t == 100) timer.stop();
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