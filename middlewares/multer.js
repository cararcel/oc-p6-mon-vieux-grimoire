const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

module.exports = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // If we have no file, we skip the upload.
        if (!req.file) {
            return next();
        }

        const { buffer, originalname } = req.file;
        /*
         * We add the timestamp to the filename to have different
         * name even if we already uploaded the same image.
         */
        const timestamp = new Date().getTime();

        const filename = `${
            originalname.replaceAll(' ', '_').split('.')[0]
        }_${timestamp}.webp`;
        const outputPath = path.resolve(__dirname, '..', 'images', filename);

        try {
            await sharp(buffer)
                .resize(404, 568) // Size taken from the front-end
                .webp({ quality: 80 })
                .toFile(outputPath);

            req.file.filename = filename;

            next();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });
};
