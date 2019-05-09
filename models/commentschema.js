const mongoose=require("mongoose");

const commentsschema=new mongoose.Schema({
    author:String,
    text:String
});
 

module.exports=mongoose.model("comment",commentsschema);