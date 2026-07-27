import { Router } from "express"
import { generateRAGResponse } from "../services/rag.js"

export const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
    try {
        const { question, topK } = req.body;
        const result = await generateRAGResponse({ question, topK });
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao processar a consulta:", error)
        res.status(500).json({ error: "Erro ao processar a consulta" })
    }
})