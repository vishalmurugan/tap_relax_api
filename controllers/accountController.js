//Importing Modals
const Users=require('../modals/users');
const Customer=require('../modals/customer_profiles');
const social_media=require('../modals/master_social_media');

const db=require('../config/database');

//Importing Shared services
const utils=require('../services/utils');
const Mail = require('../services/mail-service');

//Importing Packages
const yup=require('yup');
const jwt = require("jsonwebtoken");
const { where } = require('sequelize');

module.exports={

    /***
     * This function is used for Account Signup
     */
    signUp: async function(req,res){
        try {
            var reqData = req.body;
            var { password,username,email,mobile_number } = reqData;
    
            // Validation Schema
            var schema = yup.object({
                email: yup.string().email().required(),
                mobile_number: yup.string().required(),
                username: yup.string().required(),
                password: yup.string().min(8).required(),
            });
    
            // Validate the request data
            await schema.validate(reqData, { abortEarly: false });
    
            // Hash the password
            reqData.password = await utils.hashPassword(password);

            //Generate randon OTP
            reqData.otp=utils.otpGenerate();
             
            await Mail.sendMail({to:reqData.email,message:`<h4>Your Account Registeration OTP: ${reqData.otp} </h4>`,subject:'Account Registration'});

            // Insert in user table
            var result=await Users.create(reqData).then();

            //Insert In customer profile table
            var profileData={};
            profileData.account=result.id;
            profileData.username=username;
            profileData.email=email;
            profileData.mobile_number=mobile_number;

            await Customer.create(profileData).then();
    
            // Send success response
            return res.status(200).json({ success:true,message: 'OTP send successfully',userId:result.id });

        } catch (error) {
            //Send Error response
            var code= (error.name === 'ValidationError')?400:500;
            return res.status(code).json({ success:false,error: error });

        }

    },

    /***
     * This function is used for Account Login
     */
    login:async function(req,res){

        try {

            var reqData = req.body;
            var { password,email } = reqData;
    
            // Validation Schema
            var schema = yup.object({
                email: yup.string().email().required(),
                password: yup.string().min(8).required(),
            });
    
            // Validate the request data
            await schema.validate(reqData, { abortEarly: false });
    
            //To check User exist or Not
            var user=await db.query(`select users.*,customer_profiles.username,customer_profiles.is_subscribed from users
             left join customer_profiles on customer_profiles.account=users.id 
             where users.email='${email}'`).then();

            user=user[0] || [];

            if(user.length !==0){
                user=user[0];
                if(user.verified===1){
                    var matchPassword= await utils.comparePasswords(password,user.password);
                    if(matchPassword){
                        var data={};
                        data.id=user.id;
                        data.email=user.email;
                        data.username=user.username;
                        data.is_subscribed=user.is_subscribed;
                        
                        //To generate access token for user
                        const access_token = jwt.sign(data, process.env.TOKEN,{expiresIn: "4h"}); 

                        //Send success response
                        return res.status(200).json({ success:true,message: 'Login Success',userId:user.id,token:access_token });
                    }else{
                        return res.status(400).json({ success:false,error: 'Invalid Email or Password' });
                    }
              }else{
                return res.status(400).json({ success:false,error: 'Account Not Verified. Please verify the account' });
              }
            }else{
                return res.status(400).json({ success:false,error: 'Acoount Not Exist' });
            }
        } catch (error) {
            //Send Error response
            var code= (error.name === 'ValidationError')?400:500;   
            return res.status(code).json({ success:false,error: error });

        }

    },

    /**
     * This function is used to verify the OTP
     */
    verifyOTP:async function(req,res){
        try {
            var reqData = req.body;
            var { userId,otp } = reqData;
    
            // Validation Schema
            var schema = yup.object({
                userId: yup.string().required(),
                otp: yup.string().min(4).max(4).required(),
            });
    
            // Validate the request data
            await schema.validate(reqData, { abortEarly: false });
    
            //To check User exist or Not
            var user=await Users.findOne({where:{id:userId}}).then();

            if(user){
                var checkOtp= user.otp===otp;
                if(checkOtp){    
                    await Users.update({verified:1,otp:null},{where:{id:userId}});
                    return res.status(200).json({ success:true,message: 'OTP verified successfully' });
                }else{
                    return res.status(400).json({ success:false,error: 'Invalid OTP' });
                }
            }else{
                return res.status(400).json({ success:false,error: 'Acoount Not Exist' });
            }
        } catch (error) {
            //Send Error response
            var code= (error.name === 'ValidationError')?400:500;   
            return res.status(code).json({ success:false,error: error });

        }
    },

    /**
     * This function is used to Reset the password
     */
    forgotPassword:async function(req,res){
        try {
            var reqData = req.body;
            var { email,isVerified,password,userId } = reqData;
    
            // Validation Schema
            var schema = yup.object({
                email: !isVerified?yup.string().email().required():yup.string(),
                isVerified:yup.boolean().required(),
                password:isVerified?yup.string().required():yup.string(),
                userId: isVerified?yup.string().uuid().required():yup.string(),
            });
    
            // Validate the request data
            await schema.validate(reqData, { abortEarly: false });
    
            var condition={};
            if(isVerified){
                condition.id=userId;
            }else{
                condition.email=email;
            }

            //To check User exist or Not
            var user=await Users.findOne({where:condition}).then();

            if(user){ 
            
                if(isVerified){ //To update password after OTP verification

                    password=await utils.hashPassword(password);
                    await Users.update({ password:password },{where:{id:userId}});
                    return res.status(200).json({ success:true,message: 'Password Reseted successfully' });

                }else{ //To send OTP for verification

                    //Generate randon OTP
                    var randomOtp=utils.otpGenerate();
                    await Users.update({ otp:randomOtp },{where:{id:user.id}});

                    await Mail.sendMail({to:reqData.email,message:`<h4>Your Account Rest Password OTP: ${randomOtp} </h4>`,subject:'Reset Password'});

                    return res.status(200).json({ success:true,message: 'OTP send successfully',userId:user.id });
                }

            }else{
                return res.status(400).json({ success:false,error: 'Acoount Not Exist' });
            }
        } catch (error) {
            
            //Send Error response
            var code= (error.name === 'ValidationError')?400:500;   
            return res.status(code).json({ success:false,error: error });

        }
    },

    /**
     * This function is used to get the profile details
     */

    getProfile:async function(req,res){
        try {
            var { id }= req.user;

            var result= await Customer.findOne({where:{account:id}}).then();

            return res.status(200).json({success:true,profile:result});

        } catch (error) {
            //Send Error response
            return res.status(500).json({ success:false,error: error });
        }
    },

    /** 
     * This function is used to upload the profile picture 
     * */
    uploadPhoto:async function(req,res){

        try {
           await upload.single('file')(req, res,async function (err) {
                if(!req.file){
                   return res.status(400).json({success:false,error:'No Image Found'});
                }else{
                    return res.status(200).json({success:true,image:req.filesName});
                }
            })
        } catch (error) {
            //Send Error response
            return res.status(500).json({ success:false,error: error });
        }
    }

}