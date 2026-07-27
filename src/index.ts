import fs from "node:fs"
import express from "express";
import { config } from "./config.js";
import { queryRouter } from "./routes/queryRouter.js";
import { documentRouter } from "./routes/documentRouter.js";
import { initQdrantCollection } from "./services/qdrant.js";

const app = express();
const port = config.server.port;

app.use(express.json());
app.get("/", (req, res) => res.json({ message: "RAG Node.js API is running!" }));
app.use("/query", queryRouter);
app.use("/document", documentRouter);

if (!fs.existsSync(config.upload.directory)){
    fs.mkdirSync(config.upload.directory);
    console.log(`Diretorio de uploads criado em: ${config.upload.directory}`)
}

async function start() {
    try {
        await initQdrantCollection();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });

    } catch (erro) {
        console.error("Erro ao iniciar o servidor")
        process.exit(1);
    }
}

start();