import { llm } from "./openai.js"
import { searchDocuments } from "./query.js"
import type { QueryRequest, RAGResponse } from "../types.js"
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import type { Source } from "stream/iter"

const PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
    [
        "system", 
        `
        Você é um assistente de IA que responde perguntas com base em documentos fornecidos.

        Regras:
        - Use apenas as informações contidas nos documentos para responder às perguntas.
        - Se a resposta não estiver nos documentos, responda: "Desculpe, não encontrei informações relevantes para a sua pergunta."
        - Forneça respostas concisas e diretas.
        - Cite as fontes usadas na resposta no formato [1], [2], etc.
        - Responda em português brasileiro.
        `
    ], // instrucoes do sistema
    [
        "user",
        `
            CONTEXT:
            {context}
            QUESTION:
            {question}
            ANSWER:
        `
    ] // contexto/mensagem do usuário
]);

export async function generateRAGResponse({ question, topK = 3 }: QueryRequest): Promise<RAGResponse> {
    const searchResults = await searchDocuments({ question, topK })

    if (searchResults.answers.length === 0) {
        return {
            question,
            answer: "Desculpe, não encontrei informações relevantes para a sua pergunta.",
        }
    }

    // construir o contexto a partir dos resultados da pesquisa
    const context = searchResults.answers.map((item, index) => `[${index + 1}] ${item.text}`).join("\n\n");


    // Chain  de prompts para gerar a resposta
    const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser())

    const answer = await chains.invoke({
        context,
        question
    })

    // Extrair as respostas e formatar
    const sources = searchResults.answers.map((item, index) => ({ 
        fileName: item.metadata.fileName,
        page: item.metadata.page ?? 0,
        score: item.score
    }))

    return {
        question,
        answer,
        sources,
    }
}

