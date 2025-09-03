import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ControlNotificacionesService } from '../../utiles/varios/control-notificaciones/control-notificaciones.service';
import { UtilidadesService } from '../../utiles/varios/utilidades/utilidades.service';
import { UsuarioRecibir } from 'src/app/models/usuario/usuario.model';
import { map, catchError, throwError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdministracionUsuariosService {
    constructor(
        private utilidades: UtilidadesService,
        private http: HttpClient,
        private notificaciones: ControlNotificacionesService
    ) {}

    private ruta_base = 'users';
    private opciones = { withCredentials: true };

    private obtener_url(ruta?: string[]) {
        const url = this.utilidades.preparar_url_conexion_api([
            this.ruta_base,
            ...(ruta || [])
        ]);
        return url;
    }

    total_usuarios: number = 0;

    obtener_usuarios(paginacion?: Pagination): Observable<UsuarioRecibir[]> {
        let url = this.obtener_url();
        if (paginacion) {
            url = url.concat(`?pagination=${JSON.stringify(paginacion)}`);
        }
        return this.http.get(url, this.opciones).pipe(
            map((resp: any) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'success',
                    titulo: 'Correcto',
                    cuerpo_mensaje: resp.mensaje
                });
                return resp.datos.map(
                    (usuario: any) => new UsuarioRecibir(usuario)
                );
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    titulo: '¡Error al obtener los usuarios!',
                    cuerpo_mensaje: err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }
}
