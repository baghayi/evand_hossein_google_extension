export class Route
{
    isEvandPage() {
        return new Promise(function(resolve, reject){
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                let parser = document.createElement('a');
                parser.href = tabs[0].url;
                if (parser.hostname === 'evand.com')
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }

    openEvandHomepage() {
        chrome.tabs.create({ url: 'https://evand.com' });
    }
}
