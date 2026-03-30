const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'MedApp2026_Secret_Key_For_Production_Use_Only', {
    expiresIn: '7d'
  });
};

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, iin } = req.body;

    // Проверка обязательных полей
    if (!name || !email || !password || !phone || !iin) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля'
      });
    }

    // Проверка, существует ли пользователь
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание нового пользователя
    user = await User.create({
      name,
      email,
      password,
      phone,
      iin
    });

    // Генерация токена
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        iin: user.iin
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при регистрации'
    });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, введите email и пароль'
      });
    }

    // Поиск пользователя и проверка пароля
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Генерация токена
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Вход успешен',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        iin: user.iin
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе'
    });
  }
});

// Получить текущего пользователя
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        iin: user.iin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя'
    });
  }
});

// Обновить профиль
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Профиль обновлен',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        iin: user.iin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении профиля'
    });
  }
});

// Прикрепить пользователя к больнице
router.post('/attach-hospital', authMiddleware, async (req, res) => {
  try {
    const { hospitalId } = req.body;

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите ID больницы'
      });
    }

    // Обновляем пользователя: заменяем массив больниц на одну
    const user = await User.findByIdAndUpdate(
      req.userId,
      { hospitals: [hospitalId] }, // Заменяем массив на новую больницу
      { new: true }
    ).populate('hospitals');

    res.status(200).json({
      success: true,
      message: 'Вы успешно прикреплены к больнице',
      hospital: user.hospitals[0]
    });
  } catch (error) {
    console.error('Ошибка при прикреплении:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при прикреплении к больнице'
    });
  }
});

// Получить прикреплённую больницу пользователя
router.get('/attached-hospital', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('hospitals');

    if (!user || !user.hospitals || user.hospitals.length === 0) {
      return res.status(200).json({
        success: true,
        hospital: null
      });
    }

    res.status(200).json({
      success: true,
      hospital: user.hospitals[0]
    });
  } catch (error) {
    console.error('Ошибка при получении больницы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении информации о больнице'
    });
  }
});

module.exports = router;
