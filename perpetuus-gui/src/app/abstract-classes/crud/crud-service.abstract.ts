import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ControlNotificacionesService } from 'src/app/services/utiles/varios/control-notificaciones/control-notificaciones.service';
import { UtilidadesService } from 'src/app/services/utiles/varios/utilidades/utilidades.service';

export abstract class CRUD_Service<MODEL> {
    constructor(
        private utilites: UtilidadesService,
        private http: HttpClient,
        private notificaciones: ControlNotificacionesService,
        private base_route: string
    ) {}

    options = { withCredentials: true };

    make_http_request<MODEL, FILTERS_TYPE = any, BODY_TYPE = any>({
        operation,
        base_model,
        body,
        route,
        pagination,
        filter,
        create_notification = true,
        success_title = 'Correcto',
        error_title = 'Algo saló mal'
    }: {
        operation: 'get' | 'post' | 'put' | 'delete';
        base_model: Class<MODEL>;
        body?: BODY_TYPE;
        route?: string[];
        pagination?: Pagination;
        filter?: FILTERS_TYPE;
        create_notification?: boolean;
        success_title?: string;
        error_title?: string;
    }) {
        let url = this.utilites.preparar_url_conexion_api([
            this.base_route,
            ...(route || [])
        ]);
        let query: {
            pagination?: string;
            filters?: string;
        } = {};
        if (pagination) {
            query['pagination'] = JSON.stringify(pagination);
        }
        if (filter) {
            query['filters'] = JSON.stringify(filter);
        }
        Object.entries(query).forEach((value, index) => {
            const QUERY_KEY = value[0];
            const QUERY_VALUE = value[1];
            if (index > 0) {
                url = url.concat(`&${QUERY_KEY}=${QUERY_VALUE}`);
            } else {
                url = url.concat(`?${QUERY_KEY}=${QUERY_VALUE}`);
            }
        });
        let operation_funtion: Observable<any>;
        switch (operation) {
            case 'get':
                operation_funtion = this.http.get(url, this.options);
                break;
            case 'post':
                operation_funtion = this.http.post(url, body, this.options);
                break;
            case 'put':
                operation_funtion = this.http.post(url, body, this.options);
                break;
            case 'delete':
                operation_funtion = this.http.delete(url, this.options);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
        return operation_funtion.pipe(
            map((resp: any) => {
                if (create_notification) {
                    this.notificaciones.crear_notificacion({
                        tipo: 'toast',
                        modo: 'success',
                        titulo: success_title,
                        cuerpo_mensaje: resp.mensaje
                    });
                }
                if (pagination) {
                    return resp.datos.map(
                        (document: any) => new base_model(document)
                    );
                } else {
                    return new base_model(resp.datos);
                }
            }),
            catchError((err) => {
                this.notificaciones.crear_notificacion({
                    tipo: 'toast',
                    modo: 'danger',
                    titulo: error_title,
                    cuerpo_mensaje: err.error.mensaje
                });
                return throwError(() => new Error(err));
            })
        );
    }

    abstract create(...args: any[]): Observable<MODEL>;
    abstract read(...args: any[]): Observable<MODEL[]>;
    abstract read_by_sequence(...args: any[]): Observable<MODEL>;
    abstract update(...args: any[]): Observable<MODEL>;
    abstract activate(...args: any[]): Observable<MODEL>;
    abstract deactivate(...args: any[]): Observable<MODEL>;
}
