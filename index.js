import express from "express"
import {users} from "./customRoutes/users.js"
const app = express()
const port = 4000

app.use(express.json())

app.get("/", async (req, res) => {
    const myPromise = new Promise((res, rej) => {
        setTimeout(() => {
            res("foo")
        }, 10000)
    })
    try {
        const myText = await myPromise
        res.send(myText)
    } catch (er) {
        res.status(500).send("error")
    }
})

app.use("/users", users)

// Error-handling middleware
app.use((err, req, res, next) => {
    // Handle the error or pass it to the default error handler
    res.status(err.status || 500).json({ error: err.message });
  });

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})