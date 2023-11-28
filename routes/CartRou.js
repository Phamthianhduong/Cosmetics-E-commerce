const express = require('express');
const router = express.Router();
const CartCtrl = require('../controllers/CartCtrl');

router.get('/:userId', CartCtrl.GetCart)
router.post('/add', CartCtrl.AddToCart)
router.post('/delete', CartCtrl.DeleteItem)


module.exports = router;