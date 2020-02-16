const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

let User=require('../models/user');

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    const {name,email,username,password}=req.body;
    
    let newUser=new User({
        name,
        email,
        username,
        password
    });

    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if (err) {
                console.log(err);    
            } 
                newUser.password=hash;
                newUser.save(function(err){
                    if (err) {
                        console.log(err);
                        return;
                    }else{
                        res.redirect('/users/login');
                    }
                });
        });
    });
});


router.get('/login',(req,res)=>{
    res.render('login',{
        title:"Login"
    });
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/articles',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{
        title:'Dashboard'
    })
})


module.exports=router;