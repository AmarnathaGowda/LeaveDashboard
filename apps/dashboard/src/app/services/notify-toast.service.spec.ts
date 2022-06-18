import { TestBed } from '@angular/core/testing';

import { NotifyToastService } from './notify-toast.service';

describe('NotifyToastService', () => {
  let service: NotifyToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
