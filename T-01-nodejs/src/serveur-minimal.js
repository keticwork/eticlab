// Serveur HTTP minimal — sans aucun framework
// Lance avec : node src/serveur-minimal.js
// Puis ouvre : http://localhost:3000

const http = require('http');

const serveur = http.createServer((requete, reponse) => {
  console.log(`Requête reçue : ${requete.method} ${requete.url}`);

  reponse.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  reponse.end(`
    <html>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>Mon premier serveur Node.js</h1>
        <p>Ce serveur tourne sur le port <strong>3000</strong>.</p>
        <p>Il a reçu une requête <strong>${requete.method}</strong>
           sur l'URL <strong>${requete.url}</strong>.</p>
        <p>Heure : ${new Date().toLocaleTimeString()}</p>
      </body>
    </html>
  `);
});

serveur.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
  console.log("Appuie sur Ctrl+C pour arrêter");
});
