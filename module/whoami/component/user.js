
export class Config {

    constructor(eventBus, tokenStorage, cookies) {
        this.eventBus = eventBus;
        this.tokenStorage = tokenStorage;
        this.cookies = cookies;
    }

    getConfig(jwt) {
        let eventBus = this.eventBus;
        let tokenStorage = this.tokenStorage;
        let cookies = this.cookies;

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

                    const tokenInUse = await cookies.getTokenInUse();
                    tokenStorage.saveCurrentUserToken(tokenInUse);
                    cookies.useToken(token.token_type + ' ' + token.access_token);
                    eventBus.$emit('whoamiTokenChanged');
                    eventBus.$emit('EvandPageRefreshRequired');
                }
            }
        };
    }
}
