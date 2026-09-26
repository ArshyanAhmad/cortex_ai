import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import dns from "dns";
import router from "./routes/chat.routes.js";

dns.setServers(["8.8.8.8", "0.0.0.0"]);
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
   res.json({ message: "hello from chat" });
});

app.listen(port, () => {
   console.log(`chat started at ${port}`);
   connectDb();
});
