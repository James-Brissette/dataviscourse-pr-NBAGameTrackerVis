class StackedBarChart{
    constructor(chartData, teams, svgID, statCol, yMax,playerCard) {
        this.chartData = chartData
        this.teams = teams;
        this.playerCard = playerCard;
        
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
        let that = this;
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
        let htmbars = wrapper.append('g').classed('stacked-bars',true).selectAll('rect').data(this.chartData[0])
        wrapper.append('g').classed('x-axis',true)
            .call(xAxis);
        wrapper.append('g').classed('y-axis',true)
            .call(yAxis);

        let htmbarsEnter = htmbars.enter().append('rect');
        htmbars.exit().remove()
        htmbars = htmbarsEnter.merge(htmbars)
        console.log(htmbars);
        htmbars
            .attr('x', (this.chartWidth - 50)*(2/3))
            .attr('y', (d,i) => i - 1 == -1 ? 
                        this.yScale(0) - ((yScaleMax) - this.yScale(d[3])) : 
                        (d[0] == d3.select(htmbars.nodes()[i-1])._groups['0']['0'].__data__[0] ? 
                        d3.select(htmbars.nodes()[i-1])._groups['0']['0'].y.baseVal.value - ((yScaleMax) - this.yScale(d[3])):
                        this.yScale(0) - ((yScaleMax) - this.yScale(d[3]))))
            .attr('class', d => 'p' + d[1])
            .attr('width',60)
            .attr('height', d => (yScaleMax) - this.yScale(d[3]))
            .attr('fill', (d,i) => 'rgb(0,40,' + (10*i) +')')
            .on('mouseenter', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',true);
            })
            .on('mouseleave', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',false)
            })

            let vtmbars = wrapper.append('g').classed('stacked-bars',true).selectAll('rect').data(this.chartData[1])
            wrapper.append('g').classed('x-axis',true)
                .call(xAxis);
            wrapper.append('g').classed('y-axis',true)
                .call(yAxis);
    
            let vtmbarsEnter = vtmbars.enter().append('rect');
            vtmbars.exit().remove()
            vtmbars = vtmbarsEnter.merge(vtmbars)
            vtmbars
                .attr('x', (this.chartWidth - 50)/3)
                .attr('y', (d,i) => i - 1 == -1 ? 
                            this.yScale(0) - ((yScaleMax) - this.yScale(d[3])) : 
                            (d[0] == d3.select(vtmbars.nodes()[i-1])._groups['0']['0'].__data__[0] ? 
                            d3.select(vtmbars.nodes()[i-1])._groups['0']['0'].y.baseVal.value - ((yScaleMax) - this.yScale(d[3])):
                            this.yScale(0) - ((yScaleMax) - this.yScale(d[3]))))
                .attr('class', d => 'p' + d[1])
                .attr('width',60)
                .attr('height', d => (yScaleMax) - this.yScale(d[3]))
                .attr('fill', (d,i) => 'rgb(0,' + (15*i) +',100)')
                .on('mouseenter', d => {
                    d3.selectAll('.p' + d[1]).classed('selectedA',true);
                    console.log('trigggered')
                })
                .on('mouseleave', d => {
                    d3.selectAll('.p' + d[1]).classed('selectedA',false)
                })
        
        let bars = htmbars;
        bars = bars.merge(vtmbars);
        bars.append('title')
                .html('Fire')

    }

}