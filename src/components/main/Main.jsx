import { useState } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { initial_get_response, session_get_response } from '../../api/axios.bot';

const Main = () => {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [sessionId, setSessionId] = useState(null);


  const handleSend = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setShowResults(true);
    setRecentPrompt(input);

    try {
        if (!sessionId) {
            // Initial response
            const [response, newSessionId] = await initial_get_response(input);
            if (response && newSessionId) {
                setResultData(response);
                setSessionId(newSessionId);
                console.log("Session established:", newSessionId); // Debug log
            } else {
                throw new Error("Invalid response format from server");
            }
        } else {
            // Session response
            const response = await session_get_response(input, sessionId);
            if (response) {
                setResultData(response);
            } else {
                throw new Error("Invalid response format from server");
            }
        }
    } catch (error) {
        console.error("Error getting response:", error);
        setResultData("Sorry, there was an error processing your request. Please try again.");
    } finally {
        setLoading(false);
        setInput("");
    }
  };

  const handleCardClick = (promptText) => {
    setInput(promptText);
  };

  const predefinedPrompts = [
    {
      text: "Suggest Some Place To Visit In Australia.",
      icon: assets.compass_icon
    },
    {
      text: "Tell me about a certain location to visit during winter.",
      icon: assets.message_icon
    },
    {
      text: "I want to explore less crowded beaches in Australia.",
      icon: assets.bulb_icon
    }
  ];

  return (
    <div className="main">
      <div className="nav">
        <p>Destiny</p>
        <img src={assets.user} alt="" />
      </div>
      
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hello , Traveller </span>
              </p>
              <p>How Can i Help You Today?</p>
            </div>
            <div className="cards">
              {predefinedPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="card"
                  onClick={() => handleCardClick(prompt.text)}
                >
                  <p>{prompt.text}</p>
                  <img src={prompt.icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
            />
            <div>
              <img
                src={assets.send_icon}
                alt=""
                onClick={handleSend}
              />
            </div>
          </div>
          <div className="bottom-info"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;