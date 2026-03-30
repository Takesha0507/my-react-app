const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();

const seedHospitals = [
  {
    name: 'Национальный научный медицинский центр',
    city: 'Астана',
    address: 'пр. Абылай хана, 42',
    phone: '+7 (7172) 69-71-98',
    email: 'info@nnmc.kz',
    description: 'Многопрофильный государственный медицинский центр',
    website: 'https://nnmc.kz',
    rating: 4.8,
    departments: [
      { name: 'Хирургия', specialization: 'Общая хирургия' },
      { name: 'Кардиология', specialization: 'Кардиоваскулярные заболевания' },
      { name: 'Неврология', specialization: 'Неврологические расстройства' }
    ],
    workingHours: 'Круглосуточно',
    type: 'Многопрофильный',
    reviews: 312,
    tags: ['Хирургия', 'Кардиология', 'Неврология']
  },
  {
    name: 'Городская больница №2',
    city: 'Астана',
    address: 'ул. Бейбитшилик, 54',
    phone: '+7 (7172) 32-44-78',
    email: 'info@gb2.kz',
    description: 'Государственная многопрофильная больница',
    website: 'https://gb2.kz',
    rating: 4.2,
    departments: [
      { name: 'Терапия', specialization: 'Внутренние болезни' },
      { name: 'Хирургия', specialization: 'Общая хирургия' },
      { name: 'Педиатрия', specialization: 'Детские болезни' }
    ],
    workingHours: 'Круглосуточно',
    type: 'Государственная',
    reviews: 187,
    tags: ['Терапия', 'Хирургия', 'Педиатрия']
  },
  {
    name: 'Alanda Clinic',
    city: 'Астана',
    address: 'пр. Тауелсыздык, 33',
    phone: '+7 (7172) 51-53-00',
    email: 'info@alandaclinic.kz',
    description: 'Частная клиника с современным оборудованием',
    website: 'https://alandaclinic.kz',
    rating: 4.7,
    departments: [
      { name: 'Косметология', specialization: 'Эстетическая медицина' },
      { name: 'Гинекология', specialization: 'Женское здоровье' },
      { name: 'УЗИ', specialization: 'Ультразвуковая диагностика' }
    ],
    workingHours: 'Пн–Сб 8:00–20:00',
    type: 'Частная',
    reviews: 254,
    tags: ['Косметология', 'Гинекология', 'УЗИ']
  },
  {
    name: 'Stanford Medical Clinic',
    city: 'Астана',
    address: 'пр. Кабанбай батыра, 28',
    phone: '+7 (7172) 51-53-53',
    email: 'info@stanford-med.kz',
    description: 'Международная клиника высокого уровня',
    website: 'https://stanford-med.kz',
    rating: 4.6,
    departments: [
      { name: 'Диагностика', specialization: 'Комплексное обследование' },
      { name: 'Терапия', specialization: 'Внутренние болезни' },
      { name: 'Эндокринология', specialization: 'Заболевания эндокринной системы' }
    ],
    workingHours: 'Пн–Пт 9:00–19:00',
    type: 'Частная',
    reviews: 198,
    tags: ['Диагностика', 'Терапия', 'Эндокринология']
  },
  {
    name: 'НЦМД — Центр материнства и детства',
    city: 'Астана',
    address: 'пр. Туран, 34/1',
    phone: '+7 (7172) 79-36-23',
    email: 'info@mcm.kz',
    description: 'Специализированный центр для матерей и детей',
    website: 'https://mc.kz',
    rating: 4.5,
    departments: [
      { name: 'Педиатрия', specialization: 'Детские болезни' },
      { name: 'Роддом', specialization: 'Родовспоможение' },
      { name: 'Неонатология', specialization: 'Уход за новорожденными' }
    ],
    workingHours: 'Круглосуточно',
    type: 'Государственная',
    reviews: 423,
    tags: ['Педиатрия', 'Роддом', 'Неонатология']
  },
  {
    name: 'Tesla-Med Диагностический центр',
    city: 'Астана',
    address: 'ул. Петрова, 30',
    phone: '+7 (700) 836-91-77',
    email: 'info@tesla-med.kz',
    description: 'Центр современной диагностики с новейшим оборудованием',
    website: 'https://tesla-med.kz',
    rating: 4.9,
    departments: [
      { name: 'МРТ', specialization: 'Магнитно-резонансная томография' },
      { name: 'КТ', specialization: 'Компьютерная томография' },
      { name: 'УЗИ', specialization: 'Ультразвуковая диагностика' }
    ],
    workingHours: 'Круглосуточно',
    type: 'Частная',
    reviews: 341,
    tags: ['МРТ', 'КТ', 'УЗИ']
  },
  {
    name: 'Медицинский центр Самрук',
    city: 'Астана',
    address: 'пр. Кабанбай батыра, 58Б',
    phone: '+7 (701) 026-94-54',
    email: 'info@samruk-med.kz',
    description: 'Современный медицинский центр с доступными ценами',
    website: 'https://samruk-med.kz',
    rating: 4.4,
    departments: [
      { name: 'Терапия', specialization: 'Внутренние болезни' },
      { name: 'Лабораторная диагностика', specialization: 'Анализы и тесты' }
    ],
    workingHours: 'Пн–Сб 8:00–21:00',
    type: 'Частная',
    reviews: 134,
    tags: ['Терапия', 'Лабораторная диагностика']
  },
  {
    name: 'НЦТО им. академика Батпенова',
    city: 'Астана',
    address: 'ул. Кенесары, 82',
    phone: '+7 (7172) 69-71-99',
    email: 'info@ncto.kz',
    description: 'Центр травматологии и ортопедии',
    website: 'https://ncto.kz',
    rating: 4.6,
    departments: [
      { name: 'Травматология', specialization: 'Лечение травм' },
      { name: 'Ортопедия', specialization: 'Заболевания опорно-двигательного аппарата' },
      { name: 'Реабилитация', specialization: 'Восстановительное лечение' }
    ],
    workingHours: 'Пн–Пт 8:00–18:00',
    type: 'Государственная',
    reviews: 276,
    tags: ['Травматология', 'Ортопедия', 'Реабилитация']
  }
];

const seedDatabase = async () => {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Подключено к MongoDB');

    // Очищаем коллекцию больниц
    await Hospital.deleteMany({});
    console.log('🗑️  Коллекция больниц очищена');

    // Вставляем тестовые данные
    const hospitals = await Hospital.insertMany(seedHospitals);
    console.log(`✅ Добавлено ${hospitals.length} больниц`);

    console.log('\n📋 Добавленные больницы:');
    hospitals.forEach((h, idx) => {
      console.log(`${idx + 1}. ${h.name} (${h.city}) - Рейтинг: ${h.rating}`);
    });

    console.log('\n✨ Seed завершен успешно!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при seed:', error);
    process.exit(1);
  }
};

// Запускаем seed
seedDatabase();
