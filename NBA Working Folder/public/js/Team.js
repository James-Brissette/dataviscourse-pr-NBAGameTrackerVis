class Team {
    constructor(teams) {
		this.court;
		this.colors = ['rgb(57, 106, 177)', 'rgb(62, 150, 81)', 'rgb(204, 37, 41)', 'rgb(83, 81, 87)', 'rgb(107, 76, 154)'];
		this.selectedColors = [0, 0, 0, 0, 0];
		this.nextColorIdx = 0;
        this.teams = teams;
        console.log(this.teams);
        d3.select('#htm').select('svg').remove();
        d3.select('#vtm').select('svg').remove();

        this.htm = d3.select('#htm').append('svg')
        this.vtm = d3.select('#vtm').append('svg')

        this.headerBounds = d3.select('.header').node().getBoundingClientRect()
        d3.select('#headerText')
            .attr('x', this.headerBounds.width / 2)
            .attr('y', this.headerBounds.height / 1.5)
            .text(this.teams.vtm.name + ' @ ' + this.teams.htm.name)

        this.teamBounds = d3.select('.team').node().getBoundingClientRect();
        this.teamWidth = this.teamBounds.width;
        this.teamHeight = this.teamBounds.height;

        this.htm
            .attr('width',this.teamWidth)
            .attr('height',this.teamHeight)
        this.vtm
            .attr('width',this.teamWidth)
            .attr('height',this.teamHeight)

        this.drawLogos();
        this.drawPlayers();
	}


    drawLogos() {
        let htmLogoAbbreviation = this.teams.htm.abbreviation;
        let vtmLogoAbbreviation = this.teams.vtm.abbreviation;
        let svgWidth = 140;
        d3.svg('./figs/svg-logos/nba/' + vtmLogoAbbreviation + '.svg').then(svg => {
            let s = d3.select(svg).select('svg').classed('teamLogo',true)
                .attr('width', svgWidth)
                .attr('height', svgWidth)
                .attr('x', (this.teamWidth - svgWidth) / 2)
                .attr('y', 10)
            this.vtm.node().appendChild(s.node());
        });

        d3.svg('./figs/svg-logos/nba/' + htmLogoAbbreviation + '.svg').then(svg => {
            let s = d3.select(svg).select('svg').classed('teamLogo',true)
                .attr('width', svgWidth)
                .attr('height', svgWidth)
                .attr('x', (this.teamWidth - svgWidth) / 2)
                .attr('y', 10)
            this.htm.node().appendChild(s.node())
        });

        this.htm.append('text').classed('teamName',true)
            .attr('x', this.teamWidth / 2)
            .attr('y', 180)
            .text(this.teams.htm.abbreviation)
        this.vtm.append('text').classed('teamName',true)
            .attr('x', this.teamWidth / 2)
            .attr('y', 180)
            .text(this.teams.vtm.abbreviation)

    }

    drawPlayers() {
        /**
         * Updates the Active and Bench rosters with the current active players 
         * on the court;
         */

        this.htm.append('g').classed('activeRoster htm', true);
        this.vtm.append('g').classed('activeRoster vtm', true);
        this.htm.append('g').classed('benchRoster htm', true);
        this.vtm.append('g').classed('benchRoster vtm', true);

        let activeRoster = d3.selectAll('.activeRoster')
        let rosterBoxHeight = 30;
        let activeRosterBoxWidth = 110;
        let benchRosterBoxWidth = 170;

		activeRoster.append('rect')
			.attr('x', -(activeRosterBoxWidth / 2))
			.attr('y', -(rosterBoxHeight / 2))
			.attr('width', activeRosterBoxWidth)
			.attr('height', rosterBoxHeight)
			.attr('fill', '#aaa')

        activeRoster.append('text')
            .attr('x', -(activeRosterBoxWidth/2))
            .attr('y', -(rosterBoxHeight/2))
            .text('Active Roster')
        

        let benchPlayers = d3.selectAll('.benchRoster')
        benchPlayers.append('rect')
            .attr('x', -(benchRosterBoxWidth/2))
            .attr('y', -(rosterBoxHeight/2))
            .attr('width', benchRosterBoxWidth)
            .attr('height', rosterBoxHeight)
        benchPlayers.append('text')
            .attr('x', -(benchRosterBoxWidth/2))
            .attr('y', -(rosterBoxHeight/2))
            .text('Bench')


        d3.select('.activeRoster.htm').append('g')
            .attr('id', 'htmActivePlayers')
            .attr('transform','translate(0,'+ 200 + ')');
        d3.select('.benchRoster.htm').append('g')
            .attr('id', 'htmBenchPlayers')
            .attr('transform','translate(0,'+ (200 + activeRosterBoxWidth + 15) + ')')
            

        d3.select('.activeRoster.vtm').append('g')
            .attr('id', 'vtmActivePlayers')
            .attr('transform','translate(0,'+ 200 + ')')
        d3.select('.benchRoster.vtm').append('g')
            .attr('id', 'vtmBenchPlayers')
            .attr('transform','translate(0,'+ (200 + activeRosterBoxWidth + 15) + ')')
        
        this.updateActivePlayers([]);
	}

	nextColor(playerid) {
		for (let i = 0; i < this.selectedColors.length; i++) {
			// If we already are being displayed, remove this selection
			if (this.selectedColors[i] === playerid) {
				this.selectedColors[i] = 0;
				d3.selectAll('.name' + playerid).attr('fill', 'white');
				this.court.removePlayer(playerid);
				return -1;
			}
		}
		for (let i = 0; i < this.selectedColors.length; i++) {
			if (this.selectedColors[i] === 0) {
				this.selectedColors[i] = playerid;
				d3.selectAll('.name' + playerid).attr('fill', this.colors[i]);
				return this.colors[i];
			}
		}

		this.court.removePlayer(this.selectedColors[this.nextColorIdx]);
		this.htm.selectAll('.name' + this.selectedColors[this.nextColorIdx]).attr('fill', 'white');
		this.vtm.selectAll('.name' + this.selectedColors[this.nextColorIdx]).attr('fill', 'white');

		this.selectedColors[this.nextColorIdx] = playerid;

		let ret = this.colors[this.nextColorIdx];
		d3.selectAll('.name' + playerid).attr('fill', ret);

		this.nextColorIdx += 1;
		this.nextColorIdx %= this.selectedColors.length;

		return ret;
	}

    updateActivePlayers(activeList) {
        /**
         * Takes in a list of player id's and updates the active status of 
         * the corresponding players on the court;
         */

        this.teams.htm.players.forEach(player => {
            if (activeList.indexOf(player.playerid) == -1) {
                player.active = false;
            } else {
                player.active = true;
            }
        })
        this.teams.vtm.players.forEach(player => {
            if (activeList.indexOf(player.playerid) == -1) {
                player.active = false;
            } else {
                player.active = true;
            }
        })

		let htmActive = d3.select('#htmActivePlayers')
			.selectAll('text').data(this.teams.htm.players.filter(d => { return d.active == true }))
			
		let htmActiveEnter = htmActive.enter().append('text')
			.attr('class', d => 'name' + d.playerid)
			.on('click', d => {
				let color = this.nextColor(d.playerid);
				if (color == -1) {
					return;
				}
				this.court.selectPlayer(d.playerid, color);
			});
        htmActive.exit().remove();
        htmActive = htmActiveEnter.merge(htmActive);

        let htmBench = d3.select('#htmBenchPlayers')
                        .selectAll('text').data(this.teams.htm.players.filter(d => { return d.active == false }))
        let htmBenchEnter = htmBench.enter().append('text');
        htmBench.exit().remove();
        htmBench = htmBenchEnter.merge(htmBench);


        let vtmActive = d3.select('#vtmActivePlayers')
                        .selectAll('text').data(this.teams.vtm.players.filter(d => { return d.active == true }))
		let vtmActiveEnter = vtmActive.enter().append('text')
			.attr('class', d => 'name' + d.playerid)
			.on('click', d => {
				let color = this.nextColor(d.playerid);
				if (color == -1) {
					return;
				}
				this.court.selectPlayer(d.playerid, color);
			});
        vtmActive.exit().remove();
        vtmActive = vtmActiveEnter.merge(vtmActive);

        let vtmBench = d3.select('#vtmBenchPlayers')
                        .selectAll('text').data(this.teams.vtm.players.filter(d => { return d.active == false }))
        let vtmBenchEnter = vtmBench.enter().append('text');
        vtmBench.exit().remove();
        vtmBench = vtmBenchEnter.merge(vtmBench);
        

        htmActive
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 6)
            .attr('y', (d,i) => 10 + 20 * i)
            .attr('text-anchor', 'start')
        htmBench
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 6)
            .attr('y', (d,i) => 10 + 20 * i)
            .attr('text-anchor', 'start')

        vtmActive
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 6)
            .attr('y', (d,i) => 10 + 20 * i)
            .attr('text-anchor', 'start')
        vtmBench
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 6)
            .attr('y', (d,i) => 10 + 20 * i)
            .attr('text-anchor', 'start')
    }
    
    linkToCourt(court) {
        this.court = court;
    }

}