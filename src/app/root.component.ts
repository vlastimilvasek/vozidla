import { Component } from '@angular/core';
import { DataService } from './_services/data.service';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    providers: [DataService]
})
export class RootComponent {
    constructor() {  }
}
