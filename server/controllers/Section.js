const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) => {
    try{
        //fetch data
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'All fields are requierd',
            });
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
                                                              {
                                                                $push: {
                                                                    courseContent: newSection._id,
                                                                }
                                                              },
                                                              {new:true},
                                                            )
                                                            .populate("courseContent")
                                                            .populate("courseContent.subSection")
                                                            .exec();

        //return response
        return res.status(200).json({
            success:true,
            message:'Section Created successfully',
            updatedCourseDetails,
        });
        
    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message,
         });
    }
};

exports.updateSection = async (req,res) => {
    try{

        //data input 
        const {sectionName, sectionId} = req.body;

        //data validation
         if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        //return response
        return res.status(200).json({
            success:true,
            messsage:'Section updated successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message,
         });

    }
};

exports.deleteSection = async (req, res) => {
    try{
        //get ID - assuming that we are sending ID in params
        const {sectionId} = req.params;

        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //TODO: do we nedd to delete the entry from the course schema?

        //return response 
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try again",
            error:error.message,
         });
    }
}