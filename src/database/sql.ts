import {Pool} from 'pg';
import {v4} from 'uuid';
import User from '../model/user';
import {generateUserName} from '../lib/helper';
import * as dotenv from 'dotenv';

dotenv.config();
const sqlHost = process.env.SQL_HOST;
const sqlUser = process.env.SQL_USER;
const sqlPort: number = Number(process.env.SQL_PORT) || 5432;
const sqlPass = process.env.SQL_PASS;
const dbName = process.env.SQL_DB_NAME;

const pool = new Pool({
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    query_timeout: 30000,
    password: sqlPass,
    database: dbName

});

async function checkIfNameExist(username: string): Promise<boolean> {
    const sql = `SELECT *
                 FROM user_info
                 WHERE user_name = '${username}'`;
    const user: User | null = await findUser(sql);
    console.log("check if name exists", user)
    return user === null;
}

export async function findUser(sql: string): Promise<User | null> {
    try {
        const client = await pool.connect();
        const {rows: results} = await client.query(sql);
        const resp = Array.isArray(results) && results.length > 0 ?
            results.pop() : null;
        await client.release();
        if (resp !== null) {
            const {user_name, public_id, private_id} = resp;
            return new User(user_name, public_id, private_id).toPublicUser();
        }
        return null;
    } catch (e) {
        throw e;
    }
}

export async function getUserPrivateId(publicId: string): Promise<string> {
    const sql = `SELECT private_id
                 FROM user_info
                 WHERE public_id = '${publicId}'`;

    console.log("publicId", publicId)
    try {
        const client = await pool.connect();
        const {rowCount, rows: results} = await client.query(sql);
        console.log("rowCount", rowCount)
        console.log("resuilts", results)

        const data = Array.isArray(results) && results.length > 0 ?
            results.pop() : null;
        await client.release();
        return data.private_id || null;
    } catch (error) {
        throw new Error("getUserPrivateId: sql issue");
    }
}

export async function getUserPrivateIdFromUserName(username: string): Promise<string> {
    const sql = `SELECT *
                 FROM user_info
                 WHERE user_name = '${username}'`;

    console.log("username", username)
    try {
        const client = await pool.connect();
        const {rowCount, rows: results} = await client.query(sql);
        console.log("rowCount", rowCount)
        console.log("resuilts", results)

        const data = Array.isArray(results) && results.length > 0 ?
            results.pop() : null;
        await client.release();
        return data || null;
    } catch (error) {
        throw new Error("getUserPrivateId: sql issue");
    }
}

export async function generateUser(): Promise<Object> {
    try {
        let user_name = generateUserName();

        while (!await checkIfNameExist(user_name)) {
            user_name = generateUserName();
        }
        const client = await pool.connect();
        const public_id = v4();
        const private_id = v4();
        let insert_statement = `INSERT INTO user_info (user_name, public_id, private_id)
                                VALUES ('${user_name}', '${public_id}', '${private_id}')`;

        const {rowCount} = await client.query(insert_statement);

        await client.release();
        if (rowCount == 0) {
            throw new Error("no user created");
        }
        return new User(user_name, public_id, "");
        // client.release();
    } catch (error) {
        throw new Error("sql issue");
    }
}

export async function saveContact(email: string): Promise<void> {
    try {

        const client = await pool.connect();
        const id = v4();
        let insert_statement = `INSERT INTO user_contact (id, email)
                                VALUES ('${id}', '${email}')`;

        await client.query(insert_statement);
        await client.release();

    } catch (error) {
        throw error;
    }
}