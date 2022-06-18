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
import * as moment from 'moment';
@Component({
  selector: 'dashboard-ui-verticalbarchart',
  templateUrl: './verticalbarchart.component.html',
  styleUrls: ['./verticalbarchart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VerticalbarchartComponent implements AfterViewInit {
  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  _data: any[];
  _xaxis: any;
  _yaxis: any;
  @Input()
  set data(value: any) {
    this._data = value;
  }
  get data() {
    return this._data;
  }

  _color: any;
  @Input()
  set color(value: any) {
    this._color = value;
  }
  get color() {
    return this._color;
  }
  @Input()
  set xaxis(value: any) {
    this._xaxis = value;
  }
  get xaxis() {
    return this._xaxis;
  }

  @Input()
  set yaxis(value: any) {
    this._yaxis = value;
  }
  get yaxis() {
    return this._yaxis;
  }
  maxLength = 0;
  margin = { top: 10, right: 20, bottom: 185, left: 30 };
  width: any;
  height: any;
  // @HostListener('window:resize')
  // onResize(): void {
  //   // this.createChart();
  // }

  ngOnChanges(_changes: SimpleChanges) {
    this.checkMaxLength();
    if (this.isRendered) {
      this.checkMaxLength();
      this.createChart();
    }
  }

  checkMaxLength() {
    this._data &&
      this._data.forEach((i, item: any) => {
        this.maxLength = i.name ? Math.max(this.maxLength, i.name.length) : 0;
      });
    this.margin.bottom = this.margin.bottom + this.maxLength+30;
    //console.log(this.margin.bottom);
  }

  ngAfterViewInit(): void {
    // this._data = [{"age":"<25","averageHours":0},{"age":"26-35","averageHours":50},{"age":"36-45","averageHours":30},{"age":"46-54","averageHours":0},{"age":">55","averageHours":0}];
    this._data &&
      this._data.forEach((element) => {
        if (element.date) {
          element.date = this.convertDate(element.date);
        }
      });
    this.width =
      this.svgContainerRef.nativeElement.offsetWidth + this.margin.bottom;
    this.height = this.svgContainerRef.nativeElement.offsetHeight;
    this.width =
      this.width <= 400 ? (this.width = this.width = 700) : this.width;
    this.createChart();
    this.isRendered = true;
  }

  wrap(text: any, width: any) {
    let index=0;
    text.each(function (i,a) {
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
            .attr('y', index==2 ? (parseFloat(y)-0.8): y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
        index++;
      }
    });
  }

  private createChart(): void {
    this.checkMaxLength();
    let a =d3.max(this._data, (d): any => parseFloat(d[this._yaxis]));
    //console.log(a);
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    if (a === 0 || this._data.length === 0) {
      this.svgContainerRef.nativeElement.innerHTML = 'No Data';
      return;
    }
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      // .attr(
      //   'width',
      //   this.width +
      //     this.margin.right * 2 +
      //     this.margin.left * 3 +
      //     this.maxLength * 2
      // )
      // .attr(
      //   'height',
      //   this.height +
      //     this.margin.top +
      //     this.margin.bottom +
      //     this._data.length * 20 +
      //     150
      // )
      .attr('width', this._data.length * 50+100)
      .attr(
        'height',
        this.svgContainerRef.nativeElement.offsetHeight 
        - (this.margin.top *5)+
          this.margin.bottom 
      )
      .append('g')
      .attr('width', '100%')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + (this.margin.top-10) + ')'
      )
      .attr('class', 'bar-chart');

    const x = d3
      .scaleBand()
      .rangeRound([0, this.data.length * 49])
      .padding(0.5)
      .domain(this._data.map((d) => d[this._xaxis]));

    const y = d3
      .scaleLinear()
      .rangeRound([this.svgContainerRef.nativeElement.offsetHeight, 0])
      .domain([0, d3.max(this._data, (d): any => parseFloat(d[this._yaxis]))]);
    // Prep the tooltip bits, initial display is hidden
    const tooltip = d3
      .select(this.svgContainerRef.nativeElement)
      .append('figure')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    const xvalue = this._xaxis;
    const yvalue = this._yaxis;
    const mouseover = function (event, d) {
      /********** Hack! Otherwise, the following line would not work:*/

      tooltip
        .html(
          '' +
            xvalue +
            ': ' +
            d[xvalue] +
            '<br>' +
            '' +
            yvalue +
            ': ' +
            d[yvalue]
        )
        .style('opacity', 1);
    };
    const mousemove = function (event, d) {
      tooltip
        .style('transform', 'translateY(-15%)')
        .style('left', event.x + 20 + 'px')
        .style('top', event.y + 10 + 'px');
    };
    const mouseleave = function (event, d) {
      tooltip.style('opacity', 0);
    };

    const g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    g.append('g')
      .attr('class', 'axis axis--x')
      .style('color', 'black')
      .attr(
        'transform',
        'translate(0,' + this.svgContainerRef.nativeElement.offsetHeight + ')'
      )
      .style('text-anchor', 'end')
      .call(d3.axisBottom(x).tickSize(-this.height).tickFormat(null))
      .selectAll('text')

     
      .style('text-anchor', 'start')
      .call(this.wrap, 100)
      .attr('transform', 'translate(' + (-(this.margin.left) - 20) + ','+this.margin.top+')')
      .style('text-anchor', 'end')
      .attr('dx', '-.9em')
      .attr('dy', '-0.35em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .attr('class', 'axis axis--y')
      .style('color', 'black')
      .call(
        d3
          .axisLeft(y)
          .tickSize(-this.data.length * 49)
          .tickFormat(null)
      )
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 2)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

    g.selectAll('.bar')
      .data(this._data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
     // .attr('filter', 'drop-shadow(rgb(40 67 88) 9px 1px 2px)')
      .attr('x', (d): any => x(d[this._xaxis]))
      .attr('y', (d): any => y(parseFloat(d[this._yaxis])))
      .attr('width', x.bandwidth())
      .attr('height', (d) => {
        if (d[this._yaxis] != '') {
          return (
            this.svgContainerRef.nativeElement.offsetHeight -
            y(parseFloat(d[this._yaxis]))
          );
        } else {
          d[this._yaxis] = '0';
          return (
            0
          );
        }
      })
      .attr('fill', this._color)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);
  }
  convertDate(data?: any) {
    return moment(data).format('DD-MMM');
  }
}
