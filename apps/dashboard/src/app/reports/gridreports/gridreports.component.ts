import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DashboardgraphsService } from '../../services/dashboardgraphs.service';
import { ReportService } from '../../services/othours/report.service';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
class Person {
  employeeId: string;
  firstName: string;
  lastName: string;

  designation: string;
  division: string;
  city: string;

  department: string;
  branch: string;

  process: string;
  fromDate: string;
  toDate: string;

  totalOTHours: string;
}

@Component({
  selector: 'dashboard-ui-gridreports',
  templateUrl: './gridreports.component.html',
  styleUrls: ['./gridreports.component.scss'],
})
export class GridreportsComponent implements OnInit {
  showTable = false;
  // persons: Person[];
  _gridParams;
  _displayColumns: any[];
  @Input()
  set gridParams(value: any) {
    this._gridParams = value;
  }
  get gridParams() {
    return this._gridParams;
  }
  _gridData;
  _gridColumns;
  @Input()
  set gridColumns(value: any) {
    this._gridColumns = value;
  }
  get gridColumns() {
    return this._gridColumns;
  }
  @Input()
  set gridData(value: any) {
    this._gridData = value;
  }
  get gridData() {
    return this._gridData;
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized = false;
  @ViewChild('dataTable', { read: ElementRef, static: true })
  dataTable!: ElementRef<HTMLDivElement>;
  // gridData: any;
  button: any;
  dtTrigger: Subject<any> = new Subject();
  Object = Object;
  dtOptionsa: any = {};
  dtOptions: any = {};
  persons: any = [{}];
  loader = false;
  columnName;
  dtRendered = true;
  constructor(
    private http: HttpClient,
    private oth: ReportService,
    private dash: DashboardgraphsService,
    private elem: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    
  }
  ngOnInit(): void {
    // this._displayColumns =  this._gridData && this.oth.getDisplayName(this._gridData);
    // const aa=  this._gridData && this.oth.getDisplayName(this._gridData);
    // const a = this._gridData && aa.map((x) => {
    //   delete x.title;
    //   return x;
    // });
    //  const a = [];

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   scrollCollapse: true,
    //   processing: true,
    //   destroy: true,
    //   scrollY: '50vh',
    //   columns: a,
    // };

    //  const dataUrl =
    // "https://raw.githubusercontent.com/l-lin/angular-datatables/master/demo/src/data/data.json";

    // this.http.get(dataUrl).subscribe((response:any) => {
    // this._displayColumns = [];
    // this.persons = [];
    // this.dtTrigger.next();
    // });

    // const dataUrl =
    //   'https://raw.githubusercontent.com/l-lin/angular-datatables/master/demo/src/data/data.json';

    // this.http.get(dataUrl).subscribe((response: any) => {
    //   this.persons = response.data;
    //   this.dtTrigger.next();
    // });
    // const jsonData: any = this._gridData;

    // this.dtOptions = {
    //   data: [{}],
    //   language: {
    //     search: 'Search across all columns:',
    //     searchPlaceholder: 'Type in for Filter...',
    //     info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
    //   },
    //   bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
    //   paging: false, //Dont want paging
    //   bPaginate: false, //Dont want paging
    //   scrollY: '300px',
    //   scrollCollapse: true,
    //   serverSide: false,
    //   processing: false,
    //   bandGrade: 'NA',
    //   scrollX: true,
    //   scroller: true,
    //   columns: this.setColumns([{}]),
    //   dom: 'Bfrtip',
    //   buttons: ['print', 'excelHtml5'],
    // };
    // if (this._gridData) {
   
    this.dtOptions = {
      data: [
        { id: 860, firstName: 'Superman', lastName: 'Yoda' },
        { id: 870, firstName: 'Foo', lastName: 'Whateveryournameis' },
        { id: 590, firstName: 'Toto', lastName: 'Titi' },
      ],
      columns: [
        {
          title: 'IDx',
          data: 'idx',
        },
        {
          title: 'Name',
          data: 'name',
        },
      ],
      pagingType: 'full_numbers',
      pageLength: 10,
      scrollCollapse: true,
      processing: true,
      destroy: false,
      language: {
        search: 'Search across all columns:',
        searchPlaceholder: 'Type in for Filter...',
        info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
      },
      bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
      paging: false, //Dont want paging
      bPaginate: false, //Dont want paging
      scrollY: '300px',
      serverSide: false,
      bandGrade: 'NA',
      dom: 'Bfrtip',
      buttons: ['print', 'excelHtml5'],
    };
    // }

    this.oth.getGridParams().subscribe((data) => {
      this.loader = true;
      if (data) {
        if (data.graphId == 12) {
          this._gridParams = data;
          this.oth
            .postGetOvertimeReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphname == 'Daily Attendance Status') {
          this._gridParams = data;
          this.oth
            .postDailyAttendanceStatusReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });

          // this.showTable = true;
        } else if (data.graphId == 5) {
          this._gridParams = data;
          this.dash
            .getDailyAttendanceReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });

          // this.showTable = true;
        } else if (data.graphId == 4) {
          this._gridParams = data;
          this.dash
            .getearlyLogoutReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 3) {
          this._gridParams = data;
          this.dash
            .getLateLoginReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              // const dataUrl =
              //   'https://raw.githubusercontent.com/l-lin/angular-datatables/master/demo/src/data/data.json';
              // let table;

              // if ($.fn.dataTable.isDataTable('#example')) {
              //   $('#example').empty();
              //   $('#example')
              //     .DataTable({
              //       data: gdata.data,
              //       retrieve: true,
              //       columns: this._displayColumns,
              //       pagingType: 'full_numbers',
              //     })
              //     .ajax.reload(null, false);
              // } else {
              //   $('#example').DataTable({
              //     data: gdata.data,
              //     retrieve: true,
              //     columns: this._displayColumns,
              //     pagingType: 'full_numbers',
              //   });
              // }
              // $('#example').DataTable({
              //   ajax: 'https://raw.githubusercontent.com/l-lin/angular-datatables/master/demo/src/data/data.json',
              //   destroy: true,
              //   retrieve: true,
              //   columns: this._displayColumns,
              //   pagingType: 'full_numbers',
              // });
              // $('#example').DataTable().ajax.reload();
              // }

              // $('#example').DataTable();
              // this.dtElement.dtInstance && this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

              //   dtInstance.ajax.reload(null, false);

              // });

              // this.dtOptionsa = {
              //   data: gdata.data,
              //   columns: this._displayColumns,
              // language: {
              //   search: 'Search across all columns:',
              //   searchPlaceholder: 'Type in for Filter...',
              //   info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
              // },
              // bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
              // paging: false, //Dont want paging
              // bPaginate: false, //Dont want paging
              // scrollY: '300px',
              // scrollCollapse: true,
              // destroy: true,
              // serverSide: false,
              // processing: true,
              // bandGrade: 'NA',
              // scrollX: true,
              // scroller: true,
              // dom: 'Bfrtip',
              // buttons: ['print', 'excelHtml5'],
              // };
              // this.dtElement.dtInstance && this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

              //   dtInstance.ajax.reload(null, false);

              // });
              // if (gdata.data) {
              //   this.dtOptions = {
              //     data: gdata.data,
              // language: {
              //   search: 'Search across all columns:',
              //   searchPlaceholder: 'Type in for Filter...',
              //   info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
              // },
              // bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
              // paging: false, //Dont want paging
              // bPaginate: false, //Dont want paging
              // scrollY: '300px',
              // scrollCollapse: true,
              // destroy: true,
              // serverSide: false,
              // processing: true,
              // bandGrade: 'NA',
              // scrollX: true,
              // scroller: true,
              // columns: this._gridColumns,
              // dom: 'Bfrtip',
              // buttons: ['print', 'excelHtml5'],
              //   };
              //   this.persons = data.data;
              //   this.dtElement.dtOptions.data = gdata.data;
              //   this._gridData = data;
              //   this.cdr.detectChanges();
              //   // this.dtTrigger.next();
              // }

              // let a = this._displayColumns.map((x) => {
              //   delete x.title;
              //   return x;
              // });
              // this.dtOptions.columns = a;
              // this.persons = data.data;
              // this.dtTrigger.next();
              this.loader = false;
            });
        } else if (data.graphId == 2) {
          this._gridParams = data;
          this.dash
            .getTargetVsActualWorkDaysReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  serverSide: false,
                  processing: false,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
                this.persons = data.data;
                this._gridData = data;
                this.rerender();
              }
            });
        } else if (data.graphId == 7) {
          this._gridParams = data;

          this.dash
            .getPenalizationMetricsReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  serverSide: false,
                  processing: false,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
                this.persons = data.data;
                this._gridData = data;
                this.rerender();
              }
            });
        } else if (data.graphId == 1) {
          this._gridParams = data;
          this.dash
            .getDailyAttendanceReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridData = gdata;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 6) {
          this._gridParams = data;
          this.dash
            .getEmpWorkedOnWeekendReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });

          // this.showTable = true;
        } else if (data.graphId == 8) {
          this._gridParams = data;
          this.dash
            .getEarlyLogoutMetricsReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 10) {
          this._gridParams = data;
          this.dash
            .getLateLogintMetricsReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 11) {
          this._gridParams = data;
          this.dash
            .getWeeklyOverTimeReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphname == 'Summary of Work Hours') {
          this._gridParams = data;
          this.dash
            .getSummaryOfWorkHoursReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 13) {
          this._gridParams = data;
          this.dash
            .getAvgOTHoursByAgeReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 14) {
          this._gridParams = data;
          this.dash
            .getTotalDeviationMinutesReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        } else if (data.graphId == 15) {
          this._gridParams = data;
          this.dash
            .getPenalizationInstancesReport(this._gridParams)
            .subscribe((data: any) => {
              const gdata: any = data;
              this._gridColumns = this.oth.setColumns(gdata);
              this._displayColumns = this.oth.getDisplayName(gdata);
              if (gdata.data) {
                this.dtOptions = {
                  data: gdata.data,
                  language: {
                    search: 'Search across all columns:',
                    searchPlaceholder: 'Type in for Filter...',
                    info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
                  },
                  bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
                  paging: false, //Dont want paging
                  bPaginate: false, //Dont want paging
                  scrollY: '300px',
                  scrollCollapse: true,
                  destroy: true,
                  serverSide: false,
                  processing: true,
                  bandGrade: 'NA',
                  scrollX: true,
                  scroller: true,
                  columns: this._gridColumns,
                  dom: 'Bfrtip',
                  buttons: ['print', 'excelHtml5'],
                };
              }
              this.persons = data.data;
              this._gridData = data;
              this.rerender();
            });
        }
      }
    });
    //
  }
  ngAfterViewInit(): void {
    // this.dtTrigger.next();
    // console.log(this.dtElement);
  }
  rerender(): void {
    // setTimeout(() => {
    //   this.dtElement &&
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   //       dtInstance.clear().draw(); // Add this  line to clear all rows..
    //   dtInstance.destroy();
    //   this.dtTrigger.next();
    // });
    // }, 500);

    this.loader = false;
    // this.cdr.detectChanges();
    // this.dtTrigger.next();
  }

  setColumns(gdata?: any) {
    const newColumns = [];
    if (gdata && gdata.data.length) {
      Object.entries(gdata.data[0]).forEach(([key, value]) => {
        newColumns.push({ data: key });
      });
    }
    this.columnName = newColumns;
    return newColumns;
  }

  convertToWord(str: any) {
    return str
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  }
  submitbtn(btn?: any) {
    btn == 'excel' &&
      this.elem.nativeElement.querySelector('.buttons-excel').click();
    btn == 'Print' &&
      this.elem.nativeElement.querySelector('.buttons-print').click();
  }
}
