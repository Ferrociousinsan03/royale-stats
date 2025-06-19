require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

const API_BASE = 'https://api.clashroyale.com/v1';

app.get('/', (req, res) => {
  res.render('index', { player: null, error: null });
});

app.get('/player', async (req, res) => {
  const tag = req.query.tag?.replace('#', '');
  if (!tag) return res.render('index', { player: null, error: "Enter a valid player tag." });

  try {
    const { data } = await axios.get(`${API_BASE}/players/%23${tag}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    res.render('index', { player: data, error: null });
  } catch (error) {
    res.render('index', { player: null, error: 'Player not found or API error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
