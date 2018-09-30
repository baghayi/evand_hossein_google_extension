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
            let answers = questions.answer(eventStatistics);
            let questionAnswers = document.getElementById('question-answers');
            questionAnswers.innerHTML = questionAnswers.innerHTML + answers;
        });
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


