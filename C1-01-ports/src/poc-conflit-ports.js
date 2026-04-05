const http = require('http');

// Serveur 1 — démarre normalement
const server1 = http.createServer((req, res) => {
  res.end('Serveur 1 répond');
});

server1.listen(3000, () => {
  console.log('✅ Serveur 1 démarré sur le port 3000');

  // Serveur 2 — va provoquer une erreur EADDRINUSE
  const server2 = http.createServer();
  server2.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('❌ Erreur : le port 3000 est déjà utilisé (EADDRINUSE)');
      console.log('👉 C\'est exactement ce qui se passe quand tu lances deux fois npm run dev');
    }
  });
  server2.listen(3000);
});
