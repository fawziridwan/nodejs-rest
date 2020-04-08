/** call mongoose library */
const mongoose = require('mongoose');

/* call a models */
const Order =  require('../models/order');
const Product =  require('../models/product');

/* get all order */
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product','name')
    .exec()
    .then(ords => {
        const response = {
            count: ords.length,
            orders: ords.map(ord => {
                return {
                    _id: ord.id,
                    product: ord.product,
                    quantity: ord.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + ord._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
};

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product Not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result =>{
            // console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders' + result._id
                }
            }); 
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });
};

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(ord => {
            if (!ord) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            console.log("This order : ", ord)
            if (ord) {
                res.status(200).json({
                    order: ord,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provide Order ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}

exports.orders_delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Delete',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}