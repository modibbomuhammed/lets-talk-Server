const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 160
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

messageSchema.pre('remove', async function(next) {
    try{
        // find the user
        const user = await User.findById(this.user);
        // remove the id of the message from the messages list
        user.messages.remove(this.id);
        // save the user
        await user.save();
        // return next
        return next();

    } catch(err){
        return next(err);
    }
});

module.exports = mongoose.model('Message', messageSchema);