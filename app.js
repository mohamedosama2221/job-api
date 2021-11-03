//env
require("dotenv").config();

//status codes
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load(swaggerUI);

//express
const express = require("express");
const app = express();

//DB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

//auth Middleware
const authMiddleware = require("./middleware/authentication");

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// security middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("<h1>Job API</h1><a href='/api-docs'>Documentation</a>");
});

app.use("api-docs", swaggerUI.serve, swaggerUI.serveFiles(swaggerDocument));
// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobRouter);

//custom middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//port
const port = process.env.PORT || 3000;

//start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port);
  } catch (error) {
    throw new Error(error.message);
  }
};

start();
