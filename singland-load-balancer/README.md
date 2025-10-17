# Balanceador de Carga Singland (Render)

Este servicio distribuye las peticiones entre los dos backends activos de **Singland**:

- `https://singland-1-j4by.onrender.com`
- `https://singland-1.onrender.com`

Si uno de los servidores falla, el balanceador automáticamente intenta con el siguiente (failover).

---

## 🚀 Despliegue en Render

1. Sube este proyecto a un repositorio de GitHub.
2. Ve a [Render Dashboard](https://dashboard.render.com) → **New Web Service**.
3. Conecta el repositorio.
4. Configura los siguientes parámetros:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
5. Render te dará una URL, por ejemplo:
   ```
   https://singland-balanceador.onrender.com
   ```
6. Usa esa URL en tu frontend (React, Angular, etc.) como tu endpoint API principal.

---

## 🩺 Prueba de estado
Accede a:
```
https://singland-balanceador.onrender.com/_health
```
Debe devolver algo como:
```json
{"status":"ok","backends":2}
```

---

## 💡 Notas
- Si en el futuro agregas más backends, solo edita el array `servers` en `index.js`.
- Puedes ajustar el timeout (5 segundos por defecto).
- Este balanceador puede alojarse gratis en Render.
