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
    const response = await axios.get('https://open-api.coinglass.com/public/v2/liquidation_chart', {
      headers: {
        coinglassSecret: '3c232344442e4f269a96856cd4268936'
      },
      params: {
        symbol: 'SOL'
      }
    });

    const liquidationData = response.data.data?.uVol;

    if (!liquidationData || !Array.isArray(liquidationData)) {
      return res.status(500).json({ error: 'No liquidation data returned' });
    }

    const formatted = liquidationData
      .map(item => ({
        price: item.p,
        amount: item.v
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json(formatted);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch liquidation data from CoinGlass' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
