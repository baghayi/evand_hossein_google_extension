'use strict';

chrome.storage.sync.get(['status'], function(result){
    let jwt = null;
    let currentRoute = null;
    if(result.status) {
        jwt = result.status.jwt;
        currentRoute = result.status.currentRoute;
    }

    loadProperPopup(jwt, currentRoute);
});

function loadView(view) {
    chrome.browserAction.setPopup({
        popup: view
    });
}

function loadProperPopup(jwt, page) {
    console.log(jwt);
    console.log(page);
    if(jwt == null) {
        loadView('views/login.html');
        return;
    }
    
    switch(page){
        case 'Homepage':
            loadView('views/homepage.html');
            break;

        case 'EventTags':
            loadView('views/event-tags.html');
            break;

        case 'whoami':
            loadView('module/whoami/view/index.html');
            break;
    }
}

function saveStatus(page, jwt) {
    chrome.storage.sync.set({
        status : {
            jwt : jwt,
            currentRoute: page
        }
    });
}

function savePageAsCurrentPage(page, jwt) {
    if(jwt) {
        saveStatus(page, jwt);
        loadProperPopup(jwt, page);
    }else {
        chrome.storage.sync.get(['status'], function(result){
            let jwt = null;
            if(result.status && result.status.jwt) {
                jwt = result.status.jwt;
            }

            saveStatus(page, jwt);
            loadProperPopup(jwt, page);
        });
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.action && message.action == 'Page') {

        savePageAsCurrentPage(message.goto, message.jwt);
    }
});
