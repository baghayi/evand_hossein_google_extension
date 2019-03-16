
export class Cookie {

    useToken(token) {
        const nextMonth = new Date((new Date).getFullYear(), (new Date).getMonth() + 1, 1);
        chrome.cookies.remove({
            "url": "https://evand.com",
            "name": "jwt"
        });
        chrome.cookies.set({
            "url": "https://evand.com",
            "name": "jwt",
            "value": encodeURI(token),
            "domain": ".evand.com",
            "expirationDate": nextMonth.getTime()
        });
    }

    getTokenInUse() {
        return new Promise(function(resolve, reject){
            chrome.cookies.get(
                {"url": "https://evand.com", "name": "jwt"},
                cookie => cookie == null ? reject('You must be a guest!') : resolve(decodeURI(cookie.value))
            );
        });
    }

}
