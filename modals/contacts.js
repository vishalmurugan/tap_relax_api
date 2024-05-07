/** Contact Details Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Contact Details table
const table = db.define('contacts',{
	  id: {
        type: DataTypes.UUID,
        primaryKey: true,
       defaultValue: DataTypes.UUIDV4
      },
	 first_name:{type: DataTypes.STRING},
	 last_name:{type: DataTypes.STRING},
	 photo:{type: DataTypes.STRING},
	 email:{type: DataTypes.STRING},
	 mobile_number:{type: DataTypes.STRING},
	 designation:{type: DataTypes.STRING},
     address:{type: DataTypes.STRING(1024)},
     notes:{type: DataTypes.STRING(1024)},
    status:{type:DataTypes.INTEGER,defaultValue:0},
    is_exchange:{type:DataTypes.INTEGER,defaultValue:0},
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