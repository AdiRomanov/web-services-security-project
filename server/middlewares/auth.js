const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};