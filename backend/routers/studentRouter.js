const router = require("express").Router();
// const express = require("express");
// const router = express.Router();
const controller = require("../controllers/studentController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/upload");
 


router.get('/',authenticateToken,controller.getStudents)
router.post('/',authenticateToken, upload.single("image"),controller.createStudents)
router.delete('/:id',authenticateToken,authorizeRole,controller.deleteStudents)
router.put('/:id',authenticateToken,authorizeRole,upload.single("image"),controller.updateStudents);

module.exports = router;