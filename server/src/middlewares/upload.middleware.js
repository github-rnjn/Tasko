const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "taskem/avatars",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
        ],

        transformation: [
            {
                width: 300,
                height: 300,
                crop: "fill",
            },
        ],

    },

});

const upload = multer({

    storage,

    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {

        if (
            file.mimetype.startsWith("image/")
        ) {

            return cb(null, true);

        }

        cb(
            new Error(
                "Only image files are allowed."
            )
        );

    },

});

module.exports = upload;