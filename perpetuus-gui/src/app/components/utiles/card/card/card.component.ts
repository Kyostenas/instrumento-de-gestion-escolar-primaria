import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card',
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss'
})
export class CardComponent {
    @Input() show_header: boolean = false;
    @Input() show_body: boolean = true;
    @Input() show_footer: boolean = false;
    @Input() show_content_without_body: boolean = false;
    @Input() card_classes?: string;
    @Input() header_classes?: string;
    @Input() body_classes?: string;
    @Input() footer_classes?: string;
}
