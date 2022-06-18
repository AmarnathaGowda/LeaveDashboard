import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConstants } from '../../constants/app.constants';
import {ChartData} from './dashboardconfig'
@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  public responseCache = new Map();
  maxAge = 30000;
  cache = new Map();

  constructor(private http: HttpClient) {}

  postData(url, data) {
    return this.http.post(AppConstants.apiUrl +url, data);
  }

  getData(url, data?: any): Observable<any> {
   
    const checkData=data ? '?'+data:''; 
     return this.http.get(AppConstants.apiUrl +url+ checkData);
    // const checkIfExists = this.responseCache.get(AppConstants.apiUrl + url+checkData);
    // if (checkIfExists) {
    //   return of(checkIfExists);
    // }
    // const response = this.http.get<any>(AppConstants.apiUrl + url+checkData);
    // response.subscribe((data) =>
    //   this.responseCache.set(AppConstants.apiUrl + url, data)
    // );
    // return response;
  }
  getBodyData(url, data?: any): Observable<any> {
    // return this.http.get(AppConstants.apiUrl +url, data);
    const checkData=data ? '?'+data:'';
    const checkIfExists = this.responseCache.get(AppConstants.apiUrl + url+checkData);
    if (checkIfExists) {
      return of(checkIfExists);
    }
    const response = this.http.get<any>(AppConstants.apiUrl + url+checkData);
    response.subscribe((data) =>
      this.responseCache.set(AppConstants.apiUrl + url, data)
    );
    return response;
  }

  // getData(url, data?: any): HttpResponse<any> | undefined {
  //   // const url = req.urlWithParams;
  //   const cached = this.cache.get(url);

  //   if (!cached) {
  //     return undefined;
  //   }

  //   const isExpired = cached.lastRead < Date.now() - this.maxAge;
  //   const expired = isExpired ? 'expired ' : '';
  //   return cached.response;
  // }

  
}
