class PlayerDisplay {
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
		this.passGraph = d3.select('.passGraph').append('svg');
		this.passGraph.attr("width", 500);
		this.passGraph.attr("height", 500);
		this.playerToColor = {};
		// Define the div for the tooltip
		this.div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("background-color", "white")
			.style("opacity", 0);
		

		this.links = this.passGraph.append("g")
			.attr("class", "links");
		this.nodes = this.passGraph.append("g")
			.attr("class", "nodes");

		this.setupForceGraph();
	}

	setupForceGraph() {
		


		this.newGraph = { 'links': [], 'nodes': [] };
		for (let i = 0; i < this.players.length; i++) {
			this.newGraph.nodes.push(
				{ 'id': this.players[i].playerid }
			);
			for (let k = 0; k < this.players.length; k++) {
				this.newGraph.links.push(
					{
						'source': this.players[i].playerid,
						'target': this.players[k].playerid,
						'value': 1
					}
				);
			}
		}
		this.updateForceGraph('203526', '201575');
}

	updateForceGraph(source, target) {
		let updated = false;
		for (let i = 0; i < this.newGraph.links.length; i++) {
			if (source == this.newGraph.links[i].source.id &&
				target == this.newGraph.links[i].target.id) {
				this.newGraph.links[i].value += 1;
				updated = true;
				break;
			}
		}
		if (updated == false) {
			this.newGraph.links.push(
				{
					'source': parseInt(source),
					'target': parseInt(target),
					'value': 1
				});
			//this.newGraph.links.push(
			//	{
			//		'source': 201574,
			//		'target': 201575,
			//		'value': 1
			//	});
		}

		let width = this.passGraph.attr("width");
		let height = this.passGraph.attr("height");
		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function (d) { return d.id; }))
			.force("charge", d3.forceManyBody())
			//.force("charge", d => -60)
			.force("center", d3.forceCenter(width / 2, height / 2));

		var link = this.links
			.selectAll("line")
			.data(this.newGraph.links)
			.enter().append("line")
			.attr("fill", "white")
			.attr('class', 'link')
			.attr("id", d => (d.source + '-' + d.target))
			.attr("stroke-width", function (d) {
				return Math.sqrt(d.value);
			});

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
		let randColor = this.colors;
		let div = this.div;
		let players = this.players;
		
		var node = this.nodes
			.selectAll("circle")
			.data(this.newGraph.nodes)
			.enter().append("circle")
			.attr("r", 5)
			.on("mouseover", function (d) {
				let name = '';
				let jersey = '';
				for (let i = 0; i < players.length; i++) {

					if (players[i].playerid == d.id) {
						name = players[i].firstname + ' ' + players[i].lastname;
						jersey = 'number: ' + players[i].jersey;
					}
				}
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(name + "<br/>" + jersey)
					.style("left", (d3.event.pageX - 20) + "px")
					.style("top", (d3.event.pageY - 50) + "px");
			})
			.on("mouseout", function (d) {
				div.transition()
					//.duration(500)
					.style("opacity", 0);
			})
			.attr("fill", function (d) {
				let nodeColor = randColor[Math.floor(Math.random() * randColor.length)];
				return nodeColor;
			})
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

		node.append("title")
			.text(function (d) { return d.id; });

		simulation
			.nodes(this.newGraph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(this.newGraph.links);

		function ticked() {
			link
				.attr("x1", function (d) {
					return d.source.x;
				})
				.attr("y1", function (d) { return d.source.y; })
				.attr("x2", function (d) { return d.target.x; })
				.attr("y2", function (d) { return d.target.y; });

			node
				.attr("cx", function (d) {
					return d.x;
				})
				.attr("cy", function (d) { return d.y; });
		}
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
		if (previousPlayer != -1) {
			//Add it to the node graph
			//this.updateForceGraph(previousPlayer, this.curPlayer);
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
		this.currentPassGraph.selectAll('rect')
			.data(posStack)
			.enter().append('rect')
			.attr('x', d => {
				return d[0][0];
			})
			.attr('y', 10)
			.attr('width', d => {
				return d[0][1] - d[0][0];
			})
			.attr('height', 10)
			.on("mouseover", function (d) {
				let name = '';
				let jersey = '';
				for (let i = 0; i < players.length; i++) {
					
					if (players[i].playerid == d.key[0]) {
						name = players[i].firstname + ' ' + players[i].lastname;
						jersey = 'number: ' + players[i].jersey;
					}
				}
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(name + "<br/>" + jersey)
					.style("left", (d3.event.pageX - 20) + "px")
					.style("top", (d3.event.pageY - 50) + "px");
			})
			.on("mouseout", function (d) {
				div.transition()
					//.duration(500)
					.style("opacity", 0);
			})
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
