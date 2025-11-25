import { TestBed } from '@angular/core/testing';

import { ThemeToggler } from './theme-toggler';

describe('Theme', () => {
  let service: ThemeToggler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeToggler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
