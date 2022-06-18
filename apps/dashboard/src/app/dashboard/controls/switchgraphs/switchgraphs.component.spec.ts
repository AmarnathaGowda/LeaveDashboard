import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchgraphsComponent } from './switchgraphs.component';

describe('SwitchgraphsComponent', () => {
  let component: SwitchgraphsComponent;
  let fixture: ComponentFixture<SwitchgraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchgraphsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchgraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
