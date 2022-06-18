import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridreportsComponent } from './gridreports.component';

describe('GridreportsComponent', () => {
  let component: GridreportsComponent;
  let fixture: ComponentFixture<GridreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
