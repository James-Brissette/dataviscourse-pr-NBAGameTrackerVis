class Team {
    constructor(teams) {
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

        
        this.htm.append('rect')
            .attr('width', this.teamWidth / 2)
            .attr('height', this.teamWidth / 2)
            .attr('x', this.teamWidth / 4)
            .attr('y', 10)
            .attr('fill', '#006')
        this.vtm.append('rect')
            .attr('width', this.teamWidth / 2)
            .attr('height', this.teamWidth / 2)
            .attr('x', this.teamWidth / 4)
            .attr('y', 10)
            .attr('fill', '#060')

        this.htm.append('text').classed('teamName',true)
            .attr('x', this.teamWidth / 2)
            .attr('y', this.teamWidth / 2)
            .attr('fill','white')
            .text(this.teams.htm.abbreviation)
        this.vtm.append('text').classed('teamName',true)
            .attr('x', this.teamWidth / 2)
            .attr('y', this.teamWidth / 2)
            .attr('fill','white')
            .text(this.teams.vtm.abbreviation)

        /* //Will Use this once we get the logos in a better format (svg)
        this.htm.selectAll('image').remove()
        this.vtm.selectAll('image').remove()

        this.htm.append('image')
            .attr('xlink:href', './figs/' + htmLogoAbbreviation + '.gif')
            .attr('width', this.teamWidth * (2/3)) */
    }

    drawPlayers() {
        this.htm.append('g').classed('activeRoster', true);
        this.vtm.append('g').classed('activeRoster', true);
        let active = d3.selectAll('.activeRoster').append('text')
            .attr('x', this.teamWidth / 16)
            .attr('y', this.teamWidth)
            .text('Active Roster')
//Need to translate and rotate


        let htmPlayers = this.htm.append('g')
            .attr('id', 'htmPlayers')
            .attr('transform','translate(0,'+ (this.teamWidth/2 + 50) + ')')
            .selectAll('text').data(this.teams.htm.players)
        let htmPlayersEnter = htmPlayers.enter().append('text');
        htmPlayers.exit().remove();
        htmPlayers = htmPlayersEnter.merge(htmPlayers);

        let vtmPlayers = this.vtm.append('g')
            .attr('id', 'vtmPlayers')
            .attr('transform','translate(0,'+ (this.teamWidth/2 + 50) + ')')
            .selectAll('text').data(this.teams.vtm.players)
        let vtmPlayersEnter = vtmPlayers.enter().append('text');
        vtmPlayers.exit().remove();
        vtmPlayers = vtmPlayersEnter.merge(vtmPlayers);

        htmPlayers
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 8)
            .attr('y', (d,i) => 10 + 15 * i)
            .attr('text-anchor', 'start')

        vtmPlayers
            .text(d => d.firstname + ' ' + d.lastname)
            .attr('x', this.teamWidth / 8)
            .attr('y', (d,i) => 10 + 15 * i)
            .attr('text-anchor', 'start')

    }
    

}