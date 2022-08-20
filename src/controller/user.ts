import {Request, Response} from 'express';
import {findUser, generateUser} from "../database/sql";
import User from "../model/user";


// Get user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await generateUser();
        res.status(200).send(user);
    } catch (e) {
        res.status(404).send(e);
    }
};


export const getUserByPublicId = async (req: Request, res: Response) => {
    const id = req.params.publicId;
    try {
        if (!id) {
            new Error("missing id")
        }
        const sql = `SELECT *
                     FROM user_info
                     WHERE public_id = '${id}' LIMIT 1`;
        const data: User = await findUser(sql);
        if (data == null) {
            res.status(404).send({
                "message": `resource with id : ${id} not found.`
            })
        }

        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getUserByPrivateId = async (req: Request, res: Response) => {
    const id = req.params.privateId;
    try {
        if (!id) {
            res.status(400).send({message: "missing user_id"});
        }
        const sql = `SELECT *
                     FROM user_info
                     WHERE private_id = '${id}' LIMIT 1`;
        const data: User = await findUser(sql);
        if (data == null) {
            res.status(404).send({
                "message": `resource with id : ${id} not found.`
            })
        }
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getUserByUserName = async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
        if (!username) {
            new Error("missing username");
        }
        const sql = `SELECT *
                     FROM user_info
                     WHERE user_name = '${username}' LIMIT 1`;
        const data: User = await findUser(sql);
        if (data == null) {
            res.status(404).send({
                "message": `resource with username : ${username} not found.`
            })
        }
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send(e);
    }
};