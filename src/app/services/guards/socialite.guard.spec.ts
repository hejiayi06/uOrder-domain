import { TestBed } from '@angular/core/testing';

import { SocialiteGuard } from './socialite.guard';

describe('SocialiteGuard', () => {
  let guard: SocialiteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SocialiteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
