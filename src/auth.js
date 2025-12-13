import keytar from "keytar";

const SERVICE = "ffmpeg_copilot";
const ACCOUNT = "groq_api_key";

export async function setApiKey(apiKey){
    if (!apiKey) throw new error("No apiKey provided!");
    await keytar.setPassword(SERVICE,ACCOUNT,apiKey);
    return true;
}

export async function getApiKey(){
    const k = await keytar.getPassword(SERVICE,ACCOUNT);
    return k;
}

export async function clearApiKey(){
    const ok  = await keytar.deletePassword(SERVICE,ACCOUNT);
    return ok;
}