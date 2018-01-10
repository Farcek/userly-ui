import * as classrouter from 'classrouter';

import { Forgetpass, DoForgetpass } from './forgetpass';
import { ForgetpassCode, DoForgetpassCode } from './code';
import { ForgetpassNewpass, DoForgetpassNewpass, ForgetpassNewpassSuccess } from './newpass';

@classrouter.PATH('/')
@classrouter.SubRouter(Forgetpass, DoForgetpass)
@classrouter.SubRouter(ForgetpassCode, DoForgetpassCode)
@classrouter.SubRouter(ForgetpassNewpass, DoForgetpassNewpass, ForgetpassNewpassSuccess)
export class ForgetpassIndex { }