import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportcompComponent } from './reportcomp.component';

describe('ReportcompComponent', () => {
  let component: ReportcompComponent;
  let fixture: ComponentFixture<ReportcompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportcompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
