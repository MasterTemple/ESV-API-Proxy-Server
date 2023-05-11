const dotenv = require('dotenv');
dotenv.config();
const ESV_API_KEY = process.env.ESV_API_KEY;

const fs = require('fs');
const logDir = "./logs";

if (!fs.existsSync(logDir))
  fs.mkdirSync(logDir);

const start = new Date();
const logFile = fs.createWriteStream(`logs/${start.valueOf()}.log`);

function log(isRequest, ref, ip) {
  const time = new Date();
  let output = "←️ Response: ";
  if (isRequest)
    output = "→️ Request:  ";
  output += `For "${ref}" at "${time.toISOString()}" from "${ip}"`;

  console.log(output);
  logFile.write(output + "\n");
}

const axios = require('axios');

async function getEsvText(passage) {
  const API_URL = 'https://api.esv.org/v3/passage/text/';

  const params = {
    q: passage,
    include_headings: false,
    include_footnotes: false,
    include_verse_numbers: false,
    include_short_copyright: false,
    include_passage_references: false
  };

  const headers = {
    Authorization: `Token ${ESV_API_KEY}`
  };

  try {
    const response = await axios.get(API_URL, { params, headers });

    const passages = response.data.passages;

    return passages.length > 0 ? passages[0].trim() : 'Error: Passage not found';
  } catch (err) {
    console.error(err.message);
    return 'Error: Failed to fetch passage';
  }
}

const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*'
}));

app.get("/esv/:ref", async (req, res) => {
  const ref = req.params.ref;
  const ip = req.ip;
  log(true, ref, ip);

  const text = await getEsvText(ref);

  log(false, ref, ip);
  res.send(text);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});