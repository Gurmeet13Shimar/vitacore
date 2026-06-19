const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id: userId }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
};

module.exports = { protect };
