import { TestBed } from '@angular/core/testing';

import { TranslationManager } from './translation-manager';

describe('Translation', () => {
  let service: TranslationManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
