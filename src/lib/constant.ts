export const createSurveyCypher :  string = `MERGE (p:Person { userId :  $userId}) SET p.age = $age ,
p.anotherQuestion = $anotherQuestion , p.bestApp = $bestApp ,
p.channel =  $channel , p.completeResponse = $completeResponse,
p.covidTestPositive =  $covidTestPositive,
p.countFriends =  $countFriends, p.countPhysical =  $countPhysical, p.countSex =  $countSex, p.english = $english, p.gender =  $gender,
p.groupSex =  $groupSex, p.hivPrep =  $hivPrep ,p.hivStatus =  $hivStatus ,
p.hivSuppressed =  $hivSuppressed ,p.monkeypoxCare =  $monkeypoxCare, p.monkeypoxTest =  $monkeypoxTest,
p.monkeypoxVaccine =  $monkeypoxVaccine, p.monkeypoxDiagnosis =  $monkeypoxDiagnosis, p.raceAsian = $raceAsian, p.racePacific = $racePacific ,
p.raceBlack =  $raceBlack, p.raceLatinx =  $raceLatinx ,p.raceOther =  $raceOther ,p.raceWhite =  $raceWhite, 
p.referrerEnglish =  $referrerEnglish, p.referralType = $referralTypeValue,
p.sex =  $sex, p.sexOrientation =  $sexOrientation ,p.symptomBackAche =  $symptomBackAche ,
p.symptomBodyRash =  $symptomBodyRash ,p.returnParticipant = $returnParticipant,
p.symptomChills =  $symptomChills, p.symptomExhaustion =  $symptomExhaustion,
p.symptomFacialRash =  $symptomFacialRash , p.symptomFever =  $symptomFever ,
p.symptomHeadache =  $symptomHeadache ,p.symptomMouth =  $symptomMouth ,
p.symptomMuscleAche =  $symptomMuscleAche ,p.symptomOther =  $symptomOther,
p.symptomRectalDiscomfort =  $symptomRectalDiscomfort ,p.symptomSoreThroat =  $symptomSoreThroat ,
p.symptomSorePenis = $symptomSorePenis,
p.symptomSoresAnus =  $symptomSoresAnus, p.symptomSwollenGlands =  $symptomSwollenGlands ,
p.travelTime =  $travelTime ,p.vaccinationDate =  $vaccinationDate , p.userId  =  $userId, 
p.createdAt = $timeStamp
`;


export const groupSexRelationCypher: string = `MATCH (p:Person {userId:$userId  })
MATCH (c:CensusTract {identifier : $censusTractId })
MERGE (p)-[r:GROUP_SEX_IN]->(c)
SET r.createdAt=$timeStamp, r.placeSex=$placeSex , r.placeType=$placeType,
r.placeFreqAttend=$placeFreqAttend, r.placeFreqHaveSex=$placeFreqHaveSex`;

export const livesInRelationCypher: string = `MATCH (p:Person {userId:$userId  })
MATCH (c:CensusTract {identifier : $censusTractId })
MERGE (p)-[r:LIVES_IN]->(c)
SET r.createdAt=$timeStamp`;

export const friendWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:FRIENDS_WITH]->(b)
SET r.createdAt=$timeStamp
SET a.referralType=$referralType`;

export const hangoutWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:HANGOUT_WITH]->(b)
SET r.createdAt=$timeStamp
SET a.referralType=$referralType`;

export const sexWithRelationCypher: string = `MATCH (a:Person {userId:$userId  })
MATCH (b:Person {userId : $referrerID })
CREATE (a)-[r:HAD_SEX_WITH]->(b)
SET r.createdAt=$timeStamp
SET a.referralType=$referralType`;

export const createAndMergeCensusTractQuery: string = `MERGE (c:CensusTract { identifier : $censusTract }) RETURN c`;

export const referralTypeMapping = new Map([[0, "FRIENDS_WITH"], [1,"HANGOUT_WITH"] ,[2,"HAD_SEX_WITH"]]);