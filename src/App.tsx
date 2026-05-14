import { useState, useEffect, useRef, useCallback } from 'react';
import type { Language, Theme, Question, FormData, Section } from './types';

// ─── SECTIONS ────────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'contact',
    title: { ru: 'Контакты', en: 'Contacts' },
    icon: '📋',
    description: { ru: 'Способ связи и базовая информация', en: 'Contact method and basic info' },
  },
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Data' },
    icon: '👤',
    description: { ru: 'Ваши личные характеристики', en: 'Your personal characteristics' },
  },
  {
    id: 'relations',
    title: { ru: 'Отношения', en: 'Relationships' },
    icon: '💑',
    description: { ru: 'История и цели в отношениях', en: 'History and goals in relationships' },
  },
  {
    id: 'career',
    title: { ru: 'Карьера', en: 'Career' },
    icon: '💼',
    description: { ru: 'Работа и финансы', en: 'Work and finances' },
  },
  {
    id: 'personality',
    title: { ru: 'Личность', en: 'Personality' },
    icon: '✨',
    description: { ru: 'Характер и ценности', en: 'Character and values' },
  },
  {
    id: 'international',
    title: { ru: 'Международное', en: 'International' },
    icon: '🌍',
    description: { ru: 'Готовность к международным отношениям', en: 'Readiness for international relations' },
  },
  {
    id: 'partner',
    title: { ru: 'Партнёр', en: 'Partner' },
    icon: '💎',
    description: { ru: 'Требования к партнёру', en: 'Partner requirements' },
  },
  {
    id: 'final',
    title: { ru: 'Финальный', en: 'Final' },
    icon: '✅',
    description: { ru: 'Завершение анкеты', en: 'Completing the questionnaire' },
  },
];

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  // SECTION: contact
  {
    id: 'source',
    section: 'contact',
    req: true,
    type: 'text',
    text: { ru: 'Где / от кого вы узнали о нас?', en: 'Where / from whom did you learn about us?' },
  },
  {
    id: 'goal',
    section: 'contact',
    req: true,
    type: 'radio',
    text: { ru: 'Цель заполнения анкеты', en: 'Purpose of filling out the questionnaire' },
    options: {
      ru: [
        'В кадровый резерв невест (2490 руб/год)',
        'Захожу в индивидуальный формат работы',
        'Хочу принять участие в отборе на мужчину',
        'Другое',
      ],
      en: [
        'Join the bride reserve (2490 RUB/year)',
        'Individual working format',
        'I want to participate in selection for a man',
        'Other',
      ],
    },
  },
  {
    id: 'age18',
    section: 'contact',
    req: true,
    type: 'radio',
    text: { ru: 'Вам уже есть 18 лет?', en: 'Are you 18 years old or older?' },
    options: { ru: ['Да', 'Нет'], en: ['Yes', 'No'] },
  },
  {
    id: 'contact_type',
    section: 'contact',
    req: true,
    type: 'radio',
    text: { ru: 'Как с вами удобнее связаться?', en: 'What is the best way to contact you?' },
    options: {
      ru: ['Email', 'Telegram', 'WhatsApp', 'Facebook', 'Другое'],
      en: ['Email', 'Telegram', 'WhatsApp', 'Facebook', 'Other'],
    },
    hint: { ru: 'Выберите предпочтительный способ связи', en: 'Select your preferred contact method' },
  },
  {
    id: 'contact_value',
    section: 'contact',
    req: true,
    type: 'text',
    text: {
      ru: 'Укажите ваш контакт (Email / номер WA / ник TG / ссылка FB / другой)',
      en: 'Enter your contact (Email / WA number / TG username / FB link / other)',
    },
  },
  {
    id: 'socials',
    section: 'contact',
    req: true,
    type: 'text',
    text: { ru: 'Укажите ссылку на 1-2 ваших социальных сети', en: 'Provide links to 1-2 of your social networks' },
  },
  {
    id: 'timezone',
    section: 'contact',
    req: true,
    type: 'text',
    text: { ru: 'Ваш часовой пояс и удобное время для связи (формат: UTC+3, 10:00-20:00)', en: 'Your timezone and convenient contact time (format: UTC+3, 10:00-20:00)' },
    hint: {
      ru: 'Пример: UTC+3 (Москва), удобно с 10 до 20',
      en: 'Example: UTC+3 (Moscow), available 10am–8pm',
    },
  },

  // SECTION: personal
  {
    id: 'photos',
    section: 'personal',
    req: true,
    type: 'file',
    minPhotos: 3,
    text: { ru: 'Приложите ваши фото (3-7 шт)', en: 'Attach your photos (3-7 pcs)' },
    hint: {
      ru: 'Хорошее качество. Обязательно портретное фото и фото в полный рост. Минимум 3 фото.',
      en: 'Good quality. Portrait photo and full-length photo required. Minimum 3 photos.',
    },
  },
  {
    id: 'name',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Как вас зовут? (Фамилия, Имя, Отчество)', en: 'What is your full name? (Last name, First name, Middle name)' },
    hint: { ru: 'Пример: Иванова Мария Сергеевна', en: 'Example: Maria Ivanova' },
  },
  {
    id: 'gender',
    section: 'personal',
    req: true,
    type: 'radio',
    text: { ru: 'Ваш пол', en: 'Your gender' },
    options: { ru: ['Женский', 'Мужской'], en: ['Female', 'Male'] },
  },
  {
    id: 'looking_for',
    section: 'personal',
    req: true,
    type: 'radio',
    text: { ru: 'Кого вы ищете?', en: 'Who are you looking for?' },
    options: { ru: ['Мужчину', 'Женщину', 'Не имеет значения'], en: ['A man', 'A woman', 'Does not matter'] },
  },
  {
    id: 'dob',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Дата рождения (дд.мм.гггг)', en: 'Date of birth (dd.mm.yyyy)' },
    hint: { ru: 'Пример: 15.03.1990', en: 'Example: 15.03.1990' },
  },
  {
    id: 'location',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Где вы сейчас живёте? (город и страна)', en: 'Where do you live now? (city and country)' },
  },
  {
    id: 'citizenship',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Какое у вас гражданство?', en: 'What is your citizenship?' },
  },
  {
    id: 'height',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Ваш рост (см)', en: 'Your height (cm)' },
    hint: { ru: 'От 130 до 220 см', en: 'Between 130 and 220 cm' },
  },
  {
    id: 'weight',
    section: 'personal',
    req: true,
    type: 'text',
    text: { ru: 'Ваш вес (кг)', en: 'Your weight (kg)' },
    hint: { ru: 'От 30 до 200 кг', en: 'Between 30 and 200 kg' },
  },
  {
    id: 'describes_you',
    section: 'personal',
    req: true,
    type: 'radio',
    text: { ru: 'Что из этого лучше всего описывает вас?', en: 'Which of these best describes you?' },
    options: {
      ru: ['Строю карьеру', 'Мама после развода', 'Экспатка', 'Закончила долгие отношения', 'Живу в небольшом городе', 'Бизнес', 'Другое'],
      en: ['Building a career', 'Mom after divorce', 'Expat', 'Ended a long relationship', 'Living in a small town', 'Business', 'Other'],
    },
  },
  {
    id: 'goals_1y',
    section: 'personal',
    req: true,
    type: 'textarea',
    text: { ru: 'Главные цели на горизонте 1 года?', en: 'Main goals in the next 1 year?' },
  },

  // SECTION: relations
  {
    id: 'marital_status',
    section: 'relations',
    req: true,
    type: 'radio',
    text: { ru: 'Какой у вас семейный статус?', en: 'What is your marital status?' },
    options: {
      ru: ['Никогда не был/а в браке', 'В разводе', 'В отношениях, но без брака', 'Официально в браке', 'Вдова/Вдовец', 'Другое'],
      en: ['Never married', 'Divorced', 'In a relationship, but not married', 'Officially married', 'Widowed', 'Other'],
    },
  },
  {
    id: 'marriages_count',
    section: 'relations',
    req: false,
    type: 'text',
    text: { ru: 'Сколько раз вы были в браке и длительность?', en: 'How many times have you been married and for how long?' },
    skipIf: { id: 'marital_status', value: 'Никогда не был/а в браке' },
  },
  {
    id: 'last_relationship',
    section: 'relations',
    req: false,
    type: 'textarea',
    text: { ru: 'Кратко о последних серьёзных отношениях (когда закончились, почему)?', en: 'Brief about your last serious relationship (when ended, why)?' },
  },
  {
    id: 'repeating_patterns',
    section: 'relations',
    req: false,
    type: 'textarea',
    text: { ru: 'Что повторяется в прошлых отношениях? Какие 3 ошибки не хотите повторять?', en: 'What patterns repeat in past relationships? Which 3 mistakes do you not want to repeat?' },
  },
  {
    id: 'what_prevented',
    section: 'relations',
    req: true,
    type: 'textarea',
    text: { ru: 'Что больше всего мешало вам прийти к желаемым отношениям?', en: 'What has prevented you from having the relationship you desire most?' },
  },
  {
    id: 'want_to_change',
    section: 'relations',
    req: false,
    type: 'textarea',
    text: { ru: 'Что в своём поведении в отношениях хотели бы изменить?', en: 'What would you like to change about your behavior in relationships?' },
  },
  {
    id: 'children',
    section: 'relations',
    req: true,
    type: 'radio',
    text: { ru: 'Есть ли у вас дети?', en: 'Do you have children?' },
    options: {
      ru: ['Нет детей', 'Есть 1 ребёнок', 'Есть 2 ребёнка', 'Есть 3 и более детей'],
      en: ['No children', '1 child', '2 children', '3 or more children'],
    },
  },
  {
    id: 'children_ages',
    section: 'relations',
    req: false,
    type: 'text',
    text: { ru: 'Возраст ваших детей?', en: 'Ages of your children?' },
    skipIf: { id: 'children', value: 'Нет детей' },
  },
  {
    id: 'want_more_children',
    section: 'relations',
    req: true,
    type: 'radio',
    text: { ru: 'Хотите ли детей?', en: 'Do you want children?' },
    options: {
      ru: ['Точно да', 'Точно нет', 'Пока не решила/решил', 'Другое'],
      en: ['Definitely yes', 'Definitely no', "Haven't decided yet", 'Other'],
    },
    skipIf: { id: 'children', value: 'Нет детей' },
  },
  {
    id: 'man_with_children',
    section: 'relations',
    req: false,
    type: 'textarea',
    text: { ru: 'Рассматриваете ли партнёра с детьми? При каких условиях?', en: 'Would you consider a partner with children? Under what conditions?' },
  },

  // SECTION: career
  {
    id: 'occupation',
    section: 'career',
    req: false,
    type: 'text',
    text: { ru: 'Чем вы сейчас занимаетесь? (профессия)', en: 'What do you do now? (profession)' },
  },
  {
    id: 'role',
    section: 'career',
    req: true,
    type: 'radio',
    text: { ru: 'В какой роли вы сейчас?', en: 'What is your current role?' },
    options: {
      ru: ['Владелец/Владелица бизнеса', 'Руководитель', 'Наёмный специалист', 'Фриланс', 'В декрете', 'В поиске работы', 'Другое'],
      en: ['Business owner', 'Manager', 'Employee', 'Freelance', 'On maternity leave', 'Job seeking', 'Other'],
    },
  },
  {
    id: 'income',
    section: 'career',
    req: false,
    type: 'radio',
    text: { ru: 'Как вы оцениваете свой уровень дохода?', en: 'How do you assess your income level?' },
    options: {
      ru: ['Закрываю базовые расходы', 'Стабильный, средний', 'Высокий доход', 'Другое'],
      en: ['Covering basic expenses', 'Stable, average', 'High income', 'Other'],
    },
  },
  {
    id: 'finance_unacceptable',
    section: 'career',
    req: false,
    type: 'textarea',
    text: { ru: 'Что в финансах в паре для вас категорически недопустимо?', en: 'What financial aspects in a couple are absolutely unacceptable to you?' },
  },
  {
    id: 'ready_to_change_life',
    section: 'career',
    req: true,
    type: 'radio',
    text: { ru: 'Насколько готовы менять жизнь? (1 — совсем не готов/а, 10 — полностью готов/а)', en: 'How ready are you to change your life? (1 — not at all, 10 — fully ready)' },
    options: { ru: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], en: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  },
  {
    id: 'what_ready_to_change',
    section: 'career',
    req: true,
    type: 'textarea',
    text: { ru: 'Что готовы менять, а что точно нет?', en: 'What are you willing to change and what definitely not?' },
  },

  // SECTION: personality
  {
    id: 'introvert_extrovert',
    section: 'personality',
    req: false,
    type: 'radio',
    text: { ru: 'Вы интроверт или экстраверт?', en: 'Are you an introvert or extrovert?' },
    options: {
      ru: ['Интроверт', 'Экстраверт', 'Амбиверт'],
      en: ['Introvert', 'Extrovert', 'Ambivert'],
    },
  },
  {
    id: 'conflict_behavior',
    section: 'personality',
    req: true,
    type: 'radio',
    text: { ru: 'Как вы ведёте себя в конфликте?', en: 'How do you behave in a conflict?' },
    options: {
      ru: ['Замолкаю и ухожу', 'Говорю прямо сразу', 'Сначала обдумываю', 'Другое'],
      en: ['Go silent and leave', 'Speak directly right away', 'Think first', 'Other'],
    },
  },
  {
    id: '3_words',
    section: 'personality',
    req: true,
    type: 'text',
    text: { ru: 'Какими 3 словами описывают вас друзья?', en: 'What 3 words do your friends use to describe you?' },
  },
  {
    id: '3_strengths',
    section: 'personality',
    req: true,
    type: 'text',
    text: { ru: '3 сильные стороны в отношениях', en: '3 strengths in relationships' },
  },
  {
    id: '3_weaknesses',
    section: 'personality',
    req: false,
    type: 'text',
    text: { ru: '3 слабые стороны в отношениях', en: '3 weaknesses in relationships' },
  },
  {
    id: 'how_rest',
    section: 'personality',
    req: false,
    type: 'text',
    text: { ru: 'Как вы обычно отдыхаете?', en: 'How do you usually relax?' },
  },
  {
    id: 'attitude_control',
    section: 'personality',
    req: false,
    type: 'text',
    text: { ru: 'Ваше отношение к контролю и ревности?', en: 'Your attitude to control and jealousy?' },
  },
  {
    id: '3_values',
    section: 'personality',
    req: true,
    type: 'text',
    text: { ru: '3 обязательные ценности в отношениях', en: '3 essential values in relationships' },
  },
  {
    id: 'religion',
    section: 'personality',
    req: false,
    type: 'text',
    text: { ru: 'Религиозные убеждения и их важность в партнёре?', en: 'Religious beliefs and their importance in a partner?' },
  },
  {
    id: 'family_model',
    section: 'personality',
    req: false,
    type: 'text',
    text: { ru: 'Какую модель семьи считаете комфортной?', en: 'What family model do you consider comfortable?' },
  },

  // SECTION: international
  {
    id: 'languages',
    section: 'international',
    req: false,
    type: 'text',
    text: { ru: 'Уровень английского и других языков?', en: 'Level of English and other languages?' },
  },
  {
    id: 'exp_foreigners',
    section: 'international',
    req: true,
    type: 'radio',
    text: { ru: 'Был ли у вас опыт отношений с иностранцами?', en: 'Have you had experience in a relationship with foreigners?' },
    options: {
      ru: ['Да', 'Нет'],
      en: ['Yes', 'No'],
    },
  },
  {
    id: 'exp_foreigners_detail',
    section: 'international',
    req: false,
    type: 'textarea',
    text: { ru: 'Расскажите подробнее об опыте отношений с иностранцами', en: 'Tell us more about your experience with foreigners' },
    skipIf: { id: 'exp_foreigners', value: 'Нет' },
  },
  {
    id: 'countries_yes_no',
    section: 'international',
    req: true,
    type: 'textarea',
    text: { ru: 'В каких странах готовы жить, а в каких точно нет?', en: 'In which countries would you be willing to live, and in which definitely not?' },
  },
  {
    id: 'most_important_partner',
    section: 'international',
    req: true,
    type: 'radio',
    text: { ru: 'Что самое важное при выборе партнёра?', en: 'What is most important when choosing a partner?' },
    options: {
      ru: ['Гражданство', 'Страна эмиграции', 'Личные качества', 'Материальный уровень', 'Другое'],
      en: ['Citizenship', 'Country of emigration', 'Personal qualities', 'Financial level', 'Other'],
    },
  },
  {
    id: 'emigration_readiness',
    section: 'international',
    req: true,
    type: 'radio',
    text: { ru: 'Насколько готовы к эмиграции? (1 — совсем нет, 10 — полностью готов/а)', en: 'How ready are you to emigrate? (1 — not at all, 10 — fully ready)' },
    options: { ru: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], en: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  },
  {
    id: 'most_important_now',
    section: 'international',
    req: true,
    type: 'radio',
    text: { ru: 'Что для вас сейчас самое важное?', en: 'What is most important to you right now?' },
    options: {
      ru: ['Системный поиск', 'Перезапустить личную жизнь', 'Перевести онлайн в реал', 'Другое'],
      en: ['Systematic search', 'Restart personal life', 'Move from online to real', 'Other'],
    },
  },
  {
    id: 'picture_1_year',
    section: 'international',
    req: true,
    type: 'textarea',
    text: { ru: 'Представьте вашу жизнь через год: с кем вы, где, как выглядит ваш день?', en: 'Imagine your life in 1 year: who are you with, where, what does your day look like?' },
  },
  {
    id: 'fears_international',
    section: 'international',
    req: false,
    type: 'textarea',
    text: { ru: 'Какие страхи есть в международных знакомствах?', en: 'What fears do you have about international dating?' },
  },

  // SECTION: partner
  {
    id: 'doubts_oksana',
    section: 'partner',
    req: true,
    type: 'textarea',
    text: { ru: 'Какие есть сомнения в работе с нашим агентством?', en: 'What doubts do you have about working with our agency?' },
  },
  {
    id: 'confidence',
    section: 'partner',
    req: true,
    type: 'textarea',
    text: { ru: 'Что придаёт уверенность, что всё получится?', en: 'What gives you confidence that everything will work out?' },
  },
  {
    id: 'age_range',
    section: 'partner',
    req: false,
    type: 'text',
    text: { ru: 'Комфортный возраст партнёра?', en: 'Comfortable age range for a partner?' },
  },
  {
    id: 'appearance_req',
    section: 'partner',
    req: false,
    type: 'text',
    text: { ru: 'Требования к внешности партнёра (рост, вес)?', en: "Requirements for partner's appearance (height, weight)?" },
  },
  {
    id: 'min_living_standard',
    section: 'partner',
    req: false,
    type: 'textarea',
    text: { ru: 'Минимальный приемлемый уровень жизни партнёра?', en: "Minimum acceptable living standard for a partner?" },
  },
  {
    id: 'unacceptable_character',
    section: 'partner',
    req: true,
    type: 'text',
    text: { ru: 'С какой чертой характера точно не готовы мириться?', en: 'Which character trait are you definitely not willing to accept?' },
  },
  {
    id: '3_qualities_man',
    section: 'partner',
    req: true,
    type: 'text',
    text: { ru: '3 особенно важных качества партнёра', en: '3 especially important qualities of a partner' },
  },
  {
    id: 'red_flags',
    section: 'partner',
    req: false,
    type: 'textarea',
    text: { ru: 'Ваши «красные флаги» в начале общения?', en: 'Your "red flags" at the beginning of communication?' },
  },
  {
    id: 'unacceptable_conditions',
    section: 'partner',
    req: false,
    type: 'textarea',
    text: { ru: 'Что неприемлемо ни при каких условиях?', en: 'What is unacceptable under any circumstances?' },
  },
  {
    id: 'abuse_experience',
    section: 'partner',
    req: false,
    type: 'textarea',
    text: { ru: 'Опыт насилия или абьюза (можно пропустить)', en: 'Experience of violence or abuse (optional)' },
  },

  // SECTION: final
  {
    id: 'time_to_emigrate',
    section: 'final',
    req: true,
    type: 'radio',
    text: { ru: 'Через какое время готовы эмигрировать?', en: 'How soon are you ready to emigrate?' },
    options: {
      ru: ['В течение года', 'В течение 1-3 лет', 'Другое'],
      en: ['Within a year', 'Within 1-3 years', 'Other'],
    },
  },
  {
    id: 'holds_back',
    section: 'final',
    req: true,
    type: 'textarea',
    text: { ru: 'Что сейчас больше всего удерживает вас в стране?', en: 'What is keeping you in your country the most right now?' },
  },
  {
    id: 'reason_to_move',
    section: 'final',
    req: true,
    type: 'textarea',
    text: { ru: 'Главная причина переезда в другую страну?', en: 'Main reason for moving to another country?' },
  },
  {
    id: 'anything_else',
    section: 'final',
    req: false,
    type: 'textarea',
    text: { ru: 'Есть ли что-то ещё, что важно знать о вас?', en: 'Is there anything else important to know about you?' },
  },
  {
    id: 'tg_channel',
    section: 'final',
    req: true,
    type: 'radio',
    text: { ru: 'Подписка на Telegram-канал об интернациональных отношениях?', en: 'Subscription to the Telegram channel about international relationships?' },
    options: {
      ru: ['Уже подписан/а', 'Обязательно подпишусь'],
      en: ['Already subscribed', 'Will subscribe'],
    },
  },
  {
    id: 'consent',
    section: 'final',
    req: true,
    type: 'radio',
    text: { ru: 'Согласие на обработку персональных данных', en: 'Consent to personal data processing' },
    hint: {
      ru: 'Ознакомьтесь с политикой: https://606.su/ojrq',
      en: 'Read the policy: https://606.su/ojrq',
    },
    options: {
      ru: ['Ознакомлен/а и даю согласие'],
      en: ['I have read and give consent'],
    },
  },
];

// ─── UI TEXTS ─────────────────────────────────────────────────────────────────
const UI = {
  ru: {
    appName: 'Международный клуб знакомств',
    subtitle: 'Анкета участника',
    start: 'Начать заполнение анкеты',
    startDesc: 'Заполните анкету, чтобы мы могли подобрать вам идеального партнёра',
    next: 'Далее',
    back: 'Назад',
    submit: 'Отправить анкету',
    submitting: 'Отправка...',
    required: 'Обязательное поле',
    answered: 'Отвечено',
    of: 'из',
    section: 'Раздел',
    sectionOf: 'из',
    yourAnswer: 'Ваш ответ...',
    photoUpload: 'Нажмите для загрузки фото',
    photoCount: (n: number) => `Загружено фото: ${n}`,
    photoMin: (n: number) => `Минимум ${n} фото`,
    removePhoto: 'Удалить',
    successTitle: 'Анкета отправлена!',
    successText: 'Я свяжусь с вами в ближайшее время. Спасибо за ваше время и доверие!',
    contacts: 'Наши контакты:',
    tg: 'TG: @oksana_my_life',
    wa: 'WA / MAX / IMO: +79037991521',
    tgChannel: 'TG канал: @marry_international',
    maxChannel: 'MAX канал: http://6max.ru/oksana',
    invalidDate: 'Введите дату в формате дд.мм.гггг',
    invalidHeight: 'Рост должен быть от 130 до 220 см',
    invalidWeight: 'Вес должен быть от 30 до 200 кг',
    invalidName: 'Введите полное имя (минимум 2 слова)',
    invalidTimezone: 'Укажите часовой пояс (например: UTC+3, удобно 10-20)',
    photoMinError: (n: number) => `Необходимо загрузить минимум ${n} фото`,
    theme: 'Тема',
    lang: 'EN',
    optional: 'Необязательно',
    complete: 'Завершено',
    progress: 'Прогресс',
    fillRequired: 'Пожалуйста, заполните все обязательные поля',
  },
  en: {
    appName: 'International Matchmaking Club',
    subtitle: 'Participant Questionnaire',
    start: 'Start filling out the questionnaire',
    startDesc: 'Fill out the questionnaire so we can find your perfect partner',
    next: 'Next',
    back: 'Back',
    submit: 'Submit questionnaire',
    submitting: 'Submitting...',
    required: 'Required field',
    answered: 'Answered',
    of: 'of',
    section: 'Section',
    sectionOf: 'of',
    yourAnswer: 'Your answer...',
    photoUpload: 'Click to upload photos',
    photoCount: (n: number) => `Photos uploaded: ${n}`,
    photoMin: (n: number) => `Minimum ${n} photos`,
    removePhoto: 'Remove',
    successTitle: 'Questionnaire submitted!',
    successText: 'I will contact you as soon as possible. Thank you for your time and trust!',
    contacts: 'Our contacts:',
    tg: 'TG: @oksana_my_life',
    wa: 'WA / MAX / IMO: +79037991521',
    tgChannel: 'TG channel: @marry_international',
    maxChannel: 'MAX channel: http://6max.ru/oksana',
    invalidDate: 'Please enter date in dd.mm.yyyy format',
    invalidHeight: 'Height must be between 130 and 220 cm',
    invalidWeight: 'Weight must be between 30 and 200 kg',
    invalidName: 'Please enter your full name (minimum 2 words)',
    invalidTimezone: 'Please specify timezone (e.g.: UTC+3, available 10am-8pm)',
    photoMinError: (n: number) => `Please upload at least ${n} photos`,
    theme: 'Theme',
    lang: 'RU',
    optional: 'Optional',
    complete: 'Complete',
    progress: 'Progress',
    fillRequired: 'Please fill in all required fields',
  },
};

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function validateField(q: Question, value: string | string[] | File[], lang: Language, photoFiles: File[]): string | null {
  const t = UI[lang];
  const strVal = typeof value === 'string' ? value.trim() : '';

  if (q.type === 'file') {
    if (q.req && photoFiles.length === 0) return t.required;
    if (q.minPhotos && photoFiles.length < q.minPhotos) return t.photoMinError(q.minPhotos);
    return null;
  }

  if (q.req) {
    if (Array.isArray(value) && value.length === 0) return t.required;
    if (!strVal && !Array.isArray(value)) return t.required;
  } else if (!strVal && !(Array.isArray(value) && value.length > 0)) {
    return null;
  }

  if (q.id === 'dob' && strVal) {
    const dateRe = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRe.test(strVal)) return t.invalidDate;
    const [d, m, y] = strVal.split('.').map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return t.invalidDate;
    const age = new Date().getFullYear() - y;
    if (age < 18) return lang === 'ru' ? 'Вам должно быть не менее 18 лет' : 'You must be at least 18 years old';
  }

  if (q.id === 'height' && strVal) {
    const h = parseFloat(strVal);
    if (isNaN(h) || h < 130 || h > 220) return t.invalidHeight;
  }

  if (q.id === 'weight' && strVal) {
    const w = parseFloat(strVal);
    if (isNaN(w) || w < 30 || w > 200) return t.invalidWeight;
  }

  if (q.id === 'name' && strVal) {
    const parts = strVal.trim().split(/\s+/);
    if (parts.length < 2) return t.invalidName;
  }

  if (q.id === 'timezone' && strVal) {
    if (strVal.length < 4) return t.invalidTimezone;
  }

  return null;
}

// ─── LOGO SVG ────────────────────────────────────────────────────────────────
function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      {/* Two hearts */}
      <path
        d="M35 42 C35 38 30 34 26 38 C22 42 26 48 35 55 C44 48 48 42 44 38 C40 34 35 38 35 42Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M65 42 C65 38 60 34 56 38 C52 42 56 48 65 55 C74 48 78 42 74 38 C70 34 65 38 65 42Z"
        fill="white"
        opacity="0.9"
      />
      {/* Globe lines */}
      <ellipse cx="50" cy="72" rx="18" ry="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
      <line x1="50" y1="64" x2="50" y2="80" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="32" y1="72" x2="68" y2="72" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
      title="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

// ─── LANG TOGGLE ─────────────────────────────────────────────────────────────
function LangToggle({ lang, toggle }: { lang: Language; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95"
      style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)', color: 'white' }}
    >
      {lang === 'ru' ? 'EN' : 'RU'}
    </button>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ value, max, theme }: { value: number; max: number; theme: Theme }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full">
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #f472b6, #9333ea)',
          }}
        />
      </div>
      <div className="text-right text-xs mt-0.5 opacity-60">{pct}%</div>
    </div>
  );
}

// ─── PHOTO UPLOAD ────────────────────────────────────────────────────────────
function PhotoUpload({
  files,
  previews,
  onAdd,
  onRemove,
  t,
  theme,
  minPhotos,
  error,
}: {
  files: File[];
  previews: string[];
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
  t: typeof UI.ru;
  theme: Theme;
  minPhotos?: number;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      {minPhotos && (
        <p className="text-xs opacity-60">{t.photoMin(minPhotos)}</p>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          borderColor: error ? '#f87171' : isDark ? 'rgba(244,114,182,0.4)' : 'rgba(147,51,234,0.3)',
          background: isDark ? 'rgba(244,114,182,0.05)' : 'rgba(147,51,234,0.03)',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#f472b6' : '#9333ea'} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-sm" style={{ color: isDark ? '#f472b6' : '#9333ea' }}>{t.photoUpload}</span>
          <span className="text-xs opacity-50">{t.photoCount(files.length)}</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onAdd}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
              >
                {t.removePhoto}
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── QUESTION FIELD ───────────────────────────────────────────────────────────
function QuestionField({
  q,
  lang,
  theme,
  value,
  error,
  photoFiles,
  photoPreviews,
  onChange,
  onPhotoAdd,
  onPhotoRemove,
  t,
}: {
  q: Question;
  lang: Language;
  theme: Theme;
  value: string | string[] | File[] | undefined;
  error?: string;
  photoFiles: File[];
  photoPreviews: string[];
  onChange: (id: string, val: string) => void;
  onPhotoAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (i: number) => void;
  t: typeof UI.ru;
}) {
  const isDark = theme === 'dark';
  const strVal = typeof value === 'string' ? value : '';
  const options = q.options?.[lang] || [];

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 resize-none ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-pink-400/60 focus:bg-white/10'
      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
  } ${error ? (isDark ? 'border-red-400/60' : 'border-red-300') : ''}`;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-1">
        <span className={`text-sm font-medium leading-snug ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {q.text[lang]}
        </span>
        {q.req && <span className="text-pink-500 text-sm ml-0.5 flex-shrink-0">*</span>}
        {!q.req && (
          <span className="ml-1 text-xs opacity-40 flex-shrink-0 mt-0.5">({t.optional})</span>
        )}
      </div>

      {q.hint && (
        <p className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          {q.hint[lang]}
        </p>
      )}

      {/* TEXT */}
      {q.type === 'text' && (
        <input
          type="text"
          value={strVal}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder={t.yourAnswer}
          className={inputClass}
        />
      )}

      {/* EMAIL */}
      {q.type === 'email' && (
        <input
          type="email"
          value={strVal}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder="example@mail.com"
          className={inputClass}
        />
      )}

      {/* TEXTAREA */}
      {q.type === 'textarea' && (
        <textarea
          value={strVal}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder={t.yourAnswer}
          rows={3}
          className={inputClass}
        />
      )}

      {/* RADIO */}
      {q.type === 'radio' && (
        <div className="space-y-2">
          {options.map((opt) => {
            const selected = strVal === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(q.id, opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                  selected
                    ? 'border-transparent text-white'
                    : isDark
                    ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/50'
                }`}
                style={
                  selected
                    ? { background: 'linear-gradient(135deg, #f472b6, #9333ea)', borderColor: 'transparent' }
                    : {}
                }
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={
                      selected
                        ? { borderColor: 'white', background: 'white' }
                        : { borderColor: isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db' }
                    }
                  >
                    {selected && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)' }}
                      />
                    )}
                  </span>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* SCALE (same as radio but horizontal) */}
      {q.type === 'scale' && (
        <div className="flex gap-1.5 flex-wrap">
          {options.map((opt) => {
            const selected = strVal === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(q.id, opt)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  selected ? 'text-white scale-110' : isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                }`}
                style={selected ? { background: 'linear-gradient(135deg, #f472b6, #9333ea)' } : {}}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* FILE */}
      {q.type === 'file' && (
        <PhotoUpload
          files={photoFiles}
          previews={photoPreviews}
          onAdd={onPhotoAdd}
          onRemove={onPhotoRemove}
          t={t}
          theme={theme}
          minPhotos={q.minPhotos}
          error={error}
        />
      )}

      {error && q.type !== 'file' && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ lang, theme, onStart }: { lang: Language; theme: Theme; onStart: () => void }) {
  const t = UI[lang];
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-1 rounded-3xl" style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)' }}>
            <div
              className="rounded-3xl p-2"
              style={{ background: isDark ? '#1a1a2e' : 'white' }}
            >
              <Logo size={72} />
            </div>
          </div>
          <div>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {t.appName}
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{t.subtitle}</p>
          </div>
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-5 text-left space-y-3"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(147,51,234,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(147,51,234,0.12)',
          }}
        >
          <p className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{t.startDesc}</p>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)' }}
            />
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              {SECTIONS.length} {lang === 'ru' ? 'разделов' : 'sections'} · {QUESTIONS.length} {lang === 'ru' ? 'вопросов' : 'questions'}
            </p>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #f472b6, #9333ea)',
            boxShadow: '0 8px 24px rgba(147,51,234,0.35)',
          }}
        >
          {t.start}
        </button>

        {/* Contacts */}
        <div className={`text-xs space-y-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
          <p>TG: @oksana_my_life · WA: +79037991521</p>
          <p>@marry_international · 6max.ru/oksana</p>
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen({ lang, theme }: { lang: Language; theme: Theme }) {
  const t = UI[lang];
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Check icon */}
        <div className="flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)' }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <h2
            className="text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {t.successTitle}
          </h2>
          <p className={`text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            {t.successText}
          </p>
        </div>

        <div
          className="rounded-2xl p-5 text-left space-y-2"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(147,51,234,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(147,51,234,0.12)',
          }}
        >
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-pink-400' : 'text-purple-600'}`}>
            {t.contacts}
          </p>
          {[t.tg, t.wa, t.tgChannel, t.maxChannel].map((c) => (
            <p key={c} className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{c}</p>
          ))}
        </div>

        <div className="flex justify-center">
          <Logo size={40} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('light');
  const [view, setView] = useState<'intro' | 'form' | 'success'>('intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const t = UI[lang];
  const isDark = theme === 'dark';

  // Init Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const colorScheme = tg.colorScheme;
      if (colorScheme === 'dark') setTheme('dark');
    }
  }, []);

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('imatch_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || {});
        setCurrentSection(parsed.section || 0);
        setLang(parsed.lang || 'ru');
      }
    } catch {}
  }, []);

  // Auto-save
  useEffect(() => {
    if (view === 'form') {
      try {
        localStorage.setItem('imatch_form', JSON.stringify({ formData, section: currentSection, lang }));
      } catch {}
    }
  }, [formData, currentSection, lang, view]);

  // Get visible questions for current section
  const getVisibleQuestions = useCallback(
    (sectionId: string) => {
      return QUESTIONS.filter((q) => {
        if (q.section !== sectionId) return false;
        if (!q.skipIf) return true;
        const depVal = formData[q.skipIf.id];
        const skipVals = Array.isArray(q.skipIf.value) ? q.skipIf.value : [q.skipIf.value];
        // Show question unless the skip condition is met
        if (typeof depVal === 'string') {
          return !skipVals.includes(depVal);
        }
        return true;
      });
    },
    [formData]
  );

  const section = SECTIONS[currentSection];
  const sectionQuestions = getVisibleQuestions(section.id);

  // Totals for progress
  const totalAnswered = QUESTIONS.filter((q) => {
    const val = formData[q.id];
    if (q.type === 'file') return photoFiles.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return val && String(val).trim() !== '';
  }).length;

  const handleChange = (id: string, val: string) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const combined = [...photoFiles, ...files].slice(0, 10);
    setPhotoFiles(combined);
    const previews = combined.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(previews);
    setErrors((prev) => {
      const next = { ...prev };
      delete next['photos'];
      return next;
    });
  };

  const handlePhotoRemove = (i: number) => {
    const newFiles = photoFiles.filter((_, idx) => idx !== i);
    const newPreviews = photoPreviews.filter((_, idx) => idx !== i);
    setPhotoFiles(newFiles);
    setPhotoPreviews(newPreviews);
  };

  const validateSection = () => {
    const newErrors: Record<string, string> = {};
    for (const q of sectionQuestions) {
      if (!q.req) continue;
      const val = formData[q.id] ?? '';
      const err = validateField(q, val, lang, photoFiles);
      if (err) newErrors[q.id] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSection()) return;
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection((s) => s + 1);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate submission (in real app, send to bot via Telegram.WebApp.sendData)
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.sendData) {
        const payload = JSON.stringify({ ...formData, photos_count: photoFiles.length });
        tg.sendData(payload);
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    localStorage.removeItem('imatch_form');
    setView('success');
  };

  // Section completion check
  const isSectionComplete = (sId: string) => {
    const qs = getVisibleQuestions(sId);
    return qs.every((q) => {
      if (!q.req) return true;
      const val = formData[q.id];
      if (q.type === 'file') return photoFiles.length >= (q.minPhotos || 1);
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      return false;
    });
  };

  // ─── BACKGROUND ────────────────────────────────────────────────────────────
  const bgStyle = isDark
    ? { background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)' }
    : { background: 'linear-gradient(160deg, #fdf4ff 0%, #f5f0ff 50%, #fff0f7 100%)' };

  const cardStyle = isDark
    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(147,51,234,0.1)', backdropFilter: 'blur(12px)' };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ ...bgStyle, color: isDark ? 'white' : '#1a1a2e', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Top ref for scroll */}
      <div ref={topRef} />

      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: isDark ? 'rgba(15,15,26,0.92)' : 'rgba(253,244,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(147,51,234,0.1)',
        }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {view === 'form' && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(147,51,234,0.08)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
              <Logo size={28} />
              <div>
                <div
                  className="text-sm font-bold leading-none"
                  style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {t.appName}
                </div>
                {view === 'form' && (
                  <div className="text-xs opacity-50 mt-0.5">
                    {t.answered}: {totalAnswered} {t.of} {QUESTIONS.length}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LangToggle lang={lang} toggle={() => setLang((l) => (l === 'ru' ? 'en' : 'ru'))} />
              <ThemeToggle theme={theme} toggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
            </div>
          </div>

          {view === 'form' && (
            <ProgressBar value={totalAnswered} max={QUESTIONS.length} theme={theme} />
          )}
        </div>
      </div>

      {/* Side menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full overflow-y-auto p-4 flex flex-col gap-2"
            style={isDark
              ? { background: '#0f0f1a', borderRight: '1px solid rgba(255,255,255,0.08)' }
              : { background: '#fdf4ff', borderRight: '1px solid rgba(147,51,234,0.12)' }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(147,51,234,0.1)' }}>
              <Logo size={28} />
              <span className="font-semibold text-sm">{t.appName}</span>
            </div>
            {SECTIONS.map((s, i) => {
              const complete = isSectionComplete(s.id);
              const active = i === currentSection;
              return (
                <button
                  key={s.id}
                  onClick={() => { setCurrentSection(i); setShowMenu(false); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all text-sm"
                  style={
                    active
                      ? { background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(147,51,234,0.2))', color: isDark ? '#f472b6' : '#9333ea' }
                      : { background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
                  }
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="flex-1">{s.title[lang]}</span>
                  {complete && (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #f472b6, #9333ea)' }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        {view === 'intro' && (
          <IntroScreen lang={lang} theme={theme} onStart={() => setView('form')} />
        )}

        {view === 'success' && <SuccessScreen lang={lang} theme={theme} />}

        {view === 'form' && (
          <div className="pt-6 space-y-4">
            {/* Section header */}
            <div
              className="rounded-2xl px-5 py-4"
              style={cardStyle}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h2 className="font-bold text-base leading-tight">{section.title[lang]}</h2>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                      {section.description[lang]}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: isDark ? 'rgba(244,114,182,0.15)' : 'rgba(147,51,234,0.08)', color: isDark ? '#f472b6' : '#9333ea' }}
                >
                  {currentSection + 1}/{SECTIONS.length}
                </span>
              </div>

              {/* Section pills */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {SECTIONS.map((s, i) => {
                  const complete = isSectionComplete(s.id);
                  const active = i === currentSection;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSection(i)}
                      className="text-xs px-2 py-1 rounded-lg transition-all"
                      style={
                        active
                          ? { background: 'linear-gradient(135deg, #f472b6, #9333ea)', color: 'white' }
                          : complete
                          ? { background: isDark ? 'rgba(244,114,182,0.15)' : 'rgba(147,51,234,0.1)', color: isDark ? '#f472b6' : '#9333ea' }
                          : { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }
                      }
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {sectionQuestions.map((q, qi) => (
                <div
                  key={q.id}
                  className="rounded-2xl px-5 py-4 space-y-1"
                  style={cardStyle}
                >
                  <div className={`text-xs mb-2 font-medium ${isDark ? 'text-pink-400/70' : 'text-purple-400'}`}>
                    {qi + 1}
                  </div>
                  <QuestionField
                    q={q}
                    lang={lang}
                    theme={theme}
                    value={formData[q.id]}
                    error={errors[q.id]}
                    photoFiles={photoFiles}
                    photoPreviews={photoPreviews}
                    onChange={handleChange}
                    onPhotoAdd={handlePhotoAdd}
                    onPhotoRemove={handlePhotoRemove}
                    t={t}
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {currentSection > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(147,51,234,0.08)',
                    color: isDark ? 'rgba(255,255,255,0.8)' : '#9333ea',
                  }}
                >
                  {t.back}
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex-[2] py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #f472b6, #9333ea)',
                  boxShadow: '0 6px 20px rgba(147,51,234,0.3)',
                }}
              >
                {submitting
                  ? t.submitting
                  : currentSection === SECTIONS.length - 1
                  ? t.submit
                  : t.next}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
