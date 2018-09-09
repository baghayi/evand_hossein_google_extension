'use strict';

function updateEventId (event) {
    let changeColor = document.getElementById('event-id');
    changeColor.innerHTML = event.id; 
}

function gerEventData(uri) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            const event = JSON.parse(xhr.responseText).data;
            updateEventId(event);
        }
    };

    xhr.open("GET", uri, true);
    xhr.send();
}

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;

    let eventApiUri = 'https://api.evand.com';
    eventApiUri += parser.pathname + '?fields=id';

    gerEventData(eventApiUri);
});


