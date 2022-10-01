import {adjectives, colors, Config, uniqueNamesGenerator} from "unique-names-generator";

const spyCodes = [
    'lesbian',
    'gay',
    'bi',
    'trans',
    'intersex',
    'aromantic',
    'asexual',
    'plus',
    'pansexual',
];
export function generateUserName(): string {
    const customConfig: Config = {
        dictionaries: [colors, adjectives, spyCodes],
        separator: '-',
        style: "lowerCase"
    };
    return uniqueNamesGenerator(customConfig);
}

export function isEmpty(obj: any): boolean {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

export function isValidUUID(id : string) {
    const pattern : RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    return !!pattern && pattern.test(id);
}

export function isValidEmail(email : string){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(email);
}