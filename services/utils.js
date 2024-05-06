const bcrypt=require('bcrypt');

module.exports={

 hashPassword:async function(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
  },

  comparePasswords:async function(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
},

otpGenerate:function(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

}