'use strict';

function fetchTotalUnreadUserMessages (jwt) {
    return fetch('https://api.evand.com/users/me?fields=messages', {
        headers: {
            "Authorization": jwt,
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
    .then(function(user){
        return user.data.messages.unread.count;
    });
}

setInterval(function(){
    chrome.storage.sync.get(['status'], function(result){
        const jwt = result.status.jwt;
        if(jwt) {
            fetchTotalUnreadUserMessages(jwt)
                .then(function(totalUnreadMessages){
                    chrome.browserAction.setBadgeText({
                        text: totalUnreadMessages.toString()
                    });
                });
        }
    });
}, 5000);

chrome.tabs.onActivated.addListener(function(activeInfo){

});
