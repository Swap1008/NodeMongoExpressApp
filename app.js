const express=require('express');
const path=require('path')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');


const app=express();

// Mongoose
// password = demo@2020 but @ was substitued for %40 as mongodb does not accept @.
let password='demo%402020'
mongoose.connect(`mongodb://demouser:${password}@ds161074.mlab.com:61074/restifydb`,{
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

let Article=require('./models/article');

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
app.use(expressValidator({
    errorFormater:function(param,msg,value){
        let namespace=param.split('.')
        , root= namespace.shift()
        , formParam= root;

        while (namespace.length) {
            formParam += '[' +namespace +']';

        }
        return {
            param: formParam,
            msg:msg,
            value:value
        };
    }
}));

// Routes
app.get('/',(req,res)=>{
    Article.find({},function(err,articles){
        if (err) {
            console.log(err);
        } else {
            // console.log(articles);    
            res.render("index",{
                title:'Articles',
                articles:articles
            });
        }
    })
});

app.get('/article/add',(req,res)=>{
    res.render("addArticle",{
        title:"Add Article"
        
    });
});

app.post('/article/add',(req,res)=>{
    let article=new Article();
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    article.save((err)=>{
        if (err) {
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
    
});

// View Article
app.get('/article/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        if (err) {
            console.log(err);
        }else{
            res.render("article",{
                article:article,
                title:'Edit Article'
                
            });
        }
    });
});
// Edit Article
app.get('/article/edit/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        if (err) {
            console.log(err);
        }else{
            res.render("edit_article",{
                article:article
                
            });
        }
    });
});


app.post('/article/edit/:id',(req,res)=>{
    let article={};
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let query={_id:req.params.id};
    // console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    
    Article.update(query,article,(err)=>{
        if (err) {
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
    
});

//Delete
app.delete('/article/:id',(req,res)=>{
    let query={_id:req.params.id};
    Article.remove(query,(err)=>{
        if (err) {
            console.log(err);
        } else {
            res.send("Success");
        }
    })
}); 


// Server
app.listen(4000,(err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log("Server Started")
    }
})