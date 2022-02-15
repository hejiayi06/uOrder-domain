import { TestBed } from '@angular/core/testing';

import { ScheduleTimeService } from './schedule-time.service';

describe('ScheduleTimeService', () => {
  let service: ScheduleTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
