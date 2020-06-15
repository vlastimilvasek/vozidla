import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { csLocale } from 'ngx-bootstrap/locale';
defineLocale('cs', csLocale);
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RootComponent } from './root.component';
import { AppComponent } from './app.component';
import { ZadaniComponent } from './zadani/zadani.component';
import { KloaderComponent } from './kloader/kloader.component';
import { AdresaComponent } from './adresa/adresa.component';
import { PojistnikComponent } from './pojistnik/pojistnik.component';
import { PojistenyComponent } from './pojisteny/pojisteny.component';
import { SrovnaniComponent } from './srovnani/srovnani.component';
import { UdajeComponent } from './udaje/udaje.component';
import { FiltryComponent } from './filtry/filtry.component';
import { ProduktinfoComponent } from './produktinfo/produktinfo.component';
import { RekapitulaceComponent } from './rekapitulace/rekapitulace.component';
import { ZaverComponent } from './zaver/zaver.component';

import { KeysPipe } from './_pipes/keys.pipe';
import { TelefonFormatPipe } from './_pipes/telefon-format.pipe';
import { MenaFormatPipe } from './_pipes/mena-format.pipe';
import { TextNumberMinValidator, TextNumberMaxValidator } from './_directives/textnumber.validator';
import { MenaFormatInfoPipe } from './_pipes/mena-format-info.pipe';
import { SpolFormatPipe } from './_pipes/spol-format.pipe';

import { RCValidator } from './_directives/RC.validator';
import { ICValidator } from './_directives/IC.validator';
import { TelefonFormatterDirective } from './_directives/telefon.formatter';

import { routing, mainRoutingProviders } from './app.router';
import { ObjektComponent } from './objekt/objekt.component';
import { TipsPipe } from './_pipes/tips.pipe';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/');
}

const CustomSelectOptions: INgxSelectOptions = {
    optionValueField: 'value',
    optionTextField: 'label',
    keepSelectedItems: false
};

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    KeysPipe,
    AdresaComponent,
    PojistnikComponent,
    RCValidator,
    ICValidator,
    TextNumberMinValidator,
    TextNumberMaxValidator,
    TelefonFormatPipe,
    TelefonFormatterDirective,
    ZadaniComponent,
    SrovnaniComponent,
    MenaFormatPipe,
    UdajeComponent,
    FiltryComponent,
    SpolFormatPipe,
    KloaderComponent,
    PojistenyComponent,
    ProduktinfoComponent,
    RekapitulaceComponent,
    ZaverComponent,
    MenaFormatInfoPipe,
    ObjektComponent,
    TipsPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),
    HttpClientModule,
    mainRoutingProviders,
    NgxSelectModule.forRoot(CustomSelectOptions),
    routing,
    ScrollToModule.forRoot(),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  providers: [TelefonFormatPipe],
  bootstrap: [RootComponent],
  exports: [KloaderComponent, PojistenyComponent, ProduktinfoComponent, RekapitulaceComponent, ZaverComponent, MenaFormatInfoPipe]
})
export class AppModule { }
