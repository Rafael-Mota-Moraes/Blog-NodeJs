const express = require("express");
const connection = require("./database/database");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

connection
  .authenticate()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch((erro) => console.log(`Ocorreu um erro: ${erro}`));

app.get("/", (req, res) => {
  res.render("index");
});

const porta = 8080;

app.listen(porta, () => {
  console.log(`Servidor está rodando, acesse: http://localhost:${porta}`);
});
