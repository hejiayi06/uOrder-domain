import { TestBed } from '@angular/core/testing';

import { PlacePredictionService } from './place-prediction.service';

describe('PlacePredictionService', () => {
  let service: PlacePredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacePredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
