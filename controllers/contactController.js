//Importing Modals
const Contact=require('../modals/contacts');

const db=require('../config/database');

//Importing Packages
const yup=require('yup');
const Customer = require('../modals/customer_profiles');

module.exports={

    /** This function is used to exchange the receiver contact details */
    exchangeContact:async function(req,res){
        try {

            var reqData=req.body;

            //validation schema
            var schema=yup.object({
                first_name:yup.string().required(),
                email:yup.string().email().required(),
                mobile_number:yup.string().required(),
                order_id:yup.string().uuid().required()
                });
            
            //Validation function
            await schema.validate(reqData, { abortEarly: false });
            
            reqData.is_exchange=1;
            await Contact.create(reqData).then();

              // Send success response
              return res.status(200).json({ success:true,message: 'Contact Exchanged' });

        } catch (error) {

              //Send Error response
              var code= (error.name === 'ValidationError')?400:500;   
              return res.status(code).json({ success:false,error: error });

        }

    },

     /** This function is used to create new contact details */
     createContact:async function(req,res){
        try {

            var reqData=req.body;

            //validation schema
            var schema=yup.object({
                first_name:yup.string().required(),
                last_name:yup.string().required(),
                email:yup.string().email().required(),
                address:yup.string().required(),
                mobile_number:yup.string().required(),
                designation:yup.string(),
                notes:yup.string()
                });
            
            //Validation function
            await schema.validate(reqData, { abortEarly: false });
            
            reqData.is_exchange=0;
            await Contact.create(reqData).then();

              // Send success response
              return res.status(200).json({ success:true,message: 'Contact  created' });

        } catch (error) {

              //Send Error response
              var code= (error.name === 'ValidationError')?400:500;   
              return res.status(code).json({ success:false,error: error });

        }

    },

     /** This function is used to edit contact details */
     editContact:async function(req,res){
        try {

            var reqData=req.body;
            var { id }= reqData;

            //validation schema
            var schema=yup.object({
                id:yup.string().uuid().required(),
                first_name:yup.string().required(),
                last_name:yup.string().required(),
                email:yup.string().email().required(),
                address:yup.string().required(),
                mobile_number:yup.string().required(),
                designation:yup.string(),
                notes:yup.string()
                });
            
            //Validation function
            await schema.validate(reqData, { abortEarly: false });
            
            //Edit contact details
            await Contact.update(reqData,{where:{id:id}}).then();

              // Send success response
              return res.status(200).json({ success:true,message: 'Contact  Edited' });

        } catch (error) {

              //Send Error response
              var code= (error.name === 'ValidationError')?400:500;   
              return res.status(code).json({ success:false,error: error });

        }

    },

    /** This function is used to  */
    viewContact:async function(req,res){
        try {
            var { id } = req.params;

            //Validation schema
            var schema=yup.object({
                id:yup.string().uuid().required()
            })

            //Validation function
            await schema.validate(req.params, { abortEarly: false });

            //Get Contact details
            var details= await Contact.findOne({where:{id:id}}).then();

             // Send success response
             return res.status(200).json({ success:true,item:details });

        } catch (error) {
             //Send Error response
             var code= (error.name === 'ValidationError')?400:500;   
             return res.status(code).json({ success:false,error: error });
        }
    },

    /** This function is used to  **/
    listContact:async function(req,res){
        try {
            var { status,limit,page }= req.query;
            status=parseInt(status);  //status - 1 (Exchange Contact) , status-0 (New contact)

             // Validation Schema
             const schema = yup.object({
                page: yup.number().required(),
                limit: yup.number().required(),
                status: yup.number().required().oneOf([0, 1])
             })

              // Validate the request data
            await schema.validate(req.query, { abortEarly: false });

            //To get Counts
            var count = await Contact.count({
                where:{
                    is_exchange:status
                }
            }).then();

            //To get Result
            var result = await Contact.findAll({
                offset: parseInt(page), 
                limit: parseInt(limit),
                order: [['createdAt', 'DESC']],
                where:{
                    is_exchange:status
                }}).then();

            return res.status(200).json({success:true,totalCounts:count,items:result});

        } catch (error) {
             //Send Error response
              var code= (error.name === 'ValidationError')?400:500;   
              return res.status(code).json({ success:false,error: error });
        }
    },


}