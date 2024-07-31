import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from "../utils/helper/generatetokenandSetCookie.js";


//sign up user 
export const signupUser =async(req,res)=>{

      try {
            const {name,email,username,password}=req.body;



            const user = await User.findOne({$or:[{email},{username}]});

            if(user){
                  return res.status(400).json({message:"user already exists"})
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);

            const newUser= new User({
                  name,
                  email,
                  username,
                  password:hashPassword,
            });
             await newUser.save();
             if(newUser){

                  generateTokenAndSetCookie(newUser._id,res)
                  res.status(201).json({
                        _id:newUser._id,
                        name:newUser.name,
                        email:newUser.email,
                        username:newUser.username,
                  })
             }else{
                  res.status(400).json({message:"invalid user daga"})
             }

      } catch (error) {
            res.status(500).json({message:error.message})
            console.log("error in signupUser", error.message)
      }
}

// login user 
export const loginUser = async (req,res)=>{

      try {
            const {username,password} = req.body;

            if(!username){return res.status(400).json({message:"All fields are required"})}
            if(!password){return res.status(400).json({message:"All fields are required"})}

            const user = await User.findOne({username});
            const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

            if(!user || !isPasswordCorrect){
                  return res.status(400).json({message:"invalid username or password"});
            }
            generateTokenAndSetCookie(user._id,res);

            res.status(200).json({
                  _id:user._id,
                  name:user.name,
                  email:user.email,
                  username:user.username,
            });

      } catch (error) {

            res.status(500).json({message:error.message});
            console.log("error in login user",error.message)
            
      }

}

//logout  user 
export const logoutUser = async (req,res)=>{
      try {

            res.cookie("jwt","",{maxAge:1});
            res.status(200).json({message:"User logged out succussfully "})
            
      } catch (error) {
            res.status(500).json({message:error.message});
            console.log("error in logout user", error.message)
      }
}

//follow and unfollow 
export const followUnfollowUser = async (req,res)=>{
      try {
            
          const {id}= req.params;
          const userToModify = await User.findById(id);
          const currentUser = await User.findById(req.user._id);

          if(id === req.user_id){return res.status(400).json({message:"you cannot follow/unfollow yourself"})};
          
          if(!userToModify || ! currentUser)return res.status(400).json({message:"user not found"})

            const isFollowing = currentUser.following.includes(id);

            if(isFollowing){
                  // unfollow user 
                  // modify currect user following , modify followers  of userToModify

                  await User.findByIdAndUpdate(req.user?._id,{$pull:{following:id}});
                  await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
                  res.status(200).json({message:"user unfollow successfully"})
            }
            else{
                  // follow user 
                  await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
                  await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
                  res.status(200).json({message:"user follow successfully"})
            }

      } catch (error) {
            res.status(500).json({message:error.message});
            console.log("error in follow and unfollow", error.message)
      }
}