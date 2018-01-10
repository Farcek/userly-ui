import * as classrouter from 'classrouter';

import { Login, DoLogin } from './login';

@classrouter.PATH('/login')
@classrouter.SubRouter(Login, DoLogin)
export class LoginIndex { }