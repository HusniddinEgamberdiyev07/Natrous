const Tour = require("../models/tours");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAllTours = async (req, res)=>{
    const features =  new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
    const tours = await features.query;    

    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            tours
        }
    })
};

exports.getTour = async (req, res, next)=>{
    const tour = await Tour.findById(req.params.id)
    
    if(!tour) return next(new AppError("Tour not found", 404))

    res.status(200).json({
        status:"success",
        data:{
            tour
        }
    })
}

exports.createTour = async (req, res)=>{
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status:"success",
        data:{
            tour:newTour
        }
    })
};

exports.updateTour = async (req, res, next)=>{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {returnDocument:"after", runValidators:true});
    if(!tour) return next(new AppError("Tour not found", 404))

    res.status(200).json({status:"success", data:{tour:tour}});
};

exports.deleteTour = async (req, res, next)=>{    
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) return next(new AppError("Tour not found", 404))
    
    res.status(204).json({status:"success", data:null})
};

exports.tourStats = async (req, res)=>{
    const stats = await Tour.aggregate([
        {
            $match:{
                ratingAverage:{
                    $gte:4.5
                }
            }
        }, // stage
        {
            $group:{
                _id:"$difficulty",
                numTours:{
                    $sum:1
                },
                avgPrice:{
                    $avg:"$price"
                },
                minPrice:{
                    $min:"$price"
                },
                maxPrice:{
                    $max:"$price"
                },
                avgRating:{
                    $avg:"$ratingAverage"
                },
                numRating:{
                    $sum:"$ratingQuantity"
                }
            }
        },
        {
            $sort:{
                avgPrice:1
            }
        },
    ]);

    res.json({
        status:"success",
        data:stats
    })
}

exports.getMonthlyPlan = async (req, res)=>{
    const year = req.params.year;

    const plan = await Tour.aggregate([
        {
            $unwind:"$startDates"
        },
        {
            $match:{
                startDates:{
                    $gte:new Date(`${year}-01-01`),
                    $lte:new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group:{
                _id:{
                    $month:"$startDates"
                },
                numTours:{
                    $sum:1
                },
                tours:{
                    $push:"$name"
                }
            }
        },
        {
            $addFields:{
                month:"$_id"
            }
        },
        {
            $project:{
                _id:0
            }
        },
        {
            $sort:{
                numTours:-1
            }
        },
        // {
        //     $limit:6
        // }
    ])

    res.json({
        status:"success",
        data:plan
    })
}