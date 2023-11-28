var express = require('express');
var router = express.Router()
var UserCtrl = require('../controllers/UserCtrl') 

router.get('/:id', UserCtrl.PageIndex) 


module.exports = router;