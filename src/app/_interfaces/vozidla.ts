export class ISjednaniResp {
    id: string;
    status: string;
    docs: any[];
    time: string;
}
export class IVozidla {
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
    over_bm: boolean;
    bonus: number;
    malus: number;
    vozidlo: IVozidlo;
    platba: number;
    pojistnik: IPojistnik;
    pojistenypojistnik: boolean;
    pojisteny: IOsoba;
    pojistnikvlastnik: boolean;
    vlastnik: IOsoba;
    pojistnikprovozovatel: boolean;
    provozovatel: IOsoba;
    poznamka: string;
    promo_kod: string;
    ziskatel: any;
    id_sml: number;
    ipadr: string;
    email: string;
    link: string;
}

export class IVozidlo {
    druh: any;
    kategorie: any;
    uziti: any;
    znacka: any;
    model: any;
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
    cislo_reg: string;
    cislotp: string;
    vin: string;
}

export class IPojistnik {
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

export class IOsoba {
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

export class IAdresa {
    psc: any;
    cast_obce_id: any;
    obec: any;
    ulice: any;
    cp: any;
    adr_id: any;
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
