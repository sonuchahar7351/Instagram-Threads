import jwt from 'jsonwebtoken'

const generateTokenAndSetCoolie = (userId,res)=>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn:'15d',
  })

  res.cookie("jwt",token,{
      httpOnly:true, // more secure 
      mexAge:15*24*60*60*1000,//15 days
      sameSite:"strict", // 

  })

  return token;
   
}

export default generateTokenAndSetCoolie;