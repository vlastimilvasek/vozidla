import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { LOGO_200x100 } from '../assets/params/loga';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfSrovnani from './_pdf-templates/srovnani';

// Data and Service
import { IVozidla, ISrovnani } from './_interfaces/vozidla';
import { ParamsService } from './_services/params.service';
import { DataService } from './_services/data.service';
import { SrovnaniComponent } from './srovnani/srovnani.component';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
    selector: 'app-main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ ParamsService ]
})
export class AppComponent implements OnInit, OnDestroy {
    LOGA = LOGO_200x100;
    data: IVozidla;
    srovnani: ISrovnani;
    vprodukt;
    translate: TranslateService;
    offers = [];
    nvoffers = [];
    filters;
    layout = {
        grid: {
            column : 'col-lg-6',
            label : 'col-sm-5',
            input : 'col-sm-7',
            offset : 'offset-sm-5',
            label2 : 'col-lg-8 col-sm-5',
            input2 : 'col-lg-4 col-sm-7',
            column1 : 'order-3 order-md-0 col-md-7 col-lg-6 col-xl-7',
            column2 : 'order-2 col-md-5 col-lg-5 offset-lg-1 col-xl-4',
            info1 : 'col-sm-3 col-md-12',
            info2 : 'col-sm-9 col-md-12',
        },
        table : true,
        produktCollapsed : {},
        prvniNapoveda : true,
        form_r : {
            loading : false,
            error : false
        }
    };
    kalk_aktivni = false;
    layouthelper = 'none';
    filtrCollapsed = true;
    URL = { adresa : '' };
    mail_odeslan = false;
    data_loading = false;
    valueChangesSubscriber = [];
    pojisteniText = {OBODP: 'občanská odpovědnost', ZAMODP : 'odpovědnost zaměstnance'}; // jen pro jméno PDFka
    @ViewChild('f', { static: true }) zadaniForm: any;
    @ViewChild('filtry', { static: true }) filtrForm: any;
    @ViewChild('kalk_email', { static: true }) emailForm: any;
    @ViewChild('o', { static: true }) osobniForm: any;
    @ViewChild('u', { static: true }) udajeForm: any;
    @ViewChild('ob', { static: true }) objektForm: any;
    @ViewChild(SrovnaniComponent, { static: true }) srovnaniCmp: SrovnaniComponent;
    @ViewChild('debugModal', { static: true }) debugModal: any;
    @ViewChild('filtrHint', { static: true }) filtrHint: any;
    @ViewChild('stepTabs', { static: true }) staticTabs: TabsetComponent;
    @ViewChild('layoutHelper', { static: false }) layoutHelper: any;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // console.log(event.charCode);
        if (event.charCode === 272 || event.charCode === 240) { this.debugModal.show(); }
        if (event.charCode === 248 || event.charCode === 321) { this.layouthelper = this.layouthelper === 'none' ? '' : 'none'; }
    }

    constructor(translate: TranslateService, public dataservice: DataService, private paramsService: ParamsService, private route: ActivatedRoute, private router: Router) {
        this.translate = translate;
        this.translate.addLangs(['cs', 'en']);
        this.translate.setDefaultLang('cs');
        const lang = this.route.snapshot.queryParams['lang']  || 'cs';
        this.translate.use(lang);
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    KalkulaceEmail(form: any): void {
        if (form.valid) {
            this.GAEvent('VOZ', 'Kalkulace', 'Zaslání na email', 1);
            if (this.data.id !== '' ) {
                this.data.link = this.URL.adresa;
                this.paramsService.KalkulaceEmail( this.data )
                .subscribe( resp => {
                    // console.log('poslat na email resp ', resp);
                    if (resp) {
                        this.mail_odeslan = true;
                    }
                });
            }
        }
    }

    GAEvent(cat: string, label: string, action: string, val: number): void {
        (<any>window).ga('send', 'event', {
            eventCategory: cat,
            eventLabel: label,
            eventAction: action,
            eventValue: val
        });
    }

    public openPDF(): void {
        const dd = pdfSrovnani.srovnani(this.offers);
        pdfMake.createPdf(dd).download('nabídky - ' + this.pojisteniText[this.data.pojisteni] + '.pdf');
    }

    submitZadani(form: any): void {
        // console.log(this.zadaniForm.value);
        // this.zadaniForm.reset();
        if (form.valid) {
            // console.log('Form Data - zadani: ');
            // console.log(this.zadaniForm);
            // this.data = Object.assign(this.data, form.value);
            // this.kalkuluj();
            this.staticTabs.tabs[1].active = true;
        }
    }

    submitUdaje(form: any): void {
        if (form.valid) {
            this.staticTabs.tabs[3].active = true;
        }
    }

    submitObjekt(form: any): void {
        if (form.valid) {
            this.staticTabs.tabs[4].active = true;
        }
    }

    submitOsobni(form: any): void {
        if (form.valid) {
            this.staticTabs.tabs[5].active = true;
        }
    }

    sjednat(form: any): void {
        if (form.valid) {
            this.layout.form_r.loading = true;
            this.paramsService.ulozSjednani(this.data)
                .subscribe( sjednani => {
                    console.log('sjednat - resp: ', sjednani);
                    if ( sjednani.status === 'OK' ) {
                        this.layout.form_r.loading = false;
                        this.router.navigate(['/zaver']);
                    } else if ( sjednani.status === 'ER' ) {
                        this.layout.form_r.loading = false;
                        this.layout.form_r.error = true;
                    }
                },
                    error => {
                        console.log('sjednat - error: ', error);
                        this.layout.form_r.loading = false;
                    }
                );
            // console.log('Data: ', this.data);
        }
    }

    zmenPojisteni(pojisteni: string): void {
        this.offers = [];
        this.nvoffers = [];
        this.filters = {};
        this.data.pojisteni = pojisteni;
        console.log('zmenPojisteni - filters : ', this.filters);
    }

    vyberProdukt(id: number): void {
        console.log('vyberProdukt : ', id);
        this.data.produkt = id;
        this.vprodukt = this.offers.filter( x => x.id === this.data.produkt)[0];
        console.log('vyberProdukt - produkt : ', this.vprodukt);
        this.staticTabs.tabs[2].active = true;
    }

    tabSrovnani(): void {
        if (!this.offers.length && !this.kalk_aktivni && this.zadaniForm.valid) {
            this.kalkuluj();
        }
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    kalkuluj(): void {
        const produkt = this.data.produkt;
        const produktyId = [];
        this.kalk_aktivni = true;
        this.filtrCollapsed = true;
        this.vprodukt = null;
        this.data.produkt = null;
        this.offers = [];
        this.nvoffers = [];
        this.paramsService.getSrovnani(this.data)
            // .map( (i) => { console.log('getSrovnani', i); return i; } )
            .subscribe( srovnani => {
                this.srovnani = srovnani;
                this.data.id = srovnani.id;
                this.URL.adresa = window.location.origin + window.location.pathname + '/?id=' + srovnani.id;

                const items = [];
                const partneri = [];
                const partnobj = {};
                const partnobj_old = this.filters.partnobj || {};  // uchování nastavení při pře-kalkulaci
                const platby = [];

                this.kalk_aktivni = false;
                console.log('APP kalkuluj - srovnani ', this.srovnani );

                srovnani.items.forEach( (x) => {
                    const pplatby = [];
                    // console.log('APP kalkuluj - produkt params ', JSON.stringify(x.params) );
                    produktyId.push(x.id);
                    if ( partneri.indexOf(x.pojistovna) === -1 ) {
                        partneri.push( x.pojistovna );
                        partnobj[x.pojistovna] = (partnobj_old[x.pojistovna] !== undefined) ? partnobj_old[x.pojistovna] : true;
                    }
                    if ( Object.keys(this.layout.produktCollapsed).indexOf(x.id) === -1 ) {
                        this.layout.produktCollapsed[x.id] = true;
                    }
                    Object.keys(x.platby).forEach(function(key) {
                        if (x.platby[key] > 0 && platby.indexOf(Number(key)) === -1) { platby.push(Number(key)); }
                        if (x.platby[key] > 0) { pplatby.push({ key : Number(key), value : x.platby[key]}); }
                    });
                    x.pplatby = pplatby;

                    // kontrola připojištění - extra
                    const types = ['radio', 'select'];
                    // console.log('pocet extras : ', this.r.extra.length );
                    if (x.extra.length) {
                        const extra = x.extra.filter( e => types.indexOf( e.typ ) >= 0 );
                        x.extra = [];
                        extra.forEach( (e) => {
                            if (Object.keys(e).indexOf( 'hodnota' )) {
                                if (this.IsJsonString(e.hodnota)) {
                                    e.hodnota = JSON.parse(e.hodnota);
                                    if (Object.keys(e.hodnota).indexOf( 'options' )) {  // uprava options na pole
                                        const opt = [];
                                        Object.keys(e.hodnota.options).forEach( (o) => {
                                            opt.push(e.hodnota.options[o]);
                                        });
                                        e.hodnota.options = opt;
                                    }
                                    x.extra.push(e);
                                } else {
                                    console.log('chybný objekt extras : ', e.kod );
                                }

                            }
                        });

                    console.log('APP kalkuluj - extra : ', x.extra );
                    }
                    // nastavení parametrů podle odkazu na extra
                    Object.keys(x.params).forEach(function(key) {
                        if (x.params[key].typ === 'link') {
                            const kod = x.params[key].hodnota.split('.')[1];
                            // console.log('APP kalkuluj - extra kod : ', kod );
                            const extra = x.extra.filter(e => e.kod === kod)[0];
                            // console.log('APP kalkuluj - extra : ', extra );
                            if (typeof extra === 'object' && extra !== null) {
                                // jedno připojištění má vliv na víc parametrů
                                if (typeof extra.hodnota.linked === 'object' && extra.hodnota.linked !== null) {
                                    x.params[key].options = extra.hodnota.linked.filter(e => e.kod === key)[0].options;
                                } else {
                                    x.params[key].options = extra.hodnota.options;
                                }
                                x.params[key].default = extra.hodnota.default;
                                if ( typeof extra.hodnota.default === 'object' && extra.hodnota.default !== null ) {
                                    x.params[key].hodnota = Number(extra.hodnota.default[key]);
                                } else {
                                    x.params[key].hodnota = Number(extra.hodnota.default);
                                }

                            }
                        } else if (x.params[key].typ === 'number') {  // nastavení parametrů podle typu
                            x.params[key].hodnota = Number(x.params[key].hodnota);
                        } else if (x.params[key].typ === 'bool') {
                            x.params[key].hodnota = Number(x.params[key].hodnota);
                            // console.log('APP kalkuluj - param bool : ', JSON.stringify(x.params[key]) );
                        }
                    });

                    const params = [];
                    x.param_obj = x.params;
                    Object.keys(x.params).forEach(function(key) {
                        params.push(x.params[key]);
                    });
                    x.params = params;
                    items.push( Object.assign({}, x) );
                });

                this.filters.partneri = partneri;
                this.filters.partnobj = partnobj;
                this.filters.platby = platby;
                items.sort(function(a, b) { return a.ordering - b.ordering; });

                this.offers = this.nvoffers = items;
                // console.log('APP kalkuluj - produkt : ', produkt );
                // console.log('APP kalkuluj - produktyId : ', produktyId );
                if (produkt && produktyId.indexOf(produkt) !== -1) { // zkusím zachovat vybraný produkt při přepočtu
                    this.data.produkt = produkt;
                    this.vprodukt = this.offers.filter( x => x.id === this.data.produkt)[0];
                }

                // setTimeout(() =>  { this.srovnaniCmp.priprav_data(); }, 1);
                this.filtruj_nabidky();
                if (this.layout.prvniNapoveda) { this.filtrHint.show(); }
                setTimeout(() =>  { this.layout.prvniNapoveda = false;  }, 8000);

            });
    }

    filtruj_nabidky(): void {
        // console.log('this.filters.partnobj : ', this.filters.partnobj);
        console.log('APP filtruj_nabidky - offers před filtry : ', this.nvoffers);
        this.offers = this.nvoffers.filter( x => this.filters.partnobj[x.pojistovna] > 0);
        this.offers = this.offers.filter( x => Number(x.platby[this.data.platba]) > 0);
        this.offers = this.offers.filter( x => Number(x.param_obj.zdr.hodnota) >= this.filters.min_zdr);
        // úprava produktu podle požadavku na rozšíření
        this.offers.forEach( (x) => {
            let extrasCena = 0;
            const pripojisteni = {};
            let extras = ['skl', 'asn', 'asp', 'nv', 'pa', 'ur', 'zav', 'vb', 'ren', 'gc', 'zver', 'zivel', 'odc', 'vlsk'];
            let i = 0;
            while (extras[i]) {
                // u "balíčků" musím případně opakovaně ověřovat hodnoty provázaných parametrů
            // extras.forEach( (e) => {
                const e = extras[i];
                i++;
                // console.log('APP filtruj_nabidky - e (extra) x (produkt) : ', x.param_obj[e]);
                // console.log('APP filtruj_nabidky - podle : ', e);
                // má produkt takové připojištění?
                if (typeof x.param_obj[e] === 'object' && x.param_obj[e] !== null && x.param_obj[e].typ === 'link') {
                    // výchozí hodnota
                    if ( typeof x.param_obj[e].default === 'object' && x.param_obj[e].default !== null ) {
                        Object.keys(x.param_obj[e].default).forEach( (p) => {
                            x.param_obj[p].hodnota = x.param_obj[e].default[p];
                        });
                    } else {
                        x.param_obj[e].hodnota = x.param_obj[e].default;
                    }
                    // console.log('APP filtruj_nabidky - x.param_obj.e : ', x.param_obj[e]);
                    if (Number(x.param_obj[e].hodnota) < this.data.extra[e] ) { // lze navýšit?
                        const opt = x.param_obj[e].options.filter(o => Number(o.value) >= this.data.extra[e])[0];
                        if (typeof opt === 'object' && opt !== null) {
                            // výběr připojištění ovlivňuje více parametrů produktu
                            if ( Array.isArray(opt.linked) ) {
                                opt.linked.forEach( (p) => {
                                    if (typeof p === 'object' && p !== null) {
                                        const lkod = Object.keys(p)[0];
                                        x.param_obj[lkod].hodnota = p[lkod];
                                        console.log('APP filtruj_nabidky - opt linked : ', lkod + ' ' +p[lkod]);
                                        if (Number(x.param_obj[lkod].hodnota) < this.data.extra[lkod] ) {
                                            // když hodnota provázaného parametru nesplňuje filtr, musím znova projít filtrováním
                                            extras.push(lkod);
                                            console.log('APP filtruj_nabidky - nedostatečný opt linked : ', lkod + ' ' +p[lkod] + ' ' +this.data.extra[lkod]);
                                        } else {
                                            // když je hodnota OK, tak znova nechci procházet, byla by nastavena na default parametru
                                            extras = extras.filter(o => o !== lkod);
                                            // a dopočítám cenu - volba provázaného parametru buď podle hodnoty jeho filtru nebo odkazujícího parametru
                                            const lopt = x.param_obj[lkod].options.filter(o => Number(o.value) >= Math.max(this.data.extra[lkod], p[lkod]) )[0];
                                            console.log('APP filtruj_nabidky - opt linked dopočítání ceny : ', lopt);
                                            if (typeof lopt === 'object' && lopt !== null) {
                                                pripojisteni[lkod] = Number(lopt.cena);
                                            }
                                            console.log('APP filtruj_nabidky - opt linked pripojisteni : ', pripojisteni);
                                        }
                                    }
                                });
                            }
                            x.param_obj[e].hodnota = Number(opt.value);
                            // console.log('APP filtruj_nabidky - opt[0] : ', opt);
                            pripojisteni[e] = Number(opt.cena);
                            // console.log('APP filtruj_nabidky - pripojisteni : ', pripojisteni);
                        }
                    }
                }
            }
            Object.keys(pripojisteni).forEach(key => { extrasCena += pripojisteni[key]; });
            // console.log('APP filtruj_nabidky - cena pripojisteni : ', x.id + ': ' + extrasCena);
            // console.log('APP filtruj_nabidky - ceny pripojisteni : ', pripojisteni);
            const pplatby = [];
            x.vypocet = {};
            Object.keys(x.platby).forEach(function(key) {
                // Výpočet plateb
                // console.log('APP filtruj_nabidky - platby key : ', key);
                if ( ['AXA', 'ČSOB'].indexOf(x.pojistovna) !== -1 ) {
                    if (x.platby[key] > 0) { x.platby[key] = Math.floor( ( Math.floor(x.pov_cena * x.pov_sleva * x.k_platby[Number(key)]) + x.pov_fix + extrasCena) * x.c_platby[Number(key)]); }
                    x.vypocet[key] = 'floor( floor(' + x.pov_cena + '*' + x.pov_sleva + '*' + x.k_platby[Number(key)] + ') + ' + x.pov_fix + '+' + extrasCena + ')*' + x.c_platby[Number(key)] + ')';                        
                } else {
                    if (x.platby[key] > 0) { x.platby[key] = Math.round( ((x.pov_cena * x.pov_sleva * x.k_platby[Number(key)]) + x.pov_fix + extrasCena) * x.c_platby[Number(key)]); }
                    x.vypocet[key] = 'round( (' + x.pov_cena + '*' + x.pov_sleva + '*' + x.k_platby[Number(key)] + ') + ' + x.pov_fix + '+' + extrasCena + ')*' + x.c_platby[Number(key)] + ')';
                }
                if (x.platby[key] > 0) { pplatby.push({ key : Number(key), value : x.platby[key]}); }
            });
            x.pripojisteni = pripojisteni;
            x.pplatby = pplatby;
        });
        this.offers = this.offers.filter( x => Number(x.param_obj.skl.hodnota) >= this.data.extra.skl);
        this.offers = this.offers.filter( x => Number(x.param_obj.asn.hodnota) >= this.data.extra.asn);
        this.offers = this.offers.filter( x => Number(x.param_obj.asp.hodnota) >= this.data.extra.asp);
        this.offers = this.offers.filter( x => Number(x.param_obj.nv.hodnota) >= this.data.extra.nv);

        this.offers = this.offers.filter( x => Number(x.param_obj.pa.hodnota) >= this.data.extra.pa);
        this.offers = this.offers.filter( x => Number(x.param_obj.ur.hodnota) >= this.data.extra.ur);
        this.offers = this.offers.filter( x => Number(x.param_obj.zav.hodnota) >= this.data.extra.zav);
        this.offers = this.offers.filter( x => Number(x.param_obj.vb.hodnota) >= this.data.extra.vb);
        this.offers = this.offers.filter( x => Number(x.param_obj.ren.hodnota) >= this.data.extra.ren);
        this.offers = this.offers.filter( x => Number(x.param_obj.gc.hodnota) >= this.data.extra.gc);
        this.offers = this.offers.filter( x => Number(x.param_obj.zver.hodnota) >= this.data.extra.zver);
        this.offers = this.offers.filter( x => Number(x.param_obj.zivel.hodnota) >= this.data.extra.zivel);
        this.offers = this.offers.filter( x => Number(x.param_obj.odc.hodnota) >= this.data.extra.odc);
        this.offers = this.offers.filter( x => Number(x.param_obj.vlsk.hodnota) >= this.data.extra.vlsk);

        if (this.data.pojisteni === 'HAV') {
            this.offers = this.offers.filter( x => Number(x.param_obj.zdr.hodnota) >= this.filters.min_zdr);
            this.offers = this.offers.filter( x => Number(x.param_obj.maj.hodnota) >= this.filters.min_maj);
            this.offers = this.offers.filter( x => Number(x.param_obj.spol.hodnota) <= (this.filters.spoluuc ? 0 : 100000) );
        }
        console.log('offers po filtrech : ', this.offers);
        function sortp(c: number) { return (a, b) => { return a.platby[c] - b.platby[c]; }; }
        // console.log(a.platby[c] + ' ' + b.platby[c]);
        this.offers.sort(sortp(this.data.platba));
    }

    resetFilters(): void {
        this.filters = {
            min_zdr : 0,
            min_maj : 0
        };
    }

    initData(data: IVozidla): void {
        this.data = data || {
            id: '',
            pojisteni: this.route.snapshot.queryParams.pojisteni || null,
            pojistovna: '',
            produkt: null,
            sjed_cislo: null,
            sjed_status: null,
            sjed_datum: this.route.snapshot.queryParams.sjed_datum || new Date(),
            pocatek: this.route.snapshot.queryParams.pocatek || new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            konec: '',
            pojistne: null,
            provize: null,
            extra: {
                asn : 0,
                asp : 0,
                skl : 0,
                nv : 0,
                pa: 0,
                ur: 0,
                zav: 0,
                vb: 0,
                ren: 0,
                gc: 0,
                zver: 0,
                zivel: 0,
                odc: 0,
                vlsk: 0
            },
            over_bm: true,
            bonus: null,
            malus: null,
            vozidlo: {
                druh: null,
                kategorie: null,
                uziti: 1,
                znacka: 195,
                model: 19534,
                specifikace: null,
                barva: null,
                objem_motoru: null,
                vykon_motoru: null,
                rok_vyroby: 2017,
                stav_tachometr: null,
                hmotnost: 1890,
                pocet_dveri: null,
                pocetsedadel: null,
                palivo: 2,
                cislo_reg: null,
                cislotp: null,
                vin: null
            },
            platba: 1,
            pojistnik : {
                typ : 1,
                titul : '',
                titul_za : '',
                jmeno : '',
                prijmeni : '',
                spolecnost : '',
                rc : '',
                ic : '',
                platce_dph : false,
                telefon : '',
                email : '',
                adresa : {
                    psc : null,
                    cast_obce_id : null,
                    obec : '',
                    ulice : '',
                    cp : '',
                    adr_id : null
                },
                kadresa : false,
                kor_adresa : {
                    psc : null,
                    cast_obce_id : null,
                    obec : '',
                    ulice : '',
                    cp : '',
                    adr_id : null
                }
            },
            pojistenypojistnik: true,
            pojisteny: {
                typ : 1,
                titul : '',
                titul_za : '',
                jmeno : '',
                prijmeni : '',
                spolecnost : '',
                rc : '',
                ic : '',
                adresa : {
                    psc : '',
                    cast_obce_id : '',
                    obec : '',
                    ulice : '',
                    cp : '',
                    adr_id : ''
                },
            },
            pojistnikvlastnik: true,
            vlastnik: {
                typ : 1,
                titul : '',
                titul_za : '',
                jmeno : '',
                prijmeni : '',
                spolecnost : '',
                rc : '',
                ic : '',
                adresa : {
                    psc : '',
                    cast_obce_id : null,
                    obec : '',
                    ulice : '',
                    cp : '',
                    adr_id : null
                },
            },
            pojistnikprovozovatel: true,
            provozovatel: {
                typ : 1,
                titul : '',
                titul_za : '',
                jmeno : '',
                prijmeni : '',
                spolecnost : '',
                rc : '',
                ic : '',
                adresa : {
                    psc : '',
                    cast_obce_id : null,
                    obec : '',
                    ulice : '',
                    cp : '',
                    adr_id : null
                },
            },
            poznamka: '',
            promo_kod: '',
            ziskatel: '',
            id_sml: null,
            ipadr: '',
            email: '',
            link: ''
        };
        this.zadaniForm.submitted = false;
    }

    ngOnInit() {
        // console.log( 'data z URL : ', this.route.snapshot.queryParams['data'] );
        this.valueChangesSubscriber['f'] = this.filtrForm.valueChanges.pipe(debounceTime(500)).subscribe(form => {
            // console.log( 'zmena filtrů : ', JSON.stringify(this.filters) );
            // console.log( 'zmena filtrů - length : ', Object.keys(this.filters).length );
            this.filtruj_nabidky();
            this.GAEvent('AUTA', 'Kalkulace', 'Filtrování nabídek', 1);
        });

        this.valueChangesSubscriber['z'] = this.zadaniForm.valueChanges.pipe(debounceTime(500)).subscribe(form => {
            console.log('změna zadaniForm');
            this.zadaniForm.submitted = false;
            this.offers = [];
            this.nvoffers = [];
            if (this.zadaniForm.valid) {
                console.log('změna zadaniForm, formulář platný a proto kalkuluji ...');
                this.kalkuluj();
            }
        });

        this.valueChangesSubscriber['e'] = this.emailForm.valueChanges.pipe(debounceTime(20)).subscribe(form => {
            this.emailForm.submitted = false;
        });

        this.valueChangesSubscriber['u'] = this.udajeForm.valueChanges.pipe(debounceTime(20)).subscribe(form => {
            this.udajeForm.submitted = false;
        });

        this.valueChangesSubscriber['ob'] = this.objektForm.valueChanges.pipe(debounceTime(20)).subscribe(form => {
            this.udajeForm.submitted = false;
        });

        this.valueChangesSubscriber['o'] = this.osobniForm.valueChanges.pipe(debounceTime(20)).subscribe(form => {
            this.osobniForm.submitted = false;
        });

        this.resetFilters();

        this.srovnani = {
            id: '',
            items: [],
            time: ''
        };

        this.initData(null);

        let input_data = null;
        if (this.route.snapshot.queryParams['id'] !== undefined ) {
            this.data_loading = true;
            this.paramsService.getKalkulace( this.route.snapshot.queryParams['id'] )
            .subscribe( data => {
                // console.log('data ', data);
                try {
                    input_data = data;
                    if (input_data.pocatek) {
                        input_data.pocatek = new Date(input_data.pocatek);
                    }
                    if (input_data.profese) {
                        input_data.profese = input_data.profese.toString();
                    }
                } catch (e) {
                    // console.log(e);
                }
                // this.initData(input_data);
                this.data =  Object.assign({}, this.data, input_data);
                setTimeout(() =>  {
                    // console.log('zadaniForm form valid', this.zadaniForm.form.valid );
                    this.data_loading = false;
                    if (this.zadaniForm.valid) {
                        this.kalkuluj();
                        this.staticTabs.tabs[1].active = true;
                    }
                }, 50);
            });
        } else if (this.route.snapshot.queryParams['data'] !== undefined ) {
            // console.log('data snapshot', this.route.snapshot.queryParams['data'] );
            try {
                input_data = JSON.parse(this.route.snapshot.queryParams['data']);
                // this.initData(input_data);
                this.data =  Object.assign({}, this.data, input_data);
            } catch (e) {
                // console.log(e);
            }
        }
        // console.log(this.zadaniForm.value);
    }
    ngOnDestroy() {
        this.dataservice.data = this.data;
        this.dataservice.vprodukt = this.vprodukt;
        this.valueChangesSubscriber['f'].unsubscribe();
        this.valueChangesSubscriber['z'].unsubscribe();
        this.valueChangesSubscriber['e'].unsubscribe();
        this.valueChangesSubscriber['u'].unsubscribe();
        this.valueChangesSubscriber['ob'].unsubscribe();
        this.valueChangesSubscriber['o'].unsubscribe();
    }
}
