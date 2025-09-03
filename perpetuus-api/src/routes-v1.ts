import { HISTORY_LOG_ROUTE } from './componentes/history-log/history-log.rotes';
import { RUTA_ROL } from './componentes/usuario/rol-usuario/rol-usuario.routes';
import { RUTA_USUARIO } from './componentes/usuario/usuario/usuario.routes';

import express, { Application } from 'express';
const app: Application = express();

/* 
    BARREL FILE
    This file includes all the routes of the application
*/

const ROUTES_v1 = function () {
    app.use('/roles', RUTA_ROL());
    app.use('/users', RUTA_USUARIO());
    app.use('/history_log', HISTORY_LOG_ROUTE());

    return app;
};

export { ROUTES_v1 };
