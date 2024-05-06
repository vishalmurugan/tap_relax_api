/** Orders Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Orders table
const table = db.define('orders',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
      account:{type:DataTypes.UUID,
            references: {
                model: 'users', 
                key: 'id',
                onDelete: 'CASCADE'
            }
          },
      card:{type:DataTypes.UUID,
        references: {
            model: 'cards', 
            key: 'id',
            onDelete: 'CASCADE'
        }
      },
      account:{type:DataTypes.UUID,
        references: {
            model: 'users', 
            key: 'id',
            onDelete: 'CASCADE'
        }
      },
       status:{type:DataTypes.INTEGER,defaultValue:0},
       quantity:{type:DataTypes.INTEGER,defaultValue:1},
       price:{type:DataTypes.BIGINT},
       is_active:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  table;