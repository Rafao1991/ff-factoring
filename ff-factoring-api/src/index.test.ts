import { deepCheckHandler, healthCheckHandler } from '@/index';

describe('index', () => {
  it('should pass', () => {
    expect(healthCheckHandler).toBeTruthy();
    expect(deepCheckHandler).toBeTruthy();
  });
});
