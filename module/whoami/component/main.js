import {Config as UserConfig} from './user.js';
import {Config as WhoamiStatusConfig} from './whoami-status.js';
import { TokenStorage } from './../TokenStorage.js';
import { Cookie } from './../Cookie.js';

export class Config
{
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    getConfig(jwt)
    {
        const eventBus = this.eventBus;
        const tokenStorage = new TokenStorage;
        const cookies = new Cookie();

        return {
            el: "#app",
            data: {
                someone: "",
                users: []
            },
            components: {
                'whoami-status': (new WhoamiStatusConfig(eventBus, tokenStorage, cookies)).getConfig(),
                'user': (new UserConfig(eventBus, tokenStorage, cookies)).getConfig(jwt)
            },
            methods: {
                SearchForSomeone: async function() {
                    let users = await fetch("https://api.evand.com/users?per_page=200&q="+this.someone, {
                        headers: {
                            Authorization: jwt
                        }
                    })
                        .then((r) => r.status >= 200 && r.status < 300 
                            ? Promise.resolve(r)
                            : Promise.reject(new Error(r.statusText))
                        )
                        .then(r => r.json());
                    this.users = users.data;
                },
            }
        };
    }
}
