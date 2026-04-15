# GenPass - Генератор паролей

SPA-приложение для генерации криптографически стойких паролей в браузере.  
Пароли создаются только на клиенте через `crypto.getRandomValues` и не отправляются в сеть.

## Возможности

- Настройка длины пароля (4-128)
- Выбор наборов символов: `A-Z`, `a-z`, `0-9`, спецсимволы
- Исключение похожих символов (`0, O, o, 1, l, I`) и ручное исключение символов
- Генерация сразу нескольких паролей (`1 / 5 / 10 / 20`)
- Копирование одного пароля или всех паролей
- Индикатор надежности + расчет энтропии
- Сохранение настроек в `localStorage`
- Светлая/темная тема
- Базовая офлайн-поддержка через Service Worker

## Стек

- Vue 3 + TypeScript
- Vite
- Pinia
- Tailwind CSS
- Vitest + Vue Test Utils

## Локальный запуск

```bash
cd /home/vladislav/pet_projects/genpass
npm install
npm run dev
```

Открой `http://localhost:5173`.

## Скрипты

- `npm run dev` - запуск dev-сервера
- `npm run test` - запуск тестов
- `npm run build` - production-сборка
- `npm run preview` - просмотр production-сборки локально
- `npm run check:bundle` - проверка лимита gzip-бандла (< 50 KB)
- `npm run verify` - полный прогон тестов + сборки + размера бандла

## Структура проекта

- `src/components` - UI-компоненты
- `src/composables` - логика генерации, strength, clipboard
- `src/stores` - Pinia store с настройками
- `src/constants` - наборы символов
- `src/types` - TypeScript-типы
- `public` - статические файлы (`manifest.json`, `.htaccess`, `favicon`)
- `nginx/password-gen.conf` - минимальный конфиг Nginx для VPS
- `tests` - unit и component тесты

## Деплой

### Shared-hosting (Apache/Beget)

1. Выполнить сборку: `npm run build`
2. Загрузить содержимое папки `dist/` в корень сайта (`public_html/`)
3. Для SPA fallback использовать `public/.htaccess`

### VPS (Nginx)

Использовать конфиг из `nginx/password-gen.conf` (root на `dist/`, `try_files` для SPA).

## Нефункциональные требования (статус)

| Требование | Статус | Как подтверждается |
| --- | --- | --- |
| Производительность: 20x128 < 10 мс | Реализовано | `tests/performance.test.ts` |
| Безопасность: только Web Crypto | Реализовано | `src/composables/useGenerator.ts` |
| Приватность: без передачи паролей | Реализовано | Клиентское SPA без API и analytics |
| Адаптивность: от 320px | Реализовано | Адаптивные классы Tailwind в компонентах |
| Браузеры: современные (Chrome/Firefox/Safari/Edge) | Частично | Используются совместимые Web APIs, ручной кросс-браузерный прогон нужен |
| Доступность: ARIA/клавиатура/WCAG AA | Частично | Добавлены ARIA-атрибуты и hotkeys, полный WCAG-аудит не автоматизирован |
| Размер бандла gzip < 50 КБ | Реализовано | `npm run check:bundle` |
| Офлайн после первой загрузки | Реализовано | `public/sw.js` (cache + activate + navigate fallback) |

## Раздел 6. Требования к интерфейсу

| Пункт | Статус | Примечание |
| --- | --- | --- |
| 6.1 Структура страницы | Реализовано | Header + ThemeToggle, блок результата, настройки, количество, генерация, список, footer с GitHub/privacy |
| 6.2 UX-требования | Реализовано | Синхронизация слайдера и числа, блокировка отключения последнего набора, tooltip энтропии, hotkeys Enter/Space/Ctrl+C |
| 6.3 Мобильный UI | Реализовано | Контролы высотой 44px (`h-11`), крупные copy-кнопки, моноширинное поле и горизонтальный скролл |
