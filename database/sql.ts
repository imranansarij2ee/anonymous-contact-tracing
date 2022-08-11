import {Pool} from 'pg';
import {v4} from 'uuid';
import {User} from '../controller/user';
import {adjectives, colors, Config, names, uniqueNamesGenerator} from "unique-names-generator";
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
    const user = await findUser(sql);
    return !(Array.isArray(user) && user.length > 0);

}

export async function findUser(sql: string): Promise<User> {
    try {
        const client = await pool.connect();
        const {rows: results} = await client.query(sql);
        let data = null;
        if (Array.isArray(results) && results.length > 0) {
            data = results.pop();
            delete data["private_id"];
        }
        client.release();
        return new User(data);
    } catch (error) {
        console.error("findUserById : ", error);
        throw new Error("sql issue")
    }
}

function generateUserName(): string {
    const customConfig: Config = {
        dictionaries: [names, adjectives, colors],
        separator: '-',
        style: "lowerCase"
    };

    return uniqueNamesGenerator(customConfig);
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
        console.log(insert_statement)
        const {rowCount} = await client.query(insert_statement);
        if (rowCount == 0) {
            console.error("no entry created")
        }
        // client.release();
        return {
            user_name,
            public_id
        }

    } catch (error) {
        console.error("createUser : ", error);
        throw new Error("sql issue")
    }
}