import multer from "multer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, "../uploads");
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDirectory);
    },
    filename: function (req, file, callback) {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, callback) {
        callback(null, file.mimetype.startsWith("image/"));
    }
});

export default upload;
