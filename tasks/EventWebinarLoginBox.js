'use strict';

function updateWebinarBox(tabId) {
  let js = `
      let webinarBox = document.querySelector('div.event-location-webinar').parentNode.parentNode;
  webinarBox.innerHTML = "Hello Darling <br /> Under a heavy consturction";
  `;
      
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        //tabs[0].id,
        tabId,
        {code: js})
  });
};

chrome.tabs.onActivated.addListener(function(activeInfo){
    const tabId = activeInfo.tabId;
    updateWebinarBox(tabId);
});
