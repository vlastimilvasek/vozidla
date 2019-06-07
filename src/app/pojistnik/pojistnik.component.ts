import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
    selector: 'app-pojistnik',
    templateUrl: './pojistnik.component.html',
    styleUrls: ['./pojistnik.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PojistnikComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    lists = {
        pojistnik: [],
    };
    adresy = {
        pojistnik: '',
        korespond: 'kor_'
    };

    constructor(private paramsService: ParamsService) { }

    ngOnInit() {
        this.adresy = {
            pojistnik: '',
            korespond: 'kor_'
        };
        this.lists.pojistnik = this.paramsService.getOsoby();
    }

}
