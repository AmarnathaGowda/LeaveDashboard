import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdonutchartComponent } from './newdonutchart.component';

describe('NewdonutchartComponent', () => {
  let component: NewdonutchartComponent;
  let fixture: ComponentFixture<NewdonutchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewdonutchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdonutchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
