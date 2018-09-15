
function fetchEventDataById (eventId, onSuccessCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            const event = JSON.parse(xhr.responseText).data;
            onSuccessCallback(event);
        }
    };

    xhr.open("GET", "https://api.evand.com/events/id_" + eventId, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
}

export function searchingEventById() {
    let eventFinderById  = document.querySelector("p#event-finder-by-id input");
    let foundEventLink  = document.querySelector("p#event-finder-by-id a");
    eventFinderById.addEventListener('change', function(e){
        let bulletin  = document.querySelector("p#event-finder-by-id span");
        foundEventLink.style = "display: none";
        bulletin.innerHTML = "Searching ...";
        bulletin.style = "display: inline;";

        const eventId = e.target.value;
        const event = fetchEventDataById(eventId, function(event){
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
