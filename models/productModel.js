var mongoose = require('mongoose');
var medicineSchema = new mongoose.Schema({
    productId: String,
    quantity: Number,
    name: String
});

module.exports = new mongoose.model('Products', medicineSchema);