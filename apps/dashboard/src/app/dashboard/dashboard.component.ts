import {
  CdkDrag,
  CdkDragMove,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardgraphsService } from '../services/dashboardgraphs.service';
import { ReportService } from '../services/othours/report.service';
import { ChartZoomComponent } from './controls/chart-zoom/chart-zoom.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { svg } from 'd3';

declare var require: any;
var canvg = require('canvg-browser');

// import { PDFDocument } from 'pdf-lib';

declare let $: any;

@Component({
  selector: 'dashboard-ui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  @ViewChild('exportgrp', { read: ElementRef }) exportgrp: ElementRef<any>;
  @ViewChild('svgeleref', { read: ElementRef }) svgeleref: ElementRef<any>;
  @ViewChild('chartsPDF') chartsPDF: ElementRef;
  // public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // items: Array<any> = [
  //   { id: 1, name: 'Daily Attendance', url: 'Daily-Attendance' },
  //   { id: 2, name: 'Weekend/Holiday Working', url: 'Weekend-Holiday-Working' },
  //   {
  //     id: 3,
  //     name: 'Late Login/Early logout & Penalization',
  //     url: 'Late-LoginEarly-logout-Penalization',
  //   },
  //   { id: 4, name: 'Early Log out Metrics' },
  //   { id: 5, name: 'Summary of Work-Hours' },
  //   { id: 6, name: 'Late Login Metrics' },
  //   { id: 7, name: 'Weekly Overtime' },
  //   { id: 8, name: 'OverTime Details' },
  //   { id: 9, name: 'Average Overtime Hours by Age-Group' },
  //   { id: 10, name: 'Total Deviation Minutes' },
  //   { id: 11, name: 'Penalisation Instances' },
  // ];
  items: Array<any> = [];
  public rowone: Array<number> = [1, 2, 3, 4];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  x;
  y;
  ispdfloader: boolean = false;
  showexportbtn: boolean = false;
  expdailyattenstatspin = true;
  exptargetspin = true;
  explateloginspin = true;
  expearlylogoutspin = true;
  expdailyatenspin = true;
  expempworkspin = true;
  explateearlyspin = true;
  expearlymetspin = true;
  expsummspin = true;
  explatelogmetspin = true;
  expweeklyoverspin = true;
  expovertimespin = true;
  expavgtimespin = true;
  exptotaldevspinspin = true;
  exppenalinsspin = true;
  openChart = false;
  settings = false;
  viewBy = false;
  options;
  spinner = true;
  getDailyAttendancespinnerexp = true;
  averagespinner = true;
  overtimespinner = true;
  weeklyovertimespinner = true;
  deviationspinner = true;
  latematricsspinner = true;
  summaryspinner = true;
  earlymatricsspinner = true;
  weekendspinner = true;
  lateearlyspinner = true;
  latepiespinner = true;
  earlypiespinner = true;
  penalspinner = true;
  linebarloader = true;
  @ViewChild('containercdk')
  myIdentifier: ElementRef;
  totalDeviationMins;
  penalisationdata;
  getAvgHoursPerEmpData: any;
  getTotalHoursWorkedData: any;
  getTargetVsActualWorkDaysDataarr: any;
  firstrowid;
  secondrownum;
  graphitemname;
  pieChart: any;
  lateloginChart: any;
  latelogin;
  earlylogoutChart: any;
  showbar = true;
  showpie;
  itemnumber;
  getLateLoginHoursData: any;
  getEarlyLogoutHoursData: any;
  getTargetVsActualWorkDays: any;
  getEmpWorkedOnWeekend: any = {};
  getPenalizationMetrics: any = {};
  getSummaryOfWorkHours: any = {};
  getEarlyLogoutMetricsData: any = {};
  getLateLogintMetricsData: any = {};
  getDailyAttendance: any = {};
  getOvertimeDetails: any = {};
  getAvgOTHoursByAge: any = {};
  getPenalizationInstances: any = {};
  empid: any;
  getWeeklyOvertime: { data: any; color: string[] };
  filterItems: any;
  filterParams: string;
  graphParams: {
    graphname: string;
    EmpUID: any;
    isViewReport: string;
    filters: any[];
    graphUserId: any;
  };
  mockEnabled = false;
  itemsFirstRow: any = [];
  penaliz: any = {};
  weeklyOvertime: any = {};
  multi: any = {};
  slideShowData: any;
  svgdata;
  slideshowid;
  slideShowArr;
  enableexportbtn: boolean = true;
  constructor(
    private router: Router,
    private dash: DashboardgraphsService,
    private rep: ReportService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.target = null;
    this.source = null;
    this.dash.updateEmpid('9F7844FC-1422-4663-BF46-F882CD13A38C');
    this.dash.getEmpid().subscribe((data) => {
      this.empid = data;
    });
    // this.route.queryParams.subscribe((params) => {
    //   this.dash.updateEmpid( params['empuid']);
    //   this.dash.updateEmpid("00000000-0000-0000-0000-000000000000");
    //   this.dash.getEmpid().subscribe((data)=>{
    //     this.empid = data;
    //   });
    //   console.log(this.empid);
    // });
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
    const da = [
      {
        graphName: 'Weekly Overtime',
        data: [
          {
            month: 'September',
            values: [
              { weekName: 'Week1', totalHours: 0.4 },
              { weekName: 'Week2', totalHours: 3.5 },
              { weekName: 'Week3', totalHours: 0.8 },
              { weekName: 'Week4', totalHours: 0.7 },
            ],
          },
        ],
      },
    ];
    const weeklyovertimeData = da[0].data;
    this.weeklyOvertime.graph = {
      data: weeklyovertimeData,
      color: ['#07575b', '#66a5ad'],
      keys: ['weekName', 'totalHours'],
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
  openDialog(data?: any) {
    console.log(data);
    const dialogRef = this.dialog.open(ChartZoomComponent, {
      data: data,
      width: '90vw',
      // height: '800px',
    });
    //console.log('i am view', dialogRef);
    dialogRef.afterClosed().subscribe((result) => {
      //  console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    const graph = {
      graphname: 'Overtime Details',
      EmpUID: this.empid,
      isViewReport: 'false',
      filters: [],
      graphUserId: 0,
    };

    this.dash.getDashboardConfigData(this.empid).subscribe((data: any) => {
      const filterItems = data[0].data;
      this.slideShowData = data[0].data;
      this.dash.getAvgHoursPerEmp().subscribe((data) => {
        this.getAvgHoursPerEmpData = data.data.avgHours;
      });
      this.dash.getTotalHoursWorked().subscribe((data) => {
        this.getTotalHoursWorkedData = data.data.totalHours;
      });
      this.dash.getLateLoginHours().subscribe((data) => {
        this.getLateLoginHoursData = data.data.totalHours;
      });
      this.dash.getEarlyLogoutHours().subscribe((data) => {
        this.getEarlyLogoutHoursData = data.data.totalHours;
      });
      this.items = filterItems
        .map((d) => {
          if (d.parentGraphID >= 5 && !d.isHidden) {
            const x = 'd' + d.sortOrder;
            d[x] = {};
            this.graphParams;
            // eslint-disable-next-line prefer-const
            this.graphParams = graph;
            this.setGraphs(d, x);
            return d;
          }
        })
        .filter((y) => {
          return y !== undefined;
        });

      this.itemsFirstRow = filterItems
        .map((d) => {
          if (d.parentGraphID < 5 && !d.isHidden) {
            const x = 'd' + d.sortOrder;
            d[x] = {};
            this.graphParams;
            // eslint-disable-next-line prefer-const
            this.graphParams = graph;
            this.setGraphs(d, x);
            return d;
          }
        })
        .filter((y) => {
          return y !== undefined;
        });
    });

    // setTimeout(() =>this.showexportbtn = true,5000)

    // this.curDate =  moment(new Date()).format("DD-MMM-YYYY HH:mm:ss");

    // let graphParams;
    // graphParams = graph;
    // graphParams.graphname = 'Total Deviation Minutes';
    // this.dash.getTotalDeviationMinutes(graphParams).subscribe((data) => {
    //   const getTotalDeviationMinutesData: any = data[0];
    //   this.deviationspinner = false;
    //   this.totalDeviationMins = {
    //     data: getTotalDeviationMinutesData.data,

    //     keys: ['minutes'],
    //     color: { minutes: '#264e86' },
    //     x: 'date',
    //     y: 'minutes',
    //   };
    // });
    // graphParams.graphname = 'Overtime Details';
    // this.dash.getOvertimeDetails(graph).subscribe((data) => {
    //   const getOvertimeDetailsData = data[0].data;
    //   console.log(getOvertimeDetailsData);
    //   this.overtimespinner = false;
    //   this.getOvertimeDetails = {
    //     data: getOvertimeDetailsData,
    //     color: ['#66a5ad'],
    //     x: 'name',
    //     y: 'totalHours',
    //     type: 'pie',
    //     keys: ['name', 'totalHours'],
    //   };
    // });
    // graphParams.graphname = 'Average Overtime Hours by Age Group';
    // this.dash.getAvgOTHoursByAge(graphParams).subscribe((data) => {
    //   const getAvgOTHoursByAgeData = data[0].data;
    //   this.averagespinner = false;
    //   this.getAvgOTHoursByAge = {
    //     data: getAvgOTHoursByAgeData,
    //     color: ['#66a5ad'],
    //     x: 'age',
    //     y: 'totalHours',
    //   };
    // });
    // graphParams.graphname = 'Weekly Overtime';

    // this.dash.getweeklyOvertime(graphParams).subscribe((data) => {
    //   const getWeeklyOvertimeData = data[0].data;
    //   this.weeklyovertimespinner = false;
    //   this.getWeeklyOvertime = {
    //     data: getWeeklyOvertimeData,

    //     color: ['#07575b', '#66a5ad'],
    //   };
    // });

    // graphParams = graph;
    // graphParams.graphname = 'Late Login';
    // this.dash.getLateLogin(graphParams).subscribe((data) => {
    //   const getLateLoginData: any = data[0].data;
    //   this.latepiespinner = false;

    //   this.lateloginChart = {
    //     data: getLateLoginData,

    //     colors: ['#7aac5a', '#cc3333'],
    //     type: 'latelogindonut',
    //     middletext: 'No',
    //     keys: ['value', 'value', 'llname'],
    //   };
    //   for (let i = 0; i < getLateLoginData.length; i++) {
    //     getLateLoginData[i].llname = getLateLoginData[i]['name'];
    //     delete getLateLoginData[i].name;
    //   }
    //   console.log(this.lateloginChart.data);
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Early Logout';
    // this.dash.getearlyLogout(graphParams).subscribe((data) => {
    //   const getearlyLogoutData: any = data[0].data;
    //   for (let i = 0; i < getearlyLogoutData.length; i++) {
    //     getearlyLogoutData[i].elname = getearlyLogoutData[i]['name'];
    //     delete getearlyLogoutData[i].name;
    //   }
    //   this.earlypiespinner = false;
    //   this.earlylogoutChart = {
    //     data: getearlyLogoutData,
    //     colors: ['#7aac5a', '#cc3333'],
    //     type: 'earlylogoutdonut',
    //     keys: ['value', 'value', 'elname'],
    //   };

    //   console.log(this.earlylogoutChart.data);
    // });

    // graphParams = graph;
    // graphParams.graphname = 'Employee Worked on Weekend/Holidays';
    // this.dash.getEmpWorkedOnWeekend(graphParams).subscribe((data) => {
    //   const getEmpWorkedOnWeekendData = data[0].data;
    //   this.weekendspinner = false;
    //   this.getEmpWorkedOnWeekend = {
    //     data: getEmpWorkedOnWeekendData,
    //     keys: ['totalEmp'],
    //     x: 'date',
    //     y: 'totalEmp',
    //     colors: { totalEmp: '#66a5ad' },
    //   };
    // });

    // graphParams = graph;
    // graphParams.graphname = 'Daily Attendance';
    // this.dash.getDailyAttendance(graphParams).subscribe((data) => {
    //   const getDailyAttendanceData = data[0].data;
    //   const absentkey = getDailyAttendanceData.map((x) => Object.keys(x)[1]);
    //   const presentkey = getDailyAttendanceData.map((x) => Object.keys(x)[2]);

    //   this.getDailyAttendancespinner = false;
    //   this.getDailyAttendance = {
    //     data: getDailyAttendanceData,
    //     color: ['#264e86', '#5e88fc'],
    //     keys: [absentkey[0], presentkey[0]],
    //   };

    //   console.log(this.getDailyAttendance.keys);
    // });

    // graphParams = graph;
    // graphParams.graphname = 'Summary Of Work Hours';
    // this.dash.getSummaryOfWorkHours(graphParams).subscribe((data) => {
    //   const getSummaryOfWorkHoursData = data[0].data;
    //   this.summaryspinner = false;
    //   this.getSummaryOfWorkHours = {
    //     data: getSummaryOfWorkHoursData,
    //     keys: ['totalHours'],
    //     x: 'date',
    //     y: 'totalHours',
    //     color: { totalHours: '#264e86' },
    //   };
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Late Login, Early logout & Penalization Metrics';

    // this.dash.getPenalizationMetrics(graphParams).subscribe((data) => {
    //   const getPenalizationMetricsData = data[0].data;
    //   this.lateearlyspinner = false;
    //   this.getPenalizationMetrics = {
    //     data: getPenalizationMetricsData,
    //     keys: ['name'],
    //     color: ['#264e86', '#5e88fc', '#74dbef'],
    //     y: 'name',
    //     x: 'count',
    //   };
    //   console.log(this.getPenalizationMetrics.data.series);
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Early logout Metrics';
    // this.dash.getEarlyLogoutMetrics(graphParams).subscribe((data) => {
    //   const getEarlyLogoutMetricsData = data[0].data;
    //   this.earlymatricsspinner = false;
    //   this.getEarlyLogoutMetricsData = {
    //     data: getEarlyLogoutMetricsData,
    //     color: ['#264e86', '#5e88fc', '#74dbef'],
    //     y: 'name',
    //     x: 'count',
    //   };
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Late Login Metrics';
    // this.dash.getLateLogintMetrics(graphParams).subscribe((data) => {
    //   const getLateLogintMetricsData = data[0].data;
    //   this.latematricsspinner = false;
    //   this.getLateLogintMetricsData = {
    //     data: getLateLogintMetricsData,
    //     color: ['#264e86', '#5e88fc', '#74dbef'],
    //     y: 'name',
    //     x: 'count',
    //   };
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Penalization Instances';

    // this.dash.getPenalizationInstances(graphParams).subscribe((data) => {
    //   const getPenalizationInstancesData = data[0].data;
    //   this.penalspinner = false;

    //   this.getPenalizationInstances = {
    //     data: getPenalizationInstancesData,

    //     color: ['#07575b', '#66a5ad'],
    //   };
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Target V/s Actual Work Hours';
    // this.dash.getTargetVsActualWorkDays(graphParams).subscribe((data) => {
    //   this.getTargetVsActualWorkDaysData = data[0].data;
    //   const targetkey = this.getTargetVsActualWorkDaysData.map(
    //     (x) => Object.keys(x)[1]
    //   );
    //   console.log(targetkey[0]);
    //   const actualkey = this.getTargetVsActualWorkDaysData.map(
    //     (x) => Object.keys(x)[2]
    //   );
    //   console.log(actualkey[0]);
    //   this.getTargetVsActualWorkDays = {
    //     data: this.getTargetVsActualWorkDaysData,
    //     keys: [targetkey[0], actualkey[0]],
    //     color: ['#4d85bd', '#264e86'],
    //   };
    //   this.linebarloader = false;
    // });
    // graphParams = graph;
    // graphParams.graphname = 'Daily Attendance Status';
    // this.dash.getDailyAttendanceStatus(graphParams).subscribe((data) => {
    //   const pieChartData: any = data[0];
    //   this.spinner = false;
    //   this.pieChart = {
    //     data: pieChartData.data,
    //     colors: ['#264e86', '#4d85bd', '#7aac5a', '#cc3333'],
    //     type: 'pie',
    //     legendpie: ['Present', 'Unknown', 'Absent', 'On Leave'],
    //     keys: ['percentage', 'totalCount', 'status'],
    //   };
    // });
    // this.setDynamicGraphs();
  }
  setDynamicGraphs() {
    // const request1 = this.http.get('https://restcountries.eu/rest/v1/name/india');
    // const request2 = this.http.get('https://restcountries.eu/rest/v1/name/us');
    // const request3 = this.http.get('https://restcountries.eu/rest/v1/name/ame');
    // const request4 = this.http.get('https://restcountries.eu/rest/v1/name/ja');
    // const requestArray = [];
    // requestArray.push(request1);
    // requestArray.push(request2);
    // requestArray.push(request3);
    // requestArray.push(request4);
    // forkJoin(requestArray).subscribe(results => {
    //   console.log(results);
    //   this.response = results;
    // });
    // this.dash.getgraphId().subscribe((data) => {
    //   if (data) {
    //     this.filterParams = `dashboardModuleID=1&dashboardGraphID=${data}&UserID=101&EmpUID=${this.empid}`;
    //   }
    // });
    // this.filterParams &&
    //   this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
    //   });
  }
  openViewBy(openChart: any, item: any) {
    //console.log(openChart, item);
    this.itemnumber = item;
    if (openChart) {
      this.viewBy = false;
    } else {
      this.viewBy = true;
      this.options = ['Bar Chart', 'Pie Chart'];
    }
  }

  ngAfterViewInit(): void {
    const phElement = this.placeholder.element.nativeElement;
    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  /** Load Graph Data**/
  loadData(item?: any) {
    const graph = {
      graphname: '',
      EmpUID: this.empid,
      isViewReport: 'false',
      filters: [],
    };
    // console.log(item);
    if (item.parentGraphID === 5) {
      graph.graphname = item.graphName;
      this.dash.getDailyAttendance(graph).subscribe((data) => {
        const getDailyAttendanceData = data[0].data;
        const absentkey = getDailyAttendanceData.map((x) => Object.keys(x)[1]);
        const presentkey = getDailyAttendanceData.map((x) => Object.keys(x)[2]);

        // return {
        //   data: getDailyAttendanceData,
        //   color: ['#264e86', '#5cc8fc'],
        //   keys: [absentkey[0], presentkey[0]],
        // };
        return {
          data: [
            { name: 'Afternoon 1 [12pm-9PM]', absent: 5, present: 4459 },
            {
              name: 'Afternoon 2 [12:30pm-9:30pm]',
              absent: 71,
              present: 29657,
            },
            { name: 'Airport 7 [5am-2pm]', absent: 0, present: 29 },
          ],
          color: ['#264e86', '#5e88fc'],
          keys: ['absent', 'present'],
        };
      });
    }
  }

  // ******  Settting Graphs *********
  async setGraphs(d: any, x: any, isViewReport?: any) {
    if (d.parentGraphID == 1) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      if (this.mockEnabled) {
        d[x].graph = {
          data: [
            {
              status: 'On Leave',
              totalCount: 263,
              percentage: 3.85,
              color: '#4d85bd',
            },
            {
              status: 'Status Unknown',
              totalCount: 657,
              percentage: 9.62,
              color: '#264e86',
            },
            {
              status: 'Absent',
              totalCount: 35,
              percentage: 0.51,
              color: '#cc3333',
            },
            {
              status: 'Present',
              totalCount: 5875,
              percentage: 86.02,
              color: '#7aac5a',
            },
          ],
          colors: ['#264e86', '#4d85bd', '#7aac5a', '#cc3333'],
          type: 'pie',
          legendpie: ['Present', 'Unknown', 'Absent', 'On Leave'],
          keys: ['percentage', 'totalCount', 'status'],
        };
      } else {
        this.dash.getDailyAttendanceStatus(_gp).subscribe((data) => {
          d[x].spinner = true;
          const pieChartData: any = data[0];
          // pieChartData.data = [{"status":"Absent","totalCount":35,"percentage":0.51},{"status":"On Leave","totalCount":263,"percentage":3.85},{"status":"Status Unknown","totalCount":657,"percentage":9.62},{"status":"Present","totalCount":5875,"percentage":86.02}];
          pieChartData.data.map((y) => {
            if (y.status == 'Present') {
              y.color = '#7aac5a';
            }
            if (y.status == 'Absent') {
              y.color = '#cc3333';
            }
            if (y.status == 'Status Unknown') {
              y.color = '#264e86';
            }
            if (y.status == 'On Leave') {
              y.color = '#4d85bd';
            }
            return y;
          });

          d[x].graph = {
            data: pieChartData.data,
            colors: ['#264e86', '#4d85bd', '#7aac5a', '#cc3333'],
            type: 'pie',
            legendpie: ['Present', 'Unknown', 'Absent', 'On Leave'],
            keys: ['percentage', 'totalCount', 'status'],
          };
          d[x].spinner = false;
          if (d[x].spinner === false) {
            this.expdailyattenstatspin = false;
          }
        });
      }
    }
    if (d.parentGraphID == 2) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].linebarloader = true;
      if (this.mockEnabled) {
        d[x].graph = {
          data: [
            {
              month: 'Jan',
              targetWorkingDays: 2271,
              actualWorkedDays: 2072,
            },
            {
              month: 'Feb',
              targetWorkingDays: 2080,
              actualWorkedDays: 1816,
            },
            {
              month: 'Mar',
              targetWorkingDays: 2348,
              actualWorkedDays: 2085,
            },
            {
              month: 'Apr',
              targetWorkingDays: 2346,
              actualWorkedDays: 2069,
            },
            {
              month: 'May',
              targetWorkingDays: 2981,
              actualWorkedDays: 2172,
            },
            {
              month: 'Jun',
              targetWorkingDays: 3083,
              actualWorkedDays: 2608,
            },
            {
              month: 'Jul',
              targetWorkingDays: 3276,
              actualWorkedDays: 2177,
            },
            {
              month: 'Aug',
              targetWorkingDays: 1748,
              actualWorkedDays: 0,
            },
            {
              month: 'Sep',
              targetWorkingDays: 3276,
              actualWorkedDays: 2177,
            },
            {
              month: 'Oct',
              targetWorkingDays: 0,
              actualWorkedDays: 0,
            },
            {
              month: 'Nov',
              targetWorkingDays: 150,
              actualWorkedDays: 10,
            },
            {
              month: 'Dec',
              targetWorkingDays: 10,
              actualWorkedDays: 10,
            },
          ],
          keys: ['targetWorkingDays', 'actualWorkedDays'],
          color: ['#4d85bd', '#264e86'],
        };
      } else {
        this.dash.getTargetVsActualWorkDays(_gp).subscribe((data) => {
          d[x].linebarloader = false;
          if (d[x].linebarloader === false) {
            this.exptargetspin = false;
          }
          const getTargetVsActualWorkDaysData = data[0].data;
          const targetkey = getTargetVsActualWorkDaysData.map(
            (x) => Object.keys(x)[2]
          );
          const actualkey = getTargetVsActualWorkDaysData.map(
            (x) => Object.keys(x)[3]
          );
          d[x].graph = {
            data: getTargetVsActualWorkDaysData,
            keys: [targetkey[0], actualkey[0]],
            color: ['#4d85bd', '#264e86'],
          };
        });
      }
    }
    if (d.parentGraphID == 3) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].latepiespinner = true;
      if (this.mockEnabled) {
        d[x].graph = {
          data: [
            {
              name: 'OnTime',
              value: 96.97,
            },
            {
              name: 'Late',
              value: 3.03,
            },
          ],
          colors: ['#7aac5a', '#cc3333'],
          type: 'latelogindonut',
          middletext: 'No',
          keys: ['value', 'value', 'llname'],
        };
      } else {
        d[x].latepiespinner = true;
        this.dash.getLateLogin(_gp).subscribe((data) => {
          const getLateLoginData: any = data[0].data;
          d[x].latepiespinner = false;
          if (d[x].latepiespinner === false) {
            this.explateloginspin = false;
          }

          d[x].graph = {
            data: getLateLoginData,

            colors: ['#7aac5a', '#cc3333'],
            type: 'latelogindonut',
            middletext: 'No',
            keys: ['value', 'value', 'llname'],
          };
          for (let i = 0; i < getLateLoginData.length; i++) {
            getLateLoginData[i].llname = getLateLoginData[i]['name'];
            delete getLateLoginData[i].name;
          }
        });
      }
    }
    if (d.parentGraphID == 4) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].earlypiespinner = true;
      if (this.mockEnabled) {
        d[x].graph = {
          data: [
            {
              value: 98.59,
              elname: 'OnTime',
            },
            {
              value: 1.41,
              elname: 'EarlyLogout',
            },
          ],
          colors: ['#7aac5a', '#cc3333'],
          type: 'earlylogoutdonut',
          keys: ['value', 'value', 'elname'],
        };
      } else {
        d[x].earlypiespinner = true;
        this.dash.getearlyLogout(_gp).subscribe((data) => {
          const getearlyLogoutData: any = data[0].data;
          for (let i = 0; i < getearlyLogoutData.length; i++) {
            getearlyLogoutData[i].elname = getearlyLogoutData[i]['name'];
            delete getearlyLogoutData[i].name;
          }

          d[x].graph = {
            data: getearlyLogoutData,
            colors: ['#7aac5a', '#cc3333'],
            type: 'earlylogoutdonut',
            keys: ['value', 'value', 'elname'],
          };
          d[x].earlypiespinner = false;
          if (d[x].earlypiespinner === false) {
            this.expearlylogoutspin = false;
          }
        });
      }
    }
    if (d.parentGraphID == 5) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      const filterParams = `dashboardModuleID=1&dashboardGraphID=${d.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      d[x].getDailyAttendancespinner = true;
      filterParams &&
        this.rep.getFilterDropdowns(filterParams).subscribe((data) => {
          if (data) {
            const filterData = data[0].filters;
            d[x].viewBy = filterData.filter((y) => {
              if (y.name == 'View By(for graph only)') {
                return y;
              }
            })[0];
            if (isViewReport) {
              _gp.filters = [d.optionSelected];
              _gp.isViewReport = 'true';
            }
            _gp.graphname = d.graphName;
            _gp.graphUserId = d.dashboardGraphUserId;
            this.dash.getDailyAttendance(_gp).subscribe((data) => {
              const getDailyAttendanceData = data[0].data;
              const absentkey = getDailyAttendanceData.map(
                (x) => Object.keys(x)[1]
              );
              const presentkey = getDailyAttendanceData.map(
                (x) => Object.keys(x)[2]
              );

              d[x].getDailyAttendancespinner = false;
              if (d[x].getDailyAttendancespinner === false) {
                this.expdailyatenspin = false;
              }
              d[x].graph = {
                data: getDailyAttendanceData,
                color: ['#264e86', '#5e88fc'],
                keys: [absentkey[0], presentkey[0]],
              };
            });
          }
        });
    }
    if (d.parentGraphID == 6) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].weekendspinner = true;
      this.dash.getEmpWorkedOnWeekend(_gp).subscribe((data) => {
        const getEmpWorkedOnWeekendData = data[0].data;
        d[x].weekendspinner = false;
        if (d[x].weekendspinner === false) {
          this.expempworkspin = false;
        }
        d[x].graph = {
          data: getEmpWorkedOnWeekendData,
          keys: ['totalEmp'],
          x: 'date',
          y: 'totalEmp',
          colors: { totalEmp: '#66a5ad' },
        };
      });
    }
    if (d.parentGraphID == 7) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      // d[x].lateearlyspinner = true;
      d[x].spinner = true;
      this.dash.getPenalizationMetrics(_gp).subscribe((data) => {
        console.log(data);
        const getPenalizationMetricsData = data[0].data;
        console.log(getPenalizationMetricsData);

        d[x].graph = {
          data: getPenalizationMetricsData,
          keys: ['name'],
          color: ['#264e86', '#5e88fc', '#74dbef'],
          y: 'name',
          x: 'count',
        };
        d[x].spinner = false;
        if (d[x].spinner === false) {
          this.explateearlyspin = false;
        }
        //  console.log(d[x].graph, 'penal Metrics');
      });
    }

    if (d.parentGraphID == 8) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.filterParams = `dashboardModuleID=1&dashboardGraphID=${d.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      this.filterParams &&
        this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
          if (data) {
            const filterData = data[0].filters;
            d[x].viewBy = filterData.filter((y) => {
              if (y.name == 'View By(for graph only)') {
                return y;
              }
            })[0];
            if (isViewReport) {
              _gp.filters = [d.optionSelected];
              _gp.isViewReport = 'true';
            }
            _gp.graphUserId = data[0].graphUserId;
            _gp.graphname = data[0].graphName;

            this.dash.getEarlyLogoutMetrics(_gp).subscribe((data) => {
              const getEarlyLogoutMetricsData = data[0].data;
              d[x].earlymatricsspinner = false;
              d[x].graph = {
                data: getEarlyLogoutMetricsData,
                color: ['#264e86', '#5e88fc', '#74dbef'],
                y: 'name',
                x: 'count',
              };
              d[x].spinner = false;
            });
          }
        });
    }

    if (d.parentGraphID == 9) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.dash.getSummaryOfWorkHours(_gp).subscribe((data) => {
        const getSummaryOfWorkHoursData = data[0].data;

        d[x].graph = {
          data: getSummaryOfWorkHoursData,
          keys: ['totalHours'],
          x: 'date',
          y: 'totalHours',
          color: { totalHours: '#264e86' },
        };
        d[x].spinner = false;
      });
    }

    if (d.parentGraphID == 10) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.filterParams = `dashboardModuleID=1&dashboardGraphID=${d.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      this.filterParams &&
        this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
          if (data) {
            const filterData = data[0].filters;
            d[x].viewBy = filterData.filter((y) => {
              if (y.name == 'View By(for graph only)') {
                return y;
              }
            })[0];
            if (isViewReport) {
              _gp.filters = [d.optionSelected];
              _gp.isViewReport = 'true';
            }
            _gp.graphUserId = data[0].graphUserId;
            _gp.graphname = data[0].graphName;
            this.dash.getLateLogintMetrics(_gp).subscribe((data) => {
              const getLateLogintMetricsData = data[0].data;
              d[x].latematricsspinner = false;
              d[x].graph = {
                data: getLateLogintMetricsData,
                color: ['#264e86', '#5e88fc', '#74dbef'],
                y: 'name',
                x: 'count',
              };
            });
          }
          d[x].spinner = false;
        });
    }

    if (d.parentGraphID == 11) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.dash.getweeklyOvertime(_gp).subscribe((data) => {
        const getWeeklyOvertimeData = data[0].data;
        d[x].spinner = false;
        d[x].graph = {
          data: getWeeklyOvertimeData,

          color: ['#07575b', '#66a5ad'],
          keys: ['weekName', 'totalHours'],
        };
        d[x].spinner = false;
      });
    }

    if (d.parentGraphID == 12) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.filterParams = `dashboardModuleID=1&dashboardGraphID=${d.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      this.filterParams &&
        this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
          if (data) {
            const filterData = data[0].filters;
            d[x].viewBy = filterData.filter((y) => {
              if (y.name == 'View By(for graph only)') {
                return y;
              }
            })[0];
            if (isViewReport) {
              _gp.filters = [d.optionSelected];
              _gp.isViewReport = 'true';
            }
            _gp.graphUserId = data[0].graphUserId;
            _gp.graphname = data[0].graphName;
            this.dash.getOvertimeDetails(_gp).subscribe((data) => {
              const getOvertimeDetailsData = data[0].data;
              d[x].graph = {
                data: getOvertimeDetailsData,
                color: ['#66a5ad'],
                x: 'name',
                y: 'totalHours',
                type: 'pie',
                keys: ['name', 'totalHours'],
              };
            });
          }
          d[x].spinner = false;
        });
    }

    if (d.parentGraphID == 13) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.dash.getAvgOTHoursByAge(_gp).subscribe((data) => {
        const getAvgOTHoursByAgeData = data[0].data;
        d[x].spinner = false;
        d[x].graph = {
          data: getAvgOTHoursByAgeData,
          color: ['#66a5ad'],
          x: 'age',
          y: 'averageHours',
        };
      });
    }

    if (d.parentGraphID == 14) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.dash.getTotalDeviationMinutes(_gp).subscribe((data) => {
        const getTotalDeviationMinutesData: any = data[0];
        d[x].spinner = false;
        d[x].graph = {
          data: getTotalDeviationMinutesData.data,
          keys: ['minutes'],
          color: { minutes: '#264e86' },
          x: 'date',
          y: 'minutes',
        };
        d[x].spinner = false;
      });
    }

    if (d.parentGraphID == 15) {
      const _gp = this.graphParams;
      _gp.graphname = d.graphName;
      _gp.graphUserId = d.dashboardGraphUserId;
      d[x].spinner = true;
      this.filterParams = `dashboardModuleID=1&dashboardGraphID=${d.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      this.filterParams &&
        this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
          if (data) {
            //   console.log(this.filterParams, 'filter params');
            const filterData = data[0].filters;
            d[x].viewBy = filterData.filter((y) => {
              if (y.name == 'View By(for graph only)') {
                return y;
              }
            })[0];
            if (isViewReport) {
              _gp.filters = [d.optionSelected];
              _gp.isViewReport = 'true';
            }
            _gp.graphUserId = data[0].graphUserId;
            _gp.graphname = data[0].graphName;
            this.dash.getPenalizationInstances(_gp).subscribe((data) => {
              const getPenalizationInstancesData = data[0].data;
              d[x].spinner = false;
              d[x].graph = {
                data: getPenalizationInstancesData,
                color: ['#07575b', '#66a5ad'],
              };
              // console.log(d[x].graph, 'penal instance');
            });
          }
        });
      // const ya = [
      //   {
      //     graphName: 'Penalization Instances',
      //     data: [
      //       {
      //         month: 'January',
      //         values: [
      //           { name: 'Afternoon 1 [12pm-9PM]', count: 624 },
      //           { name: 'Afternoon 2 [12:30pm-9:30pm]', count: 3755 },
      //           { name: 'AIrport 8 [5;30am-2:30pm]', count: 11 },
      //           { name: 'Airport shift 1 [7am-4pm]', count: 28 },
      //           { name: 'Airport shift 2 [2pm-11pm]', count: 5 },
      //           { name: 'Airport shift 3 [10:30pm-7:30am]', count: 1 },
      //           { name: 'Airport shift 4 [8am-5pm]', count: 4 },
      //           { name: 'Closing Shift 1 [1:00pm-10:00pm]', count: 1933 },
      //           { name: 'Closing shift 2 [1:30pm-10:30pm]', count: 479 },
      //           { name: 'Closing Shift 3 [2pm-11pm', count: 47 },
      //           { name: 'DC 1st shift- Flexi [10am-6:30pm]', count: 1 },
      //           { name: 'Half day 1 and Weekly off [9am-1:30pm]', count: 171 },
      //           { name: 'Half day 11 and Weekly off [11am-3:30pm]', count: 60 },
      //           { name: 'Half day 13 and Weekly off [12pm-4:30pm]', count: 8 },
      //           { name: 'Half day 15 and Weekly off [12:30pm-5pm]', count: 4 },
      //           { name: 'Half day 3 and Weekly off [9:30am-2pm]', count: 55 },
      //           { name: 'Half day 5 and Weekly off [9:45am-2:15pm]', count: 8 },
      //           { name: 'Half day 7 and Weekly off [10am-2:30pm]', count: 134 },
      //           { name: 'Half day 9 and Weekly off [10:30am-3pm]', count: 324 },
      //           { name: 'Morning 1 9:30-6:30pm', count: 286 },
      //           { name: 'Morning 2 [9:45-6:45pm]', count: 1 },
      //           { name: 'Morning 3 [10-7pm]', count: 10336 },
      //           { name: 'Morning 4 [10:15-7:15pm]', count: 3 },
      //           { name: 'Morning 5 [10:30am-7:30pm]', count: 1718 },
      //           { name: 'Morning 6 [11-8pm]', count: 1028 },
      //           { name: 'Morning 7 [11:15-8:15pm]', count: 172 },
      //           { name: 'Morning 8 [6:30am-3:30pm]', count: 15 },
      //           { name: 'Morning 9 [11:30am-8:30pm}', count: 55 },
      //           { name: 'Opening Manager shift 9-6PM', count: 886 },
      //           { name: 'Weekly off and Half day 10 [3pm-7:30pm]', count: 91 },
      //           { name: 'Weekly off and Half day 12 [3:30pm-8pm]', count: 29 },
      //           { name: 'Weekly off and Half day 14 [4:30pm-9pm]', count: 47 },
      //           { name: 'Weekly off and Half day 16 [5pm-9:30pm]', count: 615 },
      //           {
      //             name: 'Weekly off and Half day 18 [5:30pm-10pm]',
      //             count: 319,
      //           },
      //           { name: 'Weekly off and Half day 2 [1:30pm-6pm]', count: 7 },
      //           { name: 'Weekly off and Half day 20 [6pm-10:30pm]', count: 58 },
      //           { name: 'Weekly off and Half day 4 [2pm-6:30pm]', count: 4 },
      //           { name: 'Weekly off and Half day 6 [2:45pm-7:15pm]', count: 5 },
      //           { name: 'Weekly off and Half day 8 [2:30pm-7pm]', count: 1 },
      //         ],
      //       },
      //       {
      //         month: 'February',
      //         values: [
      //           { name: 'Afternoon 1 [12pm-9PM]', count: 822 },
      //           { name: 'Afternoon 2 [12:30pm-9:30pm]', count: 3690 },
      //           { name: 'AIrport 8 [5;30am-2:30pm]', count: 4 },
      //           { name: 'Airport shift 1 [7am-4pm]', count: 16 },
      //           { name: 'Airport shift 3 [10:30pm-7:30am]', count: 1 },
      //           { name: 'Closing Shift 1 [1:00pm-10:00pm]', count: 2171 },
      //           { name: 'Closing shift 2 [1:30pm-10:30pm]', count: 585 },
      //           { name: 'Closing Shift 3 [2pm-11pm', count: 59 },
      //           { name: 'DC 1st shift- Flexi [10am-6:30pm]', count: 3 },
      //           { name: 'Half day 1 and Weekly off [9am-1:30pm]', count: 93 },
      //           { name: 'Half day 11 and Weekly off [11am-3:30pm]', count: 42 },
      //           { name: 'Half day 13 and Weekly off [12pm-4:30pm]', count: 11 },
      //           { name: 'Half day 15 and Weekly off [12:30pm-5pm]', count: 4 },
      //           { name: 'Half day 3 and Weekly off [9:30am-2pm]', count: 29 },
      //           { name: 'Half day 5 and Weekly off [9:45am-2:15pm]', count: 8 },
      //           { name: 'Half day 7 and Weekly off [10am-2:30pm]', count: 207 },
      //           { name: 'Half day 9 and Weekly off [10:30am-3pm]', count: 250 },
      //           { name: 'Morning 1 9:30-6:30pm', count: 317 },
      //           { name: 'Morning 3 [10-7pm]', count: 10695 },
      //           { name: 'Morning 4 [10:15-7:15pm]', count: 3 },
      //           { name: 'Morning 5 [10:30am-7:30pm]', count: 2155 },
      //           { name: 'Morning 6 [11-8pm]', count: 1017 },
      //           { name: 'Morning 7 [11:15-8:15pm]', count: 132 },
      //           { name: 'Morning 8 [6:30am-3:30pm]', count: 10 },
      //           { name: 'Morning 9 [11:30am-8:30pm}', count: 48 },
      //           { name: 'Opening Manager shift 9-6PM', count: 857 },
      //           { name: 'Weekly off and Half day 10 [3pm-7:30pm]', count: 55 },
      //           { name: 'Weekly off and Half day 12 [3:30pm-8pm]', count: 24 },
      //           { name: 'Weekly off and Half day 14 [4:30pm-9pm]', count: 82 },
      //           { name: 'Weekly off and Half day 16 [5pm-9:30pm]', count: 513 },
      //           { name: 'Weekly off and Half day 17 [1pm-5:30pm]', count: 9 },
      //           {
      //             name: 'Weekly off and Half day 18 [5:30pm-10pm]',
      //             count: 235,
      //           },
      //           { name: 'Weekly off and Half day 2 [1:30pm-6pm]', count: 3 },
      //           { name: 'Weekly off and Half day 20 [6pm-10:30pm]', count: 39 },
      //           { name: 'Weekly off and Half day 8 [2:30pm-7pm]', count: 4 },
      //         ],
      //       },
      //     ],
      //   },
      // ];
      // const getPenalizationInstancesData = ya[0].data;
      // d[x].penalspinner = false;
      // d[x].graph = {
      //   data: getPenalizationInstancesData,
      //   color: ['#07575b', '#66a5ad'],
      // };
    }

    await this.chkAllGraphsLoad();
  }

  chkAllGraphsLoad() {
    setTimeout(() => {
      this.showexportbtn = true;
    }, 11500);
  }
  setFilters(data?: any): any {
    return {
      filterId: data.filterId,
      name: data.name,
      selectedValue: data.selectedValue,
    };
  }

  openSettings(val, itemname, item?: any) {
    if (val) {
      this.settings = false;
    } else {
      this.settings = true;
      this.options = ['States', 'City', 'Branch', 'Division', 'Department'];
      item && this.dash.updateGraphId(item);
      this.router.navigate(['/filters', itemname]);
    }
  }
  openChartType(chartType, item) {
    this.itemnumber = item;
    //console.log(item);
    if (chartType) {
      this.settings = false;
    } else {
      this.settings = true;
      this.options = ['Bar Chart', 'Pie Chart'];
    }
  }

  openChartOpt(event) {
    const opt = event.target.outerText;
    // console.log(opt);
    if (opt == 'Bar Chart') {
      this.showbar = true;
      this.showpie = false;
    } else if (opt == 'Pie Chart') {
      this.showpie = true;
      this.showbar = false;
    }
  }

  dragMoved(e: CdkDragMove) {
    const point = this.getPointerPositionOnPage(e.event);
    //console.log(point.x + ' ' + point.y);
    this.listGroup._items.forEach((dropList) => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }
  setSelectedView(d) {
    // this.secondrownum =true;
    // console.log(d);
    const x = 'd' + d.sortOrder;
    this.setGraphs(d, x, true);
  }
  setSelectedSwitchView(d) {
    this.setSwitchGraphs(d);
    console.log(d);
    // const x = 'd' + d.sortOrder;
    // this.setGraphs(d, x, true);
  }
  setSwitchGraphs(d: any) {
    // throw new Error('Method not implemented.');
  }
  dropListDropped(event) {
    if (!this.target) return;

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder) return true;

    if (drop != this.activeContainer) return false;

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    this.placeholder.enter(
      drag,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop
    );
    return false;
  };

  mouseMove(event: MouseEvent) {
    this.x = event.clientX;
    this.y = event.clientY;
    event.preventDefault();
  }
  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    return {
      x: this.x,
      y: this.y,
    };
  }

  /* Api Call for Dashboard */

  openrowoneGraph(e) {
    this.firstrowid = e.id;
    $('#rowonegraph').modal('show');
  }

  closerowoneGraph() {
    $('#rowonegraph').modal('hide');
  }

  openseconeGraph(item) {
    this.secondrownum = item;
    this.graphitemname = item.graphName;
    $('#rowsecgraph').modal('show');
  }

  closerowsecGraph() {
    $('#rowsecgraph').modal('hide');
  }

  svggraph: any;
  svglegend: any;
  exportToPdf(itemsFirstRow, items) {
    this.ispdfloader = true;
    let doc = new jsPDF('l', 'pt', 'a3');
    let count = 0;
    this.slideShowArr = itemsFirstRow.concat(items);
    var filteredArr = this.slideShowArr.filter((x) => x.isSlideShow == true);
    if (this.slideShowArr)
      // console.log(filteredArr);
      for (let item of filteredArr) {
        this.svgdata = document
          .getElementById('exportgrp' + item.parentGraphID)
          .querySelectorAll('svg');
     

        $('.chartsPDF').html(
          document
            .getElementById('exportgrp' + item.parentGraphID)
            .querySelector('.charts').innerHTML
        );
        // console.log(this.svglegend);

        $('.box .fa').hide();
        if (this.svgdata !== undefined) {
          var canvas = document.createElement('canvas');
         
          html2canvas(this.chartsPDF.nativeElement, {
            useCORS: true,
            allowTaint: true,
            scrollY: -window.scrollY,
            scale: 1
          }).then((canvas) => {
            // canvg(canvas, document.getElementsByClassName('chartsPDF')[0].outerHTML);

            var imgData = canvas.toDataURL('image/png');

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            const canvasWidth = (canvas.width ) * ratio;
            const canvasHeight = (canvas.height)  * ratio;
            const marginX = (pageWidth - canvasWidth) / 2;
            const marginY = (pageHeight - canvasHeight) / 2;
            doc.text(item.displayName, 20, 30);
            doc.addImage(
              imgData,
              'PNG',
              marginX,
              marginY+40,
              canvasWidth,
              canvasHeight,
            );
            doc.addPage();
            count = count + 1;

            
            if (count == filteredArr.length) {
              console.log('pdf generated');
              this.ispdfloader = false;
              doc.save('Graph' + Date.now() + '.pdf');
            }
          });
          $('.box .fa').show();
        }
      }
      $('.chartsPDF').remove();
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}

// function __Mouse
function __isInsideDropListClientRect(
  dropList: CdkDropList,
  x: number,
  y: number
) {
  const { top, bottom, left, right } =
    dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
