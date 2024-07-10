import { TestBed } from '@angular/core/testing';

import { AngularFrameworkService } from './angular-framework.service';

describe('AngularFrameworkService', () => {
  let service: AngularFrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularFrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
