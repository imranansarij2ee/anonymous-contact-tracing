import * as JsonSchema from "jsonschema";
import {Validator, ValidatorResult} from "jsonschema";
import * as monkeyPoxSchema from './schema/monkeypox.json'
// import * as TestSchema from './schema/test.json'

const schemaValidator: Validator = new JsonSchema.Validator();

export function validate(payload: Object): Array<string> {

    const validation: ValidatorResult = schemaValidator.validate(payload, monkeyPoxSchema);
    if (validation.valid && validation.errors.length === 0) {
        return [];
    } else {
        return validation.errors.map((e) => `${e.property} ${e.message}`);
    }
}
