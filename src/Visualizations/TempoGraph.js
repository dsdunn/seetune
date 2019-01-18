import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
    this.state = {
      param: 'popularity',
    }
  }

  componentDidMount() {
    this.makeSvg();
  }

  makeSvg = () => {
    this.margin = {top: 20, right: 20, bottom: 200, left: 40};
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.viz.current).append("svg")
         .attr("width", this.width + this.margin.right + this.margin.left)
         .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 
          'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  componentDidUpdate(prevProps, prevState) {

    if (!prevProps.topTracks && this.props.topTracks) {
      this.drawGraph();
    }               
  }

  sortTracks = (tracks, param = 'popularity') => {
    return tracks.sort((a,b) => {
      return a[param] - b[param];
    })
  }

  drawGraph = (topTracks = this.props.topTracks, param = this.state.param) => {
    let sortedTracks = this.sortTracks(topTracks, param);
    let height = this.height;
    let x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);
    let y = d3.scaleLinear()
      .range([this.height, 0])
    let graph = this.svgContainer.selectAll('.bar')
      .data(sortedTracks, d => { return d.title; });

    let t = d3.transition().duration(1000);
    
    let x_axis = this.svgContainer.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.height + 5) + ')')
    let y_axis = this.svgContainer.append('g')
      .attr('class', 'y axis');

    x.domain(sortedTracks.map(function(d){ return d.title }))
    y.domain([0, d3.max(sortedTracks, function(d) { return d[param] }) + 20])

    graph.enter()
        .append('rect')
      .merge(graph)
      .transition(t)
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.title); })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d[param]); })
        .attr('height', function(d) { return height - y(d[param]); })
        .style('fill', 'steelblue')

    d3.select('.x').transition(t)
        .call(d3.axisBottom().scale(x));

    d3.selectAll('.x text')
      .attr('transform', 'translate(-11,3) rotate(290)')
      .style('text-anchor', 'end');
      
    d3.select('.y').transition(t)
        .call(d3.axisLeft().scale(y));
  }

  handleParamChange = (event) => {
    let param = event.target.value;

    this.drawGraph(undefined, param);
    this.setState({ param });
  }

  render(){
    return (
      <div className='TempoGraph'>
        <select name='graph_parameter' value={this.param} onChange={this.handleParamChange}>
          <option value='popularity' >Popularity</option>
          <option value='tempo'>Tempo</option>   
        </select>
        <h4>Top Tracks sorted by {this.state.param}</h4>
        <div ref={ this.viz }>
        </div> 
      </div> 
    )
  }
}

export default withRouter(TempoGraph);
