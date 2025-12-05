import { detectCardType } from '../services/cardTypeDetector';

describe('detectCardType', () => {
  test('Visa (начинается на 4)', () => {
    expect(detectCardType('4111111111111111')).toBe('visa');
  });

  test('MasterCard (51–55)', () => {
    expect(detectCardType('5555555555554444')).toBe('mastercard');
  });

  test('MasterCard (2221–2720)', () => {
    expect(detectCardType('2221111111111111')).toBe('mastercard');
    expect(detectCardType('2720111111111111')).toBe('mastercard');
  });

  test('American Express (34, 37)', () => {
    expect(detectCardType('341111111111111')).toBe('amex');
    expect(detectCardType('371111111111111')).toBe('amex');
  });

  test('Discover (6011, 622..., 644–649, 65)', () => {
    expect(detectCardType('6011111111111117')).toBe('discover');
    expect(detectCardType('6221261111111111')).toBe('discover');
    expect(detectCardType('6441111111111111')).toBe('discover');
    expect(detectCardType('6511111111111111')).toBe('discover');
  });

  test('Мир (2200–2204)', () => {
    expect(detectCardType('2200111111111111')).toBe('mir');
    expect(detectCardType('2204111111111111')).toBe('mir');
  });

  test('неизвестный тип (начинается на 1)', () => {
    expect(detectCardType('1234567890123456')).toBe('unknown');
  });

  test('пустая строка', () => {
    expect(detectCardType('')).toBe('unknown');
  });

  test('нечисловые символы', () => {
    expect(detectCardType('abcd')).toBe('unknown');
  });

  test('номер с пробелами и дефисами', () => {
    expect(detectCardType('4111-1111 1111-1111')).toBe('visa');
    expect(detectCardType('37-8282-2463-10005')).toBe('amex');
  });
});
