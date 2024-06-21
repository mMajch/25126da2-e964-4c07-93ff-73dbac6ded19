"use server";

import {Chat, ChatDetails, ChatMessage} from "./models";
import {AssemblyAI} from "assemblyai";


const client = new AssemblyAI({
    apiKey: "df0ffa09c65147adb784ba334d2b34f0"
})


export async function getChats(
) : Promise<Chat[]> {
    const response = await fetch(`${process.env.API_URL}/chats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json();
}

export async function getChat(id: number
) : Promise<ChatDetails> {
    const response = await fetch(`${process.env.API_URL}/chats/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json();
}

export async function createChat(
    message: string
) : Promise<ChatDetails> {
    const response = await fetch(`${process.env.API_URL}/chats`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });
    return response.json();
}

export async function updateChat(
    id: number,
    message: string
): Promise<ChatDetails> {
    const response = await fetch(`${process.env.API_URL}/chats/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });
    return response.json();
}