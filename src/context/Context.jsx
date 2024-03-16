import { createContext, useState } from "react"
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 80 * index + Math.random() * 50); // randomizes the delays between 80 to 130 milliseconds
    }
    

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await runChat(prompt)
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompt(prev => [...prev, input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        let responseArray = response.split("**");
        let newRespone;
        for(let i = 0; i < responseArray.length; i++){
            if(i === 0 || i % 2 !== 1){
                newRespone += responseArray[i]
            }else {
                newRespone += "<b>" + responseArray[i] + "</b>"
            }
        }

        let newRespone2 = newRespone.split("*").join("</br>")
        let newResponeArray = newRespone2.split(" ");

        
        for (let i = 0; i < newResponeArray.length; i++) {
            const nextWord = newResponeArray[i];
            delayPara(i, nextWord + " ");
        }
        setResultData(newRespone2)
        setLoading(false)
        setInput("")
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

    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider