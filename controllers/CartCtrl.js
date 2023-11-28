const Product = require('../models/Product')
const Cart = require('../models/Cart')

class CartCtrl {

    async GetCart (req, res) {
        try {
            const userId = req.params.userId
            const cart = await Cart.findOne({user: userId})
            if (!cart) {
                console.log(userId)
                res.json({error: 'An error happened'})
            } else {
                const items = await Cart.findOne({user: userId}).populate('list_of_products.product').lean()
                const product = items.list_of_products
                let totalPrice = 0
                let totalQuantity = 0
                let productIds = []
                product.forEach((item) => {
                    const productPrice = item.product.price 
                    const quantity = item.quantity
                    const itemPrice = productPrice * quantity
                    totalPrice += itemPrice 
                    totalQuantity+=quantity
                    productIds.push(item.product._id)
                })
                console.log('this is a list of product',userId, product, productIds, totalQuantity)
                
                
                res.render('shopping-cart', {
                    product: product,
                    userId: userId,
                    totalPrice: totalPrice.toFixed(2),
                    productIds: productIds,
                    totalQuantity: totalQuantity,
                    name: "My Shopping Cart"
                    
                })
             }
        } catch(err) {
            console.log(err)
            res.json({error: "Cannot display product"})
        }
    }

    async AddToCart(req, res) {
        const productId = req.body.productId 
        const userId = req.body.userId
        //const userId = localStorage.getItem("userId")
        try {
            
            const data = await Product.findById(productId)
            if(!data) {
                return res.send("false")
            } 

            const cart = await Cart.findOne({user: userId}) 
            //if cart doesn't exist, create a new one
            if (!cart) {
                const newCart = new Cart({
                    user: userId,
                    list_of_products: [{product: productId, quantity: 1 }] })//end of new cart object

                const save = await newCart.save();
                if (!save) {
                    console.log("Problem in creating a cart")
                    return res.send("false")
                } return res.send("true")
               } 
            //if cart exist
            if (cart) {
            //check if product exists in cart
            const cartProduct = cart.list_of_products.findIndex(p => p.product.toString() === productId)
              if (cartProduct === -1) {
                cart.list_of_products.push({product: productId, quantity: 1})
                
              } else {
                cart.list_of_products[cartProduct].quantity++;
              } 
            }
            console.log(productId, userId)
            console.log(cart)
            await cart.save()
            res.send('true')
             

        } catch (err) {
            console.log(err)
            res.send()
        }
    } 

    async DeleteItem(req, res) {
        const userId = req.body.userId
        const productId = req.body.productId
        try {
            const cart = await Cart.findOne({user: userId})
            if (!cart) {
                res.send(false)
                return console.log("Something happened. Can't fetch your cat")
            }
            const productIndex = cart.list_of_products.findIndex(p => p.product.toString() === productId)
            if (productIndex === -1) {
               res.send(false)
               return console.log("There is an error when deleting the item. Item not found in cart")
            }
            cart.list_of_products.splice(productIndex, 1)
            await cart.save()
            console.log("successful")
            return res.send(true)

        } catch (err){
            console.log(err)

        }
        
    }

} 

module.exports = new CartCtrl; 
