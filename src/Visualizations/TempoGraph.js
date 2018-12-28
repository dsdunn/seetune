import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
  }

  componentDidMount() {
    this.svgContainer = d3.select(this.viz.current).append("svg")
                     .attr("width",650)
                     .attr("height",650);

  
  }

  componentDidUpdate(prevProps, nextProps) {

    let circles = this.svgContainer.selectAll("circle")
                           .data(this.props.topTracks)
                           .enter()
                           .append("circle")

    let text = this.svgContainer.selectAll("text")
                          .data(this.props.topTracks)
                          .enter()
                          .append("text")
                          .text( function(d) { return d.title })

    let textAttributes = text
                          .attr("x", function(d) { return d.popularity * 3 + 3})
                          .attr("y", function(d) { return d.audioFeatures.tempo * 3 - 3})
                          .attr("font-size", "12px")
                          .attr("font-family", "sans-serif")
                          .attr("fill", "red")

    let circleAttributes = circles
                            .attr("cx", function (d) { 
                              return d.popularity * 3; 
                            })
                            .attr("cy", function (d) { return d.audioFeatures.tempo * 3 })
                            .attr("r", function (d) { return 8; })
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
