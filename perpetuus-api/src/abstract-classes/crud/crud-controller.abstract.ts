import { Request, Response } from 'express';
import { validar_existencia_de_campos } from '../../utils/validaciones.utils';
import { Resp } from '../../utils/response.utils';
import { obtener_paginacion } from '../../utils/busqueda-paginacion.utiles';

export abstract class CRUD_Controller<UsedModel> {
    async try_operation({
        res,
        req,
        extra_body,
        operation,
        res_message,
        err_message,
        not_found_message,
        is_creation,
        filename,
        fields_to_validate
    }: {
        res: Response;
        req: Request;
        extra_body?: { [type: string]: any };
        operation: Function;
        res_message: string;
        err_message: string;
        not_found_message?: string;
        is_creation: boolean;
        filename: string;
        fields_to_validate?: {
            req_body?: string[];
            extra_body?: string[];
            req_query?: string[];
            req_query_filters?: string[];
            req_params?: string[];
        };
    }) {
        let body = {};
        try {
            if (req.query) {
                if (req.query.filters) {
                    try {
                        req.query['filters'] = JSON.parse(
                            <string>req.query.filters
                        );
                    } catch {
                        return new Resp(res, filename, {
                            mensaje:
                                'Los filtros deben ser un objeto en forma de cadena de texto'
                        })._422_unprocessable();
                    }
                }
            }
            if (req.query) {
                if (req.query.filters) {
                    try {
                        req.query['pagination'] = JSON.parse(
                            <string>req.query.pagination
                        );
                    } catch {
                        return new Resp(res, filename, {
                            mensaje:
                                'La paginación debe ser un objeto en forma de cadena de texto'
                        })._422_unprocessable();
                    }
                }
            }
            if (fields_to_validate?.req_body) {
                const { valido, mensaje } = validar_existencia_de_campos(
                    fields_to_validate.req_body,
                    req.body
                );
                if (!valido) {
                    return new Resp(res, filename, {
                        mensaje: 'En req.body: ' + mensaje
                    })._422_unprocessable();
                }
            }
            if (fields_to_validate?.extra_body) {
                const { valido, mensaje } = validar_existencia_de_campos(
                    fields_to_validate.extra_body,
                    extra_body
                );
                if (!valido) {
                    return new Resp(res, filename, {
                        mensaje: 'En extra_body: ' + mensaje
                    })._422_unprocessable();
                }
            }
            if (fields_to_validate?.req_query) {
                const { valido, mensaje } = validar_existencia_de_campos(
                    fields_to_validate.req_query,
                    req.query
                );
                if (!valido) {
                    return new Resp(res, filename, {
                        mensaje: 'En req.query: ' + mensaje
                    })._422_unprocessable();
                }
            }
            if (fields_to_validate?.req_query_filters) {
                const { valido, mensaje } = validar_existencia_de_campos(
                    fields_to_validate.req_query_filters,
                    req.query['filters']
                );
                if (!valido) {
                    return new Resp(res, filename, {
                        mensaje: 'En req.query.filters: ' + mensaje
                    })._422_unprocessable();
                }
            }
            if (fields_to_validate?.req_params) {
                const { valido, mensaje } = validar_existencia_de_campos(
                    fields_to_validate.req_params,
                    body
                );
                if (!valido) {
                    return new Resp(res, filename, {
                        mensaje: 'En req.params: ' + mensaje
                    })._422_unprocessable();
                }
            }
            body = {
                ...extra_body,
                ...req.body,
                ...req.query,
                ...req.params,
                user_id: req.usuario?._id
            };
            const pagination = obtener_paginacion(req);
            body = { ...body, pagination };
            const result = !!body ? await operation(body) : await operation();
            if (is_creation && !result) {
                return new Resp(res, filename, {
                    mensaje: not_found_message ?? 'No encontrado'
                })._404_not_found();
            }
            const RESP =
                result.result && result.total && result.pagination
                    ? new Resp(res, filename, {
                          mensaje: res_message,
                          datos: result.result,
                          total: result.total,
                          pagination: result.pagination
                      })
                    : new Resp(res, filename, {
                          mensaje: res_message,
                          datos: result
                      });
            if (is_creation) {
                return RESP._201_created();
            } else {
                return RESP._200_ok();
            }
        } catch (err) {
            return new Resp(res, filename, {
                mensaje: err_message,
                error: err
            })._422_unprocessable();
        }
    }

    abstract getmodel(): UsedModel;

    abstract create(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
    abstract read(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
    abstract read_by_sequence(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
    abstract update(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
    abstract activate(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
    abstract deactivate(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>>;
}
