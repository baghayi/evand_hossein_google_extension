export class EventStatistics {

    constructor(jwt) {
        this.jwt = jwt;
    }

    bySlug(eventSlug, onSuccessCallback) {
        const uri = 'https://api.evand.com/events/' + eventSlug + '/statistics';
        fetch(uri, {
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
            .then(function(eventStatistics){
                onSuccessCallback(eventStatistics);
            })
            .catch(function(error){
                console.log('fuck', error);
            });
    }

}
