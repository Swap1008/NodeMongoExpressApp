const express=require('express');
const path=require('path')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const {expressValidator,check}=require('express-validator/check');
const flash=require('connect-flash');
const session=require('express-session');
const config=require('./config/database');
const passport=require('passport');
const app=express();

// Mongoose
// password = demo@2020 but @ was substitued for %40 as mongodb does not accept @.
let password='demo%402020'
mongoose.connect(config.database,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},function(error){
    if (error) {
        console.log(error);
    }
    else{
        console.log("Database Connected");
    }
});

// Models



// View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Public
app.use(express.static(path.join(__dirname,'/public')));

// Middleware
app.use(express.urlencoded({urlencoded:true}));
app.use(express.json());

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

// Express Messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});  

// Express Validator
// app.use(expressValidator({ }));

// 
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('*',function(req,res,next){
    res.locals.user=req.user || null;
    next();
});

let articles=require('./routes/articles');
let users=require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);

// View Article

// Server
app.listen(4000,(err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log("Server Started")
    }
})