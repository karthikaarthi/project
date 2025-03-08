
require("dotenv").config() 
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");

async function verifyToken(req, res, next) {
    const Authorization = req.header('Authorization')
    const token = Authorization && Authorization.split(' ')[1];
    if(!token) return next(errorHandler(403,"Access denied . No token is provid"));
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded) return next(errorHandler(400,"Invalid token "))
        req.user = decoded;
        next();
    }catch(err) {
        next(err);
    }
}

  function checkRole(roles) {
    return (req, res, next )=>{
        if(!req.user || !roles.includes(req.user.role)){
            return next(errorHandler(403,"Access Denied"))
        }
        next();
    }
}

module.exports = {
    verifyToken,
    checkRole
}