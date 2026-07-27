import { Router } from "express"
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { processDocument } from "../services/document.js";
import fs from "node:fs/promises";

export const documentRouter = Router();

documentRouter.post("/upload", uploadMiddleware.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }
        const result = await processDocument(file.path, file.originalname);
        await fs.unlink(file.path); // Remove o arquivo temporário após o processamento

        res.status(200).json({ message: "Arquivo processado com sucesso!" });
    } catch (error) {
        console.error("Erro ao processar o documento:", error);
        res.status(500).json({ error: "Erro ao processar o documento" });
    }
});

