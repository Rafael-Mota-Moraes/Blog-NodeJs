const express = require("express");
const session = require("express-session");

const connection = require("./database/database");

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UsersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

const app = express();

app.set("view engine", "ejs");

app.use(
  session({
    secret: "dfuiosdhufhudiohuj0=pfgkdsiojoijmfsdikoj",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

connection
  .authenticate()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch((erro) => console.log(`Ocorreu um erro: ${erro}`));

app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

app.get("/session", (req, res) => {
  req.session.user = {
    username: "Rafael",
    email: "teste@teste.com.br",
    id: 1
  };

  res.send("Sessão gerada!");
});

app.get("/leitura", (req, res) => {
  res.json({
    user: req.session.user
  });
});

app.get("/", (req, res) => {
  Article.findAll({ order: [["id", "DESC"]], limit: 4 }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles, categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;

  Article.findOne({ where: { slug: slug } })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => res.redirect("/"));
});

app.get("/category/:slug", (req, res) => {
  const { slug } = req.params;

  Category.findOne({
    where: {
      slug: slug
    },
    include: [
      {
        model: Article
      }
    ]
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories: categories
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => res.redirect("/"));
});

const porta = 8080;

app.listen(porta, () => {
  console.log(`Servidor está rodando, acesse: http://localhost:${porta}`);
});
