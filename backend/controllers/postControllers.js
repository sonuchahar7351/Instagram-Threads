import User from '../models/userModel.js';
import Post from '../models/postModel.js';
// import {v2 as cloudinary} from 'cloudinary';
import cloudinary from '../cloudinary/cloudinary.js';

export const createPost = async(req,res)=>{
      try {
           const {postedBy,text}=req.body;
           let {img} = req.body;
           if(!postedBy){
            return res.status(400).json({error:"please login before create post"})
           }
           if(!text){
            return res.status(400).json({error:"text field is required"});
           }
           const user= await User.findById(postedBy);
           if(!user){
            return res.status(400).json({error:"user not found"})
           }
      //     console.log((user._id).toString() !== ( req.user._id).toString());
           if(user._id.toString() !== req.user._id.toString()){
            return res.status(400).json({error:"unauthorized to create post"})
           }

           const maxLength = 500;
           if(text.length > maxLength){
            return res.status(400).json({error:"Text must be less than 500 character"})
           }

           if(img){
              const uploadedResponse = await cloudinary.uploader.upload(img)
              img = uploadedResponse.secure_url;
           }
            
           const newPost = new Post({postedBy,text,img});
           await newPost.save();
           res.status(201).json(newPost);

      } catch (error) {
            console.log(error);
            res.status(500).json({error:"error while creating post"});
      }
}

export const getPost = async (req,res)=>{
      try {
            const post = await Post.findById(req.params.id);
            if(!post){
                  return res.status(400).json({error:"post not found"})
            }
            res.status(200).json(post);
      } catch (error) {
            console.log(error)
            res.status(500).json({error:"error while geting post"})
      }
}

export const deletePost= async (req,res)=>{

      try {
            const post = await Post.findById(req.params.id);
            if(!post){
                  return res.status(404).json({error:"post not found"});
            }
            if(post.postedBy.toString() !== req.user._id.toString()){
                  return res.status(401).json({error:"unauthrized to delete post"})
            }
            if(post.img){
                  const imgId = post.img.split('/').pop().split(".")[0];
                  await cloudinary.uploader.destroy(imgId);
            }
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Post deleted succussfully"});

      } catch (error) {
            console.log(error);
            res.status(400).json({error:"error while deleting post"})
      }

}

export const likeUnlikePost = async(req,res)=>{
      try {
            const {id:postId}=req.params;
            const userId=req.user._id;

            const post = await Post.findById(postId);

            if(!post){
                  return res.status(404).json({error:"post not found"});
            }

            const userLikePost = post.likes.includes(userId);
            if(userLikePost){
                  // unlike post 
                  await Post.updateOne({_id:postId},{$pull:{likes:userId}})
                  res.status(200).json({message:"Post unliked successfully"})
            }else{
                  // like post 
                   post.likes.push(userId);
                   await post.save();
                   res.status(200).json({message:"Post liked successfully"})
            }

      } catch (error) {
            res.status(500).json({error:"error while like or unlike post",error})
      }
}

export const replyToPost = async(req,res)=>{
      try {
            const {text}= req.body;
            const postId=req.params.id;
            const userId= req.user._id;
            const userProfilePic = req.user.profilePic;
            const username = req.user.username;
            if(!text){
                  return res.status(400).json({error:"Text field is required"})
            }
            const post = await Post.findById(postId);
            if(!post){
                  return res.status(400).json({error:"post does not exists"})
            }
            const reply = {userId,text,userProfilePic,username};
            post.replies.push(reply);
            await post.save();
            res.status(200).json(reply);
         
      } catch (error) {
            console.log(error,"error while reply to post");
      }
}

export const getFeedPosts = async(req,res)=>{
      try {
            const userId=req.user._id;
           
            const user= await User.findById(userId);
        
            if(!user){
                  return res.status(400).json({error:"user does not exists"})
            }
            const following = user.following;
       

            const feedPosts=  await Post.find({postedBy: { $in: following }}).sort({createdAt:-1}).populate('postedBy','-password');

            res.status(200).json(feedPosts)


      } catch (error) {
            res.status(500).json({error:"error while giving feed post"})
      }
}

export const getUserPosts = async(req,res)=>{
      const {username} = req.params;

      try {
            const user = await User.findOne({username});
            if(!user){
                  return res.status(400).json({error:"User not found"})
            }
            const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
            res.status(200).json(posts);
            
      } catch (error) {
            res.status(500).json({error:"error while get user posts",error})
      }
}