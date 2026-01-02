import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

// Get user data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found!"});
        }
        res.json({success: true, user});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//update user data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {username, bio, location, full_name} = req.body;
        const tempUser = await User.findById(userId);
        !username && (username = tempUser.username); //if username is not provided, add already existing username
        if(tempUser.username !== username){
            const user = User.findOne({username});
            if(user){
                //we will not change the username if it is already taken
                username = tempUser.username;
            }
        }
        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];

        if(profile){
           const buffer = fs.readFileSync(profile.path);
           const response = await imagekit.upload({
            file: buffer,
            fileName: profile.originalname,
           });

           const url = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: auto},
                {format: 'webp'},
                {width: '512'}
            ]
           });
           updatedData.profile_picture = url;
        }

        if(cover){
           const buffer = fs.readFileSync(cover.path);
           const response = await imagekit.upload({
            file: buffer,
            fileName: profile.originalname,
           });

           const url = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: auto},
                {format: 'webp'},
                {width: '1280'}
            ]
           });
           updatedData.cover_photo = url;
        }
        const user = await User.findByIdAndUpdate(userId, updateUserData, {new: true}); //{new: true}, so it will return after updating the user
        res.json({success: true, user, message: "Profile updated successfully"})
    } catch (error) {
        console.log(error.message);
    }
}