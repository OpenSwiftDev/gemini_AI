import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, input, setInput } = useContext(Context)

    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />

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
                        <img src={assets.user_icon} alt="" />
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
                </div>}



                <div className="main-bottom">
                    <div className='search-box'>

                        <input onChange={(e) => setInput(e.target.value)} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img onClick={() => onSent()} src={assets.send_icon} alt="" />
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
