import {Request, Response} from 'express';
import {findUser, generateUser, saveContact} from "../database/sql";
import User from "../model/user";
import {SqlError} from "../model/error";
import {isValidEmail, isValidUUID} from "../lib/helper";
import * as NeoClient from "../database/neo";
import Survey from "../model/survey";
import axios from "axios";
import * as SchemaValidator from "../validator";
import {makePersonNode} from "../database/neo";


// Get user
export const createUser = async (req: Request, res: Response) => {
    console.log("creating user")



    try {


        const user = await generateUser();
        console.log("created user", user)



        const surveyData = {userId: user.private_id, lastQuestion: "consent"}
        const cypher = `MERGE (p:Person {userId: $userId}) SET p.lastQuestion=$lastQuestion`

        const neoPayload = {surveyData: surveyData, cypher: cypher}

        await NeoClient.makePersonNode(neoPayload);


        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json(e);
    }
};

export const createContact = async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!isValidEmail(email)) {
        return res.status(400).json({
            "message": `email : ${email} is not valid`
        })
    }
    try {
        await saveContact(email);
        return res.status(201).json();
    } catch (e: any) {
        const {detail, constraint}: SqlError = e;

        if (detail.includes('already exists') && constraint === 'user_contact_email_uindex') {
            return res.status(409).json({
                "message": `email : ${email} already exist`
            });
        }
        return res.status(500).json(e);
    }
}


export const getUserByPublicId = async (req: Request, res: Response) => {
    const id = req.params.publicId;
    if (!isValidUUID(id)) {
        return res.status(400).json({
            "message": `provided id :${id} is not valid uuid`
        })
    }
    try {
        const sql = `SELECT *
                     FROM user_info
                     WHERE public_id = '${id}' LIMIT 1`;
        const data: User | null = await findUser(sql);
        if (data == null) {
            return res.status(404).json({
                "message": `resource with id : ${id} not found.`
            })
        }

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json(e);
    }
};

export const getUserByPrivateId = async (req: Request, res: Response) => {
    const id = req.params.privateId;
    if (!isValidUUID(id)) {
        return res.status(400).json({
            "message": `provided id :${id} is not valid uuid`
        })
    }
    try {
        const sql = `SELECT *
                     FROM user_info
                     WHERE private_id = '${id}' LIMIT 1`;
        const data: User | null = await findUser(sql);
        if (data == null) {
            return res.status(404).json({
                "message": `resource with id : ${id} not found.`
            })
        }
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json(e);
    }
};

export const getUserByUserName = async (req: Request, res: Response) => {
    console.log("getting user by username:", req.params.username)
    const username = req.params.username;
    try {
        const sql = `SELECT *
                     FROM user_info
                     WHERE user_name = '${username}' LIMIT 1`;
        const data: User | null = await findUser(sql);

        console.log("getting user by username result", data)

        if (data == null) {
            return res.status(404).json({
                "message": `resource with username : ${username} not found.`
            })
        }

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json(e);
    }
};