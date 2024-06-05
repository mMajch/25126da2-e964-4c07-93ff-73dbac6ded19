"use client";

import {useEffect, useState} from "react";
import {ChatMessage, Chat, ChatDetails} from "./models";
import { createChat, updateChat, getChats, getChat } from "./actions";

export default function Home() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<ChatDetails>();
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            const fetchedChats = await getChats();
            setChats(fetchedChats);
        };

        fetchChats();
    }, []);


    const handleMessage = async () => {
        if (currentChat){
            const newChatDetails = await updateChat(currentChat?.id, message)
            console.log(newChatDetails)
            setCurrentChat(newChatDetails)
            setMessage("")
        }
        else{
            //create new chat
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
            <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Chats</h2>
                    <ul>
                        {chats.map(chat => (
                            <li key={chat.id} className="mb-2">
                                <a href="#" className="block p-2 rounded hover:bg-gray-700" onClick={() => fetchChatMessages(chat.id)}>
                                    Chat {chat.id} - {chat.startDate.toString()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
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
