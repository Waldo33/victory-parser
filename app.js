const express = require("express");
const parseFilmsInfo = require("./parser");

const indexRouter = require("./routes/index");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", indexRouter);

app.listen(5000, async () => {
  await parseFilmsInfo(process.env.PARSE_URL);
});

module.exports = app;
