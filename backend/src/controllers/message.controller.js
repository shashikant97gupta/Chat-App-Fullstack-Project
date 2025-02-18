import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSideBar = async(req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // $ne means not equal to --- ** -password means it will not return password column when all records fetched
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId}}).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in message in controller", error.message);
    return res.status(500).json({ message: "Internal Server Error"});
  }  
}

export const getMessages = async(req, res) => {
    try {
        // getting id passed through params in alias variable userToChatId
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });

        return res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error in message in controller", error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receriverId } = req.params;
        const senderId = req.user._id;

        let imageURL;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receriverId,
            text,
            image: imageURL
        })

        await newMessage.save();

        // todo realtime func 
        const receiverSocketId = getReceiverSocketId(receriverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json(newMessage);


    } catch (error) {
        console.log("Error in message in controller", error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}