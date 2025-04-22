const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat.js');
const mehtodOverride = require('method-override');
const ExpressError = require("./ExpressError.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(mehtodOverride("_method"));



main() .then(()=> {
    console.log("MongoDB connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsApp');
}
 
//Index route 
app.get("/chats", async (req,res)=>{
    try{
     let chats =  await Chat.find();
     console.log(chats);
     res.render("index.ejs", {chats});
    }catch(err){
        next(err);
    }    
});

//New route 

app.get("/chats/new", (req,res)=> {
    res.render("new.ejs");
});

//create route
app.post("/chats", (req,res)=> {
    try{
        let {from, to, msg} = req.body;
        let newChat = new Chat({
            from : from,
            to:to,
            msg : msg,
            created_at : new Date(),
        });
        newChat.save()
        .then(()=> {
            console.log("Chat created successfully");
        }).catch(err => {
            console.log(err);
        });
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
    
});


function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}



// new ---show chat route

app.get("/chats/:id", asyncWrap(async(req,res,next)=> {
  
        let {id} = req.params;
        let chat =  await Chat.findById(id);
        if(!chat){
            next(new ExpressError(404, "chat not found")); 
        }
        res.render("edit.ejs", {chat});
    
   
}));



//edit route 

app.get("/chats/:id/edit",async (req,res)=>{
    try{
        let {id} = req.params;
        let chat =  await Chat.findById(id)
        res.render("edit.ejs", {chat});
    }catch(err){
        next(err);
    };
   
});

//update route 

app.put("/chats/:id", async (req,res)=> {
    try{
        let {id} = req.params
        let { msg:newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(
            id,
            {msg : newMsg},
            {new : true,runvalidators : true}
        );
        console.log(updatedChat);
        res.redirect("/chats");
    }catch(err){
        next(err);
    };
   
});

//destroy route 

app.delete("/chats/:id", async (req,res)=> {
    try{
        let {id} = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
       res.redirect("/chats");
    }catch(err){
        next(err);
    }
   
});



app.get("/", (req,res)=> {
    res.send("root is working fine now");
});



const handleValidationError = (err)=>{
    console.log("Validation error occurred , please follow the rules ");
   console.dir(err.message);
   return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "validationError"){
    err= handleValidationError(err);
    }
    
    next(err);
});



//Error Handling Middleware 
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
});

app.listen(8080, ()=> {
    console.log("Server is running on port 8080");
});