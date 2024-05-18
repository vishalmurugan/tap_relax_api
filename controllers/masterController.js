//Importing Modals
const SocalMedia=require('../modals/master_social_media');
const User=require('../modals/users');

const db=require('../config/database');
const yup= require('yup');

module.exports={

    createProducts:async function(req,res){
        try {
        //    var products=[{
        //     name:"pvc card",
        //     price:599,
        //     descriptions:['Multiple functionality','multiple payment','security features','integration','easy system integration']
        //    },
        //    {
        //     name:"standee",
        //     price:899,
        //     descriptions:['Multiple functionality','multiple payment','security features','integration','easy system integration']
        //    }];

        //    await Products.bulkCreate(products).then();

        //    var cards=[
        //     {
        //         name:"card 1",
        //         product:'53fa1c15-6461-44e7-a3b0-f4cfde2a9c3a'
        //     },
        //     {
        //         name:"card 2",
        //         product:'53fa1c15-6461-44e7-a3b0-f4cfde2a9c3a'
        //     },
        //     {
        //         name:"card 3",
        //         product:'53fa1c15-6461-44e7-a3b0-f4cfde2a9c3a'
        //     },
        //     {
        //         name:"card 1",
        //         product:'e22c9d0e-1118-455e-8e10-0652e53963f3'
        //     },
        //     {
        //         name:"card 2",
        //         product:'e22c9d0e-1118-455e-8e10-0652e53963f3'
        //     }
        //    ];

        //    await Cards.bulkCreate(cards).then();

           var media=[
            {
                image:"facebook-icon.svg",
                name:"facebook"
            },
            {
                image:"instagram-icon.svg",
                name:"instagram"
            },
            {
                image:"x.svg",
                name:"x"
            },
            {
                image:"whatsapp-icon.svg",
                name:"whatsapp"
            },
            {
                image:"youtube-icon.svg",
                name:"youtube"
            },
            {
                image:"pintrest-icon.svg",
                name:"pinterest"
            },
            {
                image:"linkedin-icon.svg",
                name:"linkedin"
            }

           ];

           await SocalMedia.bulkCreate(media).then()

           return res.status(200).send('success')
        } catch (error) {
            return res.status(500).json({error:error})
        }
    },

    /**
     *  this function is used to get all master records 
     * */
    getAllMasterRecords:async function(req,res){
        try {
            
           var products =await db.query(`SELECT products.*, JSON_ARRAYAGG(JSON_OBJECT('id', cards.id, 'name', cards.name,'product',cards.product,'image',cards.image)) AS cards
           FROM products
           LEFT JOIN cards ON cards.product=products.id
           GROUP BY products.id`).then();

           var socialMedia=await SocalMedia.findAll().then();

           var response={};
           response.success=true;
           response.products=products[0] || [];
           response.social_media=socialMedia || [];

           return res.status(200).json(response);
           
        } catch (error) {
            return res.status(500).json({success:false,error:error})
        }
    },

    /**
     *  This function is used to create new social mendia
     *  */
    createSocialMedia:async function(req,res){
        try {
            var { name }= req.body;

             //validation schema
            const schema = yup.object({
                name: yup.string().required()
            });

            //Validation function
            await schema.validate(req.body, { abortEarly: false });

            //Insert new social link
            var result= await SocalMedia.create({name:name}).then();

            //success response
            return res.status(200).json({success:true,insertId:result.id});

        } catch (error) {
           //Send Error response
             var code= (error.name === 'ValidationError')?400:500;   
             return res.status(code).json({ success:false,error: error });
        }
    }

}