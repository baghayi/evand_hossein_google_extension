import { searchingEventById } from './searchingEventById.js';
import { EventFinder } from '../services/EventFinder.js';
import { Main } from '../services/Main.js';
import * as Questions from './AnswerQuestion/Questions.js';

const main = new Main();
main.run(run);

function eventSlug(tabUrl) {
    let pieces = tabUrl.pathname.split("/");
    if(pieces.length >= 3 && pieces[1] === 'events') {
        return pieces[2];
    }

    return null;
}

function getEventStatistics (jwt, tabUrl) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){

        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
            const eventStatistics = JSON.parse(xhr.responseText);

            let questions = new Questions.EventStatistics();
            let answers = questions.answer(eventStatistics);
            let questionAnswers = document.getElementById('question-answers');
            questionAnswers.innerHTML = questionAnswers.innerHTML + answers;
        }
    };

    let uri = 'https://api.evand.com' + tabUrl.pathname + '/statistics';
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Authorization", jwt);
    xhr.send();
}

function displayContent (jwt, tabUrl) {

}


function run (jwt, tabUrl) {

    if(tabUrl != null) {
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

        getEventStatistics(jwt, tabUrl);
    }

    searchingEventById();

}


