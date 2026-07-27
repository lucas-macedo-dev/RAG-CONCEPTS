export interface SearchResult {
    id: string;
    text: string;
    score: number;
    metadata: {
        documentId: string;
        fileName: string;
        page?: number;
        chunkIndex: number;
    };
}

export interface QueryRequest {
    question: string;
    topK?: number;
}

export interface QueryResponse {
    question: string;
    answers: SearchResult[];
    countChunks: number;
}

export interface UploadResponse {
    success: boolean;
    documentId: string;
    chunksCount: number;
    message?: string;
}

interface Source {
    fileName: string;
    page?: number;
    score?: number;
}

export interface RAGResponse {
    question: string;
    answer: string;
    sources?: Source[];
    tokensUsed?: number; 
}