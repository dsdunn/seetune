import React, { Component } from 'react';
import * as d3 from 'd3';

import './Visualizations.css';
import logo from '../loading.gif';

class ScatterPlot extends Component {
  constructor(props){
    super(props);
    this.scat = React.createRef();
  }

  componentDidMount() {
    this.makeSvg();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('update')
    if (this.props.loading) {
      return;
    }
    this.drawGraph(this.props.topTracks);
  }

  makeSvg = () => {
    this.margin = {top: 20, right: 80, bottom: 200, left: 80};
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 800 - this.margin.top - this.margin.bottom;

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
      .range(['#3944c7','#f12d0e','#881503'])
      .domain([d3.min(tracks, function(d) {
        return d.tempo;
      }),
      d3.max(tracks, function(d) {
        return d.tempo
      }) + 10]);

    let sizeScale = d3.scaleLinear()
      .range([7, 20])
      .domain([d3.min(tracks, function(d) {
        return d.duration_ms;
      }),
      d3.max(tracks, function(d) {
        return d.duration_ms;
      })]);


    // let plot = this.svgContainer.selectAll('g.node')
    //   .data(tracks, d => { return d.title; });

    const parseTime = d3.timeParse("%Y-%m-%d");
    const parseYear = d3.timeParse('%Y');

    function keyMap(num) {
      let keys = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

      return keys[num - 1];
    }

    this.svgContainer.append('g')
      .attr('class', 'x2 axis')
      .attr('transform', 'translate(0,' + (this.height / 2) + ')');
    this.svgContainer.append('text')
      .attr('class', 'major-label')
      .text('Major Key')
      .attr('transform', 'translate(-40,' + this.height / 10 + ')')
    this.svgContainer.append('text')
      .attr('class', 'minor-label')
      .text('Minor Key')
      .attr('transform', 'translate(-40,' + this.height * .9 + ')')
    this.svgContainer.append('text')
      .attr('class', 'x-label')
      .text('Release Date')
      .attr('transform', 'translate(-40,' + this.height * .47 + ')')

    x.domain([
      d3.min(tracks, function(d) {
        return parseTime(d.releaseDate) || parseYear(d.releaseDate); 
      }) - 94608000000, 
      new Date()
    ]);

    y.domain([0, 1])

    let simulation = d3.forceSimulation(tracks)
      .velocityDecay(0.7)
      .force("x", d3.forceX(function(d) { return x(parseTime(d.releaseDate) || parseYear(d.releaseDate)); }).strength(1))
      .force("y", d3.forceY(y(0.5)))
      .force("y2", d3.forceY(function(d) { return y(d.mode); }))
      .force("collide", d3.forceCollide().radius(function(d) { return 18 }).iterations(16))
      .on('tick', ticked);


    // let defs = d3.select('.scatter')
    //   .append('def')

    // tracks.forEach(function(d) {
    //   defs.append('clip-path')
    //   .attr('id', d.title)
    //   .append('circle')
    //     .attr('r', 18)
    //     .attr('cx', d.x)
    //     .attr('cy', d.y)
    // })

    function ticked() {

      let node = d3.select('.scatter')
        .selectAll('image')
        .data(tracks, function(d) { return d.title })
        
      node.enter()
        .append('image')
        .merge(node)
        .attr('class', 'circle')
        .attr('height', 36)
        .attr('width', 36)
        .attr('x', function(d) {
          return d.x
        })
        .attr('y', function(d) {
          return d.y
        })
        .attr('xlink:href', function(d) { return d.coverArt.url })
        .on('mouseover', function(d) {
          console.log(d)
        })
        node.exit().remove();
      }

    d3.select('.x2')
      .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%Y")));

  }

  render() {
    return (
        <div className='ScatterPlot'>
          <h4>Scatter Plot with collision detection</h4>
          {
            this.props.loading && 
            <img className='loading' src={logo}/>
          }
          <div ref={ this.scat }>
          </div>
        </div>
      )
  }
}

export default ScatterPlot;

















