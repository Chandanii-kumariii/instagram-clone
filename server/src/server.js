import http from "http";
import app from "./app.js"
import connectDB from "./config/db.js";
import { startCronJobs } from "./utils/cronJobs.js";
import initPostScheduler from "./utils/postScheduler.js";

const PORT = process.env.PORT || 5000
const server = http.createServer(app)
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT,()=>{
            console.log("server running on port", PORT);
            startCronJobs(); // Initialize background tasks for Stories
            initPostScheduler(); // Initialize Post Scheduler worker
        })
    } catch (error) {
        console.error(" server failed :",error.message);
        process.exit(1);

    }
}
startServer();