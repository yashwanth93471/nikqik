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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('chat');
    // Scroll to tool section
    document.getElementById('tool-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#ff7062] selection:text-white">
      {/* Header matching the reference */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#4a1d4b] py-5 shadow-2xl' : 'bg-[#4a1d4b]/80 backdrop-blur-md py-6 shadow-lg'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#ff7062] flex items-center justify-center shadow-lg shadow-coral-500/30">
              <span className="text-white font-black text-2xl">k</span>
            </div>
            <span className="text-white font-black text-3xl tracking-tighter">koral.</span>
          </div>

          {/* Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-10">
            {['HOME', 'FEATURES', 'PRICING', 'ABOUT', 'CONTACT', 'BLOG'].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-bold tracking-widest hover:text-[#ff7062] transition-all duration-200 ${item === 'HOME' ? 'text-[#ff7062] border-b-2 border-[#ff7062] pb-1' : 'text-white/90 hover:text-white'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Icons - Right */}
          <div className="flex items-center gap-6 text-white">
            <button className="hover:text-[#ff7062] transition-all duration-200 hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className="relative hover:text-[#ff7062] transition-all duration-200 cursor-pointer hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 bg-[#ff7062] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">0</span>
            </div>
            <button className="hover:text-[#ff7062] transition-all duration-200 hover:scale-110">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] animate-fade-in">
            Create Amazing Documents <br />
            <span className="text-[#ff7062]">With Amazing AI</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Empower your workflow with DocuMind AI. Upload, analyze, and query your knowledge base with precision and speed like never before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('tool-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-accent w-full sm:w-auto"
            >
              EXPERIENCE NOW
            </button>
            <button className="btn-outline-white w-full sm:w-auto">
              VIEW FEATURES
            </button>
          </div>
        </div>

        {/* Slider Dots Placeholder */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-[#ff7062]' : 'bg-white/30'}`}></div>
          ))}
        </div>

        {/* Nav Arrows */}
        <button className="absolute left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#ff7062] hover:border-[#ff7062] transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="absolute right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#ff7062] hover:border-[#ff7062] transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </section>

      {/* Features Section - Below Hero */}
      <section className="py-32 bg-gradient-to-b from-white to-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-3xl border border-[#eee] hover:border-[#ff7062] hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center text-[#ff7062] bg-[#ff7062]/10 rounded-2xl group-hover:scale-110 transition-transform">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">AI Semantic Search</h3>
              <p className="text-[#666] leading-relaxed">
                Experience lightning-fast retrieval with our vector-based embedding system. Finds exactly what you're looking for by understanding context.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-3xl border border-[#eee] hover:border-[#ff7062] hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center text-[#4a1d4b] bg-[#4a1d4b]/10 rounded-2xl group-hover:scale-110 transition-transform">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Intelligent Q&A</h3>
              <p className="text-[#666] leading-relaxed">
                Ask complex questions and receive precise, AI-generated answers based solely on your uploaded knowledge base.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-3xl border border-[#eee] hover:border-[#ff7062] hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center text-[#27ae60] bg-[#27ae60]/10 rounded-2xl group-hover:scale-110 transition-transform">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Safe & Verified</h3>
              <p className="text-[#666] leading-relaxed">
                Every answer comes with clickable citations. Always know exactly where your information originated for 100% transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section - This is where the actual functionality lives */}
      <section id="tool-section" className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Your Intelligence Hub</h2>
          <p className="text-[#666] mb-12 max-w-xl mx-auto">Upload documents to build your private knowledge base and start chatting with AI.</p>

          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-[#eee]">
            {/* Custom Tabs matching the theme */}
            <div className="flex border-b border-[#eee]">
              {[
                { id: 'upload' as const, label: 'UPLOAD', icon: '📤' },
                { id: 'chat' as const, label: 'CHAT', icon: '💬' },
                { id: 'knowledge' as const, label: 'KNOWLEDGE BASE', icon: '📚' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-8 px-6 font-black tracking-widest text-xs transition-all flex flex-col items-center gap-3 ${activeTab === tab.id
                    ? 'bg-[#4a1d4b] text-white'
                    : 'bg-white text-[#4a1d4b] hover:bg-[#f8f9fa]'
                    }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-12 text-left min-h-[600px] animate-fade-in">
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
          </div>

          {/* Stats Summary */}
          <div className="mt-12 flex justify-center gap-12">
            <div className="text-center">
              <p className="text-4xl font-black text-[#4a1d4b]">{documentsCount}</p>
              <p className="text-xs font-bold text-[#666] tracking-widest uppercase mt-1">Files Processed</p>
            </div>
            <div className="w-px h-12 bg-[#eee]"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-[#4a1d4b]">{chunksCount}</p>
              <p className="text-xs font-bold text-[#666] tracking-widest uppercase mt-1">Insight Chunks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer matching the premium theme */}
      <footer className="bg-[#1a1a1a] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#ff7062] flex items-center justify-center">
                <span className="text-white font-black text-xl">k</span>
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">koral.</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Creating amazing document experiences with cutting-edge AI technology. Join thousands of users worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-black text-xs tracking-[0.2em] uppercase mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs tracking-[0.2em] uppercase mb-8">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Test Cases</a></li>
              <li><a href="#" className="hover:text-[#ff7062] transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs tracking-[0.2em] uppercase mb-8">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-6">Stay updated with our latest AI insights.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm flex-1 focus:outline-none focus:border-[#ff7062]" />
              <button className="bg-[#ff7062] p-3 rounded-full hover:bg-[#e86356] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 text-center text-xs text-gray-500 tracking-widest font-bold">
          © 2026 KORAL AI • ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
