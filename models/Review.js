const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  supplier: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', 
     required: true
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true
  },
  comment: {
    type:String
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
