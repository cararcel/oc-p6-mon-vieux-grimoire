const Book = require('../models/Book');
const fs = require('fs/promises');

exports.create = async function (req, res) {
    const body = JSON.parse(req.body.book);
    delete body._id;
    delete body._userId;

    if (body.ratings[0].grade > 5 || body.ratings[0].grade < 0) {
        // delete image in case of error
        await fs.rm(path.resolve(__dirname, '..', 'images', req.file.filename));

        return res.status(400).json({ message: 'Note non valide' });
    }

    if (!Number.isInteger(Number.parseInt(body.year, 10))) {
        // delete image in case of error
        await fs.rm(path.resolve(__dirname, '..', 'images', req.file.filename));

        return res.status(400).json({ message: 'Année non valide' });
    }

    const book = new Book({
        ...body,
        // Recreate the rating array to ensure we have the correct userId
        ratings: [{ userId: req.auth.userId, grade: body.ratings[0].grade }],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
        averageRating: body.ratings[0].grade,
    });

    await book.save();

    res.status(201).json({ message: 'livre crée' });
};

exports.getAll = async function (req, res) {
    const books = await Book.find();

    return res.status(200).json(books);
};

exports.getOne = async function (req, res) {
    const book = await Book.findOne({ _id: req.params.id });

    return res.status(200).json(book);
};
