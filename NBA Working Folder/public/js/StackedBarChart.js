class StackedBarChart{
    constructor(chartData, teams, svgID, statCol, yMax,statTag,playerCard) {
        this.chartData = chartData
        this.teams = teams;
        this.statTag = statTag;
        this.playerCard = playerCard;
        
        this.chartBounds = d3.select('.summaryChart').node().getBoundingClientRect();
        this.chartWidth = this.chartBounds.width;
        this.chartHeight = this.chartBounds.height;
        
        this.htmColorScale = d3.scaleLinear()
                        .domain([0,this.chartData[0].map(a => a[3])[0]])
                        .range(['#fff','#900'])
        this.vtmColorScale = d3.scaleLinear()
                        .domain([0,this.chartData[1].map(a => a[3])[0]])
                        .range(['#fff','#009'])

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

        this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('ne')
			.offset(function() {
				return ([0,0]);
            });



        this.drawBars();
    }    

    drawBars() {
        let that = this;

        this.tip.html((d) => { 
            let jersey = this.teams.htm.players.map(a => [a.playerid,a.jersey])
                 .concat(this.teams.vtm.players.map(a => [a.playerid,a.jersey])).filter(e => { return e[0] == d[1] })[0][1];
            return "<div class='stat'><svg><text x='100' y='40' fill='#fff' font-size='50' text-anchor='end'>#" +jersey+"</text>" +
            "<text x='105' y='20' fill='#fff' font-size='20'>" + d[2].split(' ')[0] + "</text>" +
            "<text x='105' y='40' fill='#fff' font-size='20' font-weight='bold'>" + d[2].split(' ')[d[2].split(' ').length - 1] + "</text>" +
            "<text x='110' y='65' fill='#fff' font-size='20' text-anchor='end'>" + this.statTag[0] +":</text>" +
            "<text x='115' y='65' fill='#fff' font-size='20'>" + d[3] + "</text></svg></div>"
        });

        let yScaleMax = this.chartHeight - 80;
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
        this.svg.call(this.tip);

        let htmbars = wrapper.append('g').classed('stacked-bars',true).selectAll('rect').data(this.chartData[0])
        wrapper.append('g').classed('x-axis',true)
            .call(xAxis);
        wrapper.append('g').classed('y-axis',true)
            .call(yAxis);

        let htmbarsEnter = htmbars.enter().append('rect');
        htmbars.exit().remove()
        htmbars = htmbarsEnter.merge(htmbars)
        
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
            .attr('fill', (d,i) => this.htmColorScale(d[3]))
            .on('mouseenter', d => {
                console.log(d)
                d3.selectAll('.p' + d[1]).classed('selectedA',true);
            })
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
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
            .attr('fill', (d,i) => this.vtmColorScale(d[3]))
            .on('mouseenter', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',true);
            })
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
            .on('mouseleave', d => {
                d3.selectAll('.p' + d[1]).classed('selectedA',false)
            })
        

        wrapper.selectAll('.stacked-bars').append('text')
            .attr('x',((this.chartWidth - 50)/3) + 15)
            .attr('y',this.yScale(0)+20)
            .text(this.teams.vtm.abbreviation)
        wrapper.selectAll('.stacked-bars').append('text')
            .attr('x',(this.chartWidth - 50)*(2/3) + 15)
            .attr('y',this.yScale(0)+20)
            .text(this.teams.htm.abbreviation)
        let xPos = wrapper.node().getBoundingClientRect().width;
        wrapper.append('text').classed('chartTitle',true)
            .attr('text-anchor','end')
            .attr('x', xPos)
            .attr('y', 25)
            .text(this.statTag[1])

    }

}