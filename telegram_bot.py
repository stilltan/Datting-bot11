import asyncio
import logging
import json
import os
import re
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import (
    ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove,
    WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
)

# ============================================
# КОНФИГУРАЦИЯ
# ============================================
TOKEN = "8275532228:AAEl1fIdWl6kZT-_AbP9gixYrdRYmJrBdTU"
WEB_APP_URL = "https://dist-delta-rosy-31.vercel.app"
SUPER_ADMIN_ID = 7627878199
SUPER_ADMIN_USERNAME = "Cursdworld"

# ============================================
# СИСТЕМА АДМИНИСТРАТОРОВ
# ============================================
ADMINS_FILE = "admins.json"

def load_admins():
    """Загружает список администраторов из файла."""
    if os.path.exists(ADMINS_FILE):
        with open(ADMINS_FILE, 'r') as f:
            try:
                data = json.load(f)
                admins = set(data)
                admins.add(SUPER_ADMIN_ID)  # Супер-админ всегда в списке
                return admins
            except Exception:
                pass
    return {SUPER_ADMIN_ID}

def save_admins(admins_set):
    """Сохраняет список администраторов в файл."""
    with open(ADMINS_FILE, 'w') as f:
        json.dump(list(admins_set), f)

ADMINS = load_admins()

# ============================================
# ИНИЦИАЛИЗАЦИЯ БОТА
# ============================================
bot = Bot(token=TOKEN)
dp = Dispatcher()

# ============================================
# СПИСОК ВОПРОСОВ АНКЕТЫ
# ============================================
QUESTIONS = [
    {"id": "source", "text": "🔍 Где / от кого вы узнали о нас?"},
    {
        "id": "goal",
        "text": "🎯 Цель заполнения анкеты:",
        "options": [
            "В кадровый резерв невест (цена 2490 руб. в год)",
            "Захожу в индивидуальный формат работы",
            "Хочу принять участие в отборе на мужчину",
            "Другое"
        ]
    },
    {
        "id": "age18",
        "text": "🔞 Вам уже есть 18 лет?\n(Мы работаем только с совершеннолетними)",
        "options": ["Да ✅", "Нет ❌"]
    },
    {
        "id": "gender",
        "text": "👤 Ваш пол:",
        "options": ["Женщина", "Мужчина"]
    },
    {
        "id": "photos",
        "text": (
            "📸 Приложите ваши фото (3-7 шт)\n\n"
            "Важно:\n"
            "• Хорошее качество\n"
            "• Обязательно портретное фото\n"
            "• Фото в полный рост\n\n"
            "Отправляйте фото по одному или группой.\n"
            "Когда закончите — нажмите кнопку «✅ Готово»"
        ),
        "type": "photo"
    },
    {"id": "socials", "text": "🔗 Укажите ссылку на 1-2 ваших соцсети\n(Instagram, VK, Facebook, TikTok и т.д.)"},
    {"id": "name", "text": "👤 Как вас зовут?\n(Фамилия, Имя, Отчество)"},
    {"id": "contacts", "text": "📱 Укажите контакты (Telegram @username или номер, WhatsApp, Email)"},
    {"id": "timezone", "text": "🕐 Ваш часовой пояс и удобное время для связи\n(Пример: UTC+3 Москва, с 10:00 до 20:00)"},
    {"id": "dob", "text": "🎂 Дата рождения\n(Формат: ДД.ММ.ГГГГ, например: 15.03.1990)"},
    {"id": "location", "text": "📍 Где вы сейчас живёте?\n(город и страна)"},
    {"id": "citizenship", "text": "🛂 Какое у вас гражданство?"},
    {"id": "height", "text": "📏 Ваш рост (см)\n(Введите число, например: 165)"},
    {"id": "weight", "text": "⚖️ Ваш вес (кг)\n(Введите число, например: 55)"},
    {
        "id": "describes_you",
        "text": "✨ Что лучше всего описывает вас? (выберите 1–3 пункта)",
        "options": [
            "Строю карьеру в большом городе",
            "Мама после развода",
            "Экспатка (жила / живу за границей)",
            "Закончила долгие отношения/брак",
            "Живу в небольшом городе / селе",
            "Занимаюсь серьёзно бизнесом",
            "Цифровой кочевник",
            "Тяжёлый опыт в прошлых отношениях",
            "Онлайн-роман с иностранцем",
            "Хочу / планирую эмиграцию",
            "Важны традиционные ценности",
            "Другое"
        ]
    },
    {"id": "goals_1y", "text": "🎯 Каковы ваши главные цели на горизонте 1 года?"},
    {
        "id": "marital_status",
        "text": "💑 Какой у вас семейный статус?",
        "options": ["Никогда не была замужем", "В разводе", "В отношениях, но без брака", "Официально замужем", "Вдова", "Другое"]
    },
    {"id": "marriages_count", "text": "💒 Сколько раз вы были замужем и сколько лет длился брак?"},
    {"id": "last_relationship", "text": "💔 Кратко о последних серьёзных отношениях\n(когда закончились, сколько длились, почему расстались)"},
    {"id": "repeating_patterns", "text": "🔄 3 ошибки из прошлых отношений, которые не хотите повторять"},
    {"id": "what_prevented", "text": "🚧 Что мешало прийти к желаемым отношениям?"},
    {"id": "want_to_change", "text": "🔧 Что в своём поведении хотели бы изменить?"},
    {
        "id": "children",
        "text": "👶 Есть ли у вас дети?",
        "options": ["Да, есть дети", "Нет детей"]
    },
    {"id": "children_details", "text": "👶 Сколько детей и их возраст?"},
    {
        "id": "want_more_children",
        "text": "👶 Хотите ли ещё детей?",
        "options": ["Точно Да", "Точно Нет", "Пока не решила", "Другое"]
    },
    {"id": "man_with_children", "text": "👨‍👧 Рассматриваете партнёра с детьми? При каких условиях?"},
    {"id": "occupation", "text": "💼 Чем вы занимаетесь? (профессия)"},
    {
        "id": "role",
        "text": "👩‍💼 В какой роли вы сейчас?",
        "options": ["Владелица бизнеса / партнёр", "Руководитель / топ-менеджер", "Наёмный специалист", "Фриланс", "В декрете", "В поиске работы", "Другое"]
    },
    {
        "id": "income",
        "text": "💰 Как оцениваете свой уровень дохода?",
        "options": ["Закрываю базовые расходы", "Стабильный, средний", "Высокий доход, активы", "Другое"]
    },
    {"id": "finance_unacceptable", "text": "🚫 Что в финансах пары категорически недопустимо?"},
    {
        "id": "ready_to_change_life",
        "text": "🔄 Готовность менять жизнь ради отношений\n(1 — не готова совсем, 10 — готова полностью)",
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    },
    {"id": "what_ready_to_change", "text": "📝 Что готовы менять, а что точно нет?"},
    {"id": "introvert_extrovert", "text": "🧠 Вы интроверт или экстраверт? Как это проявляется?"},
    {
        "id": "conflict_behavior",
        "text": "⚡ Как ведёте себя при конфликте?",
        "options": ["Замолкаю и ухожу", "Говорю прямо сразу", "Сначала обдумываю, потом говорю", "Другое"]
    },
    {"id": "3_words_friends", "text": "💬 3 слова, которыми вас описывают друзья"},
    {"id": "3_strengths", "text": "💪 3 ваши сильные стороны в отношениях"},
    {"id": "3_weaknesses", "text": "📉 3 ваши слабые стороны в отношениях"},
    {"id": "how_rest", "text": "🏖 Как обычно отдыхаете и восстанавливаете силы?"},
    {"id": "attitude_control", "text": "👀 Как относитесь к контролю и ревности в паре?"},
    {"id": "3_values", "text": "❤️ 3 обязательные ценности в отношениях"},
    {"id": "religion", "text": "🙏 Религиозные убеждения? Нужно ли, чтобы партнёр их разделял?"},
    {"id": "family_model", "text": "🏠 Комфортная модель семьи для вас"},
    {"id": "languages", "text": "🌍 Какими языками владеете и на каком уровне?"},
    {"id": "exp_foreigners", "text": "🌐 Был ли опыт отношений с иностранцами? Какой это был опыт?"},
    {"id": "countries_yes_no", "text": "🗺 В каких странах можете представить свою жизнь, а в каких точно нет?"},
    {
        "id": "most_important_partner",
        "text": "💎 Что важнее при выборе партнёра?",
        "options": ["Его гражданство", "Страна эмиграции", "Личные качества", "Материальный уровень партнёра", "Другое"]
    },
    {
        "id": "emigration_readiness",
        "text": "✈️ Готовность к эмиграции\n(1 — не готова, 10 — полностью готова)",
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    },
    {
        "id": "most_important_now",
        "text": "🎯 Что сейчас самое важное?",
        "options": ["Начать системный поиск", "Перезапустить личную жизнь", "Перевести онлайн-романы в реальные", "Другое"]
    },
    {"id": "picture_1_year", "text": "🔮 Представьте: прошёл год, всё отлично. С кем вы живёте, какие отношения?"},
    {"id": "fears_international", "text": "😰 Что вызывает наибольшие страхи в международных знакомствах?"},
    {"id": "doubts_oksana", "text": "🤔 Что вызывает сомнения в работе со мной?"},
    {"id": "confidence", "text": "💪 А что придаёт уверенность, что всё получится?"},
    {"id": "age_range", "text": "📅 Комфортный возраст партнёра\n(Пример: от 35 до 50)"},
    {"id": "appearance_req", "text": "👔 Есть ли требования к внешности? Рост, вес, другое?"},
    {"id": "min_living_standard", "text": "🏡 Минимальный уровень жизни партнёра, который вас устроит"},
    {"id": "unacceptable_character", "text": "🚫 С какой чертой характера точно не готовы мириться?"},
    {"id": "3_qualities_man", "text": "⭐ 3 важнейших качества в партнёре"},
    {"id": "red_flags", "text": "🚩 Какие поступки в начале отношений становятся «красными флагами»?"},
    {"id": "unacceptable_conditions", "text": "❌ Что неприемлемо ни при каких условиях?"},
    {"id": "abuse_experience", "text": "🛡 Был ли опыт насилия?\n(можно написать «не хочу отвечать»)"},
    {
        "id": "time_to_emigrate",
        "text": "⏰ Через какое время готовы эмигрировать?",
        "options": ["В течение года", "В течение 1–3 лет", "Другое"]
    },
    {"id": "holds_back", "text": "⚓ Что сейчас удерживает в стране?"},
    {"id": "reason_to_move", "text": "✈️ Главная причина переезда"},
    {"id": "anything_else", "text": "📝 Есть ли что-то важное, о чём я не спросила?"},
    {
        "id": "tg_channel",
        "text": "📣 Вы подписаны на канал @marry_international?",
        "options": ["Уже подписана ✅", "Обязательно подпишусь 👍"]
    },
    {
        "id": "consent",
        "text": "✅ Согласие на обработку персональных данных\n\nОзнакомиться: https://606.su/ojrq",
        "options": ["Я ознакомлена и даю согласие ✅"]
    },
]

INTRO_TEXT = (
    "💍 *ПРОФАЙЛ ДЛЯ ПОДБОРА ПАРТНЕРА*\n"
    "_Глубокая диагностика_\n\n"
    "Эта анкета нужна, чтобы я могла лучше понять вашу ситуацию "
    "и честно сказать, могу ли я вам помочь и в каком формате.\n\n"
    f"📌 Здесь {len(QUESTIONS)} вопросов. Заполнение займёт ~35–45 минут.\n"
    "✨ Пожалуйста, отвечайте честно — здесь нет «правильных» ответов.\n\n"
    "— Твоя Оксана Гартнер ❤️\n\n"
    "ТГ: @oksana\\_my\\_life\n"
    "WA / МАХ / IMO: +79037991521\n"
    "ТГ канал: @marry\\_international\n"
    "МАХ канал: http://6max.ru/oksana"
)

# ============================================
# СОСТОЯНИЯ FSM
# ============================================
class Form(StatesGroup):
    answering = State()
    uploading_photos = State()

# ============================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================
def get_keyboard_for_question(q):
    """Создаёт клавиатуру для вопроса."""
    if "options" in q:
        keyboard = []
        for opt in q["options"]:
            keyboard.append([KeyboardButton(text=opt)])
        return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)
    return ReplyKeyboardRemove()

def is_valid_social(text: str) -> bool:
    """Проверяет, похож ли текст на ссылку или соцсеть."""
    indicators = ['http', 'www', '.com', '.ru', 't.me', 'vk.com',
                  'instagram', 'facebook', 'tiktok', '@', 'inst', 'fb.com']
    text_lower = text.lower()
    return any(ind in text_lower for ind in indicators)

# ============================================
# КОМАНДА /start
# ============================================
@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()

    kb = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(
                text="📱 Открыть Mini App",
                web_app=WebAppInfo(url=WEB_APP_URL)
            )],
            [KeyboardButton(text="💬 Заполнить анкету в боте")]
        ],
        resize_keyboard=True
    )

    welcome = (
        "💍 *Добро пожаловать в I•Match!*\n\n"
        "Международный проект создания семей\n\n"
        "Выберите удобный способ заполнения анкеты:\n\n"
        "📱 *Mini App* — современный интерфейс\n"
        "💬 *В боте* — классический вариант в чате"
    )

    if message.from_user.id in ADMINS:
        welcome += "\n\n🔑 *Вы администратор.* Используйте /admin"

    await message.answer(welcome, reply_markup=kb, parse_mode="Markdown")

# ============================================
# КОМАНДА /restart
# ============================================
@dp.message(Command("restart"))
async def cmd_restart(message: types.Message, state: FSMContext):
    await state.clear()
    await cmd_start(message, state)

# ============================================
# КОМАНДА /admin
# ============================================
@dp.message(Command("admin"))
async def cmd_admin(message: types.Message):
    if message.from_user.id not in ADMINS:
        return

    admins_list = "\n".join([f"  • {aid}" for aid in sorted(ADMINS)])

    await message.answer(
        f"🛠 *Панель Администратора I•Match*\n\n"
        f"👥 Текущие администраторы:\n{admins_list}\n\n"
        f"📋 *Доступные команды:*\n"
        f"`/addadmin USER_ID` — добавить администратора\n"
        f"`/removeadmin USER_ID` — удалить администратора\n"
        f"`/admins` — список всех админов\n\n"
        f"🆔 Ваш ID: `{message.from_user.id}`",
        parse_mode="Markdown"
    )

# ============================================
# КОМАНДА /admins
# ============================================
@dp.message(Command("admins"))
async def cmd_admins(message: types.Message):
    if message.from_user.id not in ADMINS:
        return

    admins_list = "\n".join([
        f"  • `{aid}`{'  👑 Супер-админ' if aid == SUPER_ADMIN_ID else ''}"
        for aid in sorted(ADMINS)
    ])

    await message.answer(
        f"👥 *Список администраторов:*\n\n{admins_list}",
        parse_mode="Markdown"
    )

# ============================================
# КОМАНДА /addadmin
# ============================================
@dp.message(Command("addadmin"))
async def cmd_add_admin(message: types.Message):
    if message.from_user.id not in ADMINS:
        return

    parts = message.text.strip().split()
    if len(parts) < 2:
        await message.answer(
            "❌ Укажите ID пользователя.\n"
            "Формат: `/addadmin 123456789`",
            parse_mode="Markdown"
        )
        return

    try:
        new_id = int(parts[1])
    except ValueError:
        await message.answer(
            "❌ ID должен быть числом.\n"
            "Формат: `/addadmin 123456789`",
            parse_mode="Markdown"
        )
        return

    ADMINS.add(new_id)
    save_admins(ADMINS)
    await message.answer(
        f"✅ Пользователь `{new_id}` добавлен как администратор!",
        parse_mode="Markdown"
    )

# ============================================
# КОМАНДА /removeadmin
# ============================================
@dp.message(Command("removeadmin"))
async def cmd_remove_admin(message: types.Message):
    if message.from_user.id not in ADMINS:
        return

    parts = message.text.strip().split()
    if len(parts) < 2:
        await message.answer(
            "❌ Укажите ID пользователя.\n"
            "Формат: `/removeadmin 123456789`",
            parse_mode="Markdown"
        )
        return

    try:
        rem_id = int(parts[1])
    except ValueError:
        await message.answer("❌ ID должен быть числом.", parse_mode="Markdown")
        return

    if rem_id == SUPER_ADMIN_ID:
        await message.answer("❌ Нельзя удалить главного администратора!", parse_mode="Markdown")
        return

    if rem_id not in ADMINS:
        await message.answer(f"❌ Пользователь `{rem_id}` не является администратором.", parse_mode="Markdown")
        return

    ADMINS.discard(rem_id)
    save_admins(ADMINS)
    await message.answer(f"✅ Администратор `{rem_id}` удалён.", parse_mode="Markdown")

# ============================================
# КНОПКА — ЗАПОЛНИТЬ В БОТЕ
# ============================================
@dp.message(F.text == "💬 Заполнить анкету в боте")
async def start_bot_form(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(INTRO_TEXT, parse_mode="Markdown", reply_markup=ReplyKeyboardRemove())
    await asyncio.sleep(0.5)
    await state.update_data(current_index=0, answers={}, photo_ids=[])
    await ask_question(message, state)

# ============================================
# ЗАДАТЬ СЛЕДУЮЩИЙ ВОПРОС
# ============================================
async def ask_question(message: types.Message, state: FSMContext):
    data = await state.get_data()
    index = data.get("current_index", 0)

    if index >= len(QUESTIONS):
        await finish_form(message, state)
        return

    q = QUESTIONS[index]
    progress = f"_{index + 1} из {len(QUESTIONS)}_\n\n"
    text = progress + q["text"]

    # Особая обработка вопроса с фото
    if q.get("type") == "photo":
        kb = ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="✅ Готово (отправить анкету)")]],
            resize_keyboard=True
        )
        await state.set_state(Form.uploading_photos)
        await message.answer(text, reply_markup=kb, parse_mode="Markdown")
    else:
        kb = get_keyboard_for_question(q)
        await state.set_state(Form.answering)
        await message.answer(text, reply_markup=kb, parse_mode="Markdown")

# ============================================
# ОБРАБОТКА ФОТО
# ============================================
@dp.message(Form.uploading_photos, F.photo)
async def process_photo(message: types.Message, state: FSMContext):
    data = await state.get_data()
    photo_ids = data.get("photo_ids", [])

    photo_id = message.photo[-1].file_id
    photo_ids.append(photo_id)

    # Максимум 10 фото
    if len(photo_ids) >= 10:
        photo_ids = photo_ids[:10]

    await state.update_data(photo_ids=photo_ids)

    count = len(photo_ids)
    if count >= 3:
        msg = f"✅ Загружено фото: {count}/10\nОтправьте ещё или нажмите «✅ Готово»"
    else:
        msg = f"📸 Фото {count} получено! Нужно минимум 3. Отправьте ещё."

    await message.answer(msg)

@dp.message(Form.uploading_photos, F.text == "✅ Готово (отправить анкету)")
async def photos_done(message: types.Message, state: FSMContext):
    data = await state.get_data()
    photo_ids = data.get("photo_ids", [])

    if len(photo_ids) < 3:
        await message.answer(
            f"❌ Нужно минимум 3 фото. Сейчас загружено: {len(photo_ids)}.\n"
            "Пожалуйста, отправьте ещё фотографии."
        )
        return

    # Переходим к следующему вопросу
    current_index = data.get("current_index", 0)
    answers = data.get("answers", {})
    answers["photos"] = photo_ids
    await state.update_data(answers=answers, current_index=current_index + 1)
    await ask_question(message, state)

@dp.message(Form.uploading_photos)
async def photos_wrong_input(message: types.Message, state: FSMContext):
    data = await state.get_data()
    photo_ids = data.get("photo_ids", [])
    await message.answer(
        f"📸 Пожалуйста, отправьте фотографию.\n"
        f"Уже загружено: {len(photo_ids)} фото.\n"
        "Когда закончите — нажмите «✅ Готово»"
    )

# ============================================
# ОБРАБОТКА ОТВЕТОВ НА ВОПРОСЫ
# ============================================
@dp.message(Form.answering)
async def process_answer(message: types.Message, state: FSMContext):
    if not message.text:
        await message.answer("Пожалуйста, отправьте текстовый ответ или нажмите кнопку.")
        return

    data = await state.get_data()
    index = data.get("current_index", 0)
    answers = data.get("answers", {})
    q = QUESTIONS[index]

    # Валидация социальных сетей
    if q["id"] == "socials":
        if not is_valid_social(message.text):
            await message.answer(
                "⚠️ Текст не похож на ссылку или никнейм.\n"
                "Укажите ссылку или @username.\n"
                "Например: https://t.me/username или @username"
            )
            return

    # Проверка возраста 18+
    if q["id"] == "age18" and "Нет" in message.text:
        await message.answer(
            "К сожалению, мы работаем только с совершеннолетними.\n"
            "Анкетирование завершено.",
            reply_markup=ReplyKeyboardRemove()
        )
        await state.clear()
        return

    answers[q["id"]] = message.text
    await state.update_data(answers=answers, current_index=index + 1)
    await ask_question(message, state)

# ============================================
# ЗАВЕРШЕНИЕ АНКЕТЫ
# ============================================
async def finish_form(message: types.Message, state: FSMContext):
    data = await state.get_data()
    answers = data.get("answers", {})
    photo_ids = data.get("photo_ids", [])

    # Сообщение пользователю
    await message.answer(
        "✅ *Анкета успешно заполнена и отправлена!*\n\n"
        "Оксана рассмотрит её в ближайшее время.\n"
        "Спасибо за ваше время и доверие! ❤️\n\n"
        "*Наши контакты:*\n"
        "📱 ТГ: @oksana\\_my\\_life\n"
        "📞 WA / МАХ / IMO: +79037991521\n"
        "📣 ТГ канал: @marry\\_international\n"
        "🔗 МАХ канал: http://6max.ru/oksana",
        reply_markup=ReplyKeyboardRemove(),
        parse_mode="Markdown"
    )

    # Формируем отчёт для администраторов
    username_str = f"@{message.from_user.username}" if message.from_user.username else f"ID: {message.from_user.id}"
    full_name = message.from_user.full_name or "Без имени"

    report_lines = [
        f"🔥 *НОВАЯ АНКЕТА*",
        f"👤 От: {full_name} ({username_str})",
        f"🆔 ID: `{message.from_user.id}`",
        f"📸 Фото: {len(photo_ids)} шт.",
        "",
    ]

    for q in QUESTIONS:
        if q.get("type") == "photo":
            continue
        ans = answers.get(q["id"], "—")
        report_lines.append(f"❓ {q['text'][:80]}")
        report_lines.append(f"✅ {ans}")
        report_lines.append("")

    report_text = "\n".join(report_lines)

    # Отправляем отчёт всем администраторам
    for admin_id in ADMINS:
        try:
            # Сначала отправляем фото если есть
            if photo_ids:
                if len(photo_ids) == 1:
                    await bot.send_photo(
                        chat_id=admin_id,
                        photo=photo_ids[0],
                        caption=f"📸 Фото из анкеты: {full_name} ({username_str})"
                    )
                else:
                    # Медиагруппа
                    from aiogram.types import InputMediaPhoto
                    media = []
                    for i, pid in enumerate(photo_ids[:10]):
                        if i == 0:
                            media.append(InputMediaPhoto(
                                media=pid,
                                caption=f"📸 Фото из анкеты: {full_name} ({username_str})"
                            ))
                        else:
                            media.append(InputMediaPhoto(media=pid))
                    await bot.send_media_group(chat_id=admin_id, media=media)

            # Разбиваем на части (лимит 4096 символов)
            chunk_size = 4000
            for i in range(0, len(report_text), chunk_size):
                chunk = report_text[i:i + chunk_size]
                try:
                    await bot.send_message(
                        chat_id=admin_id,
                        text=chunk,
                        parse_mode="Markdown"
                    )
                except Exception:
                    # Если Markdown сломан — отправляем без разметки
                    await bot.send_message(chat_id=admin_id, text=chunk)

        except Exception as e:
            logging.error(f"Не удалось отправить анкету админу {admin_id}: {e}")

    await state.clear()

# ============================================
# ОБРАБОТКА НЕИЗВЕСТНЫХ СООБЩЕНИЙ
# ============================================
@dp.message()
async def unknown_message(message: types.Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state is None:
        # Пользователь не в анкете — предлагаем начать
        await message.answer(
            "Отправьте /start чтобы начать заполнение анкеты.",
            reply_markup=ReplyKeyboardRemove()
        )

# ============================================
# ЗАПУСК БОТА
# ============================================
async def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    logger = logging.getLogger(__name__)
    logger.info("Запуск I•Match Dating Bot...")
    logger.info(f"Супер-админ: @{SUPER_ADMIN_USERNAME} (ID: {SUPER_ADMIN_ID})")
    logger.info(f"Mini App URL: {WEB_APP_URL}")

    # Удаляем вебхук и сбрасываем очередь
    await bot.delete_webhook(drop_pending_updates=True)

    print("=" * 50)
    print("✅ I•Match Dating Bot запущен!")
    print(f"👑 Супер-админ: @{SUPER_ADMIN_USERNAME} (ID: {SUPER_ADMIN_ID})")
    print(f"🌐 Mini App: {WEB_APP_URL}")
    print("=" * 50)

    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
