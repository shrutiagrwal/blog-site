const mongoose=require("mongoose");


const campgroundsschema=new mongoose.Schema({
    name:String,
    description:String,
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }]
});

module.exports=mongoose.model("campground",campgroundsschema);
