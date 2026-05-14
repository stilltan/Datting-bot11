import type { Question, Section } from './types';

export const SECTIONS: Section[] = [
  { 
    id: 'intro', 
    title: { ru: 'Основная информация', en: 'Basic Information' }, 
    icon: '👤', 
    description: { ru: 'Контактные данные и цель обращения', en: 'Contact details and purpose' }
  },
  { 
    id: 'personal', 
    title: { ru: 'О вас', en: 'About You' }, 
    icon: '📋', 
    description: { ru: 'Личные данные и описание', en: 'Personal information' }
  },
  { 
    id: 'relationships', 
    title: { ru: 'Отношения', en: 'Relationships' }, 
    icon: '💕', 
    description: { ru: 'Опыт и ожидания от отношений', en: 'Experience and expectations' }
  },
  { 
    id: 'children', 
    title: { ru: 'Дети', en: 'Children' }, 
    icon: '👶', 
    description: { ru: 'Вопросы о детях', en: 'Questions about children' }
  },
  { 
    id: 'career', 
    title: { ru: 'Карьера и финансы', en: 'Career & Finance' }, 
    icon: '💼', 
    description: { ru: 'Профессия и доход', en: 'Profession and income' }
  },
  { 
    id: 'character', 
    title: { ru: 'Характер', en: 'Character' }, 
    icon: '🧠', 
    description: { ru: 'Ваша личность и ценности', en: 'Your personality and values' }
  },
  { 
    id: 'partner', 
    title: { ru: 'Идеальный партнёр', en: 'Ideal Partner' }, 
    icon: '💍', 
    description: { ru: 'Требования к партнёру', en: 'Partner requirements' }
  },
  { 
    id: 'emigration', 
    title: { ru: 'Эмиграция', en: 'Emigration' }, 
    icon: '✈️', 
    description: { ru: 'Готовность к переезду', en: 'Readiness to relocate' }
  },
  { 
    id: 'final', 
    title: { ru: 'Завершение', en: 'Final' }, 
    icon: '✅', 
    description: { ru: 'Последние вопросы', en: 'Last questions' }
  },
];

export const QUESTIONS: Question[] = [
  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  { 
    id: 'email', 
    text: { ru: 'Электронная почта', en: 'Email address' }, 
    req: true, 
    type: 'email', 
    section: 'intro' 
  },
  { 
    id: 'source', 
    text: { ru: 'Где / от кого вы узнали о нас?', en: 'Where did you hear about us?' }, 
    req: false, 
    type: 'text', 
    section: 'intro' 
  },
  { 
    id: 'goal', 
    text: { ru: 'Цель заполнения анкеты:', en: 'Purpose of filling the form:' }, 
    req: true, 
    type: 'radio', 
    section: 'intro', 
    options: {
      ru: [
        'В кадровый резерв невест (цена 2490 руб. в год)',
        'Индивидуальный формат работы (после личной встречи)',
        'Хочу принять участие в отборе на мужчину',
        'Другое'
      ],
      en: [
        'Bride reserve (2490 rub/year)',
        'Individual format (after personal meeting)',
        'Want to participate in man selection',
        'Other'
      ]
    }
  },
  { 
    id: 'age18', 
    text: { ru: 'Вам уже есть 18 лет?', en: 'Are you 18 or older?' }, 
    req: true, 
    type: 'radio', 
    section: 'intro', 
    options: { ru: ['Да', 'Нет'], en: ['Yes', 'No'] },
    hint: { 
      ru: 'Мы работаем только с совершеннолетними', 
      en: 'We only work with adults' 
    }
  },
  { 
    id: 'photos', 
    text: { ru: 'Приложите ваши фото (5–7 шт)', en: 'Upload your photos (5-7 pcs)' }, 
    req: true, 
    type: 'file', 
    section: 'intro', 
    hint: { 
      ru: 'Важно: хорошее качество, портретное фото и фото в полный рост', 
      en: 'Important: good quality, portrait and full-length photos' 
    }
  },
  { 
    id: 'socials', 
    text: { ru: 'Ссылка на 1–2 ваших соцсети', en: 'Links to 1-2 social networks' }, 
    req: true, 
    type: 'text', 
    section: 'intro' 
  },

  // === О ВАС ===
  { 
    id: 'name', 
    text: { ru: 'Как вас зовут? (ФИО)', en: 'What is your name? (Full name)' }, 
    req: true, 
    type: 'text', 
    section: 'personal' 
  },
  { 
    id: 'contact_method', 
    text: { ru: 'Как с вами удобнее связаться?', en: 'Best way to contact you?' }, 
    req: true, 
    type: 'text', 
    section: 'personal',
    hint: { ru: 'Телефон / Ник @', en: 'Phone / @username' }
  },
  { 
    id: 'contacts', 
    text: { ru: 'Укажите контакты', en: 'Your contacts' }, 
    req: true, 
    type: 'textarea', 
    section: 'personal',
    hint: { ru: 'Telegram, WhatsApp, e-mail, телефон', en: 'Telegram, WhatsApp, e-mail, phone' }
  },
  { 
    id: 'timezone', 
    text: { ru: 'Часовой пояс и удобное время для связи', en: 'Timezone and convenient time' }, 
    req: true, 
    type: 'text', 
    section: 'personal' 
  },
  { 
    id: 'dob', 
    text: { ru: 'Дата рождения', en: 'Date of birth' }, 
    req: true, 
    type: 'text', 
    section: 'personal' 
  },
  { 
    id: 'location', 
    text: { ru: 'Где вы сейчас живёте?', en: 'Where do you live now?' }, 
    req: true, 
    type: 'text', 
    section: 'personal', 
    hint: { ru: 'Город и страна', en: 'City and country' }
  },
  { 
    id: 'citizenship', 
    text: { ru: 'Какое у вас гражданство?', en: 'What is your citizenship?' }, 
    req: true, 
    type: 'text', 
    section: 'personal',
    hint: { ru: 'Если несколько — укажите все', en: 'If multiple — list all' }
  },
  { 
    id: 'height', 
    text: { ru: 'Ваш рост (см)', en: 'Your height (cm)' }, 
    req: true, 
    type: 'text', 
    section: 'personal' 
  },
  { 
    id: 'weight', 
    text: { ru: 'Ваш вес (кг)', en: 'Your weight (kg)' }, 
    req: true, 
    type: 'text', 
    section: 'personal' 
  },
  { 
    id: 'describes_you', 
    text: { ru: 'Что из этого лучше всего про вас?', en: 'What describes you best?' }, 
    req: true, 
    type: 'checkbox', 
    section: 'personal', 
    hint: { ru: 'Выберите 1–3 пункта', en: 'Choose 1-3 options' },
    options: {
      ru: [
        'Строю карьеру в большом городе',
        'Мама после развода',
        'Экспатка (живу за границей)',
        'Закончила долгие отношения/брак',
        'Живу в небольшом городе',
        'Занимаюсь бизнесом',
        'Цифровой кочевник',
        'Тяжёлый опыт в прошлых отношениях',
        'Онлайн-роман с иностранцем',
        'Хочу / планирую эмиграцию',
        'Важны традиционные ценности',
        'Другое'
      ],
      en: [
        'Building career in big city',
        'Mom after divorce',
        'Expat (living abroad)',
        'Ended long relationship/marriage',
        'Living in small town',
        'Running business',
        'Digital nomad',
        'Hard past experience',
        'Online romance with foreigner',
        'Want / planning emigration',
        'Traditional values important',
        'Other'
      ]
    }
  },

  // === ОТНОШЕНИЯ ===
  { 
    id: 'goals_1y', 
    text: { ru: 'Главные цели на горизонте 1 года?', en: 'Main goals for 1 year?' }, 
    req: true, 
    type: 'textarea', 
    section: 'relationships',
    hint: { ru: 'Что на первом месте?', en: "What's first?" }
  },
  { 
    id: 'marital_status', 
    text: { ru: 'Семейный статус', en: 'Marital status' }, 
    req: true, 
    type: 'radio', 
    section: 'relationships', 
    options: {
      ru: ['Никогда не была замужем', 'В разводе', 'В отношениях без брака', 'Официально замужем', 'Вдова', 'Другое'],
      en: ['Never married', 'Divorced', 'In relationship without marriage', 'Officially married', 'Widow', 'Other']
    }
  },
  { 
    id: 'marriages_count', 
    text: { ru: 'Сколько раз были замужем и длительность?', en: 'How many times married and duration?' }, 
    req: false, 
    type: 'text', 
    section: 'relationships' 
  },
  { 
    id: 'last_relationship', 
    text: { ru: 'Кратко о последних серьёзных отношениях', en: 'Brief about last serious relationship' }, 
    req: false, 
    type: 'textarea', 
    section: 'relationships',
    hint: { ru: 'Когда закончились, почему?', en: 'When ended, why?' }
  },
  { 
    id: 'repeating_patterns', 
    text: { ru: '3 ошибки из прошлых отношений, которые не хотите повторять', en: '3 mistakes from past you don\'t want to repeat' }, 
    req: false, 
    type: 'textarea', 
    section: 'relationships' 
  },
  { 
    id: 'what_prevented', 
    text: { ru: 'Что мешало прийти к желаемым отношениям?', en: 'What prevented desired relationships?' }, 
    req: true, 
    type: 'textarea', 
    section: 'relationships' 
  },
  { 
    id: 'want_to_change', 
    text: { ru: 'Что в своём поведении хотели бы изменить?', en: 'What would you change in your behavior?' }, 
    req: false, 
    type: 'textarea', 
    section: 'relationships' 
  },

  // === ДЕТИ ===
  { 
    id: 'children_info', 
    text: { ru: 'Есть ли у вас дети, сколько и возраст?', en: 'Do you have children? How many and age?' }, 
    req: true, 
    type: 'text', 
    section: 'children' 
  },
  { 
    id: 'want_more_children', 
    text: { ru: 'Хотите ли вы ещё детей?', en: 'Do you want more children?' }, 
    req: true, 
    type: 'radio', 
    section: 'children', 
    options: {
      ru: ['Точно Да', 'Точно Нет', 'Пока не решила', 'Другое'],
      en: ['Definitely Yes', 'Definitely No', 'Not decided yet', 'Other']
    }
  },
  { 
    id: 'man_with_children', 
    text: { ru: 'Рассматриваете мужчину с детьми?', en: 'Consider a man with children?' }, 
    req: false, 
    type: 'textarea', 
    section: 'children',
    hint: { ru: 'При каких условиях?', en: 'Under what conditions?' }
  },

  // === КАРЬЕРА И ФИНАНСЫ ===
  { 
    id: 'occupation', 
    text: { ru: 'Чем вы занимаетесь? (профессия)', en: 'What do you do? (profession)' }, 
    req: false, 
    type: 'text', 
    section: 'career' 
  },
  { 
    id: 'role', 
    text: { ru: 'В какой роли вы сейчас?', en: 'What role are you in now?' }, 
    req: true, 
    type: 'radio', 
    section: 'career', 
    options: {
      ru: ['Владелица бизнеса', 'Руководитель', 'Наёмный специалист', 'Фриланс', 'В декрете', 'В поиске работы', 'Другое'],
      en: ['Business owner', 'Manager', 'Employee', 'Freelance', 'Maternity leave', 'Job searching', 'Other']
    }
  },
  { 
    id: 'income', 
    text: { ru: 'Как оцениваете свой доход?', en: 'How do you rate your income?' }, 
    req: false, 
    type: 'radio', 
    section: 'career', 
    options: {
      ru: ['Закрываю базовые расходы', 'Стабильный, средний', 'Высокий доход', 'Другое'],
      en: ['Cover basic expenses', 'Stable, average', 'High income', 'Other']
    }
  },
  { 
    id: 'finance_unacceptable', 
    text: { ru: 'Что в финансах пары категорически недопустимо?', en: "What's unacceptable in couple's finances?" }, 
    req: false, 
    type: 'textarea', 
    section: 'career' 
  },

  // === ХАРАКТЕР ===
  { 
    id: 'ready_to_change_life', 
    text: { ru: 'Готовность менять жизнь ради отношений', en: 'Readiness to change life for relationships' }, 
    req: true, 
    type: 'scale', 
    section: 'character', 
    hint: { ru: '1 — не готова, 10 — полностью', en: '1 — not ready, 10 — fully ready' }, 
    options: { ru: ['1','2','3','4','5','6','7','8','9','10'], en: ['1','2','3','4','5','6','7','8','9','10'] }
  },
  { 
    id: 'what_ready_to_change', 
    text: { ru: 'Что готовы менять, а что точно нет?', en: 'What are you ready to change and what not?' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },
  { 
    id: 'introvert_extrovert', 
    text: { ru: 'Вы интроверт или экстраверт?', en: 'Are you introvert or extrovert?' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },
  { 
    id: 'conflict_behavior', 
    text: { ru: 'Как ведёте себя при конфликте?', en: 'How do you behave in conflict?' }, 
    req: true, 
    type: 'radio', 
    section: 'character', 
    options: {
      ru: ['Замолкаю и ухожу', 'Говорю прямо сразу', 'Сначала обдумываю', 'Другое'],
      en: ['Go silent and leave', 'Speak directly', 'Think first', 'Other']
    }
  },
  { 
    id: '3_words_friends', 
    text: { ru: '3 слова, которыми вас описывают друзья', en: '3 words friends describe you with' }, 
    req: false, 
    type: 'text', 
    section: 'character' 
  },
  { 
    id: '3_strengths', 
    text: { ru: '3 сильные стороны в отношениях', en: '3 strengths in relationships' }, 
    req: true, 
    type: 'text', 
    section: 'character' 
  },
  { 
    id: '3_weaknesses', 
    text: { ru: '3 слабые стороны в отношениях', en: '3 weaknesses in relationships' }, 
    req: true, 
    type: 'text', 
    section: 'character' 
  },
  { 
    id: 'how_rest', 
    text: { ru: 'Как обычно отдыхаете?', en: 'How do you usually rest?' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },
  { 
    id: 'attitude_control', 
    text: { ru: 'Отношение к контролю и ревности в паре', en: 'Attitude to control and jealousy' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },
  { 
    id: '3_values', 
    text: { ru: '3 обязательные ценности в отношениях', en: '3 mandatory values in relationships' }, 
    req: true, 
    type: 'text', 
    section: 'character' 
  },
  { 
    id: 'religion', 
    text: { ru: 'Религиозные убеждения?', en: 'Religious beliefs?' }, 
    req: false, 
    type: 'textarea', 
    section: 'character',
    hint: { ru: 'Должен ли партнёр их разделять?', en: 'Should partner share them?' }
  },
  { 
    id: 'family_model', 
    text: { ru: 'Комфортная модель семьи для вас', en: 'Comfortable family model for you' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },
  { 
    id: 'languages', 
    text: { ru: 'Уровень английского и других языков', en: 'English and other languages level' }, 
    req: true, 
    type: 'text', 
    section: 'character' 
  },
  { 
    id: 'exp_foreigners', 
    text: { ru: 'Опыт отношений с иностранцами', en: 'Experience with foreigners' }, 
    req: false, 
    type: 'textarea', 
    section: 'character' 
  },

  // === ИДЕАЛЬНЫЙ ПАРТНЁР ===
  { 
    id: 'countries_yes_no', 
    text: { ru: 'В каких странах можете жить, а в каких нет?', en: 'Countries you can/cannot live in?' }, 
    req: true, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'most_important_partner', 
    text: { ru: 'Что важнее при выборе партнёра?', en: "What's most important in partner?" }, 
    req: true, 
    type: 'radio', 
    section: 'partner', 
    options: {
      ru: ['Гражданство', 'Страна эмиграции', 'Личные качества', 'Материальный уровень', 'Другое'],
      en: ['Citizenship', 'Emigration country', 'Personal qualities', 'Financial level', 'Other']
    }
  },
  { 
    id: 'picture_1_year', 
    text: { ru: 'Картина через год: с кем, какие отношения?', en: 'Picture in 1 year: who with, what relationships?' }, 
    req: true, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'age_range', 
    text: { ru: 'Комфортный возраст мужчины', en: 'Comfortable age of man' }, 
    req: true, 
    type: 'text', 
    section: 'partner' 
  },
  { 
    id: 'appearance_req', 
    text: { ru: 'Требования к внешности? Рост, вес?', en: 'Appearance requirements? Height, weight?' }, 
    req: false, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'min_living_standard', 
    text: { ru: 'Минимальный уровень жизни мужчины', en: 'Minimum living standard of man' }, 
    req: false, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'unacceptable_character', 
    text: { ru: 'С какой чертой характера не готовы мириться?', en: "What character trait can't you accept?" }, 
    req: true, 
    type: 'text', 
    section: 'partner' 
  },
  { 
    id: '3_qualities_man', 
    text: { ru: '3 важнейших качества в мужчине', en: '3 most important qualities in a man' }, 
    req: true, 
    type: 'text', 
    section: 'partner' 
  },
  { 
    id: 'red_flags', 
    text: { ru: 'Красные флаги в начале отношений', en: 'Red flags at the beginning' }, 
    req: false, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'unacceptable_conditions', 
    text: { ru: 'Что неприемлемо ни при каких условиях?', en: "What's unacceptable under any conditions?" }, 
    req: false, 
    type: 'textarea', 
    section: 'partner' 
  },
  { 
    id: 'abuse_experience', 
    text: { ru: 'Был ли опыт насилия?', en: 'Any abuse experience?' }, 
    req: false, 
    type: 'textarea', 
    section: 'partner',
    hint: { ru: "Можно написать «не хочу отвечать»", en: "Can write 'prefer not to answer'" }
  },

  // === ЭМИГРАЦИЯ ===
  { 
    id: 'emigration_readiness', 
    text: { ru: 'Готовность к эмиграции', en: 'Emigration readiness' }, 
    req: true, 
    type: 'scale', 
    section: 'emigration', 
    hint: { ru: '1 — не готова, 10 — полностью', en: '1 — not ready, 10 — fully ready' }, 
    options: { ru: ['1','2','3','4','5','6','7','8','9','10'], en: ['1','2','3','4','5','6','7','8','9','10'] }
  },
  { 
    id: 'most_important_now', 
    text: { ru: 'Что сейчас самое важное?', en: "What's most important now?" }, 
    req: true, 
    type: 'radio', 
    section: 'emigration', 
    options: {
      ru: ['Начать системный поиск', 'Перезапустить личную жизнь', 'Перевести онлайн в реальность', 'Другое'],
      en: ['Start systematic search', 'Restart personal life', 'Turn online to reality', 'Other']
    }
  },
  { 
    id: 'fears_international', 
    text: { ru: 'Страхи в международных знакомствах', en: 'Fears in international dating' }, 
    req: false, 
    type: 'textarea', 
    section: 'emigration' 
  },
  { 
    id: 'time_to_emigrate', 
    text: { ru: 'Через какое время готовы эмигрировать?', en: 'When ready to emigrate?' }, 
    req: true, 
    type: 'radio', 
    section: 'emigration', 
    options: {
      ru: ['В течение года', 'В течение 1–3 лет', 'Другое'],
      en: ['Within a year', 'Within 1-3 years', 'Other']
    }
  },
  { 
    id: 'holds_back', 
    text: { ru: 'Что удерживает в стране?', en: 'What holds you back?' }, 
    req: false, 
    type: 'textarea', 
    section: 'emigration' 
  },
  { 
    id: 'reason_to_move', 
    text: { ru: 'Главная причина переезда', en: 'Main reason to move' }, 
    req: false, 
    type: 'textarea', 
    section: 'emigration' 
  },

  // === ЗАВЕРШЕНИЕ ===
  { 
    id: 'doubts_oksana', 
    text: { ru: 'Сомнения в работе со мной?', en: 'Doubts about working with me?' }, 
    req: false, 
    type: 'textarea', 
    section: 'final' 
  },
  { 
    id: 'confidence', 
    text: { ru: 'Что придаёт уверенность?', en: 'What gives you confidence?' }, 
    req: false, 
    type: 'textarea', 
    section: 'final' 
  },
  { 
    id: 'anything_else', 
    text: { ru: 'Что важное я не спросила?', en: "Anything important I didn't ask?" }, 
    req: false, 
    type: 'textarea', 
    section: 'final' 
  },
  { 
    id: 'tg_channel', 
    text: { ru: 'Подписка на канал @marry_international?', en: 'Subscribe to @marry_international?' }, 
    req: true, 
    type: 'radio', 
    section: 'final', 
    options: {
      ru: ['Уже там ✅', 'Обязательно подпишусь'],
      en: ['Already there ✅', 'Will subscribe']
    }
  },
  { 
    id: 'consent', 
    text: { ru: 'Согласие на обработку персональных данных', en: 'Consent to personal data processing' }, 
    req: true, 
    type: 'radio', 
    section: 'final', 
    options: {
      ru: ['Я ознакомлена и даю согласие ✅'],
      en: ['I have read and consent ✅']
    },
    hint: { ru: 'Политика: https://606.su/ojrq', en: 'Policy: https://606.su/ojrq' }
  },
];

// UI Texts
export const UI_TEXTS = {
  ru: {
    appName: 'I•Match',
    appTagline: 'Международный проект создания семей',
    welcomeTitle: 'Профайл для подбора партнёра',
    welcomeDescription: 'Эта анкета нужна, чтобы я могла лучше понять вашу ситуацию и честно сказать, могу ли я вам помочь.',
    welcomeConfidential: 'Все данные конфиденциальны и используются только для работы проекта I•Match.',
    questionsCount: 'вопросов',
    estimatedTime: '≈ 35–45 минут',
    honestAnswers: 'Пожалуйста, отвечайте честно — здесь нет «правильных» ответов.',
    startButton: 'Начать заполнение',
    author: '— Ваша Оксана Гартнер',
    successTitle: 'Анкета отправлена!',
    successMessage: 'Оксана рассмотрит её в ближайшее время.',
    thankYou: 'Спасибо за ваше время и доверие!',
    contacts: 'Наши контакты',
    sectionOf: 'из',
    next: 'Далее',
    submit: 'Отправить анкету',
    submitting: 'Отправка...',
    back: 'Назад',
    sections: 'Разделы',
    resetAll: 'Сбросить все ответы',
    resetConfirm: 'Сбросить все ответы?',
    required: 'Обязательное поле',
    selectOption: 'Выберите вариант',
    selectOptions: 'Выберите варианты',
    uploadPhotos: 'Загрузить фото',
    photosUploaded: 'загружено',
    addMore: 'Добавить ещё',
    done: 'Готово',
    uploadAtLeast: 'Загрузите хотя бы одно фото',
    invalidEmail: 'Введите корректный email',
    yourAnswer: 'Ваш ответ...',
    notReady: 'Не готова',
    fullyReady: 'Полностью готова',
    lightTheme: 'Светлая тема',
    darkTheme: 'Тёмная тема',
    language: 'Язык',
    settings: 'Настройки',
  },
  en: {
    appName: 'I•Match',
    appTagline: 'International Family Building Project',
    welcomeTitle: 'Partner Matching Profile',
    welcomeDescription: 'This form helps me better understand your situation and honestly say if I can help you.',
    welcomeConfidential: 'All data is confidential and used only for the I•Match project.',
    questionsCount: 'questions',
    estimatedTime: '≈ 35-45 minutes',
    honestAnswers: 'Please answer honestly — there are no "right" answers.',
    startButton: 'Start Filling',
    author: '— Your Oksana Gartner',
    successTitle: 'Form Submitted!',
    successMessage: 'Oksana will review it soon.',
    thankYou: 'Thank you for your time and trust!',
    contacts: 'Our contacts',
    sectionOf: 'of',
    next: 'Next',
    submit: 'Submit Form',
    submitting: 'Submitting...',
    back: 'Back',
    sections: 'Sections',
    resetAll: 'Reset all answers',
    resetConfirm: 'Reset all answers?',
    required: 'Required field',
    selectOption: 'Select an option',
    selectOptions: 'Select options',
    uploadPhotos: 'Upload photos',
    photosUploaded: 'uploaded',
    addMore: 'Add more',
    done: 'Done',
    uploadAtLeast: 'Upload at least one photo',
    invalidEmail: 'Enter a valid email',
    yourAnswer: 'Your answer...',
    notReady: 'Not ready',
    fullyReady: 'Fully ready',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    language: 'Language',
    settings: 'Settings',
  }
};
