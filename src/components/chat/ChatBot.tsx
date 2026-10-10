'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronLeft, Send, User, Bot, Phone, Mail, MapPin, RotateCcw } from 'lucide-react';
import Link from 'next/link';

type ChatOption = {
    label: string;
    response?: string;
    nextOptions?: ChatOption[];
};

const CHAT_DATA: Record<string, ChatOption[]> = {
    initial: [
        { label: 'Donor' },
        { label: 'General Info' },
    ],
    Patient: [
        {
            label: 'What services does DigiSwasthya offer?',
            response: 'DigiSwasthya provides teleconsultation, diagnostics, awareness camps, and financial support services to rural communities.'
        },
        {
            label: 'How do I book a consultation?',
            response: 'You can book a consultation by visiting our telemedicine centres or calling us at +91-83184-24800. Our team will guide you through the process.'
        },
        {
            label: 'Where are the telemedicine centres?',
            response: 'We have telemedicine centres across various rural districts including Sant Kabir Nagar. Please visit our Contact page for specific location details.'
        },
        {
            label: 'Contact phone/email for help',
            response: 'Call us at +91-83184-24800 or email info@digiswasthya.org for assistance.'
        },
    ],
    Donor: [
        {
            label: 'How are donations used?',
            response: 'Donations are used to provide free/subsidized healthcare, fund diagnostics, and maintain our telemedicine centres.'
        },
        {
            label: 'What does ₹1,000 support?',
            response: 'You can sponsor teleconsultations for four patients with a donation of ₹1,000.'
        },
        {
            label: 'Download annual report',
            response: 'Our annual reports detailing our financial transparency and impact can be found in the "About Us" section of our website.'
        },
        {
            label: 'Contact for donor partnership',
            response: 'For CSR collaborations or major donor partnerships, please reach out to us at partnerships@digiswasthya.org or call +91-83184-24800.'
        },
    ],
    'General Info': [
        {
            label: 'What is DigiSwasthya’s mission?',
            response: 'Our mission is making healthcare accessible to 1.4 billion people through technology by 2047. Our vision is a world where quality healthcare is accessible and affordable for all.'
        },
        {
            label: 'Impact numbers',
            response: 'We have served over 50,000+ patients and conducted thousands of successful teleconsultations, making a tangible difference in rural healthcare.'
        },
        {
            label: 'NGO registration and partner info',
            response: 'DigiSwasthya is a registered non-profit. We partner with esteemed medical institutions and local community leaders to deliver our services.'
        },
        {
            label: 'Website navigation help',
            response: 'Browse our "About Us" for our story, "Donate" to support the cause, and "Media" for our latest news and gallery.'
        },
    ],
};

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    isOption?: boolean;
    suggestedLink?: { title: string; url: string; };
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcome: Message = {
                id: '1',
                type: 'bot',
                text: 'Hello! How can we help you today? You can select a category below or type your question directly.',
            };
            setMessages([welcome]);
        }
    }, [isOpen, messages.length]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);



    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim()) return;

        const currentInput = userInput.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: currentInput,
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setUserInput('');
        setIsTyping(true);

        try {
            const apiMessages = newMessages.map(m => ({
                role: m.type === 'bot' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            
            const botMsg: Message = {
                id: Date.now().toString(),
                type: 'bot',
                text: data.content,
                suggestedLink: data.suggestedLink,
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                type: 'bot',
                text: "I'm having trouble connecting to my brain right now. Please try again later.",
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleOptionClick = (option: ChatOption) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: option.label,
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            if (option.response) {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: option.response,
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                setCurrentCategory(option.label);
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: `Great! Here's more information about ${option.label}. What specifically would you like to know?`,
                };
                setMessages(prev => [...prev, botMsg]);
            }
            setIsTyping(false);
        }, 600);
    };

    const resetChat = () => {
        setCurrentCategory(null);
        setUserInput('');
        setMessages([
            {
                id: Date.now().toString(),
                type: 'bot',
                text: 'Hello! How can we help you today? You can select a category below or type your question directly:',
            }
        ]);
    };

    const goBack = () => {
        setCurrentCategory(null);
        const botMsg: Message = {
            id: Date.now().toString(),
            type: 'bot',
            text: 'What else can I help you with? Select a category or type a question:',
        };
        setMessages(prev => [...prev, botMsg]);
    };

    const currentOptions = currentCategory ? CHAT_DATA[currentCategory] : CHAT_DATA.initial;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] h-[65vh] sm:h-[480px] max-h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-primary-100"
                    >
                        {/* Header */}
                        <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs text-white/80">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={resetChat}
                                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                                    aria-label="Reset conversation"
                                    title="Reset Conversation"
                                >
                                    <RotateCcw size={18} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                                    aria-label="Close chat"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] flex gap-2 ${msg.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === 'bot' ? 'bg-primary-100 text-primary-600' : 'bg-primary-600 text-white'
                                            }`}>
                                            {msg.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm ${msg.type === 'bot'
                                            ? 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                                            : 'bg-primary-600 text-white shadow-sm rounded-tr-none'
                                            }`}>
                                            {msg.text}
                                            {msg.suggestedLink && (
                                                <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
                                                    <p className="text-[13px] text-gray-500 font-medium">For more details on this, visit:</p>
                                                    <Link 
                                                        href={msg.suggestedLink.url}
                                                        onClick={() => setIsOpen(false)}
                                                        className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                    >
                                                        {msg.suggestedLink.title} <ChevronLeft className="w-3 h-3 rotate-180" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interaction Area */}
                        <div className="bg-white border-t border-gray-100 flex flex-col">
                            {/* Options */}
                            <div className="p-3 bg-white">
                                <div className="flex flex-col gap-2">
                                    {currentCategory && (
                                        <button
                                            onClick={goBack}
                                            className="flex items-center gap-1 text-xs text-primary-600 font-semibold mb-1 hover:underline w-fit"
                                        >
                                            <ChevronLeft size={14} /> Back to main menu
                                        </button>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {currentOptions.map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleOptionClick(option)}
                                                className="px-3 py-1.5 text-xs bg-primary-50 text-primary-700 rounded-full border border-primary-100 hover:bg-primary-100 hover:border-primary-200 transition-all text-left"
                                            >
                                                {option.label}
                                            </motion.button>
                                        ))}
                                        {messages.length > 1 && (
                                            <button
                                                onClick={resetChat}
                                                className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-full border border-red-100 hover:bg-red-100 transition-all font-medium"
                                            >
                                                Reset Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Input Field */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 border-t border-gray-100 flex gap-2 items-center"
                            >
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="flex-1 text-sm text-slate-900 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-primary-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!userInput.trim()}
                                    className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary-700 transition-colors shadow-md"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                                DigiSwasthya Foundation Assistant
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Prompt Bubble (Decreased Size) */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-3 right-14 mr-2 whitespace-nowrap hidden sm:block pointer-events-none"
                >
                    <div className="bg-white px-3 py-1.5 rounded-xl shadow-lg border border-primary-500/20 flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className="text-[7px] uppercase tracking-wider text-primary-600 font-bold leading-none mb-0.5">Online Now</span>
                            <span className="text-[11px] font-bold text-gray-800 leading-tight">May I help you?</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)] animate-pulse" />
                    </div>
                    {/* Tail for the bubble */}
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-primary-500/20 rotate-45" />
                </motion.div>
            )}

            {/* Floating Icon */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-white text-primary-600 border-2 border-primary-600' : 'bg-primary-600 text-white'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
