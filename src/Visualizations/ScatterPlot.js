import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from '../assets/loading.gif';

class ScatterPlot extends Component {
  constructor(props){
    super(props);
    this.scat = React.createRef();
    this.parseDay = d3.timeParse('%Y-%m-%d');
    this.parseYear = d3.timeParse('%Y');
    this.keys = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
    this.state = {
      param: 'releaseDate'
    }
  }

  componentDidMount() {
    this.makeSvg();
    if(this.props.topTracks) {
      this.drawGraph(this.props.topTracks)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loading) {
      return;
    }
    this.drawGraph(this.props.topTracks);
  }

  makeSvg = () => {
    this.margin = {top: 45, right: 35, bottom: 30, left: 35};
    this.width = (window.innerWidth <= 1800 ? window.innerWidth * .95 : 1800) - this.margin.left - this.margin.right;
    this.height = (window.innerHeight * .75) - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.scat.current).append("svg")
        .attr("width", this.width + this.margin.right + this.margin.left)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('class', 'scatter')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  drawGraph = (tracks, param = this.state.param) => {

    d3.select('.x-label')
      .remove()
    
    this.svgContainer.append('g')
      .attr('class', 'x2 axis')
      .attr('transform', 'translate(0,' + (this.height / 2 - 10) + ')');
    this.svgContainer.append('text')
      .attr('class', 'major-label')
      .text('Major Key')
      .style('fill', '#d5cdc6')
      .attr('transform', 'translate(0,' + this.height * .4 + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'minor-label')
      .text('Minor Key')
      .style('fill', '#d5cdc6')
      .attr('transform', 'translate(0,' + (this.height * .5 + 124) + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'x-label')
      .text(param === 'releaseDate' ? 'Date' : 'Key')
      .style('fill', '#d5cdc6')
      .attr('transform', 'translate(-25,' + this.height * .5 + ')')

    let x = (param === 'releaseDate' ? d3.scaleTime() : d3.scaleBand().align([1]))
      .range([this.margin.left, this.width - this.margin.right]);

    x.domain(this.setXDomain(tracks, this.state.param));

    let y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 1])
    let colorScale = d3.scaleLinear()
      .range(['#3944c7','#f12d0e'])
      .domain([0, 1]);
    let sizeScale = d3.scaleLinear()
      .range([7, 20])
      .domain([d3.min(tracks, function(d) {
        return d.popularity;
      }),
      d3.max(tracks, function(d) {
        return d.popularity;
      })]);
    const keyMap = (num) => {
      return this.keys[num];
    }
    let toolTip = d3.select('body').append('div')
      .attr('class', 'tool-tip')
      .style('opacity', 1e-6)
      // .on('click', function(){
      //   d3.select(this)
      //     .classed('hide', true)
      //     .classed('show', false)
      // })

    d3.forceSimulation(tracks)
      .velocityDecay(.6)
      .force("x", d3.forceX((d) => { 
        return param === 'key' ? x(keyMap(d.key)) + 40 : x(this.parseDay(d.releaseDate) || this.parseYear(d.releaseDate)); 
      }).strength(.5))
      .force("y", d3.forceY(y(0.5)))
      .force("y2", d3.forceY(function(d) { return y(d.mode); }))
      .force("collide", d3.forceCollide().radius(function(d) { return sizeScale(d.popularity) + .5 }).iterations(16))
      .on('tick', ticked);

    let node = d3.select('.scatter')
      .selectAll('.track')
      .data(tracks, function(d) { return d.id })

    node.exit()
      .remove();

    node = node.enter()
        .append('circle')
        .attr('class', 'track')
        .attr('r', function(d) { return sizeScale(d.popularity); })
        .style('fill', function(d) { return colorScale(d.energy)})
        .style('stroke', '#191414')
        .on('mouseover', function(d) {
          d3.select(this).transition()
            .duration(300)
            .style('stroke', '#fede5a');

          d3.select('.brand')
            .transition()
            .duration(300)
            .style('opacity', 0)

          toolTip.html(`
            <img src='${d.coverArt.url}'/>
            <div class='tool-tip-info'>
              <p class='tip-title'>
                "${d.title}"
              <p>
              <p class='tip-artist'>
                ${d.artistName}
              </p>
              <p class='tip-release'>
                ${d.releaseDate}
              </p>
              <p class='tip-dancability'>
                ${keyMap(d.key) + (d.mode === 1 ? " Major" : " Minor")}
              </li>
              <p class='tip-energy'>
                ${d.energy} energy
              </p>
              <p class='tip-genres'>
                ${d.genres.join(', ')}
              </p>
            </div>
            `)
            .classed('hide', false)
            .classed('show', true)
            .transition()
              .duration(300)
              .style('opacity', 0.9)
        })
        .on('pointerout', function(d) {
          d3.select(this).transition()
            .duration(200)
            .style('stroke', '#191414')

          d3.select('.brand')
            .transition()
            .duration(300)
            .style('opacity', .1)

          toolTip
            .transition()
              .duration(300)
              .style('opacity', 1e-6)
              .on('end', () => {  
                toolTip
                  .classed('hide', true)
                  .classed('show', false)
              })
        })
        .merge(node)


    function ticked() {
      node.attr('cx', function(d) {
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
    }

    if (this.state.param === 'releaseDate') {
      d3.select('.x2')
        .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%Y")));
    } else {
      d3.select('.x2')
        .call(d3.axisBottom().scale(x))
    }
  }

  setXDomain = (tracks, param) => {
    switch(param) {
      case 'releaseDate':
        return [
          d3.min(tracks, (d) => {
            return this.parseDay(d.releaseDate) || this.parseYear(d.releaseDate); 
          }), 
          new Date()
        ];
      default:
        return this.keys;
    }
  }

  handleParamChange = (event) => {
    let param = event.target.value;

    this.setState({ param });
  }

  render() {
    return (
        <div className='ScatterPlot'>
          {
            this.props.loading && 
            <img className='loading' src={logo} alt='loading gif'/>
          }
          <div className='graph-parameter'>
            <label htmlFor='param'>X-Axis: </label>
            <select name='param' value={this.state.param} onChange={this.handleParamChange}>
              <option value='releaseDate' >Release Date</option>
              <option value='key'>Key</option>   
            </select>
          </div>
          <div className='graph' ref={ this.scat }>
          </div>
          <div className='legend'>
              <div className='legend-svg'>
                <svg height='52' width='195'>
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3944c7" />
                      <stop offset="100%" stopColor="#f12d0e" />
                    </linearGradient>
                  </defs>
                  <text fill='white' x='2' y='29'>energy: </text>
                  <rect x='62' y='13' height='23' width='130' fill='url(#grad1)'/>
                  <text x='66' y='30'>low</text>
                  <text x='158' y='30'>high</text>
                </svg>
              </div>
              <div className='legend-svg'>
                <svg height='52' width='195'>
                  <text fill='white' x='2' y='29'>popularity: </text>
                  <circle r='6' cx='105' cy='25' stroke='#fede5a' fill='none'/>
                  <text fill='white' x='84' y='30'>0</text>
                  <circle r='19' cx='145' cy='24' stroke='#fede5a' fill='none'/>
                  <text fill='white' x='130' y='29'>100</text>
                </svg>
              </div>
          </div>
        </div>
      )
  }
}

export default ScatterPlot;

















