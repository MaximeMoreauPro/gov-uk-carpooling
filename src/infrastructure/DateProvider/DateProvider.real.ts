import { DateProvider } from '@/application/providers/DateProvider';

export class RealDateProvider implements DateProvider {
  getNow(): string {
    return new Date().toISOString();
  }
}
