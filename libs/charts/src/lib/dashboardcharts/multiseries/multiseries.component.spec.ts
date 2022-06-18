import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiseriesComponent } from './multiseries.component';

describe('MultiseriesComponent', () => {
  let component: MultiseriesComponent;
  let fixture: ComponentFixture<MultiseriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiseriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
