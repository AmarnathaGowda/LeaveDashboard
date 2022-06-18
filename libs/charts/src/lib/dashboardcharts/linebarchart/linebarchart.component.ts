import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  ViewEncapsulation,
  SimpleChanges,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import * as d3 from 'd3';

export interface Data {
  month: string;
  actualDays: any;
  targetDays: any;
}

@Component({
  selector: 'dashboard-ui-linebarchart',
  templateUrl: './linebarchart.component.html',
  styleUrls: ['./linebarchart.component.scss'],
})
export class LinebarchartComponent implements AfterViewInit {
  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('linebarlegend', { read: ElementRef, static: true })
  linebarlegendRef!: ElementRef<HTMLDivElement>;

  _data!: any[];
  _keys!: any[];
  @Input()
  set data(value: any) {
    this._data = value;
  }
  get data() {
    return this._data;
  }

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
  margin = { top: 20, right: 20, bottom: 25, left: 30 };
  width: any;
  height: any;
  lwidth: any;
  lheight: any;
  xScale: any;
  yScale: any;
  private line: any;
  currentYear: any;
  // @HostListener('window:resize')
  // onResize(): void {
  //   this.createChart();
  // }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    this.width =
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth + this.margin.bottom;
    this.height =
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight &&
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 70;

    this.lwidth =
      this.linebarlegendRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.linebarlegendRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth + this.margin.bottom;
    this.lheight =
      this.linebarlegendRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight &&
      this.linebarlegendRef?.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 70;

    this.createChart();

    this.isRendered = true;
   
  }

  private createChart(): void {
    const a =d3.max(this._data, (d): any => parseFloat(d.actualDays));
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    this.linebarlegendRef.nativeElement.innerHTML = '';
    if (a === 0) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>';
      this.linebarlegendRef.nativeElement.innerHTML = '';
      this.currentYear ='';
      return;
    }
    this._data.filter((d: any) => {
      this.currentYear = d.year;
    });
    this.createlegend();

    this.xScale = d3
      .scaleBand()
      .rangeRound([0, this._data.length * 35])
      .padding(0.3)
      .domain(
        this._data.map(function (d: any) {
          return d.month;
        })
      );

    this.yScale = d3
      .scaleLinear()
      .rangeRound([this.height, 0])
      .domain([
        0,
        d3.max(this._data, function (d: any) {
          return d.targetDays;
        }),
      ]);
      
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents

    const svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      // .attr('width', this._data.length * 50)
      .attr('width', this.width)
      .attr('height', this.height + this.margin.bottom + 20);

    const g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + (this.margin.left + 20) + ',' + this.margin.bottom + ' )'
      );

    // axis-x
    g.append('g')
      .attr('class', 'axis axis--x')
      .style('color', 'black')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.xScale));

    // axis-y
    g.append('g')
      .attr('class', 'axis axis--y')
      .style('color', 'black')
      .attr('height', this.height - this.margin.bottom - this.margin.top)
      .call(d3.axisLeft(this.yScale));

    const bar = g.selectAll('rect').data(this.data).enter().append('g');

    // bar chart
    bar
      .append('rect')
      .attr('x', (d: any) => {
        return this.xScale(d.month);
      })
      .attr('y', (d: any) => {
        return this.yScale(d.targetDays);
      })
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d: any) => {
        return this.height - this.yScale(d.targetDays);
      })
      .attr('fill', 'rgb(92 155 213)')
      .attr('class', function (d: any) {
        const s = 'bar ';
        if (d.actualDays < 400) {
          return s + 'bar1';
        } else if (d.actualDays < 800) {
          return s + 'bar2';
        } else {
          return s + 'bar3';
        }
      });

    // labels on the bar chart
    bar
      .append('text')
      .attr('dy', '-1.3em')
      .attr('x', (d: any) => {
        return this.xScale(d.month) + this.xScale.bandwidth() / 2;
      })
      .attr('y', (d: any) => {
        return this.yScale(d.targetDays);
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', 'black')
      .text(function (d: any) {
        return d.targetDays;
      });

    // line chart
    this.line = d3
      .line()
      .x((d: any, i: any) => {
        return this.xScale(d.month) + this.xScale.bandwidth() / 2;
      })
      .y((d: any) => {
        return this.yScale(d.actualDays);
      })
      .curve(d3.curveMonotoneX);

    bar
      .append('path')
      .attr('class', 'line') // Assign a class for styling
      .attr('d', this.line(this.data)) // 11. Calls the line generator
      // bar.append("path")
      // .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'royalblue')
      .attr('stroke-width', 1.5);

    bar
      .append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', (d: any, i: any) => {
        return this.xScale(d.month) + this.xScale.bandwidth() / 2;
      })
      .attr('cy', (d: any) => {
        return this.yScale(d.actualDays);
      })
      .attr('r', 5)
      .attr('fill', 'fill: rgb(40 67 188);');
    bar
      .append('text')
      .attr('x', (d: any) => {
        return this.xScale(d.month) + this.xScale.bandwidth() / 2;
      })
      .attr('y', (d: any) => {
        return this.yScale(d.actualDays);
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', 'transparent')
      .text(function (d: any) {
        return d.actualDays;
      })
      .on('mouseover', function (d: any) {
        d3.select(this)
          .attr('fill', 'black')
          .attr('font-size', '11px')
          .attr('dx', '0.5em')
          .attr('dy', '-0.9em')
          .attr('cursor', 'pointer');
      })
      .on('mouseout', function (d: any) {
        d3.select(this).attr('font-size', '5px').attr('fill', 'transparent');
      });
  }

  createlegend() {
    this.linebarlegendRef.nativeElement.innerHTML = '';
    const elsvg = d3
      .select(this.linebarlegendRef.nativeElement)
      .append('svg')
      .attr('class', 'svg-legend')
      .attr('width', this.lwidth)
      .attr('height', this.lheight + this.margin.bottom + 20);

    elsvg.append('g').attr('transform', 'translate( 0,0)');
    // elsvg.style('position', 'absolute').style('bottom', '5px');

    elsvg
      .selectAll('mydots')
      .data(this._color)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return 20 + i * 80;
      })
      .attr('y', 10)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', (d: any) => {
        return d;
      });
    elsvg
      .selectAll('mylabels')
      .data(this._keys)
      .enter()
      .append('text')
      .attr('y', 20)
      .attr('x', function (d, i) {
        return 65 + i * 80;
      })
      .style('fill', 'black')
      .style('font-size', '11px')
      .text(function (d: any) {
      //  console.log(d);
        return d;
      })
     .attr('text-anchor', 'middle')
      .style('text-transform', 'capitalize');
  }
}
