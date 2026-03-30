const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен не найден. Пожалуйста, авторизируйтесь'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MedApp2026_Secret_Key_For_Production_Use_Only');
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Токен истёк. Пожалуйста, авторизируйтесь снова'
      });
    }
    res.status(401).json({
      success: false,
      message: 'Невалидный токен'
    });
  }
};

module.exports = authMiddleware;
