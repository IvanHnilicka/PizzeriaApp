import { TestBed } from '@angular/core/testing';

import { PizzeriaAPIService } from './pizzeria-api.service';

describe('PizzeriaAPIService', () => {
  let service: PizzeriaAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzeriaAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
