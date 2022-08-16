import * as neo4j from 'neo4j-driver'
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.NEO_URI || "test";
const user = process.env.NEO_USER || "test";
const password = process.env.NEO_PASS || "test";
const driver = neo4j.driver(url, neo4j.auth.basic(user, password))
const session = driver.session()


const createPersonQuery: string = `CREATE (a:Person { age: $age ,
anotherPlace: $anotherPlace ,bestApp: $bestApp ,
channel: $channel ,covidTestPositive: $covidTestPositive,
groupSex: $groupSex ,hivPrep: $hivPrep ,hivStatus: $hivStatus ,
hivSuppressed: $hivSuppressed , mapGroupSex: $mapGroupSex, mapHome: $mapHome , 
monkeypoxCare: $monkeypoxCare, monkeypoxTest: $monkeypoxTest,
monkeypoxVaccine: $monkeypoxVaccine, raceAPI: $raceAPI ,raceBlack: $raceBlack, 
raceLatinx: $raceLatinx ,raceOther: $raceOther ,raceWhite: $raceWhite, 
referrerEnglish: $referrerEnglish, referrerID: $referrerID ,sex: $sex,
sexOrientation: $sexOrientation ,symptomBackAche: $symptomBackAche ,
symptomBodyRash: $symptomBodyRash ,
symptomChills: $symptomChills, symptomExhaustion: $symptomExhaustion,
symptomFacialRash: $symptomFacialRash , symptomFever: $symptomFever ,
symptomHeadache: $symptomHeadache ,symptomMouth: $symptomMouth ,
symptomMuscleAche: $symptomMuscleAche ,symptomOther: $symptomOther,
symptomRectalDiscomfort: $symptomRectalDiscomfort ,symptomSoreThroat: $symptomSoreThroat ,
symptomSoresAnus: $symptomSoresAnus, symptomSwollenGlands: $symptomSwollenGlands ,
travelTime: $travelTime ,userName: $userName,
vaccinationDate: $vaccinationDate 
}) RETURN a`;

const personPlaceRelationQuery = `MATCH
  (a:Person),
  (p:Place)
WHERE a.name = 'A' AND p.censusTract = 'B'
CREATE (a)-[r:RELTYPE {name: a.name + '<->' + b.name}]->(b)
RETURN type(r), r.name`

const createPlaceQuery: string = `CREATE (p:Place { censusTract : $censusTract , placeSex : $placeSex ,
            placeType : $placeType }) RETURN p`;

// const runCypherWithArgument= async (cypher : string, arg : Object): Promise<Object> =>{
//     try {
//         const result = await session.run(
//             cypher,
//             arg
//         )
//
//         const singleRecord = result.records[0]
//         const node = singleRecord.get(0)
//         console.log(node.properties.name)
//         return node;
//
//     } catch (e) {
//         throw e;
//     } finally {
//         await session.close();
//     }
//
// // on application exit:
//     await driver.close()
// }


export const createPerson = async (person: Object): Promise<Object> => {
    try {
        const result = await session.run(
            createPersonQuery,
            person
        )

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)
        console.log(node.properties.name)
        return node;

    } catch (e) {
        throw e;
    } finally {
        await session.close();
    }

// on application exit:
    await driver.close()
}


export const createPlace = async (place: Object): Promise<Object> => {
    try {
        const result = await session.run(
            createPlaceQuery,
            place
        )

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)
        console.log(node.properties.name)
        return node;

    } catch (e: any) {
        throw new Error(e);
    } finally {
        await session.close()
    }

    await driver.close()
}

