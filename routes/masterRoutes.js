const express=require('express');
const router=express.Router();

//Importing Middleware
const auth=require('../middleware/auth');

//Importing Controllers
const masterController=require('../controllers/masterController');

//Routes
//router.post('/create',productsController.createProducts);
router.post('/social_media/create',masterController.createSocialMedia);

router.get('/records',masterController.getAllMasterRecords);

module.exports=router;