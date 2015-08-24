'use strict';

var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var mongo = require('../../lib/mongo/');

function Post(p) {
  this.text = p.text;
}

Object.defineProperty(Post, 'collection', {
  get: function () {
    return mongo.getDb().collection('posts');
  }
});

Post.count = function (cb) {
  return Post.collection.count(cb);
};

Post.create = function (post, cb) {
  Post.collection.insertOne(post, cb);
};

Post.dropCollection = function (cb) {
  Post.collection.drop(cb);
};

Post.findById = function (id, cb) {
  Post.collection.findOne({_id: ObjectID(id)}, function (err, post) {
    cb(err, setPrototype(post));
  });
};

Post.findAll = function (cb) {
  Post.collection.find().toArray(function (err, posts) {
    var prototypedPosts = posts.map(function (post) {
      return setPrototype(post);
    });

    cb(err, prototypedPosts);
  });
};

Post.validate = function (post, cb) {
  req.body.text = req.body.text.trim();
  var postArray = req.body.text.split(" ");
  if (postArray[0] === ""){
    throw new Error('Post must contain at least one character')
  } else if (postArray.length > 2) {
    throw new Error('Too many words')
  } else if (postArray[0] === "@" || postArray[1] === "@"){
    throw new Error('@ symbol must be followed by a username to mention correctly')
  } else if (postArray[0][0] === "@" && postArray[1][0] === "@"){
    throw new Error('You may only have one mention')
  } else if (postArray[0][0] !== "@" && postArray[1][0] !== "@"){
    throw new Error('You may only have one mention')
  }
}

module.exports = Post;

function setPrototype(pojo) {
  return _.create(Post.prototype, pojo);
}
