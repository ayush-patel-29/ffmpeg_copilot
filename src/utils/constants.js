const OUTPUT_DIR = "C:/ffmpeg_copilot/outputs/";

const MODELS = {
    free: [
        { id: 'llama-3.3-70b-versatile', name: 'Llama 3 70B (Free)' },
    ],
    paid: [
        { id: 'llama3-70b-8192', name: 'Llama 3 70B (High Performance)' },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Balanced)' },
    ]
};

module.exports = {
    OUTPUT_DIR,
    MODELS
};