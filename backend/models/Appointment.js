const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Выберите пользователя']
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Выберите больницу']
    },
    doctor: {
      type: String,
      required: [true, 'Введите имя врача'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Выберите отделение'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Выберите дату приема']
    },
    time: {
      type: String,
      required: [true, 'Выберите время приема']
    },
    complaint: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
