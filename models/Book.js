const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: { type: Number, unique: true },
    userId: { type: String, required: true },
    title: { type: String, require: true },
    author: { type: String, required: true },
    year: { type: String, required: true },
    imageUrl: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Array, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
