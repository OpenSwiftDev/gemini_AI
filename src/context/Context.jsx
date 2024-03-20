import { createContext, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import Markdown from 'markdown-to-jsx';
import ReactDOMServer from 'react-dom/server';
import chatGemini from "../config/gemini";
import {chatGroq} from "../config/groq.js";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [history, setHistory] = useState("");

    const onSent = async (prompt, model) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(prompt);
        let response;
        try {
            if (prompt !== undefined) {
                if(model === "gemini"){
                    response = await chatGemini(prompt);
                }else if(model === "groq"){
                    response = await chatGroq(prompt)
                }
                         
            } else {
                setPrevPrompt(prev => [...prev, input]);
                setRecentPrompt(input);
                if(model === "gemini"){
                    response = await chatGemini(input);
                }else if(model === "groq"){
                    response = await chatGroq(input);
                }
            }
            const htmlResponse = ReactDOMServer.renderToString(<Markdown>{response}</Markdown>);
            
            setHistory(htmlResponse);

            const words = htmlResponse.split(' ');

            let typedText = '';

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                setTimeout(() => {

                    typedText += word + ' ';
                    setResultData(typedText);
                }, 80 * i);
            }

            setLoading(false);
            setInput("");
        } catch (error) {
            toast.error('Yêu cầu của bạn vi phạm chính sách của chúng tôi!', { duration: 5000 });
            setLoading(false);
            setInput("");
        }
    }


    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        history,
        setHistory

    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider