import React, { useContext, useState, useEffect } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import toast from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/upper_first_letters'
import { cards } from '../../utils/recommend_question'
const Main = () => {

    const [model, setModel] = useState("gemini")

    const sendPrompt = async () => {

        if (input.trim() === '') {
            toast.error('Please enter a prompt', { duration: 3000 });
            return;
        }
        setInput('');
        toast.success('Prompt sent', { duration: 3000 });
        await onSent(input, model);

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendPrompt();
        }
    };

    const { onSent, history, recentPrompt, showResult, loading, resultData, input, setInput } = useContext(Context)
    const [tempMessages, setTempMessages] = useState([]);

    useEffect(() => {
        if (recentPrompt !== "" && history !== "") {
            setTempMessages(prevMessages => {
                const existingMessageIndex = prevMessages.findIndex(item => item.prompt === recentPrompt);
                const updatedMessages = [...prevMessages]; 
    
                if (existingMessageIndex === -1) {
                    updatedMessages.unshift({ prompt: recentPrompt, response: history });
                } else {
                    updatedMessages[existingMessageIndex].response = history;
                }
    
                return updatedMessages;
            });
        }
    }, [recentPrompt, history]);
    

    const handleCopy = (htmlText) => {
        const plainText = htmlText.replace(/<[^>]+>/g, '');

        navigator.clipboard.writeText(plainText);

        toast.success('Copied to clipboard', { duration: 3000 });
    };

    const changeModel = (e) => {
        const model = e.target.value
        setModel(model)
        toast.success(`Changed to ${capitalizeFirstLetter(model)} Model`, { duration: 3000 });
    }

    const handleCardClick = async (prompt) => {
        toast.success('Prompt sent', { duration: 3000 });
        await onSent(prompt, model);
    }

    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.dev} alt="" />

            </div>

            <div className='main-container'>

                {!showResult ? <>
                    <div className='greet'>
                        <p><span>Hello, Dev.</span> </p>
                        <p>How can I help you today?</p>

                    </div>
                    <div className='cards'>
                        {cards.map((card, index) => (
                            <div onClick={() => handleCardClick(card.title)} key={index} className='card'>
                                <img src={card.icon} alt="" />
                                <p>{card.title}</p>
                            </div>
                        ))}
                    </div>
                </> : <div className='result'>
                    <div className='result-title'>
                        <img src={assets.dev} alt="" />
                        <p>{recentPrompt} </p>
                    </div>
                    <div className='result-data'>
                        <img src={assets.gemini_icon} alt="" />
                        {loading ? <div className='loader'>
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                        </div> :
                            <p dangerouslySetInnerHTML={{ __html: resultData }}></p>}

                    </div>

                    <div className='history'>
                        <p>History Chat</p>
                        {tempMessages.map((item, index) => (
                            <div key={index}>
                                <div className='result-title'>
                                    <img src={assets.dev} alt="" />
                                    <p> {item.prompt} </p>
                                </div>
                                <div className='result-data'>
                                    <img src={assets.gemini_icon} alt="" />
                                    <p dangerouslySetInnerHTML={{ __html: item.response }}></p>

                                    <img onClick={() => handleCopy(item.response)} className='copy' src={assets.copy} alt="" />

                                </div>

                            </div>
                        ))}

                    </div>
                </div>}


                <div className="main-bottom">
                    <select className='select-model' value={model} onChange={changeModel}>
                        <option value="gemini">Gemini</option>
                        <option value="groq">Groq</option>
                    </select>

                    <div className='search-box'>


                        <input onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img onClick={sendPrompt} src={assets.send_icon} alt="" />
                        </div>
                    </div>

                    <p className="bottom-info">
                        Genimi may display inaccurate information. For educational purposes only. Consult a professional for advice.
                    </p>
                </div>

            </div>



        </div>
    )
}

export default Main
