import * as classrouter from 'classrouter';

import { Register, DoRegister, RegisterSuccess } from './register';

@classrouter.PATH('/')
@classrouter.SubRouter(Register, DoRegister, RegisterSuccess)
export class RegisterIndex { }