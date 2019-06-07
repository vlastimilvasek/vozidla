import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menaFormatInfo'
})
export class MenaFormatInfoPipe implements PipeTransform {

    // filter nepoužívám, ale je předávána hodnota - jinak by se neaktualizovalo při změně - problém je objektem jako vstupem do pipe
    transform(obj: any, filter?: any): string {
        let res = '';
        const isBoolean = val => Boolean(val) === val;
        const val = Boolean(obj.hodnota);
        if (obj.typ === 'bool') {
            // console.log('menaPipeinfo ', isBoolean(val) + ' ' + val);
            if (isBoolean(val)) {
                if (val) {
                    res = '<i class="text-success fas fa-check mr-4"></i>';
                } else {
                    res = '<i class="text-danger fas fa-times mr-4"></i>';
                }
            }
        } else {
            if (!isNaN(Number(obj.hodnota))) {
                const cislo = Math.round( Number(obj.hodnota || ''));
                if (cislo > 1) {
                    if (cislo === 999999) {
                        res = 'neomezeno';
                    } else if ((cislo % 1000000) === 0) {
                        res = (cislo / 1000000).toString() + '&nbsp;mil.&nbsp;Kč';
    //                if ((cislo % 1000000) === 0) {
    //                    res = '<div class="text-right">' + (cislo / 1000000).toString() + '&nbsp;mil.&nbsp;Kč</div>';
    //                } else if ((cislo % 1000) === 0) {
    //                    res = (cislo / 1000).toString() + '&nbsp;tis.&nbsp;Kč';
                    } else {
                        res = cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč';
                    }
                } else if (cislo === 0) {
                    res = 'lze připojistit';
                } else if (cislo === 1) {
                    res = '<i class="text-success fas fa-check mr-4"></i>';
                } else if (cislo >= -1) {
                    res = '<i class="fas fa-minus mr-4"></i>';
                } else if (cislo === -2) {
                    res = '<i class="text-danger fas fa-times mr-4"></i>';
                }
            }
        }
        return res;
    }

}
