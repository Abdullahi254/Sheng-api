import express from "express"
import { addWord } from "../database/database.js"
import { tokenChecker } from "../middleware/middleware.js"

const router = express.Router()

router.post("/word", tokenChecker, async (req, res) => {
    // generating auth token to be used to access db as collaborator
    try {
        const { word, meaning, example, similes, contributorId} = req.body
        const result = await addWord(word, meaning,
            example ? JSON.stringify(example) : null,
            similes ? JSON.stringify(similes) : null,
            contributorId ? contributorId : null)
        res.status(200).json(result)
    } catch (er) {
        res.status(500).json({ error: er.message})
    }
})


export { router as words }