import { EventFinder } from '../services/EventFinder.js';

export function searchingEventById() {
    let eventFinderById  = document.querySelector("p#event-finder-by-id input");

    let eventHomepage  = document.getElementById("event-homepage");
    let eventPanelAccounting  = document.getElementById("event-panel-accounting");
    let foundEventName = document.getElementById("found-event-name");

    eventFinderById.addEventListener('change', function(e){
        let bulletin  = document.getElementById("event-finder-comment");
        eventHomepage.style = "display: none";
        foundEventName.style = "display: none";
        eventPanelAccounting.style = "display: none";
        bulletin.innerHTML = "Searching ...";
        bulletin.style = "display: inline;";

        const eventId = e.target.value;
        const event = (new EventFinder).byId(eventId, function(event){
            if(event == undefined) {
                bulletin.innerHTML = "Not Found!";
                return;
            }

            bulletin.style = "display: none";
            eventHomepage.style = "display: inline";
            eventHomepage.href = "https://evand.com/events/" + event.slug;

            eventPanelAccounting.style = "display: inline";
            eventPanelAccounting.href = "https://panel.evand.com/events/" + event.slug + "/accounting/deposit";

            foundEventName.style = "display: block";
            foundEventName.innerText = event.name;
        });
    });
}
