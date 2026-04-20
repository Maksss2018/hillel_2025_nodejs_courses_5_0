import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { homeRouter, uploadRouter } from "./routes/index.js";
import { ROUTES } from "./common/index.js";
import { notFoundHandler } from "./middleware/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.use(logger("tiny"));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(ROUTES.HOME, homeRouter);

app.use(ROUTES.UPLOAD, uploadRouter);

app.use(notFoundHandler);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
