const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async (req,res,next) => {
        // find the user
    try{
        const { email, password } = req.body;
        const user = await db.User.findOne({ email });
        const { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(password, next);
        if(isMatch){
            const token = jwt.sign({
                id,
                username,
                profileImageUrl
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } else {
			return next({
				status: 404,
				message: 'Invalid Email/Password'
			});
		};
    } catch(err){
        return next({
            status: 400,
            message: 'Invalid Email/Password'
        })
    };
}

exports.signup = async (req,res,next) => {
    try{
		let user = await db.User.create(req.body);
		let { id, username, profileImageUrl } = user;
		let token = jwt.sign({
			id,
			username,
			profileImageUrl
		}, process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token    
        });
		
    } catch(err){
        if(err.code === 11000){
            err.message = 'Sorry, that username and/or email is taken'
        };
        return next({ status: 400, message: err.message})
    }
}