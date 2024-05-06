/** Master Social Media Model */

//Importing database configaration
const db = require('../config/database');

const { DataTypes } = require('sequelize');


//To create the social media table
const Social_media = db.define('master_social_media',{
		id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		name:{type: DataTypes.STRING},
		image:{type: DataTypes.STRING},
        status:{type:DataTypes.INTEGER,defaultValue:0}
  }, {
    timestamps: true
  });
  
  
  //Exporting the table to use in other files
  module.exports =  Social_media;