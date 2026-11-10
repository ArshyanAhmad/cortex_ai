import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";
dotenv.config();

function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom ? dot / denom : 0;
}

class InMemoryVectorStore {
    constructor(docs, docVectors) {
        this.docs = docs;
        this.docVectors = docVectors;
    }

    async similaritySearch(query, k = 5) {
        if (!this.docs || this.docs.length === 0) return [];
        const queryVector = await embeddings.embedQuery(query);
        const scored = this.docs.map((doc, idx) => ({
            doc,
            score: cosineSimilarity(queryVector, this.docVectors[idx])
        }));
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, k).map(item => item.doc);
    }
}

export const vectorStore = async (docs, collectionName) => {
    try {
        if (process.env.QDRANT_URL) {
            return await QdrantVectorStore.fromDocuments(docs, embeddings, {
                url: process.env.QDRANT_URL,
                apiKey: process.env.QDRANT_API_KEY,
                collectionName
            });
        }
    } catch (qdrantErr) {
        console.warn("Qdrant connection failed, falling back to in-memory vector store:", qdrantErr?.message || qdrantErr);
    }

    const texts = docs.map(d => d.pageContent);
    const docVectors = await embeddings.embedDocuments(texts);
    return new InMemoryVectorStore(docs, docVectors);
};