const User = require("./../models/User");
const Message = require("./../models/Message");
const ChatRoom = require("../models/ChatRoom");
const fs = require('fs').promises;

async function deleteFile(path) {
    try {
        await fs.unlink(path);
        console.log(`File ${path} deleted successfully`);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

module.exports.get_chats = async (req, res) => {
    // console.log(req.params);
    const users = await User.find({ _id: { $ne: req.params.id } }).sort({ username: 1 });
    usersData = [];
    users.forEach((user) => {
        // console.log(user);
        userData = user.toObject();
        delete userData.password;
        usersData.push(userData);
    })
    // console.log(usersData);
    res.status(200).json({ status: true, usersData });
}

module.exports.save_messages = async (req, res) => {
    // console.log(req.body);
    const { from, to, message } = req.body;
    try {
        await Message.create({ from, to, message });
        // console.log(msg);
        return res.json({ status: true, message: "Message added to the database successfully." });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Message failed to be added in database." });
    }
}

module.exports.get_messages = async (req, res) => {
    console.log(req.body);
    const { from, to } = req.body;
    try {
        const msgs = await Message.find({
            $or: [
                { from: from, to: to },
                { from: to, to: from }
            ]
        }).sort({ updatedAt: 1 });
        // console.log(msgs);
        res.json({ status: true, messages: msgs });
    } catch (err) {
        console.log(err);
    }
}

module.exports.set_profile = async (req, res) => {
    if (req.file) {
        const userId = req.body.userId;
        const avatar = req.file.path;

        try {

            const user = await User.findByIdAndUpdate(userId, { avatar });
            // const userData = user.toObject();
            // delete userData.password;
            if (user.avatar) {
                deleteFile(user.avatar);
            }

            console.log(user);
            res.json({ status: true, avatar, message: "profile set up sucessfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, message: "profile set up failed" });
        }

    }
}


module.exports.create_chatroom = async (req, res)=>{
    try{
        const name = req.body.chatRoomName;
        const members = await JSON.parse(req.body.members);
        const avatar = req.file.path;

        const isChatRoom = await ChatRoom.findOne({name});
        if(isChatRoom){
            return res.json({status: false, message:"Name already exists"});
        }
        const chatRoom = await ChatRoom.create({name, members, avatar});
        console.log(chatRoom);
        
        res.json({status: true, chatRoom});
    }catch(err){
        console.log(err);
        res.status(500).json({status: false, message: err.message});
    }
}