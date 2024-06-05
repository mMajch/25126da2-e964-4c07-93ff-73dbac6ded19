"use server";

import { ChatCompletionMessage } from "./chat-completion-message.interface";

export default async function createChatCompletion(
    messages: ChatCompletionMessage[]
) {
    const response = await fetch(`${process.env.API_URL}/openai/chatCompletion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages,
        }),
    });
    return response.json();
}

export async function createChat(
    id: string,
    messages: ChatCompletionMessage[]
) {
    const response = await fetch(`${process.env.API_URL}/chats/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages,
        }),
    });
    return response.json();
}