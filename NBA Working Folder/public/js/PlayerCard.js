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

        let nameBlockWidth = this.nameBlock.node().getBoundingClientRect().width;
        this.nameBlock
            .attr('transform','translate(' + (50% - (nameBlockWidth / 2)) + ',' + (this.photoHeight + 65) + ')')


        /* this.playerCardLogo = this.teamBlock.append('svg').classed('playerCardLogo', true) */
        
        this.playerCardPosition
            .text(playerData.position)
            .attr('x', 70)
            .attr('y', 5)
        let teamBlockPosPadding = this.playerCardPosition.node().getBoundingClientRect().width;
        this.playerCardDivider
            .text(' | ')
            .attr('x', teamBlockPosPadding + 75)
            .attr('y', 5)
            .attr('font-size',25)
        let teamBlockDivPadding = this.playerCardDivider.node().getBoundingClientRect().width;
        this.playerCardTeam
            .text(playerData.team)
            .attr('x', teamBlockPosPadding + teamBlockDivPadding + 80)
            .attr('y', 5)
        this.teamBlock.selectAll('svg').remove();
        d3.svg('./figs/svg-logos/nba/' + playerData.abbreviation + '.svg').then(svg => {
            let s = d3.select(svg).select('svg')
                .attr('width', 60)
                .attr('y','-45%');
            this.teamBlock.node().appendChild(s.node());
        });
        
        this.teamBlock
            .attr('transform','translate(' + (50% - this.teamBlock.node().getBoundingClientRect().width/2) + ',' + (this.photoHeight + 100) + ')')

    }
    

}