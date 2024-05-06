/** Cards Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Cards table
const Cards = db.define('cards',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
		name:{type: DataTypes.STRING},
		image:{type: DataTypes.STRING},
    product:{type:DataTypes.UUID,
        references: {
            model: 'products', 
            key: 'id'
          }
    },
    status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  Cards;