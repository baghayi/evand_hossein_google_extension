import { searchingEventById } from './tasks/searchingEventById.js';
import { EventFinder } from './services/EventFinder.js';
import { Main } from './services/Main.js';
import * as Questions from './tasks/AnswerQuestion/Questions.js';

const main = new Main();
main.run(run);


function run (jwt, tabUrl) {
    if(jwt) {
        hideLoginForm();
        displayContent();
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
            let questions = new Questions.Event();
            document.getElementById('question-answers').innerHTML += questions.answer(event);
        })
        .catch(function(error){
            console.log('fuck', error);
        });

    function getEventStatistics (tabUri) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                const eventStatistics = JSON.parse(xhr.responseText);

                let questions = new Questions.EventStatistics();
                let answers = questions.answer(eventStatistics);
                let questionAnswers = document.getElementById('question-answers');
                questionAnswers.innerHTML = questionAnswers.innerHTML + answers;
            }
        };

        let uri = 'https://api.evand.com' + tabUri.pathname + '/statistics';
        xhr.open("GET", uri, true);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }

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


