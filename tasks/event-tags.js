import { Main } from '../services/Main.js';

function eventSlug(tabUrl) {
    let pieces = tabUrl.pathname.split("/");
    if(pieces.length >= 3 && pieces[1] === 'events') {
        return pieces[2];
    }

    return null;
}

let currentTags = [];

function listEventTags(slug, jwt) {
    fetch('https://api.evand.com/events/' + slug + '/tags?per_page=50', {
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
        .then(function(response){
            let tags = document.getElementById('fucking-tags')
            tags.innerHTML = '';
            currentTags = [];

            response.data.map(function(tag){
                currentTags.push(tag.name);
                let removeTag = document.createElement('button');
                removeTag.innerText = "X";
                removeTag.ondblclick = function(){
                    const tagId = this.parentNode.getAttribute('data-tag-id');
                    console.log(tagId);

                    // send request to delete tag
                };
                removeTag.onclick = function(){
                    let help = document.getElementById('how-to-remove-tag');
                    help.style.display = "inline";
                };

                let li = document.createElement('li');
                li.append(removeTag);
                li.append(" " + tag.name);
                li.setAttribute('data-tag-id', tag.id);
                tags.append(li);
            });
        }).catch(function(error){
            console.log('Holy SHIT', error);
        });
}

function createNewTag(newTagName, slug, jwt) {
    let tags = currentTags;
    tags.push(newTagName);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 < 400) {
            listEventTags(slug, jwt);
        }else if (this.readyState == XMLHttpRequest.DONE && this.status >= 400){
            console.log('fucking-error', this);
        }
    };

    xhr.open("POST", "https://api.evand.com/events/" + slug + "/tags", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", jwt);
    xhr.send(JSON.stringify({
        names: tags
    }));
    return;
}

const main = new Main();
main.run(function(jwt, tabUrl){

    const eventSlyggy = eventSlug(tabUrl);
    if(eventSlyggy != null && jwt != null) {
        listEventTags(eventSlyggy, jwt);

        document.getElementById('new-tag-please').addEventListener('keypress', function(e){
            const ENTER = 13;
            let key = e.which || e.keyCode;
            if (key !== ENTER) {
                return;
            }

            createNewTag(this.value, eventSlyggy, jwt);
            this.value = '';
        });
    }


    document.getElementById('homepage').addEventListener('click', function(){
        main.gotoPage('Homepage', jwt);
    });

});



