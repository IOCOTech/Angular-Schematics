import { TestBed } from '@angular/core/testing';

import { IocoFrameworkService } from './ioco-framework.service';

describe('IocoFrameworkService', () => {
  let service: IocoFrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IocoFrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
