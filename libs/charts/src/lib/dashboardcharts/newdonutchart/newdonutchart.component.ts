import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { style } from 'd3';
@Component({
  selector: 'dashboard-ui-newdonutchart',
  templateUrl: './newdonutchart.component.html',
  styleUrls: ['./newdonutchart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewdonutchartComponent {
  svg: any;
  public isRendered = false;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('newdonutlegends', { read: ElementRef, static: true })
  newdonutlegends!: ElementRef<HTMLDivElement>;
  private _data: any;
  _keys: any;
  _colors: any;
  // @Input()
  // set data(value: any) {
  //   this._data = value;
  // }
  // get data() {
  //   return this._data;
  // }
  // @Input()
  // set keys(value: any) {
  //   this._keys = value;
  // }
  // get keys() {
  //   return this._keys;
  // }
  // @Input()
  // set colors(value: any) {
  //   this._colors = value;
  // }
  // get colors() {
  //   return this._colors;
  // }

  @Input() data: any[] = [];
  @Input('textColor') private textColor: string = '#ddddddd';
  @Input('isPercentage') private isPercentage: boolean = true;
  @Input('enablePolylines') private enablePolylines: boolean = true;
  private margin = { top: 10, right: 20, bottom: 30, left: 20 };
  width: any;
  height: any;
  private svgHalfDonut: any;
  private colors: any;
  radius: any;
  constructor() {
   // console.log(this.svgContainerRef);
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      setTimeout(() => {
        this._data = this.data;
        this.createSvg();
        this.createColors(this._data);
        
        this.createlegend();
        this.drawChart();
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
    // this.data =  [ {
    //   status: 'On Leave',
    //   totalCount: 263,
    //   percentage: 3.85,
    //   color: '#4d85bd',
    // },
    // {
    //   status: 'Status Unknown',
    //   totalCount: 657,
    //   percentage: 9.62,
    //   color: '#264e86',
    // },
    // {
    //   status: 'Absent',
    //   totalCount: 35,
    //   percentage: 10.51,
    //   color: '#cc3333',
    // },
    // {
    //   status: 'Present',
    //   totalCount: 5875,
    //   percentage: 76.02,
    //   color: '#7aac5a',
    // }];
    this._data = this.data;
    this.createSvg();
    this.createColors(this.data);
    this.drawChart();
    this.createlegend();
    this.isRendered = true;
  }

  private createSvg(): void {
    this.svgContainerRef.nativeElement.innerHTML = ''; // clear all contents
    this.width =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetWidth + this.margin.bottom;
    this.height =
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight &&
      this.svgContainerRef.nativeElement?.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 35;
    this.radius = Math.min(this.width, this.height) / 2;
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height-10}`)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      )
     
  }

  private createColors(data: any): void {
    const colorsRange: string[] = [];
    this.data.forEach((element) => {
      if (element.color) colorsRange.push(element.color);
    });
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.percentage.toString()))
      .range(colorsRange);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    if (!this._data.length) {
      this.svgContainerRef.nativeElement.innerHTML = '<h3>No Data</h3>'; // clear all contents
      this.newdonutlegends.nativeElement.innerHTML = ''; // clear all contents
      return;
    }
    const pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value((d: any) => {
        return d.percentage;
      });
    // to create half donut

    // const pie = d3.pie()
    // .startAngle(-90 * (Math.PI/180))
    // .endAngle(90 * (Math.PI/180))
    // .padAngle(.02)
    // .sort(null)
    // .value((d: any) => {
    //   return d.value;
    // });

    const data_ready = pie(this.data);

    let radius = Math.min(this.width, this.height) / 2 - this.margin.right;

    // The arc generator
    const arc = d3
      .arc()
      .innerRadius(this.radius * 0.5) // This is the size of the donut hole
      .outerRadius(this.radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    
      const arct = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colors(d.data.percentage))
      .attr('stroke', 'white')
      .style('stroke-width', '0px')
      .style('opacity', 1);

    // Add the polylines between chart and labels:
    var getAngle = function (d:any) {
      return (180 / Math.PI * (d.startAngle + d.endAngle)-15);
  };

  
  let addTo = 5;

    this.svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d: any) => {
        // const posA = arc.centroid(d); // line insertion in the slice
        // const posB = outerArc.centroid(d);  // line break: we use the other arc generator that has been built only for that
        // const posC = outerArc.centroid(d); // Label position = almost the same as posB
        // const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        // posC[0] = this.radius * 0.52 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        // return [posA, posB,posC]
        let posA = arc.centroid(d); // line insertion in the slice
             let posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
             let posC = outerArc.centroid(d); // Label position = almost the same as posB
             let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
             posC[0] = this.radius * 0.53 *(midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
             posC[0] = posC[0] + addTo;
             posC[1] = posC[1] + addTo;
             addTo = addTo + 3;
             return [posA, posB, posC];
          
      })
      
      let dy = 0;
      let index = 0;


    this.svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
     .attr('dy', '.35em')
      .text((d: any) => {
        //if(d.endAngle - d.startAngle<4*Math.PI/180){return ""}
        return d.data.percentage + '% (' + d.data.totalCount + ')';
      })
      .attr('transform', (d: any) => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.53 * (midangle < Math.PI ? 1 : -1);
        pos[1] = pos[1]-10;
        return 'translate(' + pos+ ')' 
        //+ 'rotate(' + getAngle(d) + ')' 
      })
      .attr('dy', (d) => {
         if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 < 5) {      
           let value = 0.53;
           if (index != 0) dy = dy + 1;
           index++;
           value = value + dy;
           return value.toString() + 'em';        
         } else {
           return null;
         }
      })    
      .style('text-anchor', (d: any) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';    
      })
      .style('font-size', '12px')
  
   }
      
     
  

  createlegend() {
    this.newdonutlegends.nativeElement.innerHTML = "";
    const svg = d3.select(this.newdonutlegends.nativeElement);
    const keys: any = [];
    const colors: any = [];
    this._data.map((d) => {
      //console.log(d.status);
      keys.push(d.status);
      colors.push(d.color);
    });

    const itemWidth = 70;
    const itemHeight = 18;

    const n = this._data.length / 2;
    const legendGroup = svg
      .append('g')
      .attr('class', 'svg-legend')
      .attr('transform', 'translate(' + 0 + ',0)');
    const legend = legendGroup
      .selectAll('.legend')
      .data(this._data)
      .style('height', '90px')
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return (
          'translate(' +
          (i % n) * itemWidth +
          ',' +
          Math.floor(i / n) * itemHeight +
          ')'
        );
      })
      .attr('class', 'legend')
      .style(
        'height',
         this.newdonutlegends.nativeElement?.offsetHeight - 190 + 'px'
      );

    const rects = legend
      .data(colors)
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', (d: any) => {
        return d;
      });

    const text = legend
      .data(this._data)
      .append('text')
      .attr('x', 17)
      .attr('y', 12)
      .text(function (d: any) {
        return d.status;
      })
      .style('font-size', '11px');
  }
}
