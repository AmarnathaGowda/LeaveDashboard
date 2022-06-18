import { Component, OnInit } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardgraphsService } from '../../../services/dashboardgraphs.service';
import { ReportService } from '../../../services/othours/report.service';
import { ApiserviceService } from '../../../services/shared/apiservice.service';
import filter from './filters.json';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ClonereportComponent } from '../clonereport/clonereport.component';
import { NotifyToastService } from '../../../services/notify-toast.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-yyyy',
  },
  display: {
    dateInput: 'DD-MMM-yyyy',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM',
  },
};

@Component({
  selector: 'dashboard-ui-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FiltersComponent implements OnInit {
  name: string;
  selectedItems: any[];
  gridParams;

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'check All',
    unSelectAllText: 'UnCheck All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  singledropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'check All',
    unSelectAllText: 'UnCheck All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  filterDropdown: any;
  routeParams: any;
  getDailyAttendance: any;
  getEmpWorkedOnWeekend: {
    data: any;
    keys: string[];
    x: string;
    y: string;
    colors: { totalEmp: string };
  };
  getPenalizationMetrics: {
    data: any[];
    color: string[];
  };
  getEarlyLogoutMetricsData: {
    data: any;
    color: string[];
    y: string;
    x: string;
  };
  getSummaryOfWorkHours: {
    data: any;
    keys: string[];
    x: string;
    y: string;
    color: { totalHours: string };
  };
  getLateLogintMetricsData: {
    data: any;
    color: string[];
    y: string;
    x: string;
  };
  getOvertimeDetails: { data: any; color: string[]; x: string; y: string };
  getAvgOTHoursByAge: { data: any; color: string[]; x: string; y: string };
  totalDeviationMins: {
    data: any;
    keys: string[];
    color: { minutes: string };
    x: string;
    y: string;
  };
  getPenalizationInstances: {
    data: any;
    color: any;
  };
  yearSelected: any;
  monthSelected: any;
  branchSelected: any;
  citySelected: any;
  customSelected: any;
  model: any = {};
  filters: any = {};
  empid: any;
  gridData: any;
  filterParams = {};
  graphId;
  getDailyAttendanceStatus: any;
  earlylogoutChart: {
    data: any;
    colors: string[];
    type: string;
    keys: string[];
  };
  lateloginChart: {
    data: any;
    colors: string[];
    type: string;
    middletext: string;
    keys: string[];
  };
  getTargetVsActualWorkDaysData: any;
  getTargetVsActualWorkDays: { data: any; keys: any[]; color: string[] };
  gridColumns: any[];
  showReport = false;
  loader = false;
  getweeklyOvertime: { data: any; color: string[]; keys: string[] };
  constructor(
    private api: ApiserviceService,
    private rep: ReportService,
    private route: ActivatedRoute,
    private dash: DashboardgraphsService,
    public dialog: MatDialog,
    public toast: NotifyToastService
  ) {
    this.dash.updateEmpid('9F7844FC-1422-4663-BF46-F882CD13A38C');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.name = params.get('name');
    });
    this.dash.getEmpid().subscribe((data) => {
      this.empid = data;
    });

    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=1749&UserID=101&EmpUID=${this.empid}`; //mock for Daily Attendance Status
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=2069&UserID=101&EmpUID=${this.empid}`; //mock for overtimeDetails
    //  this.filterParams = `dashboardModuleID=1&dashboardGraphID=4&UserID=101&EmpUID=${this.empid}`; //mock for Early Logout
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=2071&UserID=101&EmpUID=${this.empid}`; //mock for Late Login
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=2&UserID=101&EmpUID=${this.empid}`; //mock for Target vs Actual Work Hours
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=5&UserID=101&EmpUID=${this.empid}`; //mock for Daily Attendance
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=6&UserID=101&EmpUID=${this.empid}`; //mock for Weekend/Holiday Working
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=7&UserID=101&EmpUID=${this.empid}`; //mock for Late Login/ Early Logout Penalization
    // this.filterParams = `dashboardModuleID=1&dashboardGraphID=10&UserID=101&EmpUID=${this.empid}`; //mock for Late Login/ Early Logout Penalization

    this.dash.getgraphId().subscribe((data: any) => {
      if (data) {
        this.filterParams = `dashboardModuleID=1&dashboardGraphID=${data.dashboardGraphUserId}&UserID=101&EmpUID=${this.empid}`;
      }
    });

    this.filterParams &&
      this.rep.getFilterDropdowns(this.filterParams).subscribe((data) => {
        this.filters = data[0];
        this.filterDropdown = data[0].filters;
        this.setValueSelected();

        if (this.filters.graphId == 5) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getDailyAttendance(this.gridParams).subscribe((data) => {
            const getDailyAttendanceData = data[0].data;
            const absentkey = getDailyAttendanceData.map(
              (x) => Object.keys(x)[1]
            );
            const presentkey = getDailyAttendanceData.map(
              (x) => Object.keys(x)[2]
            );

            this.getDailyAttendance = {
              data: getDailyAttendanceData,
              color: ['#264e86', '#5e88fc'],
              keys: [absentkey[0], presentkey[0]],
            };
          });
        } else if (this.filters.graphId == 1) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getDailyAttendanceStatus(filtered).subscribe((data) => {
            const getDailyAttendanceStatusData: any = data[0];
            getDailyAttendanceStatusData.data.map((y) => {
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
            this.getDailyAttendanceStatus = {
              data: getDailyAttendanceStatusData.data,
              colors: ['#4d85bd', '#264e86', '#7aac5a', '#cc3333'],
              type: 'pie',
              legendpie: ['Present', 'Unknown', 'Absent', 'On Leave'],
              keys: ['percentage', 'totalCount', 'status'],
            };
          });
        } else if (this.filters.graphId == 6) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getEmpWorkedOnWeekend(this.gridParams).subscribe((data) => {
            const getEmpWorkedOnWeekendData = data[0].data;
            this.getEmpWorkedOnWeekend = {
              data: getEmpWorkedOnWeekendData,
              keys: ['totalEmp'],
              x: 'date',
              y: 'totalEmp',
              colors: { totalEmp: '#66a5ad' },
            };
          });
        } else if (this.filters.graphId == 2) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);

          this.dash
            .getTargetVsActualWorkDays(this.gridParams)
            .subscribe((data) => {
              this.getTargetVsActualWorkDaysData = data[0].data;
              const targetkey = this.getTargetVsActualWorkDaysData.map(
                (x) => Object.keys(x)[1]
              );
              const actualkey = this.getTargetVsActualWorkDaysData.map(
                (x) => Object.keys(x)[2]
              );
              this.getTargetVsActualWorkDays = {
                data: this.getTargetVsActualWorkDaysData,
                keys: [targetkey[0], actualkey[0]],
                color: ['#4d85bd', '#264e86'],
              };
            });
        } else if (this.filters.graphId == 3) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getLateLogin(filtered).subscribe((data) => {
            const getLateLoginData: any = data[0].data;

            this.lateloginChart = {
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
        } else if (this.filters.graphId == 4) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;

          this.dash.getearlyLogout(filtered).subscribe((data) => {
            const getearlyLogoutData: any = data[0].data;
            this.rep.setGridParams(null);
            for (var i = 0; i < getearlyLogoutData.length; i++) {
              getearlyLogoutData[i].elname = getearlyLogoutData[i]['name'];
              delete getearlyLogoutData[i].name;
            }
            this.earlylogoutChart = {
              data: getearlyLogoutData,
              colors: ['#7aac5a', '#cc3333'],
              type: 'earlylogoutdonut',
              keys: ['value', 'value', 'elname'],
            };
          });
        } else if (this.filters.graphId == 7) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;

          this.rep.setGridParams(null);
          this.dash.getPenalizationMetrics(filtered).subscribe((data) => {
            const getPenalizationMetricsData = data[0].data;
            console.log(data)
            this.getPenalizationMetrics = {
              data: getPenalizationMetricsData,
              color: ['#264e86', '#5e88fc', '#74dbef'],
              // y: 'name',
              // x: 'count',
            };
          });
        } else if (this.name === 'Early Logout Metrics') {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);

          this.dash.getEarlyLogoutMetrics(filtered).subscribe((data) => {
            const getEarlyLogoutMetricsData = data[0].data;
            this.getEarlyLogoutMetricsData = {
              data: getEarlyLogoutMetricsData,
              color: ['#264e86', '#5e88fc', '#74dbef'],
              y: 'name',
              x: 'count',
            };
          });
        } else if (this.name === 'Summary of Work Hours') {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          // this.rep.setGridParams(null);
          this.dash.getSummaryOfWorkHours(filtered).subscribe((data) => {
            const getSummaryOfWorkHoursData = data[0].data;

            this.getSummaryOfWorkHours = {
              data: getSummaryOfWorkHoursData,
              keys: ['totalHours'],
              x: 'date',
              y: 'totalHours',
              color: { totalHours: '#264e86' },
            };
          });
        } else if (this.name === 'Late Login Metrics') {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getLateLogintMetrics(filtered).subscribe((data) => {
            const getLateLogintMetricsData = data[0].data;
            this.getLateLogintMetricsData = {
              data: getLateLogintMetricsData,
              color: ['#264e86', '#5e88fc', '#74dbef'],
              y: 'name',
              x: 'count',
            };
          });
        } else if (this.name === 'Overtime Details') {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          // this.rep.postGetOvertimeReport(this.gridParams).subscribe((data) => {
          //   this.gridData = data;
          // });
          this.rep.setGridParams(null);
          this.dash.getOvertimeDetails(filtered).subscribe((data) => {
            const getOvertimeDetailsData = data[0].data;
            this.getOvertimeDetails = {
              data: getOvertimeDetailsData,
              color: ['#66a5ad'],
              x: 'name',
              y: 'totalHours',
            };
          });
        } else if (this.filters.graphId == 13) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getAvgOTHoursByAge(this.gridParams).subscribe((data) => {
            const getAvgOTHoursByAgeData = data[0].data;
            this.getAvgOTHoursByAge = {
              data: getAvgOTHoursByAgeData,
              color: ['#66a5ad'],
              x: 'age',
              y: 'averageHours',
            };
          });
        } else if (this.filters.graphId == 14) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash
            .getTotalDeviationMinutes(this.gridParams)
            .subscribe((data) => {
              const getTotalDeviationMinutesData: any = data[0];
              this.totalDeviationMins = {
                data: getTotalDeviationMinutesData.data,
                keys: ['minutes'],
                color: { minutes: '#264e86' },
                x: 'date',
                y: 'minutes',
              };
            });
        } else if (this.filters.graphId == 15) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash
            .getPenalizationInstances(this.gridParams)
            .subscribe((data) => {
              const getPenalizationInstancesData = data[0].data;
              this.getPenalizationInstances = {
                data: getPenalizationInstancesData,
                color: ['#07575b', '#66a5ad'],
              };
            });
        } else if (this.filters.graphId == 11) {
          const filtered = this.checkandFormatPostJson(this.model, 'runreport');
          this.gridParams = filtered;
          this.rep.setGridParams(null);
          this.dash.getweeklyOvertime(filtered).subscribe((data) => {
            const getWeeklyOvertimeData = data[0].data;

            this.getweeklyOvertime = {
              data: getWeeklyOvertimeData,

              color: ['#07575b', '#66a5ad'],
              keys: ['weekName', 'totalHours'],
            };
          });
        }
      });
    // *****
    // this.filters = filter[0];
    // this.filterDropdown = filter[0].filters;
    // this.setValueSelected();
  }
  setValueSelected() {
    // this.model.fromMonth =  moment(new Date);
    // this.model.toMonth =  moment(new Date);
    this.filterDropdown.forEach((element) => {
      element.name == 'City' && element.selectedValue !== 'null'
        ? (this.model.citySelected = element.selectedValue)
        : '';
      element.name == 'Branch' && element.selectedValue !== 'null'
        ? (this.model.branchSelected = element.selectedValue)
        : '';
      element.name == 'Division' && element.selectedValue !== 'null'
        ? (this.model.divisionSelected = element.selectedValue)
        : '';
      element.name == 'Department' && element.selectedValue !== 'null'
        ? (this.model.departmentSelected = element.selectedValue)
        : '';
      element.name == 'Process' && element.selectedValue !== 'null'
        ? (this.model.processSelected = element.selectedValue)
        : '';
      element.name == 'Band Grade' && element.selectedValue !== 'null'
        ? (this.model.bandGradeSelected = element.selectedValue)
        : '';
      element.name == 'Designation' && element.selectedValue !== 'null'
        ? (this.model.designationSelected = element.selectedValue)
        : '';
      element.name == 'Date Range' && element.selectedValue !== 'null'
        ? (this.model.Range = this.setDateRange(element.selectedValue))
        : '';
      element.name == 'View By(for graph only)' &&
      element.selectedValue !== 'null'
        ? (this.model.view = element.selectedValue)
        : '';
      element.name == 'Custom Columns' && element.selectedValue !== 'null'
        ? (this.model.customSelected = element.selectedValue)
        : '';
      element.name == 'Attendance cycle' && element.selectedValue !== 'null'
        ? element.selectedValue.forEach((x) => {
            this.model.calendarId = x.id;
            this.model.calendar = x;
          })
        : '';
    });
  }
  setAttendanceCycle(event) {
    this.filterDropdown.forEach((element) => {
      if (element.name == 'Attendance cycle' && element.selectedValue.length) {
        element.selectedValue = [];
        element.selectedValue = JSON.parse(event.target.title);
        this.model.calendar = element.selectedValue[0];
      }
    });
  }
  setDateRange(ele: any) {
    if (ele) {
      this.model.selectedRange = ele[0].name;
      this.model.fromPDate = moment(ele[0].value.from, 'DD-MM-YYYY');
      if (this.model.selectedRange === 'Custom Period [From Date..To Date]') {
        this.model.toDate = moment(ele[0].value.to, 'DD-MM-YYYY');
      } else if (
        this.model.selectedRange === 'Custom Period [From Month..To Month]'
      ) {
        const from = ele[0].value.from.split('-');
        const to = ele[0].value.to.split('-');
        this.model.fromMonth = from[0];
        this.model.fromYear = from[1];
        this.model.toMonth = to[0];
        this.model.toYear = to[1];
      }
    }

    return ele;
  }
  onSubmit(): void {
    const postData = this.checkandFormatPostJson(this.model, 'submit');
    const resetpostData = this.checkandFormatPostJson(this.model, 'runreport');
    console.log(postData);
    this.rep.setGridParams(resetpostData);
    this.gridParams = resetpostData;
    this.gridParams.graphId = this.filters.graphId;
    this.rep.postSaveFilters(postData).subscribe((data) => {
      this.toast.showSuccess('Saved Succesfully');
      if (this.filters.graphName === 'Overtime Details') {
        this.getOvertimeDetailsGraph(this.gridParams);
        this.getOvertimeDetailsGraphReport(this.gridParams);
      } else if (this.filters.graphName === 'Daily Attendance Status') {
        this.dailyAttendanceStatusGraph(this.gridParams);
        this.dailyAttendanceStatusReport(this.gridParams);
      } else if (this.filters.graphId == 4) {
        this.earlyLogoutGraph(this.gridParams);
        this.gridParams.graphId = this.filters.graphId;
        this.earlyLogoutReport(this.gridParams);
      } else if (this.filters.graphId == 3) {
        this.earlyLogintGraph(this.gridParams);
        this.gridParams.graphId = this.filters.graphId;
        this.earlyLoginReport(this.gridParams);
      } else if (this.filters.graphId == 2) {
        this.targetvsActualGraph(this.gridParams);
        this.gridParams.graphId = this.filters.graphId;
        this.targetvsActualReport(this.gridParams);
      } else if (this.filters.graphId == 5) {
        this.dailyAttendanceGraph(this.gridParams);
        this.gridParams.graphId = this.filters.graphId;
        this.dailyAttendanceReport(this.gridParams);
      } else if (this.filters.graphId == 6) {
        this.empWorkedonWeekendGraph(this.gridParams);
        this.empWorkedonWeekendReport(this.gridParams);
      } else if (this.filters.graphId == 7) {
        this.lateLoginEarlyLogoutGraph(this.gridParams);
        this.lateLoginEarlyLogoutReport(this.gridParams);
      } else if (this.filters.graphId == 8) {
        this.earlyLogoutMetricsGraph(this.gridParams);
        this.earlyLogoutMetricsReport(this.gridParams);
      } else if (this.filters.graphId == 10) {
        this.lateLoginMetricsGraph(this.gridParams);
        this.lateLoginMetricsReport(this.gridParams);
      } else if (this.filters.graphId == 14) {
        this.totalDeviationMinsGraph(this.gridParams);
        this.totalDeviationMinsReport(this.gridParams);
      } else if (this.filters.graphId == 15) {
        this.penalizationInstancesGraph(this.gridParams);
        this.penalizationInstancesReport(this.gridParams);
      } else if (this.filters.graphId == 13) {
        this.avgOvertimeHoursGraph(this.gridParams);
        this.avgOvertimeHoursReport(this.gridParams);
      }
    });
  }
  resetBtn() {
    this.model = {};
    // const filterDropDown = 'dashboardModuleID=1&dashboardGraphID=12&UserID=101';
    // this.rep.getFilterDropdowns(filterDropDown).subscribe((data) => {
    //   this.filters = data[0];
    //   this.filterDropdown = data[0].filters;
    this.setValueSelected();
    // });
  }

  checkandFormatPostJson(data?: any, buttonName?: any) {
    let postData;
    let filterName;
    if (buttonName === 'submit') {
      postData = {
        graphname: this.filters.graphName,
        filters: [],
        graphUserId: this.filters.graphUserId,
        EmpUID: this.empid,
      };
      let filterId;
      Object.entries(data).map(([key, value]) => {
        if (key !== '' && value !== false) {
          const checkFilterId = this.filterDropdown.filter((d) => {
            if (key.toLowerCase().includes(d.name.toLowerCase())) {
              return d;
            }
            if (key == 'Range' && d.name === 'Date Range') {
              return d;
            }
            if (key == 'view' && d.name === 'View By(for graph only)') {
              return d;
            }
            // if (key == 'customSelected' && d.name === 'Custom Columns') {
            //   return d;
            // }
            if (key == 'calendarId' && d.name === 'Attendance cycle') {
              if (!Array.isArray(this.model.calendar)) {
                this.filterDropdown.map((element) => {
                  if (element.name === 'Attendance cycle') {
                    element.data.map((x) => {
                      x.value = null;
                      if (
                        JSON.stringify(this.model.calendar) == JSON.stringify(x)
                      ) {
                        d.selectedValue = [];
                        d.selectedValue.push(x);
                      }
                    });
                  }
                });
                return d;
              } else {
                this.filterDropdown.map((element) => {
                  if (element.name === 'Attendance cycle') {
                    element.data.map((x) => {
                      x.value = null;
                      if (
                        JSON.stringify(this.model.calendar) == JSON.stringify(x)
                      ) {
                        d.selectedValue = [];
                        d.selectedValue.push(x);
                      }
                    });
                  }
                });
                return d;
              }
              return d;
            }
          });
          if (checkFilterId && checkFilterId.length && key !== 'Range') {
            filterId = checkFilterId[0].filterId;
            if (value) {
              postData.filters.push({
                filterid: filterId,
                selectedValue:
                  value == 'calendar' || value == 'attendancecycle'
                    ? checkFilterId[0].selectedValue
                    : value,
              });
            }
          }
          if (checkFilterId && checkFilterId.length && key == 'Range') {
            const v: any = value;
            if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [From Month..To Month]'
            ) {
              const fromMonth =
                this.model.fromMonth + '-' + this.model.fromYear;
              const toMonth = this.model.toMonth + '-' + this.model.toYear;

              const v: any = value;
              value[0].value = {
                from: fromMonth,
                to: toMonth,
              };
              filterId = checkFilterId[0].filterId;
              postData.filters.push({
                filterid: filterId,
                name: checkFilterId[0].name,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [From Date..To Date]'
            ) {
              const fromDate = this.model.fromPDate;
              const toDate = this.model.toDate;
              const v: any = value;
              value[0].value = {
                from: moment(fromDate).format('DD-MM-YYYY'),
                to: moment(toDate).format('DD-MM-YYYY'),
              };
              filterId = checkFilterId[0].filterId;
              postData.filters.push({
                filterid: filterId,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [Date]'
            ) {
              const fromDate = this.model.fromPDate;
              const v: any = value;
              value[0].value = {
                from: moment(fromDate).format('DD-MM-YYYY'),
                to: '',
              };
              filterId = checkFilterId[0].filterId;
              postData.filters.push({
                filterid: filterId,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              (value[0].name === 'Previous Year' ||
                value[0].name === 'Current Year' ||
                value[0].name === 'Current Day' ||
                value[0].name === 'Previous Day' ||
                value[0].name === 'Current Week' ||
                value[0].name === 'Previous Week' ||
                value[0].name === 'Current Month' ||
                value[0].name === 'Previous Month' ||
                value[0].name === 'Current Qtr' ||
                value[0].name === 'Previous Qtr' ||
                value[0].name === 'Current Qtr')
            ) {
              const fromDate = this.model.fromPDate;
              const v: any = value;
              value[0].value = null;
              filterId = checkFilterId[0].filterId;
              filterName = checkFilterId[0].name;
              postData.filters.push({
                filterid: filterId,
                name: filterName,
                selectedValue: value,
              });
            } else {
              filterId = checkFilterId[0].filterId;
              postData.filters.push({
                filterid: filterId,
                name: checkFilterId[0].name,
                selectedValue: value,
              });
            }
          }
        }
      });
    } else if (buttonName === 'runreport') {
      postData = {
        graphname: this.filters.graphName,
        isViewReport: 'true',
        filters: [],
        EmpUID: this.empid,
      };

      let filterId;
      let filterName;
      Object.entries(data).map(([key, value]) => {
        if (key !== '' && value !== false) {
          const checkFilterId = this.filterDropdown.filter((d) => {
            if (key.toLowerCase().includes(d.name.toLowerCase())) {
              return d;
            }
            if (key == 'customSelected' && d.name === 'Custom Columns') {
              return d;
            }
            if (key == 'Range' && d.name === 'Date Range') {
              return d;
            }
            if (key == 'view' && d.name === 'View By(for graph only)') {
              return d;
            }
            if (key == 'calendarId' && d.name === 'Attendance cycle') {
              if (!Array.isArray(this.model.calendar)) {
                this.filterDropdown.map((element) => {
                  if (element.name === 'Attendance cycle') {
                    element.data.map((x) => {
                      x.value = null;
                      if (
                        JSON.stringify(this.model.calendar) == JSON.stringify(x)
                      ) {
                        d.selectedValue = [];
                        d.selectedValue.push(x);
                      }
                    });
                  }
                });
                return d;
              } else {
                this.filterDropdown.map((element) => {
                  if (element.name === 'Attendance cycle') {
                    element.data.map((x) => {
                      x.value = null;
                      if (
                        JSON.stringify(this.model.calendar) == JSON.stringify(x)
                      ) {
                        d.selectedValue = [];
                        d.selectedValue.push(x);
                      }
                    });
                  }
                });
                return d;
              }
              return d;
            }
          });
          if (checkFilterId && checkFilterId.length && key !== 'Range') {
            filterId = checkFilterId[0].filterId;
            filterName = checkFilterId[0].name;
            if (value) {
              const v: any = value;
              v.length &&
                postData.filters.push({
                  filterid: filterId,
                  name: filterName,
                  selectedValue:
                    value == 'calendar' || value == 'attendancecycle'
                      ? checkFilterId[0].selectedValue
                      : value,
                });
            }
          }
          if (checkFilterId && checkFilterId.length && key == 'Range') {
            const v: any = value;
            if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [From Month..To Month]'
            ) {
              const fromMonth =
                this.model.fromMonth + '-' + this.model.fromYear;
              const toMonth = this.model.toMonth + '-' + this.model.toYear;

              const v: any = value;
              value[0].value = {
                from: fromMonth,
                to: toMonth,
              };
              filterId = checkFilterId[0].filterId;
              postData.filters.push({
                filterid: filterId,
                name: checkFilterId[0].name,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [From Date..To Date]'
            ) {
              const fromDate = this.model.fromPDate;
              const toDate = this.model.toDate;
              const v: any = value;
              value[0].value = {
                from: moment(fromDate).format('DD-MM-YYYY'),
                to: moment(toDate).format('DD-MM-YYYY'),
              };
              filterId = checkFilterId[0].filterId;
              filterName = checkFilterId[0].name;
              postData.filters.push({
                filterid: filterId,
                name: filterName,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              value[0].name === 'Custom Period [Date]'
            ) {
              const fromDate = this.model.fromPDate;
              const v: any = value;
              value[0].value = {
                from: moment(fromDate).format('DD-MM-YYYY'),
                to: '',
              };
              filterId = checkFilterId[0].filterId;
              filterName = checkFilterId[0].name;
              postData.filters.push({
                filterid: filterId,
                name: filterName,
                selectedValue: value,
              });
            } else if (
              v &&
              v.length &&
              value !== '' &&
              value &&
              (value[0].name === 'Previous Year' ||
                value[0].name === 'Current Year' ||
                value[0].name === 'Current Day' ||
                value[0].name === 'Previous Day' ||
                value[0].name === 'Current Week' ||
                value[0].name === 'Previous Week' ||
                value[0].name === 'Current Month' ||
                value[0].name === 'Previous Month' ||
                value[0].name === 'Current Qtr' ||
                value[0].name === 'Previous Qtr' ||
                value[0].name === 'Current Qtr')
            ) {
              const fromDate = this.model.fromPDate;
              const v: any = value;
              value[0].value = null;
              filterId = checkFilterId[0].filterId;
              filterName = checkFilterId[0].name;
              postData.filters.push({
                filterid: filterId,
                name: filterName,
                selectedValue: value,
              });
            }
          }
        }
      });
    }
    console.log(postData);
    return postData;
  }

  dropdownChanged($event: any) {
    console.log($event);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    selector
  ) {
    const toDate = moment(this.model.toMonth).valueOf();
    const fromDate = moment(this.model.fromMonth).valueOf();
    if (selector === 'fromMonth') {
      console.log(moment(this.model.toMonth).valueOf());

      if (this.model.toMonth && fromDate >= toDate) {
        alert('Month selected should not be more than To Month ');
        datepicker.close();
        this.model.fromMonth = '';
        return;
      }
      const ctrlValue = normalizedMonth;
      ctrlValue.month(normalizedMonth.month());
      this.model.fromMonth = moment(normalizedMonth);
      datepicker.close();
      console.log(moment(normalizedMonth).format('DD-MM-YYYY'));
    } else if (selector === 'toMonth') {
      if (toDate <= fromDate) {
        alert('Month selected should not be more than From Month ');
        datepicker.close();
        this.model.toMonth = '';
        return;
      }
      const ctrlValue = normalizedMonth;
      ctrlValue.month(normalizedMonth.month());
      this.model.toMonth = moment(normalizedMonth);
      datepicker.close();
    }
  }
  addDate($event, selector: any) {
    const toDate = moment(this.model.toDate).valueOf();
    const fromDate = moment(this.model.fromDate).valueOf();
    const fromPDate = moment(this.model.fromPDate).valueOf();
    if (selector === 'fromPDate') {
      if (this.model.toDate && fromPDate >= toDate) {
        alert('Date selected should not be more than To Date ');
        this.model.fromDate = '';
        return;
      }
      this.model.fromDate = moment($event.value);
    } else if (selector === 'toDate') {
      if (toDate <= fromPDate) {
        alert('Date selected should not be more than From Date ');
        // this.model.toDate = '';
        return;
      }
      this.model.toDate = moment($event.value);
    }
  }
  cloneReport() {
    this.dialog.open(ClonereportComponent, {
      data: {
        graphName: this.filters.graphName,
        graphId: this.filters.graphId,
        EmpUID: this.empid,
      },
    });
  }
  runReport() {
    this.showReport = true;
    this.toast.showSuccess('Running Report. Please wait ..');
    const postData = this.checkandFormatPostJson(this.model, 'runreport');
    // this.rep.setGridParams(postData);
    this.gridParams = postData;
    this.gridParams.graphId = this.filters.graphId;
    if (this.filters.graphId == 1) {
      this.dailyAttendanceStatusGraph(this.gridParams);
      this.dailyAttendanceStatusReport(this.gridParams);
    } else if (this.filters.graphId == 2) {
      this.targetvsActualGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.targetvsActualReport(this.gridParams);
    } else if (this.filters.graphId == 3) {
      this.earlyLogintGraph(this.gridParams);
      this.earlyLoginReport(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.earlyLoginReport(this.gridParams);
    } else if (this.filters.graphId == 4) {
      this.earlyLogoutGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.earlyLogoutReport(this.gridParams);
    } else if (this.filters.graphId == 5) {
      this.dailyAttendanceGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.dailyAttendanceReport(this.gridParams);
    } else if (this.filters.graphId == 6) {
      this.empWorkedonWeekendGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.empWorkedonWeekendReport(this.gridParams);
    } else if (this.filters.graphId == 7) {
      this.lateLoginEarlyLogoutGraph(this.gridParams);
      this.lateLoginEarlyLogoutReport(this.gridParams);
    } else if (this.filters.graphId == 8) {
      this.earlyLogoutMetricsGraph(this.gridParams);
      this.earlyLogoutMetricsReport(this.gridParams);
    } else if (this.filters.graphId == 9) {
      this.summaryOfWorkoutGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.summaryOfWorkoutReport(this.gridParams);
    } else if (this.filters.graphId == 10) {
      this.lateLoginMetricsGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.lateLoginMetricsReport(this.gridParams);
    } else if (this.filters.graphId == 11) {
      this.weeklyovertimeGraph(this.gridParams);
      this.gridParams.graphId = this.filters.graphId;
      this.weeklyOvertimeReport(this.gridParams);
    } else if (this.filters.graphId == 12) {
      this.getOvertimeDetailsGraph(this.gridParams);
      this.getOvertimeDetailsGraphReport(this.gridParams);
    } else if (this.filters.graphId == 13) {
      this.avgOvertimeHoursGraph(this.gridParams);
      this.avgOvertimeHoursReport(this.gridParams);
    } else if (this.filters.graphId == 14) {
      this.totalDeviationMinsGraph(this.gridParams);
      this.totalDeviationMinsReport(this.gridParams);
    } else if (this.filters.graphId == 15) {
      this.penalizationInstancesGraph(this.gridParams);
      this.penalizationInstancesReport(this.gridParams);
    }

    this.loader = false;
  }
  weeklyOvertimeReport(gridParams: any) {
    this.gridData = null;
    this.dash.getWeeklyOverTimeReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  weeklyovertimeGraph(gridParams: any) {
    this.dash.getweeklyOvertime(gridParams).subscribe((data) => {
      const getWeeklyOvertimeData = data[0].data;

      this.getweeklyOvertime = {
        data: getWeeklyOvertimeData,

        color: ['#07575b', '#66a5ad'],
        keys: ['weekName', 'totalHours'],
      };
    });
  }
  avgOvertimeHoursGraph(gridParams: any) {
    this.dash.getAvgOTHoursByAge(gridParams).subscribe((data) => {
      const getAvgOTHoursByAgeData = data[0].data;
      this.getAvgOTHoursByAge = {
        data: getAvgOTHoursByAgeData,
        color: ['#66a5ad'],
        x: 'age',
        y: 'averageHours',
      };
    });
  }
  avgOvertimeHoursReport(gridParams: any) {
    this.gridData = null;
    this.dash.getAvgOTHoursByAgeReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  getOvertimeDetailsGraphReport(gridParams: any) {
    this.gridData = null;
    this.dash.getOvertimeDetailsReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  penalizationInstancesReport(gridParams: any) {
    this.gridData = null;
    this.dash.getPenalizationInstancesReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  penalizationInstancesGraph(gridParams: any) {
    this.dash.getPenalizationInstances(gridParams).subscribe((data) => {
      const getPenalizationInstancesData = data[0].data;
      this.getPenalizationInstances = {
        data: getPenalizationInstancesData,

        color: ['#07575b', '#66a5ad'],
      };
    });
  }
  totalDeviationMinsGraph(gridParams: any) {
    this.dash.getTotalDeviationMinutes(gridParams).subscribe((data) => {
      const getTotalDeviationMinutesData: any = data[0];
      this.totalDeviationMins = {
        data: getTotalDeviationMinutesData.data,
        keys: ['minutes'],
        color: { minutes: '#264e86' },
        x: 'date',
        y: 'minutes',
      };
    });
  }
  totalDeviationMinsReport(gridParams: any) {
    this.gridData = null;
    this.dash.getTotalDeviationMinutesReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  lateLoginMetricsGraph(gridParams: any) {
    this.dash.getLateLogintMetrics(gridParams).subscribe((data) => {
      const getLateLogintMetricsData = data[0].data;
      this.getLateLogintMetricsData = {
        data: getLateLogintMetricsData,
        color: ['#264e86', '#5e88fc', '#74dbef'],
        y: 'name',
        x: 'count',
      };
    });
  }
  lateLoginMetricsReport(gridParams: any) {
    this.gridData = null;
    this.dash.getLateLogintMetricsReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  earlyLogoutMetricsGraph(gridParams: any) {
    this.dash.getEarlyLogoutMetrics(gridParams).subscribe((data) => {
      const getEarlyLogoutMetricsData = data[0].data;
      this.getEarlyLogoutMetricsData = {
        data: getEarlyLogoutMetricsData,
        color: ['#264e86', '#5e88fc', '#74dbef'],
        y: 'name',
        x: 'count',
      };
    });
  }
  earlyLogoutMetricsReport(gridParams: any) {
    this.gridData = null;
    this.dash.getEarlyLogoutMetricsReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(gridParams);
    });
  }
  lateLoginEarlyLogoutReport(gridParams: any) {
    this.gridData = null;
    this.dash.getPenalizationMetricsReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.rep.setGridParams(gridParams);
    });
  }
  lateLoginEarlyLogoutGraph(gridParams: any) {
    this.dash.getPenalizationMetrics(gridParams).subscribe((data) => {
      const getPenalizationMetricsData = data[0].data;
      this.getPenalizationMetrics = {
        data: getPenalizationMetricsData,

        color: ['#264e86', '#5e88fc', '#74dbef'],
      };
    });
  }
  empWorkedonWeekendGraph(gridParams: any) {
    const filtered = this.checkandFormatPostJson(this.model, 'runreport');
    this.gridParams = filtered;
    this.dash.getEmpWorkedOnWeekend(this.gridParams).subscribe((data) => {
      const getEmpWorkedOnWeekendData = data[0].data;
      this.getEmpWorkedOnWeekend = {
        data: getEmpWorkedOnWeekendData,
        keys: ['totalEmp'],
        x: 'date',
        y: 'totalEmp',
        colors: { totalEmp: '#66a5ad' },
      };
    });
  }
  empWorkedonWeekendReport(gridParams: any) {
    this.gridData = null;
    this.dash.getEmpWorkedOnWeekendReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      gridParams.data = this.gridData.data;
      this.rep.setGridParams(gridParams);
    });
  }
  dailyAttendanceGraph(gridParams: any) {
    const filtered = this.checkandFormatPostJson(this.model, 'runreport');
    this.gridParams = filtered;
    this.dash.getDailyAttendance(this.gridParams).subscribe((data) => {
      const getDailyAttendanceData = data[0].data;
      const absentkey = getDailyAttendanceData.map((x) => Object.keys(x)[1]);
      const presentkey = getDailyAttendanceData.map((x) => Object.keys(x)[2]);
      this.getDailyAttendance = {
        data: getDailyAttendanceData,
        color: ['#264e86', '#5e88fc'],
        keys: [absentkey[0], presentkey[0]],
      };
    });
  }
  dailyAttendanceReport(gridParams: any) {
    this.dash.getDailyAttendanceReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      gridParams.data = this.gridData.data;
      this.rep.setGridParams(gridParams);
    });
  }
  targetvsActualGraph(gridParams: any) {
    this.dash.getTargetVsActualWorkDays(gridParams).subscribe((data) => {
      this.getTargetVsActualWorkDaysData = data[0].data;
      const targetkey = this.getTargetVsActualWorkDaysData.map(
        (x) => Object.keys(x)[1]
      );
      const actualkey = this.getTargetVsActualWorkDaysData.map(
        (x) => Object.keys(x)[2]
      );
      this.getTargetVsActualWorkDays = {
        data: this.getTargetVsActualWorkDaysData,
        keys: [targetkey[0], actualkey[0]],
        color: ['#4d85bd', '#264e86'],
      };
    });
  }
  targetvsActualReport(gridParams: any) {
    this.gridData = null;
    this.dash.getTargetVsActualWorkDaysReport(gridParams).subscribe((data) => {
      this.gridData = data;
      gridParams.data = this.gridData.data;
      this.rep.setGridParams(gridParams);
    });
  }
  summaryOfWorkoutGraph(gridParams: any) {
    this.dash.getSummaryOfWorkHours(gridParams).subscribe((data) => {
      const getSummaryOfWorkHoursData = data[0].data;

      this.getSummaryOfWorkHours = {
        data: getSummaryOfWorkHoursData,
        keys: ['totalHours'],
        x: 'date',
        y: 'totalHours',
        color: { totalHours: '#264e86' },
      };
    });
  }
  summaryOfWorkoutReport(gridParams: any) {
    this.gridData = null;
    this.dash.getSummaryOfWorkHoursReport(gridParams).subscribe((data) => {
      this.gridData = data;
      gridParams.data = this.gridData.data;
      this.rep.setGridParams(gridParams);
    });
  }
  earlyLogintGraph(gridParams: any) {
    const filtered = this.checkandFormatPostJson(this.model, 'runreport');
    this.gridParams = filtered;
    this.rep.setGridParams(gridParams);
    this.dash.getLateLogin(filtered).subscribe((data) => {
      const getLateLoginData: any = data[0].data;

      this.lateloginChart = {
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
  earlyLoginReport(gridParams: any) {
    this.gridData = null;
    this.dash.getLateLoginReport(gridParams).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      gridParams.data = this.gridData.data;
      this.rep.setGridParams(gridParams);
    });
  }

  earlyLogoutReport(params?: any) {
    this.gridData = null;
    this.dash.getearlyLogoutReport(params).subscribe((data) => {
      this.gridData = data;
      params.data = this.gridData.data;
      this.rep.setGridParams(params);
    });
  }

  earlyLogoutGraph(params?: any) {
    const filtered = this.checkandFormatPostJson(this.model, 'runreport');
    this.gridParams = filtered;
    this.dash.getearlyLogout(filtered).subscribe((data) => {
      this.rep.setGridParams(params);
      const getearlyLogoutData: any = data[0].data;
      for (var i = 0; i < getearlyLogoutData.length; i++) {
        getearlyLogoutData[i].elname = getearlyLogoutData[i]['name'];
        delete getearlyLogoutData[i].name;
      }

      this.earlylogoutChart = {
        data: getearlyLogoutData,
        colors: ['#7aac5a', '#cc3333'],
        type: 'earlylogoutdonut',
        keys: ['value', 'value', 'elname'],
      };
    });
  }
  dailyAttendanceStatusReport(params?: any) {
    this.gridData = null;
    this.rep.postDailyAttendanceStatusReport(params).subscribe((data) => {
      this.gridData = data;
      this.gridColumns = this.rep.setColumns(data);
      this.rep.setGridParams(params);
    });
  }

  dailyAttendanceStatusGraph(params?: any) {
    const filtered = this.checkandFormatPostJson(this.model, 'runreport');
    this.gridParams = filtered;
    this.dash.getDailyAttendanceStatus(filtered).subscribe((data) => {
      const getDailyAttendanceStatusData: any = data[0];
      getDailyAttendanceStatusData.data.map((y) => {
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
      this.getDailyAttendanceStatus = {
        data: getDailyAttendanceStatusData.data,
        colors: ['#4d85bd', '#264e86', '#7aac5a', '#cc3333'],
        type: 'pie',
        legendpie: ['Present', 'Unknown', 'Absent', 'On Leave'],
        keys: ['percentage', 'totalCount', 'status'],
      };
    });
  }

  getOvertimeDetailsReport(params?: any) {}

  getOvertimeDetailsGraph(params?: any) {
    this.dash.getOvertimeDetails(params).subscribe((data) => {
      const getOvertimeDetailsData = data[0].data;
      this.getOvertimeDetails = {
        data: getOvertimeDetailsData,
        color: ['#66a5ad'],
        x: 'name',
        y: 'totalHours',
      };
    });
  }
  checkSelected($event) {
    if ($event.length) {
      this.model.Range = $event[0];
      this.model.selectedRange = $event[0].name;
    } else {
      this.model.Range = '';
      this.model.selectedRange = '';
    }
  }
}
