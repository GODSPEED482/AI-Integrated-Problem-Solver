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
    }
}

// Use a MutationObserver to detect route changes or DOM updates
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
            let pl = location.href;
            if (
                pl.startsWith("https://maang.in/problems/") &&
                pl.length > "https://maang.in/problems/".length
            ) {
                addAIHelpButton();
                if (cb) {
                    cb = false;
                    addchatbox();
                } else {
                }
            } else if(!cb){
                removechatbox();
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

    const reply = document.createElement("div");
    reply.className = "AI-chatbox";
    let AI_reply = await respond(API_KEY, chatHistory);
    reply.innerHTML = marked.parse(AI_reply);

    newobject = { role: "model", parts: [{ text: AI_reply }] };
    chatHistory.push(newobject);
    updateChatHistory(chatHistory, getCurrentProblemID());
    interface.appendChild(reply);
}

async function addchatbox() {
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
    `<span style= "color: rgb(22,29,41); height: 100%; width: 100%" >
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

    const AIHelButton = document.getElementById("AIHD1001");
    if (AIHelButton !== null) {
        console.log("fe");
        const modal = document.getElementById("modal");
        const closePopupBtn = document.getElementById("close");
        const ovr = document.getElementById("overlay");
        const txt = document.getElementById("customTextarea");
        const sendbutton = document.getElementById("send");
        const interface = document.getElementById("interface");

        AIHelButton.addEventListener("click", async () => {
            setaria_checked(modal, 'false');
            interface.innerHTML = "";
            await loadChatHistoryByID(getCurrentProblemID(), 1);
            chkLoggedIn();
            modal.style.display = "flex";
            ovr.style.display = "flex";
            interface.scrollTop = interface.scrollHeight;
        });
        ovr.addEventListener("click", () => {
            modal.style.display = "none";
            ovr.style.display = "none";
        });
        closePopupBtn.addEventListener("click", () => {
            modal.style.display = "none";
            ovr.style.display = "none";
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
    }
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
        console.log(data.contents?.[0]?.parts?.[0]?.text);
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
        chrome.storage.sync.get(["chatHistory"], (result) => {
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

    let arc = interface.getAttribute('aria-checked')
    newchat.setAttribute('aria-checked' , arc)

    interface.appendChild(newchat);
}

function intializeChat(CurrentArray) {
    if (CurrentArray.length === 0) {
    }
}

function updateChatHistory(CurrentArray, ID) {
    chrome.storage.sync.get(["chatHistory"], (result) => {
        let chatHist = result.chatHistory || new Map();
        chatHist[ID] = CurrentArray;

        chrome.storage.sync.set({ chatHistory: chatHist }, () => { });
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