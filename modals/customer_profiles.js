/** Customer Profile Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Customer Profile table
const Customer = db.define('customer_profiles',{
	  id: {
        type: DataTypes.UUID,
        primaryKey: true,
       defaultValue: DataTypes.UUIDV4
      },
	 username:{type: DataTypes.STRING},
	 photo:{type: DataTypes.STRING},
	 email:{type: DataTypes.JSON},
	 mobile_number:{type: DataTypes.JSON},
   account:{type:DataTypes.UUID,
      references: {
          model: 'users', 
          key: 'id',
          onDelete: 'CASCADE'
      }
    },
    status:{type:DataTypes.INTEGER,defaultValue:0},
    is_subscribed:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  Customer;