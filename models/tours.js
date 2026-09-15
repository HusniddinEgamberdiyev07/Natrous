const mongoose = require("mongoose");

const toursSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Tour must have a name"],
        unique:[true, "Name must be unique"]
    },
    price:{
        type:Number,
        required:[true, "Tour must have a price"]
    },
    ratingAverage:{
        type:Number,
        default:0
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    maxGroupSize:{
        type:Number,
        required:[true, "Tour must have a max group size"]
    },
    difficulty:{
        type:String,
        required:[true, "Tour must have a difficulty"]
    },
    duration:{
        type:Number,
        reqiured:[true, "Tour must have a duration"]
    },
    summary:{
        type:String,
        required:[true, "Tour must have summary"],
        trip:true
    },
    description:{
        type:String,
        trip:true
    },
    imageCover:{
        type:String,
        required:[true, "Tour must have a image cover"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

toursSchema.virtual("durationWeeks").get(function(){
    return Math.floor(this.duration / 7)
});

// 1. document middleware

/*
toursSchema.pre("save", function(){
    console.log("Before save...");
})

toursSchema.post("save", function(){
    console.log(this);
})
*/

// 2. Query middleware

toursSchema.pre(/^find/, function(){
    console.log("You are querying 👀")
})

module.exports = mongoose.model("Tour", toursSchema);