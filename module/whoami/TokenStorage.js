
export class TokenStorage
{
    getSavedUserToken() {
        return new Promise(function(resolve, reject){
            chrome.storage.sync.get(['whoami_evand_com_user_original_jwt_token'], function(result){
                !result.whoami_evand_com_user_original_jwt_token ? resolve(null) : resolve(result.whoami_evand_com_user_original_jwt_token);
            });
        });
    }

    // @todo move logic out or main class into whoami module.
    async saveCurrentUserToken(main) {
        const savedToken = await this.getSavedUserToken();

        if(savedToken == null) {
            const token = await main.getEvandUserJWTToken();
            chrome.storage.sync.set({ whoami_evand_com_user_original_jwt_token : token });
        }
    }

    isLivingSomeoneElsesLife() {
        return new Promise(function(resolve, reject){
            chrome.storage.sync.get(
                ['whoami_evand_com_user_original_jwt_token'], 
                result => result.whoami_evand_com_user_original_jwt_token ? resolve(true) : resolve(false)
            );
        });
    }
}
