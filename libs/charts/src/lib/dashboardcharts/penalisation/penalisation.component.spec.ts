import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalisationComponent } from './penalisation.component';

describe('PenalisationComponent', () => {
  let component: PenalisationComponent;
  let fixture: ComponentFixture<PenalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenalisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
