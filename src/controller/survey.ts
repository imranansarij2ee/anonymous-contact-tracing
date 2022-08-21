import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import Survey from '../model/survey'
import {Neo4jError} from "neo4j-driver";

export const createSurvey = async (req: Request, res: Response) => {
    const survey : Survey = req.body;
    try {
        const valid = SchemaValidator.validate(survey);
        //TODO do not remove this code
        if (valid.length > 0) {
            res.status(422).send({
                message: "schema validation failed",
                error: valid
            });
            return;
        }
        console.log(JSON.stringify(survey));
        const resp = await NeoClient.createSurveyEntry(survey);
        console.log("response from neo4j server", resp)
        res.status(200).send(resp);
    } catch (e) {
        const neoError = e instanceof Neo4jError ? e.message : e;
        res.status(500).send({message : neoError});
        console.log(e)
    }
};
