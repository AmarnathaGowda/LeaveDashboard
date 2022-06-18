import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ApiserviceService } from '../services/shared/apiservice.service';
import { DashboardgraphsService } from '../services/dashboardgraphs.service';
import { ToastrService } from 'ngx-toastr';
import { NotifyToastService } from '../services/notify-toast.service';

@Component({
  selector: 'dashboard-ui-dashboardcontrols',
  templateUrl: './dashboardcontrols.component.html',
  styleUrls: ['./dashboardcontrols.component.scss'],
})
export class DashboardcontrolsComponent implements OnInit {
  apiData: any;
  resetData: any;
  chartData: any;
  nonDragChartData: any;
  dragChartData: any;
  updatedchartdata: any;
  getAllDashboardGraphs;
  empid: string;
  isDisabled = false;
  @ViewChildren('configcheckbox') configcheckbox: QueryList<ElementRef>;
  constructor(
    private apiservice: ApiserviceService,
    private dgservice: DashboardgraphsService,
    private toast: NotifyToastService
  ) {}

  //chartData= this.apiData.data
  ngOnInit(): void {
    this.dgservice.updateEmpid('9F7844FC-1422-4663-BF46-F882CD13A38C');
    this.dgservice.getEmpid().subscribe((data) => {
      this.empid = data;
      console.log(this.empid);
    });
    this.getAllDashboardGraphsDetails();
  }

  onDrop(event: CdkDragDrop<any[]>) {
    // console.log(event)
    if (event.previousContainer === event.container) {
      var list = event.container.data;
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      list.forEach((data, idx) => {
        data.sortOrder = idx + 5;
      });
    }
  }


  getAllDashboardGraphsDetails() {
    this.dgservice.getDashboardConfigData(this.empid).subscribe((response) => {
      this.apiData = response[0].data;
      //const test = this.apiData;    
      this.chartData = [...this.apiData].map((ele) =>
        Object.assign(ele, { tempid: ele.sortOrder }, { editable: false })
      );
      for (var i = 0; i < 4; i++) {
        this.chartData[i]['disabled'] = true;
      }
      this.nonDragChartData = this.chartData.filter((x) => x.disabled == true);
      //console.log(this.nonDragChartData)
      this.dragChartData = this.chartData.filter((x) => x.disabled !== true);
      //console.log(this.dragChartData)
    });
  }

  getRowDetails(data, i) {
    // console.log(data, i);
  }

  hideStatus(event, data) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    //  console.log(isChecked, data.isHidden);
    if (isChecked === true) {
      data.isHidden = true;
      // console.log(data);
      //data.isHidden = isChecked
    } else {
      // console.log("i am checked",isChecked)
      data.isHidden = false;
      //  console.log(data);
    }
  }

  deleteStatus(event, data) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    isChecked === true ? (data.isDeleted = true) : (data.isDeleted = false);
    // console.log(data.isDeleted,data);
  }

  addToSlideShow(event, data) {

    const isChecked = (<HTMLInputElement>event.target).checked;
    isChecked === true ? (data.isSlideShow = true) : (data.isSlideShow = false);
    data.isSlideShow === true
      ? (data.isSlideShow = true)
      : (data.isSlideShow = false);
  
    
  }

  editData(data: any) {
    data.editable = !data.editable;
  }

  updateDashboard(nonDragChartData, dragChartData) {
    dragChartData.map((x) => {
      if (x.displayName === '') {
        x.displayName = null;
      }
      return x;
    });
    console.log(dragChartData);
    this.updatedchartdata = nonDragChartData.concat(dragChartData);
    //  console.log(updatedchartdata)
    const dashboardgraphs = Object.assign(
      {},
      { DashboardModuleId: 1, EmpUID: this.empid, Data: this.updatedchartdata }
    );
    this.dgservice
      .postDashboardConfigData(dashboardgraphs)
      .subscribe((response) => {
        console.log(response);
        this.toast.showSuccess('Updated Succesfully');
      });
  }

  restChanges() {}

  cancelChanges() {
    this.getAllDashboardGraphsDetails();
     
    // console.log(this.apiData)
    // this.dragChartData.forEach((element,index,array) => {
    //   const backupele = this.apiData.find(data=>data.parentGraphID ==element.parentGraphID)

    //   console.log(this.dragChartData[index].isHidden,backupele.isHidden)
    //   this.dragChartData[index].isHidden =backupele.isHidden
    //   this.dragChartData[index].isSlideShow = backupele.isSlideShow

    // //  console.log(backupele,this.dragChartData)
    // })
    //console.log(this.nonDragChartData)
    this.dragChartData = this.chartData.filter((x) => x.disabled !== true);
    //console.log(this.dragChartData)

    this.dragChartData.forEach((data) => {
      data.sortOrder = data.tempid;
    });
    this.dragChartData.sort((a, b) => a.tempid - b.tempid);

    // this.dragChartData = this.apiData;
    this.toast.showSuccess('Resetted Succesfully');
    //  console.log(this.dragChartData)
  }
}
