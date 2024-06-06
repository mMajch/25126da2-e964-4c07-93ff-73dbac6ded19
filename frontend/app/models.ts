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

// TODO:
// - auth
// - error handling
// - share dtos between backend and frontend in npm package/monorepo
// - loading states
// - streaming