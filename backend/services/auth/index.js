import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/auth.route.js";
import dns from "dns";
dotenv.config();

dns.setServers(["8.8.8.8", "0.0.0.0"]);

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
   res.json({ message: "hello from auth" });
});

app.listen(port, () => {
   console.log(`auth started at ${port}`);
   connectDb();
});
