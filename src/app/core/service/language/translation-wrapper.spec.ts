import { TestBed } from '@angular/core/testing';

import { TranslationWrapper } from './translation-wrapper';

describe('Language', () => {
  let service: TranslationWrapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationWrapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
