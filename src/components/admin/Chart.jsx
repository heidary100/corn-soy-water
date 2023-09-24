import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Chart.css';
import { Checkbox, VStack } from '@chakra-ui/react';

function Chart({ data }) {
  const chartRef = useRef(null);
  const [showTotalAvailableWater, setShowTotalAvailableWater] = useState(true);
  const [showCropWaterStress, setShowCropWaterStress] = useState(true);

  useEffect(() => {
    // Define the dimensions and margins of the chart
    const margin = {
      top: 20,
      right: 80,
      bottom: 30,
      left: 50,
    };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create an SVG element to hold the chart

    const svg = d3
      .select(chartRef.current)
      .selectAll('*').remove()
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the date format
    const parseDate = d3.timeParse('%Y-%m-%d');

    // Define the scales for x and y axes
    const x = d3.scaleTime().range([0, width]);
    const y0 = d3.scaleLinear().range([height, 0]);
    const y1 = d3.scaleLinear().range([height, 0]);

    // Define the line generators for each data series
    const line1 = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y0(d.totalAvailableWater));

    const line2 = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y1(d.cropWaterStress));

    // Map and format your data here (ensure date is a Date object)
    const formattedData = data.map((d) => ({
      date: parseDate(d.date),
      totalAvailableWater: +d.totalAvailableWater,
      cropWaterStress: +d.cropWaterStress,
    }));

    // Define the domains for x and y axes
    x.domain(d3.extent(formattedData, (d) => d.date));
    y0.domain([0, d3.max(formattedData, (d) => d.totalAvailableWater)]);
    y1.domain([0, d3.max(formattedData, (d) => d.cropWaterStress)]);

    // Add x axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add left y axis
    svg.append('g').attr('class', 'y0-axis').call(d3.axisLeft(y0));

    // Add right y axis
    svg
      .append('g')
      .attr('class', 'y1-axis')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(y1));

    // Add the line for Total Available Water
    svg
      .append('path')
      .data([formattedData])
      .attr('class', 'line line1')
      .attr('d', line1);

    // Add the line for Crop Water Stress
    svg
      .append('path')
      .data([formattedData])
      .attr('class', 'line line2')
      .attr('d', line2);
    if (showTotalAvailableWater) {
      svg
        .append('path')
        .data([formattedData])
        .attr('class', 'line line1')
        .attr('d', line1);
    }

    // Add the line for Crop Water Stress if the checkbox is checked
    if (showCropWaterStress) {
      svg
        .append('path')
        .data([formattedData])
        .attr('class', 'line line2')
        .attr('d', line2);
    }
  }, [data, showTotalAvailableWater, showCropWaterStress]);

  return (
    <VStack spacing={4}>
      <VStack align="flex-start">
        <Checkbox
          isChecked={showTotalAvailableWater}
          onChange={() => setShowTotalAvailableWater(!showTotalAvailableWater)}
        >
          Total Available Water
        </Checkbox>
        <Checkbox
          isChecked={showCropWaterStress}
          onChange={() => setShowCropWaterStress(!showCropWaterStress)}
        >
          Crop Water Stress
        </Checkbox>
      </VStack>
      <svg ref={chartRef} width={200} height={200} />
    </VStack>
  );
}

export default Chart;
