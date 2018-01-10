import * as classrouter from 'classrouter';
export class BaseError {
    constructor(public name: string) { }
}
export class ValidationError extends BaseError {
    constructor(public message: string) {
        super('validation');
    }
}

export interface FormValidationWarning {
    [property: string]: string[]
}

export class FormValidationError extends BaseError {

    public warings: FormValidationWarning = {}
    constructor(errors: classrouter.IValidationResult[]) {
        super('form-validation');
        if (errors && Array.isArray(errors)) {
            for (let it of errors) {
                if (it.constraints) {
                    let keys = Object.keys(it.constraints);
                    for (let key of keys) {
                        this.addWaring(it.property, it.constraints[key]);
                    }
                }
            }
        }
    }

    addWaring(property: string, message: string) {
        if (property in this.warings && Array.isArray(this.warings)) {
            this.warings[property].push(message);
        } else {
            this.warings[property] = [message];
        }
    }
}

export class TokenError extends BaseError {
    constructor(public message: string) {
        super('tokenerror');
    }
}


export class Notfound extends BaseError {
    constructor(public message: string) {
        super('notfound');
    }
}

export class OtherError extends BaseError {
    constructor(public message: string) {
        super('error');
    }
}