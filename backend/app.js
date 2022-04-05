const express = require("express");
const bodyParser = require("body-parser");

const Post = require("./models/Post.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "jfisaoyu289fq3",
      title: "First server-side-post",
      content: "Yo",
    },
    {
      id: "gadsgadgdas",
      title: "Second server-side-post",
      content: "Yo",
    },
  ];

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

module.exports = app;
