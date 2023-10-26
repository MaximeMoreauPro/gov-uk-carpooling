import { DateProvider } from '@/application/providers/DateProvider';

export class StubDateProvider implements DateProvider {
  private now!: string;

  getNow(): string {
    return this.now;
  }

  setNow(datetime: string) {
    this.now = datetime;
  }
}
