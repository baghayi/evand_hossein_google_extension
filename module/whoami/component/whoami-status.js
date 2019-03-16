
export class Config {
    constructor(eventBus, tokenStorage) {
        this.eventBus = eventBus;
        this.tokenStorage = tokenStorage;
    }

    getConfig() {
        let eventBus = this.eventBus;
        let tokenStorage = this.tokenStorage;

        return {
            asyncComputed: {
                tokenChanged: tokenStorage.isLivingSomeoneElsesLife
            },
            template: `
            <p v-if="tokenChanged" style="color: red;">شما الان یکی دیگه شده اید. دست و جیغ و هورا ...
            <button>غلط کردم</button>
            </p>
        `,
            created: function() {
                eventBus.$on('whoamiTokenChanged', () => this.tokenChanged = true);
            }
        };
    }
}
