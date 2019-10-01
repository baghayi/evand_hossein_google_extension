import { EventFinder } from '../services/EventFinder.js';
import { Route } from '../services/Route.js';

export function searchingEventById(jwt) {
    let eventFinderById  = document.querySelector("p#event-finder-by-id input");

    eventFinderById.addEventListener('change', function(e){
        let bulletin  = document.getElementById("event-finder-comment");
        bulletin.innerHTML = "Searching ...";
        bulletin.style = "display: inline;";

        const eventId = e.target.value;
        const event = (new EventFinder(jwt)).byId(eventId, function(event){
            if(event == undefined) {
                bulletin.innerHTML = "Not Found!";
                return;
            }
            bulletin.style = "display: none";
            (new Route).openWebsite("https://evand.com/events/" + event.slug);
        });
    });
}
