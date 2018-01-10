import * as classrouter from 'classrouter';
import * as IModel from 'core/model';
import * as ICommon from 'core/common';

import { varifyResetpass } from 'core/service/user/resetpass';
import { urlencodedBodyParser } from '../parser';
import { IForgetpassSession } from './session';
import * as errors from '../errors';

import { views } from '../../config';


let htmlNewpass = require('./newpass.html')
let htmlNewpassSuccess = require('./newpass-success.html')


interface IResult {
    userid: string, name: string, confirmed: boolean
}

@classrouter.GET
@classrouter.PATH('/forgetpass-new-success')

export class ForgetpassNewpassSuccess implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    async action(req: any) {
        let app = await this.loadApp();

        
        return new classrouter.response.View(htmlNewpassSuccess, {
            layout: views.layout,
            appname: app.name
        });
    }
}
@classrouter.GET
@classrouter.PATH('/forgetpass-new')

export class ForgetpassNewpass implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.ReqestParam('session')
    session: IForgetpassSession




    async action(req: any) {
        let app = await this.loadApp();

        if (!(this.session.newpassCode && this.session.newpassCodeid && this.session.newpassUser)) {
            return new classrouter.response.Redirect(`forget`, 302);
        }

        return new classrouter.response.View(htmlNewpass, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.POST
@classrouter.PATH('/forgetpass-new')
@classrouter.before(urlencodedBodyParser)
export class DoForgetpassNewpass implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.ReqestParam('session')
    session: IForgetpassSession



    @classrouter.BodyParam('pass')
    // @classrouter.validator.IsNotEmpty()
    pass: string

    @classrouter.BodyParam('pass2')
    // @classrouter.validator.IsNotEmpty()
    pass2: string





    valid() {
        if (!(this.pass)) {
            throw "not found pass";
        }

        if (this.pass2 != this.pass) {
            throw "not mached pass";
        }

    }



    async action(req: any) {
        let app = await this.loadApp();

        try {
            this.valid();

            let codeid = this.session.newpassCodeid || 0;
            let code = this.session.newpassCode || '';
            let userid = this.session.newpassUser;

            let { UserModel, user, codeRow } = await varifyResetpass(app, codeid, code);

            if (user.id != userid) {
                throw 'not mached user';
            }

            user.password = ICommon.md5(this.pass);
            await user.save();

            this.session.newpassUser = null;
            this.session.newpassCode = null;
            this.session.newpassCodeid = null;

            await codeRow.destroy();

            return new classrouter.response.Redirect(`forgetpass-new-success`, 302);

        } catch (error) {
            return new classrouter.response.View(htmlNewpass, {
                layout: views.layout,
                appname: app.name,
                errors: error.message || error
            });
        }


    }
}