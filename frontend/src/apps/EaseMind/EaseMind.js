import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EaseMind.css';
import ePersonalDetailsImage from './images/e_personal_details.png';
import anxietyTestImage from './images/anxiety_test.png';
import reportImage from './images/report.png';
import dailyQuestionnaireImage from './images/daily_q.png';
import chatBoxImage from './images/chat_box.png';
import PopUp from './PopUp';
import ChatBox from './ChatBox';

function EaseMind() {
  const [showPopUp, setShowPopUp] = useState(() => {
    // Check if user has agreed to the terms and conditions
    const hasAgreed = localStorage.getItem('hasAgreedToPopUp');
    return !hasAgreed;
  });

  const [showChatBox, setShowChatBox] = useState(false);

  const handlePopUpClose = () => {
    setShowPopUp(false);
    localStorage.setItem('hasAgreedToPopUp', 'true');
  };

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  return (
    <div className="easeMindFullPage">
      <h1 className="easeMindHeader">Feeling anxious? We are here to help!</h1>
      <div className="easeMindFeatures">
        <Link to="/EaseMind_personal_details" className="easeMindFeatureItem">
          <img src={ePersonalDetailsImage} alt="Personal Details" />
          <span>Edit My Details</span>
        </Link>
        <Link to="/EaseMind_testpage" className="easeMindFeatureItem">
          <img src={anxietyTestImage} alt="Anxiety Tests" />
          <span>Check My Anxiety Levels</span>
        </Link>
        <Link to="/EaseMind_report" className="easeMindFeatureItem">
          <img src={reportImage} alt="Report" />
          <span>Check My Report</span>
        </Link>
        <Link to="/EaseMind_dailyQ" className="easeMindFeatureItem">
          <img src={dailyQuestionnaireImage} alt="Daily Questionnaire" />
          <span>Complete Daily Questionnaire</span>
        </Link>
        {!showChatBox && (
          <button type="button" className="easeMindchatboxbutton" onClick={toggleChatBox}>
            <img src={chatBoxImage} alt="Chat Box" />
            <span>Chat with us!</span>
            {/* {showChatBox ? 'Hide Chat' : 'Chat Box'} */}
          </button>
        )}
      </div>
      {showChatBox && <ChatBox />}
      {showPopUp && <PopUp onClose={handlePopUpClose} />}
    </div>
  );
}

export default EaseMind;
// https://www.freepik.com/icon/chat-bubble_8224141#fromView=keyword&page=1&position=4&uuid=465504c4-7b9f-4996-8e1a-ebc323fad9fa
