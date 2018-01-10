const bodyParser = require('body-parser')
import * as IModel from 'core/model';
import * as ICommon from 'core/common';

import * as IErrors from './errors';


export function urlencodedBodyParser() {
    return bodyParser.urlencoded({ extended: false });
}

export function jsonBodyParser() {
    return bodyParser.json();
}


