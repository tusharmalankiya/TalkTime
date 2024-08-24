const express = require("express");
const router = express.Router();


const multer = require("multer");
const upload = multer({dest:"./assets/avatars"});
//middleware
// const { auth } = require("./../middlewares/auth");

//controller
const authController = require("./../controllers/authControllers");

// get
router.get("/get-chats/:id", authController.get_chats);
router.post("/get-messages", authController.get_messages);
// post
router.post("/save-messages", authController.save_messages);
router.post("/set-profile", upload.single('avatar'), authController.set_profile);

module.exports = router;
