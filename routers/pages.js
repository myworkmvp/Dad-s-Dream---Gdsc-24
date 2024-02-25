const express = require("express");
const userReg = require("../controller/user");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/Savefood', (req, res) => {
    res.render('Savefood');
});

router.get('/food',userReg.isLogined, (req, res) => {
    if(req.user){
        console.log(req.user);
        res.render('food',{user:req.user});
    }
    else{
        res.redirect("/");
    }
    
});

router.get('/needfood', userReg.Needfood,(req, res) => {
    if(req.user){
        res.render('needfood',{user:req.user});
    }
    else{
        res.redirect("/");
    }
});

router.get('/leaderboard',userReg.fullUsers, (req, res) => {
    if(req.fullUser){
        console.log(req.fullUser);
        res.render('leaderboard',{user:req.fullUser});
    }
    else{
        res.redirect("/");
    }
});
router.get('/givefood', userReg.isLogined,(req, res) => {
    if(req.user){
        res.render('givefood',{user:req.user});
    }
    else{
        res.redirect("/");
    }
});

router.get('/myaccount',userReg.isLogined, (req, res) => {
    if(req.user){
        console.log(req.user);
        res.render('myaccount',{user:req.user});
    }
    else{
        res.redirect("/");
    }
    
});
module.exports=router;
