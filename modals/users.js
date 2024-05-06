/** Users Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the Users table
const Users = db.define('users',{
		id: {type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4},
		email:{type: DataTypes.STRING,unique:true},
		mobile_number:{type: DataTypes.STRING},
		password:{type: DataTypes.STRING},
		otp:{type: DataTypes.STRING},
		verified: { type: DataTypes.INTEGER,defaultValue:0},
		role: { type: DataTypes.INTEGER,defaultValue:0},
    status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  Users;