// Global variable
let globalVariable = '';
window.addEventListener('load', () => {
   if(!document.getElementById('Inject')){
        const scr = document.createElement('script');
        scr.src = chrome.runtime.getURL('inject.js');
        scr.id = 'Inject';
        document.head.appendChild(scr);
        console.log('Appended index.js')
   } 
});
window.addEventListener('load',chkLoggedIn());
function chkLoggedIn(){
    chrome.storage.local.get(['API_KEY'],async (result) => {
          if(result.API_KEY===undefined){
            globalVariable = '';
            return;
          }
          if(globalVariable!== result.API_KEY[0]) globalVariable=result.API_KEY[0];
      });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateVariable') {
      globalVariable = message.value;
      console.log('Global variable updated:', globalVariable);
      sendResponse({ status: 'success' });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'LoggedOut') {
      globalVariable = '';
    }
  });


const link = document.createElement('link');

// Set the attributes for the <link> element
link.rel = 'stylesheet';       // Specifies the relationship
link.type = 'text/css';        // Specifies the type of file
link.href = chrome.runtime.getURL('styles.css'); 
console.log(link.href);     // The path to your CSS file



// Append the <link> element to the <head> of the document
document.head.appendChild(link);
cb=true;
// Function to add the AI Help button
function addAIHelpButton() {
    // console.log("Hello")
    const RunButton = document.getElementsByClassName("px-sm-4")[1];
    if (RunButton && !document.getElementById("AIHD1001")) { // Check if the button already exists
        const AIHelpButton = document.createElement("button");
        AIHelpButton.id = "AIHD1001";
        AIHelpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_dark_button__r0EJI py-2 px-4";
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
           if(pl.startsWith("https://maang.in/problems/") && pl.length>"https://maang.in/problems/".length){
                // console.log("heloo");
                addAIHelpButton();   
                if(cb){
                    cb=false;
                    addchatbox();
                }
                
            }
            else{
                cb=true;            
            }
        }
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});


function addchatbox(){
    
    const modal=document.createElement('div');
    modal.className='modal';
    modal.id='modal';
    
    const header=document.createElement('div');
    header.className='header';
    
    const closebttn=document.createElement('button');
    closebttn.className='get-help-dark';
    closebttn.id='close';
    closebttn.innerHTML='<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="margin: 3px;"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>';
    header.appendChild(closebttn);
    
    const title=document.createElement('span');
    title.style.cssText='font-weight: 700; font-size: 20px;';
    title.textContent='AI Problem Solver';
    header.appendChild(title);
    
    modal.appendChild(header);
    
    const interface=document.createElement('div');
    interface.className='interface';
    interface.id='interface';
    modal.appendChild(interface);
    
    const chatbox=document.createElement('div');
    chatbox.className='chatbox';
    
    const textarea=document.createElement('textarea');
    textarea.id='customTextarea';
    textarea.placeholder='Ask your Doubt';
    chatbox.appendChild(textarea);

    const sendbutton=document.createElement('button');
    sendbutton.className='send get-help';
    sendbutton.id='send';
    sendbutton.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 511 512.32"><path fill="#fff" d="M9.72 185.88L489.19 1.53c3.64-1.76 7.96-2.08 12.03-.53 7.83 2.98 11.76 11.74 8.78 19.57L326.47 502.56h-.02c-1.33 3.49-3.94 6.5-7.57 8.25-7.54 3.63-16.6.47-20.23-7.06l-73.78-152.97 146.67-209.97-209.56 146.3L8.6 213.64a15.117 15.117 0 01-7.6-8.25c-2.98-7.79.93-16.53 8.72-19.51z"/></svg>';
    chatbox.appendChild(sendbutton);
    
    modal.appendChild(chatbox);
    document.body.prepend(modal);
    
    const overlay=document.createElement('div');
    overlay.className='overlay';
    overlay.id='overlay';
    document.body.prepend(overlay);
    
    const AIHelButton=document.getElementById('AIHD1001');
    if(AIHelButton!==null){
        console.log('fe');
        const modal=document.getElementById('modal');
        const closePopupBtn=document.getElementById('close');
        const ovr=document.getElementById('overlay');
        const txt=document.getElementById('customTextarea');
        const sendbutton=document.getElementById('send');
        const interface=document.getElementById('interface');
        
        AIHelButton.addEventListener('click',() => {
            chkLoggedIn();
            modal.style.display = 'flex';
            ovr.style.display = 'flex';
            interface.scrollTop = interface.scrollHeight;
        });
        ovr.addEventListener('click',() =>{
            modal.style.display = 'none';
            ovr.style.display = 'none';
        });
        closePopupBtn.addEventListener('click',() => {
            modal.style.display = 'none';
            ovr.style.display = 'none';
        });
        sendbutton.addEventListener('click',async () => {
            if(txt.value.trim() === ''){
                console.log("Empty");
            }
            else{
                console.log("Non Empty");
                const chat=document.createElement('div');
                chat.className = 'user-chatbox';
                chat.textContent = txt.value.trim();
                txt.value = '';
                interface.appendChild(chat);
                interface.scrollTop = interface.scrollHeight;

                const reply=document.createElement('div');
                reply.className='AI-chatbox';
                reply.innerHTML= marked.parse(await respond(API_KEY,chat,interface));
                interface.appendChild(reply);
            }
        });
        
        txt.addEventListener('keydown', async (event) => {
            const API_KEY = globalVariable;
            if (event.key === 'Enter' && !event.shiftKey){
                event.preventDefault();
                if(txt.value.trim() === ''){
                    console.log("Empty");
                }
                else if(API_KEY===''){
                    alert('Please login before interacting with the chatbot..');
                    return;
                }
                else{
                    console.log("Non Empty");
                    const chat=document.createElement('div');
                    chat.className = 'user-chatbox';
                    // const textNode = document.createTextNode(txt.value.trim());
                    chat.innerText=txt.value.trim();
                    txt.value = '';
                    interface.appendChild(chat);
                    interface.scrollTop = interface.scrollHeight;
                    
                    const reply=document.createElement('div');
                    reply.className='AI-chatbox';

                    reply.innerHTML= marked.parse(await respond(API_KEY,chat,interface));
                    interface.appendChild(reply);
                }
            }
        });
        
    }
};

async function respond(API_KEY,chat,interface){
    console.log("fa");
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [
            {
                parts: [{ text: chat.innerText}]
            }
        ]
    };
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
            const errorData = await response.json();   
            throw new Error(errorData.error.message);
        }
        
        const data = await response.json();
        console.log(data.contents?.[0]?.parts?.[0]?.text);
        const generatedText = data.candidates?.[0]?.content.parts?.[0]?.text || "No response from API.";

        return generatedText;
        

      } catch (error) {
        
        alert(`Error: ${error.message}`);
      }

}
