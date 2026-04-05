// Serveur HTTP avec routes — sans framework
// Lance avec : node src/serveur-routes.js
// Puis ouvre : http://localhost:3001

const http = require('http');

const serveur = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Le navigateur demande automatiquement /favicon.ico après chaque page.
  // Sans cette route, la requête tombe dans le else qui appelle writeHead
  // une seconde fois → crash ERR_HTTP_HEADERS_SENT.
  // 204 = "No Content" — on répond sans body ni favicon.
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
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
