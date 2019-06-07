import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ZaverComponent } from './zaver/zaver.component';

export const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: 'zaver', component: ZaverComponent }
];

export const mainRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(appRoutes);
export class RootModule { }
