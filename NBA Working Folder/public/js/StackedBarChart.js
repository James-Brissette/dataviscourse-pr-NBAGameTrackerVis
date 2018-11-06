class StackedBarChart{
    constructor(chartData, teams, svgID, statCol, yMax) {
        this.chartData = chartData;
        this.teams = teams;
        
        this.chartBounds = d3.select('.summaryChart').node().getBoundingClientRect();
        this.chartWidth = this.chartBounds.width;
        this.chartHeight = this.chartBounds.height;
        
        console.log(this.chartBounds);
        this.svg = d3.select('#' + svgID)
            .attr('width',this.chartWidth)
            .attr('height',this.chartHeight)
            .attr('transform','translate(' + (-this.chartWidth / 2) + ',0)')
        this.svg.selectAll('g').remove();

        this.statCol = statCol;
        this.yMin = 0;
        this.yMax = yMax;
        
        this.xScale;
        this.yScale;
        this.teamScale;

        this.drawBars();
    }    

    drawBars() {
        this.teamScale = d3.scaleLinear()
                        .domain([1,2])
                        .range([(this.chartWidth - 50)/4,(this.chartWidth - 50)*(3/4)])
        this.xScale = d3.scaleLinear()
                        .domain([0,4])
                        .range([0,this.chartWidth - 50])
        
        this.yScale = d3.scaleLinear()
                        .domain([this.yMin,this.yMax])
                        .range([this.chartHeight - 30,0])

        let xAxis = d3.axisBottom(this.xScale)
                        .ticks([3])
                        .tickValues([]);
        let yAxis = d3.axisLeft(this.yScale)
                        .ticks(5)

        this.svg.append('g').classed('x-axis',true)
            .call(xAxis);

        this.svg.append('g').classed('y-axis',true)
            .call(yAxis);

        let bars = this.svg.append('g').classed('stacked-bars',true).selectAll('rect').data(this.chartData)
        let barsEnter = bars.enter().append('rect');
        bars.exit().remove()
        bars = barsEnter.merge(bars)
        bars
            .attr('x', d => d[0] == this.teams.vtm.abbreviation ? (this.chartWidth - 50)/4 : (this.chartWidth - 50)*(3/4))
            .attr('y', 0)
            .attr('width',15)
            .attr('height', d => this.yScale(+d[3]))
            .attr('fill', d => d[0] == this.teams.htm.abbreviation ? '#006' : '#060')

    }

}