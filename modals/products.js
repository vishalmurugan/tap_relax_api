/** Products Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Products table
const Products = db.define('products',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
		name:{type: DataTypes.STRING},
		image:{type: DataTypes.STRING},
		descriptions:{type: DataTypes.JSON},
		price:{type: DataTypes.BIGINT},
       status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  Products;