import CreditCardValidator from '../components/CreditCardValidator.js';

// Моки изображений
jest.mock('../assets/visa.png', () => 'visa.png');
jest.mock('../assets/mastercard.png', () => 'mastercard.png');
jest.mock('../assets/amex.png', () => 'amex.png');
jest.mock('../assets/mir.png', () => 'mir.png');
jest.mock('../assets/discover.png', () => 'discover.png');

describe('Полный функционал CreditCardValidator без моков', () => {
  let validator;

  beforeEach(() => {
    // Очистка DOM
    document.body.innerHTML = `
      <input id="card-number" />
      <div class="card-logos">
        <div class="card-logo" data-type="visa"></div>
        <div class="card-logo" data-type="mastercard"></div>
        <div class="card-logo" data-type="amex"></div>
        <div class="card-logo" data-type="mir"></div>
        <div class="card-logo" data-type="discover"></div>
      </div>
      <div id="card-type"></div>
      <button id="validateCardBtn"></button>
      <div id="message"></div>
    `;

    jest.useFakeTimers(); // Включаем фейковые таймеры

    // Создаем экземпляр валидатора
    validator = new CreditCardValidator();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Определение типа карты и активация логотипов', () => {
    const testCases = [
      [
        '4111111111111111', 'visa'
      ],
      [
        '5500000000000004', 'mastercard'
      ],
      [
        '340000000000009', 'amex'
      ],
      [
        '2203929632569951', 'mir'
      ],
      [
        '6011000000000004', 'discover'
      ],
      [
        '4111111111111', 'visa'
      ], // короткий номер Visa (валидный по длине)
      [
        '2223000048400011', 'mastercard'
      ], // новая серия MasterCard
      [
        '378282246310005', 'amex'
      ], // Amex с другой длиной
      [
        '30569309025904', null
      ], // Diners Club (не распознается)
      [
        '3566002020360505', null
      ], // JCB, не распознается
      [
        '1234567890123456', null
      ], // неизвестный номер
    ];

    test.each(testCases)(
      'при вводе "%s" ожидается тип "%s"',
      (number, expectedType) => {
        const input = document.getElementById('card-number');

        // Перед вводом убираем активность логотипов
        document.querySelectorAll('.card-logo').forEach(logo => logo.classList.remove('active'));

        input.value = number;
        input.dispatchEvent(new Event('input'));

        // Продвигаем таймер, чтобы debounce сработал
        jest.advanceTimersByTime(300);

        if (expectedType) {
          const activeLogo = document.querySelector(`.card-logo.active[data-type="${expectedType}"]`);
          expect(activeLogo).not.toBeNull();
        } else {
          // Для неизвестных номеров логотипы не должны быть активны
          document.querySelectorAll('.card-logo').forEach(logo => {
            expect(logo.classList.contains('active')).toBe(false);
          });
        }
      }
    );
  });

  describe('Проверка validate()', () => {
    const testCases = [
      {
        number: '4111111111111111', expectedMessage: 'Карта валидна ✅', expectedColor: 'green'
      },
      {
        number: '1234', expectedMessage: 'Неверный номер карты ❌', expectedColor: 'red'
      },
      {
        number: '', expectedMessage: 'Введите номер карты', expectedColor: 'orange'
      },
    ];

    test.each(testCases)(
      'при вводе "%s" отображается сообщение "%s"',
      ({ number, expectedMessage, expectedColor }) => {
        const input = document.getElementById('card-number');
        const messageDiv = document.getElementById('message');
        const validateButton = document.getElementById('validateCardBtn');

        input.value = number;
        validateButton.click();

        expect(messageDiv.textContent).toBe(expectedMessage);
        expect(messageDiv.style.color).toBe(expectedColor);
      }
    );
  });
});