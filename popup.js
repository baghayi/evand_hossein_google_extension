import { searchingEventById } from './tasks/searchingEventById.js';
import { EventFinder } from './services/EventFinder.js';
import { Main } from './services/Main.js';

const main = new Main();
main.run(run);

function run (jwt, tabUrl) {
    if(jwt) {
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
        document.getElementById('total-guest-attendees').innerHTML = eventStatistics.attendees.guest.count;
    }

    function eventSlug(tabUrl) {
        let pieces = tabUrl.pathname.split("/");
        if(pieces.length >= 3 && pieces[1] === 'events') {
            return pieces[2];
        }

        return null;
    }

    const eventFinder = new EventFinder(jwt);
    eventFinder
        .bySlug(eventSlug(tabUrl))
        .then(function(event){
            updateEventId(event);
            hasActiveWebinar(event);
            hasConnectApp(event);
            isUsingShowtime(event);
        })
        .catch(function(error){
            console.log('fuck', error);
        });

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


    //getEventData(tabUrl);
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


