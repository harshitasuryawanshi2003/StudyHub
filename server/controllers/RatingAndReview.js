const { default: mongoose } = require("mongoose");
const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/User");

//createRating
exports.createRating = async (req, res) => {
    try{
        //get user id
        const userId = req.user.id;
        //fetch data from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                    {_id:courseId,
                                      studesEnrolled: {$elemMatch: {$eq: userId} },
                                    });

        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                 user:userId,
                                                 course:courseId,
                                                });
        
        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                      rating, review,
                                      course:courseId,
                                      user:userId,
                                    });

        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                    {
                                        $push: {
                                            RatingAndReview: ratingReview._id,
                                        }
                                    },
                                   {new:truw});
        
        console.log(updatedCourseDetails);                         
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review cretaed successfully",
            ratingReview,
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

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id:null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ])
        
        //return rating
        if(result.length > 0) {

              return res.status(200).json({
                scuccess:true,
                averageRating: result[0].averageRating,
              });

        }

        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no rating given till now",
            averageRating:0,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


//getAllRatingAndReview

exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                  .sort({rating:"desc"})
                                  .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                  })
                                  .populate({
                                    path:"course",
                                    select:"courseName",
                                  })
                                  .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
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