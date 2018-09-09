'use strict';

function updateEventId(uri) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            let changeColor = document.getElementById('event-id');
            changeColor.innerHTML = JSON.parse(xhr.responseText).data.id; 
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

    updateEventId(eventApiUri);
});


