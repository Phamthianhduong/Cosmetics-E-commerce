var Product = require('./routes/ProductRou')
var Home = require('./routes/HomeRou')
var User = require('./routes/UserRou')
var Cart = require('./routes/CartRou')


function route(app) {
    app.use('/', Home) 
    app.use('/product', Product)
    app.use('/user', User)
    app.use('/cart', Cart)
} 


module.exports = route;