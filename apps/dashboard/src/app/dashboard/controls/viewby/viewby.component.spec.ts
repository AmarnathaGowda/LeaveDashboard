import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbyComponent } from './viewby.component';

describe('ViewbyComponent', () => {
  let component: ViewbyComponent;
  let fixture: ComponentFixture<ViewbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
