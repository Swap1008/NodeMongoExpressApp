const express=require('express');
const path=require('path')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
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
    Article.update(query,article,(err)=>{
        if (err) {
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
    
});

// Server
app.listen(4000,(err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log("Server Started")
    }
})