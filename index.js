const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/btceth", async (req, res) => {
  try {
    const resp = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCETH");
    const data = await resp.json();
    res.json({ price: data.price });
  } catch (e) {
    res.status(500).json({ error: "Error fetching Binance price" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
