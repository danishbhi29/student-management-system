const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.headers.authorization?.split(" ")[1];
  // const authHeader = req.headers.authorization;
  // const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);
    req.user = decoded;

    next();
  } catch (error) {

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token Expired",
    });
  }

  return res.status(401).json({
    message: "Invalid Token",
  });
}
};
module.exports = authenticateToken;
