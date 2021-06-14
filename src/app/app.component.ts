import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { LOGO_200x100 } from '../assets/params/loga';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfSrovnani from './_pdf-templates/srovnani';

// Data and Service
import { IVozidla, Vozidla, ISrovnani } from './_interfaces/vozidla';
import { ParamsService } from './_services/params.service';
import { DataService } from './_services/data.service';
import { ZadaniComponent } from './zadani/zadani.component';
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
    offersAll = [];
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
        helper : 'none',
        produktCollapsed : {},
        filtrCollapsed : true,
        controls : {
            druh: null
        },
        prvniNapoveda : true,
        form_r : {
            loading : false,
            error : false
        },
        progress: 0,
        kalkulaceAktivni : false,
        kalkulaceMailOdeslan : false,
        dataNacitani : false
    };

    URL = { adresa : '' };
    filtrHelper = {
        debug: true,
        filtry: []
    };

    partners = {
        allianz :{kod:'axa',nazev:'Allianz',kalk:0},
        axa     :{kod:'axa',nazev:'AXA',kalk:0}
    };

    /*
,
        cpp     :{kod:'cpp',nazev:'ČPP',kalk:0},
        csob    :{kod:'csob',nazev:'ČSOB',kalk:0},
        direct  :{kod:'direct',nazev:'Direct',kalk:0},
        gcp     :{kod:'gcp',nazev:'Generali ČP',kalk:0},
        hvp     :{kod:'hvp',nazev:'HVP',kalk:0},
        pillow  :{kod:'pillow',nazev:'Pillow',kalk:0},
        pvzp    :{kod:'pvzp',nazev:'PVZP',kalk:0},
        slavia  :{kod:'slavia',nazev:'Slavia',kalk:0},    
    */
    valueChangesSubscriber = [];
    pojisteniText = {POV: 'povinné ručení', HAV : 'havarijní pojištění'}; // jen pro jméno PDFka
    @ViewChild('f', { static: true }) zadaniForm: any;
    @ViewChild('filtry', { static: true }) filtrForm: any;
    @ViewChild('kalk_email', { static: true }) emailForm: any;
    @ViewChild('o', { static: true }) osobniForm: any;
    @ViewChild('u', { static: true }) udajeForm: any;
    @ViewChild('ob', { static: true }) objektForm: any;
    @ViewChild(ZadaniComponent, { static: true }) zadaniCmp: ZadaniComponent;
    @ViewChild('debugModal', { static: true }) debugModal: any;
    @ViewChild('filtrHint', { static: true }) filtrHint: any;
    @ViewChild('stepTabs', { static: true }) staticTabs: TabsetComponent;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // console.log(event.charCode);
        if (event.key === 'Đ' || event.key === 'ð') { this.debugModal.show(); }
        if (event.key === 'Ł' || event.key === 'ø') { this.layout.helper = this.layout.helper === 'none' ? '' : 'none'; }
    }

    constructor(translate: TranslateService, public dataService: DataService, private paramsService: ParamsService,
        private scrollService: ScrollToService, private route: ActivatedRoute, private router: Router) {

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
                        this.layout.kalkulaceMailOdeslan = true;
                    }
                });
            }
        }
    }

    GAEvent(cat: string, label: string, action: string, val: number): void {
        (window as any).ga('send', 'event', {
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
        this.zadaniCmp.submitted = true;
        if (form.valid) {
            // console.log('Form Data - zadani: ');
            // console.log(this.zadaniForm);
            // this.data = Object.assign(this.data, form.value);
            this.staticTabs.tabs[1].active = true;
            const config: ScrollToConfigOptions = {
                target: 'app',
                duration: 200,
                offset: 0
            };
            this.scrollService.scrollTo(config);
            this.kalkuluj();
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
        this.offersAll = [];
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
        // console.log('APP - tabSrovnani ', !this.offers.length  && !this.layout.kalkulaceAktivni);
        if (!this.offers.length && !this.layout.kalkulaceAktivni && this.zadaniForm.valid) {
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

    nastavProdukt(x) {
        const pplatby = [];
        // console.log('APP nastavProdukt - produkt params ', JSON.stringify(x.params) );
        if ( Object.keys(this.layout.produktCollapsed).indexOf(x.id) === -1 ) {
            this.layout.produktCollapsed[x.id] = true;
        }
        Object.keys(x.platby).forEach(key => {
            if (x.platby[key] > 0 && this.filters.platby.indexOf(Number(key)) === -1) { this.filters.platby.push(Number(key)); }
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

        console.log('APP nastavProdukt - extra : ', x.extra );
        }
        // nastavení parametrů podle odkazu na extra
        Object.keys(x.params).forEach(key => {
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
        Object.keys(x.params).forEach(key => {
            params.push(x.params[key]);
        });
        x.params = params;
        return x;
    }

    kalkuluj(): void {
        const produkt = this.data.produkt;
        const produktyId = [];
        this.layout.kalkulaceAktivni = true;
        this.layout.filtrCollapsed = true;
        this.vprodukt = null;
        this.data.produkt = null;
        this.offers = [];
        this.offersAll = [];
        this.layout.progress = 1;
        let prubeh = Object.keys(this.partners).length;

        for(let i = 1; i <= 100; i++) {
            setTimeout(() => {
                this.layout.progress = prubeh ? i : 100;
            }, i*100);
        }
        // this.data.id = srovnani.id;
        this.URL.adresa = window.location.origin + window.location.pathname + '?id=' + this.data.id;

        const items = [];
        const partneri = [];
        const partnobj = {};
        const partnobjOld = this.filters.partnobj || {};  // uchování nastavení při pře-kalkulaci
        this.filters.platby = [];

        Object.keys(this.partners).forEach(pk => {
            console.log(pk);
            this.partners[pk].kalk = 0;
            this.paramsService.getPartnerKalkulace(pk, this.data).subscribe(
            resp => {
                console.log(resp);
                prubeh -= 1;
                this.partners[pk].kalk = 1;
                if (resp.kalkulace && Object.keys(resp.produkty).length) {
                    Object.keys(resp.produkty).forEach(r => {
                        // kazdy produkt:
                        let x = resp.produkty[r];
                        x = this.nastavProdukt(x);
                        items.push(x);

                        produktyId.push(x.id);
                        if ( partneri.indexOf(x.pojistovna) === -1 ) {
                            partneri.push( x.pojistovna );
                            partnobj[x.pojistovna] = (partnobjOld[x.pojistovna] !== undefined) ? partnobjOld[x.pojistovna] : true;
                        }

                        this.filters.partneri = partneri;
                        this.filters.partnobj = partnobj;
                        // items.sort((a, b) => { return a.ordering - b.ordering; });
                        // this.offers = this.offersAll = items;
                        // console.log('APP kalkuluj - produktyId : ', produktyId );
                        if (produkt && produktyId.indexOf(produkt) !== -1) { // zkusím zachovat vybraný produkt při přepočtu
                            this.data.produkt = produkt;
                            this.vprodukt = this.offers.filter( f => f.id === this.data.produkt)[0];
                        }
                    })
                }
                if (prubeh === 0) {
                    this.dokonciKalkulaci(items);
                }
            },
            error => {
                prubeh -= 1;
                this.partners[pk].kalk = -1;
                if (prubeh === 0) {
                    this.dokonciKalkulaci(items);
                }
                console.log('APP - kalkulace - error: ', error);
            }
            );

        });

        // po deseti sekundách zobraz dostupné výsledky, pakliže se už vše nestihlo
        setTimeout(() => {
            if (this.layout.kalkulaceAktivni) this.dokonciKalkulaci(items);
        }, 100 * 100);
    }

    dokonciKalkulaci(items: any[]): void {
        // filtrování nabídek se také spouští při změně filtrFormu - duplicita po kalkulaci
        // console.log('APP - dokonciKalkulaci - partners: ', JSON.stringify(this.partners));
        // console.log('APP - dokonciKalkulaci - kalkulaceAktivni: ', this.layout.kalkulaceAktivni);
        this.layout.progress = 100;
        if (this.layout.kalkulaceAktivni) {
            this.offers = this.offersAll = items;
            this.filtruj_nabidky();
        }
        this.layout.kalkulaceAktivni = false;
    }

    filtruj_nabidky(): void {
        // console.log('this.filters.partnobj : ', this.filters.partnobj);
        console.log('APP filtruj_nabidky - offers před filtry : ', this.offersAll);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry = []; this.filtrHelper.filtry.push({zacatek: this.offersAll.length}); }
        this.offers = this.offersAll.filter( x => this.filters.partnobj[x.pojistovna] > 0);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({pojistovna: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.platby[this.data.platba]) > 0);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({platba: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.zdr.hodnota) >= this.filters.min_zdr);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({zdr: this.offers.length}); }
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
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({skl: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.asn.hodnota) >= this.data.extra.asn);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({asn: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.asp.hodnota) >= this.data.extra.asp);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({asp: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.nv.hodnota) >= this.data.extra.nv);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({nv: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.pa.hodnota) >= this.data.extra.pa);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({pa: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.ur.hodnota) >= this.data.extra.ur);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({ur: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.zav.hodnota) >= this.data.extra.zav);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({zav: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.vb.hodnota) >= this.data.extra.vb);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({vb: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.ren.hodnota) >= this.data.extra.ren);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({ren: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.gc.hodnota) >= this.data.extra.gc);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({gc: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.zver.hodnota) >= this.data.extra.zver);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({zver: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.zivel.hodnota) >= this.data.extra.zivel);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({zivel: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.odc.hodnota) >= this.data.extra.odc);
        if (this.filtrHelper.debug) { this.filtrHelper.filtry.push({odc: this.offers.length}); }
        this.offers = this.offers.filter( x => Number(x.param_obj.vlsk.hodnota) >= this.data.extra.vlsk);
        if (this.filtrHelper.debug) {
            this.filtrHelper.filtry.push({vlsk: this.offers.length});
            this.filtrHelper.filtry.push({konec: this.offers.length});
            console.log('APP filtruj nabidky - debug filtru : ', this.filtrHelper.filtry);
        }

        if (this.data.pojisteni === 'HAV') {
            this.offers = this.offers.filter( x => Number(x.param_obj.zdr.hodnota) >= this.filters.min_zdr);
            this.offers = this.offers.filter( x => Number(x.param_obj.maj.hodnota) >= this.filters.min_maj);
            this.offers = this.offers.filter( x => Number(x.param_obj.spol.hodnota) <= (this.filters.spoluuc ? 0 : 100000) );
        }
        console.log('APP filtruj nabidky - offers po filtrech : ', this.offers);
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

    initData(): void {
        this.layout.controls.druh = null;
        this.data = new Vozidla(null);
    }

    ngOnInit() {
        // console.log( 'data z URL : ', this.route.snapshot.queryParams['data'] );
        this.valueChangesSubscriber['f'] = this.filtrForm.valueChanges.pipe(debounceTime(500)).subscribe(form => {
            // console.log( 'zmena filtrů : ', JSON.stringify(this.filters) );
            // console.log( 'zmena filtrů - length : ', Object.keys(this.filters).length );
            if (this.offers.length) this.filtruj_nabidky();
            this.GAEvent('AUTA', 'Kalkulace', 'Filtrování nabídek', 1);
        });

        this.valueChangesSubscriber['z'] = this.zadaniForm.valueChanges.pipe(debounceTime(500)).subscribe(form => {
            console.log('změna zadaniForm');
            this.zadaniForm.submitted = false;
            this.offers = [];
            this.offersAll = [];
            this.zadaniCmp.zmenaFormulare();
            if (this.zadaniForm.valid) {
                // console.log('změna zadaniForm, formulář platný a proto kalkuluji ...');
                // this.kalkuluj();
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

        this.data = new Vozidla(null);

        let inputData = null;
        if (this.route.snapshot.queryParams['id'] !== undefined ) {
            this.layout.dataNacitani = true;
            this.paramsService.getKalkulace( this.route.snapshot.queryParams['id'] )
            .subscribe( data => {
                console.log('APP - getKalkulace data ', data);
                this.data = new Vozidla(data);
                // this.data =  Object.assign({}, this.data, inputData);
                setTimeout(() =>  {
                    this.layout.dataNacitani = false;
                    if (this.zadaniForm.valid) {
                        this.kalkuluj();
                        this.staticTabs.tabs[1].active = true;
                    }
                }, 2000);
            });
        } else if (this.route.snapshot.queryParams.data !== undefined ) {
            console.log('APP - ngOnInit - data snapshot', this.route.snapshot.queryParams['data'] );
            try {
                inputData = JSON.parse(this.route.snapshot.queryParams.data);
                this.data = new Vozidla(inputData);
                // this.data =  Object.assign({}, this.data, inputData);
            } catch (e) {
                // console.log(e);
            }
        }
        // volání o nové ID, vrací se i rychleji než jsou načtena data kalkulace, ale asi ničemu nevadí - jistota, že máme ID
        if (!this.data.id ) {
            this.paramsService.getNewId()
            .subscribe( data => {
                this.data.id = this.data.id ? this.data.id : data['id'];
                // console.log('APP getNewId ', data);
            });
        }
        // console.log(this.zadaniForm.value);
    }
    ngOnDestroy() {
        this.dataService.data = this.data;
        this.dataService.vprodukt = this.vprodukt;
        this.valueChangesSubscriber['f'].unsubscribe();
        this.valueChangesSubscriber['z'].unsubscribe();
        this.valueChangesSubscriber['e'].unsubscribe();
        this.valueChangesSubscriber['u'].unsubscribe();
        this.valueChangesSubscriber['ob'].unsubscribe();
        this.valueChangesSubscriber['o'].unsubscribe();
    }
}
