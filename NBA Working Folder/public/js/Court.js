class Court{
    constructor(gameData, players, teams, teamDisplays, passMap) {
        this.gameData = gameData;
        this.players = players;
        this.teams = teams;
		this.teamDisplays = teamDisplays;
		this.passMap = passMap;
		this.coloredPlayers = [];

        this.courtBounds = d3.select('.courtPNG').node().getBoundingClientRect();

        this.courtWidth = this.courtBounds.width;
        this.courtHeight = this.courtBounds.height;
        this.scaleEffect = this.courtWidth > 950 ? 4 : (this.courtWidth > 750 ? 2 : 0);
        this.svg = d3.select('.court').select('.overlay')
        this.svg
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + this.courtWidth + " " + this.courtHeight)
            /* .attr('width',this.courtWidth)
            .attr('height',this.courtHeight) */
            //.attr('transform','translate(-' + this.courtWidth + ',0)')
            /* .attr('transform','translate(0,' + -this.courtHeight+ ')') */

        this.scorecard = d3.select('.scorecard')
        let scorecardheight = this.scorecard.node().getBoundingClientRect().height;
        //d3.select('.scorecard').style('left', (this.courtWidth - this.scorecard.node().getBoundingClientRect().width)/2 + 'px')
        let vtmscore = d3.select('.vtmscore').append('svg')
        vtmscore
            .append('image')
                .attr('xlink:href','./figs/scorecard-logos/' + this.teams.vtm.abbreviation + '.png')
                .attr('height',scorecardheight-2)
        vtmscore
            .append('text').classed('vtmPointCount',true)
                .attr('x',185)
                .attr('y',35)
                .attr('text-anchor','middle')
                .text('0')

        let htmscore = d3.select('.htmscore').append('svg')
        htmscore
            .append('image')
                .attr('xlink:href','./figs/scorecard-logos/' + this.teams.htm.abbreviation + '.png')
                .attr('height',scorecardheight-2)
        htmscore
            .append('text').classed('htmPointCount',true)
                .attr('x',185)
                .attr('y', 35)
                .attr('text-anchor','middle')
                .text('0')

        this.svg.append('text').attr('id','eventId')
            .attr('x', this.courtWidth / 2)
            .attr('y', 25)
            .attr('text-anchor','middle')
            .text('eventId')

        this.svg.append('text').attr('id','pauseLabel')
            .attr('x',5)
            .attr('y',20)
            .text('(Click court to pause)')

        //Append the Quarter count
        d3.select('.period').append('svg')
            .attr('height','100%')
        .append('text').attr('id','quarter')
            .attr('x', 30)
            .attr('y', 30)
            .attr('text-anchor','middle')
            .text('Q1')

        //Append the time clock
        d3.select('.time').append('svg')
            .attr('height','100%')
        .append('text').attr('id','gameClock')
            .attr('x', 40)
            .attr('y', 30)
            .attr('text-anchor','middle')
            .text('00:00')

        this.xMin = 0;
        this.xMax = 100;
        this.yMin = 0;
        this.yMax = 50;

        this.events = this.gameData.events;
        this.event = 0;
        this.moments = this.events[this.event].moments.map(a => a[4]);
        this.moment = 0;
        this.xScale;
        this.yScale;
        this.rScale;
		this.curHeatmap;
        this.dropShadow();
    }

    drawPlayers() {
		this.curHeatmap = this.moments[0];
        //let positionData = this.gameData.events.map(a => a.moments.map(b => b['5']))
        //let xVals = test[0].map(a => a.map(b => b[2]))
        //let yteVals = test[0].map(a => a.map(b => b[2]))
        //Take the max value from an array of the max values of each player at each moment.
        //Math.max(...xVals.map(a => Math.max(...a)))
        //Math.max(...test.map(event => Math.max(...event.map(moment => moment.map(player => player[2])).map(playerPos => Math.max(...playerPos)))))

        let courtX = this.courtWidth / 16;
        let courtY = this.courtHeight / 11;

        this.xScale = d3.scaleLinear()
                        .domain([this.xMin,this.xMax])
                        .range([0 + courtX, this.courtWidth])

        
        this.yScale = d3.scaleLinear()
                        .domain([this.yMin,this.yMax])
                        .range([0 + courtY, this.courtHeight - courtY])

        this.rScale = d3.scaleLinear()
                        .domain([0,18])
                        .range([4 + this.scaleEffect, 16 + this.scaleEffect])

        this.svg.append('rect')
            .attr('x', this.xScale(0) - 2)
            .attr('y', this.yScale(this.yMax / 2)-2)
            .attr('height', 4)
            .attr('width', 4);

        this.svg.append('rect')
            .attr('x', this.xScale(this.xMax) - 2)
            .attr('y', this.yScale(this.yMax / 2)-2)
            .attr('height', 4)
            .attr('width', 4);

        let teamA = this.teams['htm'].teamid

        let players = this.svg.selectAll('circle').data(this.moments[0]);
        let playersEnter = players.enter().append('circle');
        players.exit().remove();
        players = playersEnter.merge(players);
        
        players
            .attr('cx', (d,i) => this.xScale(i * 2))
            .attr('cy',  (d,i) => this.yScale(i * 2))
            .attr('r',d => d[0] == -1 ? this.rScale(d[4]) : (12 + this.scaleEffect))
            .attr('class', d => d[0] == -1 ? 'ball': 
                               (d[0] == teamA ? 'GSW p' + d[1] : 'UTA p' + d[1]))
            .style("filter", "url(#drop-shadow)")
            .on('mouseenter', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',true)
            })
            .on('mouseleave', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',false)
            })

        /* let jerseys = playerGroups.append('text');
    
        jerseys
            .attr('x', (d,i) => this.xScale(i * 2))
            .attr('y',  (d,i) => this.yScale(i * 2))
            .attr('text-anchor','middle')
            .attr('class', d => d[0] == -1 ? 'ball': 'jersey p' + d[1])
            .text(d => {
                if (d[0] == -1) { return '' }
                if (d[0] == this.teams.htm.teamid) {
                    console.log('Player id = ' + d[1] +'; Jersey = ' + that.teams.htm.players[that.teams.htm.players.map(a => a.playerid).indexOf(d[1])].jersey)
                    return that.teams.htm.players[that.teams.htm.players.map(a => a.playerid).indexOf(d[1])].jersey;
                } else {
                    return that.teams.vtm.players[that.teams.vtm.players.map(a => a.playerid).indexOf(d[1])].jersey;
                }
            })*/ 

        let activePlayerList = this.moments[0].map(a => a[1]).slice(1,11);

        this.svg.append('circle')
            .attr('cx', this.courtWidth - 200)
            .attr('cy', this.courtHeight - 25)
            .attr('r', 15)
            .attr('class', this.teams.htm['abbreviation'])

        this.svg.append('circle')
            .attr('cx', this.courtWidth - 300)
            .attr('cy', this.courtHeight - 25)
            .attr('r', 15)
            .attr('class', this.teams.vtm['abbreviation'])

        this.svg.append('text')
            .attr('x', this.courtWidth - 180)
            .attr('y', this.courtHeight - 20)
            .text (this.teams.htm.abbreviation)  

        this.svg.append('text')
            .attr('x', this.courtWidth - 280)
            .attr('y', this.courtHeight - 20)
            .text (this.teams.vtm.abbreviation)


        this.teamDisplays.updateActivePlayers(activePlayerList)
        this.teamDisplays.linkToCourt(this);
	}

	heatmapColor(data) {
		for (let i = 0; i < this.coloredPlayers.length; i++) {
			if (this.coloredPlayers[i][0] == data[1]) {
				return this.coloredPlayers[i][1];
			}
		}
		return 'transparent';
	}

    update() {
        if (this.moment > this.moments.length - 1) {
            console.log('Moments exhausted')
            this.loadEvent();
            return;
		}

		this.curHeatmap = this.curHeatmap.concat(this.moments[this.moment]);
		let heatmapSquares = [];
		if (this.coloredPlayers.length == 0) {
			heatmapSquares = this.svg.selectAll('rect').data([]);
		}
		else {
			heatmapSquares = this.svg.selectAll('rect').data(this.curHeatmap);
		}
		heatmapSquares.exit().remove();
		heatmapSquares.enter().append('rect')
			.attr('x', d => this.xScale(d[2]))
			.attr('y', d => {
				return this.yScale(d[3]);
			})
			.attr('width', 3)
			.attr('height', 3)
			.attr('class', d => 'name' + d[1])
			.attr('fill', d => this.heatmapColor(d));

		let curPossession = -1;
		for (let i = 0; i < this.moments[this.moment].length; i++) {
			if (this.moments[this.moment][i][5] == 1) {
				curPossession = this.moments[this.moment][i][1];
				break;
			}
		}
		this.passMap.addPossession(curPossession);

        let players = this.svg.selectAll('circle')
        players.data(this.moments[this.moment])
            .attr('cx', d => this.xScale(d[2]))
            .attr('cy', d => this.yScale(d[3]))
            .attr('r',d => d[0] == -1 ? this.rScale(d[4]) : (12 + this.scaleEffect))
            .style("filter", d => d[0] == -1 ? '' : "url(#drop-shadow)");

        console.log(this.events[this.event])
        d3.select('#gameClock').text("" + Math.floor(this.events[this.event].moments[this.moment]['1'] / 60) + ':' + (this.events[this.event].moments[this.moment]['1']%60).toFixed(0));
        if (this.events[this.event].moments[this.moment]['2'] != null) {
            d3.select('#shotClock').text("" + this.events[this.event].moments[this.moment]['2'].toFixed(1))
        }

        console.log()
        d3.select('#quarter').text("Q" + this.events[this.event].moments[this.moment]['0']);
        d3.select('.vtmPointCount').text(this.events[this.event].moments[this.moment][3][0]);
        d3.select('.htmPointCount').text(this.events[this.event].moments[this.moment][3][1]);
        d3.select('#eventId').text(this.events[this.event].moments[this.moment][3][2])
        this.moment++;
	}

	selectPlayer(playerid, color) {
		this.coloredPlayers.push([playerid, color]);
		this.svg.selectAll('.name' + playerid).attr('fill', color);
	}

	removePlayer(playerid) {
		this.svg.selectAll('.name' + playerid).attr('fill', 'transparent');
		for (let i = 0; i < this.coloredPlayers.length; i++) {
			if (this.coloredPlayers[i][0] === playerid) {
				this.coloredPlayers.splice(i, 1);
				return;
			}
		}
	}

    loadEvent() {
        this.event++;
        if (this.event > this.events.length - 1) {
            return;
        }

        this.moments = this.events.map(a => a.moments.map(b => b['4']))[this.event];
        this.moment = 0;
    }
    
    dropShadow() {
        let defs = this.svg.append('defs');

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        let filter = defs.append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '130%');

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 1)
            .attr('result', 'offsetblur');

        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', .1)
            .attr('dy', .1)
            .attr('result', 'offsetBlur');

        filter.append('feComponentTransfer').append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 1)

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        let feMerge = filter.append('feMerge');

        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlur')
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');

        let pattern = defs.append('pattern')
            .attr('id','#basketball')
            .attr('height','100%')
            .attr('x',0)
            .attr('y',0)
            .attr('patternUnits','userSpaceOnUse')

        pattern.append('image')
            .attr('x',0)
            .attr('y',0)
            .attr('xlink:href', '../../figs/basketball.png');
        
    }

}