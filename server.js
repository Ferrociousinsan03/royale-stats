require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = 'https://api.clashroyale.com/v1';

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home page route
app.get('/', (req, res) => {
  res.render('index', {
    player: null,
    error: null,
    cardLevels: null
  });
});

// Player lookup route
app.get('/player', async (req, res) => {
  const tag = req.query.tag?.replace('#', '');
  if (!tag) {
    return res.render('index', {
      player: null,
      error: "Enter a valid player tag.",
      cardLevels: null
    });
  }

  try {
    const response = await axios.get(`${API_BASE}/players/%23${tag}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    const playerData = response.data;

    // Count number of cards by level
    const cardLevels = {};
    if (playerData.cards) {
      playerData.cards.forEach(card => {
        const level = card.level;
        cardLevels[level] = (cardLevels[level] || 0) + 1;
      });
    }

    res.render('index', {
      player: playerData,
      error: null,
      cardLevels
    });

  } catch (err) {
    res.render('index', {
      player: null,
      error: "Player not found or API error.",
      cardLevels: null
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
