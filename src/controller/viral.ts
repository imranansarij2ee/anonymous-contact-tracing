import {Request, Response} from "express";
import * as NeoClient from "../database/neo";
import * as SchemaValidator from "../validator";
import Survey from '../model/survey'
import {isEmpty, isValidUUID} from "../lib/helper";
import axios from "axios";




export const createVirus = async (req: Request, res: Response) => {
    const virusPacket: Object = req.body;

    console.log("creatinog virusPacket", virusPacket)

    try {

        const virusPublicId = await NeoClient.createVirus(virusPacket);
        return res.status(201).json(virusPublicId);
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};

export const mutateVirus = async (req: Request, res: Response) => {
    const virusPacket: Object = req.body;

    console.log("mutation virusPacket", virusPacket)

    try {

        const virusPublicId = await NeoClient.mutateVirus(virusPacket);
        console.log("new virus id", virusPublicId)

        return res.status(201).json(virusPublicId);
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};

export const fetchVirus = async (req: Request, res: Response) => {
    const virusPacket: Object = req.body;

    console.log("virusPacket", virusPacket)

    try {

        const virus = await NeoClient.fetchVirus(virusPacket);
        console.log("fetched virus", virus)

        return res.status(201).json(virus);
    } catch (e) {
        // const neoError = e instanceof Neo4jError ? e.message : e;
        return res.status(500).json(e);
    }
};




