const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");


module.exports.renderRegistPage = asyncHandler(async(req, res)=>{
    const {name, phone, password, role} = req.body;
    const existingUser = await User.findOne({phone});
    if(existingUser){
        return res.status(400).json({message:'User already exists!'});
    }
    const passHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,phone,passHash,role
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
    });
    return res.status(201).json({message:'User created Successfully!', token, 
        user: {
            id: newUser._id,
            name: newUser.name,
            phone: newUser.phone,
            role: newUser.role,
        }
    ,});
    
});

module.exports.renderLoginPage = asyncHandler(async(req, res)=>{
    const {name, password} = req.body;
    const existingUser = await User.findOne({name});
    if(!existingUser){
        return res.status(400).json({message:"Please register first to create an account!"});
    }
    const isMatch = await bcrypt.compare(password, existingUser.passHash);
    if(!isMatch){
        return res.status(400).json({message:"Incorrect password or username!"});
    }
    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return res.json({message:"You've Logged In Successfully!", token, user:{
        id:existingUser._id,
        name:existingUser.name,
        phone:existingUser.phone,
        role: existingUser.role
    }});
    
});

module.exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(user);
});

