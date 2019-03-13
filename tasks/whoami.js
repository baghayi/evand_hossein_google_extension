import { Main } from '../services/Main.js';


const main = new Main();
main.run(function(jwt, tabUrl){

    Vue.component('user', {
        props: ['user'],
        template: `
        <p>
        <img style="cursor: pointer;" :src="user.avatar && user.avatar.original ? user.avatar.original : 'https://www.gravatar.com/avatar/' + user.email_md5" alt="" width="30px" height="30px" v-on:click="BecomeSelectedUser"/>
        {{ user.first_name }} {{user.last_name}}
        <br />
        آی در کاربر: {{user.id}}
        </p>
        `,
        methods: {
            BecomeSelectedUser: function(e) {
                console.log(this.user);
                // request for selected user's jwt
                // change jwt in browers's cookie
                // save users' own jwt somewhere
                // indicate user that they are not using their own profile
                // put a button to let them change to their own profile
                // get back to normal as nothing had happened
            }
        }
    })

    var app = new Vue({
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
    });

    document.getElementById('homepage').addEventListener('click', function(){
        main.gotoPage('Homepage', jwt);
    });
});



