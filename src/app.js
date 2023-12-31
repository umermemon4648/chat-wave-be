const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./utils/ApiError");
const app = express();
const router = require("./router");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const swaggerFile = require("../swagger_output.json"); // Generated Swagger file
const fileUpload = require("express-fileupload");
// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 2 },
  })
), // 2 MB
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(loggerMiddleware);

// router index
app.use("/", router);
// api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.get("/", (req, res) => {
//   res.send("BE-boilerplate v1.1");
// });
app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

module.exports = app;
