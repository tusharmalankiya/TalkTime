const express = require("express");
const router = express.Router();

const commonControllers = require("./../controllers/commonControllers");

router.post("/register", commonControllers.register_user);
router.post("/login", commonControllers.login_user);
router.get("/logout/:id", commonControllers.logout);



router.get("/ping", (req, res)=>{
    res.status(200).json({message:"pingged"});
})

module.exports = router;
