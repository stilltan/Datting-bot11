<<<<<<< HEAD
"""
⚠️ ЭТОТ ФАЙЛ УСТАРЕЛ!

Используйте telegram_bot.py вместо этого файла.

Команда запуска:
    python telegram_bot.py

Для установки зависимостей:
    pip install aiogram

"""

print("⚠️  ВНИМАНИЕ: Этот файл устарел!")
print("👉 Используйте: python telegram_bot.py")
print()
print("Для запуска нового бота выполните:")
print("  pip install aiogram")
print("  python telegram_bot.py")
=======
import asyncio
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove

# Ваш токен
TOKEN = "8275532228:AAEl1fIdWl6kZT-_AbP9gixYrdRYmJrBdTU"

bot = Bot(token=TOKEN)
dp = Dispatcher()

# Справочник текстов для двух языков (i18n)
TEXTS = {
    'ru': {
        'ask_name': "Давайте знакомиться! Расскажите немного о себе.\nКак вас зовут?",
        'ask_age': "Отлично, {name}! Ваш возраст? (Напишите число, например, 25)",
        'err_age': "Пожалуйста, введите корректный возраст цифрами.",
        'ask_gender': "Укажите ваш пол:",
        'btn_male': "Мужской",
        'btn_female': "Женский",
        'ask_looking_for': "Кого вы ищете? Мы поможем подобрать идеальную пару.",
        'btn_look_male': "Парня",
        'btn_look_female': "Девушку",
        'btn_look_any': "Не имеет значения",
        'ask_bio': "О себе. Добавьте пару слов, это повысит шансы на мэтч (или напишите 'Пропустить'):",
        'ask_photo': "Ваше лучшее фото! Загрузите фотографию для вашей анкеты.",
        'err_photo': "Пожалуйста, отправьте именно фотографию 📸",
        'finish': "✅ Анкета успешно отправлена!\n\nМодераторы скоро проверят её.\n\nСвяжитесь с нами:\nТГ: @oksana_my_life\nWA / МАХ / IMO: +79037991521\nТГ канал: @marry_international\nМАХ канал: http://6max.ru/oksana"
    },
    'en': {
        'ask_name': "Let's get acquainted! Tell us a little about yourself.\nWhat is your name?",
        'ask_age': "Great, {name}! Your age? (Enter a number, e.g., 25)",
        'err_age': "Please enter a valid age using numbers.",
        'ask_gender': "Select your gender:",
        'btn_male': "Male",
        'btn_female': "Female",
        'ask_looking_for': "Who are you looking for? We'll help find the perfect match.",
        'btn_look_male': "A guy",
        'btn_look_female': "A girl",
        'btn_look_any': "Does not matter",
        'ask_bio': "About yourself. Add a few words to increase your chances (or type 'Skip'):",
        'ask_photo': "Your best photo! Upload a picture for your profile.",
        'err_photo': "Please send a photo 📸",
        'finish': "✅ Profile successfully sent!\n\nModerators will review it soon.\n\nContact us:\nTG: @oksana_my_life\nWA / MAX / IMO: +79037991521\nTG channel: @marry_international\nMAX channel: http://6max.ru/oksana"
    }
}

# Машина состояний (FSM) для пошаговой анкеты
class Questionnaire(StatesGroup):
    language = State()
    name = State()
    age = State()
    gender = State()
    looking_for = State()
    bio = State()
    photo = State()

# 1. Запуск бота и выбор языка
@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    kb = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🇷🇺 Русский"), KeyboardButton(text="🇬🇧 English")]
        ],
        resize_keyboard=True
    )
    await message.answer("Please select your language / Пожалуйста, выберите язык:", reply_markup=kb)
    await state.set_state(Questionnaire.language)

# 2. Сохранение языка и запрос имени
@dp.message(Questionnaire.language, F.text.in_(["🇷🇺 Русский", "🇬🇧 English"]))
async def process_language(message: types.Message, state: FSMContext):
    lang = 'ru' if 'Русский' in message.text else 'en'
    await state.update_data(lang=lang)
    
    await message.answer(TEXTS[lang]['ask_name'], reply_markup=ReplyKeyboardRemove())
    await state.set_state(Questionnaire.name)

# 3. Сохранение имени и запрос возраста
@dp.message(Questionnaire.name, F.text)
async def process_name(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    name = message.text
    await state.update_data(name=name)
    
    await message.answer(TEXTS[lang]['ask_age'].format(name=name))
    await state.set_state(Questionnaire.age)

# 4. Сохранение возраста и запрос пола (кнопки)
@dp.message(Questionnaire.age)
async def process_age(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    
    if not message.text.isdigit():
        await message.answer(TEXTS[lang]['err_age'])
        return
        
    await state.update_data(age=int(message.text))
    
    kb = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=TEXTS[lang]['btn_male']), KeyboardButton(text=TEXTS[lang]['btn_female'])]
        ],
        resize_keyboard=True
    )
    await message.answer(TEXTS[lang]['ask_gender'], reply_markup=kb)
    await state.set_state(Questionnaire.gender)

# 5. Сохранение пола и запрос "кого ищет" (кнопки)
@dp.message(Questionnaire.gender)
async def process_gender(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    
    await state.update_data(gender=message.text)
    
    kb = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=TEXTS[lang]['btn_look_male']), KeyboardButton(text=TEXTS[lang]['btn_look_female'])],
            [KeyboardButton(text=TEXTS[lang]['btn_look_any'])]
        ],
        resize_keyboard=True
    )
    await message.answer(TEXTS[lang]['ask_looking_for'], reply_markup=kb)
    await state.set_state(Questionnaire.looking_for)

# 6. Сохранение "кого ищет" и запрос описания
@dp.message(Questionnaire.looking_for)
async def process_looking_for(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    
    await state.update_data(looking_for=message.text)
    await message.answer(TEXTS[lang]['ask_bio'], reply_markup=ReplyKeyboardRemove())
    await state.set_state(Questionnaire.bio)

# 7. Сохранение описания и запрос фото
@dp.message(Questionnaire.bio, F.text)
async def process_bio(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    
    await state.update_data(bio=message.text)
    await message.answer(TEXTS[lang]['ask_photo'])
    await state.set_state(Questionnaire.photo)

# 8. Сохранение фото и финиш
@dp.message(Questionnaire.photo)
async def process_photo(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    
    if not message.photo:
        await message.answer(TEXTS[lang]['err_photo'])
        return
        
    photo_id = message.photo[-1].file_id # Берем фото в лучшем качестве
    
    # Сохраняем все данные
    final_data = await state.get_data()
    final_data['photo'] = photo_id
    
    # В БУДУЩЕМ: ТУТ КОД ДЛЯ СОХРАНЕНИЯ В БАЗУ ДАННЫХ (SQLAlchemy)
    
    # Отправляем пользователю его же анкету в знак подтверждения
    caption_text = (
        f"{TEXTS[lang]['finish']}\n\n"
        f"--- Ваша анкета ---\n"
        f"Имя: {final_data['name']}\n"
        f"Возраст: {final_data['age']}\n"
        f"Пол: {final_data['gender']}\n"
        f"Ищет: {final_data['looking_for']}\n"
        f"О себе: {final_data['bio']}"
    )
    
    await message.answer_photo(photo=photo_id, caption=caption_text)
    await state.clear() # Очищаем состояние (анкета завершена)

async def main():
    logging.basicConfig(level=logging.INFO)
    await bot.delete_webhook(drop_pending_updates=True)
    print("Telegram бот запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
>>>>>>> 9cb9070e4de5ed49abc41db861e9924bb0de2e84
