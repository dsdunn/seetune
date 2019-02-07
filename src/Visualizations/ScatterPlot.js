import React, { Component } from 'react';
import * as d3 from 'd3';
import { withRouter } from 'react-router-dom'
import logo from '../assets/loading.gif';

class ScatterPlot extends Component {
  constructor(props){
    super(props);
    this.scat = React.createRef();
  }

  componentDidMount() {
    console.log('scatter mount')
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
    this.margin = {top: 40, right: 60, bottom: 150, left: 60};
    this.width = (window.innerWidth * .95) - this.margin.left - this.margin.right;
    this.height = (window.innerHeight * .9) - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.scat.current).append("svg")
        .attr("width", this.width + this.margin.right + this.margin.left)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('class', 'scatter')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  drawGraph = (tracks) => {

    let x = d3.scaleTime()
      .range([0, this.width]);

    let y = d3.scaleLinear()
      .range([this.height, 0]);

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

    const parseDay = d3.timeParse('%Y-%m-%d');
    const parseYear = d3.timeParse('%Y');

    function keyMap(num) {
      let keys = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

      return keys[num];
    }

    this.svgContainer.append('g')
      .attr('class', 'x2 axis')
      .attr('transform', 'translate(0,' + (this.height / 2) + ')');
    this.svgContainer.append('text')
      .attr('class', 'major-label')
      .text('Major Key')
      .style('fill', 'white')
      .attr('transform', 'translate(-40,' + this.height * .3 + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'minor-label')
      .text('Minor Key')
      .style('fill', 'white')
      .attr('transform', 'translate(-40,' + this.height * .75 + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'x-label')
      .text('Release')
      .style('fill', 'white')
      .attr('transform', 'translate(-60,' + this.height * .5 + ')')

    let toolTip = d3.select('body').append('div')
      .attr('class', 'tool-tip')
      .style('opacity', 1e-6)
      .style('background', 'white')

    x.domain([
      d3.min(tracks, function(d) {
        return parseDay(d.releaseDate) || parseYear(d.releaseDate); 
      }), 
      new Date()
    ]);

    y.domain([0, 1])

    let simulation = d3.forceSimulation(tracks)
      .velocityDecay(0.7)
      .force("x", d3.forceX(function(d) { return x(parseDay(d.releaseDate) || parseYear(d.releaseDate)) - 18; }).strength(1))
      .force("y", d3.forceY(y(0.5)))
      .force("y2", d3.forceY(function(d) { return y(d.mode); }))
      .force("collide", d3.forceCollide().radius(function(d) { return sizeScale(d.popularity) + .5 }))
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
        .on('mouseover', function(d) {
          d3.select(this).transition()
            .duration(300)
            .style('stroke', '#1DB954');
          toolTip.html(`
            <img src='${d.coverArt.url}'/>
            <table>
              <tr class='tip-title'>
                <td class='category'>title: </td>
                <td> ${d.title}</td>
              <tr>
              <tr class='tip-artist'>
                <td class='category'>artist: </td>
                <td> ${d.artistName}</td>
              </tr>
              <tr class='tip-tempo'>
                <td class='category'>energy: </td>
                <td> ${d.energy}</td>
              </tr>
              <tr class='tip-popularity'>
                <td class='category'>release date: </td>
                <td> ${d.releaseDate}</td>
              </tr>
              <tr class='tip-dancability'>
                <td class='category'>key: </td>
                <td> ${keyMap(d.key) + (d.mode === 1 ? " Major" : " Minor")}</td>
              </tr>
              <tr class='tip-duration'>
                <td class='category'>genres: </td>
                <td> ${d.genres.join(', ')}</td>
              </tr>
            </table>
            `)
            .transition()
              .duration(300)
              .style('opacity', .8)
        })
        .on('mouseout', function(d) {
          d3.select(this).transition()
            .duration(200)
            .style('stroke', 'none')
          toolTip
            .transition()
              .duration(300)
              .style('opacity', 1e-6)
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

    d3.select('.x2')
      .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%Y")));

  }

  render() {
    return (
        <div className='ScatterPlot'>
          {
            this.props.loading && 
            <img className='loading' src={logo}/>
          }
          <div className='legend'>
            <svg height='100' width='200'>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3944c7" />
                  <stop offset="100%" stopColor="#f12d0e" />
                </linearGradient>
              </defs>
              <text fill='white' x='4' y='25'>popularity: </text>
              <circle r='7' cx='96' cy='20' stroke='#fede5a'/>
              <text fill='white' x='106' y='25'> 0</text>
              <circle r='20' cx='155' cy='20' stroke='#fede5a'/>
              <text fill='white' x='140' y='25'> 100</text>
              <text fill='white' x='4' y='70'>energy: </text>
              <rect x='65' y='50' height='30' width='150' fill='url(#grad1)'/>
              <text fill='white' x='75' y='70'>0</text>
              <text fill='white' x='180' y='70'>1</text>
            </svg>
          </div>
          <div className='graph' ref={ this.scat }>
          </div>
        </div>
      )
  }
}

export default withRouter(ScatterPlot);

















