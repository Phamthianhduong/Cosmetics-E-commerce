const mongoose = require('mongoose')
const Schema = mongoose.Schema


const cartSchema = new Schema({
      
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,

        },
        
        list_of_products: [{

            product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
            },
            quantity: {
                type: Number,
            
            }

        }]
    }) 

module.exports = mongoose.model('Cart', cartSchema)
