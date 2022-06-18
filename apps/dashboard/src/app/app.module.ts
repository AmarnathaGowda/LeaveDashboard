import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { ChartsModule } from '../../../../libs/charts/src/lib/charts.module';
import { SharedModule } from '../../../../libs/shared/src/lib/shared.module';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GridreportsComponent } from './reports/gridreports/gridreports.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitorInterceptor } from './monitor.interceptor';
import { FiltersComponent } from './reports/filter/filters/filters.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ClonereportComponent } from './reports/filter/clonereport/clonereport.component';
import { DashboardcontrolsComponent } from './dashboardcontrols/dashboardcontrols.component';
import { ViewbyComponent } from './dashboard/controls/viewby/viewby.component';
import { SwitchgraphsComponent } from './dashboard/controls/switchgraphs/switchgraphs.component';
import { ChartZoomComponent } from './dashboard/controls/chart-zoom/chart-zoom.component';
import { LoaderComponent } from './dashboard/loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { ReportcompComponent } from './reports/reportcomp/reportcomp.component';
import { LeaveDashboardComponent } from './leave-dashboard/leave-dashboard.component';


export const routes: Route[] = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboardconfig', component: DashboardcontrolsComponent },
  { path: 'leavedashboard' , component: LeaveDashboardComponent},
  { path: 'filters/:name', component: FiltersComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
@NgModule({
  declarations: [
    AppComponent,
      DashboardComponent,
    GridreportsComponent,
    FiltersComponent,
    LoaderComponent,
    ClonereportComponent,
    DashboardcontrolsComponent,
    ViewbyComponent,
    SwitchgraphsComponent,
    ChartZoomComponent,
    ReportcompComponent,
    LeaveDashboardComponent,

  ],
  imports: [
    BrowserModule,
    DragDropModule,
    BrowserAnimationsModule,
    ChartsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MonitorInterceptor,
      multi: true,
    },
   
  ],
  bootstrap: [AppComponent],
  exports: [ DashboardComponent, GridreportsComponent, DashboardcontrolsComponent,LeaveDashboardComponent],
})
export class AppModule {}
