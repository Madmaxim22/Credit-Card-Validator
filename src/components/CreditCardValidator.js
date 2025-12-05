import { validateCardNumber } from '../services/cardValidator';
import { detectCardType } from '../services/cardTypeDetector';
import visaImagePath from '../assets/visa.png';
import masterCardImagePath from '../assets/mastercard.png';
import amexImagePath from '../assets/amex.png';
import mirImagePath from '../assets/mir.png';
import discoverImagePath from '../assets/discover.png';

export default class CreditCardValidator {
  constructor() {
    this.cardInput = document.getElementById('card-number');
    this.cardTypeContainer = document.getElementById('card-type');
    this.validateCardBtn = document.getElementById('validateCardBtn');
    this.message = document.getElementById('message');
    this.timeout = null;

    this.cardLogos = {
      visa: visaImagePath,
      mastercard: masterCardImagePath,
      amex: amexImagePath,
      mir: mirImagePath,
      discover: discoverImagePath,
    };

    this.setupEventListeners();
    this.renderCardLogos();
  }

  renderCardLogos() {
    Object.entries(this.cardLogos).forEach(([
      type, src
    ]) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = type;
      img.className = 'card-logo';
      img.dataset.type = type;
      this.cardTypeContainer.appendChild(img);
    });
  }

  setupEventListeners() {
    this.cardInput.addEventListener('input', (e) => {
      this.handleInput(e);
    });

    this.validateCardBtn.addEventListener('click', () => {
      this.validate();
    });
  }

  handleInput(e) {
    clearTimeout(this.timeout);

    // Сбрасываем активные логотипы
    document.querySelectorAll('.card-logo.active').forEach(el => {
      el.classList.remove('active');
    });

    const number = e.target.value.trim();
    if (!number) return;

    this.timeout = setTimeout(() => {
      const cardType = detectCardType(number);
      if (cardType !== 'unknown') {
        const logo = document.querySelector(`.card-logo[data-type="${cardType}"]`);
        if (logo) logo.classList.add('active');
      }
    }, 300);
  }

  validate() {
    const number = this.cardInput.value.trim();

    if (!number) {
      this.message.textContent = 'Введите номер карты';
      this.message.style.color = 'orange';
      return;
    }

    const isValid = validateCardNumber(number);
    if (isValid) {
      this.message.textContent = 'Карта валидна ✅';
      this.message.style.color = 'green';
    } else {
      this.message.textContent = 'Неверный номер карты ❌';
      this.message.style.color = 'red';
    }
  }
}