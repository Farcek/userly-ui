import * as classrouter from 'classrouter';
import * as IModel from 'core/model';
import * as ICommon from 'core/common';

import { varifyResetpass } from 'core/service/user/resetpass';
import { urlencodedBodyParser } from '../parser';
import { IForgetpassSession } from './session';
import * as errors from '../errors';

import { views } from '../../config';


let htmlCode = require('./code.html')


interface IResult {
    userid: string, name: string, confirmed: boolean
}

@classrouter.GET
@classrouter.PATH('/forgetpass-code')

export class ForgetpassCode implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.QueryParam('id')
    @classrouter.typecast.str2int()
    codeid:number

    async action(req: any) {
        let app = await this.loadApp();



        return new classrouter.response.View(htmlCode, {
            layout: views.layout,
            appname: app.name
        });
    }
}

@classrouter.POST
@classrouter.PATH('/forgetpass-code')
@classrouter.before(urlencodedBodyParser)
export class DoForgetpassCode implements classrouter.IRoute {

    @classrouter.ReqestParam('loadApp')
    loadApp: () => Promise<IModel.IClient.IInstance>

    @classrouter.ReqestParam('session')
    session: IForgetpassSession

    @classrouter.QueryParam('id')
    @classrouter.typecast.str2int()
    codeid:number

    @classrouter.BodyParam('code')    
    code: string





    valid() {
        if (!(this.code)) {
            throw "not found code";
        }

    }

    

    async action(req: any) {
        let app = await this.loadApp();
        let values = {
            code: this.code
        }
        try {
            this.valid();

            let {UserModel, user} = await varifyResetpass(app, this.codeid, this.code);

            this.session.newpassUser = user.id;
            this.session.newpassCode = this.code;
            this.session.newpassCodeid = this.codeid;
            
            return new classrouter.response.Redirect(`forgetpass-new`, 302);
            
        } catch (error) {
            return new classrouter.response.View(htmlCode, {
                layout: views.layout,
                appname: app.name,
                values,
                errors: error.message || error
            });
        }


    }
}