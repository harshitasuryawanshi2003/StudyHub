const Category = require("../models/Category");

// Handler function of create Category

exports.createCategory = async (req,res) => {
    try{
        //  fetch data
        const {name,description} = req.body;

        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        // create entry in DB
        const tagDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:'Tag Created Successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// getAllCategory handler function

exports.showAllCategories = async (req,res) => {
    try{
        const allTags = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            message:'All tags returned successfully',
            allTags,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//categoryPageDetail

exports.categoryPageDetails = async (req, res) => {
    try {
        //get categoryId
        const {categoryId} = req.body;
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
                                         .populate("courses")
                                         .exec();
        //validation
        if(!selectedCategory) {
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            });
        }

        //get courses for different category
        const differentCategories = await Category.findById({
                                        _id: {$ne: categoryId},
                                    })
                                    .populate("courses")
                                    .exec();

        //get top selling courses -> HW
        //return response
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategories,
            },
        });

    }
    catch(error) {
         console.log(error);
         return res.status(500).json({
            success:false,
            message:error.message,
         });
    }
};