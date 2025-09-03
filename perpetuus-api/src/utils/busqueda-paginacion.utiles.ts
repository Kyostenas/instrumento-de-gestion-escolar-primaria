import { Request } from 'express';

export function obtener_paginacion(request: Request): Pagination {
    if (!!request.query['pagination']) {
        try {
            return JSON.parse(<string>request.query['pagination']) as Pagination;
        } catch {
            return <any>request.query['pagination'] as Pagination
        }
    } else {
        const PAGINACION: Pagination = {
            sorting_fields: {},
            from: 0,
            limit: 5,
            current_page: 0,
            page_count: 0,
            element_count: 0
        };
        return PAGINACION;
    }
}

export function generar_criterios_sort(
    paginacion: Pagination,
    es_busqueda_texto: boolean
) {
    const CRITERIOS_SORT: { [type: string]: any } = {};
    const PROJECTION: { [type: string]: any } = {};

    for (let [nombre_campo, especificacion] of Object.entries(
        paginacion.sorting_fields
    )) {
        CRITERIOS_SORT[nombre_campo] = especificacion.order;
    }
    if (es_busqueda_texto) {
        CRITERIOS_SORT.score = { $meta: 'textScore' };
        PROJECTION.score = { $meta: 'textScore' };
    }

    return { CRITERIOS_SORT, PROJECTION };
}
