import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dashboard-ui-switchgraphs',
  templateUrl: './switchgraphs.component.html',
  styleUrls: ['./switchgraphs.component.scss'],
})
export class SwitchgraphsComponent implements OnInit {
  _graphDetails: any;
  _menuData: any;
  options: any;
  @Input()
  set graphDetails(data: any) {
    this._graphDetails = data;
  }
  get graphDetails() {
    return this._graphDetails;
  }
  @Input()
  set data(data: any) {
    this._menuData = data.split(',');
  }
  get data() {
    return this._menuData;
  }
  @Output()
  public selectedView = new EventEmitter<string>();
  selectedOptions: any[] = [];
  constructor() {}
 
  ngOnInit(): void {
    //console.log(this._menuData);
  }
  setSelected(option?: any) {
    
    const x = 'd' + this._graphDetails.sortOrder;
    this._graphDetails[x].graph.type = option;
    this.selectedView.emit(this._graphDetails);
  }
}
