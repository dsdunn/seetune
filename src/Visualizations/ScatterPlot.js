import React, { Component } from 'react';
import * as d3 from 'd3';

import './Visualizations.css';
import logo from '../loading.gif';

class ScatterPlot extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
  }

  componentDidMount() {
    this.makeSvg();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.topTracks) {
      return;
    }
    this.drawGraph(this.props.topTracks);
  }

  makeSvg = () => {
    this.margin = {top: 20, right: 80, bottom: 200, left: 80};
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.viz.current).append("svg")
         .attr("width", this.width + this.margin.right + this.margin.left)
         .attr("height", this.height + this.margin.top + this.margin.bottom)
  }

  drawGraph = (tracks) => {
    
  }

  render() {
    return (
        <div className='ScatterPlot'>
          <h4>Scatter Plot with collision detection</h4>
          {
            this.props.loading && 
            <img className='loading' src={logo}/>
          }
          <div ref={ this.viz }>
          </div>
        </div>
      )
  }
}

export default ScatterPlot;

















