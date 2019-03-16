
export class Config {

    constructor(eventBus, tokenStorage) {
        this.eventBus = eventBus;
        this.tokenStorage = tokenStorage;
    }

    getConfig(main, jwt) {
        let eventBus = this.eventBus;
        let tokenStorage = this.tokenStorage;

        return {
            props: ['user'],
            template: `
        <p>
        <img title="بزن کلیک قشنگه رو" style="cursor: pointer;" :src="user.avatar && user.avatar.original ? user.avatar.original : 'https://www.gravatar.com/avatar/' + user.email_md5" alt="" width="30px" height="30px" v-on:click="BecomeSelectedUser"/>
        {{ user.first_name }} {{user.last_name}}
        <br />
        آی در کاربر: {{user.id}}
        </p>
        `,
            methods: {
                BecomeSelectedUser: async function(e) {
                    // request for selected user's jwt
                    let token = await fetch('https://api.evand.com/users/'+ this.user.id + '/sessions', {
                        headers: {
                            Authorization: jwt
                        },
                        method: 'POST'
                    })
                        .then(r => r.status == 201 ? Promise.resolve(r) : Promise.reject(new Error(r.statusText)))
                        .then(r => r.json());

                    tokenStorage.saveCurrentUserToken(main);
                    main.changeEvandUserJwtTokenTo(token.token_type + ' ' + token.access_token);
                    console.log(this.eventBus);
                    eventBus.$emit('whoamiTokenChanged');

                    // @todo only refresh if user has evand.com open
                    // @todo open evand.com when user is on a different page
                    main.refreshTab();
                }
            }
        };
    }
}
