
let events = [];

export class EventFinder {

    constructor(jwt) {
        this.jwt = jwt;
    }

    bySlug(eventSlug, onSuccessCallback) {
        let uri = 'https://api.evand.com/events/' + eventSlug + '?links=webinar';
        let promise = fetch(uri, {
            headers: {
                "Authorization": this.jwt,
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
        .then(function(eventData){
            onSuccessCallback(eventData.data);
        })
        .catch(function(error){
            console.log('fuck', error);
        });

        return promise;
    }

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
