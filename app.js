const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Pitch = require('./schema/pitch');
const Offer = require('./schema/offer');
const { pitchSchema } = require('./schema/valid/pitchschemas');
const { offerSchema } = require('./schema/valid/offerschema');
// const cors = require('cors');

const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ entended: false }));
app.use(bodyParser.json());

const validatePitch = (req, res, next) => {
    console.log(req.body)
    const { error } = pitchSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400);
        res.send('invalid request body');
    } else {
        next();
    }
}

const validateOffer = (req, res, next) => {
    const { error } = offerSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400);
        res.send('invalid request body');
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send('We are on home');
});

app.post('/pitches', validatePitch, catchAsync(async (req, res, next) => {
    const pitch = new Pitch({
        entrepreneur: req.body.entrepreneur,
        pitchTitle: req.body.pitchTitle,
        pitchIdea: req.body.pitchIdea,
        askAmount: req.body.askAmount,
        equity: req.body.equity,
    });
    try {
        const data = await pitch.save();
        console.log(data);
        res.status(201).json({
            id: pitch.id
        });
        res.send('pitch created successfully');
    } catch (error) {
        res.send(error)
    }

}));

app.post('/pitches/:id/makeOffer', validateOffer, catchAsync(async (req, res) => {
    const offer = new Offer({
        investor: req.body.investor,
        amount: req.body.amount,
        equity: req.body.equity,
        comment: req.body.comment,
    });
    await offer.save();
    const { id } = req.params;
    try {
        const pitch = await Pitch.findById(id);
        console.log(pitch);
        pitch.offers.push(offer);
        console.log(pitch);
        await pitch.save();
        res.status(201).json({
            id: offer.id
        });
    } catch (err) {
        res.status(404);
        res.send("Pitch not found");
    }

}));

app.get('/pitches', catchAsync(async (req, res) => {
    const pitch = await Pitch.find({});
    res.status(200);
    res.send(pitch);
}));

app.get('/pitches/:id', catchAsync(async (req, res) => {
    try {
        const pitch = await Pitch.findById(req.params.id);
        const offerId = pitch.offers;
        const response = [];
        for (let i = 0; i < offerId.length; i++) {
            response.push(await Offer.findById(offerId[i]));
        }
        console.log(pitch)
        const savedPitch = pitch.toObject();

        savedPitch.offers = response
        savedPitch.id = pitch._id
        delete savedPitch._id
        delete savedPitch.__v

        res.send(savedPitch);
        res.status(200);
    } catch (err) {
        res.status(404);
        res.send('pitch not found');
    }

}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).send('error');
})

mongoose.connect('mongodb://localhost:27017/xharktank', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.listen(8081, () => {
    console.log('on port 8081');
});

// (async function () {
//     await Offer.deleteMany();
//     await Pitch.deleteMany();
// })()
