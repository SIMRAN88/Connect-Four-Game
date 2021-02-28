import { TestBed } from '@angular/core/testing';

import { ConnectFourService } from './connect-four.service';

describe('ConnectFourService', () => {
  let service: ConnectFourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectFourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
