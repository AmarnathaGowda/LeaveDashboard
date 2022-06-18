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
  selector: 'dashboard-ui-penalinstance',
  templateUrl: './penalinstance.component.html',
  styleUrls: ['./penalinstance.component.scss'],
})
export class PenalinstanceComponent implements OnInit {
  @Input() data: any;
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('penalLegend', { read: ElementRef, static: true })
  penalLegendRef!: ElementRef<HTMLDivElement>;
  svg: any;
  width: any;
  height: any;
  margin = { top: 20, right: 80, bottom: 30, left: 50 };
  trends: { name: string; values: { timescale: any; total: number }[] }[];
  legend: any;
  maxlength;
  newColor = [];
  isRendered = false;
  constructor() {}

  ngOnChanges(_changes: SimpleChanges) {
    if (this.isRendered) {
      if (this.data.length) {
        let arrayList = this.data.map((y: any[], i) => {
          let color = ['#4d85bd', '#264e86'];
          // let color = ['#4d85bd', '#2FFe86'];
          this.newColor.push(
            color[i]
              ? color[i]
              : '#' + (Math.random().toString(16) + '00000').slice(2, 8)
          );
          return y.values;
        });
        let mergeDataValues = Object.keys(arrayList)
          .map((key) => arrayList[key])
          .reduce((x, y) => {
            return [...x, ...y];
          });
        this.maxlength = d3.max(mergeDataValues, (d: any) => {
          return parseFloat(d['count']);
        });
      }

      this.width =
        this.svgContainerRef.nativeElement.parentElement?.parentElement
          ?.parentElement?.offsetWidth +
        this.maxlength / 6;

      this.height =
        this.svgContainerRef.nativeElement.parentElement?.parentElement
          ?.parentElement?.offsetHeight - 190;

      this.generateChart();
      this.createlegend();
    }
  }

  ngOnInit(): void {
    let arrayList = this.data.map((y: any[], i) => {
      let color = ['#4d85bd', '#264e86'];
      // let color = ['#4d85bd', '#2FFe86'];
      this.newColor.push(
        color[i]
          ? color[i]
          : '#' + (Math.random().toString(16) + '00000').slice(2, 8)
      );
      return y.values;
    });
    let mergeDataValues = Object.keys(arrayList)
      .map((key) => arrayList[key])
      .reduce((x, y) => {
        return [...x, ...y];
      });
    this.maxlength = d3.max(mergeDataValues, (d: any) => {
      return parseFloat(d['count']);
    });
    this.width =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetWidth +
      this.maxlength / 6;

    this.height =
      this.svgContainerRef.nativeElement.parentElement?.parentElement
        ?.parentElement?.offsetHeight - 190;

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
    this.penalLegendRef.nativeElement.innerHTML = ''; // clear all contents
    if (this.data.length === 0) {
      this.svgContainerRef.nativeElement.innerHTML = 'No Data';
      return;
    }
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height + this.margin.top + this.margin.bottom * 3)
      .append('g')
      .attr(
        'transform',
        `translate(${this.margin.left - 10},${this.margin.top})`
      );

    // this.svg = d3.select(this.svgContainerRef.nativeElement);
    // this.width = +this.svg.attr('this.width') - margin.left - margin.right;
    // this.height = +this.svg.attr('this.height') - margin.top - margin.bottom;
    // const g = this.svg
    //   .append('g')
    //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // set the ranges
    var x = d3.scaleBand().rangeRound([0, this.width]).padding(1),
      y = d3.scaleLinear().rangeRound([this.height, 0]),
      z = d3.scaleOrdinal(this.newColor);

    // define the line
    var line = d3
      .line()
      .x(function (d: any) {
        return x(d.name);
      })
      .y(function (d: any) {
        return y(d.count);
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
            name: d.name,
            count: d.count,
          };
        }),
      };
    });

    x.domain(this.data[0].values.map((d: any) => d['name']));

    //   this.data.map(function (d) {
    //     return d.timescale;
    //   })
    // );

    y.domain([0, this.maxlength]);

    // d3.max(this.data[0].values, (d: any) => {
    //   return parseFloat(d['count']);
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
    // Create a tooltip.
    const tooltip = d3
      .select(this.svgContainerRef.nativeElement)
      .append('div')
      .style('z-index', '10')
      .style('visibility', 'hidden');
    const mouseover = function (event, d) {
      tooltip
        .style('cursor', 'pointer')
        .html('a tooltip <br/>' + d.name + '<br/>' + d.count)
        .style('opacity', 1);
    };
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
      .attr(
        'd',
        function (d: {
          values: [number, number][] | Iterable<[number, number]>;
        }) {
          return line(d.values);
        }
      )
      
      .style({'stroke-width': '15px','stroke': function (d: { name: string }) {
        return z(d.name);
      }});

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
      .style('stroke', function (d: { name: string }) {
        return z(d.name);
      })
      .style('stroke-width', '3px')
       
      .selectAll('circle.line')
      .data(function (d: any[]) {
        return d.values;
      })
      .enter()
      .append('circle')
      .attr('r', 5)
      // .style('stroke-width', 3)
      .style('fill', 'black')
      .attr('cx', function (d: { name: string }) {
        return x(d.name);
      })
      .attr('cy', function (d: { count: d3.NumberValue }) {
        return y(d.count);
      });
    // .on('mouseover', function (i,d: any) {
    //   return tooltip
    //     .style('visibility', 'visible').text('Count = ' + d.count)
    //     .attr('x', x(d.name))
    //     .attr('y', y(d.count));

    // })
    // .on('mousemove', function (event,d:any) {
    //   return tooltip.attr('x', x(d.name))
    //   .attr('y', y(d.count));
    // })
    // .on('mouseout', function () {
    //    return tooltip.style('visibility', 'hidden');
    // });

      trend
      .append('g')
      .selectAll('text')
      .data((d: any) => d.values)
      .enter()
      .append('g')
      .append('text')

      .attr('x', (d: any) => {
        return x(d.name);
      })
      .attr('y', (d: any) => {
        return y(d.count);
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '7px')
      .attr('dx', '-1em')
      .attr('dy', '-0.1em')
      .attr('stroke','none')
      .attr('fill', 'transparent')
      .text(function (d: any) {
        return d.count;
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

    // trend
    //   .selectAll("circle.text")
    //   .data(function(d){ return d.values })
    //   .enter()
    //   .append('text')
    //   .attr('x', function(d) { return x(d.timescale) + 15; })
    //   .attr('y', function(d) { return y(d.total); })
    //   .text(function(d) { return d.total; });

    // Draw the axis
    this.svg
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0, ' + this.height + ')')
      .style('color', 'black')
      .call(d3.axisBottom(x))
      .selectAll('.tick text')
      .call(this.wrap, 100)
      .attr('transform', 'translate(-70,20)rotate(-45)');

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

    var timeScales = this.data.map(function (name: { timescale: string }) {
      return x(name.timescale);
    });

    // const mouseover = (event: any, d: any) => {
    //   focus.style('display', null);
    //   d3.selectAll('.points text').style('display', null);
    // };
    const mouseout = (event: any, d: any) => {
      return tooltip.style('visibility', 'hidden');
      // focus.style('display', 'none');
      // d3.selectAll('.points text').style('display', 'none');
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
    if (this.data.length) {
      var svg = d3.select(this.penalLegendRef.nativeElement);
      svg
        .attr(
          'width',
          this.svgContainerRef.nativeElement.parentElement?.parentElement
            ?.parentElement?.offsetWidth
        )
        .attr('class', 'svg-legend')
        // .attr('height', '10vh')
        .append('g')
        .attr('transform', 'translate(0 ,0)');

      var lcolor = [];
      var ldata = this.data.map((d: any, i: number) => {
        let legendcolors = ['#4d85bd', '#264e86'];
        lcolor.push(legendcolors[i]);
        return d['month'];
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
          return 120 + i * 140;
        })
        .style('fill', 'black')
        .style('font-size', '12px')
        .text(function (d: any) {
          return d;
        })
        .attr('text-anchor', 'middle')
        .style('alignment-baseline', 'middle');
    }
  }
}
