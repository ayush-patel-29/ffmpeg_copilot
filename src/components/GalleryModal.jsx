import React, { useState, useEffect } from 'react';
import { FaTimes, FaVideo, FaMusic, FaFolderOpen, FaExternalLinkAlt } from 'react-icons/fa';

export const GalleryModal = ({ onClose }) => {
    const [files, setFiles] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [fileDataURLs, setFileDataURLs] = useState({});

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const result = await window.electronAPI.listOutputs();
                if (result.ok) {
                    setFiles(result.files);

                    // Load data URLs for images and videos
                    const dataURLs = {};
                    for (const file of result.files) {
                        if (file.type === 'image' || file.type === 'video') {
                            const dataURLResult = await window.electronAPI.readAsDataURL(file.path);
                            if (dataURLResult.ok) {
                                dataURLs[file.path] = dataURLResult.dataURL;
                            }
                        }
                    }
                    setFileDataURLs(dataURLs);
                } else {
                    console.error("Failed to load files:", result.error);
                }
            } catch (err) {
                console.error("Error fetching files:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const filteredFiles = files.filter(file => {
        if (filter === 'all') return true;
        return file.type === filter;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                style={{
                    background: 'rgba(10,10,10,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        margin: 0
                    }}>
                        <span style={{ color: '#22d3ee', fontSize: '28px' }}>⚡</span>
                        Output Gallery
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgb(163, 163, 163)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgb(163, 163, 163)';
                        }}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    padding: '20px 32px',
                    display: 'flex',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {['all', 'image', 'video', 'audio'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: filter === tab ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
                                background: filter === tab ? 'rgba(34,211,238,0.15)' : 'transparent',
                                color: filter === tab ? '#22d3ee' : 'rgb(163, 163, 163)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: filter === tab ? '0 0 20px rgba(34,211,238,0.15)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (filter !== tab) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (filter !== tab) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'rgb(163, 163, 163)';
                                }
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.6 }}>
                                ({files.filter(f => tab === 'all' ? true : f.type === tab).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '32px'
                    }}
                    className="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/30"
                >
                    {isLoading ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: 'rgb(115, 115, 115)',
                            fontSize: '16px'
                        }}>
                            Loading files...
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FaFolderOpen size={36} style={{ color: 'rgb(115, 115, 115)' }} />
                            </div>
                            <p style={{ color: 'rgb(163, 163, 163)', fontSize: '16px', margin: 0 }}>
                                No {filter !== 'all' ? filter : ''} files found
                            </p>
                            <button
                                onClick={() => window.electronAPI.showInFolder("C:\\ffmpeg_copilot\\outputs")}
                                style={{
                                    color: '#22d3ee',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline',
                                    padding: '8px 16px'
                                }}
                            >
                                Open Output Folder
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '20px'
                        }}>
                            {filteredFiles.map((file, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(34,211,238,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        background: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {file.type === 'image' ? (
                                            fileDataURLs[file.path] ? (
                                                <img
                                                    src={fileDataURLs[file.path]}
                                                    alt={file.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ color: 'rgba(163,163,163,0.6)', fontSize: '12px' }}>Loading...</div>
                                            )
                                        ) : file.type === 'video' ? (
                                            fileDataURLs[file.path] ? (
                                                <video
                                                    src={fileDataURLs[file.path]}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    preload="metadata"
                                                    muted
                                                />
                                            ) : (
                                                <div style={{ color: 'rgba(163,163,163,0.6)', fontSize: '12px' }}>Loading...</div>
                                            )
                                        ) : file.type === 'audio' ? (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '12px',
                                                width: '100%',
                                                height: '100%'
                                            }}>
                                                <FaMusic size={48} style={{ color: 'rgba(34,197,94,0.6)' }} />
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '3px',
                                                    alignItems: 'flex-end',
                                                    height: '40px'
                                                }}>
                                                    {[12, 25, 40, 18, 35, 28, 45, 22, 38, 15, 30, 20].map((height, idx) => (
                                                        <div key={idx} style={{
                                                            width: '4px',
                                                            height: `${height}%`,
                                                            background: 'rgba(34,197,94,0.5)',
                                                            borderRadius: '2px'
                                                        }} />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Hover Actions */}
                                        <div className="group-hover:opacity-100" style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0,0,0,0.7)',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            opacity: 0,
                                            transition: 'opacity 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.electronAPI.showInFolder(file.path);
                                                }}
                                                style={{
                                                    padding: '12px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#22d3ee'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                title="Open in Folder"
                                            >
                                                <FaFolderOpen size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.electronAPI.send('open-external-url', file.path);
                                                }}
                                                style={{
                                                    padding: '12px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#22d3ee'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                title="Open File"
                                            >
                                                <FaExternalLinkAlt size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* File Info */}
                                    <div style={{ padding: '12px' }}>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'white',
                                            marginBottom: '6px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }} title={file.name}>
                                            {file.name}
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: 'rgb(115, 115, 115)',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
