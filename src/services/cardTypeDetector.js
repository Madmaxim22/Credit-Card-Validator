/*
Номер карты содержит закодированную информацию о платёжной системе. Основные идентификаторы:

Visa: начинается с 4, длина 13, 16 или 19 цифр
MasterCard: начинается с 51–55 (классический) или 2221–2720 (новый формат), длина 16 цифр
American Express: начинается с 34 или 37, длина 15 цифр
Discover: начинается с 6011, 622126–622925, 644–649 или 65, длина 16 цифр
«Мир»: начинается с 2200–2204, длина 16 цифр
JCB: начинается с 3528–3589, длина 16 цифр
*/

export const detectCardType = (number) => {
  const cleaned = number.replace(/\D/g, '');
  if (!cleaned) return 'unknown';

  const patterns = {
    visa: /^4/,
    mastercard: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/,
    amex: /^3[47]/,
    discover: /^(6011|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])|64[4-9]|65)/,
    mir: /^220[0-4]/,
  };

  for (const [
    type, regex
  ] of Object.entries(patterns)) {
    if (regex.test(cleaned)) return type;
  }

  return 'unknown';
};