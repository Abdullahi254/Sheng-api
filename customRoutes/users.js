import express from "express"
import bycrypt from "bcrypt"
import { createCollaborator, getUserByName, createAdmin} from "../database/database.js"
import { signUppassChecker, userNameChecker, regTokenChecker } from "../middleware/middleware.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

router.post("/generate/collabtoken", async (req, res) => {
    // generating auth token to be used to access db as collaborator
    try {
        const { userName, password } = req.body
        const user = await getUserByName(userName)
        const hashedPassword = user.password_hash
        const isUser = await bycrypt.compare(password, hashedPassword)
        if (isUser) {
            const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "1h" })
            res.status(200).json({
                token
            })
        } else {
            res.status(403).json({ error: "Logging in Failed!" })
        }
    } catch (er) {
        res.status(500).json({ error: "Failed to generate token!" })
    }
})

router.post("/generate/regtoken", async (req, res) => {
    // generating auth token to be used to when registering as admin
    try {
        const { userName, password } = req.body
        const admin = await getUserByName(userName)
        const hashedPassword = admin.password_hash
        const isUser = await bycrypt.compare(password, hashedPassword)
        if (isUser && admin.role_id === 1) {
            const token = jwt.sign(admin, process.env.MY_SECRET2, { expiresIn: "1h" })
            res.status(200).json({
                token
            })
        } else {
            res.status(403).json({ error: "Logging in Failed!" })
        }
    } catch (er) {
        res.status(500).json({ error: "Failed to generate token!" })
    }
})

router.post("/register", regTokenChecker, userNameChecker, signUppassChecker, async (req, res) => {
    // special route to register as a collaborator
    try {
        const { userName, password } = req.body
        const hashedPassword = await bycrypt.hash(password, 10)
        const collaborator = await createCollaborator(userName, hashedPassword)
        const token = jwt.sign(collaborator, process.env.MY_SECRET, { expiresIn: "1h" })
        res.status(200).json({
            user: collaborator,
            token
        })
    } catch (er) {
        res.status(500).json({ error: "Failed to create contributor/ user might already exist" })
    }
})

// router.post("/register/admin", userNameChecker, signUppassChecker, async (req, res) => {
//     // special route to register admin
//     try {
//         const { userName, password } = req.body
//         const hashedPassword = await bycrypt.hash(password, 10)
//         const admin = await createAdmin(userName, hashedPassword)
//         const token = jwt.sign(admin, process.env.MY_SECRET, {expiresIn: "1h"})
//         res.status(200).json({
//             user: admin,
//             token
//         })
//     } catch (er) {
//         res.status(500).json({error:"Failed to create Admin/ user might already exist"})
//     }
// })

router.put("/update", (req, res) => {
    // updating users details
    res.send("user updated")
})

export { router as users }

