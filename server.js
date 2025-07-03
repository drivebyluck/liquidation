const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all origins (you can restrict this if needed)
app.use(cors());

app.get('/api/liquidations', async (req, res) => {
  try {
    const response = await axios.get('https://open-api.coinglass.com/public/v2/liquidation_chart', {
      headers: {
        'coinglassSecret': '3c232344442e4f269a96856cd4268936'
      },
      params: {
        symbol: 'SOLUSDT',
        interval: '1h'
      }
    });

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Error fetching liquidation data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data from CoinGlass'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
