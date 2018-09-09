'use strict';

function updateEventId (event) {
    let element = document.getElementById('event-id');
    element.innerHTML = event.id; 
}

function hasActiveWebinar (event) {
    let element = document.getElementById('has-active-webinar');
    element.innerHTML = event._links.webinar == null ? 'No' : 'Yay';
}

function hasConnectApp(event) {
    let element = document.getElementById('has-connect-app');
    element.innerHTML = event.connectApp && event.connectApp.data ? 'Yesssss' : 'Na';
}

function gerEventData(uri) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            const event = JSON.parse(xhr.responseText).data;

            updateEventId(event);
            hasActiveWebinar(event);
            hasConnectApp(event);
        }
    };

    xhr.open("GET", uri, true);
    xhr.send();
}

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;

    let eventApiUri = 'https://api.evand.com';
    eventApiUri += parser.pathname + '?links=webinar&include=connectApp';

    gerEventData(eventApiUri);
});


