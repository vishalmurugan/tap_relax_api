const express=require('express');
const router=express.Router();

//Importing Middleware
const auth=require('../middleware/auth');

//Importing Controllers
const contactController=require('../controllers/contactController');

//Routes
router.post('/exchange-contact',contactController.exchangeContact);

module.exports=router;
