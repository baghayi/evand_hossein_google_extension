import { Main } from '../../services/Main.js';
import { TokenStorage } from './TokenStorage.js';
import { Cookie } from './Cookie.js';
import {Config as UserConfig} from './component/user.js';
import {Config as WhoamiStatusConfig} from './component/whoami-status.js';
import {Config as MainConfig} from './component/main.js';

const tokenStorage = new TokenStorage;
const cookies = new Cookie();
let eventBus = new Vue({});

const main = new Main();
main.run(function(jwt, tabUrl){

    Vue.use(AsyncComputed);
    Vue.component('whoami-status', (new WhoamiStatusConfig(eventBus, tokenStorage, cookies, main)).getConfig());
    Vue.component('user', (new UserConfig(eventBus, tokenStorage)).getConfig(main, jwt));
    var app = new Vue((new MainConfig).getConfig(jwt));


    document.getElementById('homepage').addEventListener('click', function(){
        main.gotoPage('Homepage', jwt);
    });
});



