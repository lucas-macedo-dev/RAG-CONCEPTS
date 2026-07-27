import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { randomUUID } from 'crypto';
import { embeddings } from "./openai.js";
import { qdrantClient } from "./qdrant.js";
import { config } from "../config.js";
import type { UploadResponse } from "../types.js";


const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

export async function processDocument(filePath: string, fileName: string): Promise<UploadResponse> {
    // 1. carregamento do arquivo PDF
    const loader = new PDFLoader(filePath);
    const documents = await loader.load();

    if (documents.length === 0) {
        throw new Error("Nenhum documento encontrado no arquivo PDF");
    }

    // 2. Divisao do  texto em chunks
    const chunks = await textSplitter.splitDocuments(documents);

    if (chunks.length === 0) {
        throw new Error("Nenhum chunk gerado a partir do documento");
    }

    // 3. adicionar metadados nos chunks
    const documentId = randomUUID();
    const documentsChunksWithMetadata = chunks.map((chunk, index) => ({
        id: randomUUID(),
        text: chunk.pageContent,
        metadata: {
            documentId: documentId,
            chunkIndex: index,
            fileName: fileName,
            uploadedAt: new Date().toISOString(),
            page: chunk.metadata.loc?.pageNumber || null,
        }
    }));

    // 4. Vetorizar dos chunks / geracao dos embeddings
    const texts = documentsChunksWithMetadata.map((doc) => doc.text);
    const vectors = await embeddings.embedDocuments(texts);

    // 5. Armazenar os embeddings vetorizados de busca no Qdrant
    const data = documentsChunksWithMetadata.map((chunk, index) => {
        const vector = vectors[index];

        if (!vector || !Array.isArray(vector)) {
            throw new Error(`Vetor invalido para o chunck de indicie ${index}`);
        }

        return {
            id: chunk.id,
            vector,
            payload: {
                text: chunk.text,
                ...chunk.metadata
            },
        };
    });

    await qdrantClient.upsert(config.qdrant.collectionName, {
        points: data,
        wait: true,
    });

    // 6. Retornar o resultado do processamento
    return {
        success: true,
        documentId,
        chunksCount: documentsChunksWithMetadata.length,
        message: "Documento processado e armazenado com sucesso no Qdrant",
    };
}