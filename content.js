// Global variable
let globalVariable = "";






window.addEventListener("load", () => {
    if (!document.getElementById("Inject")) {
        const scr = document.createElement("script");
        scr.src = chrome.runtime.getURL("inject.js");
        scr.id = "Inject";
        document.head.appendChild(scr);
        console.log("Appended index.js");
    }
});
window.addEventListener("load", chkLoggedIn);

function chkLoggedIn() {
    chrome.storage.local.get(["API_KEY"], async (result) => {
        if (result.API_KEY === undefined) {
            globalVariable = "";
            return;
        }
        if (globalVariable !== result.API_KEY[0])
            globalVariable = result.API_KEY[0];
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateVariable") {
        globalVariable = message.value;
        console.log("Global variable updated:", globalVariable);
        sendResponse({ status: "success" });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "LoggedOut") {
        globalVariable = "";
    }
});

const highlight = document.createElement('link');
highlight.rel = 'stylesheet';
highlight.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css";
document.head.appendChild(highlight)

const hlscript = document.createElement('script');
hlscript.id = "hlscrpt";
hlscript.src = chrome.runtime.getURL('highlight.min.js');
document.head.appendChild(hlscript);

const link = document.createElement("link");

// Set the attributes for the <link> element
link.rel = "stylesheet"; // Specifies the relationship
link.type = "text/css"; // Specifies the type of file
link.href = chrome.runtime.getURL("styles.css");
console.log(link.href); // The path to your CSS file

// Append the <link> element to the <head> of the document
document.head.appendChild(link);
cb = true;
// Function to add the AI Help button
function addAIHelpButton() {
    const RunButton = document.getElementsByClassName("px-sm-4")[1];
    if (RunButton && !document.getElementById("AIHD1001")) {
        // Check if the button already exists
        const AIHelpButton = document.createElement("button");
        AIHelpButton.id = "AIHD1001";
        AIHelpButton.className =
            "ant-btn css-19gw05y ant-btn-default Button_gradient_dark_button__r0EJI py-2 px-4";
        AIHelpButton.style.height = "41.1354px";
        AIHelpButton.textContent = "AI Help";

        RunButton.insertAdjacentElement("afterend", AIHelpButton);
        AIHelpButton.addEventListener("click", async () => {
            const modal = document.getElementById("modal");
            const ovr = document.getElementById("overlay");
            const interface = document.getElementById("interface");
            interface.innerHTML = "";
            let theme = document.getElementsByClassName('ant-switch d-flex mt-1 css-19gw05y')[0];
            setaria_checked(modal, theme.getAttribute('aria-checked'));
            addDeleteChatButton();
            await loadChatHistoryByID(getCurrentProblemID(), 1);
            chkLoggedIn();
            modal.style.display = "flex";
            ovr.style.display = "flex";
            interface.scrollTop = interface.scrollHeight;
        });
    }
}

let gl = '';
let pl = '';

// Use a MutationObserver to detect route changes or DOM updates
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
            gl = pl;
            pl = location.href;
            if (
                pl.startsWith("https://maang.in/problems/") &&
                pl.length > "https://maang.in/problems/".length
            ) {
                if (!document.getElementById('modal')) {
                    console.log('chatbox added');
                    
                    cb = false;
                    addchatbox();
                } 
                console.log('mutation observed')
                addAIHelpButton();
            } else if( document.getElementById('modal')){
                removechatbox();
                removeButton();
                cb = true;
            }
        }
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

function removeButton(){
    const el = document.getElementById('AIHD1001');
    if(el) el.remove();
}

async function pushchat(txt, interface) {
    const API_KEY = globalVariable; // Use globalVariable here
    if (!API_KEY) {
        alert("Please login before interacting with the chatbot.");
        return;
    }
    
    console.log("Non-Empty");
    const chat = document.createElement("div");
    chat.className = "user-chatbox";
    chat.innerText = txt.value.trim();
    txt.value = "";
    interface.appendChild(chat);
    interface.scrollTop = interface.scrollHeight;
    
    let chatHistory = await loadChatHistoryByID(getCurrentProblemID(), 0);
    let newobject = { role: "user", parts: [{ text: chat.innerText }] };
    chatHistory.push(newobject);
    let AI_reply = await respond(API_KEY, chatHistory);
    
    
    newobject = { role: "model", parts: [{ text: AI_reply }] };
    console.log('hihihihihih');
    chatHistory.push(newobject);
    
    updateChatHistory(chatHistory, getCurrentProblemID());
    appendChat(newobject);
}

function addchatbox() {
    console.log('addchatbox inside');
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";
    
    const header = document.createElement("div");
    header.className = "header";
    
    const closebttn = document.createElement("button");
    closebttn.className = "get-help-dark";
    closebttn.id = "close";
    closebttn.innerHTML =
    '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="margin: 3px;"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>';
    header.appendChild(closebttn);
    
    const title = document.createElement("span");
    title.style.cssText = "font-weight: 700; font-size: 20px;";
    title.textContent = "AI Problem Solver";
    header.appendChild(title);
    
    modal.appendChild(header);
    
    const interface = document.createElement("div");
    interface.className = "interface";
    interface.id = "interface";
    modal.appendChild(interface);
    
    const chatbox = document.createElement("div");
    chatbox.className = "chatbox";
    
    const textarea = document.createElement("textarea");
    textarea.id = "customTextarea";
    textarea.placeholder = "Ask your Doubt";
    chatbox.appendChild(textarea);
    
    const sendbutton = document.createElement("button");
    sendbutton.className = "send get-help-dark";
    sendbutton.id = "send";
    sendbutton.innerHTML  = 
    `<span style= " height: 100%; width: 100%" >
    <svg xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <title>send-solid</title>
    <g id="Layer_2" data-name="Layer 2">
    <g id="invisible_box" data-name="invisible box">
    <rect width="48" height="48" fill="none"/>
    </g>
    <g id="icons_Q2" data-name="icons Q2">
    <path fill="currentColor" d="M44.9,23.2l-38-18L6,5A2,2,0,0,0,4,7L9.3,23H24a2.1,2.1,0,0,1,2,2,2,2,0,0,1-2,2H9.3L4,43a2,2,0,0,0,2,2l.9-.2,38-18A2,2,0,0,0,44.9,23.2Z"/>
    </g>
    </g>
    </svg>
    </span>`
    chatbox.appendChild(sendbutton);
    
    modal.appendChild(chatbox);
    document.body.prepend(modal);
    
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.id = "overlay";
    document.body.prepend(overlay);
    
   

        
    const closePopupBtn = document.getElementById("close");
    const txt = document.getElementById("customTextarea");
        overlay.addEventListener("click", () => {
            modal.style.display = "none";
            ovr.style.display = "none";
        });
        closePopupBtn.addEventListener("click", () => {
            modal.style.display = "none";
            overlay.style.display = "none";
        });
        sendbutton.addEventListener("click", async () => {
            if (txt.value.trim() === "") {
                console.log("Empty");
            } else {
                await pushchat(txt, interface);
            }
        });
        
        txt.addEventListener("keydown", async (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (txt.value.trim() === "") {
                    console.log("Empty");
                } else {
                    await pushchat(txt, interface);
                }
            }
        });
        console.log('added Event Listener');
}

async function respond(API_KEY, chatHistory) {
    console.log("fa");
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: chatHistory,
    };
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
        
        const data = await response.json();
        const generatedText =
        data.candidates?.[0]?.content.parts?.[0]?.text || "No response from API.";
        
        return generatedText;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function getCurrentProblemID() {
    let p = window.location.href;
    let end = p.indexOf("?");
    let start = 0;
    let noquerystring = p.substring(start, end);
    end = noquerystring.length;
    start = noquerystring.lastIndexOf("-") + 1;
    let ID = noquerystring.substring(start, end);
    console.log(`current problemID is ${ID}`);
    return ID;
}

function loadChatHistoryByID(ID, det = 0) {
    return new Promise((resolve) => {
        chrome.storage.local.get(["chatHistory"], (result) => {
            const chatHistory = result.chatHistory || {};
            const CurrentArray = chatHistory[ID] || [];
            
            if (det) {
                CurrentArray.forEach((chat) => {
                    appendChat(chat);
                });
            }
            
            console.log(`Loaded chat history for ID: ${ID}`);
            resolve(CurrentArray); // Return the array via Promise
        });
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str; // Assigning textContent escapes HTML
    return div.innerHTML;
}

function appendChat(chat) {
    const interface = document.getElementById("interface");
    const newchat = document.createElement("div");

    if (chat.role === "user"){
        newchat.className = "user-chatbox";
        newchat.innerHTML = chat.parts[0].text;
    } 
    else{
        newchat.className = "AI-chatbox";
        newchat.innerHTML = marked.parse(chat.parts[0].text);
    }

    let arc = interface.getAttribute('aria-checked');
    newchat.setAttribute('aria-checked' , arc)
    console.log('appended', arc);

    interface.appendChild(newchat);
    hljs.highlightAll(newchat);
}

function intializeChat(CurrentArray) {
    if (CurrentArray.length === 0) {
    }
}

function updateChatHistory(CurrentArray, ID) {
    chrome.storage.local.get(["chatHistory"], (result) => {
        let chatHist = result.chatHistory || new Map();
        chatHist[ID] = CurrentArray;
        console.log(`chat ${ID} updated`);
        

        chrome.storage.local.set({ chatHistory: chatHist }, () => { });
    });
}

function removechatbox(){
    document.getElementById('modal').remove();
    document.getElementById('overlay').remove();
}

function setaria_checked(div, str) {
  div.setAttribute("aria-checked", str);
  div.childNodes.forEach((child) => {
    if(child.nodeType !== Node.TEXT_NODE){
        setaria_checked(child , str);
    }
  });
}

function addDeleteChatButton(){
    const interface = document.getElementById('interface');
    if(document.getElementById('DelChat') === null){

        const DCbttn = document.createElement('div')
        DCbttn.id = 'DelChat'
        DCbttn.style.cssText = 
        `position: fixed; bottom:min(150px,20%); right: min(100px,5%);` 
        DCbttn.innerHTML = `<button type="button" class="ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ask_doubt_button__FjwXJ gap-1 py-2 px-3 overflow-hidden" style="height: fit-content;"><svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M800 256h-576a30.08 30.08 0 0 0-32 32 30.08 30.08 0 0 0 32 32H256v576a64 64 0 0 0 64 64h384a64 64 0 0 0 64-64V320h32a30.08 30.08 0 0 0 32-32 30.08 30.08 0 0 0-32-32zM448 799.36a33.28 33.28 0 0 1-64 0v-384a33.28 33.28 0 0 1 64 0z m192 0a33.28 33.28 0 0 1-64 0v-384a33.28 33.28 0 0 1 64 0zM800 128H640v-32a32.64 32.64 0 0 0-32-32h-192a32 32 0 0 0-32 32V128H224a30.08 30.08 0 0 0-32 32 30.08 30.08 0 0 0 32 32h576a30.08 30.08 0 0 0 32-32 30.08 30.08 0 0 0-32-32z"  /></svg><span class="coding_ask_doubt_gradient_text__FX_hZ">Delete Chat</span></button>`;
        interface.appendChild(DCbttn);
        console.log('Appended delete chat button', interface);
        DCbttn.addEventListener('click',DeleteChat);
        DCbttn.addEventListener('click',() =>{
            while(interface.firstChild.nextElementSibling !== null){
                interface.firstChild.nextElementSibling.remove();
            }
        });
    }
}

async function DeleteChat(){
    let ID = getCurrentProblemID();
    chrome.storage.local.get(["chatHistory"], (result) => {
        let chatHist = result.chatHistory || new Map();
        chatHist[ID] = [];
        console.log(`chat ${ID} updated`);
        

        chrome.storage.local.set({ chatHistory: chatHist }, () => { });
    })


}

