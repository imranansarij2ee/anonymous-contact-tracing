import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import Survey from '../model/survey'
import {isEmpty, isValidUUID} from "../lib/helper";
import {updateSurveyEntry} from "../database/neo";

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
    if(isEmpty(survey.publicID) || isEmpty(survey.referrerID)){
        return res.status(400).json({message:"publicID and referrerID is required"});
    }

    if(!isValidUUID(survey.publicID) || !isValidUUID(survey.referrerID)){
        return res.status(400).json({message:"publicID and referrerID must be a valid uuid"});
    }

    try {
        await NeoClient.createReferralRelation(survey);
        return res.status(201).json();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};


export const updateSurvey = async (req: Request, res: Response) => {
    const survey: Survey = req.body;
    if(isEmpty(survey.publicID)){
        return res.status(400).json({message:"publicID is required"});
    }

    if(!isValidUUID(survey.publicID)){
        return res.status(400).json({message:"publicID and referrerID must be a valid uuid"});
    }

    try {
        await NeoClient.updateSurveyEntry(survey);
        return res.status(201).json();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};