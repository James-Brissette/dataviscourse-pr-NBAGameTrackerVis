class StackedBarChart{
    constructor(chartData, teams, svgID, statCol, yMax) {
        console.log(chartData)
        this.chartData = chartData.sort(function(a,b) {
            return a[3] - b[3]
        });
        console.log(this.chartData)
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
        console.log(this.yMax);
        let yScaleMax = this.chartHeight - 50;
        this.teamScale = d3.scaleLinear()
                        .domain([1,2])
                        .range([(this.chartWidth - 50)/4,(this.chartWidth - 50)*(3/4)])
        this.xScale = d3.scaleLinear()
                        .domain([0,4])
                        .range([0,this.chartWidth - 50])
        
        this.yScale = d3.scaleLinear()
                        .domain([this.yMin,this.yMax])
                        .range([yScaleMax,0])

        let xAxis = d3.axisBottom(this.xScale)
                        .ticks([3])
                        .tickValues([]);
        let yAxis = d3.axisLeft(this.yScale)
                        .ticks(5)

        let wrapper = this.svg.append('g').classed('barWrapper', true);
        let bars = wrapper.append('g').classed('stacked-bars',true).selectAll('rect').data(this.chartData)
        wrapper.append('g').classed('x-axis',true)
            .call(xAxis);
        wrapper.append('g').classed('y-axis',true)
            .call(yAxis);

        let barsEnter = bars.enter().append('rect');
        bars.exit().remove()
        bars = barsEnter.merge(bars)
        console.log(bars);
        bars
            .attr('x', d => d[0] == this.teams.vtm.abbreviation ? (this.chartWidth - 50)/3 : (this.chartWidth - 50)*(2/3))
            .attr('y', (d,i) => i - 1 == -1 ? 
                        this.yScale(0) - ((yScaleMax) - this.yScale(d[3])) : 
                        (d[0] == d3.select(bars.nodes()[i-1])._groups['0']['0'].__data__[0] ? 
                        d3.select(bars.nodes()[i-1])._groups['0']['0'].y.baseVal.value - ((yScaleMax) - this.yScale(d[3])):
                        this.yScale(0) - ((yScaleMax) - this.yScale(d[3]))))
            .attr('class', d => 'p' + d[1])
            .attr('width',60)
            .attr('height', d => (yScaleMax) - this.yScale(d[3]))
            .attr('fill', (d,i) => d[0] == this.teams.htm.abbreviation ? 'rgb(0,40,' + (10*i) +')' : 'rgb(0,' + (15*i) +',100)')
            .on('mouseenter', d => {
                d3.selectAll('.p' + d.playerid).classed('selected',true);
                console.log('trigggered')
            })
            .on('mouseleave', d => {
                d3.selectAll('.p' + d.playerid).classed('selected',false)
            })

    }
}