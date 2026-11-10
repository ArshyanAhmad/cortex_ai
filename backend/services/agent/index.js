import express from "express";
import dns from "dns";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";
dotenv.config();

dns.setServers(["8.8.8.8", "0.0.0.0"]);

const port = process.env.PORT;

const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use("/", router);

app.use((err, req, res, next) => {
   console.error("Agent service error:", err?.message || err);

   if (err.status && err.data) {
      return res.status(err.status).json(err.data);
   }

   const safeMessage = err?.response?.data?.message || err?.data?.message || err?.message || "Internal agent error";
   return res.status(err.status || 500).json({ message: safeMessage });
});

app.get("/", (req, res) => {
   res.json({ message: "hello from agent" });
});

app.listen(port, () => {
   console.log(`agent started at ${port}`);
   connectDb();
});
