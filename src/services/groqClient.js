const Groq = require("groq-sdk");
const fs = require("fs");
const { OUTPUT_DIR } = require("../utils/constants.js");
const { getApiKey } = require("../auth");

const generateFFmpegCommand = async ({ prompt, model, file }) => {
    // main retrieves API key from keytar (never sends it to renderer)
    const apiKey = await getApiKey();
    if (!apiKey) return { ok: false, error: 'API key not set' };

    // 1. Initialize the SDK with the API key
    const groq = new Groq({
        apiKey: apiKey
    });

    // 2. Define the system and user messages
    const systemInstruction = `
        You are an FFmpeg expert. Your task is to understand the user's request and
        produce the correct FFmpeg command. Return a JSON object in the exact form:

        {
          "exe":"ffmpeg",
          "args":[]
        }
        Return only valid JSON — no explanations, no text outside the JSON.
    `.trim();

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const filename = OUTPUT_DIR + file.split("\\").pop().split("/").pop().split(".")[0] + Date.now();
    const userPrompt = `
        User request: "${prompt}"
        Input file src: "${file}" 
        Output filename placeholder: "${filename}" #override filename if user explicitly requests it in the prompt
    `.trim();

    try {
        // 3. Use the correct SDK method: groq.chat.completions.create()
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemInstruction,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            model: model,
            // 4. Instruct the model to return JSON
            response_format: { type: "json_object" },
        });

        // 5. The model's response is in completion.choices[0].message.content
        const jsonString = completion.choices[0].message.content;

        // 6. Parse the JSON string
        let json;
        try {
            json = JSON.parse(jsonString);
        } catch (e) {
            // Handle case where the model returns non-valid JSON despite instruction
            return { ok: false, error: "Model returned invalid JSON: " + jsonString };
        }

        // optionally validate json shape here
        return { ok: true, data: json, outputFilename: filename };

    } catch (err) {
        // Groq SDK throws an error on API failure (e.g., 4xx or 5xx)
        // You can inspect err.status and err.message
        return { ok: false, error: err.message || String(err) };
    }
};

module.exports = { generateFFmpegCommand };