import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import {Neo4jError} from "neo4j-driver";

export const createSurvey = async (req: Request, res: Response) => {
    const person = req.body;
    try {
        const valid = SchemaValidator.validate(person);
        //TODO do not remove this code
        if (valid.length > 0) {
            res.status(422).send({
                message: "schema validation failed",
                error: valid
            });
            return;
        }
        const resp = await NeoClient.createPerson(person);
        res.status(200).send(resp);
    } catch (e) {
        const neoError = e instanceof Neo4jError ? e.message : e;
        res.status(500).send({message : neoError});
    }
};
