import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import * as d3 from 'd3';

function MultiLineChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    const margin = {
      top: 20, right: 40, bottom: 50, left: 40,
    };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scalePoint().domain(data.map((d) => d.x)).range([0, width]);

    const yScale1 = d3.scaleLinear().domain([0, d3.max(data, (d) => d.y1)]).range([height, 0]);
    const yScale2 = d3.scaleLinear().domain([0, d3.max(data, (d) => d.y2)]).range([height, 0]);

    const line1 = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale1(d.y1));

    const line2 = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale2(d.y2));

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').call(d3.axisLeft(yScale1));
    svg.append('g').attr('transform', `translate(${width},0)`).call(d3.axisRight(yScale2));

    svg
      .append('path')
      .datum(data)
      .attr('class', 'line1')
      .attr('d', line1)
      .style('fill', 'none')
      .style('stroke', 'blue');

    svg
      .append('path')
      .datum(data)
      .attr('class', 'line2')
      .attr('d', line2)
      .style('fill', 'none')
      .style('stroke', 'red');
  }, [data]);

  return <Box ref={chartRef} />;
}

export default MultiLineChart;
