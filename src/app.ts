import express, { Application } from "express";
import cookieParser from "cookie-parser";

const app: Application = express();

// ── Global Middlewares

app.use(express.json()); // parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // parse incoming requests with urlencoded payloads
app.use(cookieParser()); // parse cookies attached to the request object

// ── Routes

// ── Global Error Handler

export default app;
