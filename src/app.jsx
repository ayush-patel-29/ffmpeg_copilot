import React, { useState, useEffect } from 'react';
import { SettingsModal } from './components/SettingsModal.jsx';
import { FaUser, FaCloudUploadAlt, FaChevronDown } from 'react-icons/fa';
import { FiMinimize2 } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { MODELS } from './utils/constants';

export const App = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS.free[0].id);
  const [prompt, setPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedModel = localStorage.getItem('groq_model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    localStorage.setItem('groq_model', modelId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // TODO: Handle dropped files
    console.log('Files dropped:', e.dataTransfer.files);
  };

  return (
    // Outer Wrapper - defines the window shape and holds the border logic
    <div className="relative h-screen w-screen rounded-[12px] overflow-hidden bg-transparent">

      {/* Corner Glows */}
      {/* Top Left - Pinkish */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-pink-400  blur-[40px] pointer-events-none rounded-full translate-x-[-30%] translate-y-[-30%]" />
      {/* Top Right - White (default) */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-40 blur-[50px] pointer-events-none rounded-full translate-x-[30%] translate-y-[-30%]" />
      {/* Bottom Left - White (default) */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-40 blur-[50px] pointer-events-none rounded-full translate-x-[-30%] translate-y-[30%]" />
      {/* Bottom Right - Neonish (Cyan/Blue) */}
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-cyan-400  blur-[40px] pointer-events-none rounded-full translate-x-[30%] translate-y-[30%]" />

      {/* Inner Content - The actual app UI */}
      <div
        className="absolute inset-[2px] rounded-[11px] bg-[rgba(0,0,0,0.82)] backdrop-blur-3xl flex flex-col overflow-hidden group"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
        }}
        style={{
          // Preserving user's grid settings
          color: 'white',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        {/* Grid Highlight Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
            WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          }}
        />
        {/* Custom Title Bar / Drag Region */}
        <div style={{
          height: '50px',
          WebkitAppRegion: 'drag', // Electron specific: allows dragging
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
          cursor: 'default',
          paddingRight: '10px',
          justifyContent: "flex-end",
          position: 'relative',
          // border: '1px solid rgba(255,255,255,0.2)',
        }}>

          <span className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
            <span className="text-white rounded-full backdrop-blur-2xl bg-[rgba(255,255,255,0.3)] text-xl px-3 py-1">FFmpeg Copilot</span>
          </span>


          <div style={{ WebkitAppRegion: 'no-drag' }} className="flex justify-center items-center gap-2 rounded-full backdrop-blur-2xl bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.25)] h-8 w-26 duration-200">
            {/* Account Button */}
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                marginRight: '5px'
              }}
              title="Account Settings"
              className=''
            >
              <FaUser size={14} className='hover:text-white font-bold text-gray-400 duration-200' />
            </button>

            <button
              onClick={() => window.electronAPI.minimizeWindow()}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'

              }}
              className=''
            >
              <FiMinimize2 size={16} className='hover:text-white font-bold text-gray-400 duration-200' />
            </button>
            <button
              onClick={() => window.electronAPI.closeWindow()}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}

            >
              <MdCancel size={18} className='hover:text-red-500 text-red-300 duration-200' />
            </button>
          </div>
        </div>


        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center  w-full max-w-3xl mx-auto z-10">

          {/* Header Text */}
          <h1 className="text-5xl text-white select-none font-amsterdam">
            FFmpeg, <span className="font-polea">but Sexy</span>!
          </h1>

          {/* Spacer to force gap */}
          <div className="h-16 w-full"></div>

          {/* File Drop Zone with Rotating Glow */}
          <div className="relative group w-[80%] h-52">
            {/* Rotating Glow Shadow */}
            <div
              className="absolute -inset-0.5 rounded-3xl opacity-75 blur-xl transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-gradient-border"
              style={{
                background: `conic-gradient(from var(--gradient-angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
              }}
            ></div>

            {/* Rotating Border */}
            <div
              className="absolute -inset-0.5 rounded-3xl animate-gradient-border"
              style={{
                background: `conic-gradient(from var(--gradient-angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
              }}
            ></div>

            {/* Actual Drop Zone Content - Black Background */}
            <div
              className={`relative h-full w-full rounded-3xl flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md z-10 ${isDragOver
                ? 'bg-black scale-[0.99] border hover:border-[rgba(255,255,255,0.1)]'
                : 'bg-black border border-[rgba(255,255,255,0.1)]'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`p-4 rounded-full mb-3 transition-colors ${isDragOver ? 'bg-[rgba(34,211,238,0.2)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
                <FaCloudUploadAlt size={24} className={isDragOver ? 'text-cyan-400' : 'text-neutral-400'} />
              </div>
              <p className="text-neutral-300 font-medium">Drop image, video or audio files</p>
              <p className="text-neutral-500 text-xs mt-1">Supports MP4, AVI, MP3, WAV, JPG, PNG</p>
            </div>
          </div>

          {/* Spacer to force gap */}
          <div className="h-14 w-full"></div>
          {/* Prompt Input Area - Simplified & Polished */}
          <div className="relative w-[90%] max-w-2xl bg-[rgba(0,0,0,0.3)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-lg transition-colors hover:border-[rgba(255,255,255,0.2)]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (prompt.trim()) {
                    console.log("Send prompt:", prompt);
                    // TODO: Implement actual send logic
                    setPrompt('');
                  }
                }
              }}
              placeholder="Ask anything..."
              className="w-full h-32 bg-transparent border-none outline-none text-white text-lg placeholder-neutral-500 resize-none custom-scrollbar p-4 pb-14"
              style={{ lineHeight: '1.5' }}
            />

            {/* Model Selector - Absolute Positioned */}
            <div className="absolute bottom-4 right-4 z-20">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors duration-200 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] py-1.5 px-3 rounded-lg hover:border-[rgba(255,255,255,0.2)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_currentColor]"></span>
                  {(() => {
                    const allModels = [...MODELS.free, ...MODELS.paid];
                    const current = allModels.find(m => m.id === selectedModel);
                    return current ? current.name.replace(/ \(.*\)/, '') : selectedModel;
                  })()}
                  <FaChevronDown size={10} className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Opens Upwards */}
                {isDropdownOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col py-1">
                    <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-neutral-500 border-b border-[rgba(255,255,255,0.05)]">Select Model</div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {[...MODELS.free, ...MODELS.paid].map((model) => {
                        const isSelected = selectedModel === model.id;
                        return (
                          <button
                            key={model.id}
                            onClick={() => {
                              handleModelChange(model.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${isSelected ? 'bg-[rgba(34,211,238,0.1)] text-cyan-400' : 'text-neutral-300 hover:bg-[rgba(255,255,255,0.05)]'}`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400' : 'border-neutral-600'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                            </div>
                            <span className="text-sm font-medium">{model.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enter hint - Absolute Positioned */}
            <div className="absolute bottom-5 left-4 text-[10px] text-neutral-500 font-medium select-none pointer-events-none">
              Press <span className="text-neutral-400">Enter</span> to send
            </div>
          </div>

        </div>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </div>
    </div>
  );
};