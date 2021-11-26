module.exports = {
    loginCheckMiddleware: function(req, res, next){
        if(req.session.userId){
            next();
        } else {
            return res.send("loginerror");
        }
    }
}