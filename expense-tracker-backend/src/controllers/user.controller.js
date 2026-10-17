

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
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
        throw new apiError(409, "Username or email already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
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
    if (!email?.trim() || !username?.trim()) {
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
export { registerUser, loginUser };