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
    max: 20,
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    password: sqlPass,
    database: dbName

});

async function checkIfNameExist(username: string): Promise<boolean> {

    const sql = `SELECT *
                 FROM user_info
                 WHERE user_name = '${username}'`;
    const user: User = await findUser(sql);
    return user.isEmpty();
}

export async function findUser(sql: string): Promise<User> {
    try {
        const client = await pool.connect();
        const {rows: results} = await client.query(sql);
        const {user_name, public_id, private_id }  = Array.isArray(results) && results.length > 0 ?
           results.pop() : new User("", "", "");
          client.release();
        return new User(user_name, public_id, private_id).toPublicUser();
    } catch (error) {
        console.error("findUserById : ", error);
        throw new Error("sql issue")
    }
}

export async function getUserPrivateId(publicId: string): Promise<string> {
    const sql = `SELECT private_id
                 FROM user_info
                 WHERE public_id = '${publicId}'`;
    try {
        const client = await pool.connect();
        const {rowCount, rows: results} = await client.query(sql);

        const data = Array.isArray(results) && results.length > 0 ?
            results.pop() : null;
        client.release();
        return data.private_id || null;
    } catch (error) {
        console.error("getUserPrivateId : ", error);
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

        if (rowCount == 0) {
            throw new Error("no user created");
        }
        return new User(user_name, public_id, "");
        // client.release();
    } catch (error) {
        throw new Error("sql issue");
    }
}