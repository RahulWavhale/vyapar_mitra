const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  }, 
  description:{
    type:String
  },
  category:{
    type:String
  },
  pricePerUnit: { 
    type: Number, 
    required: true
  },
  unit: { 
    type: String, 
    default: 'kg' 
  }, 
  stockAvailable: {
    type:Number
  },
  imageUrl: {
    type:String
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Material', materialSchema);
