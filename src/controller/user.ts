import {Request, Response} from 'express';
import {findUser, generateUser} from "../database/sql";
import User from "../model/user";
import {isValidUUID} from "../lib/helper";


// Get user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await generateUser();
        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json(e);
    }
};


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
    const username = req.params.username;
    try {
        const sql = `SELECT *
                     FROM user_info
                     WHERE user_name = '${username}' LIMIT 1`;
        const data: User | null = await findUser(sql);
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