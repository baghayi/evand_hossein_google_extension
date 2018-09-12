'use strict';

document.addEventListener('DOMContentLoaded', function(){
    chrome.storage.sync.get(['jwt'], function(result){
        run(result.jwt);
    });
});

function run (jwt) {
    if(jwt != undefined) {
        hideLoginForm();
        displayContent();
    }

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
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var parser = document.createElement('a');
        parser.href = tabs[0].url;

        let eventApiUri = 'https://api.evand.com';
        eventApiUri += parser.pathname + '?links=webinar&include=connectApp';

        gerEventData(eventApiUri);
    });

    function hideLoginForm () {
        let loginScreen = document.getElementById('login-screen');
        loginScreen.style = "display: none;";
    }

    function displayContent () {
        let contentScreen = document.getElementById('content-screen');
        contentScreen.style = "display: block;";
    }

    function logUserIn (email, password) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const jwt = xhr.getResponseHeader('Authorization');

                chrome.storage.sync.set({'jwt': jwt}, function(){
                    hideLoginForm();
                    displayContent();
                    console.log('Saved!');
                });
            }
        };

        xhr.open("POST", "https://api.evand.com/auth/login", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({
            "email" : email,
            "password": password
        }));
    }

    let loginButton = document.getElementById('login');
    loginButton.addEventListener('click', function(){
        let email = document.getElementById('login-email');
        let password = document.getElementById('login-password');

        logUserIn(email.value, password.value);
    });
}


