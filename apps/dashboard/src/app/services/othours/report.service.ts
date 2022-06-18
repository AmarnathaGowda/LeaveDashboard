import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConstants } from '../../constants/app.constants';
import { ApiserviceService } from '../shared/apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  gridObs$: BehaviorSubject<any> = new BehaviorSubject(null);
  gridParams$: BehaviorSubject<any> = new BehaviorSubject(null);
  columnName: any[];
  constructor(private api: ApiserviceService) {}
  getGridData(): Observable<any> {
    return this.gridObs$.asObservable();
  }

  setgridData(data) {
    this.gridObs$.next(data);
  }

  getGridParams(): Observable<any> {
    return this.gridParams$.asObservable();
  }

  setGridParams(data) {
    this.gridParams$.next(data);
  }

  getFilterDropdowns(data?: any) {
    return this.api.getData(AppConstants.getFilterDropdowns, data);
  }
  postSaveFilters(data?: any) {
    return this.api.postData(AppConstants.postSaveFilters, data);
  }
  getReportData(data?: any) {
    return this.api.getData(AppConstants.postSaveFilters, data);
  }

  postSaveCloneReport(data?: any) {
    return this.api.postData(AppConstants.postSaveCloneReport, data);
  }
  postGetOvertimeReport(data?: any) {
    return this.api.postData(AppConstants.postGetOvertimeReport, data);
  }
  postDailyAttendanceStatusReport(data?: any) {
    return this.api.postData(
      AppConstants.postDailyAttendanceStatusReport,
      data
    );
  }

  getDisplayName(gdata?: any) {
    let newColumns;
    // let value = [];
    if (gdata.columns && gdata.columns.length) {
      newColumns =gdata.columns.map((x) => {
        return   {
          title: x.value,
          data: x.key,
        }
        // key.push(x.key), value.push(x.value);
      });
    }
    return newColumns;
  }
  

  setColumns(gdata?: any) {
    const newColumns = [];
    // if (gdata && gdata.data.length) {
    //   Object.entries(gdata.data[0]).forEach(([key, value]) => {
    //     newColumns.push({ data: key });
    //   });

    if (gdata && gdata.columns.length) {
      gdata.columns.map((x) => {
        newColumns.push({ data: this.capitalize(x.key.replace(/( |-)/g, '')) });
      });
      // Object.entries(gdata.data[0]).forEach(([key, value]) => {
      //   newColumns.push({ data: key });
      // });
    }
    this.columnName = newColumns;
    return newColumns;
  }
  capitalize(str) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join(' ');
  }
}
