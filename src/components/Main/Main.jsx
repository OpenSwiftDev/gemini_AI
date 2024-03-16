import React from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
const Main = () => {
    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />

            </div>

            <div className='main-container'>
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

                <div className="main-bottom">
                    <div className='search-box'>
                        
                        <input type="text" placeholder='Enter a prompt here' />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img src={assets.send_icon} alt="" />
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
