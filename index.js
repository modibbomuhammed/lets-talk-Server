        require('dotenv').config();
const   express = require('express'),
        app     = express(),
        cors    = require('cors'),
	  	db 		= require('./models'),
        morgan  = require('morgan'),
        errorHandler = require('./handlers/errors'),
        authRoutes  = require('./routes/auth'),
        messagesRoutes  = require('./routes/messages'),
	  	{ loginRequired, ensureCorrectUser } = require('./middleware/auth'),
	  	PORT    = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use('/api/auth', authRoutes);
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messagesRoutes);


app.get('/api/messages', loginRequired, async (req,res,next) => {
    try{
        const messages = await db.Message.find().sort({ createdAt: 'desc' }).populate('user', {
            username: true,
            profileImageUrl: true
        });
		return res.status(200).json(messages)
    } catch(err){
        return next(err);
    }
});

app.use((req,res,next) => {
    let err = new Error('Not Fount');
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {console.log(`Server is starting on port ${PORT}`)});