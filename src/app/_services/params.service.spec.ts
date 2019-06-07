import { TestBed, inject } from '@angular/core/testing';

import { ParamsService } from './params.service';

describe('ParamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamsService]
    });
  });

  it('should be created', inject([ParamsService], (service: ParamsService) => {
    expect(service).toBeTruthy();
  }));
});
