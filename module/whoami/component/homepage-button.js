import { Main } from './../../../services/Main.js';

export class Config {

    constructor() {
        const main = new Main();

        this.template =  `<button v-on:click="gotoHomepage">خونه پدری</button>`;
        this.methods = this.getMethods(main);
    }

    getMethods(main) {
        return {
            gotoHomepage: async function() {
                main.gotoPage('Homepage', await main.getJWT());
            }
        };
    }
}
