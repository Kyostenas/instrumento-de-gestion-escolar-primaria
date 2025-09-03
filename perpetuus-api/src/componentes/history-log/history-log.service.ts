import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { CRUD_Service } from '../../abstract-classes/crud/crud-service.abstract';
import { HISTORY_LOG_MODEL, HistoryLog } from './history-log.model';
import DBReadingService from '../../services/db-reading/db-reading.service';

export class HistoryLogService extends CRUD_Service<
    typeof HISTORY_LOG_MODEL,
    HistoryLog
> {
    getmodel(): ReturnModelType<typeof HistoryLog, BeAnObject> {
        return HISTORY_LOG_MODEL;
    }

    // (o==================================================================o)
    //   #region CRUD
    // (o-----------------------------------------------------------\/-----o)

    create = async (
        ...args: any[]
    ): Promise<DocumentType<HistoryLog, BeAnObject>> => {
        throw new Error('Method not implemented.');
    };
    read = async ({
        pagination,
        filters
    }: {
        pagination: Pagination;
        filters: {
            document_id: string;
        };
    }): Promise<{
        result: DocumentType<HistoryLog, BeAnObject>[] | HistoryLog[];
        total: number;
        pagination: Pagination;
    }> => {
        const DB_READING_SERVICE = new DBReadingService({
            pagination,
            model: this.getmodel(),
            projection: {
                __v: 0,
                text_search_value: 0
            },
            paths_to_populate: [
                {
                    path: 'user',
                    select: '-contrasena -text_search_value -__V -numero_celular'
                }
            ],
            filters_function: (current_query) => {
                current_query.modified_document_id = filters.document_id;
                return current_query;
            }
        });
        const RESULT = await DB_READING_SERVICE.smart_read();
        return RESULT;
    };
    read_by_sequence = async (
        ...args: any[]
    ): Promise<HistoryLog | DocumentType<HistoryLog, BeAnObject> | null> => {
        throw new Error('Method not implemented.');
    };
    update = async (
        ...args: any[]
    ): Promise<HistoryLog | DocumentType<HistoryLog, BeAnObject> | null> => {
        throw new Error('Method not implemented.');
    };
    activate = async (
        ...args: any[]
    ): Promise<HistoryLog | DocumentType<HistoryLog, BeAnObject> | null> => {
        throw new Error('Method not implemented.');
    };
    deactivate = async (
        ...args: any[]
    ): Promise<HistoryLog | DocumentType<HistoryLog, BeAnObject> | null> => {
        throw new Error('Method not implemented.');
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CRUD
    // (o==================================================================o)
}
