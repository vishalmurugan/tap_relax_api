const express=require('express');
const router=express.Router();

//Importing Middleware
const auth=require('../middleware/auth');

//Importing Controllers
const accountController=require('../controllers/accountController');
const customerController=require('../controllers/customerController');

//Routes
router.post('/signup',accountController.signUp);
router.post('/login',accountController.login);
router.post('/otp-verification',accountController.verifyOTP);
router.post('/photo/upload',accountController.uploadPhoto);

router.put('/forgot-password',accountController.forgotPassword);

router.get('/profile',auth,accountController.getProfile);
router.get('/user-card/:id',customerController.getShareContactDetails);

module.exports=router;
