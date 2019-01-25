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

    if (!this.props.topTracks ) {
      return;
    }
    this.drawGraph(this.props.topTracks);
  }

  makeSvg = () => {
    this.margin = {top: 20, right: 80, bottom: 200, left: 80};
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.scat.current).append("svg")
        .attr("width", this.width + this.margin.right + this.margin.left)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  drawGraph = (tracks) => {
    let x = d3.scaleLinear()
      .range([0, this.width]);
    let y = d3.scaleLinear()
      .range([this.height, 0]);
    let plot = this.svgContainer.selectAll('.node')
      .data(tracks, d => { return d.title; });

    this.svgContainer.append('g')
      .attr('class', 'x2 axis')
      .attr('transform', 'translate(0,' + (this.height + 5) + ')');
    this.svgContainer.append('g')
      .attr('class', 'y2 axis')

    const parseTime = d3.timeParse("%Y-%m-%d");
    const parseYear = d3.timeParse('%Y');

    x.domain([
      d3.min(tracks, function(d) {
        return parseTime(d.releaseDate) || parseYear(d.releaseDate); 
      }), 
      d3.max(tracks, function(d) { 
        return parseTime(d.releaseDate) || parseYear(d.releaseDate); 
      })
    ]);

    y.domain([d3.min(tracks, function(d) {return d.energy; }), d3.max(tracks, function(d) { return d.energy; })])

    plot.enter()
        .append('circle')
      .merge(plot)
        .attr('class', 'node')
        .attr('r', '10px')
        .attr('cx', function(d) {
          return x(parseTime(d.releaseDate) || parseYear(d.releaseDate))
        })
        .attr('cy', function(d) {
          return y(d.energy)
        })
        .style('fill', 'orange')
        .on('mouseover', function(d) {
          console.log(d)
        })


    plot.exit().remove()

    d3.select('.x2')
      .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%Y")));

    d3.select('.y2')
      .call(d3.axisLeft().scale(y));

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

















