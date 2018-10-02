function gotoPage (page, jwtToken) {
    chrome.runtime.sendMessage("", {
        action: "Page",
        goto: page,
        jwt: jwtToken
    });
    window.close();
}

document.getElementById('homepage').addEventListener('click', function(){
    gotoPage('Homepage', null);
});
