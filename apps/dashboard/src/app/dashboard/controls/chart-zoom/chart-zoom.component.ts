import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
  selector: 'dashboard-ui-chart-zoom',
  templateUrl: './chart-zoom.component.html',
  styleUrls: ['./chart-zoom.component.scss'],
})
export class ChartZoomComponent implements OnInit {
  penaliz: any ={};
  multi: any ={};
  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    const ya = [
      {
        graphName: 'Penalization Instances',
        data: [
          {
            month: 'January',
            values: [
              { name: 'Afternoon 1 [12pm-9PM]', count: 624 },
              { name: 'Afternoon 2 [12:30pm-9:30pm]', count: 3755 },
              { name: 'AIrport 8 [5;30am-2:30pm]', count: 11 },
              { name: 'Airport shift 1 [7am-4pm]', count: 28 },
              { name: 'Airport shift 2 [2pm-11pm]', count: 5 },
              { name: 'Airport shift 3 [10:30pm-7:30am]', count: 1 },
              { name: 'Airport shift 4 [8am-5pm]', count: 4 },
              { name: 'Closing Shift 1 [1:00pm-10:00pm]', count: 1933 },
              { name: 'Closing shift 2 [1:30pm-10:30pm]', count: 479 },
              { name: 'Closing Shift 3 [2pm-11pm', count: 47 },
              { name: 'DC 1st shift- Flexi [10am-6:30pm]', count: 1 },
              { name: 'Half day 1 and Weekly off [9am-1:30pm]', count: 171 },
              { name: 'Half day 11 and Weekly off [11am-3:30pm]', count: 60 },
              { name: 'Half day 13 and Weekly off [12pm-4:30pm]', count: 8 },
              { name: 'Half day 15 and Weekly off [12:30pm-5pm]', count: 4 },
              { name: 'Half day 3 and Weekly off [9:30am-2pm]', count: 55 },
              { name: 'Half day 5 and Weekly off [9:45am-2:15pm]', count: 8 },
              { name: 'Half day 7 and Weekly off [10am-2:30pm]', count: 134 },
              { name: 'Half day 9 and Weekly off [10:30am-3pm]', count: 324 },
              { name: 'Morning 1 9:30-6:30pm', count: 286 },
              { name: 'Morning 2 [9:45-6:45pm]', count: 1 },
              { name: 'Morning 3 [10-7pm]', count: 10336 },
              { name: 'Morning 4 [10:15-7:15pm]', count: 3 },
              { name: 'Morning 5 [10:30am-7:30pm]', count: 1718 },
              { name: 'Morning 6 [11-8pm]', count: 1028 },
              { name: 'Morning 7 [11:15-8:15pm]', count: 172 },
              { name: 'Morning 8 [6:30am-3:30pm]', count: 15 },
              { name: 'Morning 9 [11:30am-8:30pm}', count: 55 },
              { name: 'Opening Manager shift 9-6PM', count: 886 },
              { name: 'Weekly off and Half day 10 [3pm-7:30pm]', count: 91 },
              { name: 'Weekly off and Half day 12 [3:30pm-8pm]', count: 29 },
              { name: 'Weekly off and Half day 14 [4:30pm-9pm]', count: 47 },
              { name: 'Weekly off and Half day 16 [5pm-9:30pm]', count: 615 },
              { name: 'Weekly off and Half day 18 [5:30pm-10pm]', count: 319 },
              { name: 'Weekly off and Half day 2 [1:30pm-6pm]', count: 7 },
              { name: 'Weekly off and Half day 20 [6pm-10:30pm]', count: 58 },
              { name: 'Weekly off and Half day 4 [2pm-6:30pm]', count: 4 },
              { name: 'Weekly off and Half day 6 [2:45pm-7:15pm]', count: 5 },
              { name: 'Weekly off and Half day 8 [2:30pm-7pm]', count: 1 },
            ],
          },
          {
            month: 'February',
            values: [
              { name: 'Afternoon 1 [12pm-9PM]', count: 822 },
              { name: 'Afternoon 2 [12:30pm-9:30pm]', count: 3690 },
              { name: 'AIrport 8 [5;30am-2:30pm]', count: 4 },
              { name: 'Airport shift 1 [7am-4pm]', count: 16 },
              { name: 'Airport shift 3 [10:30pm-7:30am]', count: 1 },
              { name: 'Closing Shift 1 [1:00pm-10:00pm]', count: 2171 },
              { name: 'Closing shift 2 [1:30pm-10:30pm]', count: 585 },
              { name: 'Closing Shift 3 [2pm-11pm', count: 59 },
              { name: 'DC 1st shift- Flexi [10am-6:30pm]', count: 3 },
              { name: 'Half day 1 and Weekly off [9am-1:30pm]', count: 93 },
              { name: 'Half day 11 and Weekly off [11am-3:30pm]', count: 42 },
              { name: 'Half day 13 and Weekly off [12pm-4:30pm]', count: 11 },
              { name: 'Half day 15 and Weekly off [12:30pm-5pm]', count: 4 },
              { name: 'Half day 3 and Weekly off [9:30am-2pm]', count: 29 },
              { name: 'Half day 5 and Weekly off [9:45am-2:15pm]', count: 8 },
              { name: 'Half day 7 and Weekly off [10am-2:30pm]', count: 207 },
              { name: 'Half day 9 and Weekly off [10:30am-3pm]', count: 250 },
              { name: 'Morning 1 9:30-6:30pm', count: 317 },
              { name: 'Morning 3 [10-7pm]', count: 10695 },
              { name: 'Morning 4 [10:15-7:15pm]', count: 3 },
              { name: 'Morning 5 [10:30am-7:30pm]', count: 2155 },
              { name: 'Morning 6 [11-8pm]', count: 1017 },
              { name: 'Morning 7 [11:15-8:15pm]', count: 132 },
              { name: 'Morning 8 [6:30am-3:30pm]', count: 10 },
              { name: 'Morning 9 [11:30am-8:30pm}', count: 48 },
              { name: 'Opening Manager shift 9-6PM', count: 857 },
              { name: 'Weekly off and Half day 10 [3pm-7:30pm]', count: 55 },
              { name: 'Weekly off and Half day 12 [3:30pm-8pm]', count: 24 },
              { name: 'Weekly off and Half day 14 [4:30pm-9pm]', count: 82 },
              { name: 'Weekly off and Half day 16 [5pm-9:30pm]', count: 513 },
              { name: 'Weekly off and Half day 17 [1pm-5:30pm]', count: 9 },
              { name: 'Weekly off and Half day 18 [5:30pm-10pm]', count: 235 },
              { name: 'Weekly off and Half day 2 [1:30pm-6pm]', count: 3 },
              { name: 'Weekly off and Half day 20 [6pm-10:30pm]', count: 39 },
              { name: 'Weekly off and Half day 8 [2:30pm-7pm]', count: 4 },
            ],
          },
        ],
      },
    ];
    const getPenalizationInstancesData = ya[0].data;
    this.penaliz.graph = {
      data: getPenalizationInstancesData,
      color: ['#07575b', '#66a5ad'],
      keys: ['name', 'count'],
    };


    this.multi.graph = {
      data: [
        {
          timescale: '早',
          totalAmount: 20,
          totalProfit: 200,
          totalRevenue: 400,
        },
    
        {
          timescale: '午',
          totalAmount: 40,
          totalProfit: 300,
          totalRevenue: 600,
        },
    
        {
          timescale: '晚',
          totalAmount: 70,
          totalProfit: 100,
          totalRevenue: 800,
        },
    
        {
          timescale: '深夜',
          totalAmount: 100,
          totalProfit: 800,
          totalRevenue: 900,
        },
      ],
      color: ['#07575b', '#66a5ad'],
      keys: ['weekName', 'totalHours'],
    };

  }

  

  ngOnInit(): void {
    console.log(this.data);
   
  }
  ngAfterViewInit() {
   
    console.log(this.data);
   
  }


     
}
