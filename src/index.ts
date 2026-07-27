import { processDocument } from "./services/document.js";
import { initQdrantCollection } from "./services/qdrant.js";
import path from "node:path";
import { searchDocuments } from "./services/query.js";
import { generateRAGResponse } from "./services/rag.js";

// Logica para gerar uma resposta baseada em RAG (Recuperação de Informação + Geração de Resposta)
async function main() {
    console.log("Iniciando geração de resposta...");
    console.log("Processando documento de exemplo");
    const result = await generateRAGResponse({
        question: "Quais os idiomas que o candidato fala?",
        topK: 3
    });

    console.log("Resultado da pesquisa:", result);
}


// Logica para buscar os chunks de um documento com base em uma pergunta 
// async function main() {
//     console.log("Iniciando geração de resposta...");
//     console.log("Processando documento de exemplo");
//     const result = await searchDocuments({
//         question: "Qual é o nome do candidato?",
//         topK: 3
//     });

//     console.log("Resultado da pesquisa:", result);
// }

// Logica para processar um documento PDF e armazenar os chunks no Qdrant
// async function main() {
//     console.log("Iniciando a aplicacao...");
//     try {
//         console.log("Processando documento de exemplo");
//         await initQdrantCollection();

//         const pdfPath = path.resolve("./uploads/CV_Lucas Macedo.pdf");
//         const fileName = "CV_Lucas Macedo.pdf";

//         console.log(`Processando documento:  ${fileName}`);

//         const startTime = Date.now();
//         const result = await processDocument(pdfPath, fileName);
//         const duration = (Date.now() - startTime);

//         console.log(`Documento processado com sucesso`);
//         console.log(`ID do documento: ${result.documentId}`);
//         console.log(`Numero de chunks: ${result.chunksCount}`);
//         console.log(`Duracao do processamento: ${duration}`);
//     } catch (error) {
//         console.error("Erro ao iniciar a aplicacao:", error);
//         process.exit(1);
//     }
// }

main();