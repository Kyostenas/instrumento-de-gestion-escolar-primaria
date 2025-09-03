import {
    Component,
    OnInit,
    Signal,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormViewLayoutComponent } from 'src/app/components/layout/-general/form-view-layout/form-view-layout.component';
import { HistoryLog } from 'src/app/models/history-log/history-log.model';
import { ControlQueriesUrlService } from 'src/app/services/utiles/estructurales/control-queries-url/control-queries-url.service';
import { SidebarControlService } from 'src/app/services/utiles/estructurales/sidebar-control/sidebar-control.service';
import { HistoryLogService } from 'src/app/services/utiles/varios/history-log/history-log.service';

@Component({
    selector: 'app-user-administration-form',
    imports: [FormViewLayoutComponent],
    templateUrl: './user-administration-form.component.html',
    styleUrl: './user-administration-form.component.scss'
})
export class UserAdministrationFormComponent implements OnInit {
    // (o==================================================================o)
    //   #region INITIALIZATION
    // (o-----------------------------------------------------------\/-----o)

    constructor(
        private queries_service: ControlQueriesUrlService,
        private side_bar_service: SidebarControlService,
        private history_log_service: HistoryLogService
    ) {
        // setTimeout(() => {
        const QUERIES = this.queries_service.query_actual();
        if (QUERIES.object_id) {
            this.history_log = toSignal(
                this.history_log_service.read(
                    {
                        current_page: 1,
                        from: 0,
                        limit: 5,
                        page_count: 0,
                        element_count: 0,
                        sorting_fields: {}
                    },
                    {
                        document_id: QUERIES.object_id
                    }
                )
            );
            console.log(this.history_log());
        }
        this.side_bar_service.inner_component_template =
            this.history_log_template;
        // }, 0);
    }

    ngOnInit(): void {
        this.queries_service.queries.use_side_panel.accion.definir(true);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INITIALIZATION
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VARIABLES
    // (o-----------------------------------------------------------\/-----o)

    @ViewChild('history_log_template') history_log_template!: TemplateRef<any>;

    history_log!: Signal<HistoryLog[] | undefined>;

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region HISTORY LOG
    // (o-----------------------------------------------------------\/-----o)

    get_history_log(document_id: string | undefined) {}

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion HISTORY LOG
    // (o==================================================================o)
}
