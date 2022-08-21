export const createSurveyCypher: string = `CREATE (p:Person { 
age: $age ,
anotherQuestion: $anotherQuestion,
bestApp: $bestApp ,
channel: $channel ,
countFriends: $countFriends,
countPhysical: $countPhysical,
countSex: $countSex,
covidTestPositive: $covidTestPositive,
groupSex: $groupSex ,
gender: $gender,
hivPrep: $hivPrep ,
hivStatus: $hivStatus ,
hivSuppressed: $hivSuppressed ,
monkeypoxCare: $monkeypoxCare, 
monkeypoxTest: $monkeypoxTest,
monkeypoxVaccine: $monkeypoxVaccine, 
publicID: $publicID,
raceAsian:$raceAsian, 
raceBlack: $raceBlack, 
raceLatinx: $raceLatinx ,
raceOther: $raceOther ,
racePacific:$racePacific ,
raceWhite: $raceWhite, 
referrerEnglish: $referrerEnglish, 
referralType: $referralType,
referrerEnglish: $referrerEnglish,
referrerID: $referrerID , 
returnParticipant: $returnParticipant,
sex: $sex, 
sexOrientation: $sexOrientation ,
symptomBackAche: $symptomBackAche ,
symptomBodyRash: $symptomBodyRash ,
symptomChills: $symptomChills, 
symptomExhaustion: $symptomExhaustion,
symptomFacialRash: $symptomFacialRash , 
symptomFever: $symptomFever ,
symptomHeadache: $symptomHeadache ,
symptomMouth: $symptomMouth ,
symptomMuscleAche: $symptomMuscleAche ,
symptomOther: $symptomOther,
symptomRectalDiscomfort: $symptomRectalDiscomfort ,
symptomSorePenis:$symptomSorePenis,
symptomSoreThroat: $symptomSoreThroat ,
symptomSoresAnus: $symptomSoresAnus, 
symptomSwollenGlands: $symptomSwollenGlands ,
travelTime: $travelTime ,
vaccinationDate: $vaccinationDate , 
userName: $userName,
vaccinationDate: $vaccinationDate
}) RETURN p`;

export const groupSexRelationCypher: string = `MATCH (p:Person {userId:$userId  })
MATCH (c:CensusTract {identifier : $censusTractId })
CREATE (p)-[r:GROUP_SEX_IN]->(c)
SET r.createdAt=$timeStamp, r.placeSex=$placeSex , r.placeType=$placeType`;

export const livesInRelationCypher: string = `MATCH (p:Person {userId:$userId  })
MATCH (c:CensusTract {identifier : $censusTractId })
CREATE (p)-[r:LIVES_IN]->(c)
SET r.createdAt=$timeStamp`;

export const friendWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:FRIENDS_WITH]->(b)
SET r.createdAt=$timeStamp`;

export const hangoutWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:HANGOUT_WITH]->(b)
SET r.createdAt=$timeStamp`;

export const sexWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:HAD_SEX_WITH]->(b)
SET r.createdAt=$timeStamp`;

export const createAndMergeCensusTractQuery: string = `MERGE (c:CensusTract { identifier : $censusTract }) RETURN c`;

export const referralTypeMapping = new Map([[0, "FRIENDS_WITH"], [1,"HANGOUT_WITH"] ,[2,"HAD_SEX_WITH"]]);