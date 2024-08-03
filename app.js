const express = require('express');
const app = express();

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

app.post('api/book', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé',
    });
});

app.get('/api/book', (req, res, next) => {
    const book = [
        {
            _id: 'oeihfzeoi',
            userId: 'user',
            title: 'title',
            author: 'author',
            year: '2002',
            imageUrl:
                'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            genre: 'genre',
            rating: '5',
        },
        {
            _id: 'oeihfzeoi',
            userId: 'user',
            title: 'title',
            author: 'author',
            year: '2002',
            imageUrl:
                'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            genre: 'genre',
            rating: '5',
        },
    ];
    res.status(200).json(book);
});

module.exports = app;
