import {
    Component,
    effect,
    OnChanges,
    OnDestroy,
    OnInit,
    signal,
    SimpleChanges,
    WritableSignal
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BootstrapHideAutoDirective } from 'src/app/directives/utiles/varios/bootstrap-hide-auto/bootstrap-hide-auto.directive';
import { BootstrapShowAutoDirective } from 'src/app/directives/utiles/varios/bootstrap-show-auto/bootstrap-show-auto.directive';
import { EspecificacionServicioNotificacion } from 'src/app/models/utiles/varios/control-notificaciones/control-notificaciones.model';
import { ControlNotificacionesService } from 'src/app/services/utiles/varios/control-notificaciones/control-notificaciones.service';

@Component({
    selector: 'app-control-notificaciones',
    imports: [BootstrapShowAutoDirective, BootstrapHideAutoDirective],
    templateUrl: './control-notificaciones.component.html',
    styleUrl: './control-notificaciones.component.scss'
})
export class ControlNotificacionesComponent {
    constructor(public controlNotifs: ControlNotificacionesService) {
        effect((onCleanup) => {
            const ESTADO_NOTIFS = this.controlNotifs.estado_notifiaciones();
            this.notificaciones.update(() => ESTADO_NOTIFS);
            onCleanup(() => {});
        });
    }

    notificaciones: WritableSignal<EspecificacionServicioNotificacion> = signal(
        {
            alert: [],
            modal: [],
            toast: []
        }
    );
}
