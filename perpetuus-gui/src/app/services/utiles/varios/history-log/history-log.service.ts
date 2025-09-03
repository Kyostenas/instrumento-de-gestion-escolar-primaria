import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD_Service } from 'src/app/abstract-classes/crud/crud-service.abstract';
import {
    HistoryLog,
    HistoryLogFilters
} from 'src/app/models/history-log/history-log.model';
import { UtilidadesService } from '../utilidades/utilidades.service';
import { HttpClient } from '@angular/common/http';
import { ControlNotificacionesService } from '../control-notificaciones/control-notificaciones.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryLogService extends CRUD_Service<HistoryLog> {
    constructor(
        private utilities_service: UtilidadesService,
        private http_client: HttpClient,
        private notifications: ControlNotificacionesService
    ) {
        super(utilities_service, http_client, notifications, 'history_log');
    }

    create(...args: any[]): Observable<HistoryLog> {
        throw new Error('Method not implemented.');
    }

    read(
        pagination: Pagination,
        filters: HistoryLogFilters
    ): Observable<HistoryLog[]> {
        return this.make_http_request<HistoryLog, HistoryLogFilters>({
            operation: 'get',
            base_model: HistoryLog,
            pagination: pagination,
            filter: filters
        });
    }

    read_by_sequence(...args: any[]): Observable<HistoryLog> {
        throw new Error('Method not implemented.');
    }

    update(...args: any[]): Observable<HistoryLog> {
        throw new Error('Method not implemented.');
    }

    activate(...args: any[]): Observable<HistoryLog> {
        throw new Error('Method not implemented.');
    }

    deactivate(...args: any[]): Observable<HistoryLog> {
        throw new Error('Method not implemented.');
    }
}
