import React, { useState, useEffect } from 'react';

export const SettingsModal = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        // Load existing key
        window.electronAPI.getApiKey().then(res => {
            if (res.ok && res.apiKey) {
                setApiKey(res.apiKey);
            }
        });
    }, []);

    const handleSave = async () => {
        if (!apiKey.trim()) return;
        setStatus('saving');
        const res = await window.electronAPI.setApiKey(apiKey);
        if (res.ok) {
            setStatus('success');
            setTimeout(onClose, 600);
        } else {
            setStatus('error');
        }
    };

    const handleClear = async () => {
        await window.electronAPI.clearApiKey();
        setApiKey('');
        setStatus('cleared');
        setTimeout(() => setStatus(''), 1500);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[100] animate-in fade-in duration-200"
            style={{
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
            }}
            onClick={onClose}
        >
            {/* Modal Container with Gradient Border */}
            <div className="relative animate-in zoom-in-95 fade-in duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Gradient Glow */}
                <div
                    className="absolute -inset-0.5 rounded-3xl opacity-75 blur-xl"
                    style={{
                        background: 'linear-gradient(135deg, #ff4545, #00ff99, #006aff, #ff0095)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient-shift 3s ease infinite'
                    }}
                />

                {/* Gradient Border */}
                <div
                    className="absolute -inset-0.5 rounded-3xl"
                    style={{
                        background: 'linear-gradient(135deg, #ff4545, #00ff99, #006aff, #ff0095)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient-shift 3s ease infinite'
                    }}
                />

                {/* Modal Content */}
                <div className="relative bg-black rounded-3xl border border-[rgba(255,255,255,0.1)]" style={{ padding: '28px', width: '360px', userSelect: 'none' }}>
                    {/* Title */}
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '6px', textAlign: 'center', marginTop: 0, userSelect: 'none' }}>
                        Account Settings
                    </h2>
                    <p style={{ color: 'rgb(163, 163, 163)', fontSize: '13px', textAlign: 'center', marginBottom: '24px', marginTop: 0, userSelect: 'none' }}>
                        Configure your Groq API key
                    </p>

                    {/* Input Field */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: 'rgb(163, 163, 163)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', userSelect: 'none' }}>
                            Groq API Key
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && apiKey.trim()) {
                                        handleSave();
                                    }
                                }}
                                placeholder="gsk_..."
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${isFocused ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxShadow: isFocused ? '0 0 20px rgba(34,211,238,0.2)' : 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '11px', color: 'rgb(115, 115, 115)', marginTop: '8px', marginBottom: 0, userSelect: 'none' }}>
                            Get your API key from{' '}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.electronAPI.send('open-external-url', 'https://console.groq.com');
                                }}
                                style={{
                                    color: 'rgb(34, 211, 238)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'rgb(56, 189, 248)'}
                                onMouseLeave={(e) => e.target.style.color = 'rgb(34, 211, 238)'}
                            >
                                console.groq.com
                            </a>
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '10px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '500',
                            textAlign: 'center',
                            ...(status === 'success' && { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'rgb(74, 222, 128)' }),
                            ...(status === 'error' && { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgb(239, 68, 68)' }),
                            ...(status === 'saving' && { background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', color: 'rgb(34, 211, 238)' }),
                            ...(status === 'cleared' && { background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)', color: 'rgb(250, 204, 21)' })
                        }}>
                            {status === 'success' ? '✓ API Key Saved!' :
                                status === 'error' ? '✗ Error saving key' :
                                    status === 'saving' ? '⟳ Saving...' :
                                        status === 'cleared' ? '✓ Key Cleared' : ''}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {/* Clear Button */}
                        <button
                            onClick={handleClear}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '500',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: 'rgb(239, 68, 68)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(239,68,68,0.2)';
                                e.target.style.borderColor = 'rgba(239,68,68,0.5)';
                                e.target.style.boxShadow = '0 0 20px rgba(239,68,68,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(239,68,68,0.1)';
                                e.target.style.borderColor = 'rgba(239,68,68,0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Clear
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '500',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgb(212, 212, 212)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.1)';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.05)';
                                e.target.style.color = 'rgb(212, 212, 212)';
                            }}
                        >
                            Cancel
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim() || status === 'saving'}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '500',
                                background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246))',
                                border: 'none',
                                color: 'white',
                                cursor: (!apiKey.trim() || status === 'saving') ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: (!apiKey.trim() || status === 'saving') ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (apiKey.trim() && status !== 'saving') {
                                    e.target.style.boxShadow = '0 0 30px rgba(34,211,238,0.5)';
                                    e.target.style.transform = 'scale(1.02)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            {status === 'saving' ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </div>
    );
};
