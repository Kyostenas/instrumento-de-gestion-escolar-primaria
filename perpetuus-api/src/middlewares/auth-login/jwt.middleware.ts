import { verify as jwt_verify } from 'jsonwebtoken';

import { Resp } from '../../utils/response.utils';
import { controlador_auth } from '../../componentes/auth-login/auth.controller';
import { AUTH_SECRET } from '../../config/env/env.config';
import { Request, Response } from 'express';
import { desencriptar_jwt } from '../../utils/jwt.utils';

const URLS_EXCENTAS = [
    '/api/v1/roles/super-admin',
    '/api/v1/users/super-admin'
];

export function verificar_jwt(req: Request, res: Response, next: any) {
    if (!URLS_EXCENTAS.includes(req.url)) {
        let token = desencriptar_jwt(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'.concat(
                req.cookies['perpetuus-session']
            )
        ).token;
        let key = req.cookies['perpetuus-session.sig'];
        if (!token) {
            return new Resp(res, __filename, {
                mensaje: 'Token no provehido'
            })._403_forbidden();
        }
        jwt_verify(
            token,
            <string>AUTH_SECRET,
            async (err: any, decoded: any) => {
                if (err) {
                    if (!!token) {
                        await controlador_auth.cerrar_sesion(
                            req,
                            res,
                            'Se ha forzado el cierre de tu sesión porque ya no es válida'
                        );
                    }
                } else {
                    req.usuario = decoded.usuario;
                    next();
                }
            }
        );
    } else {
        next();
    }
}

const jwt_middleware = {
    verificar_jwt
};

export { jwt_middleware };
