import express from "express"
import { addWord, editWord, getWordByWord, getWordsByLetter, getWordsByUser } from "../database/database.js"
import { tokenChecker } from "../middleware/middleware.js"

const router = express.Router()

router.post("/word", tokenChecker, async (req, res) => {
    // adding a word to the db
    try {
        const { word, meaning, examples, synonym} = req.body
        const contributorId = req.body.user.id
        const result = await addWord(word, meaning,
            examples ? examples : null,
            synonym ? synonym : null,
            contributorId)
        res.status(200).json(result)
    } catch (er) {
        res.status(500).json({ error: er.message })
    }
})

router.get("/word", async (req, res) => {
    // getting list of words based on the starting letter
    try {
        const letter = req.query.letter
        if (letter) {
            const result = await getWordsByLetter(letter)
            res.status(200).json(result)
        } else {
            throw new Error("letter not defined!")
        }

    } catch (er) {
        res.status(500).json({ error: er.message })
    }
})

router.get("/word-details", async (req, res) => {
    // getting word detail from word param
    try {
        const word = req.query.word
        if (word) {
            const result = await getWordByWord(word)
            res.status(200).json(result)
        } else {
            throw new Error("word not defined!")
        }

    } catch (er) {
        res.status(500).json({ error: er.message })
    }
})

router.get("/word/user", async (req, res) => {
    // get words created by a specific user
    try {
        const userId = req.query.id
        if (userId) {
            const result = await getWordsByUser(userId)
            res.status(200).json(result)
        } else {
            throw new Error("Id not defined!")
        }

    } catch (er) {
        res.status(500).json({ error: er.message })
    }
})

router.put("/word", tokenChecker, async (req, res) => {
    // editing word info(only the contributor can edit the word he/she added)
    try {
        const { word, meaning, examples, synonym } = req.body
        if (word) {
            const wordQuery = req.query.word
            const theWord = await getWordByWord(wordQuery ? wordQuery : '')
            const contributorId = theWord?.contributor_id
            const userId = req.body.user.id
            if (contributorId === userId) {
                const result = await editWord(
                    word,
                    meaning ? meaning : theWord.meaning,
                    examples ? examples : theWord.examples,
                    synonym ? synonym : theWord.synonym,
                    theWord.id)
                res.status(200).json(result)
            } else {
                res.status(403).json({
                    error: "User not allowed to update word!"
                })
            }
        } else {
            res.status(400).json({
                error: "Word to update missing!"
            })
        }

    } catch (er) {
        res.status(500).json({
            error: er.message
        })
    }

})


export { router as words }