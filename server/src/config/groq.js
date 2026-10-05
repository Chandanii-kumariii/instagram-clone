import Groq from "groq-sdk"

const groq = new Groq({
    apikey: process.env.GROQ_API
})
export default groq;