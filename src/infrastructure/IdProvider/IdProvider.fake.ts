import { IdProvider } from '@/application/providers/IdProvider';

export class FakeIdProvider implements IdProvider {
  private index = 0;
  private fakeIds = [
    'ef60b242-9825-45df-82a1-caa53f25afaa',
    '3b331bde-90af-480e-bed6-d28cbc003df6',
    'cd7c26bd-da08-463a-b25c-29b8810f55aa',
    'eacdadcd-858c-47b4-b5b7-f5374993bc93',
  ];

  getId(): string {
    return this.fakeIds[this.index++];
  }

  /** used for testing */
  getIdByIndex(index: number): string {
    return this.fakeIds[index];
  }
}
