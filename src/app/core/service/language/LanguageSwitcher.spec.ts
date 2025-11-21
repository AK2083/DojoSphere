import { TestBed } from '@angular/core/testing';

import { LanguageSwitcher } from './LanguageSwitcher';

describe('Language', () => {
  let service: LanguageSwitcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageSwitcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
