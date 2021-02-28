import { TestBed } from '@angular/core/testing';

import { MinMaxService } from './min-max.service';

describe('MinMaxService', () => {
  let service: MinMaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinMaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
