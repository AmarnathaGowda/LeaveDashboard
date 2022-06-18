import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedverticalbarchartComponent } from './groupedverticalbarchart.component';

describe('GroupedverticalbarchartComponent', () => {
  let component: GroupedverticalbarchartComponent;
  let fixture: ComponentFixture<GroupedverticalbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedverticalbarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedverticalbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
