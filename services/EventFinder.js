
export class EventFinder {

    byId(eventId, onSuccessCallback) {
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
}
