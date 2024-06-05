"use server";

import {ChatMessage} from "./models";

export async function getChats(
) {
    const response = await fetch(`${process.env.API_URL}/chats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json();
}

export async function getChat(id: number
) {
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
) {
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
) {
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