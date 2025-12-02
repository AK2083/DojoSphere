import { TestBed } from '@angular/core/testing';
import { LoggerManager } from '@core/service/logger/logger-manager';

describe('Logger', () => {
  let service: LoggerManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
