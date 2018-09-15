import { searchingEventById } from './tasks/searchingEventById.js';

document.addEventListener('DOMContentLoaded', function(){
    chrome.storage.sync.get(['jwt'], function(result){
        document.dispatchEvent(new CustomEvent("RetrievedJWT", {
            detail: result.jwt
        }));
    });

    document.addEventListener('RetrievedJWT', function(e) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var parser = document.createElement('a');
            parser.href = tabs[0].url;

            document.dispatchEvent(new CustomEvent("RunAPP", {
                detail: {
                    jwt: e.detail,
                    tabUrl: parser
                }
            }));
        });
    });

    document.addEventListener('RunAPP', function(e) {
        run(e.detail.jwt, e.detail.tabUrl);
    });

});

function run (jwt, tabUrl) {
    if(jwt) {
        hideLoginForm();
        displayContent();
    }

    function updateEventId (e) {
        const event = e.detail;
        let element = document.getElementById('event-id');
        element.innerHTML = event.id; 
    }

    function hasActiveWebinar (e) {
        const event = e.detail;
        let element = document.getElementById('has-active-webinar');
        element.innerHTML = event._links.webinar == null ? 'No' : 'Yay';
    }

    function hasConnectApp(e) {
        const event = e.detail;
        let element = document.getElementById('has-connect-app');
        element.innerHTML = event.connectApp && event.connectApp.data ? 'Yesssss' : 'Na';
    }

    function isUsingShowtime (e) {
        const event = e.detail;
        let element = document.getElementById('is-using-showtime');
        element.innerHTML = event.is_using_showtime ? 'Sure it does!' : 'No man';
    }

    function updateAttendeeRelatedInfo (eventStatistics) {
        document.getElementById('total-attendees').innerHTML = eventStatistics.attendees.all.count;
        document.getElementById('total-tickets').innerHTML = eventStatistics.tickets.all.count;
        document.getElementById('total-guest-attendees').innerHTML = eventStatistics.attendees.guest.count;
    }

    function getEventData(tabUrl) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                let e = new CustomEvent("ReceivedEventData", {
                    detail: JSON.parse(xhr.responseText).data
                });
                document.dispatchEvent(e);
            }
        };

        let uri = 'https://api.evand.com' + tabUrl.pathname + '?links=webinar&include=connectApp';
        xhr.open("GET", uri, true);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }

    document.addEventListener('ReceivedEventData', updateEventId);
    document.addEventListener('ReceivedEventData', hasActiveWebinar);
    document.addEventListener('ReceivedEventData', hasConnectApp);
    document.addEventListener('ReceivedEventData', isUsingShowtime);

    function getEventStatistics (tabUri) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const eventStatistics = JSON.parse(xhr.responseText);
                updateAttendeeRelatedInfo(eventStatistics);
            }
        };

        let uri = 'https://api.evand.com' + tabUri.pathname + '/statistics';
        xhr.open("GET", uri, true);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }

    /*
     *function eventSlug() {
     *    tabUrl(function(url){
     *        console.log(url);
     *    });
     *}
     */

    getEventData(tabUrl);
    getEventStatistics(tabUrl);

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

    searchingEventById();
}


