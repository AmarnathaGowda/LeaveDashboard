import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClonereportComponent } from './clonereport.component';

describe('ClonereportComponent', () => {
  let component: ClonereportComponent;
  let fixture: ComponentFixture<ClonereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClonereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClonereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
