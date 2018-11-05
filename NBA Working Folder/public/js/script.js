
let court = null;   

gameNumber = ('00' + 434).substr(-3);
d3.json('data/0021500'+gameNumber+'_p2.json').then(gameData => {
    console.log(gameData);

    let players = [gameData.teams.home.players, gameData.teams.visitor.players].flat();

    let teams = [];
    /*The below doesn't work for teams. If the team id is 123456 it makes an array of size 123456... will address later */
    teams['htm'] = gameData.teams.home;
    teams['vtm'] = gameData.teams.visitor;

    console.log(teams)
    console.log(players)

    //let uniqueEvents = filterEvents(gameData);
    //console.log(uniqueEvents);
    court = new Court(gameData, players, teams);

    court.drawPlayers()
    let draw = true
    let pause = true;
    /* let timer = d3.timer((elapsed) => {
        timerCallback(elapsed)
    }); */

    d3.select('#court').on('click', function () {
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