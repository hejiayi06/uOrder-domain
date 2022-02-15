import { TestBed } from '@angular/core/testing';

import { ItemResolveService } from './item-resolve.service';

describe('ItemResolveService', () => {
  let service: ItemResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
