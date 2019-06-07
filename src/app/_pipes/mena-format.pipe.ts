import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'menaFormat'
})
export class MenaFormatPipe implements PipeTransform {

    transform(value: string): string {
        let res = '';
        if (!isNaN(Number(value))) {
            const cislo = Math.round( Number(value || ''));
            if (cislo > 0) {
                if (cislo === 999999) {
                    res = 'neomezeno';
                } else if ((cislo % 1000000) === 0) {
                    res = (cislo / 1000000).toString() + '&nbsp;mil.&nbsp;Kč';
//                if ((cislo % 1000000) === 0) {
//                    res = '<div class="text-right">' + (cislo / 1000000).toString() + '&nbsp;mil.&nbsp;Kč</div>';
//                } else if ((cislo % 1000) === 0) {
//                    res = (cislo / 1000).toString() + '&nbsp;tis.&nbsp;Kč';
                } else {
                    // console.log('menaPipe ', cislo);
                    res = cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč';
                    // res = '<span style="float:right">' + cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč</span>';
                }
            } else if (cislo >= -1) {
                res = 'lze připojistit';
            } else if (cislo === -1) {
                res = '<i class="mr-4 text-primary far fa-lg fa-plus-square"></i>';
            } else if (cislo === -2) {
                res = '<i class="mr-4 text-danger fas fa-lg fa-times"></i>';
            }
        }
        return res;
    }
}
