import Groq from "groq-sdk";
let GROQ_API_KEY = "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"

const groq = new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function chatGroq(prompt) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "you are a helpful assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama2-70b-4096"
    });
    let response = completion.choices[0]?.message?.content || "";
    return response;
}
