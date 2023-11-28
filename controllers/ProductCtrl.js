const Product = require('../models/Product')
const cloudinary = require('cloudinary') 
const multer = require('../config/multer')

class ProductCtrl {
    async ProductIndex(req, res) {
        try {
           const prods = await Product.find().lean().exec()
           if (!prods) {return res.status(404).json({error: "Can't retrieve products"})}
           else {
            res.render('list-products', {
                prods: prods
            })
           }
        } catch (err) {
            console.log(err)
            res.status(404).json({error})
        }
    }
    async ProductDetail(req, res) {
        try { 
            const product = await Product.findById(req.params.id)
            
            if (!product) res.status(404).json({error: "Item not found"}) 
            else {
               
               res.render('product-details',{product: product.toObject()})
            } 
        } catch (error) {
            res.status(400).json({error})
        }

   } 

   
    async AddNewProduct(req, res) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path) 
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                brand: req.body.brand,
                price: req.body.price,
                imgURL: result.secure_url 
            })
            const data = await Product.findOne({name: req.body.name})
            if (!data) {
                newProduct.save()
                req.flash('success','New product added')
            } else {
                req.flash('error', 'Cannot add product')
            }
            

        } catch (error) { 
            console.log(error) 
            res.send(false)
        }
    }

    async GetProductToUpdate(req, res) {
        try {
            const product = await Product.findOne({name: req.body.name})
            if (!product) {
                res.status(404).json({error: "Product not found"})
            } else {
            
                res.render('product-edit', {
                    product: product,
                })
            }
        } catch(error) {
            res.send(false)
        }
    } 

    async UpdateProduct(req, res) {
        const result = await cloudinary.v2.uploader.upload(req.file.path) 
        const newProduct = new Product({
            product_id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            brand: req.body.brand,
            price: req.body.price,
            imgURL: result.secure_url 
        }) 

        try {
            const save = await Product.findByIdAndUpdate(req.params.id, newProduct) 
            req.flash("Product added successfully")
            req.redirect(`/product/${req.params.id}`)
        } catch(error) {
            res.status(400).json({error: "Cannot update product"})
        }

    } 

    /*async GetProductByCategory(req, res) {
        const makeup = 
    } */
    
    async SearchProduct(req, res) {
        const query = req.query.q;
        try {
            const regex = new RegExp(query, 'i');
            const product = await Product.find({
                name: regex
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
        
    }


} 



module.exports = new ProductCtrl;