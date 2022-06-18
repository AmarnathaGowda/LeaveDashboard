import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-ui-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.scss']
})
export class DaterangepickerComponent implements OnInit {
  date= [{begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25)}]
  constructor() { }

  ngOnInit(): void {
  }

}
