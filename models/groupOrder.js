const mongoose = require("mongoose");

const groupOrderSchema = new mongoose.Schema({
    venderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    supplierId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    materialId:{
        type:mongoose.Schema.Types.ObjectId,
        rer:'Material'
    },
    status:{
        type:String,
        enum:['open', 'closed', 'delivered'],

    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

});

module.exports = mongoose.Schema('groupOrder', groupOrderSchema);