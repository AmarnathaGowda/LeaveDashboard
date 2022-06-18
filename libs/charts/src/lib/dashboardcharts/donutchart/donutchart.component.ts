import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
// Donut chart and pie chart

@Component({
  selector: 'dashboard-ui-dounutchart',
  templateUrl: './donutchart.component.html',
  styleUrls: ['./donutchart.component.scss'],
})
export class DonutchartComponent implements OnInit, AfterViewInit {
  _data: any[] = [];
  _colors: any[] = [];
  _legendpie: any[] = [];
  _type: string = '';
  _keys: any[] = [];
  @Input()
  set data(value: any) {
    this._data = value;
  }
  get data() {
    return this._data;
  }
  @Input()
  set colors(value: any) {
    this._colors = value;
  }
  get colors() {
    return this._colors;
  }
  @Input()
  set type(value: any) {
    this._type = value;
  }
  get type() {
    return this._type;
  }
  @Input()
  set keys(value: any) {
    this._keys = value;
  }
  get keys() {
    return this._keys;
  }
  @Input()
  set legendpie(value: any) {
    this._legendpie = value;
  }
  get legendpie() {
    return this._legendpie;
  }
  private margin = { top: 40, right: 0, bottom: 0, left: 0 };
  width: any;
  height: any;
  private svg: any;
  donutmenu!: boolean;
  eldata: any;
  public isRendered = false;
  eldonut: boolean = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('donutlegend', { read: ElementRef, static: true })
  donutlegendRef!: ElementRef<HTMLDivElement>;
  @ViewChild('eldonutlegend', { read: ElementRef, static: true })
  eldonutlegendRef!: ElementRef<HTMLDivElement>;
  constructor() {}

  ngOnInit(): void {
    this.createSvg(); this.createlegend();
    this.drawChart(this._data);
   
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      this.createSvg();  this._data && this.createlegend();
      this._data && this.drawChart(this._data);
    
    }
  }
  ngAfterViewInit(): void {
    this.isRendered = true;
  }

  private createSvg(): void {
    this.svgContainerRef.nativeElement.innerHTML = '';
    this.donutlegendRef.nativeElement.innerHTML = '';

    this.width =
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.offsetWidth &&
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.offsetWidth + 35;
    this.height =
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.offsetHeight &&
      this.svgContainerRef?.nativeElement?.parentElement?.parentElement
        ?.offsetHeight - 10;
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height / 2 + 60}`)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + (this.height / 2 +30)+ ')'
      );
  }

  private drawChart(data: any): void {
    // The arc generator
    const a =d3.max(this._data, (d): any => parseFloat(d.value));
    if (parseInt(a) == 0) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
      this.eldonutlegendRef.nativeElement.innerHTML = ''; // clear all contents
      this.donutlegendRef.nativeElement.innerHTML = ''; // clear all contents
      return;
    }
    let index = 0;

    const colorsRange: string[] = [];
    this._data.forEach((element) => {
      if (element.color) colorsRange.push(element.color);
      else {
        colorsRange.push(this._colors[index]);
        index++;
      }
    });
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d[this._keys[2]]))
      .range(colorsRange);
    const arc = d3
      .arc()
      .innerRadius((0.5 * this.height) / 2)
      .outerRadius((0.85 * this.height) / 2);

    let pie;
    if (this.type === 'latelogindonut') {
      this.donutmenu = false;
      pie = d3
        .pie()
        .startAngle(-90 * (Math.PI / 180))
        .endAngle(90 * (Math.PI / 180))
        .padAngle(0.05)
        .sort(null)
        .value((d: any) => {
          return d[this._keys[1]];
        });
    } else {
      pie = d3
        .pie()
        .startAngle(-90 * (Math.PI / 180))
        .endAngle(90 * (Math.PI / 180))
        .padAngle(0.05)
        .sort(null)
        .value((d: any) => {
          return d[this._keys[1]];
        });
    }

    const data_ready = pie(this._data);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colors(d.data[this._keys[2]]))
      .attr('stroke', 'white')
      .style('stroke-width', '0px');

    this.svg
      .append('text')
      .attr('dy', '0.9em')
      .style('text-anchor', 'middle')
      .attr('class', 'inner-circle')
      .attr('font-size', '23px')
      .text((d: any) => {
        if (this.type === 'pie') {
          // return '90';
          // return d3.sum(data, d => d[this._keys[0]]);
          return '';
        } else {
          return '';
        }
      });

    this.svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .attr('font-size', '14px')
      .html((d: any) => {
        return parseFloat(d.data[this._keys[0]]).toFixed(2) + '%';
      })

      .attr('transform', (d: any) => {
        var _d = arc.centroid(d);
        _d[0] *= 1.4; //multiply by a constant factor
        _d[1] *= 1.3; //multiply by a constant factor
        return 'translate(' + _d + ')';
      })
      .style('text-anchor', 'middle');
  }
  createlegend() {
    // if (this.type === 'pie') {
    //   var n = this._data.length / 2;
    //   var legendGroup = svg
    //     .append('g')
    //     .attr('transform', 'translate(' + 100 + ',10)');

    //   var legend = legendGroup
    //     .selectAll('.legend')
    //     .data(this._data)
    //     .enter()
    //     .append('g')
    //     .attr('transform', function (d, i) {
    //       return (
    //         'translate(' +
    //         (i % n) * itemWidth +
    //         ',' +
    //         Math.floor(i / n) * itemHeight +
    //         ')'
    //       );
    //     })
    //     .attr('class', 'legend');

    //   var rects = legend
    //     .data(piecolor)
    //     .append('rect')
    //     .attr('width', 15)
    //     .attr('height', 15)
    //     .style('fill', (d: any) => {
    //       return d;
    //     });

    //   var text = legend
    //     .data(this._data)
    //     .append('text')
    //     .attr('x', 15)
    //     .attr('y', 12)
    //     .text(function (d) {
    //       return d.status;
    //     })
    //     .style('font-size', '12px');
    // } else
    var piedata = ['Present', 'Status Unknown', 'Absent', 'On Leave'];
    var piecolor = ['#264e86', '#4d85bd', '#7aac5a', '#cc3333'];

    var donutcolor = ['#7aac5a', '#cc3333'];

    var itemWidth = 80;
    var itemHeight = 18;
    var color = d3.scaleOrdinal().domain(piedata).range(d3.schemeSet2);
    if (this.type === 'latelogindonut') {
      const svg = d3.select(this.donutlegendRef.nativeElement);

    

      svg
        // .style('position', 'relative')
        // .style('left', '2px')
        .style('text-align', 'center');

      svg
        .selectAll('mydots')
        .data(donutcolor)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
          return 10 + i * 73;
        })
        .attr('y', 10)
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', (d: any) => {
          return d;
        });
      svg
        .selectAll('mylabels')
        .data(this._data)
        .enter()
        .append('text')
        .attr('y', 20)
        .attr('x', function (d, i) {
          return 45 + i * 73;
        })
        .style('fill', 'black')
        .style('font-size', '11px')
        .text(function (d) {
          //  console.log(d)
          return d.llname;
        })
        .attr('text-anchor', 'middle');
      // .style('alignment-baseline', 'middle')
    }
    if (this.type === 'earlylogoutdonut') {
      var donutdata = this._data;

      const elsvg = d3.select(
        this.type === 'latelogindonut'
          ? this.donutlegendRef.nativeElement
          : this.eldonutlegendRef.nativeElement
      );
      elsvg
        // .attr('width', '100%')
        // .attr('height', '8vh')
        .append('g')
        .attr(
          'transform',
          'translate(' + this.margin + ',' + this.margin + ')'
        );
     // elsvg.style('position', 'relative').style('left', '2px');

      elsvg
        .selectAll('mydots')
        .data(donutcolor)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
          return 10 + i * 73;
        })
        .attr('y', 10)
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', (d: any) => {
          return d;
        });

      elsvg
        .selectAll('mylabels')
        .data(donutdata)
        .enter()
        .append('text')
        .attr('y', 20)
        .attr('x', function (d, i) {
          return 55 + i * 73;
        })
        .style('fill', 'black')
        .style('font-size', '11px')
        .text(function (d: any) {
         // console.log(d);
          return d.elname;
        })
        .attr('text-anchor', 'middle');
      // .style('alignment-baseline', 'middle');
    }
  }
}
