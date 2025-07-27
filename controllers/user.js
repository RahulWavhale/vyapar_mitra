import asyncHandler from '../middleware/asyncHandler.js';
import { hash, compare } from 'bcryptjs';
import JWT from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadToCloudinary } from './uploadToCloudinary.js';
import { compressImage } from '../middleware/uploadMiddleware.js';

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    password,
    role,
    email,
    address,
    shopName,
    supplierType,
    gstNumber
  } = req.body;

  // Validation
  if (!name || !phone || !password || !role) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const passHash = await hash(password, 10);
  const identifier = phone || email;

  // Initialize file URLs
  let samplePhotoUrl = '';
  let shopImgUrl = '';
  let idProofUrl = '';

  // Handle file uploads
  try {
    // Sample product photo (required for suppliers)
    if (role === 'supplier' && req.files?.samplePhotoUrl?.[0]?.buffer) {
      const compressed = await compressImage(req.files.samplePhotoUrl[0].buffer);
      samplePhotoUrl = await uploadToCloudinary(compressed, `trustbasket/suppliers/${identifier}/products`);
    }

    // Shop image (optional for buyers)
    if (req.files?.shopImgUrl?.[0]?.buffer) {
      const compressed = await compressImage(req.files.shopImgUrl[0].buffer);
      shopImgUrl = await uploadToCloudinary(compressed, `trustbasket/${role}s/${identifier}/shop`);
    }

    // ID proof (required for suppliers)
    if (role === 'supplier' && req.files?.idProofUrl?.[0]?.buffer) {
      const compressed = await compressImage(req.files.idProofUrl[0].buffer);
      idProofUrl = await uploadToCloudinary(compressed, `trustbasket/suppliers/${identifier}/id_proof`);
    }
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ message: 'Error uploading files' });
  }

  // Validate required files for suppliers
  if (role === 'supplier' && (!samplePhotoUrl || !idProofUrl)) {
    return res.status(400).json({ message: 'Sample product photo and ID proof are required for suppliers' });
  }

  // Create new user
  const newUser = await User.create({
    name,
    phone,
    email,
    passHash,
    role,
    supplierType: role === 'supplier' ? supplierType : undefined,
    location: {
      address: address || '',
      lng: 0, // You might want to get these from geolocation
      lat: 0
    },
    shopName: shopName || undefined,
    samplePhotoUrl: role === 'supplier' ? samplePhotoUrl : undefined,
    documents: {
      shopImgUrl: shopImgUrl || undefined,
      idProofUrl: role === 'supplier' ? idProofUrl : undefined,
      gstNumber: gstNumber || undefined
    },
    status: 'pending' // All new accounts go through approval
  });

  // Generate JWT token
  const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.status(201).json({
    message: 'User registered successfully. Account pending approval.',
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status
    }
  });
});
// Login User (using phone or email)
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Phone/email and password are required' });
  }

  const user = await User.findOne({
    $or: [{ phone: identifier }, { email: identifier }],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // ✅ Skip status check if role is admin
  if (user.role !== 'admin' && user.status !== 'approved') {
    return res.status(403).json({ 
      message: 'Account pending approval. Please wait for admin approval.' 
    });
  }

  const isMatch = await compare(password, user.passHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});
// Get Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-passHash')
    .lean();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Format response to match frontend expectations
  const profileData = {
    ...user,
    address: user.location?.address || '',
    shopName: user.shopName || '',
    supplierType: user.supplierType || '',
    documents: {
      shopImgUrl: user.documents?.shopImgUrl || '',
      idProofUrl: user.documents?.idProofUrl || '',
      gstNumber: user.documents?.gstNumber || ''
    }
  };

  res.json(profileData);
});

export default {
  registerUser,
  loginUser,
  getUserProfile,
};