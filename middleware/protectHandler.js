const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("HEY-----", decoded);
    req.user = await User.findById(decoded.id).select('_id');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protectHandler;
