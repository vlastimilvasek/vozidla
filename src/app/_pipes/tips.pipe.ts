import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Tips'
})
export class TipsPipe implements PipeTransform {

    transform(obj): string {
        let res = '';
        if (obj.typ === 'plus') {
            res = '<i class="fa-li text-success fas fa-check"></i>' + obj.tip;
        } else if (obj.typ === 'info') {
            res = '<i class="fa-li text-info fas fa-info-circle"></i>' + obj.tip;
        } else if (obj.typ === 'minus') {
            res = '<i class="fa-li text-danger fas fa-times"></i>' + obj.tip;
        }
        return res;
    }

}
