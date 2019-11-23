import { searchingEventById } from './searchingEventById.js';
import { EventFinder } from '../services/EventFinder.js';
import { EventStatistics } from '../services/EventStatistics.js';
import { Main } from '../services/Main.js';
import * as Questions from './AnswerQuestion/Questions.js';
import { Route } from '../services/Route.js';

const main = new Main();
main.run(run);

function eventSlug(tabUrl) {
    let pieces = tabUrl.pathname.split("/");
    if(pieces.length >= 3 && pieces[1] === 'events') {
        return pieces[2];
    }

    return null;
}

function getEventId(eventSlug, jwt) {
    return fetch('https://api.evand.com/events/'+eventSlug+'?fields=id', {
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
        .then(function(response){
            return response.data.id;
        })
        .catch(function(error){
            console.log(error)
        });
}

function gotoPage(page, jwtToken) {
    chrome.runtime.sendMessage("", {
        action: "Page",
        goto: page,
        jwt: jwtToken
    });
    window.close();
}


function run (jwt, tabUrl) {

    const eventSlugValue = eventSlug(tabUrl);
    if(null === eventSlugValue) {
        document.querySelector('#question-answers').style = "display: none;";
    }else {
        (new EventFinder(jwt)).bySlug(eventSlugValue, function(event){
            let questions = new Questions.Event();
            questions.answer(event);
        });

        (new EventStatistics(jwt)).bySlug(eventSlugValue, function(data){
            let questions = new Questions.EventStatistics();
            questions.answer(data);
        });
    }


    searchingEventById(jwt);

    document.getElementById('event-tags').addEventListener('click', function(e){
        gotoPage('EventTags', jwt);
    });

    document.getElementById('who-am-i').addEventListener('click', function(e){
        gotoPage('whoami', jwt);
    });

    document.getElementById('convert-event-to-seating').addEventListener('click', async function(e){
        const eventId = await getEventId(eventSlugValue, jwt);
        console.log(eventId);
        const uri = 'https://api.evand.com/seating/halls';
        fetch(uri, {
            method: 'POST',
            headers: {
                "Authorization": jwt,
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                name: "سالن",
                meta: "{}",
                event_id: eventId,
                enabled: false
            })
        })
            .then(function(response){
                if(response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response);
                }else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then(function(response){
                let route = new Route();
                route.refreshTab();
            })
            .catch(function(error){
                console.log(error);
                alert('sth failed!');
            });
    });

}


