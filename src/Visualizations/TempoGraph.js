import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
  }

  componentDidMount() {

      var circleData = [
      { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
      { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }];

      var svgContainer = d3.select(this.viz.current).append("svg")
                                       .attr("width",200)
                                       .attr("height",200);

      var circles = svgContainer.selectAll("circle")
                             .data(circleData)
                             .enter()
                             .append("circle");

      var circleAttributes = circles
                              .attr("cx", function (d) { return d.cx; })
                              .attr("cy", function (d) { return d.cy; })
                              .attr("r", function (d) { return d.radius; })
                              .style("fill", function (d) { return d.color; });

  }




  render(){
    return (      
      <div ref={ this.viz }>
      </div>  
    )
  }
}

export default withRouter(TempoGraph);
