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
  selector: 'dashboard-ui-weeklyovertime',
  templateUrl: './weeklyovertime.component.html',
  styleUrls: ['./weeklyovertime.component.scss'],
})
export class WeeklyovertimeComponent implements OnInit {
  @Input()
  data!: any[];
  @Input()
  color!: any[];
  @Input()
  keys!: any[];

  private margin = { top: 40, right: 20, bottom: 50, left: 40 };
  private w!: number;
  private h: number = 400;
  private width!: number;
  private height;
  private marginLeft = this.margin.left;
  private marginTop = this.margin.top;

  private x: any;
  private y: any;
  private y_axis: any;
  private x_axis: any;
  private svg: any;
  private g: any;
  private chart: any;
  private tooltip: any;
  private xAxis: any;
  private yAxis: any;
  private xScale: any;
  private yScale: any;
  linesUpdate: any;
  lines: any;
  private resizeTimeout: any;

  // @ViewChild('weeklyovertime', { read: ElementRef, static: true })
  // elementView!: ElementRef;
  // @ViewChild('weeklyovertime', { read: ElementRef, static: true })
  // elementView!: ElementRef;

  @ViewChild('weeklyovertime')
  elementView!: ElementRef;
  isRendered = false;

  // @HostListener('window:resize')
  // onWindowResize() {
  //   if (this.resizeTimeout) {
  //     clearTimeout(this.resizeTimeout);
  //   }

  //   this.resizeTimeout = setTimeout(
  //     (() => {
  //       this.w = this.elementView.nativeElement.offsetWidth;
  //       this.width = this.w - this.margin.left - this.margin.right;

  //       d3.selectAll('.circles').remove();
  //       d3.selectAll('.lines').remove();
  //       d3.selectAll('.x-axis').remove();
  //       d3.selectAll('.y-axis').remove();
  //       this.initSvg();
  //       this.initScales();
  //       this.createAxis();
  //       this.drawUpdate(this.data);
  //     }).bind(this),
  //     10
  //   );
  // }

  constructor() {}

  // ngOnChanges(_changes: SimpleChanges) {
  //   if (this.isRendered) {
  //     this.w =
  //       this.elementView.nativeElement.parentElement.parentElement.parentElement.offsetWidth;
  //     this.height =
  //       this.elementView.nativeElement.parentElement.parentElement.parentElement
  //         .offsetHeight -
  //       this.margin.top -
  //       this.margin.bottom;

  //     this.width = this.w + this.margin.left * this.margin.right;

  //     this.initScales();
  //     this.initSvg();
  //     this.createAxis();
  //     this.drawUpdate(this.data);
  //     this.createlegend();
  //   }
  // }
  ngOnInit() {
    // this.w = this.elementView.nativeElement.offsetWidth;
    this.w =
    this.elementView.nativeElement?.parentElement?.parentElement
    ?.parentElement?.offsetHeight-100;
    this.height =
    this.elementView.nativeElement?.parentElement?.parentElement
    ?.parentElement?.offsetHeight ;

    this.width = this.w;


    
    this.initSvg();
    this.initScales();
    this.isRendered = true;
    this.createAxis();
    this.drawUpdate(this.data);
    this.createlegend();
    
  }

  //----------------------- initScales

  private initScales() {
    this.x = d3.scaleBand().range([0, this.width]);
    //.padding(.15)

    this.y = d3.scaleLinear().rangeRound([this.height-(this.margin.bottom*2)-this.data[0].values.length, 0]);
  }

  //----------------------- initSvg

  private initSvg() {
    this.elementView.nativeElement.innerHTML = ''; // clear all contents
    this.svg = d3
      .select(this.elementView.nativeElement)
      // .select('.chart-container')
      .append('svg')
      .attr('width', this.width + this.margin.top * 2)
      .attr('height', this.height -(this.margin.bottom) )
      .append('g')
      .attr(
        'transform',
        'translate(0 ,0)'
      );

    this.chart = this.svg
      .append('g')
      .attr('transform', `translate(${this.marginTop}, ${this.marginLeft-10})`);

    this.tooltip = d3
      .select('body')
      .append('div')
      .classed('tooltip chart-tooltip', true)
      .style('display', 'none');
  }

  private createAxis() {
    this.y_axis = d3.axisLeft(this.y).tickPadding(10).ticks(10);

    this.x_axis = d3.axisBottom(this.x).scale(this.x).tickPadding(0);

    this.chart.append('g').classed('wy-axis', true).style('color', 'black');
    this.chart.append('g').classed('wx-axis', true).style('color', 'black');
  }

  //----------------------- drawUpdate

  private drawUpdate(data) {
    this.x
      .domain(data[0].values.map((d: any) => d[this.keys[0]]))
      .padding(1.15);
    this.y.domain([0, d3.max(data[0].values, (d: any) => d[this.keys[1]])]);

    const groupName = data[0].values.map((d: any) => d[this.keys[0]]);
    //-- line
    const dataLine = d3
      .line()
      .x((d: any) => {
        return this.x(d[this.keys[0]]) +  this.x.bandwidth();
      })
      .y((d: any) => {
        return this.y(d[this.keys[1]]);
      });
    const color = [
      '#000000',
      '#ff0000',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
      '#a65628',
      '#f781bf',
      '#999999',
    ];

    this.lines = this.chart.append('g').classed('lines', true);

    this.lines
      .selectAll('.wline-group')
      .data(data)
      .enter()
      .append('g')
      .classed('wline-group', true);

    this.linesUpdate = d3
      .selectAll('.wline-group')
      .selectAll('path')
      .data((d: any) => {
        console.log([d.values]);
        return [d.values];
      })
      // .attr('fill', 'none')
      // .attr('stroke-width', 1.5)
      // .style('stroke', function (d: any, i) {
      //   return color[i];
      // })
      ;

    this.linesUpdate
      .enter()
      .append('path')
      .classed('line', true)
      .merge(this.linesUpdate)
      .attr('d', dataLine);

    // .attr('d', dataLine)
    // .attr('fill',function (d: any) {
    //   return color(d.month);
    // })

    // let thisLine = this.chart.selectAll(".line")
    // .data([data]);

    // thisLine = thisLine.enter()
    // .append("path")
    //   .attr("class", "line")
    //   .merge(thisLine)
    //   .attr("d", valueline);

    // -- circle
    let circlesGroup = this.chart.append('g').classed('wcircles', true);

    circlesGroup
      .selectAll('.wcircles')
      .data(data)
      .enter()
      .append('g')
      .classed('wcircle-group', true);

    let circleUpdate = d3
      .selectAll('.wcircle-group')
      .selectAll('circle')
      .data((d: any) => d.values);

    circleUpdate
      .enter()
      .append('circle')
      .attr(
        'cx',
        (d: any) => this.x(d[this.keys[0]]) + 0.5 * this.x.bandwidth()
      )
      .attr('cy', (d: any) => this.y(d[this.keys[1]]))
      .attr('r', 5);

    circleUpdate
      .attr(
        'cx',
        (d: any) => this.x(d[this.keys[0]]) + 0.5 * this.x.bandwidth()
      )
      .attr('cy', (d: any) => this.y(d[this.keys[1]]))
      .attr('r', 5);

    circleUpdate.exit().remove();

    // -- axis

    d3.select('.wy-axis').transition().call(this.y_axis).selectAll('.tick text');
    //.attr('dy', -3);

    d3.select('.wx-axis')
      .call(this.x_axis)
      .attr('transform', 'translate(0,' + (this.height-100) + ')')
      .selectAll('.wtick text')
      .call(this.wrap, 100)
      // .attr('transform', 'translate(-50,10)rotate(-45)')
      ;
    this.isRendered = true;
  }
  wrap(text: any, width: any) {
    text.each(function () {
      // eslint-disable-next-line prefer-const
      let text = d3.select(this),
        // eslint-disable-next-line prefer-const
        words = text.text().split(/\s+/).reverse(),
        word,
        line: string[] = [],
        lineNumber = 0,
        // eslint-disable-next-line prefer-const
        lineHeight = 1, // ems
        // eslint-disable-next-line prefer-const
        y = text.attr('y'),
        dy = parseFloat(text.attr('dy')),
        tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', dy + 'em');
      // eslint-disable-next-line no-cond-assign
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() >= width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

  createlegend() {
    var svg = d3.select('#weekly-legend');
    svg
      .attr('width', '100%')
      .attr('height', '10vh')
      .attr('class', 'svg-legend')
      .append('g')
      .attr('transform', 'translate(0 ,0)');


      var lcolor = []; 
    var ldata = this.data.map((y,i) => {
      console.log(y);
      let nc= ['#4d85bd', '#264e86'];
      lcolor.push(nc[i]);
      return y.month;

    });
    

    svg
      .selectAll('mydots')
      .data(lcolor)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return 70 + i * 140;
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
      .text(function (d) {
        return d;
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }
}
