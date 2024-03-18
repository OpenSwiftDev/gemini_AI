import { createContext, useState, useEffect } from "react"
import runChat from "../config/gemini";
import toast from 'react-hot-toast';
import Markdown from 'markdown-to-jsx';
import ReactDOMServer from 'react-dom/server';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [history, setHistory] = useState("");

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        try {
            if (prompt !== undefined) {
                response = await runChat(prompt);
                setRecentPrompt(prompt);
            } else {
                setPrevPrompt(prev => [...prev, input]);
                setRecentPrompt(input);
                response = await runChat(input);
            }
            // let htmlResponse = ""
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