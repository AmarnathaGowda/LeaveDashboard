import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'dashboard-ui-multiseries',
  templateUrl: './multiseries.component.html',
  styleUrls: ['./multiseries.component.scss'],
})
export class MultiseriesComponent implements OnInit {
  @Input() data: any;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('weeklyLegend', { read: ElementRef, static: true })
  weeklyLegendRef!: ElementRef<HTMLDivElement>;
  svg: any;
  width: any;
  height: any;
  margin = { top: 20, right: 80, bottom: 30, left: 50 };
  trends: { name: string; values: { timescale: any; total: number }[] }[];
  legend: any;
  isRendered = false;
  constructor() {}

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      this.width =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetWidth - 90;

    this.height =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 130;

    this.generateChart();
    this.createlegend();
    }
  }

  ngOnInit(): void {
    this.width =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetWidth - 90;

    this.height =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 130;

    this.generateChart();
    this.createlegend();
    this.isRendered = true;
  }
  // {
  //   timescale: '早',
  //   totalAmount: 20,
  //   totalProfit: 200,
  //   totalRevenue: 400,
  // },
  generateChart() {
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    this.weeklyLegendRef.nativeElement.innerHTML = ''; // clear all contents
    if(this.data.length === 0){
      this.svgContainerRef.nativeElement.innerHTML = 'No Data';
      return;
    }
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('width', this.width )
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left-20},${this.margin.top})`);

    // this.svg = d3.select(this.svgContainerRef.nativeElement);
    // this.width = +this.svg.attr('this.width') - margin.left - margin.right;
    // this.height = +this.svg.attr('this.height') - margin.top - margin.bottom;
    // const g = this.svg
    //   .append('g')
    //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // set the ranges
    var x = d3.scaleBand().rangeRound([0, this.width]).padding(1),
      y = d3.scaleLinear().rangeRound([this.height, 0]),
      z = d3.scaleOrdinal(['#4d85bd', '#264e86']);

    // define the line
    var line = d3
      .line()
      .x(function (d: any) {
        return x(d.weekName);
      })
      .y(function (d: any) {
        return y(d.totalHours);
      });

    // scale the range of the data
    z.domain(
      this.data.map((d: any) => {
        return d['month'];
      })
    );
    //   Object.keys(this.data[0]).filter(function (key) {
    //     return key !== 'month';
    //   })
    // );

    this.trends = z.domain().map((name, i) => {
      return {
        name: name,
        values: this.data[i].values.map(function (d: any) {
          return {
            weekName: d.weekName,
            totalHours: d.totalHours,
          };
        }),
      };
    });

    x.domain(this.data[0].values.map((d: any) => d['weekName']));

    //   this.data.map(function (d) {
    //     return d.timescale;
    //   })
    // );
    let arrayList = this.data.map((y: any[]) => {
      return y.values;
    });
    let mergeDataValues = Object.keys(arrayList)
      .map((key) => arrayList[key])
      .reduce((x, y) => {
        return [...x, ...y];
      });
    y.domain([
      0,
      d3.max(mergeDataValues, (d: any) => {
        return parseFloat(d['totalHours']);
      }),
    ]);

    // d3.max(this.data[0].values, (d: any) => {
    //   return parseFloat(d['totalHours']);
    // }),

    // y.domain([
    //   0,
    //   d3.max(trends, function (c: any) {
    //     return d3.max(c.values, function (v: any) {
    //       return v.total;
    //     });
    //   }),
    // ]);

    // Draw the legend
    // this.legend = this.svg
    //   .selectAll('g')
    //   .data(this.trends)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'legend');

    // this.legend
    //   .append('rect')
    //   .attr('x', this.width - 20)
    //   .attr('y', (d, i) => {
    //     return this.height / 2 - (i + 1) * 20;
    //   })
    //   .attr('width', 10)
    //   .attr('height', 10)
    //   .style('fill', function (d) {
    //     return z(d.name);
    //   });

    // this.legend
    //   .append('text')
    //   .attr('x', this.width - 8)
    //   .attr('y', (d, i) => {
    //     return this.height / 2 - (i + 1) * 20 + 10;
    //   })
    //   .text(function (d) {
    //     return trendsText[d.name];
    //   });

    // Draw the line
    var trend = this.svg
      .selectAll('.trend')
      .data(this.trends)
      .enter()
      .append('g')
      .attr('class', 'trend');

    trend
      .append('path')
      .attr('class', 'line')
      .attr('d', function (d: { values: [number, number][] | Iterable<[number, number]>; }) {
        return line(d.values);
      })
      .style('stroke', function (d: { name: string; }) {
        return z(d.name);
      });

    // Draw the empty value for every point
    var points = this.svg
      .selectAll('.points')
      .data(this.trends)
      .enter()
      .append('g')
      .attr('class', 'points')
      .append('text');

    // Draw the circle
    trend
      .style('fill', 'none')
      .style('stroke', function (d: { name: string; }) {
        return z(d.name);
      })
      .selectAll('circle.line')
      .data(function (d: any[]) {
        return d.values;
      })
      .enter()
      .append('circle')
      .attr('r', 5)
      // .style('stroke-width', 3)
      .style('fill', 'black')
      .attr('cx', function (d: { weekName: string; }) {
        return x(d.weekName);
      })
      .attr('cy', function (d: { totalHours: d3.NumberValue; }) {
        return y(d.totalHours);
      });

    // trend
    //   .selectAll("circle.text")
    //   .data(function(d){ return d.values })
    //   .enter()
    //   .append('text')
    //   .attr('x', function(d) { return x(d.timescale) + 15; })
    //   .attr('y', function(d) { return y(d.total); })
    //   .text(function(d) { return d.total; });

    trend
      .append('g')
      .selectAll('text')
      .data((d: any) => d.values)
      .enter()
      .append('g')
      .append('text')

      .attr('x', (d: any) => {
        return x(d.weekName);
      })
      .attr('y', (d: any) => {
        return y(d.totalHours);
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '7px')
      .attr('dx', '-1em')
      .attr('dy', '-0.1em')
      .attr('stroke','none')
      .attr('fill', 'transparent')
      .text(function (d: any) {
        return d.totalHours;
      })
      .on('mouseover', function (d: any) {
        d3.select(this)
          .attr('fill', 'black')
          .attr('font-size', '11px')
          .attr('dx', '-1em')
          .attr('dy', '-1em')
          .attr('cursor', 'pointer');
      })
      .on('mouseout', function (d: any) {
        d3.select(this).attr('font-size', '5px').attr('fill', 'transparent');
      });
    // Draw the axis
    this.svg
      .append('g')
      .attr('class', 'axis axis-x')
      .style('color', 'black')
      .attr('transform', 'translate(0, ' + this.height + ')')
      .call(d3.axisBottom(x));

    this.svg
      .append('g')
      .attr('class', 'axis axis-y')
      .style('color', 'black')
      .call(d3.axisLeft(y).ticks(10));

    var focus = this.svg
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus
      .append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', this.height);

    this.svg
      .append('rect')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .attr('class', 'overlay')
      .attr('this.width', this.width)
      .attr('this.height', this.height)
      .on('mouseover', function (d: any) {
        d3.select(this)
          .attr('fill', 'black')
          .attr('font-size', '11px')
          .attr('dx', '-1em')
          .attr('dy', '-0.5em')
          .attr('cursor', 'pointer');
      })
      .on('mouseout', function (event: any, d: any) {})
      .on('mousemove', function (event: any, d: any) {});

    var timeScales = this.data.map(function (name: { timescale: string; }) {
      return x(name.timescale);
    });

    const mouseover = (event: any, d: any) => {
      focus.style('display', null);
      d3.selectAll('.points text').style('display', null);
    };
    const mouseout = (event: any, d: any) => {
      focus.style('display', 'none');
      d3.selectAll('.points text').style('display', 'none');
    };
    const mousemove = (event: any, d: any) => {
      let i = d3.bisect(
        timeScales,
        d3.pointer(event, this.svg.append('g').node())[0],
        1
      );
      var di = this.data[i - 1];
      focus.attr('transform', 'translate(' + x(di.timescale) + ',0)');
      d3.selectAll('.points text')
        .attr('x', function (d: any) {
          return x(di.timescale) + 15;
        })
        .attr('y', function (d: any) {
          return y(d.values[i - 1].total);
        })
        .text(function (d: any) {
          return d.values[i - 1].total;
        })
        .style('fill', function (d: any) {
          return z(d.name);
        });
    };
  }
  createlegend() {
   
    var svg = d3.select(this.weeklyLegendRef.nativeElement);
    svg
      .attr('width', '100%')
      // .attr('height', '10vh')
      .attr('class', 'svg-legend')
      .append('g')
      .attr('transform', 'translate(0 ,0)');

      var lcolor = [];
    var ldata = this.data.map((d: any,i:number) => {
      let legendcolors=['#4d85bd', '#264e86'];
      lcolor.push(legendcolors[i])
      return d['month'];
    });
    

    svg
      .selectAll('mydots')
      .data(lcolor)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return 40 + i * 140;
      })
      .attr('y', 10)
      .attr('width', 15)
      .attr('height', 15)
      .style('fill', (d: any) => {
        return d;
      });
    svg
      .selectAll('mylabels')
      .data(ldata)
      .enter()
      .append('text')
      .attr('y', 20)
      .attr('x', function (d, i) {
        return 90 + i * 140;
      })
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(function(d: any) {
        return d;
      })
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle');
  }
}
