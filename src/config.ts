const config = require('config');
import * as db from 'core/models/config';

//console.log('Config DIR:', config.util.getEnv('NODE_CONFIG_DIR'))

// database
export const database = db.setConfig(config.get('database'));

// api

// console
export interface IUi {
    port: number
    
}
export const ui: IUi = config.get('ui');

export const views = {
    layout : require('./views/layout.html')
}