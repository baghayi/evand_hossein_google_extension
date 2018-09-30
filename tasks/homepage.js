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

function updateQuestionAnswers(answers){
    let questionAnswers = document.getElementById('question-answers');
    document.querySelector('#question-answers > .loading-message').style = "display: none;";

    questionAnswers.innerHTML = questionAnswers.innerHTML + answers;
}

function getEventStatistics (jwt, tabUrl) {
    const uri = 'https://api.evand.com' + tabUrl.pathname + '/statistics';
    let promise = fetch(uri, {
        headers: {
            "Authorization": jwt,
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    })
        .then(function(response){
            if(response.status >= 200 && response.status < 300) {
                return Promise.resolve(response);
            }else {
                return Promise.reject(new Error(response.statusText));
            }
        })
        .then(function(response){
            return response.json();
        })
        .then(function(eventStatistics){
            let questions = new Questions.EventStatistics();
            updateQuestionAnswers(questions.answer(eventStatistics));
        });
}

function run (jwt, tabUrl) {

    if(null === eventSlug(tabUrl)) {
        document.querySelector('#question-answers > .loading-message').style = "display: none;";
    }else {
        const eventFinder = new EventFinder(jwt);
        eventFinder
            .bySlug(eventSlug(tabUrl))
            .then(function(event){
                let questions = new Questions.Event();
                updateQuestionAnswers(questions.answer(event));
            })
        .catch(function(error){
            console.log('fuck', error);
        });

        getEventStatistics(jwt, tabUrl);
    }


    searchingEventById();

}


