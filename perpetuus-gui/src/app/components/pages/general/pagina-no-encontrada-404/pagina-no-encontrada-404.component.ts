import { Component } from '@angular/core';
import { StandardRoutingService } from 'src/app/services/utiles/estructurales/standard-routing/standard-routing.service';

@Component({
    selector: 'app-pagina-no-encontrada-404',
    imports: [],
    templateUrl: './pagina-no-encontrada-404.component.html',
    styleUrl: './pagina-no-encontrada-404.component.scss'
})
export class PaginaNoEncontrada404Component {
    constructor(private standard_routing_service: StandardRoutingService) {}

    go_back() {
        this.standard_routing_service.go_back();
    }
}
