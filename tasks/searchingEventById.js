import { EventFinder } from '../services/EventFinder.js';

export function searchingEventById() {
    let eventFinderById  = document.querySelector("p#event-finder-by-id input");
    let foundEventLink  = document.querySelector("p#event-finder-by-id a");
    eventFinderById.addEventListener('change', function(e){
        let bulletin  = document.querySelector("p#event-finder-by-id span");
        foundEventLink.style = "display: none";
        bulletin.innerHTML = "Searching ...";
        bulletin.style = "display: inline;";

        const eventId = e.target.value;
        const event = (new EventFinder).byId(eventId, function(event){
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
}
