import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyovertimeComponent } from './weeklyovertime.component';

describe('WeeklyovertimeComponent', () => {
  let component: WeeklyovertimeComponent;
  let fixture: ComponentFixture<WeeklyovertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyovertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyovertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
