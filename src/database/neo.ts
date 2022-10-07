import * as neo4j from 'neo4j-driver'
import * as dotenv from 'dotenv';
import Survey from '../model/survey'
import {
    createSurveyCypher,
    friendWithRelationCypher,
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

export const createSurveyEntry = async (survey: Survey): Promise<Object> => {
    const privateId = await SqlClient.getUserPrivateId(survey.publicID);
    if (privateId === null) {
        throw new Error("user private id not found");
    }
    survey.userId = privateId;
    let referralTypeValue: any;
    const timeStamp = new Date().toISOString();
    referralTypeValue = isEmpty(survey.referrerID) ? "NONE" : referralTypeMapping.get(survey.referralType);
    const surveyArgs = {...survey, referralTypeValue, timeStamp};
    const session = driver.session();


    try {
        await session.run(
            createSurveyCypher,
            surveyArgs
        );

        await createRelation(survey);


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
    const surveyUser = await SqlClient.getUserPrivateId(survey.publicID);
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

