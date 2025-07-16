const express = require("express");
const fetch = require("node-fetch");

const app = express();

const ALLOWED_ASSETS = ["BTC", "ETH", "USDT", "BNB", "SOL"];

app.get("/:pair", async (req, res) => {
    const pair = req.params.pair.toUpperCase();

    // Validar que el par solo contenga las monedas permitidas
    const isValidPair = ALLOWED_ASSETS.some(asset1 =>
        ALLOWED_ASSETS.some(asset2 => 
            pair === `${asset1}${asset2}`
        )
    );

    if (!isValidPair) {
        return res.status(400).json({ 
            error: `El par ${pair} no está permitido. Solo se aceptan combinaciones entre: ${ALLOWED_ASSETS.join(", ")}` 
        });
    }

    try {
        const resp = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
        const data = await resp.json();

        if (data.price) {
            res.json({ pair: pair, price: data.price });
        } else {
            res.status(400).json({ 
                error: `No se pudo obtener el precio para el par ${pair}`, 
                response: data 
            });
        }
    } catch (e) {
        console.error(`Error al llamar a Binance para el par ${pair}:`, e);
        res.status(500).json({ 
            error: "Error al obtener el precio desde Binance" 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
