"use client";
import { AssemblyAI } from 'assemblyai'

import {useEffect, useRef, useState} from "react";
import {ChatMessage, Chat, ChatDetails} from "./models";
import { createChat, updateChat, getChats, getChat } from "./actions";
import {
    FaMicrophone,
    FaPaperPlane,
    FaTrash,
    FaStop,
    FaWaveSquare,
    FaXingSquare,
    FaXing,
    FaWindowClose
} from 'react-icons/fa';
import {FaX} from "react-icons/fa6";


const client = new AssemblyAI({
    apiKey: "df0ffa09c65147adb784ba334d2b34f0"
})

export default function Home() {

    const inputRef = useRef<HTMLInputElement>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat>();
    const [messages, setMessages] = useState<ChatMessage[]>();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcription, setTranscription] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: 'audio/wav' });
            setAudioBlob(blob);
            transcribeAudio(blob)
            chunks.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    };

    const transcribeAudio = async (blob) => {

        if (!blob) return;

        // const formData = new FormData();
        // formData.append('file', audioBlob, 'recording.mp4');
        const base = await blobToBase64(blob)
        const full = base
        console.log(full)
        const config = {
            audio: full
        }

       try {
           const transcript = await client.transcripts.transcribe(config)
           const text = transcript.words?.map((word) => word.text).join(' ')
           await handleMessage(text)

        } catch (error) {
            console.error('Error transcribing audio:', error);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        setMessages(undefined)
        setSidebarOpen(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleMessage = async (message: string) => {
        setLoading(true)
        setMessages((messages) => {
            if (messages) {
                return ( [...messages, { role: "user", content: message}, {role: "assistant", content: "..."}])
            }
            return ( [{ role: "user", content: message}, {role: "assistant", content: "..."}])
        })

        setMessage("")
        if (currentChat){
            const newChatDetails = await updateChat(currentChat?.id, message)
            setCurrentChat(newChatDetails)
            setMessages(newChatDetails.messages)

        }
        else {
            const newChatDetails = await createChat(message)
            setCurrentChat(newChatDetails)
            setMessages(newChatDetails.messages)
            await fetchChats()
        }
        setLoading(false)
    };

    const fetchChatMessages = async (chatId: number) => {
        setSidebarOpen(false);
        const chatDetails: ChatDetails = await getChat(chatId)
        setCurrentChat(chatDetails);
        setMessages(chatDetails.messages);
    };

    const  handleEnter = async () => {
        await handleMessage()
    }

    return (
        <div className="h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <div
                className={`overflow-y-auto fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-200 text-gray-800 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-4">
                    <button
                        className="w-full flex items-center mb-4 p-2 rounded hover:bg-gray-300"
                        onClick={handleNewChat}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Ask new question
                    </button>
                    {!!chats.length && (<h2 className="text-xl font-bold mb-4">Your chats</h2>)}
                    <ul>
                    {chats.map(chat => (
                            <li key={chat.id}
                                className={`mb-2 ${currentChat?.id === chat.id ? 'bg-blue-300 rounded' : ''}`}
                            >
                                <a href="#" className="block p-2 rounded hover:bg-gray-300"
                                   onClick={() => fetchChatMessages(chat.id)}>
                                    Chat id: {chat.id} <br /> {new Date(chat.startDate).toLocaleString()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Hamburger Menu */}
                <div className="md:hidden p-4 bg-gray-200 text-gray-800">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl">
                        &#9776;
                    </button>
                </div>

                <div className="overflow-y-auto justify-end flex flex-col flex-1 gap-10 container mx-auto p-4">

                    <div className="flex flex-col gap-3 overflow-y-auto ">
                        {messages?.map((message, index) => (
                            <div
                                key={index}
                                className={message.role === "assistant" ? "chat chat-start" : "chat chat-end"}
                            >
                                <div className="chat-bubble bg-gray-200 text-gray-800">
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>

                    </div>
                    <div>
                    <div className={`row flex p-2 ${isRecording ? 'bg-red-100' : ''} rounded-full`}>
                        {!!isRecording ? (
                            <div className="row flex w-full">
                                <button
                                    onClick={() => null}
                                    className=" mr-auto bg-red-500 text-white rounded-full p-4 flex items-center justify-center"
                                >
                                    <FaX size={16}/>
                                </button>
                                <div className="flex-col content-center  mr-auto align-items">
                                    <p className="text-red-500">Jezt sprechen, Lotti hor zu</p>
                                </div>
                            </div>

                        ): (

                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="What is your question?"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                onKeyDown={async (event) => {
                                    if (event.key === "Enter" && !loading) {
                                        await handleMessage(message);
                                    }
                                }}
                                className="w-full mr-5 input rounded-full input-bordered p-3 text-gray-800 bg-white"
                            />


                        )}

                        <button
                            onClick={message ? handleEnter : isRecording ?  stopRecording : startRecording}
                            className="ml-auto bg-blue-500 text-white rounded-full p-4 flex items-center justify-center"
                        >
                            {message ? <FaPaperPlane size={16}/> : isRecording ? <FaPaperPlane size={16}/> : <FaMicrophone size={16}/>}
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
