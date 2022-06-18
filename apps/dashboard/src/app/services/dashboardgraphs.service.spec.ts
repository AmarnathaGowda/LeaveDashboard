import { TestBed } from '@angular/core/testing';

import { DashboardgraphsService } from './dashboardgraphs.service';

describe('DashboardgraphsService', () => {
  let service: DashboardgraphsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardgraphsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
