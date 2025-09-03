import { Component, OnInit } from '@angular/core';
import { FormViewLayoutComponent } from 'src/app/components/layout/-general/form-view-layout/form-view-layout.component';
import { ControlQueriesUrlService } from 'src/app/services/utiles/estructurales/control-queries-url/control-queries-url.service';

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

    constructor(private queries_service: ControlQueriesUrlService) {}

    ngOnInit(): void {
        this.queries_service.queries.use_side_panel.accion.definir(true);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INITIALIZATION
    // (o==================================================================o)
}
