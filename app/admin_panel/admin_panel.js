var ObjectID = require('mongodb').ObjectID
var _ = require('lodash')

var mongo = require('../../lib/mongo/');

function Post(p) {
  this.text = p.text;
  this.mention = p.mention;
  this.username = p.username;
  this.image = p.image;
  this.date = new Date();
  this.geolocation = p.geolocation;
  this.hidden = false;
}

//this sets the collection property as a getter, so that every time it gets called it gets reset
Object.defineProperty(Post, 'collection', {
  get: function () {
    return mongo.getDb().collection('posts');
  }
});


Post.prototype.save = function (cb) {
  Post.collection.save(this, cb);
}

Post.dropCollection = function (cb) {
  Post.collection.drop(cb);
};

//test this
Post.delete = function (id, cb) {
  Post.collection.findOneAndUpdate({_id: id}, {$set: { hidden : true}}, {returnOriginal: false}, cb)
}

Post.findById = function (id, cb) {
  Post.collection.findOne({_id: ObjectID(id)}, function (err, post) {
    // cb(err, post);
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

module.exports = Post

function setPrototype(pojo) {
  return _.create(Post.prototype, pojo);
}


Post.findById = function (id, cb) {
  Post.collection.findOne({_id: ObjectID(id)}, function (err, post) {
    // cb(err, post);
    cb(err, setPrototype(post));
  });
};