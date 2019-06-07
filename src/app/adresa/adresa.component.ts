import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css'],
  providers: [ ParamsService ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class AdresaComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() prefix;
    lists;
    GrName;

    constructor(private paramsService: ParamsService) { }

    ObecOnSelect(e: TypeaheadMatch): void {
        this.data.cast_obce_id = e.item.casti_obce_id;
        // console.log('Selected value: ', e);
    }

    ObecChange(obec): void {
        if (!obec) { this.data.cast_obce_id =  this.data.adr_id = ''; }
    }

    CPOnSelect(e: TypeaheadMatch): void {
        this.data.cp = e.item.cislo;
        this.data.psc = e.item.psc;
        this.data.obec = e.item.obec;
        this.data.adr_id = e.item.id;
        this.data.cast_obce_id = e.item.casti_obce_id;
    }

    ngOnInit() {
        this.lists = {
            ulice: [],
            obec: [],
            cp: [],
            psc: []
        };

        this.GrName = this.prefix + 'adresa';
        // console.log('GrName ', this.GrName);

        this.lists.ulice = Observable.create((observer: any) => {
            observer.next(this.data.ulice);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('ulice', token, this.data)));

        this.lists.cp = Observable.create((observer: any) => {
            observer.next(this.data.cp);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('cp', token, this.data)));

        this.lists.obec = Observable.create((observer: any) => {
            observer.next(this.data.obec);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('obec-cast', token, this.data)));

        this.lists.psc = Observable.create((observer: any) => {
            observer.next(this.data.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data)));
    }

}
