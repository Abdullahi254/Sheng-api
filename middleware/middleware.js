import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { revokeToken } from "../database/database.js"

dotenv.config()

//checks if username is there
export const userNameChecker = function (req, res, next) {
  const { userName } = req.body
  if (!userName) {
    return res.status(400).json({
      error: "UserName missing"
    })
  }

  next()
}

//function to only allow strong password
export const signUppassChecker = function (req, res, next) {
  const { password, confirmPassword } = req.body
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Password and confirmed password do not match"
    })
  }
  if (!regex.test(password)) {
    return res.status(400).json({
      error: "password must be between 8-15 characters and must contain special characters, letters and numbers"
    })
  }
  next()
}

// function to allow access to db as a collaborator if token is valid
export const tokenChecker = async function (req, res, next) {
  const authToken = req.query.token
  try {
    const decoded = jwt.verify(authToken, process.env.MY_SECRET)
    req.body.user = decoded
    next()
  } catch (er) {
    const error = new Error("Invalid auth token")
    error.status = 500
    next(error)
  }
}

// checks the jwt token and confirms it is legit for registering new contributor
export const regTokenChecker = async function (req, res, next) {
  const authToken = req.query.token
  try {
    const decoded = jwt.verify(authToken, process.env.MY_SECRET2)
    next()
  } catch (er) {
    const error = new Error("Invalid auth token")
    error.status = 500
    next(error)
  }
}