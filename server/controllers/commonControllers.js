const jwt = require("jsonwebtoken");
const User = require("./../models/User");
// const errorHandler = require("./errorHandler");
const bcrypt = require("bcrypt");
require("dotenv").config();

const maxAge = Number(process.env.TOKEN_AGE); //converting into number (seconds)
const createToken = async (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.register_user = async (req, res) => {
  console.log(req.body);
  const {username, email, password} = req.body;
  try {
    const isUsername = await User.findOne({username});
    if(isUsername){
      return res.json({status: false,message:"username already exists"});
    }
    const isEmail = await User.findOne({ email });
    if(isEmail){
      return res.json({status: false, message:"Email already exists"});
    }
    const user = await User.create({username, email, password});
    const userData = user.toObject();
    delete userData.password;    
    console.log(userData);
    res.status(201).json({status: true, userData});
  } catch (err) {
    // const errors = errorHandler(err);
    console.log(err);
    // return res.json(errors);
  }
};

module.exports.login_user = async (req, res) => {
  console.log(req.body);
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if(!user){
      return res.json({status:false, message:"Incorrect Username"});
    }
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return res.json({status:false, message:"Incorrect Password"});
    }
    const userData = user.toObject();
    delete userData.password;
    console.log(userData);
    return res.json({status: true, userData});
    // const token = await createToken(user._id, req.body.username);
    // // console.log(token);
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: process.env.TOKEN_AGE * 1000,
    // });
    // return res.status(200).json({ success: true, id:user._id, token });
  } catch (err) {
    console.log(err);
    // const errors = errorHandler(err);
    // return res.json(errors);
  }
};

module.exports.logout = (req, res) => {
  // res.cookie("token", "", { maxAge: 1 });
  try{
    activeUsers.delete(req.params.id);
    // console.log(activeUsers.get(req.params.id));
    res.status(200).json({status: true, message:"Loggout Out"});
  }catch{
    console.log(err);
  }
};
