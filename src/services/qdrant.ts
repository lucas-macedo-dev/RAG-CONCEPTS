import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config.js";

export const qdrantClient = new QdrantClient({
    url: config.qdrant.url,
});

// criar uma coleção no Qdrant sempre que iniciar o servidor, caso ela não exista
export async function initQdrantCollection() {
    const collections = await qdrantClient.getCollections();

    // verificar se a coleção já existe
	const exists = collections.collections.some(
		(col) => col.name === config.qdrant.collectionName,
	);
    if (!exists) {
        await qdrantClient.createCollection(config.qdrant.collectionName, {
            vectors: {
                size: 1536,
                distance: "Cosine",
            },
        });
        console.log(`Collection ${config.qdrant.collectionName} created in Qdrant`);
    } else {
        console.log(`Collection ${config.qdrant.collectionName} already exists in Qdrant`);
    }
}
