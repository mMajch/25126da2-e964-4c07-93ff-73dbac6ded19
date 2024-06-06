"use client";

import {useEffect, useRef, useState} from "react";
import {ChatMessage, Chat, ChatDetails} from "./models";
import { createChat, updateChat, getChats, getChat } from "./actions";

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<ChatDetails>();
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchChats = () => getChats().then(data => {
        const orderedChats = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        setChats(orderedChats)
    }).catch(() => {
        // TODO error handling
    });

    useEffect(() => {
        fetchChats()
    }, []);

    const handleNewChat = () => {
        setCurrentChat(undefined)
        setSidebarOpen(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleMessage = async () => {
        setCurrentChat((current) => {
            if (current) {
                return ({ ...current, messages: [...current?.messages, { role: "user", content: message}]})
            }
            return ({
             messages: [{ role: "user", content: message}]
            })

        })

        setMessage("")
        if (currentChat){
            const newChatDetails = await updateChat(currentChat?.id, message)
            setCurrentChat(newChatDetails)
        }
        else {
            const newChatDetails = await createChat(message)
            setCurrentChat(newChatDetails)
            fetchChats()
        }
    };

    const fetchChatMessages = async (chatId: number) => {
        setSidebarOpen(false);
        const chatDetails: ChatDetails = await getChat(chatId)
        setCurrentChat(chatDetails);
    };

    return (
        <div className="h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className={`overflow-y-auto fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-4">
                    <button
                        className="w-full flex items-center mb-4 p-2 rounded hover:bg-gray-700"
                        onClick={handleNewChat}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Ask new question
                    </button>
                    <h2 className="text-xl font-bold mb-4">Chats</h2>
                    <ul>
                        {chats.map(chat => (
                            <li key={chat.id}
                                className={`mb-2 ${currentChat?.id === chat.id ? 'border border-blue-500' : ''}`}
                            >
                                <a href="#" className="block p-2 rounded hover:bg-gray-700"
                                   onClick={() => fetchChatMessages(chat.id)}>
                                    Chat {chat.id} - {chat.startDate.toString()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="overflow-y-auto flex-1 flex flex-col">
                {/* Hamburger Menu */}
                <div className="md:hidden p-4 bg-gray-800 text-white">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl">
                        &#9776;
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 gap-10 container mx-auto p-4">

                    <>
                        <div className="flex flex-col gap-3 h-[75%] overflow-scroll w-full">
                                {currentChat?.messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={message.role === "user" ? "chat chat-start" : "chat chat-end"}
                                    >
                                        <div className="chat-bubble">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                onKeyDown={async (event) => {
                                    if (event.key === "Enter") {
                                        await handleMessage();
                                    }
                                }}
                                className="input input-bordered w-full m-10"
                            />
                        </>

                </div>
            </div>
        </div>
    );
}
