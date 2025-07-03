app.get('/api/sol-liquidations', async (req, res) => {
  try {
    const response = await axios.get(
      'https://open-api.coinglass.com/api/futures/liquidation_price_distribution_chart',
      {
        headers: {
          coinglassSecret: '3c232344442e4f269a96856cd4268936'
        },
        params: {
          symbol: 'SOL',
          interval: '50' // price interval bucket (try 10, 25, 50, etc)
        }
      }
    );

    const bands = response.data?.data?.list;

    if (!bands || bands.length === 0) {
      return res.status(500).json({ error: 'No liquidation data returned' });
    }

    const sorted = bands
      .map(b => ({ price: b.price, amount: b.totalVol }))
      .sort((a, b) => b.amount - a.amount);

    res.json(sorted);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch liquidation data from CoinGlass' });
  }
});
