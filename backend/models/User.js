const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Введите полное имя'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Введите email'],
      unique: [true, 'Email уже зарегистрирован'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Введите корректный email']
    },
    password: {
      type: String,
      required: [true, 'Введите пароль'],
      minlength: [6, 'Пароль должен быть не менее 6 символов'],
      select: false // По умолчанию не выбирать пароль
    },
    phone: {
      type: String,
      required: [true, 'Введите номер телефона']
    },
    iin: {
      type: String,
      required: [true, 'Введите ИИН'],
      unique: [true, 'ИИН уже зарегистрирован'],
      match: [/^\d{12}$/, 'ИИН должен состоять из 12 цифр']
    },
    hospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
      }
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      }
    ]
  },
  { timestamps: true }
);

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  // Только если пароль был изменен
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод сравнения паролей
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
