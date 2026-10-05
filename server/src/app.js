import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Instagram api is running"
    })
})
export default app;