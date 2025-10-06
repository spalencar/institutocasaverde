// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // Porta do nosso servidor API

// Middleware para permitir requisições de origens diferentes (CORS)
app.use(cors());

// Serve arquivos estáticos do frontend (necessário para o HTML/CSS/JS)
app.use(express.static(path.join(__dirname, ''))); 

// Serve os arquivos da pasta 'imagens' diretamente
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

// Rota da API para buscar todos os dados do site
app.get('/api/content', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data', 'content.json');
        const content = fs.readFileSync(dataPath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error("Erro ao ler content.json:", error);
        res.status(500).json({ error: 'Falha ao carregar o conteúdo do site.' });
    }
});

// Rota específica para o carrossel (opcional, mas bom para organização)
app.get('/api/carrossel', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data', 'content.json');
        const content = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        res.json(content.carrossel);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao carregar dados do carrossel.' });
    }
});


app.listen(PORT, () => {
    console.log(`\n\nServidor API rodando em http://localhost:${PORT}`);
    console.log("Acesse o site em http://localhost:3000/index.html\n");
});