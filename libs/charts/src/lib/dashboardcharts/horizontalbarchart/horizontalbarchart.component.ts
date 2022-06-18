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
  selector: 'dashboard-ui-horizontalbarchart',
  templateUrl: './horizontalbarchart.component.html',
  styleUrls: ['./horizontalbarchart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HorizontalbarchartComponent implements AfterViewInit {
  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  _data: any[];
  _xaxis: any;
  _yaxis: any;
  maxLength = 0;
  @Input()
  set data(value: any) {
    this._data = value;
  }
  get data() {
    return this._data;
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

  margin = { top: -10, right: 40, bottom: 200, left: 90 };
  width: any;
  height: any;
  //// width= 500;
  // height=400;
  // this.svgContainerRef.nativeElement.offsetHeight;
  // this.svgContainerRef.nativeElement.offsetWidth;
  // @HostListener('window:resize')
  // onResize(): void {
  //   // this.createChart();
  // }
  // ngOnInit(): void {
  // }
  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
      // this.height =
      //   this.svgContainerRef.nativeElement.offsetHeight +
      //   this._data.length * 20;
      // this.width =
      //   this.svgContainerRef.nativeElement?.parentElement?.parentElement
      //     ?.parentElement?.offsetWidth &&
      //   this.svgContainerRef.nativeElement?.parentElement?.parentElement
      //     ?.parentElement?.offsetWidth +
      //     this.margin.bottom -
      //     510;

      this.height =
      this.svgContainerRef.nativeElement.offsetHeight + this._data.length * 20;
    this.width =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth +
        this.margin.bottom -
        510;
      this.checkMaxLength();
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    //  this.width =
    //    this.svgContainerRef.nativeElement.offsetWidth + this.margin.bottom;
    this.height =
      this.svgContainerRef.nativeElement.offsetHeight + this._data.length * 20;
    this.width =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth +
        this.margin.bottom -
        510;
    // this.height =
    // this.svgContainerRef.nativeElement?.parentElement?.parentElement?.parentElement?.offsetHeight && this.svgContainerRef.nativeElement?.parentElement?.parentElement?.parentElement?.offsetHeight;

    this.checkMaxLength();
    this.createChart();
    this.isRendered = true;
  }

  wrap(text: any, width: any) {
    text._groups[0].forEach((a) => {
      console.log(a.innerHTML);
      if (a.innerHTML.length > 20) {
        let secondstring = a.innerHTML.substring(a.innerHTML.length / 2, a.innerHTML.length);
        
        secondstring = secondstring.length > 20 ? 
        secondstring.substring(a.innerHTML.length / 2,secondstring.length/2):
        secondstring.substring(secondstring.length/2, secondstring.length);



        a.innerHTML =
          a.innerHTML.substring(0, a.innerHTML.length / 2) +
          ' ' +
          secondstring;
      }
    });

    let index = 0;
    text.each(function (i, a) {
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
            .attr('y', index == 2 ? parseFloat(y) - 0.8 : y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
        index++;
      }
    });
  }

  checkMaxLength() {
    this._data &&
      this._data.forEach((i, item: any) => {
        this.maxLength = i.name ? Math.max(this.maxLength, i.name.length) : 0;
      });
    this.margin.left = this.maxLength;
    // console.log(this.margin.bottom);
  }
  private createChart(): void {
    if (!this._data.length) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
      return;
    }
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr(
        'width',
        this.width +
          this.margin.right * 2 +
          this.margin.left * 3 +
          this.maxLength * 2
      )
      .attr(
        'height',
        this.height +
          this.margin.top +
          this.margin.bottom +
          this._data.length * 20
      )
      .append('g')
      .attr('width', '100%')
      .attr(
        'transform',
        'translate(' +
          (this.margin.right + this.maxLength - 10) +
          ',' +
          this.margin.top +
          ')'
      )
      .style('margin-top', '70px') //give margin-top for spacing between bars
      .attr('class', 'bar-horizontal-chart');

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this._data, (d) => {
          return d[this._xaxis];
        }),
      ])
      .range([0, this.width + this._data.length]);

    const y = d3
      .scaleBand()
      .rangeRound([0, this.svgContainerRef.nativeElement.offsetHeight])
      .domain(
        this._data.map((d) => {
          return d[this._yaxis];
        })
      )
      .padding(0.4);

    const g = this.svg
      .append('g')
      .attr('transform', 'translate(' + (this.margin.left+20) + ',0)');

    const yaxis = this._yaxis;
    const xaxis = this._xaxis;
    g.append('g')
      .attr('class', 'axis axis--x')
      .style('color', 'black')
      .attr(
        'transform',
        'translate(0,' +
          (this.svgContainerRef.nativeElement.offsetHeight - 10) +
          ')'
      )
      .style('text-anchor', 'middle')
      .call(d3.axisBottom(x))
      .style('font-size', '9px')
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)');

    g.append('g')
      .attr('class', 'axis axis--y')
      .style('color', 'black')
      .call(d3.axisLeft(y))
      // .append('text')
      .selectAll('text')
      .attr('class', 'cateName')
      .style('text-anchor', 'start')
      .call(
        this.wrap,
        this.margin.left > 60
          ? this.margin.left / 2 > 60
            ? 60
            : this.margin.left / 2
          : 100
      )
      .attr(
        'transform',
        'translate(' +
          (-(this.margin.left * 2) - 40) +
          ',' +
          this.margin.top +
          ')'
      );

    g.selectAll('myRect')
      .data(this._data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      // .attr('filter', 'drop-shadow(rgb(40 67 88) 9px 1px 2px)')
      .attr('x', x(0))
      .attr('y', function (d: any) {
        return y(d[yaxis]);
      })
      .attr('width', function (d) {
        return x(d[xaxis]);
      })
      // .style('margin-top', '70px') //give margin-top for spacing between bars
      // .attr('height', '30px')
      .attr('height', y.bandwidth())
      .attr('fill', '#66a5ad');

    g.append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .selectAll('.textlabel')
      .data(this._data)
      .enter()
      .append('text')
      .attr('class', 'textlabel')
      .style('font-family', 'Arial')
      .attr('font-size', '11px')
      .attr('fill', 'black')
      .attr('x', function (d) {
        return x(d['count'] + 20);
      })
      .attr('y', function (d) {
        return y(d['name']) + y.bandwidth();
      })
      .text(function (d) {
        return d['count'];
      });

    // g

    // // .attr('filter', 'drop-shadow(rgb(40 67 88) 9px 1px 2px)')
    // .attr('x', x(0))
    // .attr('y', function (d: any) {
    //   return y(d[yaxis]);
    // })
  }
}
