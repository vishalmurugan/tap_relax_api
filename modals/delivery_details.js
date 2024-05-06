/** Delivary details Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the delivery_details table
const table = db.define('delivery_details',{
	  id: {
        type: DataTypes.UUID,
        primaryKey: true,
       defaultValue: DataTypes.UUIDV4
      },
	 full_name:{type: DataTypes.STRING},
	 mobile_number:{type: DataTypes.STRING},
	 shipping_address:{type: DataTypes.TEXT},
   city:{type: DataTypes.STRING},
   state:{type: DataTypes.STRING},
   pincode:{type: DataTypes.STRING},
   country:{type: DataTypes.STRING},
   order_id:{type:DataTypes.UUID,
      references: {
          model: 'orders', 
          key: 'id',
          onDelete: 'CASCADE'
      }
    },
    status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  table;