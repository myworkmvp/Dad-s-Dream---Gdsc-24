const express = require("express");
const router = express.Router();
const userReg = require("../controller/user");

router.post("/signup",userReg.Register);
router.post("/login",userReg.Login);
router.post("/givefood",userReg.Prov_food);
//router.post("/leaderboard",userReg.fullUsers);
router.post("/needfood",userReg.Needfood);
module.exports = router;