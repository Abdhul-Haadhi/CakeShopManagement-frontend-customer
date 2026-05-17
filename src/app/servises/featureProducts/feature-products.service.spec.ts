import { TestBed } from '@angular/core/testing';

import { FeatureProductsService } from './feature-products.service';

describe('FeatureProductsService', () => {
  let service: FeatureProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
