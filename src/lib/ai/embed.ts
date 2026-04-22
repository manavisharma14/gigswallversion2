import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text: string) : Promise<number[]>{
    const cleaned = text.replace(/\s+/g, " ").trim();

    if(!cleaned) return [];

    const respone = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: cleaned
    })

    return respone.data[0].embedding;

} 