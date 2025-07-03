const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Liquidation API is running. Use /api/sol-liquidations to get data.');
});

app.get('/api/sol-liquidations', async (req, res) => {
  try {
    const response = await axios.get('https://open-api.coinglass.com/api/futures/liquidation_chart', {
      headers: {
        coinglassSecret: '3c232344442e4f269a96856cd4268936'
      },
      params: {
        symbol: 'SOL'
      }
    });

    const liquidationData = response.data.data?.UData;

    if (!liquidationData) {
      return res.status(500).json({ error: 'No liquidation data returned' });
    }

    const sorted = liquidationData
      .map(item => ({
        price: item.p,
        amount: item.liqVol
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json(sorted);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch liquidation data from CoinGlass' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
