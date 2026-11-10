import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
   model: "openai/gpt-oss-120b",
   temperature: 0,
   apiKey: process.env.GROQ_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
   model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
   temperature: 0,
   apiKey: process.env.GOOGLE_API_KEY,
});

const openrouter = new ChatOpenRouter({
   model: "deepseek/deepseek-chat",
   temperature: 0,
   maxTokens: 2500,
   apiKey: process.env.OPENROUTER_API_KEY,
});

export const getModel = async (agent) => {
   switch (agent) {
      case "chat":
         return groq;

      case "search":
         return groq;

      case "coding":
         return openrouter;

      case "imageAnalyzer":
      case "pdf-rag":
      case "pdfRag":
         return gemini;

      default:
         return groq;
   }
};
