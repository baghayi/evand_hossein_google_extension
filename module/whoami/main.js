import { Main } from '../../services/Main.js';
import {Config as MainConfig} from './component/main.js';

let eventBus = new Vue({});

const main = new Main();
main.run(function(jwt, tabUrl){
    Vue.use(AsyncComputed);
    var app = new Vue((new MainConfig(eventBus, main)).getConfig(jwt));

    eventBus.$on('EvandPageRefreshRequired', refreshEvandPageListener);
});

const refreshEvandPageListener = function() {
    main.refreshTab();
}
