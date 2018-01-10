import * as classrouter from 'classrouter';
import * as IModel from 'core/model';
import * as ICommon from 'core/common';
import { findLoginUser, doLogin } from 'core/service/user/login';
import { gen as uitokenGen } from 'core/service/user/uitoken';

import { urlencodedBodyParser } from '../parser';
import { ILoginSession } from './session';
import * as errors from '../errors';

import { views } from '../../config';


let htmlLogin = require('./login.html')
let htmlLoginSuccess = require('./login-success.html')



@classrouter.GET
@classrouter.PATH('/')

export class Login implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.QueryParam()
    return: string

    async action(req: any) {
        let app = await this.loadApp();
        return new classrouter.response.View(htmlLogin, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.POST
@classrouter.PATH('/')
@classrouter.before(urlencodedBodyParser)
export class DoLogin implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.ReqestParam('session')
    session: ILoginSession

    @classrouter.BodyParam('user')
    // @classrouter.validator.IsNotEmpty()
    user: string

    @classrouter.BodyParam('pass')
    // @classrouter.validator.IsNotEmpty()
    pass: string

    @classrouter.QueryParam()
    return: string

    @classrouter.QueryParam()
    method: string = 'post'

    valid() {
        if (!(this.return)) {
            throw "not found return uri";
        }
        if (!(this.user)) {
            throw "not found user";
        }
        if (!(this.pass)) {
            throw "not found pass";
        }
    }

    async findUser(app: IModel.IClient.IInstance) {
        let UserModel = await IModel.IClient.userModelByApp(app);
        if (UserModel) {
            return await findLoginUser(UserModel, app.id || 0, {
                useridentity: this.user,
                password: this.pass
            });
        }
        throw "can not create UserModel";
    }

    async action(req: any) {
        let app = await this.loadApp();
        let values = {
            user: this.user,
            pass: this.pass
        }
        try {
            this.valid();

            let user = await this.findUser(app);

            let login = await doLogin(user)


            let tokencode = uitokenGen(login, app.saltkey);

            this.session.loginUser = user.id;

            return new classrouter.response.View(htmlLoginSuccess, {
                // layout: views.layout,
                appname: app.name,
                tokencode,
                return: this.return,
                method: this.method == 'get' ? 'get' : 'post'
            });
        } catch (error) {
            return new classrouter.response.View(htmlLogin, {
                layout: views.layout,
                appname: app.name,
                values,
                errors: error.message || error
            });
        }


    }
}