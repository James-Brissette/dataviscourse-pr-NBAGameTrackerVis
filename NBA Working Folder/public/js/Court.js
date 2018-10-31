class Court{
    constructor(gameData, players, teams) {
        this.gameData = gameData;
        this.players = players;
        this.teams = teams;

        this.svg = d3.select('#court').append('svg');
        this.courtBounds = d3.select('.court').node().getBoundingClientRect();
        this.courtWidth = this.courtBounds.width;
        this.courtHeight = this.courtBounds.height;
        this.svg
            .attr('width',this.courtWidth)
            .attr('height',this.courtHeight)
            .attr('transform','translate(-' + this.courtWidth + ',0)')
        
        this.xMin = 0;
        this.xMax = 100;
        this.yMin = 0;
        this.yMax = 50;
    }

    drawPlayers() {

        //let positionData = this.gameData.events.map(a => a.moments.map(b => b['5']))
        //let xVals = test[0].map(a => a.map(b => b[2]))
        //let yteVals = test[0].map(a => a.map(b => b[2]))
        //Take the max value from an array of the max values of each player at each moment.
        //Math.max(...xVals.map(a => Math.max(...a)))
        //Math.max(...test.map(event => Math.max(...event.map(moment => moment.map(player => player[2])).map(playerPos => Math.max(...playerPos)))))

        let courtX = this.courtWidth / 15;
        let courtY = this.courtHeight / 11;

        let xScale = d3.scaleLinear()
                        .domain([this.xMin,this.xMax])
                        .range([0 + courtX, this.courtWidth - courtX])

        let yScale = d3.scaleLinear()
                        .domain([this.yMin,this.yMax])
                        .range([0 + courtY, this.courtHeight - courtY])

        let players = this.svg.selectAll('circle').data(this.players);
        let playersEnter = players.enter().append('circle');
        players.exit().remove();
        players = playersEnter.merge(players);
        players
            .attr('cx', (d,i) => xScale(i * 2))
            .attr('cy',  (d,i) => yScale(i * 2))
            .attr('r',2);
    }
}