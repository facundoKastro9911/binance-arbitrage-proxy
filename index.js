const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Lista blanca de pares permitidos
const validPairs = [
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT",
  "BTCUSDC", "ETHUSDC", "BNBUSDC", "SOLUSDC",
  "USDTUSDC"
];

app.get("/:pair", async (req, res) => {
  try {
    const pair = req.params.pair.toUpperCase(); // case insensitive

    if (!validPairs.includes(pair)) {
      return res.status(400).json({
        error: `El par ${pair} no está soportado. Pares válidos: ${validPairs.join(", ")}`
      });
    }

    const resp = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
    const data = await resp.json();

    if (data.price) {
      res.json({
        pair,
        price: data.price,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: `No se pudo obtener el precio para el par ${pair}`,
        response: data
      });
    }
  } catch (e) {
    console.error("Error al llamar a Binance:", e);
    res.status(500).json({ error: "Error fetching Binance price" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
