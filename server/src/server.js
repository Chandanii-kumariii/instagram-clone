import http from "http";
import app from "./app.js"
import connectDB from "./config/db.js";


const PORT = process.env.PORT || 5000
const server = http.createServer()
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT,()=>{
            console.log("server running on port", PORT);
        })
    } catch (error) {
        console.error(" server failed :",error.message);
        process.exit(1);

    }
}
startServer();