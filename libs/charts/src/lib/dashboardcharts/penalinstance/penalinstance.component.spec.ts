import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalinstanceComponent } from './penalinstance.component';

describe('PenalinstanceComponent', () => {
  let component: PenalinstanceComponent;
  let fixture: ComponentFixture<PenalinstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenalinstanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenalinstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
