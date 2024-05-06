/** Payment Details Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Payment Details table
const table = db.define('payment_details',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
		payment_links:{type: DataTypes.JSON},
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