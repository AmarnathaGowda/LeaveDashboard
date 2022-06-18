/* eslint-disable prefer-const */
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

@Component({
  selector: 'dashboard-ui-stackedbarchart',
  templateUrl: './stackedbarchart.component.html',
  styleUrls: ['./stackedbarchart.component.scss'],
})
export class StackedbarchartComponent implements AfterViewInit {
  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('linebarlegend', { read: ElementRef, static: true })
  linebarlegendRef!: ElementRef<HTMLDivElement>;

  _data!: any[];
  _keys!: any[];
  maxLength = 0;
  lengthOfText = 0;
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
  // @HostListener('window:resize')
  // onResize(): void {
  //   this.createChart();
  // }

  // datatest = this._data;
  constructor() {}

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      this.svgContainerRef.nativeElement.innerHTML = ''; 
      this.width =
        this.svgContainerRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetWidth &&
        this.svgContainerRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetWidth +
          this.margin.bottom -
          350 +
          this.maxLength * 35;
      this.height =
        this.svgContainerRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetHeight &&
        this.svgContainerRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetHeight - 160;
      this.lwidth =
        this.linebarlegendRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetWidth &&
        this.linebarlegendRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetWidth +
          this.margin.bottom -
          350 +
          this.maxLength * 35;
      this.lheight =
        this.linebarlegendRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetHeight &&
        this.linebarlegendRef.nativeElement?.parentElement?.parentElement
          ?.parentElement?.offsetHeight - 160;

      this.checkMaxLength();  this.createlegend();
      this.createChart();
    
    }
  }

  ngAfterViewInit(): void {
    // this._data = [
    //   { name: 'Gen shift', absent: 22, present: 499 },
    //   { name: 'A shift', absent: 15, present: 3000 },
    //   { name: 'B shift', absent: 15, present: 10 },
    // ];

    this.checkMaxLength();
    //   this._data.map(function (d: any) {
    //     d.name = d.name.substr(0,5)+"...";
    //  })
    this.width =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth +
        this.margin.bottom -
        350 +
        this.maxLength * 35;
    this.height =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 160;
    this.lwidth =
      this.linebarlegendRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.linebarlegendRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth +
        this.margin.bottom -
        350 +
        this.maxLength * 35;
    this.lheight =
      this.linebarlegendRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight &&
      this.linebarlegendRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 160;
 this.createlegend();
    this.createChart();
    this.isRendered = true;

   
  }
  checkMaxLength() {
    this._data &&
      this._data.forEach((i, item: any) => {
        this.maxLength = i.name ? Math.max(this.maxLength, i.name.length) : 0;
      });
    this.lengthOfText = this.maxLength;
    //console.log(this.margin.bottom);
  }
  private createChart(): void {
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    const a =d3.max(this._data, (d): any => parseFloat(d.value));
    if (!this._data.length) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
      this.linebarlegendRef.nativeElement.innerHTML = ''; // clear all contents
     
      return;
    }
    this.xScale = d3
      .scaleBand()
      .rangeRound([0, this._data.length * 35])
      .padding(0.3)
      .domain(
        this._data.map(function (d: any) {
          return d.name;
        })
      );

    this.yScale = d3
      .scaleLinear()
      .rangeRound([this.height, 0])
      .domain([
        0,
        d3.max(this._data, function (d: any) {
          return d.absent + d.present;
        }),
      ]);
    const svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      // .attr('width', this.datatest.length * 50)
      .attr('width', this.width + this._data.length * 2)
      .attr(
        'height',
        this.height + this.margin.bottom * 2 + this._data.length - 10
      );

    const g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (this.margin.left + 20) +
          ',' +
          25 +
          ' )'
      );

    // axis-x
    g.append('g')
      .attr('class', 'axis axis--x')
      .style('color', 'black')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.xScale))
      .selectAll('text')
      .attr('class', 'short-text')
      .style('text-anchor', 'end')
      .attr('dx', '-.9em')
      .attr('dy', '-0.35em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '9px')
      .call(this.wrap, 100);

    // axis-y
    g.append('g')
      .attr('class', 'axis axis--y')
      .style('color', 'black')
      .attr('height', this.height)
      .call(d3.axisLeft(this.yScale));

    const bar = g.selectAll('rect').data(this._data).enter().append('g');

    // present bar chart

    bar
      .append('rect')
      .attr('x', (d: any) => {
        return this.xScale(d.name);
      })
      .attr('y', (d: any) => {
        return this.yScale(d.present);
      })
      .attr('width', this.xScale.bandwidth() + 9)
      .attr('height', (d: any) => {
        return this.height - this.yScale(d.present);
      })
      // .attr('fill', 'red');

      .attr('fill', '#5e88fc');

    bar
      .append('text')
      .attr('dy', '1em')
      .attr('x', (d: any) => {
        return this.xScale(d.name) + 16;
      })
      .attr('y', (d: any) => {
        return this.yScale(d.present)-30;
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')

      .attr('fill', '#5e88fc')
      .attr('font-weight', '900')
      .text(function (d: any) {
        return d.present;
      });

    // absent bar chart

    bar
      .append('rect')
      .attr('x', (d: any) => {
        return this.xScale(d.name);
      })
      .attr('y', (d: any) => {
        return this.yScale(d.absent);
      })
      .attr('width', this.xScale.bandwidth() + 10)
      .attr('height', (d: any) => {
        return this.height - this.yScale(d.absent);
      })
      // .attr('fill', 'red');
      .attr('fill', '#264e86');

    bar
      .append('text')
      .attr('dy', '3em')
      .attr('x', (d: any) => {
        return this.xScale(d.name) + this.xScale.bandwidth() / 2;
      })
      .attr('y', (d: any) => {
        return this.yScale(d.present)-35;
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')

      .attr('fill', '#264e86')
      .attr('font-weight', '900')
      .text(function (d: any) {
        return d.absent;
      });
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
    this.linebarlegendRef.nativeElement.innerHTML = '';
    const elsvg = d3
      .select(this.linebarlegendRef.nativeElement)
      .append('svg')
      .attr('width', this.lwidth)
      .attr('height', this.lheight + this.margin.bottom + 20);
    elsvg.append('g').attr('transform', 'translate( 0,0)');
    elsvg.style('position', 'relative').style('height', '8vh');

    elsvg
      .selectAll('mydots')
      .data(this._color)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return 50 + i * 75;
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
        return 85 + i * 80;
      })
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(function (d) {
        return d;
      })
      .attr('text-anchor', 'middle')
      .style('text-transform', 'capitalize')
    // .style('alignment-baseline', 'middle');

    // elsvg
    //   .selectAll('mydots')
    //   .data(this._color)
    //   .enter()
    //   .append('rect')
    //   .attr('x', (d, i) => {
    //     return 50 + i * 137;
    //   })
    //   .attr('y', 10)
    //   .attr('width', 12)
    //   .attr('height', 12)
    //   .style('fill', (d: any) => {
    //     return d;
    //   });
    // elsvg
    //   .selectAll('mylabels')
    //   .data(this._keys)
    //   .enter()
    //   .append('text')
    //   .attr('y', 20)
    //   .attr('x', function (d, i) {
    //     return 65 + i * 136;
    //   })
    //   .style('fill', 'black')
    //   .style('font-size', '11px')
    //   .text(function (d: any) {
    //     return d;
    //   })
    //   .attr('text-anchor', 'left')
    //   .style('text-transform', 'capitalize');
  }
}
