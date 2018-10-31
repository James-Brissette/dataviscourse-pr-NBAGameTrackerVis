

d3.json("data/0021500434.json").then(gameData => {
    console.log(gameData)
    let players = gameData.events[0].home.players
    let teams = [];
    //gameData.events[0].home.players.forEach(player => players[player.playerid.toString()] = player);
    gameData.events[0].visitor.players.forEach(player => players.push(player));
    teams[gameData.events[0].home.teamid] = gameData.events[0].home;
    teams[gameData.events[0].visitor.teamid] = gameData.events[0].visitor;

    console.log(teams)
    console.log(players)

    let moments = gameData.events.map(a => a.moments)
    let court = new Court(gameData, players, teams);
    court.drawPlayers()

    
});