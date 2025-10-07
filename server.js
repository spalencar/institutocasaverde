// server.js (Versão adaptada para Vercel)
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// A Vercel cuida do CORS e dos Headers, mas vamos manter para compatibilidade local
app.use(cors());

// --- Roteamento de API ---

// Rota da API para buscar todos os dados do site
app.get("/api/content", (req, res) => {
  try {
    // Usa `process.cwd()` ou `path.join(__dirname, '..', 'data', 'content.json')`
    // para garantir que o path funcione dentro da Vercel Function
    const dataPath = path.join(path.dirname(require.main.filename), 'data', 'content.json'); 

    // Verifica se o arquivo JSON existe (segurança)
    if (!fs.existsSync(dataPath)) {
      return res
        .status(404)
        .json({ error: "Arquivo de dados não encontrado." });
    }

    const content = fs.readFileSync(dataPath, "utf-8");
    res.json(JSON.parse(content));
  } catch (error) {
    console.error("Erro ao ler content.json:", error);
    res.status(500).json({ error: "Falha ao carregar o conteúdo do site." });
  }
});

// Rota específica para o carrossel (Opcional, mas mantida)
app.get("/api/carrossel", (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), "data", "content.json");
    const content = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.json(content.carrossel);
  } catch (error) {
    res.status(500).json({ error: "Falha ao carregar dados do carrossel." });
  }
});


// --- Roteamento de Arquivos Estáticos (APENAS para Vercel) ---
// Na Vercel, todos os arquivos que NÃO são roteados para uma função (API)
// são tratados como estáticos, então essa parte só precisa rotear o que
// está sendo chamado pelo `vercel.json` para o seu `server.js`.

// Vercel: Exporta o aplicativo Express
module.exports = app;

/* // --- Ambiente de Desenvolvimento Local (Para testar o Node.js na sua máquina) ---
// SE VOCÊ QUISER CONTINUAR RODANDO ESTE ARQUIVO LOCALMENTE COM 'node server.js', 
// VOCÊ DEVE DESCOMENTAR ESTA SEÇÃO.

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n\nServidor API rodando em http://localhost:${PORT}`);
    console.log("Acesse o site em http://localhost:3000/index.html\n");
});

// Nota: Para rodar localmente de forma simples, remova o `module.exports = app;`
// e use a seção de `app.listen()` descomentada. Para Vercel, use o `module.exports`.
*/
