import * as neo4j from 'neo4j-driver'
import * as dotenv from 'dotenv';
import Survey from '../model/survey'
import {
    friendWithRelationCypher,
    getLastQuestionCypher,
    groupSexRelationCypher,
    hangoutWithRelationCypher,
    livesInRelationCypher,
    referralTypeMapping,
    sexWithRelationCypher
} from '../lib/constant'
import * as SqlClient from '../database/sql'
import {isEmpty, isValidUUID} from "../lib/helper";

dotenv.config();

const url = process.env.NEO_URI || "test";
const user = process.env.NEO_USER || "test";
const password = process.env.NEO_PASS || "test";
const driver = neo4j.driver(url, neo4j.auth.basic(user, password));




const runCypher = async (cypher: string, args: Object): Promise<void> => {
    const session = driver.session();
    try {
        const resp = await session.run(
            cypher,
            args
        )
    } catch (e: any) {
        throw e;
    } finally {
        await session.close()
    }
}

const runCypherSaveSurvey = async (cypher: string, args: Object): Promise<void> => {

    try {
        await runCypher(cypher, args)
        console.log("saved survey")
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }


}

const runCypherSavePlaceRelations = async (cypherPlaceRelations: Object, args: Object): Promise<void> => {

    try {
        const placeVariables = Object.keys(cypherPlaceRelations)
        // @ts-ignore
        const {privateId, timeStamp} = args;

        placeVariables.map(
            async (variableName) => {
                // @ts-ignore
                const data = args[variableName]
                // @ts-ignore
                const query = cypherPlaceRelations[variableName]

                for (let i = 0; i < data.length; i++) {

                    const placeData = {
                        ...data[i],
                        userId: privateId,
                        timeStamp: timeStamp
                    }
                    const currentQuery = query[i];

                    await runCypher(currentQuery, placeData)

                    console.log("Saved ", variableName, i)
                }
            }
        )
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }


}

const runCypherSavePersonRelations = async (cypherPersonRelation: string, args: Object): Promise<void> => {


    try {
        // @ts-ignore
        const {referrerId} = args;
        referrerId && await runCypher(cypherPersonRelation, args)
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }
}

export const updateSurveyEntry = async (survey: Survey): Promise<Object> => {

    const surveyData = survey.surveyData;
    const cypherQueries = survey.cypher;
    // @ts-ignore
    const {saveSurvey, savePlaceRelations, savePersonRelation} = cypherQueries;

    // @ts-ignore
    const privateId = await SqlClient.getUserPrivateId(surveyData.publicId);
    if (privateId === null) {throw new Error("user private id not found");}


    // @ts-ignore
    const referrerPrivateId = await SqlClient.getUserPrivateId(surveyData.referrerPublicId);


    const timeStamp = new Date().toISOString();

    const surveyArgs = {
        ...surveyData,
        timeStamp: timeStamp,
        userId: privateId,
        referrerId: referrerPrivateId
    };


    try {
        await runCypherSaveSurvey(saveSurvey, surveyArgs)
        await runCypherSavePlaceRelations(savePlaceRelations, surveyArgs)
        await runCypherSavePersonRelations(savePlaceRelations, surveyArgs)
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }

    return privateId;

}

export const getLastQuestion = async (survey: Survey): Promise<Object> => {

    const response = await SqlClient.getUserPrivateIdFromUserName(survey.userName);

    // @ts-ignore
    const privateId = response.private_id
    // @ts-ignore
    const publicId = response.public_id


    if (privateId === null) {
        throw new Error("user private id not found");
    }
    survey.userId = privateId;
    const session = driver.session();

    console.log("privateId", privateId)
    try {
        const lastQuestionRaw = await session.run(
            getLastQuestionCypher,
            {userId: privateId}
        );

        console.log("lastQuestionRaw", lastQuestionRaw)

        const LastQuestion = Object.create({})
        // @ts-ignore
        lastQuestionRaw.records[0].keys.forEach((key, i) => LastQuestion[key] = lastQuestionRaw.records[0]._fields[i]);

console.log("surveyCompleteness", LastQuestion)

        return ({lastQuestion: LastQuestion.lastQuestion, publicId: publicId})

    } catch (e) {
        console.log(e)
        throw e;
    } finally {
        await session.close();
    }


}