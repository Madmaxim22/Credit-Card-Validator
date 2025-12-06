import CreditCardValidator from '../components/CreditCardValidator.js';
import { validateCardNumber } from '../services/cardValidator.js';
import { detectCardType } from '../services/cardTypeDetector.js';

// Мокаем модули и ресурсы
jest.mock('../services/cardValidator', () => ({ validateCardNumber: jest.fn(), }));

jest.mock('../services/cardTypeDetector', () => ({ detectCardType: jest.fn(), }));

// Моки изображений
jest.mock('../assets/visa.png', () => 'visa.png');
jest.mock('../assets/mastercard.png', () => 'mastercard.png');
jest.mock('../assets/amex.png', () => 'amex.png');
jest.mock('../assets/mir.png', () => 'mir.png');
jest.mock('../assets/discover.png', () => 'discover.png');

describe('CreditCardValidator', () => {
  let validator;
  let container;

  beforeEach(() => {
    // Создаём DOM-структуру
    document.body.innerHTML = `
      <div id="card-widget">
        <div id="card-type" class="card-logos-container"></div>
        <div>
          <input 
            type="text"
            id="card-number"
            placeholder="Введите номер карты"
            maxlength="19"
          />
          <button id="validateCardBtn">Проверить карту</button>
          <div id="message"></div>
      </div>
    </div>
    `;

    jest.useFakeTimers(); // Включаем фейковые таймеры

    validator = new CreditCardValidator();
    container = document.body;
  });

  test('renderCardLogos создает логотипы карт', () => {
    const logos = container.querySelectorAll('.card-logo');
    expect(logos.length).toBe(Object.keys(validator.cardLogos).length);
    Object.keys(validator.cardLogos).forEach(type => {
      const logo = container.querySelector(`.card-logo[data-type="${type}"]`);
      expect(logo).not.toBeNull();
      expect(logo.src).toContain(validator.cardLogos[type]);
    });
  });

  // Проверка handleInput с помощью jest.each
  describe('handleInput добавляет активный логотип при вводе', () => {
    const testCases = [
      [
        '4111', 'visa'
      ],
      [
        '5500', 'mastercard'
      ],
      [
        '3400', 'amex'
      ],
      [
        '2200', 'mir'
      ],
      [
        '6011', 'discover'
      ],
    ];

    test.each(testCases)('при вводе "%s" определяет логотип "%s" как активный', (inputValue, expectedType) => {
      detectCardType.mockReturnValue(expectedType);

      const input = document.getElementById('card-number');

      // Перед вводом убедимся, что все логотипы неактивны
      document.querySelectorAll('.card-logo').forEach(logo => logo.classList.remove('active'));

      input.value = inputValue;
      input.dispatchEvent(new Event('input'));

      // Продвигаем таймер
      jest.advanceTimersByTime(300);

      // Проверяем, что логотип ожидаемого типа активен
      const activeLogo = document.querySelector(`.card-logo.active[data-type="${expectedType}"]`);
      expect(activeLogo).not.toBeNull();

      // Проверяем, что остальные логотипы неактивны
      document.querySelectorAll('.card-logo').forEach(logo => {
        if (logo.dataset.type !== expectedType) {
          expect(logo.classList.contains('active')).toBe(false);
        }
      });
    });
  });

  describe('validate method', () => {
    const testCases = [
      [
        true, 'Карта валидна ✅', 'green'
      ],
      [
        false, 'Неверный номер карты ❌', 'red'
      ],
    ];

    test.each(testCases)('должно показать сообщение "%s" при validateCardNumber возвращает %s',
      (isValid, expectedText, expectedColor) => {
        validateCardNumber.mockReturnValue(isValid);

        const messageDiv = document.getElementById('message');
        const input = document.getElementById('card-number');

        input.value = 'some card number';

        // Вызов validate
        document.getElementById('validateCardBtn').click();

        expect(validateCardNumber).toHaveBeenCalledWith('some card number');
        expect(messageDiv.textContent).toBe(expectedText);
        expect(messageDiv.style.color).toBe(expectedColor);
      });
  });

  test('validate показывает ошибку для неправильного номера', () => {
    validateCardNumber.mockReturnValue(false);

    const messageDiv = document.getElementById('message');
    const input = document.getElementById('card-number');

    input.value = '1234';

    // Вызов validate
    const btn = document.getElementById('validateCardBtn');
    btn.click();

    expect(validateCardNumber).toHaveBeenCalledWith('1234');
    expect(messageDiv.textContent).toBe('Неверный номер карты ❌');
    expect(messageDiv.style.color).toBe('red');
  });

  test('validate показывает сообщение, если поле пустое', () => {
    const messageDiv = document.getElementById('message');
    const input = document.getElementById('card-number');

    input.value = '';

    // Вызов validate
    const btn = document.getElementById('validateCardBtn');
    btn.click();

    expect(messageDiv.textContent).toBe('Введите номер карты');
    expect(messageDiv.style.color).toBe('orange');
  });
});
