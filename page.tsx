"use client";

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  text: string;
  isUser: boolean;
};

type StrategyData = {
  strategy_overview: string;
  content_calendar: any[];
  post_ideas: any[];
  captions: any[];
  hashtag_strategy: {
    broad: string[];
    niche: string[];
    branded: string[];
  };
  cost_optimization: any[];
  reusable_prompts: any[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI Content Strategist. Let's build your social media roadmap. 🚀", isUser: false }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [strategyInputs, setStrategyInputs] = useState({
    brand: '',
    niche: '',
    audience: '',
    platform: '',
    goal: ''
  });
  const [inputValue, setInputValue] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState<StrategyData | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    { key: 'brand', question: "What's your brand name?", icon: 'campaign' },
    { key: 'niche', question: "What niche are you in?", icon: 'category' },
    { key: 'audience', question: "Who is your target audience?", icon: 'groups' },
    { key: 'platform', question: "Which platform are we focusing on?", icon: 'share' },
    { key: 'goal', question: "What is your primary goal?", icon: 'flag' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { text: steps[0].question, isUser: false }]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userVal = inputValue.trim();
    setMessages(prev => [...prev, { text: userVal, isUser: true }]);
    setStrategyInputs(prev => ({ ...prev, [steps[currentStep].key]: userVal }));
    setInputValue('');

    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: steps[currentStep + 1].question, isUser: false }]);
        setCurrentStep(prev => prev + 1);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Perfect! I have all the details. Ready to generate your strategy?", isUser: false }]);
        setIsFinished(true);
      }, 600);
    }
  };

  const generateStrategy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strategyInputs),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setStrategy(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate strategy. Please check your API key.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const resetChat = () => {
    setMessages([{ text: "Hello! I'm your AI Content Strategist. Let's build your social media roadmap. 🚀", isUser: false }]);
    setCurrentStep(0);
    setIsFinished(false);
    setStrategy(null);
    setStrategyInputs({ brand: '', niche: '', audience: '', platform: '', goal: '' });
    setTimeout(() => {
      setMessages(prev => [...prev, { text: steps[0].question, isUser: false }]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Sidebar - Inspired by Image */}
      <aside className="w-20 fixed left-4 top-4 bottom-4 glass-card flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-2xl mb-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
        <nav className="flex flex-col gap-6 flex-1">
          <div className="sidebar-icon active"><span className="material-symbols-rounded">auto_awesome</span></div>
          <div className="sidebar-icon"><span className="material-symbols-rounded">chat</span></div>
          <div className="sidebar-icon"><span className="material-symbols-rounded">settings</span></div>
        </nav>
        <div className="sidebar-icon mt-auto"><span className="material-symbols-rounded">logout</span></div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-28 p-8 pb-40">
        <div className="max-w-5xl mx-auto pt-10">
          {/* Header Section */}
          <header className="text-center mb-16 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-400">
              AI Powers <span className="text-gray-900">Easy Strategy</span> And <br />
              <span className="text-gray-900">Brand Success</span>
            </h1>
          </header>

          {!strategy && (
            <div className="flex flex-col items-center">
              {/* 3D Orb focal point */}
              <div className="orb-container">
                <div className="orb"></div>
                <div className="orb-reflection"></div>
              </div>

              {/* Chat View */}
              <div className="w-full max-w-2xl mt-12 space-y-4 no-scrollbar max-h-[400px] overflow-y-auto px-4 pb-20">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.isUser
                        ? 'bg-gray-900 text-white rounded-br-none'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          {/* Notepad-Style Results */}
          {strategy && (
            <div id="results" className="animate-fadeIn pt-10">
              {/* Notepad Document */}
              <div className="notepad-document">
                {/* Notepad Header */}
                <div className="notepad-header">
                  <div className="notepad-tabs">
                    <div className="notepad-tab active">
                      <span className="material-symbols-rounded text-sm">description</span>
                      Content_Strategy.txt
                    </div>
                    <div className="notepad-tab">
                      <span className="material-symbols-rounded text-sm">add</span>
                    </div>
                  </div>
                  <div className="notepad-controls">
                    <button className="notepad-control-btn">
                      <span className="material-symbols-rounded text-sm">remove</span>
                    </button>
                    <button className="notepad-control-btn">
                      <span className="material-symbols-rounded text-sm">crop_square</span>
                    </button>
                    <button className="notepad-control-btn close">
                      <span className="material-symbols-rounded text-sm">close</span>
                    </button>
                  </div>
                </div>

                {/* Notepad Toolbar */}
                <div className="notepad-toolbar">
                  <div className="notepad-menu">
                    <span>File</span>
                    <span>Edit</span>
                    <span>Format</span>
                    <span>View</span>
                    <span>Help</span>
                  </div>
                  <div className="notepad-actions">
                    <button className="notepad-icon-btn" title="Save">
                      <span className="material-symbols-rounded text-base">save</span>
                    </button>
                    <button className="notepad-icon-btn" title="Print">
                      <span className="material-symbols-rounded text-base">print</span>
                    </button>
                    <button 
                      className="notepad-icon-btn" 
                      title="Copy"
                      onClick={() => {
                        const content = document.querySelector('.notepad-content')?.textContent;
                        if (content) navigator.clipboard.writeText(content);
                      }}
                    >
                      <span className="material-symbols-rounded text-base">content_copy</span>
                    </button>
                  </div>
                </div>

                {/* Notepad Content Area */}
                <div className="notepad-content-wrapper">
                  <div className="notepad-line-numbers">
                    {Array.from({ length: 100 }, (_, i) => (
                      <div key={i} className="line-number">{i + 1}</div>
                    ))}
                  </div>
                  
                  <div className="notepad-content">
                    <div className="notepad-section">
                      <div className="notepad-title">╔═══════════════════════════════════════════════════════════╗</div>
                      <div className="notepad-title">║           SOCIAL MEDIA CONTENT STRATEGY DOCUMENT          ║</div>
                      <div className="notepad-title">╚═══════════════════════════════════════════════════════════╝</div>
                      <br />
                      <div className="notepad-metadata">
                        Generated: {new Date().toLocaleString()}
                      </div>
                      <div className="notepad-metadata">
                        Brand: {strategyInputs.brand} | Niche: {strategyInputs.niche}
                      </div>
                      <div className="notepad-metadata">
                        Platform: {strategyInputs.platform} | Goal: {strategyInputs.goal}
                      </div>
                      <br />
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-heading">[1] STRATEGY OVERVIEW</div>
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                      <br />
                      <div className="notepad-text">{strategy.strategy_overview}</div>
                      <br />
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-heading">[2] 30-DAY CONTENT ROADMAP</div>
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                      <br />
                      {strategy.content_calendar.map((day, i) => (
                        <div key={i} className="notepad-calendar-item">
                          <span className="notepad-bold">{day.day}:</span> {day.theme}
                          <br />
                          <span className="notepad-indent">└─ Type: {day.content_type}</span>
                          <br />
                        </div>
                      ))}
                      <br />
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-heading">[3] VIRAL POST IDEAS</div>
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                      <br />
                      {strategy.post_ideas.map((idea, i) => (
                        <div key={i} className="notepad-post-idea">
                          <span className="notepad-bullet">• </span>
                          <span className="notepad-bold">{idea.title}</span>
                          <br />
                          <span className="notepad-indent">Hook: "{idea.hook}"</span>
                          <br />
                          <br />
                        </div>
                      ))}
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-heading">[4] READY-TO-USE CAPTIONS</div>
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                      <br />
                      {strategy.captions.map((cap, i) => (
                        <div key={i} className="notepad-caption">
                          <span className="notepad-caption-type">[{cap.type.toUpperCase()}]</span>
                          <br />
                          {cap.content}
                          <br />
                          <br />
                        </div>
                      ))}
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-heading">[5] HASHTAG STRATEGY</div>
                      <div className="notepad-divider">{'─'.repeat(70)}</div>
                      <br />
                      <div className="notepad-hashtag-section">
                        <span className="notepad-bold">BROAD REACH:</span>
                        <br />
                        {strategy.hashtag_strategy.broad.map((tag, i) => (
                          <span key={i} className="notepad-hashtag">#{tag.replace('#', '')} </span>
                        ))}
                        <br />
                        <br />
                        <span className="notepad-bold">NICHE SPECIFIC:</span>
                        <br />
                        {strategy.hashtag_strategy.niche.map((tag, i) => (
                          <span key={i} className="notepad-hashtag">#{tag.replace('#', '')} </span>
                        ))}
                        <br />
                        <br />
                        {strategy.hashtag_strategy.branded.length > 0 && (
                          <>
                            <span className="notepad-bold">BRANDED:</span>
                            <br />
                            {strategy.hashtag_strategy.branded.map((tag, i) => (
                              <span key={i} className="notepad-hashtag">#{tag.replace('#', '')} </span>
                            ))}
                          </>
                        )}
                      </div>
                      <br />
                    </div>

                    <div className="notepad-section">
                      <div className="notepad-divider">{'═'.repeat(70)}</div>
                      <div className="notepad-footer">END OF DOCUMENT</div>
                      <div className="notepad-footer">
                        Generated by AI Content Strategist | Total Lines: ~{strategy.content_calendar.length + strategy.post_ideas.length + 50}
                      </div>
                      <div className="notepad-divider">{'═'.repeat(70)}</div>
                    </div>
                  </div>
                </div>

                {/* Notepad Status Bar */}
                <div className="notepad-status-bar">
                  <div className="notepad-status-left">
                    <span>Ln 1, Col 1</span>
                    <span className="notepad-status-separator">|</span>
                    <span>UTF-8</span>
                    <span className="notepad-status-separator">|</span>
                    <span>Windows (CRLF)</span>
                  </div>
                  <div className="notepad-status-right">
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below Notepad */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => {
                    const content = document.querySelector('.notepad-content')?.textContent;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${strategyInputs.brand}_Content_Strategy.txt`;
                      a.click();
                    }
                  }}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-rounded text-lg">download</span>
                  Download as .txt
                </button>
                <button
                  onClick={resetChat}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-rounded text-lg">refresh</span>
                  New Strategy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="floating-input-container">
          <div className="flex gap-2 mb-2">
            <div className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-full border border-gray-100 flex items-center gap-1">
              <span className="material-symbols-rounded text-xs">campaign</span> Market Update
            </div>
            <div className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-full border border-gray-100 flex items-center gap-1">
              <span className="material-symbols-rounded text-xs">trending_up</span> Top Gainers
            </div>
            {currentStep > 0 && (
              <div className="px-3 py-1 bg-pink-50 text-[10px] font-bold text-pink-500 rounded-full border border-pink-100 flex items-center gap-1">
                <span className="material-symbols-rounded text-xs">check</span> {steps[currentStep - 1].key} Captured
              </div>
            )}
          </div>

          <div className="relative">
            {!isFinished ? (
              <div className="flex items-center gap-4 bg-[#F2F2F2]/50 p-2 rounded-2xl border border-gray-100">
                <button className="p-2 text-gray-400 hover:text-gray-900"><span className="material-symbols-rounded">attachment</span></button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 py-3 text-sm"
                />
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-gray-900 text-sm font-medium">
                    <span className="material-symbols-rounded text-lg">mic</span> Voice
                  </button>
                  <button
                    onClick={handleSend}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Send <span className="material-symbols-rounded text-sm">arrow_upward</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={generateStrategy}
                  disabled={isLoading}
                  className={`w-full py-4 ${isLoading ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-900 to-gray-800'} rounded-2xl font-bold text-white shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3`}
                >
                  {isLoading ? (
                    <><span className="material-symbols-rounded spinning">sync</span> Generating Strategy...</>
                  ) : (
                    <><span className="material-symbols-rounded">bolt</span> Generate Global Content Strategy</>
                  )}
                </button>
                <button onClick={resetChat} className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center hover:text-gray-900 transition-colors">Restart System</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Connection Button */}
      <div className="fixed top-8 right-8 z-50">
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm shadow-sm hover:shadow-md transition-all">
          <span className="material-symbols-rounded text-lg">add</span> Connect Strategy
        </button>
      </div>

      <style jsx>{`
        /* Notepad Document Styles */
        .notepad-document {
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          font-family: 'Consolas', 'Courier New', monospace;
          max-width: 900px;
          margin: 0 auto;
        }

        .notepad-header {
          background: #f0f0f0;
          border-bottom: 1px solid #d0d0d0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
        }

        .notepad-tabs {
          display: flex;
          gap: 4px;
        }

        .notepad-tab {
          background: #e5e5e5;
          border: 1px solid #c0c0c0;
          border-radius: 4px 4px 0 0;
          padding: 6px 12px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #333;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notepad-tab.active {
          background: #ffffff;
          border-bottom-color: #ffffff;
        }

        .notepad-tab:hover {
          background: #f5f5f5;
        }

        .notepad-controls {
          display: flex;
          gap: 8px;
        }

        .notepad-control-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notepad-control-btn:hover {
          background: #e0e0e0;
        }

        .notepad-control-btn.close:hover {
          background: #e81123;
          color: white;
        }

        .notepad-toolbar {
          background: #fafafa;
          border-bottom: 1px solid #e0e0e0;
          padding: 6px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notepad-menu {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #333;
        }

        .notepad-menu span {
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 3px;
          transition: background 0.2s;
        }

        .notepad-menu span:hover {
          background: #e8e8e8;
        }

        .notepad-actions {
          display: flex;
          gap: 4px;
        }

        .notepad-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #555;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notepad-icon-btn:hover {
          background: #e0e0e0;
        }

        .notepad-content-wrapper {
          display: flex;
          background: #ffffff;
          min-height: 600px;
          max-height: 800px;
          overflow-y: auto;
        }

        .notepad-line-numbers {
          background: #f5f5f5;
          border-right: 1px solid #e0e0e0;
          padding: 16px 12px;
          font-size: 11px;
          color: #999;
          text-align: right;
          user-select: none;
          min-width: 50px;
        }

        .line-number {
          line-height: 1.6;
          font-family: 'Consolas', monospace;
        }

        .notepad-content {
          flex: 1;
          padding: 16px 24px;
          font-size: 13px;
          line-height: 1.6;
          color: #1a1a1a;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .notepad-section {
          margin-bottom: 20px;
        }

        .notepad-title {
          font-weight: bold;
          text-align: center;
          color: #000;
          font-size: 13px;
        }

        .notepad-metadata {
          font-size: 11px;
          color: #666;
        }

        .notepad-heading {
          font-weight: bold;
          font-size: 14px;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .notepad-divider {
          color: #999;
          font-size: 12px;
        }

        .notepad-text {
          color: #333;
          line-height: 1.8;
        }

        .notepad-bold {
          font-weight: bold;
          color: #000;
        }

        .notepad-indent {
          padding-left: 24px;
          color: #555;
          font-size: 12px;
        }

        .notepad-calendar-item,
        .notepad-post-idea,
        .notepad-caption {
          margin-bottom: 8px;
        }

        .notepad-bullet {
          color: #666;
          font-weight: bold;
        }

        .notepad-caption-type {
          font-weight: bold;
          color: #0066cc;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .notepad-hashtag {
          color: #0066cc;
          margin-right: 8px;
        }

        .notepad-hashtag-section {
          line-height: 2;
        }

        .notepad-footer {
          text-align: center;
          color: #666;
          font-size: 11px;
          font-style: italic;
        }

        .notepad-status-bar {
          background: #f0f0f0;
          border-top: 1px solid #d0d0d0;
          padding: 6px 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #666;
        }

        .notepad-status-left {
          display: flex;
          gap: 12px;
        }

        .notepad-status-separator {
          color: #ccc;
        }

        /* Scrollbar Styling for Notepad */
        .notepad-content-wrapper::-webkit-scrollbar {
          width: 12px;
        }

        .notepad-content-wrapper::-webkit-scrollbar-track {
          background: #f0f0f0;
        }

        .notepad-content-wrapper::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-radius: 6px;
        }

        .notepad-content-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a0a0a0;
        }
      `}</style>
    </div>
  );
}