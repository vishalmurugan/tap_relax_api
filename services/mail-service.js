/** In Mail service , it is used to send mail **/

const nodemailer = require("nodemailer");

//Mail configurations
const transporter = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
   port: process.env.MAIL_PORT,
   auth: {
       user: process.env.MAIL_USERNAME,
       pass: process.env.MAIL_PASSWORD
   }
});

module.exports = {
    
  /** To send Email
   @data - To mail,subject , message 
  **/
  sendMail:async function(data){
	  
	  transporter.sendMail({
	      from: { name: 'Tap & Relax', address: process.env.MAIL_USERNAME },
	      to: data.to.toLowerCase(), 
	      subject: data.subject, 
	      html:data.message
	   }, function(error, info){
	   if (error) {
		 console.log(error);
	   } else {
		 console.log('Email sent');
	   }
	 });

	  
  }
  
}