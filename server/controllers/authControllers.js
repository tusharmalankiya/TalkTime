const User = require("./../models/User");
const Message = require("./../models/Message");

module.exports.get_chats = async (req, res) => {
    // console.log(req.params);
    const users = await User.find({_id: {$ne: req.params.id}});
    usersData = [];
    users.forEach((user)=>{
        // console.log(user);
        userData = user.toObject();
        delete userData.password;
        usersData.push(userData);
    })
    // console.log(usersData);
    res.status(200).json({ status: true, usersData });
}

module.exports.save_messages = async (req, res) =>{
// console.log(req.body);
const {from, to, message} = req.body;
try{
    await Message.create({from, to, message});
    // console.log(msg);
    return res.json({status: true, message:"Message added to the database successfully."});
}catch (err){
    console.log(err);
    return res.json({status: false, message:"Message failed to be added in database."});
}
}

module.exports.get_messages = async (req, res) =>{
    console.log(req.body);
    const {from, to} = req.body;
    try{
        const msgs = await Message.find({
            $or:[
                {from: from, to: to},
                {from: to, to: from}
            ]
        }).sort({updatedAt: 1});
        // console.log(msgs);
        res.json({status: true, messages: msgs});
    }catch(err){
        console.log(err);
    }
}