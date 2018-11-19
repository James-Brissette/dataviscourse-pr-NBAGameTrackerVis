class PlayerCard{
    constructor() {

        /* this.courtBounds = d3.select('.courtPNG').node().getBoundingClientRect();
        this.courtWidth = this.courtBounds.width;
        this.courtHeight = this.courtBounds.height; */

        this.svg = d3.select('.playerCard').append('svg')
        this.svg
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 300 450")
            /* .attr('width',this.courtWidth)
            .attr('height',this.courtHeight) */
            //.attr('transform','translate(-' + this.courtWidth + ',0)')
            /* .attr('transform','translate(0,' + -this.courtHeight+ ')') */

        this.svg.append('rect')
            .attr('height','100%')
            .attr('width','100%');
    }

    updatePlayer() {

    }
    

}