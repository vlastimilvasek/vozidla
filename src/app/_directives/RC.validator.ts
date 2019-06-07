import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';

function validateRCFactory(): ValidatorFn {
    return (c: AbstractControl) => {
        let x = c.value;
        let isValid = false;
        if (x === null ) { x = ''; }

        const re = new RegExp('^[0-9]{9}$');
        const re1 = new RegExp('^[0-9]{10}$');
        const re2 = new RegExp('^[0-9]{6}$');
        const rok = x.substr(0, 2);
        const datum = x.substr(0, 6);
        const ext = x.substr(6, 4);
        if (re.test(x) && parseInt(rok, 10) <= 53) { isValid = true; }
        if (re2.test(datum) && parseInt(ext, 10) === 9999) { isValid = true; } // cizinci
        if (re1.test(x) && (x % 11) === 0) { isValid = true; }

        if (isValid) {
            return null;
        } else {
            return {
                RC: {
                    valid: false
                }
            };
        }
    };
}

@Directive({
    selector: '[RC][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: RCValidator, multi: true }
    ]
})
export class RCValidator implements Validator {
    validator: ValidatorFn;
    constructor() {
        this.validator = validateRCFactory();
    }
    validate(c: FormControl) {
        return this.validator(c);
    }

}
