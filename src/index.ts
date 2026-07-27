import express from "express";
import { config } from "./config.js";
import { queryRouter } from "./routes/queryRouter.js";
import { documentRouter } from "./routes/documentRouter.js";

const app = express();
const port = config.server.port;

app.use(express.json());
app.get("/", (req, res) => res.json({ message: "RAG Node.js API is running!" }));
app.use("/query", queryRouter);
app.use("/document", documentRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});