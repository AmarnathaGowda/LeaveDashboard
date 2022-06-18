import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
const noop = () => {};
@Component({
  selector: 'dashboard-ui-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectComponent),
      multi: true,
    },
  ],
})
export class MultiselectComponent implements OnInit {
  _dropdownSettings: IDropdownSettings = {};
  _dropdownList: any = {};
  selectedItems: any;
  @Input()
  set dropdownSettings(value: IDropdownSettings) {
    this._dropdownSettings = value;
  }
  get dropdownSettings() {
    return this._dropdownSettings;
  }
  @Input() set dropdownList(value: any) {
    this._dropdownList = value;
  }
  get dropdownList() {
    return this._dropdownList;
  }
  @Input() set selectedData(value: any) {
    this.selectedItems = value;
  }
  get selectedData() {
    return this.selectedItems;
  }
  // selectedItems: { item_id: number; item_text: string }[] = [];

  private innerValue: any = '';
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  
  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    // if(v.length === this._dropdownList.length){
    //   v =[];
    // }
    // if(this.selectedItems === null){
    //   v = this._dropdownList;
    // } 


    if (v !== this.innerValue) {
      this.innerValue = v;
      // const valueToOutput =
      //   this.innerValue !== '' &&
      //   (this.innerValue ?? [])
      //     .map((innerValueObj: { name: any }) => innerValueObj.name)
      //     .join(',');
      this.onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this._dropdownSettings = this.dropdownSettings;
    // this._dropdownSettings.limitSelection = 15;
    // this._dropdownSettings.enableCheckAll = false;
    this.value =this.selectedItems;
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {
    console.log(items);
  }
}
