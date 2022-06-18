import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import { ApiserviceService } from './shared/apiservice.service';
import{ChartData} from './shared/dashboardconfig'

@Injectable({
  providedIn: 'root',
})
export class DashboardgraphsService {
   //default language
  private empUID:BehaviorSubject<string> = new BehaviorSubject<string>('');
  private graphId:BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private api: ApiserviceService,private http: HttpClient) {}

  public getEmpid(){
    return this.empUID.asObservable();
  }

  public updateEmpid(empid){
    this.empUID.next(empid);
  }
  public getgraphId(){
    return this.graphId.asObservable();
  }

  public updateGraphId(graphuid){
    this.graphId.next(graphuid);
  }


  getSummaryOfWorkHours(data?:any) {
    return this.api.postData(AppConstants.getSummaryOfWorkHours,data);
  }
  getSummaryOfWorkHoursReport(data?:any) {
    return this.api.postData(AppConstants.getSummaryOfWorkHoursReport,data);
  }
 
  getDailyAttendanceStatus(data:any) {
    return this.api.postData(AppConstants.getDailyAttendanceStatus,data);
  }
  getDailyAttendance(data?:any) {
    return this.api.postData(AppConstants.getDailyAttendance,data);
  }
  getDailyAttendanceReport(data?:any) {
    return this.api.postData(AppConstants.getDailyAttendanceReport,data);
  }
  getLateLogin(data?:any) {
    return this.api.postData(AppConstants.getLateLogin,data);
  }
  getLateLoginReport(data?:any) {
    return this.api.postData(AppConstants.getLateLoginReport,data);
  }
  getearlyLogout(data?:any) {
    return this.api.postData(AppConstants.getEarlyLogout,data);
  }
  getearlyLogoutReport(data?:any) {
    return this.api.postData(AppConstants.getEarlyLogoutReport,data);
  }
  getEmpWorkedOnWeekend(data?:any) {
    return this.api.postData(AppConstants.getEmpWorkedOnWeekend,data);
  }
  getEmpWorkedOnWeekendReport(data?:any) {
    return this.api.postData(AppConstants.getEmpWorkedOnWeekendReport,data);
  }

  getOvertimeDetails(data?:any) {
    return this.api.postData(AppConstants.getOvertimeDetails,data);
  }
  getOvertimeDetailsReport(data?:any) {
    return this.api.postData(AppConstants.postGetOvertimeReport,data);
  }
  getAvgOTHoursByAge(data?:any) {
    return this.api.postData(AppConstants.getAvgOTHoursByAge,data);
  }
  getAvgOTHoursByAgeReport(data?:any) {
    return this.api.postData(AppConstants.getAvgOTHoursByAgeReport,data);
  }
  getAvgHoursPerEmp() {
    return this.api.getData(AppConstants.getAvgHoursPerEmp);
  }
  getTotalHoursWorked() {
    return this.api.getData(AppConstants.getTotalHoursWorked);
  }
  getLateLoginHours() {
    return this.api.getData(AppConstants.getLateLoginHours);
  }
  getEarlyLogoutHours() {
    return this.api.getData(AppConstants.getEarlyLogoutHours);
  }
  getTotalDeviationMinutes(data?:any) {
    return this.api.postData(AppConstants.getTotalDeviationMinutes,data);
  }
  getTotalDeviationMinutesReport(data?:any) {
    return this.api.postData(AppConstants.getTotalDeviationMinutesReport,data);
  }
  getPenalizationMetrics(data?:any) {
    return this.api.postData(AppConstants.getPenalizationMetrics,data);
  }
  getPenalizationMetricsReport(data?:any) {
    return this.api.postData(AppConstants.getPenalizationMetricsReport,data);
  }
  getEarlyLogoutMetrics(data?:any) {
    return this.api.postData(AppConstants.getEarlyLogoutMetrics,data);
  }
  getEarlyLogoutMetricsReport(data?:any) {
    return this.api.postData(AppConstants.getEarlyLogoutMetricsReport,data);
  }
  getLateLogintMetrics(data?:any) {
    return this.api.postData(AppConstants.getLateLogintMetrics,data);
  }
  getLateLogintMetricsReport(data?:any) {
    return this.api.postData(AppConstants.getLateLogintMetricsReport,data);
  }
  getPenalizationInstances(data?:any) {
    return this.api.postData(AppConstants.getPenalizationInstances,data);
  }
  getPenalizationInstancesReport(data?:any) {
    return this.api.postData(AppConstants.getPenalizationInstancesReport,data);
  }
  getweeklyOvertime(data?:any) {
    return this.api.postData(AppConstants.getWeeklyOvertime,data);
  }
  getWeeklyOverTimeReport(data?:any) {
    return this.api.postData(AppConstants.getWeeklyOvertimeReport,data);
  }
  getTargetVsActualWorkDays(data?:any) {
    return this.api.postData(AppConstants.getTargetVsActualWorkDays,data);
  }
  getTargetVsActualWorkDaysReport(data?:any) {
    return this.api.postData(AppConstants.getTargetVsActualWorkDaysReport,data);
  }

  postSaveFilters(data?: any) {
    return this.api.postData(AppConstants.postSaveFilters, data);
  }

  getDashboardConfigData(data?:any){
    return this.http.get(AppConstants.apiUrl +AppConstants.getAllDashboardGraphs+ '/'+ data);  
  }

  // test(){
  //   return ChartData;
  // }
 
  postDashboardConfigData(data?: any) {
    return this.http.post(AppConstants.apiUrl + AppConstants.saveGraphConfigurations, data);
  }
}
