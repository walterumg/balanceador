import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// URLs fijas de tus backends Render
const servers = [
  "https://proyectoback2-lb6u.onrender.com/api",
  "https://proyectofinalweb-v2.onrender.com/api"
];

let current = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de salud
app.get("/_health", (req, res) => {
  res.json({ status: "ok", backends: servers.length });
});

app.use(async (req, res) => {
  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < servers.length && !success) {
    const target = servers[current];
    current = (current + 1) % servers.length;
    attempts++;

    try {
      const response = await axios({
        method: req.method,
        url: target + req.originalUrl,
        data: req.body,
        headers: { ...req.headers, host: undefined },
        timeout: 5000
      });

      if (response.status >= 500) {
        console.warn(`Servidor ${target} devolvió estado ${response.status}. Probando siguiente...`);
        continue;
      }

      res.status(response.status).set(response.headers).send(response.data);
      success = true;
      break;
    } catch (err) {
      console.warn(`Error al conectar con ${target}:`, err.message);
      lastError = err;
    }
  }

  if (!success) {
    res.status(502).json({ error: "Todos los servidores fallaron" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Balanceador escuchando en puerto ${PORT}`);
  console.log("Backends:", servers);
});
