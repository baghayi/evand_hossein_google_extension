'use strict';

chrome.storage.sync.get(['jwt'], function(result){
    loadProperPopup(result.jwt);
});

function loadView(view) {
    chrome.browserAction.setPopup({
        popup: view
    });
}

function loadProperPopup(jwt) {
    if(jwt) {
        loadView('views/homepage.html');
    }else {
        loadView('views/login.html');
    }

}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.action && message.action == 'Page') {
        switch(message.goto){
            case 'Homepage':
                loadView('views/homepage.html');
                break;
        }

        chrome.runtime.reload();
    }
});
