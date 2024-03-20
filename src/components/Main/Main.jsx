import React, { useContext, useState, useEffect } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import toast from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/upper_first_letters'
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
            // Tạo một bản sao của lịch sử
            const newtempMessages = [...tempMessages];

            // Tìm xem prompt đã tồn tại trong lịch sử chưa
            const existingMessageIndex = newtempMessages.findIndex(item => item.prompt === recentPrompt);

            // Nếu prompt chưa tồn tại trong lịch sử, thêm tin nhắn mới vào đầu mảng
            if (existingMessageIndex === -1) {
                newtempMessages.unshift({ prompt: recentPrompt, response: history });
            } else { // Nếu prompt đã tồn tại, cập nhật lại response
                newtempMessages[existingMessageIndex].response = history;
            }

            const maxHistoryLength = 10;
            if (newtempMessages.length > maxHistoryLength) {
                newtempMessages.splice(maxHistoryLength); 
            }

            setTempMessages(newtempMessages);
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
        toast.success(`Change ${capitalizeFirstLetter(model)} Model`, { duration: 3000 });
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
                        <div className='card'>
                            <p>Suggest beatiful places to see on an upcoming road trip</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>

                        <div className='card'>
                            <p>How can I use AI to automate tasks in my software development process?</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>

                        <div className='card'>
                            <p>What are some best practices for training a machine learning model?</p>
                            <img src={assets.message_icon} alt="" />
                        </div>

                        <div className='card'>
                            <p>
                                What is the difference between supervised and unsupervised learning in AI?
                            </p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                    </div>
                </> : <div className='result'>
                    <div className='result-title'>
                        <img src={assets.dev} alt="" />
                        <p> {recentPrompt} </p>
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
