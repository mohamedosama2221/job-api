//env
require("dotenv").config();

//status codes
require("express-async-errors");

//chalk
const chalk = require("chalk");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

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
    app.listen(port, () =>
      // eslint-disable-next-line no-console
      console.log(chalk.bgGreen(`Server is listening on port ${port}...`))
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

start();