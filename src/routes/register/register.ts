import * as classrouter from 'classrouter';
import * as IModel from 'core/model';
import * as ICommon from 'core/common';
import { findLoginUser, doLogin } from 'core/service/user/login';
import { userRegister } from 'core/service/user/register';

import { urlencodedBodyParser } from '../parser';
import * as errors from '../errors';

import { views } from '../../config';


let htmlRegister = require('./register.html')
let htmlRegisterSuccess = require('./register-success.html')


@classrouter.GET
@classrouter.PATH('/register-success')

export class RegisterSuccess implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    async action(req: any) {
        let app = await this.loadApp();

        return new classrouter.response.View(htmlRegisterSuccess, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.GET
@classrouter.PATH('/register')

export class Register implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    async action(req: any) {
        let app = await this.loadApp();
        return new classrouter.response.View(htmlRegister, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.POST
@classrouter.PATH('/register')
@classrouter.before(urlencodedBodyParser)
export class DoRegister implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.BodyParam('name')
    // @classrouter.validator.IsNotEmpty()
    name: string
    @classrouter.BodyParam('user')
    // @classrouter.validator.IsNotEmpty()
    user: string

    @classrouter.BodyParam('pass')
    // @classrouter.validator.IsNotEmpty()
    pass: string

    @classrouter.BodyParam('pass2')
    // @classrouter.validator.IsNotEmpty()
    pass2: string

    valid() {
        if (!(this.name)) {
            throw "not found name";
        }
        if (!(this.user)) {
            throw "not found user";
        }
        if (!(this.pass)) {
            throw "not found pass";
        }

        if (this.pass2 != this.pass) {
            throw "not mached pass";
        }
    }



    async action(req: any) {
        let app = await this.loadApp();
        let values = {
            name: this.name,
            user: this.user,
            pass: this.pass
        }

        
        try {
            this.valid();

            let UserModel = await IModel.IClient.userModelByApp(app);
            let user = await userRegister(UserModel, app.id || 0, {
                name: this.name,
                useridentity: this.user,
                password: this.pass
            });

            return new classrouter.response.Redirect('register-success',302);

        } catch (error) {
            return new classrouter.response.View(htmlRegister, {
                layout: views.layout,
                appname: app.name,
                values,
                errors: error.message || error
            });
        }


    }
}