const express=require('express');
const app=express();
const bodyparser=require('Body-parser') ;
const port=5000;
const mongoose=require("mongoose");
const campgrounds=require("./models/campgroundschema.js");
const comment=require("./models/commentschema.js");
const passport=require("passport");
const localstrategy=require("passport-local");
const user=require("./models/user.js")

//pasport configuration
app.use(require("express-session")({
    secret:"yelpcamp",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

mongoose.connect("mongodb://localhost/campgrounds");
app.use(bodyparser.urlencoded({extended:true}));
// save data to db
// campgrounds.create(
//                 {
//                     name:"salmon",
//                     description:"jdewndned" 
//                 },
//                 {
//                     name:"granite",
//                     description:"wdwdewdfefzscdf"
//                 },
//                 {
//                     name:"goats rest",
//                     description:"asdsddasdaefedfdvewv"
//                 }
//             );



// home page
 app.get('/',(req,res)=>{
     res.render("landing.ejs");
 });
 // view campgrounds
app.get('/campgrounds',(req,res)=>{
                // get data from db
                campgrounds.find({},(err,allcampground)=>{
                    if (err)
                    console.log(err);
                    else 
                    // display data from db
                    res.render("campgrounds.ejs",{campgrounds:allcampground});
 });

});

// create new campground 
app.get('/campground/new',(req,res)=>{
            res.render("newcampground.ejs");
});
//hit by form to create new campground
app.post('/campgrounds/create',(req,res)=>{
    var names=req.body.campground;
    var descri=req.body.description;
    var newcampground={name:names,
                       description:descri };
    // save newly created to db
    campgrounds.create(newcampground,(err,campground)=>{
        if(err)
         console.log(err);
        else  
         res.redirect('/campgrounds');
         console.log(newcampground);
    });
});

// show 
app.get('/campgrounds/:id',(req,res)=>{

  var id=req.params.id;
  campgrounds.findById(id).populate("comment").exec((err,campground)=>{
  if (err)
     console.log(err);
     else 
     {
         console.log(campground);
         res.render("show.ejs",{campgrounds:campground});
     }
     
  });
});

// create a new comment
app.get("/campgrounds/:id/comments/new",(req,res)=>{
    // find campground by id
    campgrounds.findById(req.params.id,(err,campground)=>
    {
        if(err)
        console.log(err);
        else   res.render("comments.ejs",{campground:campground});
    });
  
});

// save the new comment
app.post("/campgrounds/:id/comment",(req,res)=>
{
    // find campground by id 
    campgrounds.findById(req.params.id,(err,campground)=>{
        if(err)
         console.log(err);
        else{
            const text=req.body.text;
            const author=req.body.author;
            const comments={
                text:text,
                author:author
            }
            comment.create(comments,(err,comment)=>{
                if(err)
                console.log(err);
                else {
                        campground.comment.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/"+campground._id);
                }
            });
        } 
    });

});
app.listen(port,()=>{
    console.log("app started");
});