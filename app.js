const express = require("express");
const parseFilmsInfo = require("./parser");

const indexRouter = require("./routes/index");
const app = express();

app.use(express.json());

app.use("/", indexRouter);

app.listen(3000, async () => {
  await parseFilmsInfo(process.env.PARSE_URL);
});

module.exports = app;
