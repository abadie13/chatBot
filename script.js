//declarations

const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea" );
const chatbox  = document.querySelector(".chatbox")

let userMessage;

// Load environment variables
require('dotenv').config();

// Access the API key
const API_KEY = process.env.API_KEY;
 console.log(process.env)




//Arrow function to create the chat Li for the outgoing message
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? ` <p></p>`: ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
//Arrow function to generate response
const generateResponse = (incomingChatLi) =>{
     const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
     const messageElement = incomingChatLi.querySelector("p");

     // Update message text with API response
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
    };
    //API
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error)=>{
        messageElement.textContent = "Oops! Something went wrong. Please try again.";

    }).finally(()=> chatbox.scrollTo(0, chatbox.scrollHeight) );
}


const handleChat = () =>{
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() =>{
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);

    }, 600)

}


sendChatBtn.addEventListener("click", handleChat );