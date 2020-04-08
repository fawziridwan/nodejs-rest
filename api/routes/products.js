const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFormat = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFormat: fileFormat
});

router.get('/', ProductsController.products_get_all);

router.post('/', upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch('/:productId', ProductsController.products_update_product);

router.delete('/:productId', ProductsController.products_delete);

module.exports = router; 