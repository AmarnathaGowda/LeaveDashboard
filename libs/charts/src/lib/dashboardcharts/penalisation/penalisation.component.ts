import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  HostListener,
  OnInit,
} from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'dashboard-ui-penalisation',
  templateUrl: './penalisation.component.html',
  styleUrls: ['./penalisation.component.scss'],
})
export class PenalisationComponent {
  @Input() data: any[];
  @Input() color: any[];

  private margin = { top: 40, right: 20, bottom: 50, left: 40 };
  private w: number;
  private h: number = 400;
  private width: number;
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

  @ViewChild('penalchartContainer', { read: ElementRef, static: true })
  elementView!: ElementRef;

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

  constructor(private container: ElementRef) {}

  ngOnInit() {
    // this.w = this.elementView.nativeElement.offsetWidth;
    this.w =
      this.elementView.nativeElement.parentElement.parentElement.parentElement.offsetWidth;
    this.height =
      this.elementView.nativeElement.parentElement.parentElement.parentElement
        .offsetHeight -200;

    this.width = this.w + this.margin.left * (this.margin.right+(this.data.length*25));

  
    this.initSvg();
    this.initScales();
    this.createAxis();
    this.drawUpdate(this.data);
    this.createlegend();
    
  }

  //----------------------- initScales

  private initScales() {
    this.x = d3.scaleBand().range([0, this.width+(this.data.length*60)]);
    //.padding(.15)

    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
  }

  //----------------------- initSvg

  private initSvg() {
    this.elementView.nativeElement.innerHTML = ''; // clear all contents
    this.svg = d3
      .select(this.elementView.nativeElement)
      // .select('.chart-container')
      .append('svg')
      .attr('width', this.width + this.margin.top * 4)
      .attr('height', this.height + 130)
      .append('g')
      .attr(
        'transform',
        'translate(0 ,0)'
      );

    this.chart = this.svg
      .append('g')
      .attr('transform', `translate(${(this.marginTop+20)}, ${this.marginLeft})`);

    this.tooltip = d3
      .select('body')
      .append('div')
      .classed('tooltip chart-tooltip', true)
      .style('display', 'none');
  }

  private createAxis() {
    this.y_axis = d3.axisLeft(this.y).tickPadding(10).ticks(30);

    this.x_axis = d3.axisBottom(this.x).scale(this.x).tickPadding(30);

    this.chart.append('g').classed('py-axis', true);
    this.chart.append('g').classed('px-axis', true);
  }

  //----------------------- drawUpdate

  private drawUpdate(data) {
    this.x.domain(data[0].values.map((d: any) => d.name)).padding(1.15);
    this.y.domain([0, d3.max(data[0].values, (d: any) => d.count)]);

    const groupName = data[0].values.map((d: any) => d.name);
    //-- line
    const dataLine = d3
      .line()
      .x((d: any) => {
        return this.x(d.name) + 0.5 * this.x.bandwidth();
      })
      .y((d: any) => {
        return this.y(d.count);
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
      .selectAll('.line-group')
      .data(data)
      .enter()
      .append('g')
      .classed('line-group', true);

    this.linesUpdate = d3
      .selectAll('.line-group')
      .selectAll('path')
      .data((d: any) => {
        console.log([d.values]);
        return [d.values];
      })
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .style('stroke', function (d: any, i) {
        return color[i];
      });

    this.linesUpdate
      .enter()
      .append('path')
      .classed('line', true)
      .merge(this.linesUpdate)
      .attr('d', dataLine)
      


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
    let circlesGroup = this.chart.append('g').classed('circles', true);

    circlesGroup
      .selectAll('.circles')
      .data(data)
      .enter()
      .append('g')
      .classed('circle-group', true);

    let circleUpdate = d3
      .selectAll('.circle-group')
      .selectAll('circle')
      .data((d: any) => d.values)
      .enter().append('g').attr('class', 'records')
      .selectAll('text')
      .data((d: any) => d.values)
      .enter()
      .append('g')
      .append('text')

      .attr('x', (d: any) => {
        return this.x(d.name);
      })
      .attr('y', (d: any) => {
        return this.y(d.count);
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '7px')
      .attr('dx', '-1em')
      .attr('dy', '-0.1em')
      .attr('fill', 'transparent')
      .text(function (d: any) {
        return d.count;
      })
     ;

    circleUpdate
      .enter()
      .append('circle')
      .attr('cx', (d: any) => this.x(d.name) + 0.5 * this.x.bandwidth())
      .attr('cy', (d: any) => this.y(d.count))
      .attr('r', 5)
    
      // .append('g')
   

    // circleUpdate
    //   .attr('cx', (d: any) => this.x(d.name) + 0.5 * this.x.bandwidth())
    //   .attr('cy', (d: any) => this.y(d.count))
    //   .attr('r', 5);

    circleUpdate.exit().remove();

    // -- axis

    d3.select('.py-axis').transition().call(this.y_axis).selectAll('.tick text').style('color', 'black');
    //.attr('dy', -3);

    d3.select('.px-axis')
      .style('color', 'black') 
      .call(this.x_axis)
      .attr('transform', 'translate(0,' + this.height + ')')
      .selectAll('.tick text')
      .call(this.wrap, 100)
      .attr('transform', 'translate(-50,10)rotate(-45)');
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
    var svg = d3.select('#penal-legend');
    svg
      .attr('width', '100%')
      .attr('height', '10vh')
      .attr('class', 'svg-legend')
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');

    var ldata = this.data.map((y) => y.month);
    var lcolor = ['#4d85bd', '#264e86'];

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
        return 120 + i * 140;
      })
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(function (d) {
        return d;
      })
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle');
  }
}
