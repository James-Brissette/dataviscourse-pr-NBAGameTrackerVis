/* This script was just a draft to filter out the non-unique events. The below is copied into the filterEvents(gameData) function in script.js */
d3.json("data/0021500434.json").then(gameData => {

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
        uniqueEvents.push(events[uniqueID]);
    });
    console.log(uniqueEvents);
    
});