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

    function isUsingShowtime (event) {
        let element = document.getElementById('is-using-showtime');
        element.innerHTML = event.is_using_showtime ? 'Sure it does!' : 'No man';
    }

    function updateAttendeeRelatedInfo (eventStatistics) {
        document.getElementById('total-attendees').innerHTML = eventStatistics.attendees.all.count;
        document.getElementById('total-tickets').innerHTML = eventStatistics.tickets.all.count;
    }

    function getEventData(uri) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const event = JSON.parse(xhr.responseText).data;

                updateEventId(event);
                hasActiveWebinar(event);
                hasConnectApp(event);
                isUsingShowtime(event);
            }
        };

        xhr.open("GET", uri, true);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }

    function getEventStatistics (uri) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const eventStatistics = JSON.parse(xhr.responseText);

                updateAttendeeRelatedInfo(eventStatistics);
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

        getEventData(eventApiUri);
        getEventStatistics('https://api.evand.com' + parser.pathname + '/statistics');
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

    function fetchEventDataById (eventId, onSuccessCallback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const event = JSON.parse(xhr.responseText).data;
                onSuccessCallback(event);
            }
        };

        xhr.open("GET", "https://api.evand.com/events/id_" + eventId, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    let loginButton = document.getElementById('login');
    loginButton.addEventListener('click', function(){
        let email = document.getElementById('login-email');
        let password = document.getElementById('login-password');

        logUserIn(email.value, password.value);
    });

    (function () {
        let eventFinderById  = document.querySelector("p#event-finder-by-id input");
        let foundEventLink  = document.querySelector("p#event-finder-by-id a");
        eventFinderById.addEventListener('change', function(e){
            let bulletin  = document.querySelector("p#event-finder-by-id span");
            foundEventLink.style = "display: none";
            bulletin.innerHTML = "Searching ...";
            bulletin.style = "display: inline;";

            const eventId = e.target.value;
            const event = fetchEventDataById(eventId, function(event){
                if(event == undefined) {
                    bulletin.innerHTML = "Not Found!";
                    return;
                }

                bulletin.style = "display: none";
                foundEventLink.style = "display: inline";
                foundEventLink.innerHTML = event.name;
                foundEventLink.href = "https://evand.com/events/" + event.slug;
            });
        });
    })();

}


