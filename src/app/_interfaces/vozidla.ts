export class ISjednaniResp {
    id: string;
    status: string;
    docs: any[];
    time: string;
}

export class ISrovnani {
    id: string;
    items: any[];
    time: string;
}

export class ISelectItem {
    value: any;
    label: string;
}

export interface IVozidlo {
    druh: number;
    kategorie: any;
    uziti: number;
    znacka: number;
    model: number;
    specifikace: string;
    barva: string;
    objem_motoru: number;
    vykon_motoru: number;
    rok_vyroby: number;
    stav_tachometr: number;
    hmotnost: number;
    pocet_dveri: number;
    pocetsedadel: number;
    palivo: number;
    rz: string;
    vtp: string;
    vin: string;
}

export interface IAdresa {
    psc: any;
    cast_obce_id: any;
    obec: any;
    ulice: any;
    cp: any;
    adr_id: any;
}

interface IPojistnik {
    typ: any;
    titul: any;
    titul_za: any;
    jmeno: any;
    prijmeni: any;
    spolecnost: any;
    rc: any;
    ic: any;
    platce_dph: boolean;
    telefon: any;
    email: any;
    adresa: IAdresa;
    kadresa: any;
    kor_adresa: IAdresa;
}

export interface IOsoba {
    typ: any;
    titul: any;
    titul_za: any;
    jmeno: any;
    prijmeni: any;
    spolecnost: any;
    rc: any;
    ic: any;
    adresa: IAdresa;
}

export interface IVozidla {
    id: string;
    pojisteni: string;
    pojistovna: string;
    produkt: number;
    sjed_cislo: any;
    sjed_status: number;
    sjed_datum: any;
    pocatek: any;
    konec: any;
    pojistne: number;
    provize: number;
    extra: {
        asn: number,
        asp: number,
        skl: number,
        nv: number,
        pa: number,
        ur: number,
        zav: number,
        vb: number,
        ren: number,
        gc: number,
        zver: number,
        zivel: number,
        odc: number,
        vlsk: number
    };
    bonus: number;
    malus: number;
    vozidlo: IVozidlo;
    platba: number;
    pojistnik: IPojistnik;
    pojistnikvlastnik: boolean;
    vlastnik: IOsoba;
    pojistnikprovozovatel: boolean;
    provozovatel: IOsoba;
    poznamka: string;
    promo_kod: string;
    ziskatel: any;
    ipadr: string;
    email: string;
    link: string;
}

export class Vozidla implements IVozidla {
    id: string;
    pojisteni: string;
    pojistovna: string;
    produkt: number;
    sjed_cislo: any;
    sjed_status: number;
    sjed_datum: any;
    pocatek: any;
    konec: any;
    pojistne: number;
    provize: number;
    extra: {
        asn: number,
        asp: number,
        skl: number,
        nv: number,
        pa: number,
        ur: number,
        zav: number,
        vb: number,
        ren: number,
        gc: number,
        zver: number,
        zivel: number,
        odc: number,
        vlsk: number
    };
    bonus: number;
    malus: number;
    vozidlo: IVozidlo;
    platba: number;
    pojistnik: IPojistnik;
    pojistnikvlastnik: boolean;
    vlastnik: IOsoba;
    pojistnikprovozovatel: boolean;
    provozovatel: IOsoba;
    poznamka: string;
    promo_kod: string;
    ziskatel: any;
    ipadr: string;
    email: string;
    link: string;

  constructor(data: any) {
    data = data || {}
    this.id = data.id || ''
    this.pojisteni = data.pojisteni || 'POV'
    this.pojistovna = data.pojistovna || ''
    this.produkt = Number(data.produkt) || null
    this.sjed_cislo = data.sjed_cislo || null
    this.sjed_status = Number(data.sjed_status) || null
    this.sjed_datum = data.sjed_datum || new Date(),
    this.pocatek = data.pocatek || new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    this.konec = data.konec || ''
    this.pojistne = Number(data.pojistne) || null
    this.provize = Number(data.provize) || null
    data.extra = data.extra || {}
    this.extra = data.extra || {}
      this.extra.asn = Number(data.extra.asn) || 0
      this.extra.asp = Number(data.extra.asp) || 0
      this.extra.skl = Number(data.extra.skl) || 0
      this.extra.nv = Number(data.extra.nv) || 0
      this.extra.pa = Number(data.extra.pa) || 0
      this.extra.ur = Number(data.extra.ur) || 0
      this.extra.zav = Number(data.extra.zav) || 0
      this.extra.vb = Number(data.extra.vb) || 0
      this.extra.ren = Number(data.extra.ren) || 0
      this.extra.gc = Number(data.extra.gc) || 0
      this.extra.zver = Number(data.extra.zver) || 0
      this.extra.zivel = Number(data.extra.zivel) || 0
      this.extra.odc = Number(data.extra.odc) || 0
      this.extra.vlsk = Number(data.extra.vlsk) || 0
    this.bonus = Number(data.bonus) || null
    this.malus= Number(data.malus) || null
    data.vozidlo = data.vozidlo || {}
    this.vozidlo = data.vozidlo || {}
        this.vozidlo.druh = Number(data.vozidlo.druh) || null
        this.vozidlo.kategorie = data.vozidlo.kategorie || null
        this.vozidlo.uziti = Number(data.vozidlo.uziti) || null
        this.vozidlo.znacka = Number(data.vozidlo.znacka) || null
        this.vozidlo.model = Number(data.vozidlo.model) || null
        this.vozidlo.specifikace = data.vozidlo.specifikace || null
        this.vozidlo.barva = data.vozidlo.barva || null
        this.vozidlo.objem_motoru = Number(data.vozidlo.objem_motoru)|| null
        this.vozidlo.vykon_motoru = Number(data.vozidlo.vykon_motoru) || null
        this.vozidlo.rok_vyroby = Number(data.vozidlo.rok_vyroby) || null
        this.vozidlo.stav_tachometr = Number(data.vozidlo.stav_tachometr) || null
        this.vozidlo.hmotnost = Number(data.vozidlo.hmotnost) || null
        this.vozidlo.pocet_dveri = Number(data.vozidlo.pocet_dveri) || null
        this.vozidlo.pocetsedadel = Number(data.vozidlo.pocetsedadel) || null
        this.vozidlo.palivo = Number(data.vozidlo.palivo) || null
        this.vozidlo.rz = data.vozidlo.rz || null
        this.vozidlo.vtp = data.vozidlo.vtp || null
        this.vozidlo.vin = data.vozidlo.vin || null
    this.platba = Number(data.platba) || 1
    data.pojistnik = data.pojistnik || {}
    this.pojistnik = data.pojistnik || {}
        this.pojistnik.typ = Number(data.pojistnik.typ) || 1
        this.pojistnik.titul = data.pojistnik.titul || ''
        this.pojistnik.titul_za = data.pojistnik.titul_za || ''
        this.pojistnik.jmeno = data.pojistnik.jmeno || ''
        this.pojistnik.prijmeni = data.pojistnik.prijmeni || ''
        this.pojistnik.spolecnost = data.pojistnik.spolecnost || ''
        this.pojistnik.rc = data.pojistnik.rc || ''
        this.pojistnik.ic = data.pojistnik.ic || ''
        this.pojistnik.platce_dph = (data.pojistnik.platce_dph == 'false') ? false : true
        this.pojistnik.telefon = data.pojistnik.telefon || ''
        this.pojistnik.email = data.pojistnik.email || ''
        data.pojistnik.adresa = data.pojistnik.adresa || {}
        this.pojistnik.adresa = data.pojistnik.adresa || {}
            this.pojistnik.adresa.psc = data.pojistnik.adresa.psc || null
            this.pojistnik.adresa.cast_obce_id = data.pojistnik.adresa.cast_obce_id || null
            this.pojistnik.adresa.obec = data.pojistnik.adresa.obec || ''
            this.pojistnik.adresa.ulice = data.pojistnik.adresa.ulice || ''
            this.pojistnik.adresa.cp = data.pojistnik.adresa.cp || ''
            this.pojistnik.adresa.adr_id = data.pojistnik.adresa.adr_id || null
        this.pojistnik.kadresa  = (data.pojistnik.kadresa == 'false') ? false : true
        data.pojistnik.kor_adresa = data.pojistnik.kor_adresa || {}
        this.pojistnik.kor_adresa = data.pojistnik.kor_adresa || {}
            this.pojistnik.kor_adresa.psc = data.pojistnik.kor_adresa.psc || null
            this.pojistnik.kor_adresa.cast_obce_id = data.pojistnik.kor_adresa.cast_obce_id || null
            this.pojistnik.kor_adresa.obec = data.pojistnik.kor_adresa.obec || ''
            this.pojistnik.kor_adresa.ulice = data.pojistnik.kor_adresa.ulice || ''
            this.pojistnik.kor_adresa.cp = data.pojistnik.kor_adresa.cp || ''
            this.pojistnik.kor_adresa.adr_id = data.pojistnik.kor_adresa.adr_id || null
    this.pojistnikvlastnik = (data.pojistnikvlastnik == 'false') ? false : true // string i boolean
    data.vlastnik = data.vlastnik || {}
    this.vlastnik = data.vlastnik || {}
        this.vlastnik.typ = Number(data.vlastnik.typ) || 1
        this.vlastnik.titul = data.vlastnik.titul || ''
        this.vlastnik.titul_za = data.vlastnik.titul_za || ''
        this.vlastnik.jmeno = data.vlastnik.jmeno || ''
        this.vlastnik.prijmeni = data.vlastnik.prijmeni || ''
        this.vlastnik.spolecnost = data.vlastnik.spolecnost || ''
        this.vlastnik.rc = data.vlastnik.rc || ''
        this.vlastnik.ic = data.vlastnik.ic || ''
        data.vlastnik.adresa = data.vlastnik.adresa || {}
        this.vlastnik.adresa = data.vlastnik.adresa || {}
            this.vlastnik.adresa.psc = data.vlastnik.adresa.psc || null
            this.vlastnik.adresa.cast_obce_id = data.vlastnik.adresa.cast_obce_id || null
            this.vlastnik.adresa.obec = data.vlastnik.adresa.obec || ''
            this.vlastnik.adresa.ulice = data.vlastnik.adresa.ulice || ''
            this.vlastnik.adresa.cp = data.vlastnik.adresa.cp || ''
            this.vlastnik.adresa.adr_id = data.vlastnik.adresa.adr_id || null
    this.pojistnikprovozovatel = (data.pojistnikprovozovatel == 'false') ? false : true
    data.provozovatel = data.provozovatel || {}
    this.provozovatel = data.provozovatel || {}
        this.provozovatel.typ = Number(data.provozovatel.typ) || 1
        this.provozovatel.titul = data.provozovatel.titul || ''
        this.provozovatel.titul_za = data.provozovatel.titul_za || ''
        this.provozovatel.jmeno = data.provozovatel.jmeno || ''
        this.provozovatel.prijmeni = data.provozovatel.prijmeni || ''
        this.provozovatel.spolecnost = data.provozovatel.spolecnost || ''
        this.provozovatel.rc = data.provozovatel.rc || ''
        this.provozovatel.ic = data.provozovatel.ic || ''
        data.provozovatel.adresa = data.provozovatel.adresa || {}
        this.provozovatel.adresa = data.provozovatel.adresa || {}
            this.provozovatel.adresa.psc = data.provozovatel.adresa.psc || null
            this.provozovatel.adresa.cast_obce_id = data.provozovatel.adresa.cast_obce_id || null
            this.provozovatel.adresa.obec = data.provozovatel.adresa.obec || ''
            this.provozovatel.adresa.ulice = data.provozovatel.adresa.ulice || ''
            this.provozovatel.adresa.cp = data.provozovatel.adresa.cp || ''
            this.provozovatel.adresa.adr_id = data.provozovatel.adresa.adr_id || null
    this.poznamka = data.poznamka || ''
    this.promo_kod = data.promo_kod || ''
    this.ziskatel = data.ziskatel || ''
    this.ipadr = data.ipadr || ''
    this.email = data.email || ''
    this.link = data.link || ''
  }
}