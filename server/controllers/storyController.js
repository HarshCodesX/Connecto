import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
// Add User Story
export const addUSerStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, background_color } = req.body;
        const media = req.file; //media will be added to req.files usiing upload middleware created using multer
        let media_url = '';

        //upload media to imagekit
        if(media_type == 'image' || media_type == 'video'){
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            });
            media_url = response.url;
        }

        // create story
        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        });

        res.status(200).json({success: true});

    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error.message});
    }
}

// Get User Stories
export const getStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);

        // User connections and followings
        const userIds = [userId, ...user.connections, ...user.following];
        const stories = await Story.find({ 
            user: { $in: userIds } 
        }).populate('user').sort({createdAt: -1});
        res.json({ success: true, stories });
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error.message});
    }
}