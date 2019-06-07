import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';

@Directive({
    selector: '[TextNumberMax][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: TextNumberMaxValidator, multi: true }
    ]
})
export class TextNumberMaxValidator implements Validator {
    @Input() TextNumberMax: number;
    validate(c: FormControl) {
        let v = c.value || 0;
        if (isNaN(parseFloat(v)) || isNaN(v - 0)) { v = Number(v.replace(' ', '')); } else { v = Number(v); }
        const valid = (v <= this.TextNumberMax) ? null : {'TextNumberMax': { valid: false} };
        return valid;
    }

}

@Directive({
    selector: '[TextNumberMin][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: TextNumberMinValidator, multi: true }
    ]
})
export class TextNumberMinValidator implements Validator {
    @Input() TextNumberMin: number;
    validate(c: FormControl) {
        let v = c.value || 0;
        if (isNaN(parseFloat(v)) || isNaN(v - 0)) { v = Number(v.replace(' ', '')); } else { v = Number(v); }
        // console.log('TextNumberMin', this.TextNumberMin);
        // console.log('pole', v);
        const valid = (v >= this.TextNumberMin) ? null : {'TextNumberMin': { valid: false} };
        // console.log( (v <= this.TextNumberMin) );
        return valid;
    }

}
