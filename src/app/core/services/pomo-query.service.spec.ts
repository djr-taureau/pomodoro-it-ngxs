import { TestBed, inject } from '@angular/core/testing';

import { PomoQueryService } from './pomo-query.service';

describe('PomoQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PomoQueryService]
    });
  });

  it('should be created', inject([PomoQueryService], (service: PomoQueryService) => {
    expect(service).toBeTruthy();
  }));
});
