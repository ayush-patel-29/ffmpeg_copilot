import React, { useState, useEffect } from 'react';

export const SettingsModal = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Load existing key
        window.electronAPI.getApiKey().then(res => {
            if (res.ok && res.apiKey) {
                setApiKey(res.apiKey);
            }
        });
    }, []);

    const handleSave = async () => {
        setStatus('Saving...');
        const res = await window.electronAPI.setApiKey(apiKey);
        if (res.ok) {
            setStatus('Saved!');
            setTimeout(onClose, 500);
        } else {
            setStatus('Error saving key');
        }
    };

    const handleClear = async () => {
        await window.electronAPI.clearApiKey();
        setApiKey('');
        setStatus('Key Cleared');
        setTimeout(onClose, 500);
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'rgba(30, 30, 30, 0.9)',
                padding: '20px',
                borderRadius: '10px',
                width: '300px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0 }}>Account Settings</h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa' }}>Groq API Key</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="gsk_..."
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #444',
                            background: '#222',
                            color: 'white'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button onClick={handleClear} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Clear Key</button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} style={{ background: '#2196f3', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                    </div>
                </div>
                {status && <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '10px' }}>{status}</p>}
            </div>
        </div>
    );
};
