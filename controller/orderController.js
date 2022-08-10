var orderModel = require("../models/orderModel");
var productModel = require("../models/productModel");
module.exports.addOrder = async (req, res) => {
    // res.status(200).send("Add order");
    try {
        const body = req.body;
        let { productId, quantity, userId } = body;
        let ordersList = [];
        let products = await productModel.findOne({ productId: productId });
        if (products && products.quantity >= quantity) {
            ordersList.push({ productId: productId, quantity: quantity, userId: userId, updatedAt: Date.now() });
            let orders = await orderModel.insertMany(ordersList);
            let query = { productId: productId };
            let updatedQuantity = products.quantity - quantity;
            let toUpdate = { quantity: updatedQuantity };
            // await productModel.updateOne(query, toUpdate);
            res.status(200).send({
                orderId: orders[0]._id
            });
        }
        else {
            res.status(401).send("Product not found or quantity unfulfilled");
        }
    } catch (e) {
        res.status(500).send(e);
    }
};

module.exports.updateOrder = async (req, res) => {
    let orderId = req.params.id;
    let quantity = req.body.quantity;
    try {
        let orders = await orderModel.findOne({ _id: orderId });
        if (orders) {
            await orderModel.updateOne({ _id: orderId }, { quantity: quantity, updatedAt: Date.now() });
            res.status(200).send("success");
        }
        else {
            res.status(401).send("cant find the ordered id");
        }
    } catch (e) {
        res.status(500).send(e);
    }
};

module.exports.updateStatus = async (req, res) => {
    let orderId = req.params.id;
    let status = req.body.status;
    try {
        let orders = await orderModel.findOne({ _id: orderId });
        if (orders) {
            await orderModel.updateOne({ _id: orderId }, { status: status });
            res.status(200).send("success");
        } else {
            res.status(401).send("cant find the ordered id");
        }

    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports.deleteOrder = async (req, res) => {
    let orderId = req.params.id;
    try {
        let orders = await orderModel.findOne({ _id: orderId });
        if (orders) {
            await orderModel.updateOne({ _id: orderId }, { isDeleted: true });
            res.status(200).send("success");
        } else {
            res.status(401).send("cant find the ordered id");
        }

    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports.checkCapacity = async (req, res) => {
    let date = req.params.date;
    let productId = req.body.productId;
    try {
        let product = await productModel.findOne({ _id: productId });
        if (product) {
            let date1 = new Date(parseInt(date));
            var ordersTillNow = await orderModel.find(
                {
                    productId: product.productId,
                    updatedAt: { $lt: date1 },
                    isDeleted: false
                }
            );
            console.log(ordersTillNow);
            var orderedQuantity = 0;
            ordersTillNow.map(order => {
                orderedQuantity = parseInt(order.quantity) + orderedQuantity
            });
            let currentQuantity = product.quantity - orderedQuantity;
            res.status(200).send({ quantity: currentQuantity });
        } else {
            res.status(401).send("cant find the product id");
        }

    } catch (e) {
        res.status(500).send(e);
    }
}