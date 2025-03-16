
require("dotenv").config() 
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");
const Blacklist = require("../db/models/blackList.model");

async function verifyToken(req, res, next) {
    
    
    const Authorization = req.header('Authorization')
    const token = Authorization && Authorization.split(' ')[1];
    console.log(token)
    if(!token) return next(errorHandler(403,"Access denied . No token is provid"));
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded)
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


async  function autoLogout ( req, res, next) {
    const Authorization = req.header('Authorization')
    const token = Authorization && Authorization.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            message: 'Unauthorized - No token provided'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const currentTime = Math.floor(Date.now()/1000);
        if(decoded.exp < currentTime) {
            return  res.status(401).json({
                message: 'Token Expired - Please Login Again'
            })
        }
        req.user = decoded;
        next();
    }catch(err) {
        next(err);
    }
}
module.exports = {
    verifyToken,
    checkRole,
    autoLogout
}