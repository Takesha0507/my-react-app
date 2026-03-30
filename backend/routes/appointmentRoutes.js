const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Получить все приёмы пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId })
      .populate('hospital', 'name city address phone')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении приёмов'
    });
  }
});

// Получить приём по ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('hospital', 'name city address phone')
      .populate('user', 'name email phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Приём не найден'
      });
    }

    // Проверить, является ли пользователь владельцем приёма
    if (appointment.user._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении приёма'
    });
  }
});

// Создать приём
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { hospital, doctor, department, date, time, complaint } = req.body;

    if (!hospital || !doctor || !department || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните обязательные поля'
      });
    }

    const appointment = await Appointment.create({
      user: req.userId,
      hospital,
      doctor,
      department,
      date,
      time,
      complaint
    });

    // Добавить приём в массив приёмов пользователя
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { appointments: appointment._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Приём создан',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при создании приёма'
    });
  }
});

// Обновить приём
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Приём не найден'
      });
    }

    // Проверить, является ли пользователь владельцем приёма
    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Приём обновлен',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении приёма'
    });
  }
});

// Отменить приём
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Приём не найден'
      });
    }

    // Проверить, является ли пользователь владельцем приёма
    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    // Удалить приём из массива приёмов пользователя
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { appointments: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Приём отменен'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при отмене приёма'
    });
  }
});

module.exports = router;
