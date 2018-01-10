import * as classrouter from 'classrouter';


import { Client } from 'core/models/client';
import { LoginIndex } from './login/index';
import { RegisterIndex } from './register/index';
import { ForgetpassIndex } from './forgetpass/index';


@classrouter.PATH('/domain/:domain')
@classrouter.SubRouter(LoginIndex, RegisterIndex, ForgetpassIndex)
export class IndexRoute {

    @classrouter.PathParam('domain')
    domain: string

    
    @classrouter.Middleware()
    loadApp() {
        return async () => {
            let client = await Client.findOne({
                where: {
                    domain: this.domain
                }
            });
            if (client) {
                return client
            }
            throw "not found client";
        };
    }

}