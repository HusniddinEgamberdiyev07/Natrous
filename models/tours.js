const mongoose = require("mongoose");
const validator = require("validator");

const toursSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Tour must have a name"],
        unique:[true, "Name must be unique"],
        maxlength:[40, "A tour's name must contain max 50 chars"],
        minlength:[10, "A tour's name must contain min 10 chars"],
        validate:[validator.isAlpha, "A tour's name can contain only letters"]
    },
    price:{
        type:Number,
        required:[true, "Tour must have a price"]
    },
    ratingAverage:{
        type:Number,
        default:1,
        min:[1, "A tour's rating must be above 1.0"],
        max:[5, "A tour's rating must be below 5.0"]
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
        required:[true, "Tour must have a difficulty"],
        enum:{
            values:["easy", "medium", "difficult"],
            message:"A tour's difficulty can be only easy, medium, difficult"
        }
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
    startDates:[Date],
    priceDiscount:{
        type:Number,
        default:0,
        validate:{
            // this refres to current doc on doc creation. It does not work when updating.
            validator:function(val){
                return this.price > val
            },
            message:"Discount price must be lower or equal to price"
        }
    }
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

/*
toursSchema.pre(/^find/, function(){
    console.log("You are querying 👀")
    console.log(this);
})
*/

// 3. Aggregation middleware

/*
toursSchema.pre("aggregate", function(){
    console.log("Before agregation");
    console.log(this.pipeline());
})
*/

module.exports = mongoose.model("Tour", toursSchema);