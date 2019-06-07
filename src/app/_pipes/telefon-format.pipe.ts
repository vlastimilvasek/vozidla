import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({
    name: 'telefonFormat'
})
export class TelefonFormatPipe implements PipeTransform {

    private PREFIX: string;
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    private SUFFIX: string;
    private DECIMAL_NUM: number;

    constructor() {
        this.PREFIX = '';
        this.DECIMAL_SEPARATOR = ',';
        this.THOUSANDS_SEPARATOR = ' ';
        this.SUFFIX = '';
        this.DECIMAL_NUM = 0;
    }

    transform(value: string, fractionSize: number = this.DECIMAL_NUM): string {
        let [ integer, fraction = '' ] = (value || '').toString()
          .split('.');

        fraction = fractionSize > 0
          ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
          : '';

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return this.PREFIX + integer + fraction + this.SUFFIX;
    }

    parse(value: string, fractionSize: number = this.DECIMAL_NUM): string {
        let [ integer, fraction = '' ] = (value || '').replace(this.PREFIX, '')
                                                      .replace(this.SUFFIX, '')
                                                      .split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
          ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
          : '';

        return integer + fraction;
    }

}
