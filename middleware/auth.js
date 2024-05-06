/** auth.js is a middleware. we have used this for verifying tokens */

//To generate Tokens to authenticate user
const jwt = require("jsonwebtoken");

//Exporting for check credential to use in the routing
module.exports = (req, res, next) => {
    let token = req.headers["authorization"];
    
        if (!token) {
            return res.status(401).json({
               error: "No token provided!"
            });
        }else{
            let authToken = token.split(' ')[1];
            // To verify the Tokens
            jwt.verify(authToken, process.env.TOKEN, (err, decoded) => {
              if (err) {
                return res.status(401).json({
                  error: "Unauthorized User!"
                });
              }
              req.user=decoded;
              next();
            });
       }
  };