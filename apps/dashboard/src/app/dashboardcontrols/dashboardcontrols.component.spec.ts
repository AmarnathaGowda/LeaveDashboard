import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardcontrolsComponent } from './dashboardcontrols.component';

describe('DashboardcontrolsComponent', () => {
  let component: DashboardcontrolsComponent;
  let fixture: ComponentFixture<DashboardcontrolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardcontrolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardcontrolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
