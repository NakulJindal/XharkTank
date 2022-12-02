const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Offer = require("./offer");

const PitchSchema = new Schema({
    entrepreneur: {
        type: String,
        required: [true, "Entrepreneur is required"]
    },
    pitchTitle: {
        type: String,
        required: [true, "PitchTitle is required"]
    },
    pitchIdea: {
        type: String,
        required: [true, "pitchIdea is required"]
    },

    askAmount: {
        type: Number,
        required: [true, "askAmount is required"]
    },

    equity: {
        type: Number,
        required: [true, "Equity is required"]
    },

    offers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Offer'
    }]
});

module.exports = mongoose.model("Pitch", PitchSchema);

