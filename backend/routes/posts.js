const express = require("express");

const Post = require("../models/Post.js");

const router = express.Router();

router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
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

router.get("", (req, res, next) => {
  const posts = Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findOneAndDelete({ _id: id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
