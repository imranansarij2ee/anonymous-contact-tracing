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




const runCypher = async (cypher: string, args: Object): Promise<boolean> => {
    const session = driver.session();
    try {
        const resp = await session.run(
            cypher,
            args
        )
        return true
    } catch (e: any) {
        throw e;
    } finally {
        await session.close()
    }
}

const runCypherSaveSurvey = async (cypher: string, args: Object): Promise<void> => {
console.log("start runCypherSaveSurvey")
    try {
        await runCypher(cypher, args)
        console.log("saved survey")
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }


}

const runCypherSavePlaceRelations = async (clearPlaceRelations: string, cypherPlaceRelations: Object, args: Object): Promise<void> => {
    console.log("start runCypherSavePlaceRelations")

    try {
        const placeVariables = Object.keys(cypherPlaceRelations)
        // @ts-ignore
        const {userId, timeStamp} = args;

        const cleared = await runCypher(clearPlaceRelations, args)

        for (let i=0; i < placeVariables.length; i++) {
            // @ts-ignore
            const data = args[placeVariables[i]]
            // @ts-ignore
            const query = cypherPlaceRelations[placeVariables[i]]

            for (let j=0; j < data.length; j++) {

                const placeData = {
                    ...data[j],
                    userId: userId,
                    timeStamp: timeStamp
                }
                const currentQuery = query[j];

                console.log("saved", placeVariables[i], "number", j)

                cleared && await runCypher(currentQuery, placeData)
            }
        }

        // placeVariables.map(
        //     async (variableName) => {
        //         // @ts-ignore
        //         const data = args[variableName]
        //         // @ts-ignore
        //         const query = cypherPlaceRelations[variableName]
        //
        //         console.log("how many enttires in place array", data.length)
        //
        //         for (let i = 0; i < data.length; i++) {
        //
        //             const placeData = {
        //                 ...data[i],
        //                 userId: userId,
        //                 timeStamp: timeStamp
        //             }
        //             const currentQuery = query[i];
        //
        //
        //             cleared && await runCypher(currentQuery, placeData)
        //
        //             console.log("Saved ", variableName, i)
        //             console.log("save query", currentQuery)
        //         }
        //     }
        // )
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }


}

const runCypherSavePersonRelations = async (cypherPersonRelation: string, args: Object): Promise<void> => {
console.log("start runCypherSavePersonRelations")

    try {
        // @ts-ignore
        const {referrerId} = args;

        console.log("args", args)
        console.log("referrerId", referrerId)
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
    const timeStamp = new Date().toISOString();
    // @ts-ignore
    const {clearPlaceRelations, saveSurvey, savePlaceRelations, savePersonRelation} = cypherQueries;


    try {
        // @ts-ignore
        const privateId = await SqlClient.getUserPrivateId(surveyData.publicId);
        if (privateId === null) {throw new Error("user private id not found");}


        const surveyArgs = {
            ...surveyData,
            timeStamp: timeStamp,
            userId: privateId
        };


        // @ts-ignore
        if (surveyData.referrerPublicId) {
            // @ts-ignore
            surveyArgs.referrerId = await SqlClient.getUserPrivateId(surveyData.referrerPublicId);
        }


        await runCypherSaveSurvey(saveSurvey, surveyArgs)
        await runCypherSavePlaceRelations(clearPlaceRelations, savePlaceRelations, surveyArgs)
        await runCypherSavePersonRelations(savePersonRelation, surveyArgs)

        return privateId;
    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }


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