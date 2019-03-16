
export class Config {
    constructor(eventBus, tokenStorage, cookies, main) {
        this.eventBus = eventBus;
        this.tokenStorage = tokenStorage;
        this.cookies = cookies;
        this.main = main;
    }

    getConfig() {
        let eventBus = this.eventBus;
        let tokenStorage = this.tokenStorage;
        let cookies = this.cookies;
        let main = this.main;

        return {
            asyncComputed: {
                tokenChanged: tokenStorage.isLivingSomeoneElsesLife
            },
            template: `
            <p v-if="tokenChanged" style="color: red;">شما الان یکی دیگه شده اید. دست و جیغ و هورا ...
            <button v-on:click="useMyOriginalToken">غلط کردم</button>
            </p>
        `,
            created: function() {
                eventBus.$on('whoamiTokenChanged', () => this.tokenChanged = tokenStorage.isLivingSomeoneElsesLife);
            },
            methods: {
                useMyOriginalToken: async function(){
                    const originalToken = await tokenStorage.getSavedUserToken();
                    cookies.useToken(originalToken);
                    tokenStorage.clearStoredToken();
                    this.tokenChanged = false;
                    main.refreshTab();
                }
            }
        };
    }
}
