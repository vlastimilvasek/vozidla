import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
    selector: 'app-pojisteny',
    templateUrl: './pojisteny.component.html',
    styleUrls: ['./pojisteny.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PojistenyComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    lists = {
        pojisteny: [],
    };
    adresy = {
        pojisteny: '',
    };

    constructor(private paramsService: ParamsService) { }

    ngOnInit() {
        this.adresy = {
            pojisteny: 'p_',
        };
        this.lists.pojisteny = this.paramsService.getOsoby();
    }

}
