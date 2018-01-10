import "reflect-metadata";
import * as express from "express";
import * as classrouter from "classrouter";

const cookieSession = require('cookie-session');
const morgan = require('morgan');
const twig = require('twig');

import { ui as confUi } from './config';

import * as IModel from 'core/model';
import { IndexRoute } from './routes/index';
import * as apiErrors from './routes/errors';

const app = express();
app.use(morgan('dev'));

// twig
app.engine('html', twig.__express);
app.set('view engine', 'html');
app.set('views', __dirname);
app.set("twig options", {
    strict_variables: false,
    //allowInlineIncludes: true,
    //namespaces: { 'my-project': "/src/views" }
});

// session
app.use(cookieSession({
    name: 'session',
    keys: ['32jhk4hj2k34hk2','4k35h3k4h5']
}))

app.use('/public', express.static(__dirname + '/public'))
app.use('/', classrouter.attach(express.Router(), IndexRoute, 'app'))


app.use((err: any, req: express.Request, res: express.Response, next: any) => {
    if (err instanceof classrouter.ClassrouterValidationError) {
        var msg = JSON.stringify(err.errors);
        var error = new apiErrors.ValidationError(msg);
        next(error);
    } else {
        next(err);
    }
});

app.use((err: any, req: express.Request, res: express.Response, next: any) => {
    if (err instanceof apiErrors.ValidationError) {
        res.status(400);
        res.json(err);
    } else if (err instanceof apiErrors.FormValidationError) {
        res.status(400);
        res.json(err);
    } else if (err instanceof apiErrors.OtherError) {
        res.status(400);
        res.json(err);
    } else {
        res.status(500);
        res.json({
            name: 'error',
            message: (err && (err.message || JSON.stringify(err))) || 'not handled error'
        });
    }
});


IModel.check()
    .then(() => {
        app.listen(confUi.port, () => {
            console.log(`Userly ui app listening on port ${confUi.port}!`)
        });
    })
    .catch(err => {
        console.log('cannot login database', err);
    });

