import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be generateRandomString', () => {
    const result = service.generateRandomString();
    expect(result.length).toBe(4);
    expect(result[0]).toMatch(/[a-z]/);
    expect(result[2]).toMatch(/[a-z]/);
    expect(result[1]).toMatch(/[0-9]/);
    expect(result[3]).toMatch(/[0-9]/);
  });
});
