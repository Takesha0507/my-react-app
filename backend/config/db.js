const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/MedApp';
    
    await mongoose.connect(mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Подключение к MongoDB успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
