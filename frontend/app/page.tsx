'use client';

import { useState, useRef, useEffect } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import ChatInterface from '@/components/ChatInterface';
import KnowledgeBase from '@/components/KnowledgeBase';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'knowledge'>('upload');
  const [documentsCount, setDocumentsCount] = useState(0);
  const [chunksCount, setChunksCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('chat');
  };

  const handleReset = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #fafafa 0%, #f5f5f7 100%)' }}>
      {/* Unique Aesthetic Header */}
      <header className="glass-strong sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Unique Brand Identity */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
                  style={{ background: 'var(--success)', boxShadow: '0 0 12px rgba(52, 199, 89, 0.6)' }}></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                  lineHeight: '1.1'
                }}>
                  DocuMind AI
                </h1>
                <p className="text-sm md:text-base font-medium mt-1" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
                  Your Intelligent Document Assistant • 100% Free
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-3 rounded-full card" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }}></div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {documentsCount}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>docs</span>
                </div>
                <div className="w-px h-4" style={{ background: 'var(--border-color)' }}></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {chunksCount}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>chunks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Improved Tab Navigation - More User Friendly */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 p-2 card-glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Upload Tab */}
            <button
              onClick={() => setActiveTab('upload')}
              className={`group relative px-6 py-5 rounded-2xl font-semibold transition-all ${activeTab === 'upload' ? '' : ''
                }`}
              style={{
                background: activeTab === 'upload'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === 'upload' ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === 'upload' ? '0 8px 24px rgba(102, 126, 234, 0.35)' : 'none',
                transform: activeTab === 'upload' ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-bold">Upload</span>
                <span className="text-xs opacity-80">Add Documents</span>
              </div>
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              )}
            </button>

            {/* Chat Tab */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`group relative px-6 py-5 rounded-2xl font-semibold transition-all ${activeTab === 'chat' ? '' : ''
                }`}
              style={{
                background: activeTab === 'chat'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === 'chat' ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === 'chat' ? '0 8px 24px rgba(102, 126, 234, 0.35)' : 'none',
                transform: activeTab === 'chat' ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-bold">Chat</span>
                <span className="text-xs opacity-80">Ask Questions</span>
              </div>
              {activeTab === 'chat' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              )}
            </button>

            {/* Knowledge Base Tab */}
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`group relative px-6 py-5 rounded-2xl font-semibold transition-all ${activeTab === 'knowledge' ? '' : ''
                }`}
              style={{
                background: activeTab === 'knowledge'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === 'knowledge' ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === 'knowledge' ? '0 8px 24px rgba(102, 126, 234, 0.35)' : 'none',
                transform: activeTab === 'knowledge' ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-bold">Library</span>
                <span className="text-xs opacity-80">Manage Files</span>
              </div>
              {activeTab === 'knowledge' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              )}
            </button>
          </div>

          {/* Helpful Description */}
          <div className="text-center mt-6">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'upload' && '📤 Upload your documents to get started'}
              {activeTab === 'chat' && '💬 Ask questions about your uploaded documents'}
              {activeTab === 'knowledge' && '📚 View and manage your document library'}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'upload' && (
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          )}
          {activeTab === 'chat' && (
            <ChatInterface refreshTrigger={refreshTrigger} />
          )}
          {activeTab === 'knowledge' && (
            <KnowledgeBase
              refreshTrigger={refreshTrigger}
              onStatsUpdate={(docs, chunks) => {
                setDocumentsCount(docs);
                setChunksCount(chunks);
              }}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Improved Footer */}
      <footer className="border-t mt-20" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col items-center gap-6">
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>
                Next.js
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}>
                FastAPI
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success)' }}>
                MongoDB
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007aff' }}>
                Hugging Face
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(255, 149, 0, 0.1)', color: 'var(--warning)' }}>
                100% Free
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <a href="#" className="hover:text-[#667eea] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation
              </a>
              <a href="#" className="hover:text-[#667eea] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a href="#" className="hover:text-[#667eea] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              © 2024 DocuMind AI • Powered by Open Source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
