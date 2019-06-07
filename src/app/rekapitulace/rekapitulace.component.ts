import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
    selector: 'app-rekapitulace',
    templateUrl: './rekapitulace.component.html',
    styleUrls: ['./rekapitulace.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class RekapitulaceComponent implements OnInit {
  @Input() data;
  @Input() r;
  @Input() layout;
  constructor() { }

  ngOnInit() {
  }

}
