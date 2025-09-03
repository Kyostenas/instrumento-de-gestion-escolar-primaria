import { TestBed } from '@angular/core/testing';

import { ControlQueriesUrlService } from './control-queries-url.service';

describe('ControlQueriesUrlService', () => {
    let service: ControlQueriesUrlService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ControlQueriesUrlService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
