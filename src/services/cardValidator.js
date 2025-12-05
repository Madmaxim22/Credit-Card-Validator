/*
  Проверка валидности номера карты выполняется по алгоритму Луна:
*/

export const validateCardNumber = (number) => {
  const digits = number.replace(/\D/g, '').split('').map(Number);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};