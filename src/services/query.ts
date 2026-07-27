import { config } from '../config.js';
import { qdrantClient } from './qdrant.js';
import { embeddings } from './openai.js';
import type { QueryRequest, QueryResponse, SearchResult } from '../types.js';

export async function searchDocuments({
    question,
    topK = 3
}: QueryRequest): Promise<QueryResponse> {
    const queryVector = await embeddings.embedQuery(question);

    const searchResults = await qdrantClient.search(config.qdrant.collectionName, {
        vector: queryVector,
        limit: topK,
        with_payload: true
    });

    const answers: SearchResult[] = searchResults.map((result) => ({
        id: String(result.id),
        text: (result.payload?.text as string) ?? "",
        score: result.score,
        metadata: {
            documentId: (result.payload?.documentId as string) ?? "",
            fileName: (result.payload?.fileName as string) ?? "",
            page: (result.payload?.page as number) ?? 0,
            chunkIndex: (result.payload?.chunkIndex as number) ?? 0,
        }
    }));

    return {
        answers,
        question,
        countChunks: answers.length,
    };
}
