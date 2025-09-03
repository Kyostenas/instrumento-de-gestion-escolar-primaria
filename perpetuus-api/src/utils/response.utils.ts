import { syslog as _syslog } from './logs.utils';
const syslog = _syslog(module);
import { Response, ErrorRequestHandler } from 'express';

/**
 * # Response
 *
 * Una forma simple y estandarizada de generar respuestas
 * http con una sola clase, utilizando el estandar
 * [RFC 9110](https://httpwg.org/specs/rfc9110.html#overview.of.status.codes)
 * que se puede ver a detalle en
 * [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 *
 * El objetivo es mantener las respuestas consistentes y fáciles
 * de escribir.
 *
 * ---
 *
 * | DESCRIPCIÓN                     | RANGO     |
 * | :------------------------------ | --------: |
 * | Respuestas informativas         | 100 - 199 |
 * | Respuestas exitosas             | 200 - 299 |
 * | Mensajes de redirección         | 300 - 399 |
 * | Respuestas de error de cliente  | 400 - 499 |
 * | Respuestas de error de servidor | 500 - 499 |
 *
 */
export class Resp {
    constructor(
        public res: Response,
        public filename: any,
        public datos: DatosResponse
    ) {}

    // (o==================================================================o)
    //   UTILIDADES (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    private codigo_actual: string = '';

    get codigo_formateado(): string {
        return `<${this.codigo_actual}>`;
    }

    private error_general() {
        this.datos.ok = false;
        if (this.datos.error) {
            if (this.datos.error.hasOwnProperty('err')) {
                let errores_interfaz: string[] = [];
                this.datos.error.err.errors.map((campo: string) => {
                    errores_interfaz.push(
                        this.datos.error.err.errors[campo].message
                    );
                });
                this.datos.errores_interfaz = errores_interfaz;
            }
        } else {
            this.datos.error = new Error(
                this.datos.mensaje ? this.datos.mensaje : ''
            );
        }

        syslog.definir_ubicacion(this.filename);
        syslog.error(`${this.codigo_formateado} ${this.datos.error}`);
        return this.datos;
    }

    private estatus_ok_general() {
        this.datos.ok = true;
        syslog.definir_ubicacion(this.filename);
        syslog.success(`${this.codigo_formateado} ${this.datos.mensaje}`);
        return this.datos;
    }

    private respuesta_general(
        estatus: number,
        mensaje: string,
        error: boolean
    ) {
        this.datos.estatus = estatus;
        this.codigo_actual = `${estatus} ${mensaje}`;
        if (!this.datos) {
            syslog.definir_ubicacion(this.filename);
            syslog.error(`Respuesta vacía: `);
            return this.res.status(estatus).json(this.datos);
        }
        if (error) {
            return this.res.status(estatus).json(this.error_general());
        } else {
            return this.res.status(estatus).json(this.estatus_ok_general());
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   UTILIDADES (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   CODIGOS DE RESPUESTA (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    // (o-----------------------------------------( EXITOSAS ))

    /**
     * ## `200 OK`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200).
     *
     * Solicitud exitosa. El contexto de resultado exitoso cambia por método:
     *
     * - `GET`: El recurso se obtuvo y se transmitio en el cuerpo del mensaje.
     * - `PUT`/`POST`: El recurso resultado del procedimiento se transimitió en
     *      el cuerpo del mensaje.
     */
    _200_ok() {
        return this.respuesta_general(200, `OK`, false);
    }

    /**
     * ## `201 Created`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201).
     *
     * Solicitud exitosa que creo un nuevo recurso como resultado. Normalmente se usa
     * para solicitudes `POST` o algunas `PUT`.
     */
    _201_created() {
        return this.respuesta_general(201, `CREATED`, false);
    }

    // (o-----------------------------------------( ERROR CLIENTE ))

    /**
     * ## `400 Bad Request`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400).
     *
     * El servidor no puede o no va a procesar la solicitud por algo que se percibe
     * como un **error de cliente**.
     */
    _400_badRequest() {
        return this.respuesta_general(400, `BAD REQUEST`, true);
    }

    /**
     * ## `401 Unauthorized (Unauthenticated)`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401).
     *
     * **No autorizado** aquí se refiere en realidad a **`No autenticado`**.
     * Significa que el cliente se debe autenticar para poder recibir la respuesta
     * solicitada.
     */
    _401_unauthorized() {
        return this.respuesta_general(401, `UNAUTHORIZED`, true);
    }

    /**
     * ## `403 Forbidden`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403).
     *
     * El servidor entiende la solicitud pero se rehusa a autorizarla. Es similar
     * a `401` pero aquí reautenticar no hace difeerencia, porque el acceso esta
     * ligado a la lógica en la aplicación, por ejemplo: No hay suficientes
     * permisos para acceder a un recurso.
     */
    _403_forbidden() {
        return this.respuesta_general(403, `FORBIDDEN`, true);
    }

    /**
     * ## `404 Not Found`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404).
     *
     * El servidor no puede encontrar el recurso.
     *
     * En el **navegador** es que la **URL** no es reconocida. En el **API**
     * puede ser que la ruta sea válida pero no existe el recurso.
     */
    _404_not_found() {
        return this.respuesta_general(404, `NOT FOUND`, true);
    }

    /**
     * ## `422 Unprocessable Content`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422).
     *
     * Hubo una solicitud correcta, pero no se le pudo dar seguimiento por
     * errores semanticos.
     */
    _422_unprocessable() {
        return this.respuesta_general(422, `UNPROCESSABLE`, true);
    }

    // (o-----------------------------------------( ERROR SERVIDOR ))

    /**
     * ## `500 Internal Server Error`
     *
     * Detalles [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500).
     *
     * El servidor se encontró con una situación a la que no sabe como
     * responder (error interno).
     */
    _500_internal_server_error() {
        return this.respuesta_general(500, `INTERNAL ERROR`, true);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   CODIGOS DE RESPUESTA (FIN)
    // (o==================================================================o)
}

/**
 * # DatosResponse
 *
 * Estructura genérica para cualquier respuesta http
 * generada en `response.ts`.
 */
export interface DatosResponse {
    /**
     * ## mensaje
     * Cadena de texto que tiene una descripción rápida,
     * motivo, contexto, etc. De la respuesta.
     */
    mensaje: string;
    /**
     * ## advertencia
     * Texto describiendo una advertencia.
     */
    advertencias?: string[];
    /**
     * ## info
     * Texto describiendo una info. extra.
     */
    infos?: string[];
    /**
     * ## noticia
     * Texto describiendo una noticia.
     */
    noticias?: string[];
    /**
     * ## estatus
     * El código de estatus de la respuesta.
     */
    estatus?: number;
    /**
     * ## ok
     * Booleano que indica si está todo bien (no hay error).
     */
    ok?: boolean;
    /**
     * ## datos
     * Un objeto de cualquier estructura que contiene los datos
     * de la respuesta.
     */
    datos?: any;
    /**
     * ## errores_interfaz
     * Errores para mostrar en el **frontend**.
     */
    errores_interfaz?: string[];
    /**
     * ## descripcion
     * Detalles en extra de la respuesta.
     */
    descripcion?: string;
    /**
     * ## error
     * Objeto cualesquiera del error.
     */
    error?: any;
    /**
     * ## total
     * Si los datos son un arreglo, poner aqui la cantidad de
     * elementos de la consulta total sin paginarse.
     */
    total?: number;
    pagination?: Pagination;
}
