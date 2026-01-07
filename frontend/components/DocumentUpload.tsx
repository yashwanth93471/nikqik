'use client';

import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface DocumentUploadProps {
    onUploadSuccess?: () => void;
}

export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        setError('');
        setUploading(true);
        setUploadProgress(0);
        setUploadStatus('Uploading document...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            const data = await response.json();

            setUploadProgress(100);
            setUploadStatus('Processing document...');

            // Wait a bit for processing to start
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUploadStatus('Document uploaded successfully!');

            // Call success callback
            if (onUploadSuccess) {
                onUploadSuccess();
            }

            // Reset after 2 seconds
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setUploadStatus('');
            }, 2000);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
            setUploading(false);
            setUploadProgress(0);
            setUploadStatus('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="card">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
                    <p className="text-gray-400">
                        Upload PDF, DOCX, TXT, or Markdown files to build your knowledge base
                    </p>
                </div>

                {/* Upload Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />

                    {!uploading ? (
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold mb-1">
                                        Drop your document here or click to browse
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Supported formats: PDF, DOCX, TXT, MD (Max 10MB)
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="spinner"></div>
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">{uploadStatus}</p>
                                <div className="w-64 h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{uploadProgress}%</p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-400">{error}</p>
                        </div>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">Smart Chunking</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                            Documents are split into 500-1000 token chunks with overlap for better context
                        </p>
                    </div>

                    <div className="p-4 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">Vector Search</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                            Embeddings stored in MongoDB for fast semantic search
                        </p>
                    </div>

                    <div className="p-4 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">Citations</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                            Every answer includes source references for verification
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
