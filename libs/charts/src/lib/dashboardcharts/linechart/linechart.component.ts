/* eslint-disable no-var */
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'dashboard-ui-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss'],
})
export class LinechartComponent implements OnInit {
  private margin = { top: 30, right: 20, bottom: 30, left: 40 };
  private width: number;
  private height: number;
  private x: any;
  private xAxisChart: any;
  private y: any;
  private yAxisChart: any;
  private z: any;
  private svg: any;
  private line: any;
  focus: any;
  hovered: any;
  _data!: any[];
  checkDate: string | undefined;
  isRendered = false;
  @Input()
  set data(value: any) {
    this._data = value;
  }
  get data() {
    return this._data;
  }
  _keys: any;
  @Input()
  set keys(value: any) {
    this._keys = value;
  }
  get keys() {
    return this._keys;
  }
  _color: any;
  @Input()
  set color(value: any) {
    this._color = value;
  }
  get color() {
    return this._color;
  }
  _xaxis: any;
  @Input()
  set xaxis(value: any) {
    this._xaxis = value;
  }
  get xaxis() {
    return this._xaxis;
  }
  _yaxis: any;
  @Input()
  set yaxis(value: any) {
    this._yaxis = value;
  }
  get yaxis() {
    return this._yaxis;
  }
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnChanges(_changes: SimpleChanges) {
    this.svgContainerRef.nativeElement.innerHTML = ''
    if (this.isRendered) {
      this._data &&
        this._data.forEach((element) => {
          if (element.date) {
            const parseTime = d3.timeParse('%d-%b-%y');
            element.date = new Date(element.date);
            // element.date = parseTime( element.date);
          }
        });
      this.width =
        this.svgContainerRef.nativeElement.offsetParent?.clientWidth -
        40 -
        this.margin.left -
        this.margin.right+ this._data.length*6;
      this.height =
        this.svgContainerRef.nativeElement.offsetParent?.clientHeight -
        90 -
        this.margin.top -
        this.margin.bottom;
      if (this._data.length) {
        this.checkDate =
          this._data && Object.keys(this._data[0]).find((x) => x == 'date');
      }
      this.init();

      setTimeout(() => this.draw(this._data, false), 100);
    }
  }
  ngOnInit() {
    this._data &&
      this._data.forEach((element) => {
        if (element.date) {
          const parseTime = d3.timeParse('%d-%b-%y');
          element.date = new Date(element.date);
          // element.date = parseTime( element.date);
        }
      });
    this.width =
      this.svgContainerRef.nativeElement.offsetParent?.clientWidth -
      40 -
      this.margin.left -
      this.margin.right+300+ this._data.length*6;
    this.height =
      this.svgContainerRef.nativeElement.offsetParent?.clientHeight -
      90 -
      this.margin.top -
      this.margin.bottom;
    if (this._data.length) {
      this.checkDate = Object.keys(this._data[0]).find((x) => x == 'date');
    }

    this.init();

    setTimeout(() => this.draw(this._data, false), 100);
    this.isRendered = true;
    // this.setTooltip();
  }

  private init() {
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    // SVG main
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom*1.7)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Axis define
    this.x = this.checkDate
      ? d3.scaleTime().range([0, this.width])
      : d3.scaleBand().range([0, this.width]);
    this.xAxisChart = this.checkDate
      ? d3.axisBottom(this.x).tickFormat(d3.timeFormat('%d %b')).ticks(d3.timeDay.every(1)).tickSizeInner(-this.width).tickPadding(1)
      : //.ticks(this._data.length)
        d3.axisBottom(this.x);
    //.ticks(this._data.length);

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .attr('class', 'axis axis--x')
      .style('color', 'black');

    this.y = d3.scaleLinear().range([this.height, 0]);
    this.yAxisChart = d3.axisLeft(this.y);
    this.svg.append('g').attr('class', 'axis axis--y').style('color', 'black');

    this.z = d3.scaleOrdinal(d3.schemeCategory10);
  }

  // Define filter conditions
  tickFormat(date) {
    const formatDay = d3.timeFormat('%a %d');
    const formatWeek = d3.timeFormat('%b %d');
    const formatMonth = d3.timeFormat('%b');
    const formatYear = d3.timeFormat('%Y');
    return (
      d3.timeMonth(date) < date
        ? d3.timeWeek(date) < date
          ? formatDay
          : formatWeek
        : d3.timeYear(date) < date
        ? formatMonth
        : formatYear
    )(date);
  }

  private draw(data: any[], update?) {
    if (!this._data.length) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
     
      return;
    }
    this.z.domain(this._keys);

    this.line = d3
      .line()
      // .curve(d3.curveBasis)
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value));

    const records = this.z.domain().map((name) => ({
      name,
      values: data.map((d) => ({
        date: d[this._xaxis],
        value: parseFloat(d[this._yaxis]),
      })),
    }));

    this.x.domain(
      d3.extent(data, (d) => {
        return d[this._xaxis];
      })
    );
    this.svg
      .selectAll('.axis--x')
      .transition()
      .duration(300)
      .call(this.xAxisChart.tickSize(-this.height))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dx', '-1.39em')
      .attr('dy', '0.75em')
      .attr('transform', 'rotate(-45)');

    // this.y.domain(d3.extent(data, d => d.actual));
    this.y.domain([
      d3.min(records, (d: any) => d3.min(d.values, (v: any) => v.value)),
      d3.max(records, (d: any) => d3.max(d.values, (v: any) => v.value)),
    ]);
    this.svg
      .selectAll('.axis--y')
      .transition()
      .duration(300)
      .call(this.yAxisChart.tickSize(-this.width).tickFormat(null));

    // Create a tooltip.
    const tooltip = d3
      .select(this.svgContainerRef.nativeElement)
      .append('figure')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'red')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    const mouseover = function (event, d) {
      tooltip
        .style('cursor', 'pointer')
        .html('a tooltip <br/>' + d.date + '<br/>' + d.value)
        .style('opacity', 1);
    };

    const mousemove = function (event, d) {
      tooltip

        .style('transform', 'translateY(-55%)')
        .style('left', event.x + 20 + 'px')
        .style('top', event.y + 10 + 'px');
    };
    const mouseleave = function (event, d) {
      tooltip.style('opacity', 0);
    };

    update = this.svg.selectAll('.records').data(records);
    // .on('mouseover', mouseover)
    // .on('mousemove', mousemove)
    // .on('mouseleave', mouseleave);

    const enter = update.enter().append('g').attr('class', 'records');

    enter
      .append('path')
      .attr('class', 'records-path')
      .attr('d', (d: any) => this.line(d.values))
      .attr('fill', 'none')
      .style('stroke', (d: any) => this._color[d.name] || '#000');

    enter
      .append('g')
      .selectAll('text')
      .data((d: any) => d.values)
      .enter()
      .append('g')
      .append('text')
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

      .attr('x', (d: any) => {
        return this.x(d.date);
      })
      .attr('y', (d: any) => {
        return this.y(d.value);
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '7px')
      .attr('dx', '-1em')
      .attr('dy', '-0.1em')
      .attr('fill', 'transparent')
      .text(function (d: any) {
        return d.value;
      })
      .on('mouseover', function (d: any) {
        d3.select(this)
          .attr('fill', 'black')
          .attr('font-size', '11px')
          .attr('dx', '-1em')
          .attr('dy', '-0.5em')
          .attr('cursor', 'pointer');
      })
      .on('mouseout', function (d: any) {
        d3.select(this).attr('font-size', '5px').attr('fill', 'transparent');
      });

    enter
      .append('g')
      .selectAll('circle')
      .data((d: any) => d.values)
      .enter()
      .append('g')
      .attr('class', 'circle')
      .append('circle')
      .attr('cx', (d: any) => this.x(d.date))
      .attr('cy', (d: any) => this.y(d.value))
      .attr('r', 4)
      .attr('fill', 'fill: rgb(40 67 188);');
    // .on("mouseover", function(d:any) {
    //   d3.select(this)
    //   .attr("r", 10).style("fill", "red")
    //   d3.select(this).html("---helllo---")

    // })
    // .on("mouseout", function(d:any) {
    //   d3.select(this).attr("r", 4).style("fill", "black");
    // });

    update
      .select('.records-path')
      .attr('d', (d) => this.line(d.values))
      .attr('stroke-dasharray', null)
      .attr('stroke-dashoffset', null)
      .attr('fill', 'none')
      .style('stroke', (d) => this._color[d.name] || '#000');

    d3.selectAll('.records-path')
      .nodes()
      .forEach((v: any, k) => {
        d3.select(v)
          .attr(
            'stroke-dasharray',
            v.getTotalLength() + ' ' + v.getTotalLength()
          )
          .attr('stroke-dashoffset', v.getTotalLength())
          .transition()
          .duration(350)
          .attr('stroke-dashoffset', 0);
      });
  }
}
