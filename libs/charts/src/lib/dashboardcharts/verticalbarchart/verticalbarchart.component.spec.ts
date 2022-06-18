import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalbarchartComponent } from './verticalbarchart.component';

describe('VerticalbarchartComponent', () => {
  let component: VerticalbarchartComponent;
  let fixture: ComponentFixture<VerticalbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
