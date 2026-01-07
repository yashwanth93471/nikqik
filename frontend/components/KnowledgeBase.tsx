'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Document {
    document_id: string;
    filename: string;
    file_type: string;
    file_size: number;
    status: string;
    total_chunks: number;
    uploaded_at: string;
    processed_at?: string;
}

interface KnowledgeBaseProps {
    refreshTrigger?: number;
    onStatsUpdate?: (documents: number, chunks: number) => void;
    onReset?: () => void;
}

export default function KnowledgeBase({ refreshTrigger, onStatsUpdate, onReset }: KnowledgeBaseProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [totalChunks, setTotalChunks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents`);
            if (!response.ok) throw new Error('Failed to fetch documents');

            const data = await response.json();
            setDocuments(data.documents);
            setTotalChunks(data.total_chunks);

            if (onStatsUpdate) {
                onStatsUpdate(data.total_documents, data.total_chunks);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const handleDeleteDocument = async (documentId: string) => {
        if (!confirm('Delete this document?')) return;

        try {
            const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete document');

            await fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
    };

    const handleResetKnowledgeBase = async () => {
        if (!confirm('Reset entire library? This cannot be undone.')) {
            return;
        }

        setResetting(true);
        try {
            const response = await fetch(`${API_URL}/api/reset`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to reset knowledge base');

            await fetchDocuments();

            if (onReset) {
                onReset();
            }
        } catch (error) {
            console.error('Error resetting knowledge base:', error);
            alert('Failed to reset knowledge base');
        } finally {
            setResetting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusBadge = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'completed') {
            return <span className="status-badge status-completed">✓ {status}</span>;
        } else if (lowerStatus === 'processing') {
            return <span className="status-badge status-processing">⚙️ {status}</span>;
        } else if (lowerStatus === 'failed') {
            return <span className="status-badge status-failed">✕ {status}</span>;
        }
        return <span className="status-badge status-pending">⏳ {status}</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Document Library</h2>
                        <p className="text-[#666]">
                            {documents.length} {documents.length === 1 ? 'document' : 'documents'} • {totalChunks} insightful chunks processed
                        </p>
                    </div>
                    {documents.length > 0 && (
                        <button
                            onClick={handleResetKnowledgeBase}
                            disabled={resetting}
                            className="bg-[#eb5757]/10 text-[#eb5757] px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-[#eb5757] hover:text-white transition-all border border-[#eb5757]/20"
                        >
                            {resetting ? 'Resetting...' : 'Clear All'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Documents */}
                <div className="p-8 bg-[#f8f9fa] border border-[#eee] rounded-2xl flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#4a1d4b] text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-[#4a1d4b]">{documents.length}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">Documents</p>
                    </div>
                </div>

                {/* Total Chunks */}
                <div className="p-8 bg-[#f8f9fa] border border-[#eee] rounded-2xl flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff7062] text-white flex items-center justify-center shadow-lg shadow-coral-500/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-[#ff7062]">{totalChunks}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">Chunks</p>
                    </div>
                </div>

                {/* Processed Rate */}
                <div className="p-8 bg-[#f8f9fa] border border-[#eee] rounded-2xl flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#27ae60] text-white flex items-center justify-center shadow-lg shadow-green-500/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-[#27ae60]">
                            {documents.length > 0 ? Math.round((documents.filter(d => d.status === 'completed').length / documents.length) * 100) : 0}%
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">Success Rate</p>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
                <div className="text-center py-24 bg-[#f8f9fa] rounded-[32px] border border-dashed border-[#ccc]">
                    <div className="w-24 h-24 rounded-full bg-white mx-auto mb-8 flex items-center justify-center shadow-xl">
                        <svg className="w-12 h-12 text-[#ff7062]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-black mb-3 tracking-tight">No Knowledge Base Yet</h3>
                    <p className="text-[#666] max-w-sm mx-auto">Upload documents to start building your AI intelligence engine.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.document_id}
                            className="group p-6 bg-white border border-[#eee] rounded-2xl hover:border-[#ff7062] hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className="w-14 h-14 rounded-xl bg-[#4a1d4b]/5 text-[#4a1d4b] flex items-center justify-center group-hover:bg-[#4a1d4b] group-hover:text-white transition-all">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg mb-1 truncate text-[#111]">{doc.filename}</h3>
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                                            <span className="text-[#ff7062]">{doc.file_type}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{formatFileSize(doc.file_size)}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{doc.total_chunks} chunks</span>
                                            <span className="opacity-30">•</span>
                                            <span>{formatDate(doc.uploaded_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {getStatusBadge(doc.status)}
                                    <button
                                        onClick={() => handleDeleteDocument(doc.document_id)}
                                        className="p-3 rounded-full text-[#eb5757] hover:bg-[#eb5757] hover:text-white transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
