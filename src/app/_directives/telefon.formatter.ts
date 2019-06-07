import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { TelefonFormatPipe } from '../_pipes/telefon-format.pipe';

@Directive({ selector: '[telefonFormat]' })
export class TelefonFormatterDirective implements OnInit {

    private el: any;

    constructor( private elementRef: ElementRef, private numberPipe: TelefonFormatPipe) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {
        this.el.value = this.numberPipe.transform(this.el.value);
    }

    @HostListener('focus', ['$event.target.value'])
        onFocus(value) {
        this.el.value = this.numberPipe.parse(value); // opossite of transform
    }

    @HostListener('blur', ['$event.target.value'])
        onBlur(value) {
        this.el.value = this.numberPipe.transform(value);
    }

}
