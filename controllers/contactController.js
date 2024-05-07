//Importing Modals
const Contact=require('../modals/contacts');

const db=require('../config/database');

//Importing Packages
const yup=require('yup');

module.exports={

    /** This function is used to exchange the receiver contact details */
    exchangeContact:async function(req,res){
        try {

            var reqData=req.body;

            //validation schema
            var schema=yup.object({
                full_name:yup.string().required(),
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

    //  /** This function is used to new contact details */
    //  createContact:async function(req,res){
    //     try {

    //         var reqData=req.body;

    //         //validation schema
    //         var schema=yup.object({
    //             full_name:yup.string().required(),
    //             email:yup.string().email().required(),
    //             mobile_number:yup.string().required(),
    //             order_id:yup.string().uuid().required(),
    //             photo:yup.string(),
    //             });
            
    //         //Validation function
    //         await schema.validate(reqData, { abortEarly: false });
            
    //         reqData.is_exchange=1;
    //         await Contact.create(reqData).then();

    //           // Send success response
    //           return res.status(200).json({ success:true,message: 'Contact Exchanged' });

    //     } catch (error) {
            
    //           //Send Error response
    //           var code= (error.name === 'ValidationError')?400:500;   
    //           return res.status(code).json({ success:false,error: error });

    //     }

    // }

}