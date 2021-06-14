import { Component, OnInit, Input } from '@angular/core';
import { LOGO_200x100 } from '../../assets/params/loga';

@Component({
  selector: 'app-kloader',
  templateUrl: './kloader.component.html',
  styleUrls: ['./kloader.component.css']
})
export class KloaderComponent implements OnInit {
  LOGA = LOGO_200x100;
  @Input() partners;
  @Input() layout;

  constructor() { }

  ngOnInit() {
  }

}
