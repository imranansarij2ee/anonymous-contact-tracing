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
import {generateUser, getUserPrivateIdFromUserName} from "../database/sql";

dotenv.config();

const url = process.env.NEO_URI || "test";
const user = process.env.NEO_USER || "test";
const password = process.env.NEO_PASS || "test";
const driver = neo4j.driver(url, neo4j.auth.basic(user, password));






const runCypher = async (cypher: string, args: Object): Promise<any> => {
    const session = driver.session();
    try {
        const resp = await session.run(
            cypher,
            args
        )
        return resp

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

const runCypherGetLast = async (cypherGetLastQuestion: string, args: Object): Promise<object> => {
    console.log("now we are fetching last")
    try {

        const result = await runCypher(cypherGetLastQuestion, args)
        return result
        console.log("result of fetch", result)

    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }
}

const runCreateVirusCypher = async (cypherVirusCreate: string, args: Object): Promise<object> => {
    console.log("now we are creating a virus usin g", cypherVirusCreate)
    try {

        const result = await runCypher(cypherVirusCreate, args)
        console.log("result of create", result)
        return result


    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }
}

const runMutateCypher = async (cypherVirusMutate: string, args: Object): Promise<object> => {
    console.log("now we are mutating a virus")
    try {

        const result = await runCypher(cypherVirusMutate, args)
        return result

    } catch (e) {
        console.log(e)
        throw e;
    } finally {
    }
}

const runFetchCypher = async (cypherVirusFetch: string, args: Object): Promise<object> => {

    try {

        const result = await runCypher(cypherVirusFetch, args)
        return result


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
        // runCypherSaveVirusRelations


        return privateId;
    } catch (e) {
        console.log("updateSurveyEntry")
        console.log(e)
        throw e;
    } finally {
    }


}

export const makePersonNode = async (survey: Survey): Promise<Object> => {

    const surveyData = survey.surveyData;
    const cypher = survey.cypher;
    const timeStamp = new Date().toISOString();


    try {
        const surveyArgs = {
            ...surveyData,
            timeStamp: timeStamp
        };

        console.log("surveyArgs", surveyArgs)

        await runCypherSaveSurvey(cypher, surveyArgs)



    } catch (e) {
        console.log("updateSurveyEntry")
        console.log(e)
        throw e;
    } finally {
    }


}

export const submitCookie = async (survey: Survey): Promise<Object> => {
    console.log("subit cookie land now")

    const surveyData = survey.surveyData;
    const cypherQueries = survey.cypher;

    // @ts-ignore
    const {lastQuestionCypher} = cypherQueries;


    console.log("surveyData", surveyData)
    try {
        // @ts-ignore
        const id = await SqlClient.getUserPrivateIdFromUserName(surveyData.cookiesUsername);
        if (id === null) {throw new Error("user private id not found");}

        console.log("privateId", id)

        // @ts-ignore
        const surveyArgs = {
            userId: id.private_id
        };

        const lastQuestion = await getLastQuestion(surveyArgs, lastQuestionCypher)


        console.log("surveyArgs in submit cookie neots", surveyArgs)


        const result = {public_id: id.public_id, lastQuestion: lastQuestion.records[0]._fields[0]}
        console.log("result from subit cookie", result)

        return result;
    } catch (e) {
        console.log("submit cookie error")
        // console.log(e)
        throw e;
    } finally {
    }


}

export const getLastQuestion = async (surveyArgs: Object, getLastQuestionCypherQuery: String): Promise<Object> => {


    try {


        // @ts-ignore
        const result = await runCypherGetLast(getLastQuestionCypherQuery, surveyArgs)
        return result
    } catch (e) {
        console.log("getlastquestion")
        console.log(e)
        throw e;
    } finally {
    }
}

export const createVirus = async (virusPacket: Object): Promise<Object> => {

    // @ts-ignore
    const {virus, cypher} = virusPacket
    // @ts-ignore
    const {virusText, publicId} = virus;

    // @ts-ignore
    const createCypher = cypher.create;
    const joinCypher = cypher.join

    console.log("cyphers", cypher)

    const timeStamp = new Date().toISOString();


    try {
        // @ts-ignore
        const privateUserId = await SqlClient.getUserPrivateId(publicId);
        if (privateUserId === null) {throw new Error("user private id not found");}

        // @ts-ignore
        const {public_id: virusPublicId}  = await SqlClient.generateUser();
        const virusId      = await SqlClient.getUserPrivateId(virusPublicId)


        const virusArgs = {
            timeStamp: timeStamp,
            userId: privateUserId,
            virusText: virusText,
            virusId: virusId
        };

        console.log("createCypher just before runCreateVirusCypoher", createCypher)
        await runCreateVirusCypher(createCypher, virusArgs)
        await runCreateVirusCypher(joinCypher, virusArgs)

        return virusPublicId;
    } catch (e) {
        console.log("create virus:")
        console.log(e)
        throw e;
    } finally {
    }


}

export const mutateVirus = async (virusPacket: Object): Promise<Object> => {

    // @ts-ignore
    const {mutation, cypher} = virusPacket
    // @ts-ignore
    const {virusText, publicId, virusPublicId} = mutation;
    console.log("virusPacket", virusPublicId)


    const newVirusPacket = {
        virus: {
            virusText: virusText,
            publicId: publicId
        },
        cypher: cypher
    }



    try {

        const childPublicId = await createVirus(newVirusPacket)
        const {mutate: mutateCypher} = cypher


        const timeStamp = new Date().toISOString();

        // @ts-ignore
        const privateVirusIdChild = await SqlClient.getUserPrivateId(childPublicId);
        if (privateVirusIdChild === null) {throw new Error("virus private id not found");}
console.log("got passed first getuserprivate id mutatevirus")
        console.log("going to use virusParentPublicId:", virusPublicId)

        // @ts-ignore
        const privateVirusIdParent = await SqlClient.getUserPrivateId(virusPublicId);
        if (privateVirusIdParent === null) {throw new Error("virus private id not found");}
        console.log("got passed second getuserprivate id mutatevirus")

        const virusArgs = {
            timeStamp: timeStamp,
            virusIdParent: privateVirusIdParent,
            virusIdChild: privateVirusIdChild
        };

        console.log("just before mutate dcypher", mutateCypher, virusArgs)

        await runMutateCypher(mutateCypher, virusArgs)

        return childPublicId;
    } catch (e) {
        console.log("mutate virus")
        console.log(e)
        throw e;
    } finally {
    }

}

export const fetchVirus = async (virusPacket: Object): Promise<Object> => {

    const timeStamp = new Date().toISOString();

    // @ts-ignore
    const {virus, cypher} = virusPacket;

    const {fetch, link} = cypher

    // @ts-ignore
    const {virusPublicId, publicId, referrerPublicId} = virus;


    try {
        console.log("getting private virus id", virusPublicId)
        // @ts-ignore
        const privateVirusId = await SqlClient.getUserPrivateId(virusPublicId);
        if (privateVirusId === null) {throw new Error("virus private id not found");}

        console.log("getting private user id", publicId)
        // @ts-ignore
        const privateUserId = await SqlClient.getUserPrivateId(publicId);
        if (privateUserId === null) {throw new Error("user private id not found");}

        console.log("getting private referrer id", referrerPublicId)
        // @ts-ignore
        const privateReferrerId = await SqlClient.getUserPrivateId(referrerPublicId);
        if (privateReferrerId === null) {throw new Error("referrer private id not found");}


        const virusArgs = {
            virusId: privateVirusId,
            personId: privateUserId,
            referrerId: privateReferrerId,
            timeStamp: timeStamp
        };

        const virus = await runFetchCypher(fetch, virusArgs)

        const fake = async (virus, link, virusArgs) => {


            await runFetchCypher(link, virusArgs)
        }

        await fake(virus, link, virusArgs)

        return virus;

    } catch (e) {
        console.log("fetch Virus")
        console.log(e)
        throw e;
    } finally {
    }

}