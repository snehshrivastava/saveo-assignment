var mongoose = require('mongoose');
var medicineSchema = new mongoose.Schema({
    productId: String,
    quantity: Number,
    userId: String,
    status: String,
    isDeleted: { type: Boolean, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

module.exports = new mongoose.model('Orders', medicineSchema);