'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Citation {
    document_name: string;
    chunk_index: number;
    content_preview: string;
    relevance_score: number;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
}

interface ChatInterfaceProps {
    refreshTrigger?: number;
}

export default function ChatInterface({ refreshTrigger }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: userMessage.content,
                    top_k: 5,
                }),
            });

            if (!response.ok) {
                throw new Error('Query failed');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.answer,
                citations: data.citations,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Query error:', error);

            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your question. Please try again.',
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col h-[700px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#eee]">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Chat with Your Documents</h2>
                        <p className="text-sm text-[#666] mt-1">
                            Ask questions and get answers with citations
                        </p>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="btn-secondary text-sm"
                        >
                            Clear Chat
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-[#4a1d4b]/10 flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-[#4a1d4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black mb-3">Start a Conversation</h3>
                            <p className="text-[#666] max-w-sm mx-auto">
                                Ask questions about your uploaded documents. I'll provide answers with citations to the source material.
                            </p>

                            {/* Example Questions */}
                            <div className="mt-8 w-full max-w-2xl">
                                <p className="text-sm text-gray-500 mb-3 text-center">Try asking:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "What is the main topic of this document?",
                                        "Summarize the key points",
                                        "What are the conclusions?",
                                        "Who are the main people mentioned?",
                                    ].map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(question)}
                                            className="p-4 text-left bg-[#f8f9fa] border border-[#eee] rounded-xl hover:border-[#ff7062] hover:bg-white transition-all text-sm font-medium"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, idx) => (
                                <div
                                    key={idx}
                                    className={`message-bubble ${message.role === 'user' ? 'message-user ml-auto' : 'message-assistant'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {message.role === 'assistant' && (
                                            <div className="w-10 h-10 rounded-full bg-[#4a1d4b] flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                                            {/* Citations */}
                                            {message.citations && message.citations.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-[#eee]">
                                                    <p className="text-[10px] uppercase tracking-widest font-black text-[#888] mb-3">Sources:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.citations.map((citation, citIdx) => (
                                                            <button
                                                                key={citIdx}
                                                                onClick={() => setSelectedCitation(citation)}
                                                                className="citation-badge"
                                                            >
                                                                📄 {citation.document_name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="message-assistant">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#4a1d4b] flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <p className="text-[#666] font-medium animate-pulse text-sm">Assistant is thinking...</p>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4 p-2 bg-[#f8f9fa] rounded-full border border-[#eee] focus-within:border-[#ff7062] transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your documents..."
                        className="bg-transparent flex-1 px-6 py-3 focus:outline-none text-sm font-medium"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-[#ff7062] text-white p-3 rounded-full hover:bg-[#e86356] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center shadow-lg shadow-coral-500/20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Citation Modal */}
            {selectedCitation && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedCitation(null)}
                >
                    <div
                        className="card max-w-2xl w-full animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Citation Details</h3>
                            <button
                                onClick={() => setSelectedCitation(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-[#888] mb-1">Document</p>
                                    <p className="font-bold text-[#4a1d4b]">{selectedCitation.document_name}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-[#888] mb-1">Section</p>
                                    <p className="font-bold text-[#4a1d4b]">Chunk {selectedCitation.chunk_index}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-[#888] mb-2">Relevance Score</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-3 bg-[#f8f9fa] rounded-full overflow-hidden border border-[#eee]">
                                        <div
                                            className="h-full bg-[#ff7062]"
                                            style={{ width: `${selectedCitation.relevance_score * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-black text-[#ff7062]">{(selectedCitation.relevance_score * 100).toFixed(1)}%</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-[#888] mb-3">Content Preview</p>
                                <div className="p-6 bg-[#f8f9fa] border border-[#eee] rounded-2xl">
                                    <p className="text-sm leading-relaxed text-[#444]">{selectedCitation.content_preview}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
