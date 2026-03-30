const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Введите название больницы'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Введите город']
    },
    address: {
      type: String,
      required: [true, 'Введите адрес']
    },
    phone: {
      type: String,
      required: [true, 'Введите номер телефона']
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Введите корректный email']
    },
    description: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Введите корректный URL']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    departments: [{
      name: String,
      specialization: String
    }],
    workingHours: {
      type: String,
      default: '09:00 - 18:00'
    },
    type: {
      type: String,
      enum: ['Государственная', 'Частная', 'Многопрофильный'],
      default: 'Государственная'
    },
    reviews: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String
    }],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
