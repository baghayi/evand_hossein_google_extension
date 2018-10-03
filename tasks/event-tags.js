import { Main } from '../services/Main.js';

const main = new Main();
main.run(function(jwt, tabUrl){

    document.getElementById('homepage').addEventListener('click', function(){
        main.gotoPage('Homepage', jwt);
    });
});



