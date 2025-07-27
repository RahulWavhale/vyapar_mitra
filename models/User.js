const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  location: {
    address: String,
    lng: Number,
    lat: Number,
  },
  role: {
    type: String,
    enum: ['buyer', 'supplier', 'admin'],
    required: true
  },
  supplierType: {
    type: String,
    enum: ['farmer', 'vendor'],
    required: function () {
      return this.role === 'supplier';
    }
  },

  passHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  shopName: {
    type: String
  },
  samplePhotoUrl: {
    type: String,
    required: function () {
      return this.role === 'supplier';
    }
  },
  documents: {
    shopImgUrl: String,
    idProofUrl: String,
    gstNumber: String
  },
  ratings: {
    stars: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }

});

module.exports = mongoose.model('User', userSchema);