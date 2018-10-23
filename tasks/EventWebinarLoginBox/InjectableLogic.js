const ticket = 'xyz123';
function getTemplate(orderedTickets) {
    const template = `
        <style>
        input#ticket-identifier {
            padding: 5px;
                     margin-left: 5px;
                     width: 80px;
        }
    input#goto-verification-step {
        padding: 5px;
    }
    p#webinar-login-as-organizer {
        direction: rtl; text-align: center;
    }
    p#webinar-login-as-organizer > a {
        font-size: .7em;
        font-weight: bold;
        cursor: pointer;
    }
    div.webinar  h3 {
        text-align: center;
    }
    div#inputs {
        text-align: center;
    }
    </style>
        <div class="webinar">
        <h3>ورودیه وبینار</h3>
        <div id="inputs">
        <input list="event-ordered-tickets" type="text" placeholder="کد بلیت" id="ticket-identifier">
        <datalist id="event-ordered-tickets">
        ${orderedTickets}
    <option value="${ticket}">
        </datalist>
        <input type="button" value="ورود" id="goto-verification-step">
        </div>

        <p id="webinar-login-as-organizer"><a>ورود به عنوان برگزار کننده</a></p>
        </div>
        `;

    return template;
}

function getJwt() {
    const cookies = document.cookie.split('; ').map(x => x.split('=');
    let jwt = null;
    cookies.forEach(x => x[0] == 'jwt' ? jwt = decodeURIComponent(x[1]) : '')
    return jwt;
}

function orderedTickets(eventId) {
    fetch()
}

(function(event){

    const EVAND_API = 'https://api.evand.com';

    function displayVerificationItems(shadowRoot, verificationUri, ticket) {
        const html = `
            <input type="text" placeholder="کد تاییدیه" id="verification-code">
            <input type="button" value="ورود به وبینار" id="jump-into-webinar">
            `;

        const inputs = shadowRoot.getElementById('inputs');
        inputs.innerHTML = html;

        shadowRoot.getElementById('jump-into-webinar').addEventListener('click', function(){
            const verificationCode = shadowRoot.getElementById('verification-code').value;

            verifyPseudoToken(verificationCode, verificationUri, ticket);
        });
    }

    function verifyPseudoToken(verificationCode, verificationUri, ticket) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 < 400) {
                const data = JSON.parse(xhr.responseText).data;
                const identifierToken = data.token;
                // request webinar login
                requestWebinarLoginURL(null, identifierToken, ticket, null);
            }

            // handle when verification code is wrong
        };

        xhr.open("POST", EVAND_API + verificationUri, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({
            'verification_code': verificationCode
        }));
    };

    function requestWebinarLoginURL(jwt, identifierToken, ticket, shadowRoot) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(this.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(xhr.responseText).data;
                window.location = data.url;
            }
            else if(this.status == 403 && jwt != null) {
                requestIdentifierToken(shadowRoot, ticket);
            }

            // handle errors
        };

        xhr.open("POST", EVAND_API + '/webinars/login_url', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Identifier-Token", identifierToken);
        xhr.setRequestHeader("Authorization", jwt);

        xhr.send(JSON.stringify({
            'attendee_id': ticket
        }));
    }

    function requestIdentifierToken(shadowRoot, identifier) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 < 400) {
                const data = JSON.parse(xhr.responseText).data;
                displayVerificationItems(shadowRoot, data._links.verification, identifier);
            }
        };

        xhr.open("POST", EVAND_API + "/identifiers/tokens", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({
            'identifier': identifier,
            'identifier_type': 'ticket'
        }));
    }

    let webinarBox = document.querySelector('div.event-location-webinar').parentNode.parentNode;
    if(webinarBox) {
        let shadowRoot = webinarBox.attachShadow({mode: "open"});
        shadowRoot.innerHTML = template(orderedTickets(14685));

        shadowRoot.querySelector('p#webinar-login-as-organizer > a').addEventListener('click', function(e){
            console.log('login as organizer');
        });

        shadowRoot.getElementById('goto-verification-step').addEventListener('click', function(e){
            const identifier = shadowRoot.getElementById('ticket-identifier');
            console.log('login as attendee');

            // if jwt is available, send a request with JWT and ticket, if faced any access issues then fallback to identifier token
            const jwt = getJwt();
                if(jwt != null) {
                    requestWebinarLoginURL(jwt, null, identifier.value, shadowRoot);
                }else {
                    requestIdentifierToken(shadowRoot, identifier.value);
                }
        });
    }

})();
