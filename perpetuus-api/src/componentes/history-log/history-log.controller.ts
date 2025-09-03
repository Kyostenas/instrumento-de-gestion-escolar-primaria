import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { Request, Response } from 'express';
import { CRUD_Controller } from '../../abstract-classes/crud/crud-controller.abstract';
import { HISTORY_LOG_MODEL, HistoryLog } from './history-log.model';
import { HistoryLogService } from './history-log.service';

export class HistoryLogController extends CRUD_Controller<
    typeof HISTORY_LOG_MODEL
> {
    getmodel(): ReturnModelType<typeof HistoryLog, BeAnObject> {
        return HISTORY_LOG_MODEL;
    }

    // (o==================================================================o)
    //   #region CRUD
    // (o-----------------------------------------------------------\/-----o)

    create = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        throw new Error('Method not implemented.');
    };
    read = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            extra_body: {},
            operation: new HistoryLogService().read,
            res_message: 'Historial obtenido',
            err_message: 'Error al obtener el historial',
            is_creation: false,
            filename: __filename,
            fields_to_validate: {
                req_query_filters: ['document_id']
            }
        });
    };
    read_by_sequence = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        throw new Error('Method not implemented.');
    };
    update = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        throw new Error('Method not implemented.');
    };
    activate = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        throw new Error('Method not implemented.');
    };
    deactivate = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        throw new Error('Method not implemented.');
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CRUD
    // (o==================================================================o)
}
