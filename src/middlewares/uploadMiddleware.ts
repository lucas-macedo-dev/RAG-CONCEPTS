import multer from "multer";
import path from "node:path";
import { randomUUID } from 'crypto';
import { config } from "../config.js";

const storage = multer.diskStorage({
    destination: config.upload.directory,
    filename: (_, file, cb) => {
        const uniqueName = randomUUID() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

export const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: (_, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos PDF são permitidos!"));
        }
    }
});