const users = require('../models/User') 
const Product = require('../models/Product')
const { ErrorCreate } = require('session/lib/session/storage/base')
const { response } = require('express')
const express = require('express')
const User = require('../models/User')
var app = express()

class HomeCtrl {
    
    async PageIndex(req, res) { 
       try {
        var productbyBrand = await Product.find({type: 'brand'}).lean().exec()
        var bestsellers = await Product.find({type: 'bestsellers'}).lean().exec()
        var prods = await Product.find().lean().exec()

        res.render('index', {
            layout: 'home-layout',
            prods: prods, 
            bestsellers: bestsellers,
            productbyBrand: productbyBrand
        })

        } catch {
        res.status(500).json({error: "Cannot display product"})
       }
       
    } 

    async Login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await users.findOne({username: username}).lean().exec()
        if (!user) {
            return res.send("Username invalid") ;
        }
        const validatePassword = user.password === password
        if (!validatePassword){
           return res.send("Password Invalid")
        }
        res.send("true")
    } catch (err) {
        console.error(err);
        return res.send("false");
    }
   }
    
  
    async GetRegister(req, res) {
        res.render('register')
    }
    async Register(req, res) { 
        const {name, email, password, confirmpassword} = req.body;
        if (password != confirmpassword) { 
        req.flash('error', 'Password does not match')
        res.redirect('/register')
        return }

        const user = new User({name, email, password})
        try {
            const data = await user.save()
            res.redirect('/login')
            
        } catch (err) {
            res.render('register', {error: err.message})
        }
    }      

    async GetUser(req, res) {
        try {
            const data = await User.findOne({username: req.body.username})
            if (!data) {
                return res.send('cannot get user')
            } 
            res.send(data)

        } catch(err) {
            console.log(err)
        }
        
    }
    async ProductList(req, res) {
        try {
           const prods = await Product.find().lean().exec()
           res.render('list-product', {
            prods: prods,
           })
        } catch(err) {
           console.log(err)
        }
    } 

    async Search(req, res) {
        const query = req.query.q

        try { 
            if (query === '') {
                res.send(false)
            }
            const data = await Product.find({'name': {$regex:query}}).lean().exec()

            //console.log("Data for "+query+": "+ JSON.stringify(data))

            if (data.length === 0 ) {
                res.render('search',{ 
                    layout: 'home-layout',
                    message: "No item found",
                    query: query
                })
            } else {
                res.render('search', {
                    layout: 'home-layout',
                    query: query,
                    data: data,
                })
            } 
        } catch (err) {
            console.log(err)
            res.status(500).json({error: "Can't show products"})
        } 
    }
   
} 

module.exports = new HomeCtrl;