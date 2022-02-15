import { TestBed } from '@angular/core/testing';

import { ItemGuard } from './item.guard';

describe('ItemGuard', () => {
  let guard: ItemGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ItemGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
