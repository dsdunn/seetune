import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
  }

  componentDidMount() {

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

  componentDidUpdate(prevProps, nextProps) {

    let height = this.height;

    let x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);
    

    let y = d3.scaleLinear()
      .range([this.height, 0])
    

    x.domain(this.props.topTracks.map(function(d){ return d.title }))

    y.domain([0, d3.max(this.props.topTracks, function(d) { return d.popularity })])

    this.svgContainer.selectAll('.bar')
      .data(this.props.topTracks)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(d.title); })
      .attr('width', x.bandwidth())
      .attr('y', function(d) { return y(d.popularity); })
      .attr('height', function(d) { 
        return height - y(d.popularity); })

    this.svgContainer.append('g')
        .attr('transform', 'translate(0,' + (this.height + 5) + ')')
        .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'translate(-11,3) rotate(290)')
        .style('text-anchor', 'end');

    this.svgContainer.append('g')
        .call(d3.axisLeft(y))
      


    // let circles = this.svgContainer.selectAll("circle")
    //                        .data(this.props.topTracks)
    //                        .enter()
    //                        .append("circle")

    // let text = this.svgContainer.selectAll("text")
    //                       .data(this.props.topTracks)
    //                       .enter()
    //                       .append("text")
    //                       .text( function(d) { return d.title })

    // let textAttributes = text
    //                       .attr("x", function(d) { return d.popularity * 3 + 3})
    //                       .attr("y", function(d) { return d.audioFeatures.tempo * 3 - 3})
    //                       .attr("font-size", "12px")
    //                       .attr("font-family", "sans-serif")
    //                       .attr("fill", "red")

    // let circleAttributes = circles
    //                         .attr("cx", function (d) { 
    //                           return d.popularity * 3; 
    //                         })
    //                         .attr("cy", function (d) { return d.audioFeatures.tempo * 3 })
    //                         .attr("r", function (d) { return 8; })
                            // .style("fill", 'blue')
                            

  }




  render(){
    return (      
      <div ref={ this.viz }>
      </div>  
    )
  }
}

export default withRouter(TempoGraph);
