import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Message from '../models/Message.js';

// Created an empty object to store server-side connections
const connections = {};

// Controller function for the server-side-event (sse) endpoint
export const sseController = (req, res) => {
    const { userId } = req.params;
    console.log('New client connected : ', userId);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client's response object to the connections object
    connections[userId] = res;

    // Send an initial event to the client
    res.write('log: Connected to SSE stream\n\n');

    // Handle client disconnection
    req.on('close', () => {
        //Remove the client's response object from the connections object
        delete connections[userId];
        console.log('Client disconnected : ', userId);
    }); 
}

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';
        if(message_type === 'image'){
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });
            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            });
        };
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        });
        res.status(200).json({success: true, message});

        // Send message to to_user_id using server-side-events (SSE)

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');
        if(connections[to_user_id]){
            connections[to_user_id].write(`data: new_message\ndata: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

// Get chat messages
export const getChatMessages = async (req, res) => {
    try {
       const { userId } = req.auth();
       const { to_user_id } = req.body;

       const messages = await Message.find({
        $or: [
            {from_user_id: userId, to_user_id: to_user_id},
            {from_user_id: to_user_id, to_user_id: userId},
        ]
       }).sort({createdAt: -1});

       // Mark messages as seen
       await Message.updateMany({from_user_id: to_user_id, to_user_id: userId}, {seen: true});
       res.status(200).json({success: true, messages});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

// Get user's recent messages
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({to_user_id: userId}.populate('from_user_id to_user_id')).sort({created_at: -1});
        res.status(200).json({success: true, messages});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}


//added comment