const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const COINGLASS_API_KEY = '3c232344442e4f269a96856cd4268936';

app.use(cors());

app.get('/api/sol-liquidations', async (req, res) => {
  try {
    const response = await axios.get('https://open-api.coinglass.com/api/futures/liquidation_chart', {
      headers: {
        'coinglassSecret': COINGLASS_API_KEY
      },
      params: {
        symbol: 'SOL'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching liquidation data:', err.message);
    res.status(500).json({ error: 'Failed to fetch liquidation data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
