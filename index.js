const dotenv = require('dotenv');
dotenv.config();
const ESV_API_KEY = process.env.ESV_API_KEY;

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
  console.log(`→️ Request received for '${ref}'`);
  const text = await getEsvText(ref);
  console.log(`←️ Replied to request for '${ref}'`);
  res.send(text);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});