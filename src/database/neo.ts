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



export const createSurveyEntry = async (survey: Survey, cypher : string): Promise<Object> => {
    const privateId = await SqlClient.getUserPrivateId(survey.publicId);
    if (privateId === null) {
        throw new Error("user private id not found");
    }
    survey.userId = privateId;
    let referralTypeValue: any;
    const timeStamp = new Date().toISOString();
    referralTypeValue = isEmpty(survey.referrerID) ? "NONE" : referralTypeMapping.get(survey.referralType);
    const surveyArgs = {...survey, referralTypeValue, timeStamp};
    const session = driver.session();

    console.log("cypher", cypher)
    console.log("args", surveyArgs)

    try {
        await session.run(
            cypher,
            surveyArgs
        );

        //await createRelation(survey);


    } catch (e) {
        console.log(e)
        throw e;
    } finally {
        await session.close();
    }
    return privateId;

}

export const createReferralRelation = async (survey: Survey): Promise<void> => {

    if (isEmpty(survey.referrerID) || !isValidUUID(survey.referrerID)) {
        return;
    }
    const surveyUser = await SqlClient.getUserPrivateId(survey.publicId);
    const referringUser = await SqlClient.getUserPrivateId(survey.referrerID);
    const timeStamp = new Date().toISOString();
    let referralTypeValue: any;
    let referralCypher = null;
    referralTypeValue = referralTypeMapping.get(survey.referralType);
    let referralArgs = {referrerID: referringUser, userId: surveyUser, timeStamp, referralType: referralTypeValue};
    const referralType = survey.referralType;
    switch (referralType) {
        case 0:
            referralCypher = friendWithRelationCypher;
            break;
        case 1:
            referralCypher = hangoutWithRelationCypher;
            break;
        case 2:
            referralCypher = sexWithRelationCypher;
            break;
        default:
            console.log("referralType mapping not found");
            return;

    }
    if (referralCypher == null) {
        return;
    }

    await runRelationCypher(referralCypher, referralArgs);

}

// privateId, homeCensusTract, places
export const createRelation = async (survey: Survey): Promise<void> => {
    const timeStamp = new Date().toISOString();
    const userId = survey.userId;
    const censusTractId = survey.homeCensusTract;

    const groupSexArgs = survey.places.map(({placeSex, placeType, censusTract: censusTractId, placeFreqHaveSex, placeFreqAttend}) => {
        return {placeSex, placeType, userId, censusTractId, timeStamp, placeFreqHaveSex, placeFreqAttend};
    });

    const liveInArgs = {userId, censusTractId, timeStamp};
    await runRelationCypher(livesInRelationCypher, liveInArgs);

    for (const arg of groupSexArgs) {
        await runRelationCypher(groupSexRelationCypher, arg);
    }
    if (isEmpty(survey.referrerID)) {
        return;
    }
    const refereePrivateId = await SqlClient.getUserPrivateId(survey.referrerID);
    let referralCypher = null;
    const referralType = survey.referralType;
    switch (referralType) {
        case 0:
            referralCypher = friendWithRelationCypher;
            break;
        case 1:
            referralCypher = hangoutWithRelationCypher;
            break;
        case 2:
            referralCypher = sexWithRelationCypher;
            break;
        default:
            console.log("referralType mapping not found");
            return;
    }

    const referralTypeValue = referralTypeMapping.get(referralType);
    let referralArgs = {referrerID: refereePrivateId, userId, timeStamp, referralType: referralTypeValue};
    if (referralCypher !== null) {
        await runRelationCypher(referralCypher, referralArgs);
    }
}

const runRelationCypher = async (cypher: string, args: Object): Promise<void> => {
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


export const updateSurveyEntry = async (survey: Survey): Promise<Object> => {

    const surveyData = survey.surveyData;
    const cypherQueries = survey.cypher;




    // @ts-ignore
    const privateId = await SqlClient.getUserPrivateId(surveyData.publicId);



    if (privateId === null) {throw new Error("user private id not found");}

    // @ts-ignore
    surveyData.userId = privateId;



    const timeStamp = new Date().toISOString();

    const surveyArgs = {...surveyData, timeStamp};



    const session = driver.session();
    try {

        // @ts-ignore
        const {saveSurvey} = cypherQueries;



        await session.run(
            saveSurvey,
            surveyArgs
        );

        //await createRelation(surveyArgs);

    } catch (e) {
        console.log(e)
        throw e;
    } finally {
        await session.close();
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