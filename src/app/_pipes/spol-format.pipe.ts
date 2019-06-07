import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spolFormat'
})
export class SpolFormatPipe implements PipeTransform {

    transform(value: string): string {
        let res = value;
        if (!isNaN(Number(value)) ) {
            const cislo = Math.round( Number(value || 0));
            if (cislo === 0) {
                res = 'bez spoluúčasti';
            } else if (cislo > 0) {
                res = cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč';
            }
        } else {
            res = value.replace(/ Kč/g, '&nbsp;Kč');
            res = res.replace(/ 000/g, '&nbsp;000');
            res = res.replace(/min. /g, 'min.&nbsp;');
        }
        return res;
    }

}
