const db = require('../models');

exports.createMessage = async function (req,res,next){
    const { text } = req.body;
    const { id } = req.params;
    try{
        let message = await db.Message.create({
            text,
            user: id
        });
        const foundUser = await db.User.findById(id);
        foundUser.messages.push(message.id);
        await foundUser.save();
        let foundMessage = await db.Message.findById(message.id).populate('user', {
            username: true,
            profileImageurl: true
        });
        return res.status(200).json(foundMessage);
    } catch(err){
        return next(err);
    }
}


// prefix api/users/:id/messages/:message_id
exports.getMessage = async function (req,res,next){
    try{
        const message = await db.Message.findById(req.parmas.message_id)
        res.status(200).json(message);
    } catch (err){
        return next(err);
    }
}
// prefix api/users/:id/messages/:message_id

exports.deleteMessage = async function (req,res,next){
    try{
        const message = await db.Message.findById(req.params.message_id);
        await message.remove();
        return res.status(200).json(message);
    } catch(err){
        return next(err);
    }
}