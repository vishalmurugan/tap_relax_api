/** Company Details Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Company Details table
const table = db.define('company_details',{
	  id: {
        type: DataTypes.UUID,
        primaryKey: true,
       defaultValue: DataTypes.UUIDV4
      },
	 company_name:{type: DataTypes.STRING},
     review_link:{type: DataTypes.STRING(1024)},
	 photo:{type: DataTypes.STRING},
	 email:{type: DataTypes.JSON},
	 mobile_number:{type: DataTypes.JSON},
	 social_media:{type: DataTypes.JSON},
     address:{type: DataTypes.STRING(1024)},
     description:{type: DataTypes.STRING(1024)},
     web_address:{type: DataTypes.STRING(1024)},
    status:{type:DataTypes.INTEGER,defaultValue:0},
    order_id:{type:DataTypes.UUID,
      references: {
          model: 'orders', 
          key: 'id',
          onDelete: 'CASCADE'
      }
    }
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  table;