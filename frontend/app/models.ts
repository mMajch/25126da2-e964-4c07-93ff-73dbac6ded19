export interface ChatMessage {
    role: string;
    content: string;
}

export interface Chat {
    startDate: string,
    id: number
}

export interface ChatDetails extends Chat {
    messages: ChatMessage[]
}