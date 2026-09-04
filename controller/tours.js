const Tour = require("../models/tours");

exports.getAllTours = async (req, res)=>{
    try{
        // 1. Filtering

        let queryObj = {...req.query}
        const excludeFields = ["page", "limit", "sort", "fields"];
        excludeFields.forEach(el=>delete queryObj[el]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match=>`$${match}`);
        queryObj = JSON.parse(queryString);

        let query = Tour.find(queryObj);

        // 2. Sorting

        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            console.log(sortBy);
            
            query.sort(sortBy);
        } else {
            query.sort("-price");
        }

        //3. Limiting fields

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query.select(fields)
        }
        
        //4. Pagination

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const skip = (page-1)*limit
        query.skip(skip).limit(limit);
        if(skip >= await Tour.countDocuments()) throw new Error("There is not enough docs");


        const tours = await query;

        res.status(200).json({
            status:"success",
            results:tours.length,
            data:{
                tours
            }
        })
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err.message
        })
    }
};

exports.getTour = async (req, res)=>{
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status:"success",
            data:{
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status:"fail",
            message:"Tour not found"
        })
    }
};

exports.createTour = async (req, res)=>{
    try{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:"Invalid input"
        })
    }
};

exports.updateTour = async (req, res)=>{
    try{
        const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {returnDocument:"after", runValidators:true});
        res.status(200).json({status:"success", data:{tour:newTour}});
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err.message
        })
    }
};

exports.deleteTour = async (req, res)=>{    
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({status:"success", data:null})
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:"Tour not found"
        })
    }
};