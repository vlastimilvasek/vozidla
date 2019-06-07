import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
    selector: 'app-zadani',
    templateUrl: './zadani.component.html',
    styleUrls: ['./zadani.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ZadaniComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() offers;
    @Input() filters;
    @Input() parent_form;
    @Input() layout;


    lists = {
        znacka: [],
        model: [],
        druh: [],
        rok_vyroby: [],
        palivo: [],
        uziti: [],
        pojistnik: [],
        provozovatel: [],
        psc: [],
        castiobce: [],
        ppsc: [],
        pcastiobce: []
    };
    submitted = false;
    druh = 0;
    posun_vozidlo;
    subform_vozidlo;

    constructor(private paramsService: ParamsService, private scrollService: ScrollToService) { }

    public vyberDruh( druh: number): void {
        this.submitted = false;
        setTimeout(() =>  {
            if (druh === 99) {
                this.druh = druh;
                this.data.vozidlo.druh = null;
            } else {
                if ( [1, 11, 2].indexOf(druh) !== -1 ) {
                    this.druh = 0;
                } else {
                    this.druh = 99;
                }
                this.data.vozidlo.druh = druh;
            }
        }, 10);
        const config: ScrollToConfigOptions = {
            target: 'pojisteni',
            duration: 400,
            offset: -20
        };
        this.scrollService.scrollTo(config);
    }

    public vyberPoj( pojisteni: string): void {
        this.submitted = false;
        this.filters = {};
        this.offers = [];
        setTimeout(() =>  {
            this.data.pojisteni = pojisteni;
            this.posun_vozidlo = this.parent_form.form.controls.zadani.controls.zadani_vozidlo.valid;
        }, 10);
        const config: ScrollToConfigOptions = {
            target: 'udaje_vozidlo',
            duration: 400,
            offset: -10
        };
        this.scrollService.scrollTo(config);
    }

    modelList( change: boolean = false ): void {
        if (change) { this.data.vozidlo.typ = ''; }
        if (this.data.vozidlo.znacka) {
            const options = [];
            const modely = this.paramsService.getModel().filter( opt => opt.znacka === this.data.vozidlo.znacka );
            console.log(modely);
            modely.forEach( opt => {
                options.push( {
                    label: opt.label,
                    value: opt.value
                });
            });
            if (modely.length === 1) { this.data.vozidlo.typ = modely[0].value; }
            this.lists.model = options;
        }
    }

    obecList( change: boolean = false ): void {
        if (change) { this.data.pojistnik.adresa.cast_obce_id = ''; this.data.pojistnik.adresa.adr_id = ''; }
        if (this.data.pojistnik.adresa.psc >= 10000) {
            const options = [];
            this.paramsService.getHledej('obec-cast', '', this.data.pojistnik.adresa).subscribe( casti => {
                console.log('casti obce : ', casti);
                casti.forEach( opt => {
                    options.push( {
                        label: opt.nazev,
                        value: opt.id
                    });
                });
                if (casti.length === 1) { this.data.pojistnik.adresa.cast_obce_id = casti[0].id; }
                this.lists.castiobce = options;
            });
        }
    }

    pobecList( change: boolean = false ): void {
        if (change) { this.data.provozovatel.adresa.cast_obce_id = ''; this.data.provozovatel.adresa.adr_id = ''; }
        if (this.data.provozovatel.adresa.psc >= 10000) {
            const options = [];
            this.paramsService.getHledej('obec-cast', '', this.data.provozovatel.adresa).subscribe( casti => {
                console.log('p casti obce : ', casti);
                casti.forEach( opt => {
                    options.push( {
                        label: opt.nazev,
                        value: opt.id
                    });
                });
                if (casti.length === 1) { this.data.provozovatel.adresa.cast_obce_id = casti[0].id; }
                this.lists.pcastiobce = options;
            });
        }
    }

    ngOnInit() {
        this.lists.druh = this.paramsService.getDruhVozidla();
        this.lists.znacka = this.paramsService.getZnacka();
        this.lists.rok_vyroby = this.paramsService.getRokVyroby();
        this.lists.palivo = this.paramsService.getPalivo();
        this.lists.uziti = this.paramsService.getUziti();
        this.lists.pojistnik = this.paramsService.getOsoby();
        this.lists.provozovatel = this.paramsService.getOsoby();
        this.lists.psc = Observable.create((observer: any) => {
            observer.next(this.data.pojistnik.adresa.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data.pojistnik.adresa)));
        this.lists.ppsc = Observable.create((observer: any) => {
            observer.next(this.data.provozovatel.adresa.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data.provozovatel.adresa)));

        this.submitted = this.parent_form.submitted;

        if ( [1, 11, 2].indexOf(this.data.vozidlo.druh) !== -1 || this.data.vozidlo.druh === null ) {
            this.druh = null;
        } else  {
            this.druh = 99;
        }
    }
    ngOnChanges() {
        setTimeout(() => {
            this.modelList();
            // this.obecList(false);
            // this.pobecList(false);
        });

        this.subform_vozidlo = (this.data.pojisteni) ? this.parent_form.form.controls.zadani.controls.zadani_vozidlo.valid : false;
        console.log('posun vozidlo : ', this.posun_vozidlo + ' ' + this.subform_vozidlo);
        if (this.subform_vozidlo && this.posun_vozidlo !== this.subform_vozidlo) {
            const config: ScrollToConfigOptions = {
                target: 'udaje_osoby',
                duration: 400,
                offset: -10
            };
            setTimeout(() => {
                this.scrollService.scrollTo(config);
            }, 1000);
            this.posun_vozidlo = this.subform_vozidlo;
        }

    }
}
