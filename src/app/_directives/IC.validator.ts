import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';

function validateICFactory(): ValidatorFn {
    return (ac: AbstractControl) => {
        let ic = ac.value;
        let isValid = false;
        if (ic === null ) { ic = ''; }

        let a = 0; let c = -1;
        if (ic.length === 8) {
            for (let i = 0; i < ic.length - 1; i++) {
              a += Number(ic[i]) * (8 - i);
            }
            a = a % 11;
            if (a === 0) {
                c = 1;
            } else if (a === 1) {
                c = 0;
            } else {
                c = 11 - a;
            }
            if ( Number(ic[7]) === c) { isValid = true; }
        }
        if (isValid) {
            return null;
        } else {
            return {
                IC: {
                    valid: false
                }
            };
        }
    };
}

@Directive({
    selector: '[IC][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: ICValidator, multi: true }
    ]
})
export class ICValidator implements Validator {
    validator: ValidatorFn;
    constructor() {
        this.validator = validateICFactory();
    }
    validate(c: FormControl) {
        return this.validator(c);
    }

}
