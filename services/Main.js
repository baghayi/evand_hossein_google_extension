
export class Main {

    //# refactor to use getJWT instead
    retrieveJWT(then) {
        chrome.storage.sync.get(['status'], function(result){
            then(result.status.jwt);
        });
    }

    getJWT() {
        return new Promise(function(resolve, reject){
            chrome.storage.sync.get(['status'], result => result.status.jwt ? resolve(result.status.jwt) : resolve(null));
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
    
    gotoPage (page, jwtToken) {
        chrome.runtime.sendMessage("", {
            action: "Page",
            goto: page,
            jwt: jwtToken
        });
        window.close();
    }

    refreshTab() {
        chrome.tabs.reload();
    }

}
