const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Book = require('./models/Book');
const userRoutes = require('./routes/user');

mongoose
    .connect(
        'mongodb+srv://mongodb9dtk6:W9EOriUG0CyaRB70@cluster0.foyrrca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.post('api/books', async (req, res, next) => {
    const book = new Book(req.body);
    await book.save();
    return res.status(201).json({ book });
});

app.get('/api/books', (req, res, next) => {
    const books = [
        {
            _id: 1,
            userId: 'user',
            title: 'Genesis',
            author: 'Alabaster',
            year: 2022,
            imageUrl:
                'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71JExU3A7LL._SL1500_.jpg&f=1&nofb=1&ipt=decb8c5c6631425dabb755d601ef9150e98cdb50b73ac81c62c9c8a80e58359f&ipo=images',
            genre: 'Jardinage',
            rating: 5,
        },
        {
            _id: 1,
            userId: 'user',
            title: 'Psalm',
            author: 'Alabaster',
            year: 2022,
            imageUrl:
                'https://cdn10.bigcommerce.com/s-g9n04qy/products/609550/images/624066/41GUUD_q1xL._SL1300___66097.1658860266.500.500.jpg?c=2',
            genre: 'Poésie',
            rating: 5,
        },
    ];
    res.status(200).json(books);
});

app.use('/api/auth', userRoutes);

module.exports = app;
