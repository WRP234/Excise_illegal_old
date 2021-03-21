import { TestBed } from '@angular/core/testing';

import { UserListService } from './list.service';

describe('SelectDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserListService = TestBed.get(UserListService);
    expect(service).toBeTruthy();
  });
});
