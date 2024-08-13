import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from "../utils/helper/generatetokenandSetCookie.js";
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose";
import Post from '../models/postModel.js'


//sign up user 
export const signupUser = async (req, res) => {

      try {
            const { name, email, username, password } = req.body;



            const user = await User.findOne({ $or: [{ email }, { username }] });

            if (user) {
                  return res.status(400).json({ error: "user already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                  name,
                  email,
                  username,
                  password: hashPassword,
            });
            await newUser.save();
            if (newUser) {

                  generateTokenAndSetCookie(newUser._id, res)
                  res.status(201).json({
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        username: newUser.username,
                        bio: newUser.bio,
                        profilePic: newUser.profilePic
                  })
            } else {
                  res.status(400).json({ error: "invalid user" })
            }

      } catch (error) {
            res.status(500).json({ error: "error when sign up" })
            console.log("error in signupUser", error.message)
      }
}

// login user 
export const loginUser = async (req, res) => {

      try {
            const { username, password } = req.body;

            if (!username) { return res.status(400).json({ error: "All fields are required" }) }
            if (!password) { return res.status(400).json({ error: "All fields are required" }) }

            const user = await User.findOne({ username });
            const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

            if (!user || !isPasswordCorrect) {
                  return res.status(400).json({ error: "invalid username or password" });
            }
            generateTokenAndSetCookie(user._id, res);

            res.status(200).json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  username: user.username,
                  bio: user.bio,
                  profilePic: user.profilePic,
           });
      } catch (error) {
            res.status(500).json({ error: "error when login" });
      }

}

//logout  user 
export const logoutUser = async (req, res) => {
      try {

            res.cookie("jwt", "", { maxAge: 1 });
            res.status(200).json({ message: "User logged out succussfully " })

      } catch (error) {
            res.status(500).json({ error: "error when logout" });
            console.log("error in logout user", error.message)
      }
}

//follow and unfollow 
export const followUnfollowUser = async (req, res) => {
      try {

            const { id } = req.params;
            const userToModify = await User.findById(id);
            const currentUser = await User.findById(req.user._id);

            //      console.log(id,"skflkflfslfs",req.user._id.toString());

            if (id === req.user._id.toString()) { return res.status(400).json({ error: "you cannot follow/unfollow yourself" }) };

            if (!userToModify || !currentUser) return res.status(400).json({ error: "user not found" })

            const isFollowing = currentUser.following.includes(id);

            if (isFollowing) {
                  // unfollow user 
                  // modify currect user following , modify followers  of userToModify

                  await User.findByIdAndUpdate(req.user?._id, { $pull: { following: id } });
                  await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
                  res.status(200).json({ message: "user unfollow successfully" })
            }
            else {
                  // follow user 
                  await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
                  await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
                  res.status(200).json({ message: "user follow successfully" })
            }

      } catch (error) {
            res.status(500).json({ error: "Can't perform this action" });
            console.log("error in follow and unfollow", error.message)
      }
}

//update user profile 
export const updateUserProfile = async (req, res) => {
      const { name, email, username, password, bio } = req.body;
      let { profilePic } = req.body;
      const userId = req.user._id;
      try {

            let user = await User.findById(userId);
            if (!user) return res.status(400).json({ error: "user not found" });

            if (req.params.id !== userId.toString()) return res.status(400).json({ error: "you can not update other user's profile" })

            if (password) {
                  const salt = await bcrypt.genSalt(10);
                  const hashPassword = await bcrypt.hash(password, salt);
                  user.password = hashPassword;
            }

            // Only handle profile picture if it has changed
            if (profilePic) {
                  // Extract the public ID from the existing profile picture URL
                  const existingProfilePic = user.profilePic; // Existing Cloudinary URL
                  const existingPublicId = existingProfilePic.split("/").pop().split(".")[0]; // Get public ID

                  // Check if the new profilePic is different from the existing one
                  if (!existingProfilePic.includes(profilePic)) {
                        // If the user already has a profile picture, delete it
                        if (existingProfilePic) {
                              await cloudinary.uploader.destroy(existingPublicId);
                        }
                        // Upload the new profile picture to Cloudinary
                        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
                        profilePic = uploadedResponse.secure_url; // Update profilePic with the new URL
                  } else {
                        // If the profilePic is the same, keep the existing one
                        profilePic = existingProfilePic; // Retain the current profile picture
                  }
            } else {
                  // If profilePic is not provided, keep the existing one
                  profilePic = user.profilePic; // Retain the current profile picture
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.username = username || user.username;
            user.profilePic = profilePic || user.profilepic;
            user.bio = bio || user.bio;

            user = await user.save();
            //find all posts that this user replied and update username and userProfilePic fields.
            await Post.updateMany({"replies.userId":userId},{$set:{"replies.$[reply].username":user.username,"replies.$[reply].userProfilePic":user.profilePic}},{arrayFilters:[{"reply.userId":userId}]});
            //password should be null in response
            user.password = null;
            res.status(200).json(user)

      } catch (error) {
            res.status(500).json({ error: "error in update profile" })
      }
}

//get user profile 
export const getUserProfile = async (req, res) => {
      //we will fetch user profile either with username or userId 
      //query is either username or userId
      const { query } = req.params;
      try {
            // const user = await User.findOne({ username }).select("-password").select("-updatedAt");
            let user;

            //query is userId 
            if (mongoose.Types.ObjectId.isValid(query)) {
                  user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
            } else {
                  // query is username 
                  user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
            }

             if (!user) return res.status(400).json({ error: "user not found" });
            res.status(200).json(user)

      } catch (error) {
            console.log("error in profile getting", error.message);
            res.status(500).json({ error: "error in profile getting" })
      }
}

