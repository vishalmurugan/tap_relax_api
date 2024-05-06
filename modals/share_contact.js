/** Share Contact Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Share Contact table
const table = db.define('share_contacts',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
		personal_details_link:{type: DataTypes.JSON},
		company_details_link:{type: DataTypes.JSON},
        order_id:{type:DataTypes.UUID,
            references: {
                model: 'orders', 
                key: 'id'
            }
        },
        account:{type:DataTypes.UUID,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  table;