
window.addEventListener('load',chkLoggedIn());

function chkLoggedIn(){
  chrome.storage.local.get(['API_KEY'],async (result) => {
    await addPleaseWait();
      if(result.API_KEY===undefined){
        await removePleaseWait();
        return;
      }
    await removePleaseWait();
    await addProfilePage(result.API_KEY[0]);
  });
}

document.getElementById('sendButton').addEventListener('click', async () => {
    const inputValue = document.getElementById('inputValue').value;
    document.getElementById('inputValue').value='';
    if(inputValue==='') return;
    await addPleaseWait();
    const det = await checkValidAPI(inputValue);
    if(!det){
        await removePleaseWait(); 
        return;
    }
    await removePleaseWait();
    alert('Log in successful!!');
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if(tabs[0] && tabs[0].url && tabs[0].url.startsWith('https://maang.in'))
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateVariable', value: inputValue });
    });
    chrome.storage.local.set({'API_KEY':[inputValue]},() =>{
      console.log('Login successful!!');
    });
    await addProfilePage(inputValue);
  });

document.getElementById('inputValue').addEventListener('keydown', async (event) => {
    if(event.key==='Enter'){

        const inputValue = document.getElementById('inputValue').value;
        document.getElementById('inputValue').value='';
        if(inputValue==='') return;
        await addPleaseWait();
        const det = await checkValidAPI(inputValue);
        if(!det){
            await removePleaseWait();
            return;
        }
        await removePleaseWait();
        alert('Log in successful!!');
        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if(tabs[0] && tabs[0].url && tabs[0].url.startsWith('https://maang.in'))
          chrome.tabs.sendMessage(tabs[0].id, { action: 'updateVariable', value: inputValue });
        });
        chrome.storage.local.set({'API_KEY':[inputValue]},() =>{
          console.log('Login successful!!');
        });
        await addProfilePage(inputValue);
    }
});


async function checkValidAPI(API_KEY){
    const query = '1+1';
    
    

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
      const payload = {
        contents: [
          {
            parts: [{ text: query }]
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
        return true;
      } catch (error) {
        alert(`Error: ${error.message}`);
        return false;
      }
}

async function addPleaseWait(){
    const PleaseWait=document.createElement('div');
    const txt = document.createElement('span');
    document.getElementById('login-page').style.opacity=0;
    
    PleaseWait.style.cssText = `
        display: flex;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        font-family: 'DM Sans';
        color: #a1a1a1;
        font-size: 20px;
    `;
    PleaseWait.id='PleaseWait';
    txt.innerText='Please Wait....';
    PleaseWait.appendChild(txt);
    document.body.append(PleaseWait);
}

async function removePleaseWait(){
    const PleaseWait=document.getElementById('PleaseWait');
    if(PleaseWait){
        document.getElementById('login-page').style.opacity=1;
        PleaseWait.remove();
    }
}

async function addProfilePage(inputValue){
    const txt= document.createElement('div');
    txt.style.cssText= ` color: #a1a1a1;   
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word; width: 90%;
    justify-content: center; align-items: center;
    text-align: center;`;

    txt.id='Welcome'
    txt.innerText = `Welcome ${inputValue} :)`;
    const parent=document.getElementById('profile-page');
    parent.prepend(txt);
    parent.style.display= 'flex';
}

document.getElementById('Logout').addEventListener('click',() => {
  const parent=document.getElementById('profile-page');
  chrome.storage.local.remove('API_KEY', () => {

  });

   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if(tabs[0] && tabs[0].url && tabs[0].url.startsWith('https://maang.in')) chrome.tabs.sendMessage(tabs[0].id, { action: 'LoggedOut' });
  });
  parent.removeChild(parent.firstChild);
  parent.style.display= 'none';
});




