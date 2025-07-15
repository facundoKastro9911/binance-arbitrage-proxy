const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/btceth", async (req, res) => {
  try {
    const resp = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCETH");
    const data = await resp.json();
    console.log("Respuesta de Binance:", data);

    if (data.price) {
      res.json({ price: data.price });
    } else {
      res.status(500).json({ error: "No se pudo obtener el precio de Binance", response: data });
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
