
export class Config
{
    getConfig(jwt)
    {
        return {
            el: "#app",
            data: {
                someone: "",
                users: []
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
