import { TestBed } from '@angular/core/testing';

import { DomainGuard } from './domain.guard';

describe('DomainGuard', () => {
  let guard: DomainGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DomainGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
