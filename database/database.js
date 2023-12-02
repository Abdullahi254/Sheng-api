import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getRoles() {
    const [results] = await pool.query("SELECT * FROM roles")
    return results
}

export async function getUser(id) {
    try {
        const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `, [id])
        //@ts-expect-error
        return rows[0]
    } catch (er) {
        throw new Error(
            "could not find user!"
        )
    }

}
export async function getUserByName(name) {
    try {
        const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE username = ?
        `, [name])
        //@ts-expect-error
        return rows[0]
    } catch (er) {
        throw new Error(
            "could not find user!"
        )
    }

}

export async function createCollaborator(userName, passwordHash) {
    try {
        const [result] = await pool.query(`INSERT INTO users (username, password_hash, role_id)
        VALUES (?, ?, 2)`, [userName, passwordHash])
        //@ts-expect-error
        const id = result.insertId
        return getUser(id)
    } catch (er) {
        throw new Error(
            "could not add collaborator!"
        )
    }

}

export async function getToken(id) {
    try {
        const [rows] = await pool.query(`
        SELECT *
        FROM reg_tokens
        WHERE id = ?
        `, [id])
        //@ts-expect-error
        return rows[0]
    } catch (er) {
        throw new Error(
            "Failed fetching token!"
        )
    }

}



export async function revokeToken(token) {
    try {
        const result = await pool.query(`
        UPDATE reg_tokens
        SET is_valid = false 
        WHERE token = ?
        `, [token])
        console.log(result)
    } catch (er) {
        throw new Error(
            "could not revoke token!"
        )
    }
}


export const createAdmin = async (userName, passHash) => {
    try {
        const [result] = await pool.query(`
        INSERT INTO users (username, password_hash, role_id)
        VALUES (?,?, 1)
        `, [userName, passHash])
        //@ts-expect-error
        const id = result.insertId
        return getUser(id)
    } catch (er) {
        throw new Error(
            "could not Add Admin!"
        )
    }
}

// function to get word from db by id
export const getWord = async (id) => {
    try {
        const [rows] = await pool.query(`
        SELECT *
        FROM words
        WHERE id = ?
        `, [id])
        //@ts-expect-error
        return rows[0]
    } catch (er) {
        throw new Error(
            "could not find word!"
        )
    }
}


// function to add a new word to the db
export const addWord = async ( word, meaning, example = null, similes = null, contributorId = null ) => {
    try {
        const [result] = await pool.query(`
        INSERT INTO users (word, meaning, examples, similes, contributor_id)
        VALUES (?, ?, ?, ?, ?)
        `, [word, meaning, example, similes, contributorId])
        //@ts-expect-error
        const id = result.insertId
        return getWord(id)
    } catch (er) {
        throw new Error(
            "could not Add word!"
        )
    }
}
