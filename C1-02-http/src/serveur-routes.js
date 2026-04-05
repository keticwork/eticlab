// Serveur HTTP avec routes — sans framework
// Lance avec : node src/serveur-routes.js
// Puis ouvre : http://localhost:3001

const http = require('http');

const serveur = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (req.url === '/') {
    res.end(`
    <html>
      <body style="font-family:sans-serif;padding:2rem">
        <h1>Accueil</h1>
        <p>Requête reçue sur <strong>/</strong></p>
        <a href="/about">→ Page about</a><br>
        <a href="/api">→ Simuler une API</a>
      </body>
    </html>`);
  } else if (req.url === '/about') {
    res.end(`
    <html>
      <body style="font-family:sans-serif;padding:2rem">
        <h1>About</h1>
        <p>Tu es sur <strong>/about</strong></p>
        <a href="/">← Retour</a>
      </body>
    </html>`);
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Voici une réponse JSON',
      timestamp: new Date().toISOString(),
      port: 3001
    }));
  } else {
    res.writeHead(404);
    res.end(`
    <html>
      <body style="font-family:sans-serif;padding:2rem">
        <h1>404 — Page non trouvée</h1>
        <p>L'URL <strong>${req.url}</strong> n'existe pas.</p>
        <a href="/">← Retour</a>
      </body>
    </html>`);
  }
});

serveur.listen(3001, () => {
  console.log('Serveur démarré sur http://localhost:3001');
  console.log('Test : curl http://localhost:3001/api');
});
