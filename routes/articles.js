const express=require('express');
const router=express.Router();
let Article=require('../models/article');


router.get('/',(req,res)=>{
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

router.get('/add',(req,res)=>{
    res.render("addArticle",{
        title:"Add Article"
        
    });
});

router.post('/add',(req,res)=>{
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


router.get('/:id',(req,res)=>{
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
router.get('/edit/:id',(req,res)=>{
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


router.post('/edit/:id',(req,res)=>{
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
router.delete('/:id',(req,res)=>{
    let query={_id:req.params.id};
    Article.remove(query,(err)=>{
        if (err) {
            console.log(err);
        } else {
            res.send("Success");
        }
    })
}); 




module.exports=router;