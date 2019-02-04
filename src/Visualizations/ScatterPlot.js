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
      .domain([0, 1]);

    let sizeScale = d3.scaleLinear()
      .range([7, 20])
      .domain([d3.min(tracks, function(d) {
        return d.popularity;
      }),
      d3.max(tracks, function(d) {
        return d.popularity;
      })]);

    const parseTime = d3.timeParse("%Y-%m-%d");
    const parseYear = d3.timeParse('%Y');

    // function keyMap(num) {
    //   let keys = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

    //   return keys[num];
    // }

    this.svgContainer.append('g')
      .attr('class', 'x2 axis')
      .attr('transform', 'translate(0,' + (this.height / 2) + ')');
    this.svgContainer.append('text')
      .attr('class', 'major-label')
      .text('Major Key')
      .attr('transform', 'translate(-40,' + this.height * .3 + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'minor-label')
      .text('Minor Key')
      .attr('transform', 'translate(-40,' + this.height * .75 + ') rotate(270)')
    this.svgContainer.append('text')
      .attr('class', 'x-label')
      .text('Release')
      .attr('transform', 'translate(-60,' + this.height * .5 + ')')

    let toolTip = d3.select('body').append('div')
      .attr('class', 'tool-tip')
      .style('opacity', 1e-6)
      .style('background', 'white')

    x.domain([
      d3.min(tracks, function(d) {
        return parseTime(d.releaseDate) || parseYear(d.releaseDate); 
      }), 
      new Date()
    ]);

    y.domain([0, 1])

    let simulation = d3.forceSimulation(tracks)
      .velocityDecay(0.7)
      .force("x", d3.forceX(function(d) { return x(parseTime(d.releaseDate) || parseYear(d.releaseDate)) - 18; }).strength(1))
      .force("y", d3.forceY(y(0.5)))
      .force("y2", d3.forceY(function(d) { return y(d.mode); }))
      .force("collide", d3.forceCollide().radius(function(d) { return sizeScale(d.popularity) }))
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
          toolTip.html(`<div>
            <img src='${d.coverArt.url}'/>
            <p>${d.title}</p>
            <p>by: ${d.artistName} </p>
            <p>popularity: ${d.popularity}</p>
            <p>energy: ${d.energy}</p>
            <p>released: ${d.releaseDate}</p>
            </div>`)
            .style('left', '530px')
            .style('top', '900px')
            .transition()
              .duration(300)
              .style('opacity', .9)
        })
        .on('mouseout', function(d) {
          d3.select(this).transition().duration(200)
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

















