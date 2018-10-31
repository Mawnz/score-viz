<template>
	<div class="line-chart__wrapper">
		<svg></svg>
	</div>
</template>

<script>
/*
 * Author: Måns Åberg
 *
 * Written: 2018-10
 *
 * License: MIT
 *
 */

/* eslint-disable indent */

/* Import D3 and an improved typeof function */
import * as d3 from 'd3';
import { toType } from './tools';

export default {
	name: 'LineChart',
	props: {
		chartData: Array,
		xAxis: {
			type: String,
			default: () => ('x'),
		},
		yAxis: {
			type: String,
			default: () => ('y'),
		},
		xAxisText: String,
		yAxisText: String,
	},
	data() {
		return {
			duration: 500,
			svg: null,
			g: null,
			margin: { top: 20, right: 20, bottom: 30, left: 50 },
			width: 0,
			height: 0,
			parseTime: d3.timeParse('%Y%m%d'),
			xAxisG: null,
			yAxisG: null,
		};
	},
	mounted() {
		/* Save height and width */
		this.width = this.$el.offsetWidth; this.height = this.$el.offsetHeight;
		/* Attach listener on window to handle resizing component */
		window.addEventListener('resize', this.onResize);
		/* Save svg as variable on instance for later */
		this.svg = d3.select('svg');
		/* Initialize svg elements that are constant */
		this.init();
		/* Call update function to populate the chart with data */
		this.update(this.chartData, []);
	},
	computed: {
		/*
		 * Property that calculates the format of the x axis based on the first element in our data
		 */
		xAxisType() {
			if(!this.chartData || this.chartData.length === 0) return null
			return toType(this.chartData[0].values[0][this.xAxis]);
		},
		/*
		 * Property that calculates the padding for the content in our svg
		 */
		padded() {
			const width = this.width - this.margin.left - this.margin.right;
			const height = this.height - this.margin.top - this.margin.bottom;
			return { w: width, h: height };
		},
		/*
		 * Returns the correct scale for our data based on computed datatype
		 */
		x() {
			const scales = {
				date: d3.scaleTime().range([0, this.padded.w]),
				number: d3.scaleLinear().range([0, this.padded.w]),
			};
			return scales[this.xAxisType];
		},
		/*
		 * Returns a linear scale for our y axis with range set to the height of our svg content
		 */
		y() {
			return d3.scaleLinear().range([this.padded.h, 0]);
		},
		/*
		 * Returns a color scale with ten (10) colors
		 */
		z() {
			return d3.scaleOrdinal(d3.schemeCategory10);
		},
		/*
		 * Returns a d3.line with our x- and y axes
		 */
		line() {
			return d3.line()
				.curve(d3.curveBasis)
				.x(d => this.x(d[this.xAxis]))
				.y(d => this.y(d[this.yAxis]));
		},
	},
	/*
	 * Watchers
	 */
	watch: {
		/*
		 * Whenever new data is present in the component we update the chart
		 */
		chartData(newData, oldData) {
			this.update(newData, oldData);
		},
	},
	/*
	 * Component methods
	 */
	methods: {
		/*
		 * Whenever the window is resized we assign new values to our height and width
		 */
		onResize() {
			this.width = this.$el.offsetWidth; this.height = this.$el.offsetHeight;
			this.update(this.chartData, []);
		},
		/*
		 * Initializes constant elements in the svg
		 */
		init() {
			/* Set the size of our svg */
			this.svg
				.attr('height', this.height)
				.attr('width', this.width);

			/* Append group to hold our graphical elements and align inside svg using margins */
			this.g = this.svg.append('svg:g')
				.attr('height', this.padded.h)
				.attr('width', this.padded.w)
				.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

			/* Axis */
			this.xAxisG = this.g.append('svg:g')
				.attr('class', 'axis axis--x');
			this.yAxisG = this.g.append('svg:g')
				.attr('class', 'axis axis--y');

			this.yAxisG.append('svg:text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 6)
				.attr('dy', '0.71em')
				.attr('fill', '#000')
				.text(this.yAxisText);
		},
		/*
		 * Update function that renders the chart using the data provided
		 * Will transition from the old dataset if it is of the same dimensions
		 * as the data coming in (newData). Or do a clean sweep if the dimensions are
		 * not the same.
		 */
		update(newData, oldData) {
			if(!newData || newData.length === 0) return this.redraw([])
			/* Set up domains */
			this.x.domain(d3.extent(newData[0].values, d => d[this.xAxis]));
			this.y.domain([
				d3.min(newData, d => d3.min(d.values, v => v[this.yAxis])),
				d3.max(newData, d => d3.max(d.values, v => v[this.yAxis])),
			]);
			this.z.domain(newData.map(d => d.id));
			/* Update axes */
			this.xAxisG.call(d3.axisBottom(this.x))
				.attr('transform', `translate(0, ${this.padded.h})`);
			this.yAxisG.call(d3.axisLeft(this.y));
			/* Determine redraw or animate based on length of data */
			if (this.isEqual(newData, oldData)) this.redraw(newData);
			else this.redraw(newData);
		},
		isEqual(n, o) {
			/* First case, we get different nubmer of lines */
			if (n.length !== o.length)	return false;
			/* Second case, same amout of lines, but different amount of points */
			else if (n.length === o.length && n[0].values.length !== o[0].values.length) return false;
			/* Otherwise true */
			return true;
		},
		/*
		 * Animates each point to each respective new position
		 */
		animateDraw(newData) {
			this.g.selectAll('.dataline').exit();
			const dline = this.g.selectAll('.dataline')
				.data(newData).enter();

			dline.select('path')
				// .duration(this.duration)
				.attr('d', (d) => {
					return this.line(d.values);
				})
				.style('stroke', d => this.z(d.id));
		},
		/*
		 * Redraws all the lines
		 */
		redraw(newData) {
			/* Remove all the lines */
			this.g.selectAll('.dataline').remove().exit();
			if(!newData || newData.length === 0) return
			/* Adding the new lines */
			const dLine = this.g.selectAll('.dataline')
				.data(newData)
				.enter().append('svg:g')
					.attr('class', 'dataline');

			dLine.append('svg:path')
				.attr('class', 'line')
				.attr('d', d => this.line(d.values))
				.style('stroke', d => this.z(d.id))
				.style('stroke-width', '2px')
				.style('transition', 'all 0.1s ease')
				.style('fill', 'none')
				.call(this.events);
			/*
			dLine.append('svg:circle')
				.attr('x', 0)
				.attr('y', 0)
				.attr('r', '5px')
				.attr('fill', d => this.z(d.id));
			*/
			dLine.append('svg:text')
				.datum(d => ({ id: d.id, value: d.values[d.values.length - 1] }))
				.attr('transform', d => `translate(${this.x(d.value[this.xAxis])}, ${this.y(d.value[this.yAxis])})`)
				.attr('x', 3)
				.attr('dy', '0.35em')
				.style('font', '10px sans-serif')
				.text(d => d.id);
		},
		events(d) {
			d
				.on('mouseover', this.mouseover)
				.on('mouseout', this.mouseout);
		},
		mouseover() {
			d3.select(d3.event.target)
				.style('cursor', 'pointer')
				.style('stroke-width', '5px');
		},
		mouseout() {
			d3.select(d3.event.target)
				.style('cursor', 'default')
				.style('stroke-width', '2px');
		},
	},
};

</script>

<style scoped lang = "scss">
	.axis--x path {
		display: none;
	}
	.line {
		cursor: pointer;
		transition: all 0.3s ease;
	}
	.line-chart__wrapper {
		height: 100%;
		width: 100%;
	}
</style>
