import { RealDateProvider } from './DateProvider.real';

describe('Real DateProvider', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
  });

  it('should return the current datetime', () => {
    const now = new RealDateProvider().getNow();
    expect(now).toBe('2023-01-01T00:00:00.000Z');
  });
});
