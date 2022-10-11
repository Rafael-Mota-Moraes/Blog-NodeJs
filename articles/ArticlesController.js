const express = require("express");
const slugify = require("slugify");

const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
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
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => res.redirect("/admin/articles"));
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  const { id } = req.params;
  Article.findByPk(id)
    .then((article) => {
      if (article != null) {
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", {
            categories: categories,
            article: article
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
  const { id, title, body, category } = req.body;

  Article.update(
    {
      title: title,
      body: body,
      categoryId: category,
      slug: slugify(title)
    },
    {
      where: {
        id: id
      }
    }
  )
    .then(() => {
      res.redirect("/admin/articles");
    })
    .catch(() => {
      res.redirect("/");
    });
});

router.get("/articles/page/:num", (req, res) => {
  const { num } = req.params;

  var offset = 0;

  if (isNaN(num) || num == 1) {
    offset = 0;
  } else {
    offset = (parseInt(num) - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "DESC"]]
  }).then((articles) => {
    let next;

    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    const result = {
      page: parseInt(num),
      next: next,
      articles: articles
    };

    Category.findAll().then((categories) => {
      res.render("admin/articles/page", { result, categories });
    });
  });
});

module.exports = router;
