import { TestBed } from '@angular/core/testing';

import { SupabaseManager } from './SupabaseManager';

describe('Supabase', () => {
  let service: SupabaseManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
