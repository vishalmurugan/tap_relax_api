const express=require('express');
const router=express.Router();

//Importing Middleware
const auth=require('../middleware/auth');

//Importing Controllers
const contactController=require('../controllers/contactController');

//Routes
router.post('/exchange-contact',contactController.exchangeContact);
router.post('/create',contactController.createContact);

router.put('/update',contactController.editContact);

router.get('/list',contactController.listContact);
router.get('/view/:id',contactController.viewContact);

module.exports=router;
