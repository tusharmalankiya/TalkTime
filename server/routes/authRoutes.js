const express = require("express");
const router = express.Router();

//middleware
// const { auth } = require("./../middlewares/auth");

//controller
const authController = require("./../controllers/authControllers");

// get
router.get("/get-chats/:id", authController.get_chats);
router.post("/get-messages", authController.get_messages);

// post
router.post("/save-messages", authController.save_messages);

module.exports = router;
