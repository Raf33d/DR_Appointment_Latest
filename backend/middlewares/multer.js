import multer from "multer";

// Uploads stay in memory and are then saved into the database (see models/fileStore.js),
// because free hosts such as Render wipe the local disk on every restart.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, callback) {
        callback(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype));
    }
});

export default upload;
