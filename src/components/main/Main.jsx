import { useRef, useState } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { initial_get_response, session_get_response } from "../../api/axios.bot";

const Main = () => {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
	messageEndRef.current?.scrollIntoView(
		{
			behavior: 'smooth',
		}
	);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setShowResults(true);
    
    // Create new message
    const newMessage = {
      prompt: input,
      response: "",
      timestamp: new Date().toLocaleTimeString()
    };

    // Add to conversations immediately
    setConversations(prev => [...prev, newMessage]);

    try {
      if (!sessionId) {
        const [response, newSessionId] = await initial_get_response(input);
        setSessionId(newSessionId);
        
        // Update the last message with response
        setConversations(prev => prev.map((msg, index) => {
          if (index === prev.length - 1) {
            return { ...msg, response };
          }
          return msg;
        }));
		scrollToBottom();
      } else {
        const response = await session_get_response(input, sessionId);
        
        // Update the last message with response
        setConversations(prev => prev.map((msg, index) => {
          if (index === prev.length - 1) {
            return { ...msg, response };
          }
          return msg;
        }));
		scrollToBottom();
      }
    } catch (error) {
      console.error("Error getting response:", error);
      setConversations(prev => prev.map((msg, index) => {
        if (index === prev.length - 1) {
          return { ...msg, response: "Sorry, there was an error processing your request. Please try again." };
        }
        return msg;
      }));
    } finally {
      setLoading(false);
      setInput("");
	  scrollToBottom();
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
            {conversations.map((conv, index) => (
              <div key={index}>
                <div className="result-title">
                  <img src={assets.user} alt="" />
                  <p>{conv.prompt}</p>
                </div>
                <div className="result-data">
                  {loading && index === conversations.length - 1 ? (
                    <div className="loader">
                      <hr />
                      <hr />
                      <hr />
                    </div>
                  ) : (
                    <p dangerouslySetInnerHTML={{ __html: conv.response }}></p>
                  )}
                </div>
				<div ref={messageEndRef}></div>
              </div>
            ))}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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