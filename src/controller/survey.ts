import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import Survey from '../model/survey'
import {isEmpty, isValidUUID} from "../lib/helper";
import axios from "axios";




export const updateSurvey = async (req: Request, res: Response) => {
    const survey: Survey = req.body;

    const schema = await axios.get("http://localhost:3000/api/backendSchema")



    const valid = SchemaValidator.validate(survey, schema.data);



    if (valid.length > 0) {
        return res.status(422).json({
            message: "schema validation failed",
            error: valid
        });
    }

    try {

        await NeoClient.updateSurveyEntry(survey);
        return res.status(201).json();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};


export const getLastQuestion = async (req: Request, res: Response) => {
    const survey: Survey = req.body;
    if(isEmpty(survey.userName)){
        return res.status(400).json({message:"userName is required"});
    }

    try {
        const data: Object | null = await NeoClient.getLastQuestion(survey);

        return res.status(200).json(data);
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }

}
