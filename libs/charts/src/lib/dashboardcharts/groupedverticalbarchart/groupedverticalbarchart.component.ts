import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ScaleBand } from 'd3';
import * as d3 from 'd3';
@Component({
  selector: 'dashboard-ui-groupedverticalbarchart',
  templateUrl: './groupedverticalbarchart.component.html',
  styleUrls: ['./groupedverticalbarchart.component.scss'],
})
export class GroupedverticalbarchartComponent
  implements AfterViewInit, OnChanges
{
  @Input() data!: any[];
  height: any;
  @Input() margin = { top: 10, left: 10, right: 10, bottom: 20 };
  @Input() innerPadding = 0.4;
  @Input() outerPadding = 0.4;
  @Input() seriesInnerPadding = -0.1;
  domain: any;
  @Input() barColorss = ['#264e86', '#5e88fc', '#74dbef'];
  @Input() color: any;
  public svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('linebarlegend', { read: ElementRef, static: true })
  linebarlegendRef!: ElementRef<HTMLDivElement>;
  mergeDataValues: any;
  totalCount = 0;

  constructor() {}

  @HostListener('window:resize')
  onResize() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isRendered) {
      this.linebarlegendRef.nativeElement.innerHTML = '';
      this.createSVG();
      this.createChart();
      this.createlegend();
    }
  }

  ngAfterViewInit(): void {
    // console.log(this.data, 'penal metrics');

    let arrayList = this.data.map((y: any) => {
      return y.series;
    });
    this.mergeDataValues = Object.keys(arrayList)
      .map((key) => arrayList[key])
      .reduce((x, y) => {
        return [...x, ...y];
      });
    this.domain = [
      0,
      d3.max(this.mergeDataValues, (d: any) => {
        return d.count;
      }),
    ];

    this.createSVG();
    this.createChart();
    this.createlegend();
    this.isRendered = true;
  }

  private createSVG(): void {
    this.height =
      this.linebarlegendRef.nativeElement.parentElement?.parentElement?.parentElement?.offsetHeight-60;

    this.svgContainerRef.nativeElement.innerHTML = '';
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('width', '1500')
      .attr('height', this.height - 10)
      .append('g')
      .attr('width', '100%')
      .attr('transform', 'translate(0, 0)')
      .attr('class', 'bar-chart-vertical');
  }

  private isDataValid(): boolean {
    return this.data && this.data.length > 0;
  }

  private getBandScale(
    domain: string[],
    range: any,
    innerPadding = 0,
    outerPadding = 0
  ) {
    const scale: any | ScaleBand<string> = d3
      .scaleBand()
      .range(range)
      .domain(domain)
      .paddingInner(innerPadding)
      .paddingOuter(outerPadding);
    scale.type = 'BAND';
    return scale;
  }

  private createChart(): void {
    let a;
    if (this.data.length) {
      let arrayList = this.data.map((y: any) => {
        return y.series;
      });
      this.mergeDataValues = Object.keys(arrayList)
        .map((key) => arrayList[key])
        .reduce((x, y) => {
          return [...x, ...y];
        });
      a = d3.max(this.mergeDataValues, (d: any) => {
        return d.count;
      });
      this.totalCount = parseInt(a);
      console.log('count', a);
      this.domain = [
        0,
        d3.max(this.mergeDataValues, (d: any) => {
          return d.count;
        }),
      ];
    }

    if (!this.data.length) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
      this.linebarlegendRef.nativeElement.innerHTML = '';
      return;
    }

    if (this.isDataValid()) {
      const margin = {
        top: this.margin.top,
        right: this.margin.right,
        bottom: this.margin.bottom,
        left: this.margin.left,
      };
      const height = this.height - margin.top - margin.bottom;
      const width =
        this.svgContainerRef.nativeElement.getBoundingClientRect().width -
        margin.left -
        margin.right;
      const groupNames = this.data.map((item) => item.name);
      const groupLabels =
        this.data.length > 0
          ? this.data[0].series.map((item) => item.name)
          : [];

      const xScale = this.getBandScale(
        groupNames,
        [0, width],
        this.innerPadding,
        this.outerPadding
      ).round(true);
      const x1Scale = this.getBandScale(
        groupLabels,
        [0, xScale.bandwidth()],
        this.seriesInnerPadding,
        this.outerPadding
      ).round(true);

      let chartContainer = this.svg
        .selectAll<SVGGElement, number>('g.chart-container')
        .data([1]);
      chartContainer = chartContainer
        .enter()
        .append('g')
        .attr('class', 'chart-container')
        .merge(chartContainer)
        .attr('transform', `translate(${margin.left}, ${margin.right})`);

      let chartWrap = chartContainer
        .selectAll<SVGGElement, number>('g.chart-wrap')
        .data([1]);
      chartWrap = chartWrap
        .enter()
        .append('g')
        .attr('class', 'chart-wrap')
        .merge(chartWrap)
        .attr('transform', 'translate(0, 0)');

      const xAxis = chartWrap
        .selectAll<SVGGElement, number>('g.x-axis')
        .data([1]);
      xAxis
        .enter()
        .append('g')
        .attr('class', 'x-axis')
        .style('color', 'black')
        .merge(xAxis)
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(-this.height).tickFormat(null))
        .selectAll('text')
        .style('text-anchor', 'middle');

      const y = d3
        .scaleLinear()
        .domain(this.domain)
        .nice()
        .rangeRound([height, 0]);

      let barWrap = chartWrap
        .selectAll<SVGGElement, number>('g.bar-wrap')
        .data([1]);
      barWrap.exit().remove();
      barWrap = barWrap
        .enter()
        .append('g')
        .attr('class', 'bar-wrap')
        .merge(barWrap);

      let barGroup = barWrap
        .selectAll<
          SVGGElement,
          { name: string; series: { name: string; count: number } }
        >('g.bar-group')
        .data(this.data);
      barGroup.exit().remove();
      barGroup = barGroup
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .merge(barGroup)
        .attr('height', (d) => height - y(d.count))
        .attr('transform', (d) => `translate(${xScale(d.name)}, 0)`);

      const barRects = barGroup
        .selectAll<SVGRectElement, { name: string; count: number }>('rect.bar')
        .data((d) => d.series.map((item) => item));
      console.log(height);
      barRects
        .enter()
        .append('rect')
        .merge(barRects)
        .attr('class', 'bar')
        // .attr('width', x1Scale.bandwidth())
        .attr('width','30px')
        .attr('height', (d: any) => height - y(d.count))
        .attr('x', (d: any) => x1Scale(d.name))
        .attr('y', (d: any) => y(d.count))
        .attr('fill', (d, i) => this.barColorss[i]);

      barRects
        .enter()
        .append('g')
        .append('text')
        .attr('dy', '2em')
        .attr('x', (d: any) => x1Scale(d.name) + 17)
        // //.attr('y', (d: any) => (d.count))
        .attr('y', (d: any) => y(d.count))
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '15px')
        .attr('fill', 'white')
        .text(function (d: any) {
          return d.count;
        });

      const yAxis = chartWrap
        .selectAll<SVGGElement, number>('g.y-axis')
        .data([1]);
      yAxis
        .enter()
        .append('g')
        .attr('class', 'y-axis')
        .style('color', 'black')
        .merge(yAxis)
        .call(d3.axisRight(y).tickSize(-100).tickFormat(null));
    }
  }

  createlegend() {
    this.linebarlegendRef.nativeElement.innerHTML = '';
    const svg = d3
      .select(this.linebarlegendRef.nativeElement)
      .append('svg')
      .attr(
        'width',
        this.linebarlegendRef.nativeElement.parentElement?.parentElement
          ?.parentElement?.offsetWidth + 'px'
      )
      .attr('height', '40px');

    this.svg
      // .attr('width', '100%')
      // .attr('height', this.height/2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');

    var ldata = [
      'Late Login/Early Logout',
      'Penalization Leave',
      'Penalization LOP Instances',
    ];
    var lcolor = ['#264e86', '#5e88fc', '#74dbef'];

    svg
      .selectAll('mydots')
      .data(
        this.data[0].series.map((d, i) => {
          return lcolor[i];
        })
      )
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return 0 + i * 150;
      })
      .attr('y', 10)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', (d: any) => {
        return d;
      });
    svg
      .selectAll('mylabels')
      .data(this.data[0].series)
      .enter()
      .append('text')
      .attr('y', 18)
      .attr('x', function (d, i) {
        return 80 + i * 150;
      })
      .style('fill', 'black')
      .style('font-size', '11px')
      .text(function (d: any) {
        return d.name;
      })
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle');
  }
}
