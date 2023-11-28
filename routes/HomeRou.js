var express = require('express');
var router = express.Router();
var HomeCtrl = require('../controllers/HomeCtrl')

router.get('/', HomeCtrl.PageIndex)
router.get('/login', HomeCtrl.Login)
router.post('/login', HomeCtrl.Login)
router.get('/register', HomeCtrl.GetRegister)
router.post('register', HomeCtrl.Register) 
router.get('/search', HomeCtrl.Search)
router.post('/getuser', HomeCtrl.GetUser)



module.exports = router;
