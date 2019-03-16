
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
    
    gotoPage (page, jwtToken) {
        chrome.runtime.sendMessage("", {
            action: "Page",
            goto: page,
            jwt: jwtToken
        });
        window.close();
    }

    getEvandUserJWTToken() {
        return new Promise(function(resolve, reject){
            chrome.cookies.get(
                {"url": "https://evand.com", "name": "jwt"},
                cookie => cookie == null ? reject('You must be a guest!') : resolve(decodeURI(cookie.value))
            );
        });
    }

    changeEvandUserJwtTokenTo(newToken) {
        const nextMonth = new Date((new Date).getFullYear(), (new Date).getMonth() + 1, 1);
        chrome.cookies.remove({
            "url": "https://evand.com",
            "name": "jwt"
        });
        chrome.cookies.set({
            "url": "https://evand.com",
            "name": "jwt",
            "value": encodeURI(newToken),
            "domain": ".evand.com",
            "expirationDate": nextMonth.getTime()
        });
    }

    refreshTab() {
        chrome.tabs.reload();
    }
}
