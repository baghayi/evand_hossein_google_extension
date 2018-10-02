
export class Main {

    retrieveJWT(then) {
        chrome.storage.sync.get(['status'], function(result){
            then(result.status.jwt);
        });
    }

    retrieveTabUrl(jwt, then) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let parser = document.createElement('a');
            parser.href = tabs[0].url;

            then(jwt, parser);
        });
    }

    run(callWhenReady) {
        this.callWhenReady = callWhenReady;
        this.retrieveJWT(
            (jwt) => this.retrieveTabUrl(jwt, 
                (jwt, tabUrl) => callWhenReady(jwt, tabUrl)
            ));
    }
}
