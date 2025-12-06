import puppeteer from 'puppeteer';
import config from '../../puppeteer.config';

describe('Card validation E2E tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(config.launchOptions);
    page = await browser.newPage();
    await page.goto('http://localhost:5000'); // Ваш локальный сервер
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Валидный номер карты — показывает успех', async () => {
    // Ввод валидного номера
    await page.type('#card-number', '4111111111111111');

    // Клик по кнопке проверки
    await page.click('#validateCardBtn');

    // Ожидание сообщения
    const message = await page.waitForSelector('#message', { timeout: 5000, });

    const text = await message.evaluate(el => el.textContent);
    expect(text).toContain('Карта валидна');
  });

  test('Невалидный номер карты — показывает ошибку', async () => {
    // Очищаем поле
    await page.$eval('#card-number', el => el.value = '');

    // Ввод невалидного номера
    await page.type('#card-number', '1234567890123456');

    // Клик по кнопке проверки
    await page.click('#validateCardBtn');

    // Ожидание сообщения об ошибке
    const error = await page.waitForSelector('#message', { timeout: 5000, });

    const text = await error.evaluate(el => el.textContent);
    expect(text).toContain('Неверный номер карты');
  });
});
