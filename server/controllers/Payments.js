const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollementEmail");
const { default: mongoose } = require("mongoose");

// capture the payment and initiate the Razorpay order

exports.capturePayment = async (req, res) => {

     //get courseId and userId
     const {course_id} = req.body;
     const userId = req.user.id;
     //validation
     //valid courseId
     if(!course_id){
         return res.json({
             success:false,
             message:'Please provide valid course ID',
         });
     }
     //valid courseDetail
     let course;
     try{
         course = await Course.findById(course_id);
         if(!course) {
             return res.json({
                 success:false,
                 message:'Could not find the course',
             });
         }
         //user already pay for the same course
         const uid = mongoose.Types.ObjectId(userId);
         if(course.studentsEnrolled.include(uid)){
             return res.status(200).json({
                  success:false,
                  message:'Student is already enrolled',
             });
         }
     }
     catch(error){
          console.error(error);
          return res.status(500).json({
             success:false,
             message:error.message,
          });
     }
     
     //order create 
     const amount = course.price;
     const currency = "INR";
     const options = {
         amount: amount*100,
         currency,
         receipt: Math.random(Date.now()).toString(),
         notes: {
             courseId: course_id,
             userId,
         }
     };
     
     try{
         //initiate the payment using razorpay
         const paymentResponse = await instance.orders.create(options);
         console.log(paymentResponse);
         //return response
         return res.json({
             success:true,
             courseName:course.courseName,
             courseDescripton:course.courseDescription,
             thumbnail:course.thumbnail,
             orderId:paymentResponse._id,
             currency:paymentResponse.currency,
             amount:paymentResponse.amount,
         });
     }
     catch(error) {
         console.log(error);
         res.json({
             success:false,
             message:'Could not initiate order',
         });
     }
};

//verify Signature of razorpay and Server

exports.verifySignature = async (req,res) => {
   const webhookSecret = "12345678";

   const signature = req.header("x-razorpay-signature");

   const shasum = crypto.createHmac("sha256", webhookSecret);
   shasum.update(JSON.stringify(req.body));
   const digest = shasum.digest('hex');

   if(signature === digest) {
      console.log("Payment is authorised"); 

      const {courseId, userId} = req.body.payload.payment.entity.notes;

      try{
          //fulill the action
          //find the course and enroll student in it 
          const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id:courseId},
                                                {$push: {studentsEnrolled: userId}},
                                                {new:true},
                                                );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:'Course not found',
                });
            }
            
            console.log(enrolledCourse);

            //find the student and add the course to their list enrolled course 
            const enrolledStudent = await User.findOneAndUpdate(
                                                      {_id:userId},
                                                      {$push: {courses:courseId}},
                                                       {new:true});

            console.log(enrolledStudent);

            //mail send for confirmation
            const emailResponse = await mailSender(
                                    enrolledStudent.email,
                                    "Congratulation from Codehelp",
                                    "Congratulation, you are onboarded ibto bew Codehelp Course",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:'Signature Verified and Course Added',
            });

      }
      catch(error) {
           console.log(error);
           return res.status(500).json({
                success:false,
                message:error.message,
           });
      }
   }
   else{
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
   }
};

