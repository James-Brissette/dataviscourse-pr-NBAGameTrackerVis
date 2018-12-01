class PassBar {
	constructor(players) {
		this.players = players;
		this.court;
		this.colors = ['rgb(57, 106, 177)', 'rgb(62, 150, 81)', 'rgb(204, 37, 41)', 'rgb(83, 81, 87)', 'rgb(107, 76, 154)'];
		this.selectedColors = [0, 0, 0, 0, 0];
		this.nextColorIdx = 0;
		this.possessions = [];
		this.curPlay = [];
		this.curPlayer = -1;
		this.curPlayValues = [];
		this.currentPassGraph = d3.select('.currentPassGraph').append('svg');
		this.currentPassGraph.attr("width", 1000);
		this.currentPassGraph.attr("height", 50);
		this.playerToColor = {};

		this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('ne')
			.offset(function () {
				return ([0, 0]);
			});
		
		// Define the div for the tooltip
		this.tip.html((d) => {
			let first_name = '';
			let last_name = '';
			let jersey = '';
			let team = '';
			for (let i = 0; i < players.length; i++) {

				if (players[i].playerid == d.key[0]) {
					first_name = players[i].firstname;
					last_name = players[i].lastname;
					jersey = players[i].jersey;
					team = players[i].team;
				}
			}
			//let jersey = this.teams.htm.players.map(a => [a.playerid, a.jersey])
			//	.concat(this.teams.vtm.players.map(a => [a.playerid, a.jersey])).filter(e => { return e[0] == d[1] })[0][1];
			return "<div class='stat'><svg><text x='100' y='40' fill='#fff' font-size='50' text-anchor='end'>#" + jersey + "</text>" +
				"<text x='105' y='20' fill='#fff' font-size='20'>" + first_name + "</text>" +
				"<text x='105' y='40' fill='#fff' font-size='20' font-weight='bold'>" + last_name + "</text>" +
				"<text x='105' y='60' fill='#fff' font-size='20' >" + team + "</text>";
		});

		this.currentPassGraph.call(this.tip);

	}

	addPossession(curPossession) {
		if (curPossession == -1) {
			return;
		}
		if (this.playerToColor[curPossession] == null) {
			this.playerToColor[curPossession] = this.colors[Math.floor(Math.random() * this.colors.length)];
		}
		let previousPlayer = -1;
		//Check if the possession should be added
		if (this.curPlayer == curPossession) {
			this.curPlayValues[this.curPlay.length - 1] += 1;
		}
		else {
			this.curPlay.push([curPossession, this.curPlay.length]);
			previousPlayer = this.curPlayer;

			this.curPlayValues.push(1);
			this.curPlayer = curPossession;
		}

		

		//Add it to the temporal line
		let temp_line = this.currentPassGraph.selectAll('rect').data(this.curPlay);
		temp_line.exit().remove();
		temp_line.enter().append('rect')

		let posStack = d3.stack()
			//.offset(d => 5)
			.keys(d => {
				//return ['asdf', 'qwer']
				return d;
				//return 0;
				return "abcd";
				return d;
			})
			.value((d, key) => {
				//return 10;
				//return this.curPlayValues[d[1]];
				for (let i = this.curPlay.length - 1; i >= 0; i--) {
					if (i == key[1]) {
						return this.curPlayValues[i];
					}
					//if (this.curPlay[i][0] == key[0]) {
					//	return this.curPlayValues[i];
					//}
				}

			})
			(this.curPlay);

		this.currentPassGraph.selectAll('rect').remove();

		// Define the div for the tooltip
		let div = this.div;
		let players = this.players;
		let data = this.currentPassGraph.selectAll('rect')
			.data(posStack);
		data.exit().remove();
		data
			.enter().append('rect')
			.attr('class', d => {
				let selectedTest = '';
				if (d3.selectAll('.p' + d.key[0]).classed('selectedA')) {
					selectedTest = 'selectedA';
				}
				if (d3.selectAll('.p' + d.key[0]).classed('selectedB')) {
					selectedTest = 'selectedB';
				}
				for (let i = 0; i < 7; i++) {
					if (d3.selectAll('.p' + d.key[0]).classed('heatmap' + i)) {
						return 'p' + d.key[0] + ' ' + 'heatmap' + i + ' ' + selectedTest;
					}
				}
				return 'p' + d.key[0] + ' ' + selectedTest;
			})
			.attr('x', d => {
				return d[0][0];
			})
			.attr('y', 10)
			.attr('width', d => {
				return d[0][1] - d[0][0];
			})
			.attr('height', 10)
			.on("mouseover", this.tip.show)
			.on("mouseout", this.tip.hide)
			.on("mouseleave", this.tip.hide)
			.attr('fill', d => {
				return this.playerToColor[d.key[0]];
				return this.nextColor(d.key);
			});

	}

	resetPlay() {
		this.curPlay = [];
		this.curPlayValues = [];
		this.curPlayer = -1;
		this.div.style("opacity", 0);
	}

	nextColor(playerid) {
		for (let i = 0; i < this.selectedColors.length; i++) {
			// If we already are being displayed, keep that color
			if (this.selectedColors[i] === playerid) {
				this.selectedColors[i] = 0;
				return this.colors[i];
			}
		}
		for (let i = 0; i < this.selectedColors.length; i++) {
			if (this.selectedColors[i] === 0) {
				this.selectedColors[i] = playerid;
				return this.colors[i];
			}
		}
		this.selectedColors[this.nextColorIdx] = playerid;

		let ret = this.colors[this.nextColorIdx];

		this.nextColorIdx += 1;
		this.nextColorIdx %= this.selectedColors.length;

		return ret;
	}


	linkToCourt(court) {
		this.court = court;
	}

}