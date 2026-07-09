const authorizeRole = (req, res, next) => {
  // Check if user is admin
  if (req.user.role === "admin") {
    return next();
  }

  // Access denied
  return res.status(403).json({
    success: false,
    message: "Access Denied. Admin only.",
  });
};

module.exports = authorizeRole;