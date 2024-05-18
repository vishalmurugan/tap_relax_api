//Importing Modals
const Orders=require('../modals/orders');
const PersonalDetails=require('../modals/personal_details');
const CompanyDetails=require('../modals/company_details');
const PaymentDetails=require('../modals/payment_details');
const DeliveryDetails=require('../modals/delivery_details');
const ShareContact=require('../modals/share_contact');
const Customer= require('../modals/customer_profiles');

const yup=require('yup');
const db=require('../config/database');

module.exports={

    /** 
     * This function is used to place the card order
     */
    placeOrder:async function(req,res){
        try {
            var { id }= req.user;
            var { delivery_details,personal_details,company_details,payment_details,order_details,isSkip }= req.body;

            //Validation schema
            var schema=yup.object({
                isSkip:yup.boolean().required(),
                order_details:yup.object({
                    price:yup.string().required(),
                    card_name:isSkip?yup.string():yup.string().required(),
                    quantity:yup.number().required(),
                    cardType:yup.number().required(),
                    card:yup.string().required()
                }),
                delivery_details:yup.object({
                    full_name:yup.string().required(),
                    mobile_number:yup.string().required(),
                    shipping_address:yup.string().required(),
                    city:yup.string().required(),
                    state:yup.string().required(),
                    country:yup.string().required(),
                    pincode:yup.string().required()
                }),
                personal_details:yup.object(isSkip?{}:{
                    full_name:yup.string().required(),
                    mobile_number:yup.string().required(),
                    email:yup.string().required(),
                    social_media:yup.array().required(),
                    photo:yup.string(),
                    address:yup.string().required(),
                    description:yup.string().required()
                }),
                company_details:yup.object(isSkip?{}:{
                    company_name:yup.string().required(),
                    mobile_number:yup.string().required(),
                    email:yup.string().required(),
                    social_media:yup.array().required(),
                    photo:yup.string(),
                    address:yup.string().required(),
                    description:yup.string().required(),
                    review_link:yup.string().required(),
                    web_address:yup.string().required()
                }),
                payment_details:yup.object(isSkip?{}:{
                    payment_links:yup.array().required()
                })
            })

            //Validation function
            await schema.validate(req.body, { abortEarly: false });

            var orderInsertData={};
            orderInsertData=order_details;
            orderInsertData.account=id;
            orderInsertData.is_active=isSkip?0:1;

            //Insert data in orders table
            var result=await Orders.create(orderInsertData).then();

            //Insert data in delivery table
            delivery_details.order_id=result.id;
            await DeliveryDetails.create(delivery_details).then();

            if(isSkip===false){
                //Insert data in Personal details table
                personal_details.order_id=result.id;
                await PersonalDetails.create(personal_details).then();

                //Insert data in Company details table
                company_details.order_id=result.id;
                await CompanyDetails.create(company_details).then();

                //Insert data in Payment details table
                payment_details.order_id=result.id;
                await PaymentDetails.create(payment_details).then();

                //Update the customer purchase status
                await Customer.update({is_subscribed:1},{where:{account:id}}).then();

            }

            return res.status(200).json({success:true,message:'Order placed successfully'});
            
        } catch (error) {
            
             //Send Error response
             var code= (error.name === 'ValidationError')?400:500;   
             return res.status(code).json({ success:false,error: error });

        }
    },

    /**
     * This function is used to add the order details for card
     *  */
    updateOrderDetails:async function(req,res){
        try {
            var { order_id,personal_details,company_details,payment_details }=req.body;

            var isPersonalAvailable=true;
            personal_details=personal_details||null;
            isPersonalAvailable=personal_details?true:false;

            //Validation schema
            var schema=yup.object({
                order_id:yup.string().required(),
                personal_details:yup.object(isPersonalAvailable?{
                    full_name:yup.string().required(),
                    mobile_number:yup.string().required(),
                    email:yup.string().required(),
                    social_media:yup.array().required(),
                    photo:yup.string(),
                    address:yup.string().required(),
                    description:yup.string().required()
                }:{}),
                company_details:yup.object({
                    company_name:yup.string().required(),
                    mobile_number:yup.string().required(),
                    email:yup.string().required(),
                    social_media:yup.array().required(),
                    photo:yup.string(),
                    address:yup.string().required(),
                    description:yup.string().required(),
                    review_link:yup.string().required(),
                    web_address:yup.string().required()
                }),
                payment_details:yup.object({
                    payment_links:yup.array().required()
                })
            })

            //Validation function
            await schema.validate(req.body, { abortEarly: false });

            if(isPersonalAvailable){
             //Insert data in Personal details table
             personal_details.order_id=order_id;
             await PersonalDetails.create(personal_details).then();
            }
             //Insert data in Company details table
             company_details.order_id=order_id;
             await CompanyDetails.create(company_details).then();

             //Insert data in Payment details table
             payment_details.order_id=order_id;
             await PaymentDetails.create(payment_details).then();


             //Update the order active status
            await Orders.update({is_active:1},{where:{id:order_id}}).then();

             return res.status(200).json({success:true,message:'Order Updated successfully'});
            
        } catch (error) {
             //Send Error response
             var code= (error.name === 'ValidationError')?400:500;   
             return res.status(code).json({ success:false,error: error });
        }
    },

    /**
     * This function is used to get all cards list
     */
    getCardsList:async function(req,res){
        try {
            
            var qry=`SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', o.id,
                    'account', o.account,
                    'card', o.card,
                    'status', o.status,
                    'quantity', o.quantity,
                    'price', o.price,
                    'is_active', o.is_active,
                    'card_name', o.card_name,
                    'company_details', 
                    JSON_OBJECT(
                        'id', c.id,
                        'company_name', c.company_name,
                        'review_link', c.review_link,
                        'photo', c.photo,
                        'email', c.email,
                        'mobile_number', c.mobile_number,
                        'social_media', c.social_media,
                        'address', c.address,
                        'description', c.description,
                        'web_address', c.web_address,
                        'status', c.status
                    ),
                    'personal_details', 
                    JSON_OBJECT(
                        'id', p.id,
                        'full_name', p.full_name,
                        'photo', p.photo,
                        'email', p.email,
                        'mobile_number', p.mobile_number,
                        'social_media', p.social_media,
                        'address', p.address,
                        'description', p.description,
                        'status', p.status
                    ),
                    'payment_details', 
                    JSON_OBJECT(
                        'id', pay.id,
                        'payment_links', pay.payment_links
                    )
                )
            ) AS items
        FROM 
            orders AS o
        LEFT JOIN 
            company_details AS c ON o.id = c.order_id
        LEFT JOIN 
            personal_details AS p ON o.id = p.order_id
        LEFT JOIN 
            payment_details AS pay ON o.id = pay.order_id
            
            where o.is_active=1`;

            var list =  await db.query(qry).then();

            var response={};
            response=list[0][0] || [];
            response.success=true;

            //Success response
            return res.status(200).json(response);

        } catch (error) {
             //Send Error response
             var code= (error.name === 'ValidationError')?400:500;
             return res.status(code).json({ success:false,error: error });
        }
    },

    /** 
     * This function is used to view the particular card 
     * */
    viewCard:async function(req,res){
        try {
            var { id }= req.params;

            //To get all cards details
            var order= await Orders.findOne({where:{id:id}}).then();
            var payment_details= await PaymentDetails.findOne({where:{order_id:id}}).then();
            var company_details= await CompanyDetails.findOne({where:{order_id:id}}).then();
            var personal_details= await PersonalDetails.findOne({where:{order_id:id}}).then();

            var response={};
            response.order=order;
            response['personal_details']=personal_details;
            response['company_details']=company_details;
            response['payment_details']=payment_details;
            response.success=true;

            //Success response
            return res.status(200).json(response);

        } catch (error) {
            //Error response
            return res.status(500).json({ success:false,error: error });
        }
    },

    /** This function  update the card details */

    updateCardDetails:async function(req,res){
      
            try {
                
                var { order_id,personal_details,company_details,payment_details }=req.body;
    
                //Validation schema
                var schema=yup.object({
                    order_id:yup.string().required(),
                    personal_details:yup.object({
                        full_name:yup.string().required(),
                        mobile_number:yup.array().required(),
                        email:yup.array().required(),
                        social_media:yup.array().required(),
                        photo:yup.string(),
                        address:yup.string().required(),
                        description:yup.string().required()
                    }),
                    company_details:yup.object({
                        company_name:yup.string().required(),
                        mobile_number:yup.array().required(),
                        email:yup.array().required(),
                        social_media:yup.array().required(),
                        photo:yup.string(),
                        address:yup.string().required(),
                        description:yup.string().required(),
                        review_link:yup.string().required(),
                        web_address:yup.string().required()
                    }),
                    payment_details:yup.object({
                        payment_links:yup.array().required()
                    })
                })
    
                //Validation function
                await schema.validate(req.body, { abortEarly: false });
    
                 //Update data in Personal details table
                 await PersonalDetails.update(personal_details,{where:{order_id:order_id}}).then();
                
                 //Update data in Company details table
                 await CompanyDetails.update(company_details,{where:{order_id:order_id}}).then();
    
                 //Update data in Payment details table
                 await PaymentDetails.update(payment_details,{where:{order_id:order_id}}).then();

                //success response
                 return res.status(200).json({success:true,message:'Card Updated successfully'});
                
            } catch (error) {
                 //Send Error response
                 var code= (error.name === 'ValidationError')?400:500;   
                 return res.status(code).json({ success:false,error: error });
            }
            
    },

    /** This function is used to set restriction while share card */
    shareContact:async function(req,res){
        try {
            var { id }= req.user;
            var { order_id,personal_details_link,company_details_link } = req.body;

            //validation schema
            const schema = yup.object({
                order_id: yup.string().required(),
                personal_details_link: yup.array()
                    .of(yup.object({
                        id: yup.number().required(),
                        url: yup.string().required(),
                        isShown: yup.boolean().required()
                    }))
                    .required()
                    .min(1), 
                company_details_link: yup.array()
                    .of(yup.object({
                        id: yup.number().required(),
                        url: yup.string().required(),
                        isShown: yup.boolean().required()
                    }))
                    .required()
                    .min(1) 
            });

              //Validation function
              await schema.validate(req.body, { abortEarly: false });

            var obj={};
            obj.account=id;
            obj.personal_details_link=personal_details_link;
            obj.company_details_link=company_details_link;
            obj.order_id=order_id;

            var result= await ShareContact.create(obj).then();

            //Success response
            return res.status(200).json({success:true,shareId:result.id})

        } catch (error) {
             //Send Error response
             var code= (error.name === 'ValidationError')?400:500;   
             return res.status(code).json({ success:false,error: error });
        }
    },

    /** 
     * This function is used to get the receiver contact details
     *  */
    getShareContactDetails:async function(req,res){
        try {
            var { id }= req.params;

            //To get all user card details
            var contact= await ShareContact.findOne({where:{id:id}}).then();
            var payment_details= await PaymentDetails.findOne({where:{order_id:contact.order_id}}).then();
            var company_details= await CompanyDetails.findOne({where:{order_id:contact.order_id}}).then();
            var personal_details= await PersonalDetails.findOne({where:{order_id:contact.order_id}}).then();

            var response={};
            response['social_media']=contact;
            response['personal_details']=personal_details;
            response['company_details']=company_details;
            response['payment_details']=payment_details;
            response.success=true;

            //Success response
            return res.status(200).json(response);

        } catch (error) {
            return res.status(200).json({ success:false,error: error });
        }
    }
}