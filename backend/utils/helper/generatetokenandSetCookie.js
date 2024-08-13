import jwt from 'jsonwebtoken'

const generateTokenAndSetCoolie = (userId,res)=>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn:'15d',
  })

  res.cookie("jwt", token, {
    // httpOnly: true, // More secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // Adjust as needed
});

  return token;
   
}

export default generateTokenAndSetCoolie;