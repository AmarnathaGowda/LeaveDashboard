import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardgraphsService } from '../../../services/dashboardgraphs.service';
import { NotifyToastService } from '../../../services/notify-toast.service';
import { ReportService } from '../../../services/othours/report.service';
@Component({
  selector: 'dashboard-ui-clonereport',
  templateUrl: './clonereport.component.html',
  styleUrls: ['./clonereport.component.scss'],
})
export class ClonereportComponent implements OnInit {
  serialNuber: number[] = [
     5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  data:any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public mdata: any,
    private dialogRef: MatDialogRef<ClonereportComponent>,
    private rep: ReportService,
    private toast : NotifyToastService
  ) {
    this.serialNuber.push(this.serialNuber.length + 1);
  }

  ngOnInit(): void {
    this.data= this.mdata;
    this.data.ngraphName = this.mdata.graphName;
    console.log(this.data);
  }

  submitBtn() {
    const postData = {
      DashboardModuleId: 1,

      GraphId: this.data.graphId,

      GraphName: this.data.ngraphName,

      SerialNumber: this.data.serialNumber,

      EmpUID: this.data.EmpUID,
    };
    this.rep.postSaveCloneReport(postData).subscribe((data) => {
      this.toast.showSuccess('Graph Cloned Succesfully');
      console.log(data);
      this.dialogRef.close();
    });
  }
}
