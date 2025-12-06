const isCI = process.env.CI || process.env.APPVEYOR;

export default {
  launchOptions: {
    headless: true, // запуск без графического интерфейса
    args: [ // параметры запуска Chrome.
      '--no-sandbox', // отключает песочницу для безопасного запуска в CI
      '--disable-setuid-sandbox',
    ],
    ...(isCI && {
      executablePath: process.platform === 'win32' // путь к браузеру, если запуск происходит в CI окружении (например, на сервере).
        ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome',
    }),
  },
};
