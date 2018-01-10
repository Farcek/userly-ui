import * as classrouter from 'classrouter';
import * as IModel from 'core/model';
import * as ICommon from 'core/common';
import { findLockupUser } from 'core/service/user/login';
import { createResetpass } from 'core/service/user/resetpass';

import { urlencodedBodyParser } from '../parser';
import * as errors from '../errors';

import { views } from '../../config';


let htmlForgetpass = require('./forgetpass.html')


interface IResult {
    userid: string, name: string, confirmed: boolean
}

@classrouter.GET
@classrouter.PATH('/forgetpass')

export class Forgetpass implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    async action(req: any) {
        let app = await this.loadApp();
        return new classrouter.response.View(htmlForgetpass, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.POST
@classrouter.PATH('/forgetpass')
@classrouter.before(urlencodedBodyParser)
export class DoForgetpass implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.BodyParam('user')
    // @classrouter.validator.IsNotEmpty()
    user: string



    valid() {
        if (!(this.user)) {
            throw "not found user";
        }

    }

    async findUser(app: IModel.IClient.IInstance) {
        let UserModel = await IModel.IClient.userModelByApp(app);
        let user = await findLockupUser(UserModel, app.id || 0, this.user);

        return { UserModel, user }
    }

    async action(req: any) {
        let app = await this.loadApp();
        let values = {
            user: this.user
        }
        try {
            this.valid();

            let { user, UserModel } = await this.findUser(app);

            let { code, codeid } = await createResetpass(app, UserModel, user);
            

            return new classrouter.response.Redirect(`forgetpass-code?id=${codeid}`, 302);

        } catch (error) {
            return new classrouter.response.View(htmlForgetpass, {
                layout: views.layout,
                appname: app.name,
                values,
                errors: error.message || error
            });
        }


    }
}