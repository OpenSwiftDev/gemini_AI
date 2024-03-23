import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { BraveSearch } from "@langchain/community/tools/brave_search";
import OpenAI from 'openai';
import cheerio from 'cheerio';
const GROQ_API_KEY = "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"
const BRAVE_SEARCH_API_KEY = "BSACUaOUFOvBHRlsGqzW8Vx_VxjfFtX"


export const ChatWithGroqInLangchain = async (message, returnSources = true,
    returnFollowUpQuestions = true,
    embedSourcesInLLMResponse = false,
    textChunkSize = 800,
    textChunkOverlap = 200,
    numberOfSimilarityResults = 2,
    numberOfPagesToScan = 4) => {

    // Initialize Groq and embeddings
    let openai = new OpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: GROQ_API_KEY,
    });
    const embeddings = new OpenAIEmbeddings();

    // Define rephrase function
    async function rephraseInput(inputString) {
        console.log(`Rephrasing input`);
        const groqResponse = await openai.chat.completions.create({
            model: "mixtral-8x7b-32768",
            messages: [
                { role: "system", content: "You are a rephraser and always respond with a rephrased version of the input that is given to a search engine API. Always be succint and use the same words as the input. ONLY RETURN THE REPHRASED VERSION OF THE INPUT." },
                { role: "user", content: inputString },
            ],
        });
        console.log(`Rephrased input and got answer from Groq`);
        return groqResponse.choices[0].message.content;
    }

    async function searchEngineForSources(message) {
        console.log(`Initializing Search Engine Process`);
        // Initialize BraveSearch
        const loader = new BraveSearch({ apiKey: BRAVE_SEARCH_API_KEY });
        // Rephrase the message
        const rephrasedMessage = await rephraseInput(message);
        console.log(`Rephrased message and got documents from BraveSearch`);
        // Get documents from BraveSearch 
        const docs = await loader.call(rephrasedMessage, { count: numberOfPagesToScan });

        // Normalize data
        const normalizedData = normalizeData(docs);
        // Process and vectorize the content
        return await Promise.all(normalizedData.map(fetchAndProcess));
    }

    function normalizeData(docs) {
        return JSON.parse(docs)
            .filter((doc) => doc.title && doc.link && !doc.link.includes("brave.com"))
            .slice(0, numberOfPagesToScan)
            .map(({ title, link }) => ({ title, link }));
    }

    const fetchPageContent = async (link) => {
        console.log(`Fetching page content for ${link}`);
        try {
            const response = await fetch(link);
            if (!response.ok) {
                return "";
            }
            const text = await response.text();
            return extractMainContent(text, link);
        } catch (error) {
            console.error(`Error fetching page content for ${link}:`, error);
            return '';
        }
    };

    function extractMainContent(html, link) {
        console.log(`Extracting main content from HTML for ${link}`);
        const $ = html.length ? cheerio.load(html) : null
        $("script, style, head, nav, footer, iframe, img").remove();
        return $("body").text().replace(/\s+/g, " ").trim();
    }

    // Process and vectorize the content
    let vectorCount = 0;
    const fetchAndProcess = async (item) => {
        const htmlContent = await fetchPageContent(item.link);
        if (htmlContent && htmlContent.length < 250) return null;
        const splitText = await new RecursiveCharacterTextSplitter({ chunkSize: textChunkSize, chunkOverlap: textChunkOverlap }).splitText(htmlContent);
        const vectorStore = await MemoryVectorStore.fromTexts(splitText, { link: item.link, title: item.title }, embeddings);
        console.log(vectorStore);
        vectorCount++;
        console.log(`Processed ${vectorCount} sources for ${item.link}`);
        return await vectorStore.similaritySearch(message, numberOfSimilarityResults);
    };

    const sources = await searchEngineForSources(message, textChunkSize, textChunkOverlap);
    const sourcesParsed = sources.map(group =>
        group.map(doc => {
            const title = doc.metadata.title;
            const link = doc.metadata.link;
            return { title, link };
        })
            .filter((doc, index, self) => self.findIndex(d => d.link === doc.link) === index)
    );

    console.log(` RAG complete sources and preparing response content`);
    // MAIN GROQ CHAT COMPLETION
    const chatCompletion = await openai.chat.completions.create({
        messages:
            [{
                role: "system", content: `
        - Here is my query "${message}", respond back with an answer that is as long as possible. If you can't find any relevant results, respond with "No relevant results found." 
        - ${embedSourcesInLLMResponse ? "Return the sources used in the response with iterable numbered markdown style annotations." : ""}" : ""}`
            },
            { role: "user", content: ` - Here are the top results from a similarity search: ${JSON.stringify(sources)}. ` },
            ], stream: true, model: "mixtral-8x7b-32768"
    });
    console.log(`Sent content to Groq for chat completion.`);

    let responseTotal = "";
    console.log(`Streaming response from Groq... \n`);
    for await (const chunk of chatCompletion) {
        if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== "stop") {
            process.stdout.write(chunk.choices[0].delta.content);
            responseTotal += chunk.choices[0].delta.content;
        } else {
            let responseObj = {};
            returnSources ? responseObj.sources = sourcesParsed : null;
            responseObj.answer = responseTotal;
            returnFollowUpQuestions ? responseObj.followUpQuestions = await generateFollowUpQuestions(responseTotal) : null;
            console.log(`\n\n13. Generated follow-up questions:  ${JSON.stringify(responseObj.followUpQuestions)}`);
            res.status(200).json(responseObj);
            console.log(`\n\n14. Response sent to client:  ${JSON.stringify(responseObj)}`);
        }
    }

    async function generateFollowUpQuestions(responseText) {
        const groqResponse = await openai.chat.completions.create({
            model: "mixtral-8x7b-32768",
            messages: [
                { role: "system", content: "You are a question generator. Generate 3 follow-up questions based on the provided text. Return the questions in an array format." },
                {
                    role: "user",
                    content: `Generate 3 follow-up questions based on the following text:\n\n${responseText}\n\nReturn the questions in the following format: ["Question 1", "Question 2", "Question 3"]`
                }
            ],
        });
        return JSON.parse(groqResponse.choices[0].message.content);
    }


}
ChatWithGroqInLangchain("What is the capital of France?")