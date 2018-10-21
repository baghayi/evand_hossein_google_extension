'use strict';

function updateWebinarBox(tabId) {
    fetch(chrome.runtime.getURL('tasks/EventWebinarLoginBox/InjectableLogic.js'))
        .then(r => Promise.resolve(r))
        .then(r => r.text())
        .then(js => chrome.tabs.executeScript(tabId, {code: js}));
};

function run(tabId, status) {
    if(status != 'complete') {
        return;
    }


    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let parser = document.createElement('a');
        parser.href = tabs[0].url;

        if(parser.hostname == 'evand.com') {
            updateWebinarBox(tabId);
        }

    });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){

    console.log('OnUpdated');
    run(tabId, tab.status);
});

chrome.tabs.onActivated.addListener(function(info){
    console.log('OnActivated');
    run(info.tabId, 'complete');
});

