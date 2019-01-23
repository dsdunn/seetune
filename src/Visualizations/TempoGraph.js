import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';

import './Visualizations.css';
import logo from '../loading.gif';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
    this.state = {
      param: this.props.param
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

    if (!this.props.topTracks) {
      return;
    }

    if (prevProps.param !== this.props.param || prevProps.range !== this.props.range) {
      console.log('update graph state')
      this.setState({
        param: this.props.param,
        range: this.props.range
      })
    }

    this.drawGraph(this.props.topTracks, this.props.param);
             
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
    // let toolTip = this.svgContainer.append('g')
    //   .attr('class', 'tool-tip')
    //   .style('opacity', 1e-6)
      


    let t = d3.transition().duration(1000);
    
    this.svgContainer.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.height + 5) + ')')

    d3.select('.y-label')
      .remove()
      
    this.svgContainer.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.state.param == 'popularity' ? 'Popularity': 'Beats Per Minute')

    this.svgContainer.append('g')
      .attr('class', 'y axis');
 

    x.domain(sortedTracks.map(function(d){ return d.title }))
    y.domain([0, d3.max(sortedTracks, function(d) { return d[param] }) + 20])

    graph.enter()
        .append('rect')
        .on('mouseover', function(d) {
          d3.select(this)
            .style('fill', '#a62c19')
        //   toolTip.html(`<div><p>title: ${d.title}</p></div>`)
        //     // .attr('x', d3.event.srcElement.attributes.x)
        //     // .attr('y', d3.event.srcElement.attributes.y)
            .transition()
              .duration(300)
        })
        .on('mouseout', function(d) {
          d3.select(this)
            .style('fill', 'steelblue')
          .transition()
            .duration(300)
        //     .style('opacity', 1e-6)
        })
      .merge(graph)
      .transition(t)
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.title); })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d[param]); })
        .attr('height', function(d) { return height - y(d[param]); })
        .style('fill', 'steelblue');

      graph.exit()
        .transition(t)
        .attr('opacity', 0)
        .remove()



    d3.select('.x').transition(t)
        .call(d3.axisBottom().scale(x));

    d3.selectAll('.x text')
      .attr('transform', 'translate(-11,3) rotate(290)')
      .style('text-anchor', 'end');
      
    d3.select('.y').transition(t)
        .call(d3.axisLeft().scale(y));
  }

  render(){

    return (
      <div className='TempoGraph'>
        <h4>Top Tracks sorted by {this.state.param}</h4>
        {
          this.props.loading &&
            <img className="loading" src={ logo }/>  
        }
        <div ref={ this.viz }>
        </div>
      </div> 
    )
  }
}

export default withRouter(TempoGraph);
