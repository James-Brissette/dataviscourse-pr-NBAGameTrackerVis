
let court = null;


function filterEvents(gameData) {
    let events = gameData.events.map(a => a.moments.map(b => b[5]));
    console.log('Total number of events: ' + events.length);

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
        console.log('Comparing events ' + (i+1) + ' & ' + (i+2) + ': ' + unique);
        if (unique == true) {
            uniqueID.push(i+1);
        }
    }

    uniqueID.forEach(eventID => {
        uniqueEvents.push(gameData.events[eventID]);
    });
    console.log(uniqueEvents);

    return {'gameid': gameData.gameid, 'gamedate': gameData.gamedate, 'events': uniqueEvents};
}


d3.json("data/0021500434.json").then(gameData => {
    console.log(gameData);
    let players = gameData.events[0].home.players;
    gameData.events[0].visitor.players.forEach(player => players.push(player));

    let teams = [];
    /*The below doesn't work for teams. If the team id is 123456 it makes an array of size 123456... will address later */
    teams[gameData.events[0].home.teamid] = gameData.events[0].home;
    teams[gameData.events[0].visitor.teamid] = gameData.events[0].visitor;

    console.log(teams)
    console.log(players)

    let uniqueEvents = filterEvents(gameData);
    court = new Court(uniqueEvents, players, teams);

    court.drawPlayers()
    let timer = d3.timer((elapsed) => {
        //Runs for 40 seconds for testing
        let t = Math.min(40, elapsed / 1000);
        court.update();
        if (t == 40) timer.stop();
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