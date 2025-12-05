import { validateCardNumber } from '../services/cardValidator';

describe('validateCardNumber', () => {
  test('валидный номер Visa (16 цифр)', () => {
    expect(validateCardNumber('4111111111111111')).toBe(true);
  });

  test('валидный номер MasterCard (16 цифр)', () => {
    expect(validateCardNumber('5555555555554444')).toBe(true);
  });

  test('валидный номер Amex (15 цифр)', () => {
    expect(validateCardNumber('378282246310005')).toBe(true);
  });

  test('невалидный номер (ошибка в одной цифре)', () => {
    expect(validateCardNumber('4111111111111112')).toBe(false);
  });

  test('слишком короткий номер (12 цифр)', () => {
    expect(validateCardNumber('123456789012')).toBe(false);
  });

  test('слишком длинный номер (20 цифр)', () => {
    expect(validateCardNumber('12345678901234567890')).toBe(false);
  });

  test('номер с пробелами и дефисами (валидный)', () => {
    expect(validateCardNumber('4111-1111 1111-1111')).toBe(true);
  });

  test('пустая строка', () => {
    expect(validateCardNumber('')).toBe(false);
  });

  test('нечисловые символы без цифр', () => {
    expect(validateCardNumber('abcd')).toBe(false);
  });

  test('номер с буквами и цифрами (некорректный)', () => {
    expect(validateCardNumber('4111a11111111111')).toBe(false);
  });
});
