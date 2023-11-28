const Order = require('../models/Order')

class OrderCtrl {
    async GetAllOrder(res, req) {
        try {
            const orders = await Order.find()
            res.render('orders', {
            orders: orders
            })
        } catch (err) {
            console.error(err)
            res.status(500).send('Error getting orders')
        }
    }
    async GetUserOrder(req, res) {
        try {           
            const data = await Order.find({user_id:req.params.id}) 
            res.render('user-Order', {
                order: data,
            })   
        } catch {
       
        }
    } 

    async CreateOrder(req, res) {
        const newOrder = new Order(req.body)
    }
}



module.exports = new OrderCtrl;