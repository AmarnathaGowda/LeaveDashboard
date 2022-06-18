import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinebarchartComponent } from './linebarchart.component';

describe('LinebarchartComponent', () => {
  let component: LinebarchartComponent;
  let fixture: ComponentFixture<LinebarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinebarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinebarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
