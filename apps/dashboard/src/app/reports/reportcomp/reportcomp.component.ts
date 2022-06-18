import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ReportService } from '../../services/othours/report.service';

@Component({
  selector: 'dashboard-ui-reportcomp',
  templateUrl: './reportcomp.component.html',
  styleUrls: ['./reportcomp.component.scss'],
})
export class ReportcompComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;
  dtOptions: any = {};
  dtInstance: Promise<DataTables.Api>;
  dtTrigger: Subject<any> = new Subject();
  _gridData: any;
  _displayColumns: any;
  button: any;
  @Input()
  set gridData(value: any) {
    this._gridData = value;
  }
  get gridData() {
    return this._gridData;
  }

  ngOnInit(): void {
    this.generateData(this._gridData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gridData && changes.gridData.currentValue) {
      const gdata = changes.gridData.currentValue;
      this.updateData(gdata);
    }
  }

  generateData(gdata?: any) {
    this._displayColumns = this.oth.getDisplayName(gdata);

    this.dtOptions = {
      data: gdata.data,
      columns: this._displayColumns,
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
      paging: false, //Dont want paging
      scrollY: '300px',
      serverSide: false,

      dom: 'Bfrtip',
      buttons: ['print', 'excelHtml5'],
      extend: 'print',
      title: gdata.graphName + ' Report',
    };
  }

  updateData(gdata?: any) {
    // destroy you current configuration
    this._displayColumns = this.oth.getDisplayName(gdata);
    this.dtRendered = false;
    this.dtOptions = {
      data: gdata.data,
      columns: this._displayColumns,
      pagingType: 'full_numbers',
      pageLength: 10,
      scrollCollapse: true,
      processing: true,
      destroy: false,
      language: {
        search: 'Search across all columns:',
        searchPlaceholder: 'Type in for Filter...',
        info: '<span class="tr_count">Total Records: _TOTAL_ </span>',
        emptyTable: 'No data',
      },
      paging: false, //Dont want paging
      scrollY: '300px',
      scrollX: true,
      scroller: true,
      serverSide: false,
      dom: 'Bfrtip',
      bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
      bPaginate: false, //Dont want paging
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, 'All'],
      ],
      buttons: ['print', 'excelHtml5', 'pdf'],
      extend: 'print',
      title: gdata.graphName + ' Report',
    };
    // make sure your template notices it
    this.cdr.detectChanges();
    // initialize them again
    this.dtRendered = true;
    this.cdr.detectChanges();
  }

  reRenderDataTable(): void {
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    //  dtInstance.destroy();
    // Call the dtTrigger to rerender again
    //  this.dtTrigger.next();
    // });
  }
  submitbtn(btn?: any) {
    btn == 'excel' &&
      this.elem.nativeElement.querySelector('.buttons-excel').click();
    btn == 'Print' &&
      this.elem.nativeElement.querySelector('.buttons-print').click();
  }

  constructor(
    public cdr: ChangeDetectorRef,
    private oth: ReportService,
    private elem: ElementRef
  ) {}
}
