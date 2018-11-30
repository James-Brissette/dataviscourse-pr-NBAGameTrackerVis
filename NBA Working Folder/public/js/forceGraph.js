class ForceGraph{
    constructor(links, players) {
		this.link = links;
		this.players = players;
		this.colors = ['rgb(57, 106, 177)', 'rgb(62, 150, 81)', 'rgb(204, 37, 41)', 'rgb(83, 81, 87)', 'rgb(107, 76, 154)'];

		this.passGraph = d3.select('#playerGraph').append('svg');
		this.passGraph.attr("width", 800);
		this.passGraph.attr("height", 600);
		//this.div = d3.select("body").append("div")
		//	.attr("class", "tooltip")
		//	.style("position", "absolute")
		//	.style("background-color", "white")
		//	.style("opacity", 0);


		this.links = this.passGraph.append("g")
			.attr("class", "links");
		this.nodes = this.passGraph.append("g")
			.attr("class", "nodes");

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

				if (players[i].playerid == d.id) {
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

		this.setupForceGraph();

    }

	setupForceGraph() {
		this.newGraph = { 'links': [], 'nodes': [] };
		for (let i = 0; i < this.players.length; i++) {
			console.log(this.players[i])
			this.newGraph.nodes.push(
				{ 'id': this.players[i].playerid ,
				  'abbreviation': this.players[i].abbreviation }
			);
		}
		this.newGraph.links = this.link;
		this.updateForceGraph('203526', '201575');
		this.passGraph.call(this.tip);
	}

	updateForceGraph(source, target) {
		
		let width = this.passGraph.attr("width");
		let height = this.passGraph.attr("height");
		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function (d) { return d.id; }).strength(.2))
			//.force("link", d3.forceLink().id(function (d) { return d.id; }))
			//.force("charge", d3.forceManyBody().strength(200).distanceMax(400).distanceMin(60))
			.force("repelForce", d3.forceManyBody().strength(-2000).distanceMax(400).distanceMin(0))
			//.force("charge", d => 60000)
			.force("center", d3.forceCenter((width / 2)-50, height / 3));

		var link = this.links
			.selectAll("line")
			.data(this.newGraph.links)
			.enter().append("line")
			.attr("fill", "red")
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
		//let div = this.div;
		let players = this.players;

		var node = this.nodes
			.selectAll("circle")
			.data(this.newGraph.nodes)
			.enter().append("circle")
			.attr("r", 15)
			.attr('class', d => 'p'+ d.id +' ' +d.abbreviation)
			.on("mouseover", this.tip.show)
			.on("mouseout", this.tip.hide)
			.on('mouseenter', d => {
                d3.selectAll('.p' + d.id).classed('selectedA',true)
            })
            .on('mouseleave', d => {
                d3.selectAll('.p' + d.id).classed('selectedA',false)
            })
			
			/* .attr("fill", function (d) {
				console.log(d);
				for (let i = 0; i < players.length; i++) {

					if (players[i].playerid == d.id) {
						if (players[i].abbreviation == "GSW") {
							return 'blue';
						}
						return 'red';
					}
				}
				let nodeColor = randColor[Math.floor(Math.random() * randColor.length)];
				return nodeColor;
			}) */
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

		//node.append("title")
		//	.text(function (d) { return d.id; });

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
}