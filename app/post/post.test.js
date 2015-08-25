'use strict';
var expect = require('chai').expect;

var Post = require('./Post');
var mongo = require('../../lib/mongo/');

describe('Post', function () {
  var seededPosts;

  before(function (done) {
    mongo.connect(function () {
      var seedPosts = [
        {text: 'Foo'},
        {text: 'Bar'}
      ];

      Post.collection.insertMany(seedPosts, function (err, result) {
        seededPosts = result.ops;
        done();
      });
    });
  });

  after(function (done) {
    Post.dropCollection(done);
  });

  describe('constructor', function () {
    it('should return a Post object', function () {
      var post = new Post({});

      expect(post).to.be.an.instanceOf(Post);
    });

    it('should return all required fields ', function () {
      var potentialPost = {text: 'foo', content: {text:'foo'}};
      var postAfterConstructer = new Post(potentialPost);

      expect(postAfterConstructer).to.eql({text: 'foo', content: {text:'foo'}});
    });
  });

  describe('findById', function () {
    it('should return a Post object', function (done) {
      var id = seededPosts[0]._id;

      Post.findById(id, function (err, post) {
        expect(post).to.be.an.instanceOf(Post);
        done();
      });
    });

    it('should return the specific post', function (done) {
      var id1 = seededPosts[0]._id;
      var id2 = seededPosts[1]._id;

      Post.findById(id1, function (err, post) {
        expect(post.text).to.equal('Foo');

        Post.findById(id2, function (err, post) {
          expect(post.text).to.equal('Bar');
          done();
        });
      });
    });
  });

  describe('findAll', function () {
    it('should return Post objects', function (done) {
      Post.findAll(function (err, posts) {
        posts.forEach(function (post) {
          expect(post).to.be.an.instanceOf(Post);
        });
        done();
      });
    });
    it('should return all posts', function (done) {
      Post.findAll(function (err, posts) {
        expect(posts).to.deep.equal(seededPosts);
        done();
      });
    });
  });

  describe('.create()', function () {
    it('should add a post to the database', function (done) {
      Post.count(function (err, initialCount) {
        expect(initialCount).to.equal(2);
        Post.create({}, function () {
          Post.count(function (err, newCount) {
            expect(newCount).to.equal(3);
            done();
          });
        });
      });
    });
  });

  describe('.validate()', function () {
    it('should throw an error if more than two words are submited', function () {
      expect(Post.validate.bind(Post, 'kitten assault imminent')).to.throw(Error, /Too many words/);
    });

    it('should throw an error if two words are submitted and neither is a mention', function () {
      expect(Post.validate.bind(Post, 'kitten assault')).to.throw(Error, /You may only have one mention/);
    });
    it('should throw an error if the text is an empty string', function () {
      expect(Post.validate.bind(Post, '')).to.throw(Error);
    });
    it('should throw an error if the text is a string with a lone @', function () {
      expect(Post.validate.bind(Post, 'kitten @')).to.throw(Error);
      expect(Post.validate.bind(Post, '@')).to.throw(Error);
    });
    it('should throw an error with two mentions', function () {
      expect(Post.validate.bind(Post, '@kitten @assault')).to.throw(Error);
    });
  });

  describe('.parse()', function () {
    var parseObject = Post.parse('kitten @assault');
    it('should return an object with two keys', function () {
      var keyNumber = Object.keys(parseObject).length;
      expect(typeof parseObject).to.equal('object');
      expect(keyNumber).to.equal(2);
    });
    it('should sort mentions into the mention key', function () {
      expect(parseObject.mention).to.equal('@assault');
    });
    it('should put the whole text under the text key', function () {
      expect(parseObject.text).to.equal('kitten @assault');
    });
  });
});
