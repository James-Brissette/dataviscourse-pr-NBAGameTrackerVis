class PlayerCard{
    constructor() {

        this.svg = d3.select('.playerCard').append('svg');
        this.width = 300;
        this.svg
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + this.width + " 450");

        this.svg.append('rect')
            .attr('height','100%')
            .attr('width','100%');

        this.cardWidth = this.svg.node().getBoundingClientRect().width;
        this.playerPhotoWidth = this.cardWidth * (3/4);

        this.teamLogo = this.svg.append('g').classed('playerCardLogo',true);

        this.playerPhoto = this.svg.append('g').classed('playerPhoto',true).append('image');
        this.photoWidth = 260;
        this.photoHeight = 190;
        
        this.nameBlock = this.svg.append('g').classed('nameBlock',true);
        this.playerCardNumber = this.nameBlock.append('text').classed('playerCardNumber', true);
        this.playerCardFirstName = this.nameBlock.append('text').classed('playerCardFirstName', true);
        this.playerCardLastName = this.nameBlock.append('text').classed('playerCardLastName', true);
    
        this.teamBlock = this.svg.append('g').classed('teamBlock',true);
        this.playerCardPosition = this.teamBlock.append('text').classed('playerCardPosition', true);
        this.playerCardDivider = this.teamBlock.append('text').classed('playerCardDivider', true);
        this.playerCardTeam = this.teamBlock.append('text').classed('playerCardTeam', true);

        this.toggle = this.svg.append('g').classed('toggle',true)
        this.toggle.append('rect').classed('sliderWrapper', true)
            .attr('x',0)
            .attr('y',0)
            .attr('rx',15)
            .attr('ry',15)
            .attr('height',30)
            .attr('width',150)

        this.isChecked = false;
        this.toggle.append('circle').classed('switch', true)
            .attr('cx', 15)
            .attr('cy', 15)
            .attr('r', 10)
  
    }



    updatePlayer(playerData) {
        console.log(playerData)

        
        let s = this.playerPhoto
            .attr('xlink:href', './figs/playerHeadshots/' + playerData.playerid + '.png')
            .attr('onerror','this.onerror=null;this.href="./figs/playerHeadshots/default.png";')
            .attr('width', this.photoWidth)
            /* .attr('height', svgWidth) */
            .attr('x', '50%')
            .attr('y', 10)
            .attr('transform','translate(-' + (this.photoWidth / 2) + ',0)')

                
        this.playerCardNumber
            .text('#' + playerData.jersey)
            .attr('x', 0)
            .attr('y', 0)
            .attr('font-size',60)

        this.playerCardFirstName
            .text(playerData.firstname)
            .attr('x', '35%')
            .attr('y', -25)
            .attr('text-anchor','start')
            .attr('font-size', playerData.firstname.length > 11 ? 22 : 25)

        this.playerCardLastName
            .text(playerData.lastname)
            .attr('x', '35%')
            .attr('y', 0)
            .attr('text-anchor','start')
            .attr('font-size', playerData.firstname.length > 11 ? 22 : 25)

        this.nameBlock
            .attr('transform','translate(' + ((this.cardWidth - this.nameBlock.node().getBBox().width)/2) + ',' + (this.photoHeight + 65) + ')')


        /* this.playerCardLogo = this.teamBlock.append('svg').classed('playerCardLogo', true) */
        
        this.playerCardPosition
            .text(playerData.position)
            .attr('x', 0)
            .attr('y', 5)
        let teamBlockPosPadding = this.playerCardPosition.node().getBBox().width;
        console.log()
        this.playerCardDivider
            .text(' | ')
            .attr('x', teamBlockPosPadding + 5)
            .attr('y', 5)
            .attr('font-size',25)
        let teamBlockDivPadding = this.playerCardDivider.node().getBBox().width;
        this.playerCardTeam
            .text(playerData.team)
            .attr('x', teamBlockPosPadding + teamBlockDivPadding + 10)
            .attr('y', 5)        
        
        this.teamBlock
            .attr('transform','translate(' + ((this.cardWidth - this.teamBlock.node().getBBox().width)/2) + ',' + (this.photoHeight + 100) + ')')

        this.teamLogo.selectAll('svg').remove();
        d3.svg('./figs/svg-logos/nba/' + playerData.abbreviation + '.svg').then(svg => {
            let s = d3.select(svg).select('svg')
                .attr('width', 350)
                .attr('y','-10%')
                .attr('x',-25)
                .attr('opacity',.25)

        this.teamLogo.append('svg').node().appendChild(s.node());

        
        d3.select('.switch')
            .on('click', function() {
                if (this.isChecked) {
                    d3.select('.switch').transition()
                        .duration(1000)
                        .attr('transform','translate(0,0)')
                    this.isChecked = false;
                } else {
                    d3.select('.switch').transition()
                    .duration(1000)
                    .attr('transform','translate(120,0)')
                    this.isChecked = true;
                }
            })
        });

        console.log();
        let that = this;
        return (d3.select('.playerCard')._groups[0][0].outerHTML)
    }
    

}