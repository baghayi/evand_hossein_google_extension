function loadHomepage (jwtToken) {
    chrome.runtime.sendMessage("", {
        action: "Page",
        goto: "Homepage",
        jwt: jwtToken
    });
}

function logUserIn (email, password) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
            const jwt = xhr.getResponseHeader('Authorization');
            loadHomepage(jwt);

            chrome.storage.sync.set({'jwt': jwt}, function(){
                console.log('Saved JWT!');
            });
        }
        else if (xhr.readyState == 4 && xhr.status == 422) {
            console.log(xhr);
            document.querySelector('#login-screen > p').innerHTML = 
                "<span style='color: red'>" + JSON.parse(xhr.responseText).message + "</span>";
        }
    };

    xhr.open("POST", "https://api.evand.com/auth/login", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
        "email" : email,
        "password": password
    }));
}

let loginButton = document.getElementById('login');
let password = document.getElementById('login-password');
function logUserInListener() {
    let email = document.getElementById('login-email');
    logUserIn(email.value, password.value);
}
loginButton.addEventListener('click', logUserInListener);
password.addEventListener('keypress', function(e){
    const ENTER = 13;
    let key = e.which || e.keyCode;
    if (key === ENTER) {
        logUserInListener();
    }
});
