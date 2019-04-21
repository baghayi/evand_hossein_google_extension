import { Main } from '../../services/Main.js';
import {Config as MainConfig} from './component/main.js';
import {Route} from '../../services/Route.js';

let eventBus = new Vue({});

const main = new Main();
main.run(function(jwt, tabUrl){
    Vue.use(AsyncComputed);
    var app = new Vue((new MainConfig(eventBus, main)).getConfig(jwt));

    eventBus.$on('EvandPageRefreshRequired', refreshEvandPageListener);
});

const refreshEvandPageListener = async function() {
    const route = new Route();

    if (await route.isEvandPage())
        route.refreshTab();
    else
        route.openEvandHomepage();
}
