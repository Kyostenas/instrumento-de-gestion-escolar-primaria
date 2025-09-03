// (o-----------------------------------------( IMPORTACIONES ))

/* LEAVE THIS AS IT IS */
import MODEL_IMPORTS_BARREL from './model-barrel';
MODEL_IMPORTS_BARREL;

import 'reflect-metadata';
import mongoose from 'mongoose';
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
import { syslog as _syslog } from './utils/logs.utils';
const syslog = _syslog(module);
import express, { Application, Response, Request } from 'express';
import cors from 'cors';
import cookie_session from 'cookie-session';
import cookieParser from 'cookie-parser';
import { Resp } from './utils/response.utils';
import { URI_DB, PORT, COOKIE_SECRET, URL_GUI } from './config/env/env.config';
import { RUTA_AUTH } from './componentes/auth-login/auth.routes';
import { verificar_jwt } from './middlewares/auth-login/jwt.middleware';
import { ROUTES_v1 } from './routes-v1';

// (o==================================================================o)
//   SERVIDOR EXPRESS (INICIO)
// (o-----------------------------------------------------------\/-----o)

const app: Application = express();

const opciones_cors = {
    origin: URL_GUI,
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    preflightContinue: true,
    credentials: true,
    allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

// (o-----------------------------------------( CONFIGURACIONES ))

app.disable('x-powered-by');
app.use(cors(opciones_cors));

// PARA PARSEAR LAS COOKIES
app.use(cookieParser());

// BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REQUEST LOGS
app.use((req: Request, res: Response, next: any) => {
    let body = JSON.stringify(req.body, undefined, 2).split('\n')
    let formed_body: string
    if (body.length > 150) {
        formed_body = body.slice(0, 149).join('\n').concat('\n. . .\n')
    } else {
        formed_body = body.join('\n')
    }

    syslog._Request(
        req.method,
        `------------------------------------------------------------------\n` +
            `[USUARIO   ] ${req.usuario?.nombre || req.body?.nombre_usuario}\n` +
            `[URL       ] ${req.originalUrl}\n` +
            `[USER_AGENT] ${req.get('User-Agent')}\n` +
            `[BODY      ] ${formed_body}\n` +
            `[QUERY     ] ${JSON.stringify(req.query, undefined, 2)}\n` +
            `[PARAMS    ] ${JSON.stringify(req.params, undefined, 2)}\n` +
        `------------------------------------------------------------------`

    )
    next();
});

app.use(
    cookie_session({
        name: 'perpetuus-session',
        keys: [<string>COOKIE_SECRET],
        httpOnly: true
    })
);

app.use((req: Request, res: Response, next: any) => {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

// (o-----------------------------------------( RUTAS ))

app.get('/api', async (req: Request, res: Response): Promise<Response> => {
    return new Resp(res, __filename, { mensaje: 'API Funcionando' })._200_ok();
});

// RUTAS DE INICIO DE SESION, CREACION DE TOKEN
// Y TOKEN DE REFRESCADO.
// Deben ir antes de la verificacion del token.
app.use('/api/v1/auth', RUTA_AUTH());

// VERIFICACION DE TOKEN
// Debe ir despues de la ruta auth, porque esa no
// debe validar el token. Esto es asi porque es
// en base a esas rutas que se genera este mismo.
app.use((req: Request, res: Response, next: any) => {
    verificar_jwt(req, res, next);
});

// MARK: RUTAS APLICACION
app.use('/api/v1', ROUTES_v1());

// (o-----------------------------------------( MANEJO DE ERRORES ))

app.all('*', (req: Request, res: Response, next: any) => {
    const err = new Error(
        `no existe la ruta (${req.method}) ${req.originalUrl}`
    );
    err.cause = 'ruta no encontrada';
    next(err);
});

app.use(function (err: any, req: Request, res: Response, next: any) {
    if (err.cause === 'ruta no encontrada') {
        return new Resp(res, __filename, {
            mensaje: err.message,
            error: err
        })._404_not_found();
    }
    if (err.code === 'user_object_not_found') {
        return new Resp(res, __filename, {
            mensaje: `Token no válido.`,
            error: err
        })._403_forbidden();
    }
    if (err.code === 'permission_denied') {
        return new Resp(res, __filename, {
            mensaje: `No tienes permiso para `
                .concat(`acceder al siguiente `)
                .concat(`contenido: ${req.permiso_denegado}`),
            error: err
        })._403_forbidden();
    }
    return new Resp(res, __filename, {
        mensaje: err.message,
        error: err
    })._500_internal_server_error();
});

// (o-----------------------------------------( CONECCION MONGODB ))

mongoose
    .connect(<string>URI_DB)
    .then(() => {
        syslog.ok(`mongo db conectada`);
    })
    .catch((error) => {
        syslog.error(`no se pudo conectar a la bd: ${error}`);
    });

// (o-----------------------------------------( ESCUCHAR ))

try {
    app.listen(PORT, (): void => {
        syslog.info(`escuchando en el puerto ${PORT}`);
    });
} catch (error: any) {
    syslog.error(
        `Ocurrió un error antes de escuchar en el puerto: ${error.message}`
    );
}

// (o-----------------------------------------------------------/\-----o)
//   SERVIDOR EXPRESS (FIN)
// (o==================================================================o)
