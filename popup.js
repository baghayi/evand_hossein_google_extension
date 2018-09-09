'use strict';

function updateEventId (event) {
    let element = document.getElementById('event-id');
    element.innerHTML = event.id; 
}

function hasActiveWebinar (event) {
    let element = document.getElementById('has-active-webinar');
    element.innerHTML = event._links.webinar == null ? 'No' : 'Yay';
}

function gerEventData(uri) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            const event = JSON.parse(xhr.responseText).data;
            updateEventId(event);
            hasActiveWebinar(event);
        }
    };

    xhr.open("GET", uri, true);
    xhr.send();
}

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;

    let eventApiUri = 'https://api.evand.com';
    eventApiUri += parser.pathname + '?links=webinar';

    gerEventData(eventApiUri);
});


