const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
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
