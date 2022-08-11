import neo4j from 'neo4j-driver'
// import dotenv from 'dotenv';
// dotenv.config();

const port: string = process.env.NEO_PORT || "2000";
const uri: string = process.env.NEO_URI || "test";
const user: string = process.env.NEO_USER || "default";
const password: string = process.env.NEO_PASS || "default";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()

const createPlaceQuery : string = ``;

const createPersonQuery: string = `CREATE (a:Person { places: $places ,age: $age ,
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
travelTime: $travelTime ,vaccinationDate: $vaccinationDate 
}) RETURN a`;

// const createPersonQuery : string = `CREATE (a:Person { age : $age , anotherPlace : $anotherPlace ,
//             bestApp : $bestApp, channel: $channel,
//             covidTestPositive: $covidTestPositive }) RETURN a`

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

    } catch (e: any) {
        throw new Error(e);
    } finally {
        await session.close()
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

// on application exit:
    await driver.close()
}