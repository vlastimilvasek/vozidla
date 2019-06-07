import { ParamsService } from '../_services/params.service';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LOGO_200x100 } from '../../assets/params/loga';

@Component({
    selector: 'app-udaje',
    templateUrl: './udaje.component.html',
    styleUrls: ['./udaje.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class UdajeComponent implements OnInit, OnChanges {
    @Input() data;
    @Input() r;
    @Input() submitted;
    @Input() layout;
    lists = {
        povolani: [],
        profese: [],
    };

    LOGA = LOGO_200x100;

    locale = 'cs';
    bsConfig: Partial<BsDatepickerConfig>;
    minDate: Date;
    maxDate: Date;
    bsValue;

    constructor(private paramsService: ParamsService, private localeService: BsLocaleService) { }

    prepocetCeny(kod: string): void {
        setTimeout(() => {
            // aktuální hodnota připojištění
            const value = Number(this.r.param_obj[kod].hodnota);
            const prip = this.r.extra.filter(e => e.kod === kod)[0];
            console.log('UDAJE prepocet ceny - kod, value : ', kod + ': ' + value);
            // výběr připojištění ovlivňuje více parametrů produktu
            /*
            if ( Array.isArray(prip.hodnota.linked) ) {
                prip.hodnota.linked.forEach( (p) => {
                    if (typeof p === 'object' && p !== null) {
                        console.log('UDAJE prepocet ceny - opt : ', prip.hodnota.options.filter(e => e.value === value ));
                        this.data.extra[p.kod] = prip.hodnota.options.filter(e => e.value === value)[0].hodnoty[p.kod];
                    }
                });
            */
            const volba = prip.hodnota.options.filter(e => e.value === value )[0];
            if (typeof volba.hodnoty === 'object' && volba.hodnoty !== null) {
                let changes = {};
                Object.keys(volba.hodnoty).forEach(function(p) {
                        // console.log('UDAJE prepocet ceny - volba : ', volba);
                        console.log('UDAJE prepocet ceny - nastavuji hodnotu : ', p + ': ' + volba.hodnoty[p]);
                        // nelze měni data napřímo, nějaké chyba v life cyklu, není definováno this - proto dvakrát forEach
                        changes[p] = volba.hodnoty[p];
                });
                console.log('UDAJE prepocet ceny - changes : ', changes);
                Object.keys(changes).forEach( (p) => {
                    // u ovlivněného parametru může být nastaven filtr, u měněného nastavit přímo (jinak zacyklení)
                    if (p === kod) {
                        this.data.extra[p] = changes[p];
                    } else {
                        this.data.extra[p] = Math.max( changes[p], this.data.extra[p]);
                    }
                });
            } else {
                // výběr připojištění ovlivňuje jen jeden parametr produktu
                this.data.extra[kod] = value;
            }
        });
    }


    ngOnInit() {
        this.localeService.use(this.locale);
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default', dateInputFormat: 'D.M.YYYY' });
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
        this.maxDate.setDate(this.maxDate.getDate() + 91);
        setTimeout(() => {
            // this.profeseList();
        }, 50);
    }

    ngOnChanges() {
        // this.r = this.offers.filter( x => x.id === this.data.produkt)[0];
        console.log('UDAJE - OnChanges produkt r : ', this.r);
        this.r.extra.forEach( (p) => {
            if (p.typ === 'select' && p.hodnota.options.length) {
                p.hodnota.options.forEach( (o) => {
                    if (o.value > 0) {
                        o.label += '&nbsp;&nbsp;&nbsp;(+' + o.cena + ' Kč)';
                    }
                });
            }
        });
    }
}
