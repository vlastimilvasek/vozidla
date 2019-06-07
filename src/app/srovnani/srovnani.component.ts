import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { trigger, transition, style, animate, keyframes, query, stagger, animateChild } from '@angular/animations';
import { LOGO_200x100 } from '../../assets/params/loga';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani.component.html',
    styleUrls: ['./srovnani.component.css'],
    animations: [
        trigger('items', [
          transition('void => *', [
            animate(300, keyframes([
              style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
              style({opacity: 1, transform: 'translateX(15px)', offset: 0.2}),
              style({opacity: 1, transform: 'translateX(0)', offset: 0.8})
            ]))
          ]),
          transition('* => void', [
            animate(300, keyframes([
              style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
              style({opacity: 1, transform: 'translateX(-15px)', offset: 0.6}),
              style({opacity: 0, transform: 'translateX(100%)',  offset: 0.8})
            ]))
          ]),
        ]),
        trigger('list', [
          transition(':enter', [
            query('@items', stagger(150, animateChild()), { optional: true })
          ]),
        ])
    ]
})
export class SrovnaniComponent implements OnInit {
    @Input() offers;
    @Input() data;
    @Input() layout;
    @Output() vyberProdukt = new EventEmitter<number>();
    LOGA = LOGO_200x100;
    platby = [];

    constructor() { }

    ngOnInit() {
        this.platby = [1, 2, 4];
        /*
        this.filters.extras_collapsed = window.innerWidth < 992 ? true : false;
        this.filters.collapsed = window.innerWidth < 992 ? true : false;
        this.filters.tools_collapsed = window.innerWidth < 992 ? true : false;
        */
    }

}
