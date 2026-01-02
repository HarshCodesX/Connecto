import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

// Get user data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found!"});
        }
        res.json({success: true, user});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "User not found"});
    }
}

//update user data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let {username, bio, location, full_name} = req.body;

        const tempUser = await User.findById(userId);
        if(!tempUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        !username && (username = tempUser.username); //if username is not provided, add already existing username
        if(tempUser.username !== username){
            const user = await User.findOne({username});
            if(user){
                //we will not change the username if it is already taken
                username = tempUser.username;
            }
        }
        const updatedData = {
            username: username || tempUser.username,
            bio: bio || tempUser.bio,
            location: location || tempUser.location,
            full_name: full_name || tempUser.full_name
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
                {quality: 'auto'},
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
            fileName: cover.originalname,
           });

           const url = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'},
                {format: 'webp'},
                {width: '1280'}
            ]
           });
           updatedData.cover_photo = url;
        }
        const user = await User.findByIdAndUpdate(userId, updatedData, {new: true}); //{new: true}, so it will return after updating the user
        res.json({success: true, user, message: "Profile updated successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({sucess: false, message: error.message});
    }
}

// Find Users using username, email, location, name
export const discoverUsers = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {input} = req.body;
        if (!input || input.trim() === "") {
            return res.json({ success: true, users: [] });
        }
        const allUsers = await User.find({
            $or: [
                {username: new RegExp(input, 'i')},
                {email: new RegExp(input, 'i')},
                {full_name: new RegExp(input, 'i')},
                {location: new RegExp(input, 'i')},
            ]
        })
        const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);
        res.json({success: true, users: filteredUsers});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}