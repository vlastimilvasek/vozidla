import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        const keys = [];
        /*
        for (let key in value) {
            keys.push(value[key]);
        }
        */
        for (const key of Object.keys(value)) {
            keys.push(Number(key));
        }
        /* vrací numerické keys objektu */
        return keys;
    }
}
