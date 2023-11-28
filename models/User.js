const mongoose = require('mongoose') 
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema; 

const userSchema =  new Schema({
    
    isAdmin: {
        type: Boolean,
        default: false,
      },
    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    
    purchaseHistory: [
        {
            order_id: {
                type: Schema.Types.ObjectId,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
            },
            products: [
                {
                    product_id: {type: mongoose.Schema.ObjectId,ref: 'Product'} ,
                    name: {type: String, required: true}, 
                    quantity: {type: Number, required: true}
                }
            ]
        }
    ]
}); 

userSchema.pre('save', async function(next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  });
  
  userSchema.methods.validatePassword = async function(password) {
    try {
      const isMatch = await bcrypt.compare(password, this.password);
      return (isMatch)
    } catch (error) {
      throw new Error(error);
    }
  };

module.exports = mongoose.model('users', userSchema)


