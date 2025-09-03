import { Injectable } from '@angular/core';
import {
    NOMBRE_CAMPO_ROL_LOCAL_STORAGE,
    NOMBRE_CAMPO_USUARIO_LOCAL_STORAGE,
    UtilidadesService
} from '../../utiles/varios/utilidades/utilidades.service';
import {
    DESCRIPCION_MENU,
    UsuarioEnviar,
    UsuarioRecibir
} from 'src/app/models/usuario/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { RolUsuarioRecibir } from 'src/app/models/usuario/rol-usuario.model';
import { ControlNotificacionesService } from '../../utiles/varios/control-notificaciones/control-notificaciones.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private utilidades: UtilidadesService,
        private http: HttpClient,
        private notificaciones: ControlNotificacionesService
    ) {}

    private ruta_base = 'auth';
    private opciones = { withCredentials: true };

    private obtener_url(ruta: string[]) {
        const url = this.utilidades.preparar_url_conexion_api([
            this.ruta_base,
            ...ruta
        ]);
        return url;
    }

    registrarse(usuario: UsuarioEnviar) {
        const url = this.obtener_url(['signup']);
        return this.http.post(url, usuario).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    cuerpo_mensaje: resp.mensaje
                });
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    cuerpo_mensaje:
                        '¡Error al registrarse! ' + err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    iniciar_sesion(datos: any) {
        const url = this.obtener_url(['signin']);
        return this.http.post(url, datos, this.opciones).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    cuerpo_mensaje: resp.mensaje
                });
                return resp.datos as {
                    usuario: UsuarioRecibir;
                    menus: DESCRIPCION_MENU;
                };
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    cuerpo_mensaje:
                        '¡Error al iniciar sesión! ' + err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    cerrar_sesion() {
        const url = this.obtener_url(['signout']);
        return this.http.post(url, {}, this.opciones).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    cuerpo_mensaje: resp.mensaje
                });
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    cuerpo_mensaje:
                        '¡Error al cerrar sesión! ' + err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    refrescar_token(refrsh_tkn: string) {
        const url = this.obtener_url(['refresh-session', refrsh_tkn]);
        return this.http.post(url, {}, this.opciones).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    cuerpo_mensaje: resp.mensaje
                });
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    cuerpo_mensaje:
                        '¡Error refrescar la sesión! ' + err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    /**
     * Comprueba que la sesión exista, es decir, que no se
     * haya cerrado desde el API.
     *
     * @returns {Observable<boolean>} Booleano que dicta si hay una sesión
     */
    validar_sesion(): Observable<boolean> {
        const url = this.obtener_url(['validate-session']);
        return this.http.get(url, this.opciones).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    cuerpo_mensaje: resp.mensaje
                });
                return resp.datos as boolean;
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    cuerpo_mensaje:
                        '¡Error validar la sesión! ' + err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    obtener_usuario_local_storage(): UsuarioRecibir {
        return <UsuarioRecibir>(
            this.utilidades.consultar_local_storage(
                NOMBRE_CAMPO_USUARIO_LOCAL_STORAGE
            )
        );
    }

    obtener_rol_usuario_local_storage(): RolUsuarioRecibir {
        return <RolUsuarioRecibir>(
            this.utilidades.consultar_local_storage(
                NOMBRE_CAMPO_ROL_LOCAL_STORAGE
            )
        );
    }
}
