

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
        throw new apiError(400, "All fields are required");
    }

    if (password.length < 6) {
        throw new apiError(400, "Password must be at least 6 characters");
    }
    
    const existingUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    });

    if (existingUser) {
        throw new apiError(409, "Username o r email already exists");
    }
    const avatarLocalPath = req.file?.path;
    console.log("Avatar local path:", avatarLocalPath);
    
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar || !avatar.url){
        throw new apiError(500, "Failed to upload avatar");
    }
    console.log("Avatar uploaded to Cloudinary:", avatar.url);

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        avatar: avatar?.url
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new apiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                createdUser,
                "User registered successfully"
            )
        );

});
const loginUser = asyncHandler(async (req, res) => {
    const { email ,username, password } = req.body;
    if (!email?.trim() && !username?.trim()) {
        throw new apiError(400, "Email or username is required");
    }
    const user = await User.findOne({
        $or: [
            { email },
            { username}]       
    })
    if(!user){
        throw new apiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findByIdAndUpdate(
        user._id).select("-password -refreshToken");
const options ={
    httpOnly:true,
    secure:true
}
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new 
    apiResponse(200,{
        user: loggedInUser,accessToken,refreshToken
    },"User logged in successfully"))

})
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                null,
                "User logged out successfully"
            )
        );
        
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken 
    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user =await User.findById(decodedToken._id)
    if(!user){
        throw new apiError(404,"User not found")
    }
    if(user.refreshToken !== incomingRefreshToken){
        throw new apiError(401, "Invalid refresh token");
    }


    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    const options ={
    httpOnly:true,
    secure:true
}
return res.status(200).cookie("accessToken",accessToken,options)
.cookie("refreshToken",newRefreshToken,options)
.json(new apiResponse(200,{
    accessToken,
    refreshToken:newRefreshToken
},"Access token refreshed successfully"))
})
const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new apiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "Current user fetched successfully"
            )
        );
});
const updateUser  = asyncHandler(async (req, res) => {
const { username, email } = req.body;
if (!username?.trim() || !email?.trim()) {
    throw new apiError(400, "Username and email are required");
}
const user = await User.findByIdAndUpdate(req.user._id, 
    { 
    $set:{
        username,
        email
    }
 }, { new : true }
).select("-password -refreshToken")
 
 return res.status(200)
 .json(new
     apiResponse(200,user,"User updated successfully"))
})
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword ,conformPassword} = req.body;
    if(!oldPassword||!newPassword){
        throw new apiError(400,"oldPassword and new password are required")
    }
    if (newPassword.length < 6) {
        throw new apiError(
            400,
            "New password must be at least 6 characters"
        );
    }
    if(newPassword !== conformPassword){
        throw new apiError(400,"New password and confirm password do not match")
    }
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new apiError(400,"Invalid old password")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200)
        .json(new apiResponse(200, null, "Password changed successfully"))
})
const  updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar is required")
    }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new apiError(500,"Failed to upload avatar")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password -refreshToken")
   return res.status(200)
   .json(new apiResponse
    (200,user,"User avatar updated successfully"))
})
export { registerUser, loginUser ,logoutUser,
    refreshAccessToken,getCurrentUser,changePassword,
    updateUser,updateUserAvatar};