const express = require('express');
const Hospital = require('../models/Hospital');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Получить все больницы
router.get('/', async (req, res) => {
  try {
    const { city, rating, search } = req.query;

    let query = {};

    if (city) {
      query.city = city;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const hospitals = await Hospital.find(query).populate('users', 'name email');

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении больниц'
    });
  }
});

// Получить одну больницу
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('users', 'name email');

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Больница не найдена'
      });
    }

    res.status(200).json({
      success: true,
      hospital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных больницы'
    });
  }
});

// Создать больницу (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, city, address, phone, email, description, website, departments, workingHours } = req.body;

    if (!name || !city || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните обязательные поля'
      });
    }

    const hospital = await Hospital.create({
      name,
      city,
      address,
      phone,
      email,
      description,
      website,
      departments,
      workingHours
    });

    res.status(201).json({
      success: true,
      message: 'Больница создана',
      hospital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при создании больницы'
    });
  }
});

// Обновить больницу (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Больница не найдена'
      });
    }

    hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Больница обновлена',
      hospital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении больницы'
    });
  }
});

// Удалить больницу (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Больница не найдена'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Больница удалена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении больницы'
    });
  }
});

module.exports = router;
