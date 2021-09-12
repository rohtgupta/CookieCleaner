let input = document.getElementById("input");
let message = document.getElementById("message");
let del_btn = document.getElementById("del");


(async function(){
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab?.url){
        try{
            let url = new URL(tab.url);
            input.value = url.hostname;
        }catch{
            input.value = "url invalid Reload page!";
        }
        
    }
    input.focus();
})();

function clearMessage(){
    message.innerText ="";
    message.hidden = true;
}

function setMessage(s){
    message.innerText = s;
    message.hidden = false;
}

function strToUrl(str){
    try{

        return new URL(str);
    }catch{
        try{
            return new URL("http://" + str);
        }catch{
            return null;
        }
    }
}

async function deleteDomainCookies(host){

    try{
        let cookies = await chrome.cookies.getAll({domain:host});

        for (const ck in cookies){
            const cookie = {
                url: (cookies[ck].secure ? 'https://':'http://')+cookies[ck].domain+cookies[ck].path,
                name: cookies[ck].name,
                storeId: cookies[ck].storeId
            };
            
            console.log(await chrome.cookies.remove(cookie));
        }

    }catch(error){
        return `Error: ${error.message}`;
    }

    return "Done";
}

del_btn.addEventListener('click', handleRequest);

async function handleRequest(e){
    e.preventDefault();
    clearMessage();

    let url = strToUrl(input.value);

    if(!url){
        setMessage("Invalid URL!");
    }

    let s = await deleteDomainCookies(url.hostname);

    setMessage(s);
}