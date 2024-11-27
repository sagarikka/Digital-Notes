require("dotenv").config();
const jwt=require("jsonwebtoken")

//genearting token
exports.getToken =async(user)=>{
    const token=jwt.sign(
        {identifier:user._id},
        process.env.PASSPORT_SECRET_KEY,
        {expiresIn: 86400 * 7 }
    );
    console.log(token);
    return token;
}

module.exports=exports;