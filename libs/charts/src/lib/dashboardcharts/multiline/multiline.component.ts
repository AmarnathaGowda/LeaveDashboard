import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'dashboard-ui-multiline',
  templateUrl: './multiline.component.html',
  styleUrls: ['./multiline.component.scss'],
})
export class MultilineComponent implements OnInit {
  @ViewChild('svgContainer', { read: ElementRef, static: true })
  svgContainerRef!: ElementRef<HTMLDivElement>;
  width: any;
  _data: any;
  olddata: any;
  category = [];
  height: number | undefined;
  color: any;
  margin = { top: 80, right: 80, bottom: 140, left: 80 };
  isRendered = false;
  svg: any;
  sortingObj = [];
  constructor() {}
  ngOnInit(): void {
    this.olddata = [
      {
        month: 'January',
        values: [
          {
            name: 'Afternoon 1 [12pm-9PM]',
            count: 624,
          },
          {
            name: 'Afternoon 2 [12:30pm-9:30pm]',
            count: 3755,
          },
          {
            name: 'AIrport 8 [5;30am-2:30pm]',
            count: 11,
          },
          {
            name: 'Airport shift 1 [7am-4pm]',
            count: 28,
          },
          {
            name: 'Airport shift 2 [2pm-11pm]',
            count: 5,
          },
          {
            name: 'Airport shift 3 [10:30pm-7:30am]',
            count: 1,
          },
          {
            name: 'Airport shift 4 [8am-5pm]',
            count: 4,
          },
          {
            name: 'Closing Shift 1 [1:00pm-10:00pm]',
            count: 1933,
          },
          {
            name: 'Closing shift 2 [1:30pm-10:30pm]',
            count: 479,
          },
          {
            name: 'Closing Shift 3 [2pm-11pm',
            count: 47,
          },
          {
            name: 'DC 1st shift- Flexi [10am-6:30pm]',
            count: 1,
          },
          {
            name: 'Half day 1 and Weekly off [9am-1:30pm]',
            count: 171,
          },
          {
            name: 'Half day 11 and Weekly off [11am-3:30pm]',
            count: 60,
          },
          {
            name: 'Half day 13 and Weekly off [12pm-4:30pm]',
            count: 8,
          },
          {
            name: 'Half day 15 and Weekly off [12:30pm-5pm]',
            count: 4,
          },
          {
            name: 'Half day 3 and Weekly off [9:30am-2pm]',
            count: 55,
          },
          {
            name: 'Half day 5 and Weekly off [9:45am-2:15pm]',
            count: 8,
          },
          {
            name: 'Half day 7 and Weekly off [10am-2:30pm]',
            count: 134,
          },
          {
            name: 'Half day 9 and Weekly off [10:30am-3pm]',
            count: 324,
          },
          {
            name: 'Morning 1 9:30-6:30pm',
            count: 286,
          },
          {
            name: 'Morning 2 [9:45-6:45pm]',
            count: 1,
          },
          {
            name: 'Morning 3 [10-7pm]',
            count: 10336,
          },
          {
            name: 'Morning 4 [10:15-7:15pm]',
            count: 3,
          },
          {
            name: 'Morning 5 [10:30am-7:30pm]',
            count: 1718,
          },
          {
            name: 'Morning 6 [11-8pm]',
            count: 1028,
          },
          {
            name: 'Morning 7 [11:15-8:15pm]',
            count: 172,
          },
          {
            name: 'Morning 8 [6:30am-3:30pm]',
            count: 15,
          },
          {
            name: 'Morning 9 [11:30am-8:30pm}',
            count: 55,
          },
          {
            name: 'Opening Manager shift 9-6PM',
            count: 886,
          },
          {
            name: 'Weekly off and Half day 10 [3pm-7:30pm]',
            count: 91,
          },
          {
            name: 'Weekly off and Half day 12 [3:30pm-8pm]',
            count: 29,
          },
          {
            name: 'Weekly off and Half day 14 [4:30pm-9pm]',
            count: 47,
          },
          {
            name: 'Weekly off and Half day 16 [5pm-9:30pm]',
            count: 615,
          },
          {
            name: 'Weekly off and Half day 18 [5:30pm-10pm]',
            count: 319,
          },
          {
            name: 'Weekly off and Half day 2 [1:30pm-6pm]',
            count: 7,
          },
          {
            name: 'Weekly off and Half day 20 [6pm-10:30pm]',
            count: 58,
          },
          {
            name: 'Weekly off and Half day 4 [2pm-6:30pm]',
            count: 4,
          },
          {
            name: 'Weekly off and Half day 6 [2:45pm-7:15pm]',
            count: 5,
          },
          {
            name: 'Weekly off and Half day 8 [2:30pm-7pm]',
            count: 1,
          },
        ],
      },
      {
        month: 'February',
        values: [
          {
            name: 'Afternoon 1 [12pm-9PM]',
            count: 822,
          },
          {
            name: 'Afternoon 2 [12:30pm-9:30pm]',
            count: 3690,
          },
          {
            name: 'AIrport 8 [5;30am-2:30pm]',
            count: 4,
          },
          {
            name: 'Airport shift 1 [7am-4pm]',
            count: 16,
          },
          {
            name: 'Airport shift 3 [10:30pm-7:30am]',
            count: 1,
          },
          {
            name: 'Closing Shift 1 [1:00pm-10:00pm]',
            count: 2171,
          },
          {
            name: 'Closing shift 2 [1:30pm-10:30pm]',
            count: 585,
          },
          {
            name: 'Closing Shift 3 [2pm-11pm',
            count: 59,
          },
          {
            name: 'DC 1st shift- Flexi [10am-6:30pm]',
            count: 3,
          },
          {
            name: 'Half day 1 and Weekly off [9am-1:30pm]',
            count: 93,
          },
          {
            name: 'Half day 11 and Weekly off [11am-3:30pm]',
            count: 42,
          },
          {
            name: 'Half day 13 and Weekly off [12pm-4:30pm]',
            count: 11,
          },
          {
            name: 'Half day 15 and Weekly off [12:30pm-5pm]',
            count: 4,
          },
          {
            name: 'Half day 3 and Weekly off [9:30am-2pm]',
            count: 29,
          },
          {
            name: 'Half day 5 and Weekly off [9:45am-2:15pm]',
            count: 8,
          },
          {
            name: 'Half day 7 and Weekly off [10am-2:30pm]',
            count: 207,
          },
          {
            name: 'Half day 9 and Weekly off [10:30am-3pm]',
            count: 250,
          },
          {
            name: 'Morning 1 9:30-6:30pm',
            count: 317,
          },
          {
            name: 'Morning 3 [10-7pm]',
            count: 10695,
          },
          {
            name: 'Morning 4 [10:15-7:15pm]',
            count: 3,
          },
          {
            name: 'Morning 5 [10:30am-7:30pm]',
            count: 2155,
          },
          {
            name: 'Morning 6 [11-8pm]',
            count: 1017,
          },
          {
            name: 'Morning 7 [11:15-8:15pm]',
            count: 132,
          },
          {
            name: 'Morning 8 [6:30am-3:30pm]',
            count: 10,
          },
          {
            name: 'Morning 9 [11:30am-8:30pm}',
            count: 48,
          },
          {
            name: 'Opening Manager shift 9-6PM',
            count: 857,
          },
          {
            name: 'Weekly off and Half day 10 [3pm-7:30pm]',
            count: 55,
          },
          {
            name: 'Weekly off and Half day 12 [3:30pm-8pm]',
            count: 24,
          },
          {
            name: 'Weekly off and Half day 14 [4:30pm-9pm]',
            count: 82,
          },
          {
            name: 'Weekly off and Half day 16 [5pm-9:30pm]',
            count: 513,
          },
          {
            name: 'Weekly off and Half day 17 [1pm-5:30pm]',
            count: 9,
          },
          {
            name: 'Weekly off and Half day 18 [5:30pm-10pm]',
            count: 235,
          },
          {
            name: 'Weekly off and Half day 2 [1:30pm-6pm]',
            count: 3,
          },
          {
            name: 'Weekly off and Half day 20 [6pm-10:30pm]',
            count: 39,
          },
          {
            name: 'Weekly off and Half day 8 [2:30pm-7pm]',
            count: 4,
          },
        ],
      },
    ];
  }
  ngAfterViewInit(): void {
    let z = [];
    const ba: any = [];
    let y;
    this.olddata.map((a: { values: any[]; month: any }) => {
      z = a.values.map((b: any) => {
        return {
          name: b.name,
          count: b.count,
          month: a.month,
        };
      });
      if (ba.length) {
        y = z.concat(ba[0], z);
      } else {
        ba.push(z);
      }
      this.category.push(a.month);
    });
    this._data = y;
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
    this.color = d3
      .scaleOrdinal()
      .domain(this.category)
      .range(['#2D005E', '#700DE4']);
    this.createChart();
    this.isRendered = true;
  }
  createChart() {
    let xScale = d3.scaleBand(); // can't use scaleTime as the time interval between bidding exercises are not evenly spaced
    // var parseDate = d3.timeParse("%Y-%m")
    let monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    let lineOpacity = 1;
    let lineStroke = '1.8px';
    let axisPad = 6; // axis formatting
    let R = 6; //legend marker

    const bounds = d3
      .select(this.svgContainerRef.nativeElement)
      .node()
      .getBoundingClientRect();

    let margin = { top: 80, right: 80, bottom: 140, left: 80 };
    let legendX = 100;
    let legendY = 0;
    let legendG = -60;

    if (bounds.width <= 768) {
      margin = { top: 80, right: 40, bottom: 20, left: 40 };
      //legendX = 0
      //legendY = 20
      //legendG = -110
    }

    let width = bounds.width - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let tickNum = bounds.width <= 768 ? 48 : 24;

    xScale
      .domain(this._data.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    // let yScale: any;
    // eslint-disable-next-line prefer-const
    const yScale = d3.scaleLinear().domain([0, 1000]).range([height, 0]);
    // .DOMAIN([0,d3.max(this._data, (d) => {          return d['count'];        })])
    this.svg = d3
      .select(this.svgContainerRef.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    var g = this.svg.append('g');
    let mouseG = g.append('g').attr('class', 'mouse-over-effects');
    // CREATE AXES //
    // render axis first before lines so that lines will overlay the horizontal ticks
    let ticks = xScale.domain().filter((d, i) => {
      return !(i % tickNum);
    }); // only show tick labels for the first bidding exercise of the year
    let xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickSizeInner(-height);
    // .tickValues(ticks)

    const yAxis = d3.axisLeft(yScale).ticks(10, 's').tickSize(-width);

    g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.select('.x_axis')
    .style('color', 'black')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .call((g) => {
        g.selectAll('text')
          .style('text-anchor', 'middle')
          .attr('y', axisPad)
          .attr('fill', '#A9A9A9');

        g.selectAll('line').attr('stroke', '#A9A9A9');

        g.select('.domain').attr('stroke', '#A9A9A9');
      })
      .selectAll('text')

      .style('text-anchor', 'end')
      .attr('dx', '-.9em')
      .attr('dy', '-0.35em')
      .attr('transform', 'rotate(-45)');

    g.select('.y_axis')
    .style('color', 'black')
      .call(yAxis)
      .call((g) => {
        g.selectAll('text')
          .style('text-anchor', 'middle')
          .attr('x', -axisPad * 2)
          .attr('fill', '#A9A9A9');

        g.selectAll('line')
          .attr('stroke', '#A9A9A9')
          .attr('stroke-width', 0.7) // make horizontal tick thinner and lighter so that line paths can stand out
          .attr('opacity', 0.3);

        g.select('.domain').remove();
      });

    // CREATE LEGEND //
    let svgLegend = d3.select('.gLegend');

    const tooltip = d3
      .select(this.svgContainerRef.nativeElement)
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', '#D3D3D3')
      .style('padding', 6)
      .style('display', 'none');

    svgLegend.attr('transform', 'translate(' + 0 + ',' + legendG + ')');

    let legend = svgLegend
      .selectAll('.legend')
      .data(this.category)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return 'translate(' + i * legendX + ',' + i * legendY + ')';
      });

    legend
      .append('circle')
      .attr('class', 'legend-node')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', R)
      .style('fill', (d) => this.color(d));

    legend
      .append('text')
      .attr('class', 'legend-text')
      .attr('x', R * 2)
      .attr('y', R / 2)
      .style('fill', '#A9A9A9')
      .style('font-size', 12)
      .text((d) => d);

    // APPEND MULTIPLE LINES //
    // line generator
    let line = d3
      .line()
      .x((d: any) => xScale(d.name) + xScale.bandwidth() / 2)
      .y((d: any) => yScale(d.count));

    // let res_nested = d3
    //   .nest() // necessary to nest data so that keys represent each  category
    //   .key((d) => d.month)
    //   .entries(this._data);
    const nameYearsCount = this._data.reduce((obj, { month, name, count }) => {
      if (!(month in obj)) {
        obj[month] = {
          [month]: count,
        };
      } else {
        // I.e. if the year doesn't exist, default to zero
        obj[month][name] = count;
      }
      return obj;
    }, {});

    // Now transform it into the desired format
    const res_nested = Object.entries(nameYearsCount).map(
      ([montha, yearsCount]) => {
        const values = Object.entries(yearsCount).map(([name, count]) => ({
          name: name,
          count: count,
          month: montha,
        }));
        return {
          key: montha,
          values,
        };
      }
    );

    var lines = g.select('.lines');

    let glines = lines.selectAll('.line-group').data(res_nested);

    glines
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .style('stroke', (d, i) => this.color(i))
      .style('fill', 'none')
      .style('opacity', lineOpacity)
      .style('stroke-width', lineStroke);

    glines.select('path').attr('d', (d) => line(d.values)); // update

    glines.exit().remove();

    // CREATE HOVER TOOLTIP WITH VERTICAL LINE //
    mouseG
      .append('path') // create vertical line to follow mouse
      .attr('class', 'mouse-line')
      .style('stroke', '#A9A9A9')
      .style('stroke-width', lineStroke)
      .style('opacity', '0');

    //     var lines = document.getElementsByClassName('line');
    //     const _color = this.color;
    //     let mousePerLine = mouseG
    // .selectAll('.mouse-per-line')
    // .data(res_nested)
    // .enter()
    // .append('g')
    // .attr('class', 'mouse-per-line');

    // mousePerLine
    // .append('circle')
    // .attr('r', 4)
    // .style('stroke', function (d) {
    //   return _color(d.key);
    // })
    // .style('fill', 'none')
    // .style('stroke-width', lineStroke)
    // .style('opacity', '0');

    // mouseG
    // .append('svg:rect') // append a rect to catch mouse movements
    // .attr('width', width)
    // .attr('height', height)
    // .attr('fill', 'none')
    // .attr('pointer-events', 'all')
    // .on('mouseout', function () {
    //   // on mouse out hide line, circles and text
    //   d3.select('.mouse-line').style('opacity', '0');
    //   d3.selectAll('.mouse-per-line circle').style('opacity', '0');
    //   d3.selectAll('.mouse-per-line text').style('opacity', '0');
    //   d3.selectAll('#tooltip').style('display', 'none');
    // })
    // .on('mouseover', function () {
    //   // on mouse in show line, circles and text
    //   d3.select('.mouse-line').style('opacity', '1');
    //   d3.selectAll('.mouse-per-line circle').style('opacity', '1');
    //   d3.selectAll('#tooltip').style('display', 'block');
    // })
    // .on('mousemove', function () {
    //   // update tooltip content, line, circles and text when mouse moves
    //   const mouse = d3.mouse(this); // detect coordinates of mouse position within svg rectangle created within mouseG

    //   d3.selectAll('.mouse-per-line').attr('transform', function (d, i) {
    //     let xDate = scaleBandPosition(mouse); // None of d3's ordinal (band/point) scales have the 'invert' method to to get date corresponding to distance of mouse position relative to svg, so have to create my own method
    //     let bisect = d3.bisector(function (d: any) {
    //       return d.name;
    //     }).left; // retrieve row index of date on parsed csv
    //     let idx = bisect(d.values, xDate);

    //     d3.select('.mouse-line').attr('d', function () {
    //       let data =
    //         'M' + (xScale(d.values[idx].name) + 2).toString() + ',' + height;
    //       data += ' ' + (xScale(d.values[idx].name) + 2).toString() + ',' + 0;
    //       return data;
    //     });
    //     return (
    //       'translate(' +
    //       xScale(d.values[idx].name).toString() +
    //       ',' +
    //       yScale(d.values[idx].count) +
    //       ')'
    //     );
    //   });
    //   }
    // );
  }
}

//   updateTooltipContent(mouse, res_nested);
// });
// function scaleBandPosition(mouse) {
// let xPos = mouse[0];
// let domain = xScale.domain();
// let range = xScale.range();
// let rangePoints = d3.range(range[0], range[1], xScale.step());
// return domain[d3.bisectLeft(rangePoints, xPos) - 9];
// }
// function updateTooltipContent(mouse: any, res_nested: any[]) {
// this.sortingObj = [];
// res_nested.map((d) => {
//   let xDate = scaleBandPosition(mouse);
//   let bisect = d3.bisector(function (d) {
//     return d.name;
//   }).left;
//   let idx = bisect(d.values, xDate);
//   this.sortingObj.push({
//     name: d.values[idx].name,
//     count: d.values[idx].count,
//   });
// });

// this.sortingObj.sort(function (x, y) {
//   return d3.descending(x.count, y.count);
// });

// let sortingArr = this.sortingObj.map((d) => d.key);

// let res_nested1 = res_nested.slice().sort(function (a, b) {
//   return sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key); // rank vehicle category based on price of count
// });

// tooltip
//   .html(
//     ' ( Name:' +
//       this.sortingObj[0].name +
//       ')</br>( Count:' +
//       this.sortingObj[0].count +
//       ')'
//   )
//   .style('display', 'block')
//   .style('left', d3.event.pageX + 20)
//   .style('top', d3.event.pageY - 20)
//   .style('font-size', 11.5)
//   .selectAll()
//   .data(res_nested1)
//   .enter() // for each vehicle category, list out name and price of count
//   .append('div')
//   .style('color', (d) => {
//     return _color(d.key);
//   })
//   .style('font-size', 15)
//   .html((d: any) => {
//     let xDate = scaleBandPosition(mouse);
//     let bisect = d3.bisector(function (d: any) {
//       return d.name;
//     }).left;
//     let idx = bisect(d.values, xDate);
//     return (
//       d.key.substring(0, 3) + '  : ' + d.values[idx].count.toString()
//     );
//   });
// }
