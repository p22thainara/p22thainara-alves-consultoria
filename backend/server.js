const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database'); // Importa o arquivo database.js para SQLite

const app = express(); // Inicializa o Express

// Middlewares
app.use(cors()); // Permite CORS
app.use(express.json()); // Habilita processamento de JSON no corpo da requisição

// Rota para listar todos os usuários (GET)
app.get('/users', (req, res) => {
  db.all('SELECT * FROM user', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar usuários.', error: err });
    } else {
      res.status(200).json(rows); // Retorna os usuários encontrados
    }
  });
});

// Rota para criar um novo usuário (POST)
app.post('/users', (req, res) => {
  const { name, email, password } = req.body; // Dados enviados no corpo da requisição
  db.run(
    'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar usuário.', error: err });
      } else {
        res.status(201).json({
          message: 'Usuário criado com sucesso!',
          id: this.lastID, // Retorna o ID do novo usuário
        });
      }
    }
  );
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
