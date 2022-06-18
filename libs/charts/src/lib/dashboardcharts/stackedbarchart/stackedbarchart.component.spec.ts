import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarchartComponent } from './stackedbarchart.component';

describe('StackedbarchartComponent', () => {
  let component: StackedbarchartComponent;
  let fixture: ComponentFixture<StackedbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackedbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
