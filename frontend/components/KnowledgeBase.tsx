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
        const statusMap: Record<string, { bg: string; text: string; icon: string }> = {
            pending: { bg: 'rgba(255, 149, 0, 0.12)', text: '#ff9500', icon: '⏳' },
            processing: { bg: 'rgba(0, 122, 255, 0.12)', text: '#007aff', icon: '⚙️' },
            completed: { bg: 'rgba(52, 199, 89, 0.12)', text: '#34c759', icon: '✓' },
            failed: { bg: 'rgba(255, 59, 48, 0.12)', text: '#ff3b30', icon: '✕' },
        };

        const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;

        return (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: statusInfo.bg, color: statusInfo.text }}>
                {statusInfo.icon} {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="card">
                    <div className="flex items-center justify-center py-16">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Document Library
                        </h2>
                        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                            {documents.length} {documents.length === 1 ? 'document' : 'documents'} • {totalChunks} chunks
                        </p>
                    </div>
                    {documents.length > 0 && (
                        <button
                            onClick={handleResetKnowledgeBase}
                            disabled={resetting}
                            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                            style={{
                                background: 'rgba(255, 59, 48, 0.1)',
                                color: '#ff3b30',
                                border: '1px solid rgba(255, 59, 48, 0.2)'
                            }}
                        >
                            {resetting ? 'Resetting...' : '🗑️ Clear All'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Total Documents */}
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{documents.length}</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Documents</p>
                        </div>
                    </div>
                </div>

                {/* Total Chunks */}
                <div className="card" style={{ background: 'rgba(0, 122, 255, 0.06)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#007aff' }}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalChunks}</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Chunks</p>
                        </div>
                    </div>
                </div>

                {/* Processed */}
                <div className="card" style={{ background: 'rgba(52, 199, 89, 0.06)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#34c759' }}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {documents.filter(d => d.status === 'completed').length}
                            </p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Ready</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#667eea', width: '40px', height: '40px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Documents Yet</h3>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Upload your first document to get started</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.document_id}
                            className="card hover:shadow-lg transition-all"
                            style={{ cursor: 'default' }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                {/* Document Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                                            {doc.filename}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="font-medium">{doc.file_type.toUpperCase()}</span>
                                            <span>•</span>
                                            <span>{formatFileSize(doc.file_size)}</span>
                                            <span>•</span>
                                            <span>{doc.total_chunks} chunks</span>
                                            <span>•</span>
                                            <span>{formatDate(doc.uploaded_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(doc.status)}
                                    <button
                                        onClick={() => handleDeleteDocument(doc.document_id)}
                                        className="p-2.5 rounded-xl transition-all"
                                        style={{
                                            background: 'rgba(255, 59, 48, 0.08)',
                                            color: '#ff3b30'
                                        }}
                                        title="Delete document"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
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
