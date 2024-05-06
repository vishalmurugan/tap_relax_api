const express=require('express');
const router=express.Router();

//Importing Middleware
const auth=require('../middleware/auth');

//Importing Controllers
const customerController=require('../controllers/customerController');

//Routes
router.post('/place-order',auth,customerController.placeOrder);
router.post('/update-order',auth,customerController.updateOrderDetails);
router.post('/share-contact',auth,customerController.shareContact);

router.put('/cards/update',auth,customerController.updateCardDetails);

router.get('/cards/list',auth,customerController.getCardsList);
router.get('/cards/:id',auth,customerController.viewCard);


module.exports=router;
