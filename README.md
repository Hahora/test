# **Цифровой помощник конструктора**

_Интеллектуальная платформа для анализа PDF-документов на соответствие стандартам (ГОСТ, критерии 1.1.x). Разработана для хакатона AtomicHack 3 в НГТУ._

[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)](https://fastapi.tiangolo.com/) [![Vue.js](https://img.shields.io/badge/Vue.js-3-green?logo=vuedotjs)](https://vuejs.org/)

## 🌐 Сайт для тестирования

🔗 **Демо-версия доступна по ссылке:**  
👉 [https://m2-live.store](https://m2-live.store)

# **Цифровой помощник конструктора** — это веб-приложение для автоматизированной проверки технических чертежей и документов в формате PDF. Оно анализирует файлы на наличие нарушений по критериям (например, шифр документа, тип, размеры, надписи), генерирует отчеты с аннотациями и предоставляет удобный интерфейс для управления историей проверок.

## 🚀 **Ключевые возможности**

- 📤 **Загрузка PDF-файлов** и фоновый анализ.
- 🔍 **Автоматическое выявление нарушений** (error points) по конфигурируемым критериям (YAML).
- 📊 **Детальные отчеты**: количество нарушений, полные описания, аннотированные PDF.
- 📜 **История проверок** с фильтрами и поиском.
- 🔒 **Аутентификация пользователей** (логин/регистрация).
- ⬇️ **Скачивание** оригиналов и аннотированных файлов.
- 🎨 **Адаптивный интерфейс** с темным/светлым режимом.

Проект состоит из **backend** (FastAPI) для API и анализа, и **frontend** (Vue.js) для пользовательского интерфейса.

## 🛠️ **Технологии**

### **Backend**

- **Framework**: FastAPI (для API).
- **База данных**: SQLAlchemy с SQLite (можно расширить до PostgreSQL).
- **Анализ PDF**: PyMuPDF (fitz) для извлечения текста и аннотаций.
- **Аутентификация**: JWT-токены (python-jose).
- **Дополнительно**: YAML-конфиг для критериев анализа, Rich для логирования.

### **Frontend**

- **Framework**: Vue.js 3 с Composition API.
- **Роутинг**: Vue Router.
- **Состояние**: Pinia.
- **Иконки**: Lucide-Vue-Next.
- **Стили**: Tailwind CSS (предполагается по классам в компонентах).
- **API**: Fetch с обработкой ошибок.

## 📂 **Структура Проекта**

```plaintext
hahora-test/
├── README.md                # Этот файл
├── backend/                 # Серверная часть
│   ├── README.md
│   ├── app.py               # Основное приложение FastAPI
│   ├── main.py              # Запуск uvicorn
│   ├── requirements.txt     # Зависимости (pip install -r)
│   ├── routers/             # Роутеры API (auth, upload, history, result, download)
│   └── scripts/             # Бизнес-логика
│       ├── crud.py          # CRUD-операции с БД
│       ├── db.py            # Подключение к БД
│       ├── models.py        # Модели SQLAlchemy (User, Document)
│       ├── parse_report.py  # Парсинг отчетов
│       └── analysis/        # Модули анализа PDF
│           ├── config.yaml  # Конфиг критериев (regex, font sizes и т.д.)
│           ├── criterion_*.py  # Критерии проверки (1.1.1, 1.1.2_n и т.д.)
│           └── main.py      # Основной скрипт анализа
└── frontend/                # Клиентская часть
    ├── README.md
    ├── package.json         # Зависимости (npm install)
    ├── vite.config.ts       # Конфиг Vite
    ├── src/                 # Исходники Vue
    │   ├── App.vue          # Главный компонент
    │   ├── main.ts          # Entry point
    │   ├── components/      # Компоненты (FileUpload, CheckResults и т.д.)
    │   ├── pages/           # Страницы (Home, History, Result, Login)
    │   ├── router/          # Роутинг
    │   ├── services/        # API-клиент
    │   └── stores/          # Pinia stores (auth)
    └── public/              # Статические файлы (логотипы)
```

## 🚀 **Установка и Запуск**

### **Предварительные требования**

- **Python** 3.12+ (для backend).
- **Node.js** 18+ (для frontend).
- **Git** для клонирования репозитория.

### **Шаги**

1. **Клонируйте репозиторий**:

   ```bash
   git clone https://github.com/your-username/hahora-test.git
   cd hahora-test
   ```

2. **Backend**:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # или venv\Scripts\activate на Windows
   pip install -r requirements.txt
   python main.py  # Запуск на http://0.0.0.0:8234
   ```

3. **Frontend**:

   ```bash
   cd ../frontend
   npm install
   npm run dev  # Запуск на http://localhost:5173 (Vite)
   ```

4. **Конфигурация**:

   - Создайте `.env` в **backend** с:
     ```plaintext
     SECRET_KEY=your_secret
     DATABASE_URL=sqlite:///./test.db
     ```
   - В **frontend** создайте `.env.production` с:
     ```plaintext
     VITE_API_BASE_URL=http://localhost:8234
     ```

5. **Доступ**:
   - Откройте `http://localhost:5173` в браузере.
   - Зарегистрируйтесь (`/reg`) или войдите (`/login`).

## 📖 **Использование**

1. **Регистрация/Логин**: Создайте аккаунт для доступа.
2. **Загрузка файла**: На главной странице загрузите PDF — анализ запустится автоматически.
3. **История**: Просмотрите все проверки с суммарными нарушениями.
4. **Результат**: Детальный отчет с ошибками, скачивание аннотированного PDF.
5. **Анализ**: Критерии настраиваются в `backend/scripts/analysis/config.yaml` (regex для кодов, шрифты и т.д.).

**Пример отчета**:

```markdown
[#1] Критерий 1.1.1: Несоответствие шифра и типа документа
Пункты: 1.1.1

- (1) Шифр 'ABC.123.456ВО' не соответствует типу 'Ведомость эксплуатационных документов'.
```
