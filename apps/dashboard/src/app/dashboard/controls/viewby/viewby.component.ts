import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dashboard-ui-viewby',
  templateUrl: './viewby.component.html',
  styleUrls: ['./viewby.component.scss'],
})
export class ViewbyComponent implements OnInit {
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
    this._menuData = data;
  }
  get data() {
    return this._menuData;
  }
  @Output()
  public selectedView = new EventEmitter<string>();
  selectedOptions: any[] =[];
  constructor() {}

  ngOnInit(): void {}
  setSelected(option?: any) {
    this.selectedOptions = [];
    this.selectedOptions.push(option);
    const x = 'd' + this._graphDetails.sortOrder;
    const filterDetails = this._graphDetails[x]?.viewBy;
    this._graphDetails.optionSelected = {
      filterId: filterDetails.filterId,
      name: filterDetails.name,
      selectedValue: this.selectedOptions,
    };

    this.selectedView.emit(this._graphDetails);
  }
}
