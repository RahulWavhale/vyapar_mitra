
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} only route` });
    }
    next();
  };
};
