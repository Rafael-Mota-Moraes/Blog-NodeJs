const express = require("express");
const slugify = require("slugify");

const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");

router.get("/articles", (req, res) => {
  res.send("Rota de artigos");
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", (req, res) => {
  const { title, body, category } = req.body;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  });
});

module.exports = router;
