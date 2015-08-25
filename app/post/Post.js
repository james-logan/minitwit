'use strict';

var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var mongo = require('../../lib/mongo/');

function Post(p) {
  this.text = p.text;
  this.content = p.content;
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
  var constructedPost = new Post(post);
  Post.collection.insertOne(constructedPost, cb);
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

Post.parse = function (text) {
  var array = Post.validate(text);
  var mention = (array[0][0] === '@')? array[0] : array[1];
  return {
    mention: mention,
    text: text
  };
};

Post.validate = function (post) {
  var postArray = post.trim().split(' ');
  if (postArray[0] === ''){
    throw new Error('Post must contain at least one character');
  } else if (postArray.length > 2) {
    throw new Error('Too many words');
  } else if (postArray[0] === '@' || postArray[1] === '@'){
    throw new Error('@ symbol must be followed by a username to mention correctly');
  }

  if (postArray[1]) {
    if (postArray[0][0] === '@' && postArray[1][0] === '@'){
      throw new Error('You may only have one mention');
    } else if (postArray[0][0] !== '@' && postArray[1][0] !== '@'){
      throw new Error('You may only have one mention');
    }
  }

  return postArray;
};

module.exports = Post;

function setPrototype(pojo) {
  return _.create(Post.prototype, pojo);
}
