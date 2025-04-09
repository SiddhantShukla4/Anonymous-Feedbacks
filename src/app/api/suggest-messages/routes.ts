import OpenAI from "openai";
import { streamText } from 'ai';
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

interface ChatMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json();

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages,
        });

        // Use streamText with the response (no additional arguments required)
        const stream = streamText(response as any );

        // Return the streaming response correctly
        return stream.toDataStreamResponse();
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json(
                { name, status, headers, message },
                { status: 500 }
            );
        } else {
            console.error("An unexpected error occurred with OpenAI:", error);
            return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
        }
    }
}
