const express = require("express");
const multer = require("multer");

const Post = require("../models/Post.js");
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "-" + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
      liked: [],
    });

    post
      .save()
      .then((createdPost) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Creating a post failed!",
        });
      });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    let post;
    const currentPost = await Post.findById(req.params.id);

    post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
      liked: currentPost.liked,
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not Authorized!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Couldn't update post!" });
      });
  }
);

router.get("", (req, res, next) => {
  const pageSize = Number(req.query.pagesize);
  const currentPage = Number(req.query.page);
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed!" });
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      // console.log("yo");
      // console.log("yo");
      // console.log("yo");
      // console.log("yo");
      // console.log(post);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed!" });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed!" });
    });
});

router.put("/like/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const userId = req.userData.userId;
  Post.findById(id)
    .then((post) => {
      post.liked.push(userId);
      post
        .save()
        .then((likedPost) => {
          // console.log(likedPost);
          res.status(201).json({
            message: "Post liked successfully",
            post: {
              ...likedPost,
              id: likedPost._id,
            },
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Liking a post failed!",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed!" });
    });
});

router.put("/unlike/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const userId = req.userData.userId;
  Post.findById(id)
    .then((post) => {
      // const index = post.liked.indexOf(userId);
      post.liked.pull(userId);
      post
        .save()
        .then((likedPost) => {
          // console.log(likedPost);
          res.status(201).json({
            message: "Post liked successfully",
            post: {
              ...likedPost,
              id: likedPost._id,
            },
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Liking a post failed!",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed!" });
    });
});

module.exports = router;
