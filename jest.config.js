export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Для JS/JSX файлов
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'mjs'], // Расширения модулей
  // Для игнорирования node_modules или их обработки
  transformIgnorePatterns: [
    'node_modules/(?!(your-esm-package|another-esm-package)/)' // Если есть пакеты, требующие трансформации
  ],
  // Включите поддержку ESM
  globals: {
    // Для Jest 28+ нужно явно указать
    'ts-jest': {
      useESM: true,
    },
  },
};