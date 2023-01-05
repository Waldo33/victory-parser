const express = require("express");
const path = require("path");
const router = express.Router();
// const parseFilmsInfo = require('../parser')

router.get("/", async function (req, res) {
  res.status(200).sendFile(path.resolve("films.json"));
  // res.json(await parseFilmsInfo(process.env.PARSE_URL))
});

module.exports = router;
