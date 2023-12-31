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
        return rows[0]
    } catch (er) {
        throw new Error(
            er
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
        return rows[0]
    } catch (er) {
        throw new Error(
            er
        )
    }

}

export async function createCollaborator(userName, passwordHash) {
    try {
        const [result] = await pool.query(`INSERT INTO users (username, password_hash, role_id)
        VALUES (?, ?, 2)`, [userName, passwordHash])
        const id = result.insertId
        return getUser(id)
    } catch (er) {
        throw new Error(
            er
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
        return rows[0]
    } catch (er) {
        throw new Error(
            er
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
            er
        )
    }
}


export const createAdmin = async (userName, passHash) => {
    try {
        const [result] = await pool.query(`
        INSERT INTO users (username, password_hash, role_id)
        VALUES (?,?, 1)
        `, [userName, passHash])
        const id = result.insertId
        return getUser(id)
    } catch (er) {
        throw new Error(
            er
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
        return rows[0]
    } catch (er) {
        throw new Error(
            er
        )
    }
}

// function to get word from db by word
export const getWordByWord = async (word) => {
    try {
        const theWord = word.toUpperCase()
        const [rows] = await pool.query(`
        SELECT *
        FROM words
        WHERE word = ?
        `, [theWord])
        return rows[0]
    } catch (er) {
        throw new Error(
            er
        )
    }
}

// function to add a new word to the db
export const addWord = async (word, meaning, example, synonym, contributorId) => {
    try {
        // converting word to capital letter
        const newWord = word.toUpperCase()
        const [result] = await pool.query(`
        INSERT INTO words (word, meaning, examples, synonym, contributor_id)
        VALUES (?, ?, ?, ?, ?)
        `, [newWord, meaning, example, synonym, contributorId])
        const id = result.insertId
        return getWord(id)
    } catch (er) {
        throw new Error(
            er
        )
    }
}

export const editWord = async (word, meaning, examples, synonym, wordId) => {
    try {
        // converting word to capital letter
        const newWord = word.toUpperCase()
        const [result] = await pool.query(`
        UPDATE words
        SET
        word = ?,
        meaning = ?,
        examples = ?,
        synonym = ?
        WHERE id = ?
        `, [newWord, meaning, examples, synonym, wordId])
        return {
            word: newWord,
            meaning: meaning,
            examples: examples,
            synonym: synonym
        }
    } catch (er) {
        throw new Error(
            er
        )
    }
}

//function to get list of words based on the starting letter
export const getWordsByLetter = async (letter) => {
    const newLetter = letter.toUpperCase()
    try {
        const [result] = await pool.query(`
            SELECT * FROM words WHERE word LIKE '${newLetter}%'
        `)
        return (result)
    } catch (er) {
        throw new Error(er)
    }
}

//function to get list of words based on the user ID
export const getWordsByUser = async (id) => {
    try {
        const [result] = await pool.query(`
            SELECT * FROM words WHERE contributor_id = ?
        `, [id])
        return (result)
    } catch (er) {
        throw new Error(er)
    }
}

//function to get list of latest 5 words
export const getLatestByUser = async (id) => {
    try {
        const [result] = await pool.query(`
            SELECT * FROM words 
            WHERE contributor_id = ?
            LIMIT 5
        `, [id])
        return (result)
    } catch (er) {
        throw new Error(er)
    }
}
