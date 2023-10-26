import { version, validate } from 'uuid';

import { IdProvider } from '@/application/providers/IdProvider';

import { UUIDv4IdProvider } from './IdProvider.uuidv4';
import { FakeIdProvider } from './IdProvider.fake';

describe('IdProvider', () => {
  runIdProviderTests('UUIDv4IdProvider', () => new UUIDv4IdProvider());
  runIdProviderTests('FakeIdProvider', () => new FakeIdProvider());
});

function runIdProviderTests(
  idProviderName: 'UUIDv4IdProvider' | 'FakeIdProvider',
  idProviderFactory: () => IdProvider
) {
  describe(idProviderName, () => {
    let idProvider: IdProvider;

    beforeEach(() => {
      idProvider = idProviderFactory();
    });

    it('should generate a valid UUID v4', () => {
      expect(isValidUUIDv4(idProvider.getId())).toBe(true);
      expect(isValidUUIDv4(idProvider.getId())).toBe(true);
      expect(isValidUUIDv4(idProvider.getId())).toBe(true);
      expect(isValidUUIDv4(idProvider.getId())).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      expect(
        containesDuplicatedValues([
          idProvider.getId(),
          idProvider.getId(),
          idProvider.getId(),
          idProvider.getId(),
        ])
      ).toBe(false);
    });

    if (idProviderName === 'FakeIdProvider') {
      it('should generate fake UUIDs accessible through their index', () => {
        expect(idProvider.getId()).toBe(
          (idProvider as FakeIdProvider).getIdByIndex(0)
        );
        expect(idProvider.getId()).toBe(
          (idProvider as FakeIdProvider).getIdByIndex(1)
        );
        expect(idProvider.getId()).toBe(
          (idProvider as FakeIdProvider).getIdByIndex(2)
        );
        expect(idProvider.getId()).toBe(
          (idProvider as FakeIdProvider).getIdByIndex(3)
        );
      });
    }
  });
}

function isValidUUIDv4(uuid: string): boolean {
  return validate(uuid) && version(uuid) === 4;
}

function containesDuplicatedValues(stringValues: string[]) {
  return new Set(stringValues).size !== stringValues.length;
}
