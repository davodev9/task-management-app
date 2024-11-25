import { StateService } from './state.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('StateService', () => {
  let service: StateService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new StateService(httpClientSpy as any);
  });

  it('should return an array of states', (done) => {
    const mockStates = [
      { name: 'new', id: 'cbb8' },
      { name: 'active', id: 'c410' },
    ];

    httpClientSpy.get.and.returnValue(of(mockStates));
    service.getStates().subscribe((result) => {
      expect(result).toEqual(mockStates);
      done();
    });
  });
});
