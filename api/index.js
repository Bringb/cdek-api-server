const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Пример запроса к API СДЭК
app.post('/get-delivery-cost', async (req, res) => {
  try {
    const response = await axios.post('https://api.cdek.ru/v2/calculator/tarifflist', req.body, {
      headers: {
        'Authorization': 'Bearer YOUR_CDEK_API_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
