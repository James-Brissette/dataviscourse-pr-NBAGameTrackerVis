class Player {
	constructor(teams) {
		this.isHeatmap = false;
		this.court;
		this.colors = ['rgb(57, 106, 177)', 'rgb(62, 150, 81)', 'rgb(204, 37, 41)', 'rgb(83, 81, 87)', 'rgb(107, 76, 154)'];
		this.selectedColors = [0, 0, 0, 0, 0];
		this.nextColorIdx = 0;
		this.teams = teams;
        console.log(this.teams);
        d3.select('#vtm').select('svg').remove();

        this.vtm = d3.select('#vtm').append('svg')

        this.headerBounds = d3.select('.header').node().getBoundingClientRect()
        d3.select('#headerText')
            .attr('x', this.headerBounds.width / 2)
            .attr('y', this.headerBounds.height / 1.5)
            .text(this.teams.vtm.name + ' @ ' + this.teams.htm.name)

        this.teamBounds = d3.select('.team').node().getBoundingClientRect();
        this.teamWidth = this.teamBounds.width;
        this.teamHeight = this.teamBounds.height;

        this.vtm
            .attr('width',this.teamWidth)
			.attr('height', this.teamHeight)

		this.setPlayerInfo();
        this.drawLogos();
        this.drawPlayers();
	}

	setPlayerInfo() {
		d3.json('data/players.json').then(playersData => {
			this.playerInfo = playersData['league']['standard'][0];
			for (let i = 0; i < playersData['league']['standard'].length; i++) {
				if (playersData['league']['standard'][i]['personId'] == localStorage["curPlayerid"]) {
					this.playerInfo = playersData['league']['standard'][i];
					break;
				}
			}
			console.log(this.playerInfo);
			this.vtm.append('text').classed('teamName', true)
				.attr('x', this.teamWidth / 2)
				.attr('y', 245)
				.text(this.playerInfo.firstName + ' ' + this.playerInfo.lastName);

			this.vtm.append('text').classed('teamName', true)
				.attr('x', this.teamWidth / 3)
				.attr('y', 290)
				.text('Height: ' + this.playerInfo.heightFeet + "' " + this.playerInfo.heightInches + '"');

			this.vtm.append('text').classed('teamName', true)
				.attr('x', this.teamWidth / 3)
				.attr('y', 315)
				.text('Weight: ' + this.playerInfo.weightPounds + 'lb');

		})
		
	}

    drawLogos() {
        let htmLogoAbbreviation = this.teams.htm.abbreviation;
        let vtmLogoAbbreviation = this.teams.vtm.abbreviation;
		let svgWidth = 140;
		var im = document.createElement("img");
		im.setAttribute("src", "./figs/playerHeadshots/" + localStorage["curPlayerid"] + ".png");
		im.setAttribute("width", this.teamBounds.width);
		im.setAttribute("alt", "Player Portrait");
		document.getElementById('vtm').appendChild(im);
    }

    drawPlayers() {
        /**
         * Updates the Active and Bench rosters with the current active players 
         * on the court;
         */

        
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



        let vtmActive = d3.select('#vtmActivePlayers')
                        .selectAll('text').data(this.teams.vtm.players.filter(d => { return d.active == true }))
		let vtmActiveEnter = vtmActive.enter().append('text')
			.attr('class', d => 'name' + d.playerid)
			.on('click', d => {
				if (this.isHeatmap) {
					let color = this.nextColor(d.playerid);
					if (color == -1) {
						return;
					}
					this.court.selectPlayer(d.playerid, color);
				}
				else {
					localStorage["curPlayerid"] = d.playerid;
					window.location.href = "NBA_PLayerVis.html";
				}
				
			});
        vtmActive.exit().remove();
        vtmActive = vtmActiveEnter.merge(vtmActive);

        let vtmBench = d3.select('#vtmBenchPlayers')
                        .selectAll('text').data(this.teams.vtm.players.filter(d => { return d.active == false }))
        let vtmBenchEnter = vtmBench.enter().append('text');
        vtmBench.exit().remove();
        vtmBench = vtmBenchEnter.merge(vtmBench);


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