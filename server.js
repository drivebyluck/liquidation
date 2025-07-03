const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Liquidation API is running. Use /api/sol-liquidations to get data.');
});

app.get('/api/sol-liquidations', async (req, res) => {
  try {
    const response = await axios.get('https://open-api.coinglass.com/api/pro/v1/futures/liquidation_chart', {
      headers: {
        coinglassSecret: '3c232344442e4f269a96856cd4268936'
      },
      params: {
        symbol: 'SOL',
        time_type: 'hour' // optional, try 'hour' or 'day'
      }
    });

    const rawData = response.data?.data?.uVol || [];

    if (!rawData.length) {
      return res.status(500).json({ error: 'No liquidation data returned' });
    }

    const formatted = rawData.map(entry => ({
      price: entry.p,
      amount: entry.v
    })).sort((a, b) => b.amount - a.amount);

    res.json(formatted);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch liquidation data from CoinGlass' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
