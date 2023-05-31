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
        return res.status(201).json({status: "success"}).end();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e).end();
    }
};

export const submitCookie = async (req: Request, res: Response) => {
    console.log("cookie received")
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

        console.log("payload received", survey)
        // get public ID
        // save survey
        // return lastquestion and public id

        const cookieResponse = await NeoClient.submitCookie(survey);


        return res.status(201).json(cookieResponse).end();
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        console.log("something went wrong")
        return res.status(500).json(e).end();
    }
};


export const getLastQuestion = async (req: Request, res: Response) => {
    console.log("starting  getLastQuestion")
    const survey: Survey = req.body;

    const schema = await axios.get("http://localhost:3000/api/backendSchema")



    const valid = SchemaValidator.validate(survey, schema.data);


    console.log("validity check", valid)

    if (valid.length > 0) {
        return res.status(422).json({
            message: "schema validation failed",
            error: valid
        });
    }

    try {

console.log("about to get to client")
        const lastQuestionResponse = await NeoClient.getLastQuestion(survey);

        // @ts-ignore
        console.log("response from newo4j", lastQuestionResponse)
        console.log("response from newo4j", lastQuestionResponse)

        return res.status(201).json(lastQuestionResponse);
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }

}
