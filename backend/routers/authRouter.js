const router = require("express").Router();
const controller = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");


 


router.get("/me",authenticateToken, controller.getCurrentUser);
router.post("/login",controller.authenticateUser);
router.post("/register",controller.registerUser)
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);


module.exports = router;