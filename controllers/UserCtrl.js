var User = require('../models/User')

class UserCtrl {
    async PageIndex(req, res) {
        try {
            const data = await User.findOne({_id: req.params.id})
            if (!data) {
                res.json({error: "Cannot get user info"})
            } 
            res.render('user-profile', {
                data: data
            })
        } catch (err) {
            console.log(err)
        }
        
    } 

    
        

}

module.exports = new UserCtrl;