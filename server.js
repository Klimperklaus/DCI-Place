const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Für die Datenkomprimierung
app.use(compression());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* 'npm run build' um die Comprimierung anzuwenden
'npx serve dist' den für Lighthouse Leistung optimierten Server aufrufen */