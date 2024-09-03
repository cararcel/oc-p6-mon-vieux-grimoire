const Book = require('../models/Book');
const fs = require('fs/promises');
const path = require('path');

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

exports.getBestRated = async function (req, res) {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);

    return res.status(200).json(books);
};

exports.delete = async function (req, res) {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
        return res.status(404).json({ message: 'Livre non existant' });
    }

    if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Non autorisé' });
    }

    try {
        await Book.deleteOne({ _id: req.params.id });
        await fs.rm(
            path.resolve(
                __dirname,
                '..',
                'images',
                book.imageUrl.split('/').pop()
            )
        );
    } catch (error) {
        return res.status(400).json({ error });
    }

    return res.status(200).json({ message: 'Livre supprimé' });
};

exports.update = async function (req, res) {
    const body = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : req.body;

    delete body._userId;

    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId !== req.auth.userId) {
        if (req.file) {
            // delete image in case of error
            await fs.rm(
                path.resolve(__dirname, '..', 'images', req.file.filename)
            );
        }

        return res.status(403).json({ message: 'Non autorisé' });
    }

    if (!Number.isInteger(Number.parseInt(body.year, 10))) {
        if (req.file) {
            // delete image in case of error
            await fs.rm(
                path.resolve(__dirname, '..', 'images', req.file.filename)
            );
        }

        return res.status(400).json({ message: 'Année non valide' });
    }

    try {
        await Book.updateOne(
            { _id: req.params.id },
            { ...body, _id: req.params.id }
        );

        // Remove old image if we uploaded a new one.
        if (req.file) {
            await fs.rm(
                path.resolve(
                    __dirname,
                    '..',
                    'images',
                    book.imageUrl.split('/').pop()
                )
            );
        }

        return res.status(200).json({ message: 'Livre mis à jour' });
    } catch (error) {
        return res.status(400).json({ error });
    }
};
