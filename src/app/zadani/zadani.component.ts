import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

// Data and Service
import { ParamsService } from '../_services/params.service';
import { INgxSelectOption } from 'ngx-select-ex';

@Component({
    selector: 'app-zadani',
    templateUrl: './zadani.component.html',
    styleUrls: ['./zadani.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ZadaniComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() parentForm;
    @Input() layout;
    @ViewChild('zadani_vozidlo', { static: true }) zadaniVozidlo: any;


    lists = {
        znacka: [],
        model: [],
        druh: [],
        rok_vyroby: [],
        palivo: [],
        uziti: [],
        najezd: [],
        pojistnik: [],
        provozovatel: [],
        psc: [],
        castiobce: [],
        ppsc: [],
        pcastiobce: []
    };
    submitted = false;
    druh = 0;
    posunVozidlo;
    subformVozidlo;

    constructor(private paramsService: ParamsService, private scrollService: ScrollToService) { }

    public vyberDruh( druh: number): void {
        // console.log('ZADANI - vyberDruh: ', druh);
        this.submitted = false;
        this.data.vozidlo.druh = druh;
        this.layout.controls.druh = ( [1, 11, 2].indexOf(this.data.vozidlo.druh) !== -1) ? this.data.vozidlo.druh : 99;

        const config: ScrollToConfigOptions = {
            target: 'pojisteni',
            duration: 400,
            offset: -20
        };
        this.scrollService.scrollTo(config);
    }

    public vyberPoj( pojisteni: string): void {
        this.submitted = false;
        setTimeout(() =>  {
            this.data.pojisteni = pojisteni;
            this.posunVozidlo = this.parentForm.form.controls.zadani.controls.zadani_vozidlo.valid;
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
            // console.log(modely);
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

    obecList( change: boolean = false, event = null ): void {
        let psc = 0;
        if (change) {
            this.data.pojistnik.adresa.cast_obce_id = '';
            this.data.pojistnik.adresa.adr_id = '';
            this.data.pojistnik.adresa.obec = '';
            this.data.pojistnik.adresa.psc = psc = event;
        } else {
            psc = Number(this.data.pojistnik.adresa.psc);
        }
        // console.log('obecList - change', change);
        // console.log('obecList - event', event);
        // console.log('obecList - psc', psc);
        if ( psc >= 10000) {
            const options = [];
            this.paramsService.getHledej('obec-cast', '', this.data.pojistnik.adresa).subscribe( casti => {
                console.log('casti obce : ', casti);
                casti.forEach( opt => {
                    options.push( {
                        label: opt.nazev,
                        value: opt.id,
                        obec: opt.nazev_obce
                    });
                });
                if (casti.length === 1) {
                    this.data.pojistnik.adresa.cast_obce_id = casti[0].id;
                    this.data.pojistnik.adresa.obec = casti[0].nazev_obce;
                }
                this.lists.castiobce = options;
            });
        }
    }

    selectCoid(options: INgxSelectOption[], osoba: string): void {
        // console.log('ZADANI selectCoid - event ', options);
        this.data[osoba].adresa.obec = options[0].data.obec;
    }

    pobecList( change: boolean = false, event = null ): void {
        let psc = 0;
        if (change) {
            this.data.provozovatel.adresa.cast_obce_id = '';
            this.data.provozovatel.adresa.adr_id = '';
            this.data.provozovatel.adresa.obec = '';
            this.data.provozovatel.adresa.psc = psc = event;
        } else {
            psc = Number(this.data.provozovatel.adresa.psc);
        }
        // console.log('pobecList - change', change);
        // console.log('pobecList - event', event);
        // console.log('pobecList - psc', psc);
        if ( psc >= 10000) {
            const options = [];
            this.paramsService.getHledej('obec-cast', '', this.data.provozovatel.adresa).subscribe( casti => {
                console.log('p casti obce : ', casti);
                casti.forEach( opt => {
                    options.push( {
                        label: opt.nazev,
                        value: opt.id,
                        obec: opt.nazev_obce,
                    });
                });
                if (casti.length === 1) {
                    this.data.provozovatel.adresa.cast_obce_id = casti[0].id;
                    this.data.provozovatel.adresa.obec = casti[0].nazev_obce;
                }
                this.lists.pcastiobce = options;
            });
        }
    }

    zmenaFormulare(change: boolean = true): void {
        this.submitted = this.parentForm.submitted;
        if (change) {
            this.subformVozidlo = (this.data.pojisteni) ? this.parentForm.form.controls.zadani.controls.zadani_vozidlo.valid : 0;
            // console.log('ZADANI posun vozidlo : ', this.posunVozidlo + ' ' + this.subformVozidlo);
            if (this.subformVozidlo && this.posunVozidlo !== this.subformVozidlo) {
                const config: ScrollToConfigOptions = {
                    target: 'udaje_osoby',
                    duration: 400,
                    offset: -10
                };
                setTimeout(() => {
                    this.scrollService.scrollTo(config);
                }, 1000);
                this.posunVozidlo = this.subformVozidlo;
            }
        }
    }

    nastavSeznamy(): void {
        this.lists.druh = this.paramsService.getDruhVozidla();
        this.lists.znacka = this.paramsService.getZnacka();
        this.lists.rok_vyroby = this.paramsService.getRokVyroby();
        this.lists.palivo = this.paramsService.getPalivo();
        this.lists.uziti = this.paramsService.getUziti();
        this.lists.najezd = this.paramsService.getNajezd();
        this.lists.pojistnik = this.paramsService.getOsoby();
        this.lists.provozovatel = this.paramsService.getOsoby();
        this.lists.psc = Observable.create((observer: any) => {
            observer.next(this.data.pojistnik.adresa.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data.pojistnik.adresa)));
        this.lists.ppsc = Observable.create((observer: any) => {
            observer.next(this.data.provozovatel.adresa.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data.provozovatel.adresa)));

        this.obecList();
        this.pobecList();
        this.modelList();
        if (this.data.vozidlo.druh) {
            this.layout.controls.druh = ([1, 11, 2].indexOf(this.data.vozidlo.druh) !== -1) ? this.data.vozidlo.druh : 99;
        }
    }


    ngOnInit() {
        this.zmenaFormulare(false);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                const change = changes[propName];
                console.log('ZADANI ngOnChanges ', propName);
                switch (propName) {
                    case 'data': {
                        this.nastavSeznamy();
                        console.log('ZADANI - ngOnChanges data ', this.data);
                        if (change.previousValue != change.currentValue) {
                            // console.log('puvodni ', JSON.stringify(change.previousValue));
                            // console.log('nova ', JSON.stringify(change.previousValue));
                        }


                        break;

                    }
                    case 'parentForm': {

                        break;
                    }
                }
            }
        }
    }

}
