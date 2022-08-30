import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import Survey from '../model/survey'
import {Neo4jError} from "neo4j-driver";

export const createSurvey = async (req: Request, res: Response) => {
    const survey: Survey = req.body;
    try {
        const valid = SchemaValidator.validate(survey);
        //TODO do not remove this code
        if (valid.length > 0) {
            return res.status(422).json({
                message: "schema validation failed",
                error: valid
            });
        }
        await NeoClient.createSurveyEntry(survey);
        return res.status(201).json();
    } catch (e : any) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
       return  res.status(500).json(e);
    }
};

export const createReferralRelation = async (req: Request, res: Response) => {
    const survey: Survey = req.body;
    try {
        await NeoClient.createReferralRelation(survey);
        res.status(201).json();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};
