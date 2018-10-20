'use strict';

function updateWebinarBox(tabId) {
  let js = `
      (function(event){
          const template = \`
              <style>
              input#ticket-identifier {
                  padding: 5px;
                  margin-left: 5px;
                  width: 50px;
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
              <input type="text" placeholder="کد بلیت" id="ticket-identifier">
              <input type="button" value="ورود" id="goto-verification-step">
              </div>

              <p id="webinar-login-as-organizer"><a>ورود به عنوان برگزار کننده</a></p>
              </div>
              \`;

              const EVAND_API = 'https://api.evand.com';

              function displayVerificationItems(shadowRoot, verificationUri) {
                  const html = \`
                      <input type="text" placeholder="کد تاییدیه" id="verification-code">
                      <input type="button" value="ورود به وبینار" id="jump-into-webinar">
                      \`;

                  const inputs = shadowRoot.getElementById('inputs');
                  inputs.innerHTML = html;

                  shadowRoot.getElementById('jump-into-webinar').addEventListener('click', function(){
                      const verificationCode = shadowRoot.getElementById('verification-code').value;
                      
                      verifiPseudoToken(verificationCode, verificationUri);
                  });
              }

              function verifiPseudoToken(verificationCode, verificationUri) {
                  var xhr = new XMLHttpRequest();
                  xhr.onreadystatechange = function(){
                      if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 < 400) {
                          const data = JSON.parse(xhr.responseText).data;
                          console.log(data);
                          // request webinar login
                      }

                      // handle when verification code is wrong
                  };

                  xhr.open("POST", EVAND_API + verificationUri, true);
                  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  xhr.send(JSON.stringify({
                      'verification_code': verificationCode
                  }));
              };

              function requestIdentifierToken(shadowRoot, identifier) {
                  var xhr = new XMLHttpRequest();
                  xhr.onreadystatechange = function(){
                      if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 < 400) {
                          const data = JSON.parse(xhr.responseText).data;
                          displayVerificationItems(shadowRoot, data._links.verification);
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
              shadowRoot.innerHTML = template;

              shadowRoot.querySelector('p#webinar-login-as-organizer > a').addEventListener('click', function(e){
                  console.log('login as organizer');
              });

              shadowRoot.getElementById('goto-verification-step').addEventListener('click', function(e){
                  const identifier = shadowRoot.getElementById('ticket-identifier');
                  console.log('login as attendee');
                  
                  requestIdentifierToken(shadowRoot, identifier.value);
              });
          }

      })();
  `;
      
  chrome.tabs.executeScript(tabId, {code: js});
};

function run(tabId, status) {
    if(status != 'complete') {
        return;
    }


    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let parser = document.createElement('a');
        parser.href = tabs[0].url;

        if(parser.hostname == 'evand.com') {
            updateWebinarBox(tabId);
        }

    });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    console.log('OnUpdated');
    run(tabId, tab.status);
});

chrome.tabs.onActivated.addListener(function(info){
    console.log('OnActivated');
    run(info.tabId, 'complete');
});
