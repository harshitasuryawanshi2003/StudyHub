const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

//create sub section

exports.createSubSection = async (req, res) => {
    try{
         //fetch data from req body
         const {sectionId, title, timeDuration, description} = req.body;

         //extract fle/video
         const video = req.files.videoFile;

         //validation
         if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
         }

         //upload video to cloudinary
         const uploadDetails = await uploadImageToCloudinary(VideoDecoder, process.env.FOLDER_NAME);
         //create sub-section
         const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
         });

         //update Section with this sub-section
         const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {$push: {
                                                                    SubSection:subSectionDetails._id,
                                                                }},
                                                                 {new:true})
                                                                 .populate("SubSection");
         //HW: log updated section here, after adding populate query
         //return response
         return res.status(200).json({
            success:true,
            message:'Sub Section created successfully',
            updatedSection,
         });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error:error.message,
        });
    }
};

//update Sub-section
exports.updateSubSection = async (req, res) => {
    try{
        const {sectionId, title, description} = req.body;
        const subSection = await SubSection.findById(sectionId);

        if(!sectionId) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if(title !== undefined) {
            subSection.title = title
        }

        if(description!==undefined) {
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        return res.json({
            success:true,
            message: "Section updated successfully",
        });

    } catch(error) {
        console.error(error)
        return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      });
    }
};

// Delete Sub-section
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
};

