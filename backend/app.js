const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/Post.js");

const app = express();

mongoose
  .connect(
    "mongodb+srv://qjo:dVrK1wucHFRR4RUQ@cluster0.jdyhb.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection failed");
  });

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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const id = req.params.id;

  const post = new Post({
    _id: id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.findOneAndUpdate({ _id: id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post updated", post: result });
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findOneAndDelete({ _id: id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
